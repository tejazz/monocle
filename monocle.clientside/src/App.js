import React from 'react';
import clientSocket from 'socket.io-client';
import Countries from './utils/constants/countries';
import * as FileSaver from 'file-saver';
import * as xlsx from 'xlsx';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import Dashboard from './pages/dashboard/dashboard';
import { mapGeneralCaseTweets, mapSentimentBasedTweets } from './utils/functions/general';

// TODO: Remove direct URL to include dynamic server URL
const socket = clientSocket('http://localhost:9890');

const InitialState = () => {
  return {
    tweetCount: 0,
    positiveTweetCount: 0,
    negativeTweetCount: 0,
    neutralTweetCount: 0,
    startCounter: 0,
    verifiedLocationTweetCount: 0,
    unverifiedLocationTweetCount: 0,
    locations: {},
    tweetBuffer: {},
    displayGeneralTweet: [],
    displayPositiveTweet: [],
    displayNegativeTweet: [],
    displayNeutralTweet: [],
    displayVerifiedTweet: [],
    displayUnverifiedTweet: [],
    hoverCountryStatus: {},
    searchTerm: 'Coronavirus',
    trend: [],
  };
}

class App extends React.PureComponent {
  constructor(props) {
    super(props);

    this.state = InitialState();
  }

  beforeReload = e => {
    socket.emit('force stop stream', () => { });

    e.preventDefault();
    e.returnValue = '';
  }

  componentDidMount = () => {
    window.addEventListener("beforeunload", this.beforeReload);
    socket.on('latest tweets', this.mapIncomingStream);
  }

  componentWillUnmount = () => {
    window.removeEventListener("beforeunload", this.beforeReload);
  }

  exportToExcel = (rawData, filename) => {
    const fileType = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
    const fileExtension = '.xlsx';

    const ws = xlsx.utils.json_to_sheet(rawData);
    const wb = { Sheets: { 'data': ws }, SheetNames: ['data'] };
    const excelBuffer = xlsx.write(wb, { bookType: 'xlsx', type: 'array' });
    const data = new Blob([excelBuffer], { type: fileType });
    FileSaver.saveAs(data, filename + fileExtension);
  }

  mapIncomingStream = (tweet) => {
    let { tweetBuffer, tweetCount, positiveTweetCount, negativeTweetCount, neutralTweetCount, locations, verifiedLocationTweetCount, unverifiedLocationTweetCount, displayGeneralTweet, displayPositiveTweet, displayNegativeTweet, displayNeutralTweet, displayVerifiedTweet, displayUnverifiedTweet, searchTerm, trend } = this.state;
    let tempTweetBuffer = {};
    let tempDisplayGeneralTweet = [];

    // initialize with current state values 
    let tempDisplayPositiveTweet = displayPositiveTweet;
    let tempDisplayNegativeTweet = displayNegativeTweet;
    let tempDisplayNeutralTweet = displayNeutralTweet;
    let tempLocations = locations;
    let tempVerifiedLocationTweetCount = verifiedLocationTweetCount;
    let tempUnverifiedLocationTweetCount = unverifiedLocationTweetCount;
    let tempDisplayVerifiedTweet = displayVerifiedTweet;
    let tempDisplayUnverifiedTweet = displayUnverifiedTweet;

    let tempTweetBufferKeys = Object.keys(tweetBuffer);

    tweetCount += 1;

    if (tempTweetBufferKeys.length >= 10000) {
      // reinitialize tempTweetBuffer to empty
      // save all the tweets in the buffer
      this.exportToExcel(tweetBuffer, `${searchTerm}-${tweet.timestamp}`);

      tempTweetBuffer = {};
      tempTweetBuffer[tweet.id] = tweet;
    } else {
      if (tempTweetBuffer[tweet.id] === undefined) tempTweetBuffer[tweet.id] = tweet;
    }

    // mapping top trending tweets
    tempTweetBufferKeys.sort((a, b) => { return tempTweetBuffer[b].followers - tempTweetBuffer[a].followers; });

    // check for verified location in tweet
    Countries.map((country) => {
      if (tweet.location && tweet.location.includes(country)) {
        if (tempDisplayVerifiedTweet.findIndex(el => el.id === tweet.id) === -1) {
          tempDisplayVerifiedTweet.push(tweet);
        }

        tempDisplayVerifiedTweet.sort((a, b) => b.followers - a.followers);

        if (tempDisplayVerifiedTweet.length >= 20) {
          tempDisplayVerifiedTweet = tempDisplayVerifiedTweet.slice(0, 20);
        }

        tempLocations[country] = locations[country] ? locations[country] + 1 : 1;
        tempVerifiedLocationTweetCount += 1;
      }
    });

    if (tempVerifiedLocationTweetCount !== verifiedLocationTweetCount) {
      tempUnverifiedLocationTweetCount += 1;
      if (tempDisplayUnverifiedTweet.findIndex(el => el.id === tweet.id) === -1) {
        tempDisplayUnverifiedTweet.push(tweet);
      }

      if (tempDisplayUnverifiedTweet.length >= 20) {
        tempDisplayUnverifiedTweet = tempDisplayUnverifiedTweet.sort((a, b) => b.followers - a.followers).slice(0, 20);
      }
    }

    // map general tweets
    tempDisplayGeneralTweet = mapGeneralCaseTweets(tweet, displayGeneralTweet, Object.values(tempTweetBuffer));

    // map tweets based on sentiment score
    if (tweet.sentiments.score > 0) {
      tempDisplayPositiveTweet = mapSentimentBasedTweets(tweet, displayPositiveTweet, tempDisplayPositiveTweet);
      positiveTweetCount += 1;
    } else if (tweet.sentiments.score < 0) {
      tempDisplayNegativeTweet = mapSentimentBasedTweets(tweet, displayNegativeTweet, tempDisplayNegativeTweet);
      negativeTweetCount += 1;
    } else {
      tempDisplayNeutralTweet = mapSentimentBasedTweets(tweet, displayNeutralTweet, tempDisplayNeutralTweet);
      neutralTweetCount += 1;
    }

    // get the trend statistics
    let trendPoint = {
      positive: Math.round((positiveTweetCount/tweetCount) * 100),
      negative: Math.round((negativeTweetCount/tweetCount) * 100),
      neutral: Math.round((neutralTweetCount/tweetCount) * 100),
      timestamp: Date.now(),
    };

    trend.push(trendPoint);

    this.setState({
      tweetCount,
      positiveTweetCount,
      negativeTweetCount,
      neutralTweetCount,
      displayGeneralTweet: tempDisplayGeneralTweet,
      displayPositiveTweet: tempDisplayPositiveTweet,
      displayNegativeTweet: tempDisplayNegativeTweet,
      displayNeutralTweet: tempDisplayNeutralTweet,
      tweetBuffer: tempTweetBuffer,
      locations: tempLocations,
      verifiedLocationTweetCount: tempVerifiedLocationTweetCount,
      unverifiedLocationTweetCount: tempUnverifiedLocationTweetCount,
      displayVerifiedTweet: tempDisplayVerifiedTweet,
      displayUnverifiedTweet: tempDisplayUnverifiedTweet,
      trend,
    });
  }

  startStreaming = () => {
    socket.emit((this.state.startCounter >= 1) ? 'restart stream' : 'start stream', () => { });
  }

  stopStreaming = () => {
    socket.emit('stop stream', () => { });
  }

  handleCountryHover = (hoverCountryStatus) => {
    this.setState({ hoverCountryStatus });
  }

  resetStateSearchTerm = async (searchTerm) => {
    // if (!socket.connected) {
    //   alert('No connection available. Please check the connection.');
    //   return;
    // }

    await this.setState({ ...InitialState(), searchTerm });
    socket.emit('update track', searchTerm);
  }

  render() {
    const { tweetCount, positiveTweetCount, negativeTweetCount, neutralTweetCount, locations, verifiedLocationTweetCount, unverifiedLocationTweetCount, displayGeneralTweet, displayPositiveTweet, displayNegativeTweet, displayNeutralTweet, displayVerifiedTweet, displayUnverifiedTweet, hoverCountryStatus, searchTerm, trend } = this.state;

    const verifiedPercent = (verifiedLocationTweetCount === 0 || tweetCount === 0) ? 0 : Math.round(((verifiedLocationTweetCount / tweetCount) * 100 + Number.EPSILON) * 100) / 100;

    return (
      <div>
        <Router>
          <Switch>
            <Route exact path='/' render={(props) =>
              <Dashboard
                {...props}
                startStreaming={this.startStreaming}
                stopStreaming={this.stopStreaming}
                tweetCount={tweetCount}
                positiveTweetCount={positiveTweetCount}
                negativeTweetCount={negativeTweetCount}
                neutralTweetCount={neutralTweetCount}
                locations={locations}
                verifiedLocationTweetCount={verifiedLocationTweetCount}
                unverifiedLocationTweetCount={unverifiedLocationTweetCount}
                displayGeneralTweet={displayGeneralTweet}
                displayPositiveTweet={displayPositiveTweet}
                displayNegativeTweet={displayNegativeTweet}
                displayNeutralTweet={displayNeutralTweet}
                displayVerifiedTweet={displayVerifiedTweet}
                displayUnverifiedTweet={displayUnverifiedTweet}
                handleCountryHover={this.handleCountryHover}
                hoverCountryStatus={hoverCountryStatus}
                searchTerm={searchTerm}
                isConnected={socket.connected}
                resetStateSearchTerm={this.resetStateSearchTerm}
                verifiedPercent={verifiedPercent}
                trend={trend}
              />} />
          </Switch>
        </Router>
      </div>
    );
  }
}

export default App;

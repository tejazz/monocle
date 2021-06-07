import React from 'react';
import clientSocket from 'socket.io-client';
import Countries from './utils/constants/countries';
import * as FileSaver from 'file-saver';
import * as xlsx from 'xlsx';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import Dashboard from './pages/dashboard/dashboard';

const socket = clientSocket('http://localhost:9890');

const InitialState = {
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
  searchTerm: '',
};

class App extends React.PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      ...InitialState,
      searchTerm: 'Coronavirus',
    };
  }

  beforeReload = e => { 
    socket.emit('force stop stream', () => {});

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
    let { tweetBuffer, tweetCount, positiveTweetCount, negativeTweetCount, neutralTweetCount, locations, verifiedLocationTweetCount, unverifiedLocationTweetCount, displayGeneralTweet, displayPositiveTweet, displayNegativeTweet, displayNeutralTweet, displayVerifiedTweet, displayUnverifiedTweet, searchTerm } = this.state;
    let tempTweetBuffer = {};
    let tempDisplayGeneralTweet = [];
    let tempDisplayPositiveTweet = displayPositiveTweet;
    let tempDisplayNegativeTweet = displayNegativeTweet;
    let tempDisplayNeutralTweet = displayNeutralTweet;
    let tempLocations = locations;
    let tempVerifiedLocationTweetCount = verifiedLocationTweetCount;
    let tempUnverifiedLocationTweetCount = unverifiedLocationTweetCount;
    let tempDisplayVerifiedTweet = displayVerifiedTweet;
    let tempDisplayUnverifiedTweet = displayUnverifiedTweet;

    let tempTweetBufferKeys = Object.keys(tweetBuffer);

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
        tempVerifiedLocationTweetCount += 1;
        if (tempDisplayVerifiedTweet.findIndex(el => el.id === tweet.id) === -1) {
          tempDisplayVerifiedTweet.push(tweet);
        }

        tempDisplayVerifiedTweet.sort((a, b) => b.followers - a.followers);

        if (tempDisplayVerifiedTweet.length >= 20) {
          tempDisplayVerifiedTweet = tempDisplayVerifiedTweet.slice(0, 20);
        }

        return locations[country] ? tempLocations[country] = locations[country] + 1 : tempLocations[country] = 1;
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

    // map general and sentiment based tweets into segmented arrays of size: 20
    if (displayGeneralTweet.length > 0) {
      tempDisplayGeneralTweet = displayGeneralTweet.findIndex(el => el.id === tweet.id) === -1 ? displayGeneralTweet.concat(tweet) : displayGeneralTweet;
      tempDisplayGeneralTweet.sort((a, b) => { return b.followers - a.followers; });

      tempDisplayGeneralTweet = tempDisplayGeneralTweet.slice(0, 20);
    } else {
      tempDisplayGeneralTweet = Object.values(tempTweetBuffer).slice(0, 20);
    }

    if (tweet.sentiments.score > 0) {
      // map positive sentiment tweets
      if (displayPositiveTweet.length >= 20) {
        tempDisplayPositiveTweet = tempDisplayPositiveTweet.concat(tweet);
        tempDisplayPositiveTweet.sort((a, b) => { return b.followers - a.followers; });

        tempDisplayPositiveTweet = tempDisplayPositiveTweet.slice(0, 20);
      } else {
        tempDisplayPositiveTweet = tempDisplayPositiveTweet.findIndex(el => el.id === tweet.id) === -1 ? tempDisplayPositiveTweet.concat(tweet) : tempDisplayPositiveTweet;
        tempDisplayPositiveTweet.sort((a, b) => { return b.followers - a.followers; });
      }
    } else if (tweet.sentiments.score < 0) {
      // map negative sentiment tweets
      if (displayNegativeTweet.length >= 20) {
        tempDisplayNegativeTweet = tempDisplayNegativeTweet.findIndex(el => el.id === tweet.id) === -1 ? tempDisplayNegativeTweet.concat(tweet) : tempDisplayNegativeTweet;
        tempDisplayNegativeTweet.sort((a, b) => { return b.followers - a.followers; });

        tempDisplayNegativeTweet = tempDisplayNegativeTweet.slice(0, 20);
      } else {
        tempDisplayNegativeTweet = tempDisplayNegativeTweet.findIndex(el => el.id === tweet.id) === -1 ? tempDisplayNegativeTweet.concat(tweet) : tempDisplayNegativeTweet;
        tempDisplayNegativeTweet.sort((a, b) => { return b.followers - a.followers; });
      }
    } else {
      // map neutral sentiment tweets
      if (displayNeutralTweet.length >= 20) {
        tempDisplayNeutralTweet = tempDisplayNeutralTweet.findIndex(el => el.id === tweet.id) === -1 ? tempDisplayNeutralTweet.concat(tweet) : tempDisplayNeutralTweet;
        tempDisplayNeutralTweet.sort((a, b) => { return b.followers - a.followers; });

        tempDisplayNeutralTweet = tempDisplayNeutralTweet.slice(0, 20);
      } else {
        tempDisplayNeutralTweet = tempDisplayNeutralTweet.findIndex(el => el.id === tweet.id) === -1 ? tempDisplayNeutralTweet.concat(tweet) : tempDisplayNeutralTweet;
        tempDisplayNeutralTweet.sort((a, b) => { return b.followers - a.followers; });
      }
    }

    this.setState({
      tweetCount: tweetCount + 1,
      positiveTweetCount: (tweet.sentiments.score > 0) ? positiveTweetCount + 1 : positiveTweetCount,
      negativeTweetCount: (tweet.sentiments.score < 0) ? negativeTweetCount + 1 : negativeTweetCount,
      neutralTweetCount: (tweet.sentiments.score === 0) ? neutralTweetCount + 1 : neutralTweetCount,
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
    });
  }

  startStreaming = () => {
    if (!socket.connected) {
      alert('No connection available. Please check the connection.');
      return;
    }

    socket.emit((this.state.startCounter >= 1) ? 'restart stream' : 'start stream', () => { });
  }

  stopStreaming = () => {
    if (!socket.connected) {
      alert('No connection available. Please check the connection.');
      return;
    }

    socket.emit('stop stream', () => { });
  }

  handleCountryHover = (hoverCountryStatus) => {
    this.setState({ hoverCountryStatus });
  }

  resetStateSearchTerm = (searchTerm) => {
    if (!socket.connected) {
      alert('No connection available. Please check the connection.');
      return;
    }

    this.setState({
      ...InitialState,
      searchTerm,
    }, () => {
      socket.emit('update track', searchTerm);
    });
  }

  render() {
    const { tweetCount, positiveTweetCount, negativeTweetCount, neutralTweetCount, locations, verifiedLocationTweetCount, unverifiedLocationTweetCount, displayGeneralTweet, displayPositiveTweet, displayNegativeTweet, displayNeutralTweet, displayVerifiedTweet, displayUnverifiedTweet, hoverCountryStatus, searchTerm } = this.state;

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
              />} />
          </Switch>
        </Router>
      </div>
    );
  }
}

export default App;

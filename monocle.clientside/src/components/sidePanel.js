import React from 'react';
import './sidePanel.scss';
import DetailIcon from '../assets/images/details-icon.svg';
import KeywordIcon from '../assets/images/keyword-icon.svg';
import TweetObject from './tweetObject';
import { getSortedObject } from '../utils/functions/general';
import TrendGraph from './TrendGraph/trendGraph';

class SidePanel extends React.PureComponent {
    constructor(props) {
        super(props);

        this.state = {
            openSidePanel: false,
            tweetType: 'general',           // [general, positive, negative, neutral, verified]
            sidePanelSegment: '',           // [tweet, keyword, trend]
            secondaryType: 'keyword',       // [keyword, location]
        };
    }

    toggleSidePanel = (sidePanelSegment) => {
        const sidePanelStatus = (sidePanelSegment === this.state.sidePanelSegment && this.state.openSidePanel) ? false : true;

        this.props.handleOverlayChange(sidePanelStatus);

        this.setState({ openSidePanel: sidePanelStatus, sidePanelSegment });
    }

    renderTagItem = (sidePanelSegment, tweetType, label) => {
        return (
            <div
                className={tweetType === label ? 'TweetTagItem TweetTagItem--Active' : 'TweetTagItem'}
                onClick={() => tweetType !== label ? ((sidePanelSegment === 'tweet') ? this.setState({ tweetType: label }) : this.setState({ secondaryType: label })) : null}
            >
                <p className='TweetTagItem__Label'>{label}</p>
            </div>
        );
    }

    renderPanel = (finalDisplayTweets) => {
        const { sidePanelSegment, tweetType, secondaryType } = this.state;

        if (sidePanelSegment === 'tweet') {
            return (
                <>
                    <div className='TweetTag'>
                        {this.renderTagItem('tweet', tweetType, 'general')}
                        {this.renderTagItem('tweet', tweetType, 'positive')}
                        {this.renderTagItem('tweet', tweetType, 'negative')}
                        {this.renderTagItem('tweet', tweetType, 'neutral')}
                        {this.renderTagItem('tweet', tweetType, 'verified')}
                    </div>

                    <div className='TweetSection'>
                        {finalDisplayTweets.map((tweet) => <TweetObject key={tweet.id} tweet={tweet} />)}
                    </div>
                </>
            );
        } else if (sidePanelSegment === 'keyword') {
            return (
                <>
                    <div className='TweetTag'>
                        {this.renderTagItem('keyword', secondaryType, 'keyword')}
                        {this.renderTagItem('keyword', secondaryType, 'location')}
                    </div>

                    <div className='TweetSection'>
                        {this.renderSecondarySection(secondaryType)}
                    </div>
                </>
            );
        } else if (sidePanelSegment === 'trend') {
            return <TrendGraph data={this.props.trend} />
        }
    }

    renderSecondarySection = (secondaryType) => {
        // map the words based on sentiment
        // 1. positive words
        let positiveWords = [];

        this.props.displayPositiveTweet.map((tweet) => {
            positiveWords = positiveWords.concat(tweet.sentiments.positive);
        });

        positiveWords = [...new Set(positiveWords)];

        // 2. negative words
        let negativeWords = [];

        this.props.displayNegativeTweet.map((tweet) => {
            negativeWords = negativeWords.concat(tweet.sentiments.negative);
        });

        negativeWords = [...new Set(negativeWords)];

        if (secondaryType === 'keyword') {
            return (
                <div className='KeywordSection'>
                    <div className='KeywordTab'>
                        <p className='KeywordTab__Caption'>Positive Words</p>
                        <div className='KeywordTab__WordWrap'>
                            {positiveWords.map((word) => <p className='KeywordTab__Word KeywordTab__Word--Positive'>{word}</p>)}
                        </div>
                    </div>

                    <div className='KeywordTab'>
                        <p className='KeywordTab__Caption'>Negative Words</p>
                        <div className='KeywordTab__WordWrap'>
                            {negativeWords.map((word) => <p className='KeywordTab__Word KeywordTab__Word--Negative'>{word}</p>)}
                        </div>
                    </div>
                </div>
            );
        } else {
            const locations = getSortedObject(this.props.locations);
            const locationKeys = Object.keys(locations);

            return (
                <div className='LocationSection'>
                    {locationKeys.map((location) => {
                        return (
                            <div className='LocationSection__Tab'>
                                <p className='LocationSection__Country'>{location}:</p>
                                <p className='LocationSection__Count'>{locations[location]}</p>
                            </div>
                        );
                    })}
                </div>
            );
        }
    }

    getCurrentSidePanelIconClass = (isSelected, sidePanelSegment) => {
        let isActive = isSelected === sidePanelSegment;
        let inactiveClass = 'SidePanel__Icon';
        let activeClass = `${inactiveClass} SidePanel__Icon--Active`;

        switch(sidePanelSegment) {
            case 'tweet': return isActive  ? activeClass : inactiveClass;
            case 'keyword': return isActive ? `${activeClass} SidePanel__Icon--Keyword` : `${inactiveClass} SidePanel__Icon--Keyword`;
            case 'trend': return isActive ? `${activeClass} SidePanel__Icon--Trend` : `${inactiveClass} SidePanel__Icon--Trend`;
            default: return isActive  ? activeClass : inactiveClass;
        }
    }

    render() {
        const { tweetType, openSidePanel, sidePanelSegment } = this.state;

        const SidePanelClass = openSidePanel ? 'SidePanel' : 'SidePanel SidePanel--Hide';

        let finalDisplayTweets = [];

        if (tweetType === 'general') {
            finalDisplayTweets = this.props.displayGeneralTweet;
        } else if (tweetType === 'positive') {
            finalDisplayTweets = this.props.displayPositiveTweet;
        } else if (tweetType === 'negative') {
            finalDisplayTweets = this.props.displayNegativeTweet;
        } else if (tweetType === 'neutral') {
            finalDisplayTweets = this.props.displayNeutralTweet;
        } else {
            finalDisplayTweets = this.props.displayVerifiedTweet;
        }

        return (
            <div className={SidePanelClass}>
                <img
                    src={DetailIcon}
                    alt='detail-icon'
                    className={this.getCurrentSidePanelIconClass(sidePanelSegment, 'tweet')}
                    onClick={() => this.toggleSidePanel('tweet')}
                />
                <img
                    src={KeywordIcon}
                    alt='keywordIcon-icon'
                    className={this.getCurrentSidePanelIconClass(sidePanelSegment, 'keyword')}
                    onClick={() => this.toggleSidePanel('keyword')}
                />
                <img
                    src={KeywordIcon}
                    alt='tweetIcon-icon'
                    className={this.getCurrentSidePanelIconClass(sidePanelSegment, 'trend')}
                    onClick={() => this.toggleSidePanel('trend')}
                />

                {this.renderPanel(finalDisplayTweets)}
            </div>
        );
    }
}

export default SidePanel;

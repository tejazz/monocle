import React, { useState } from 'react';
import './sidePanel.scss';
import DetailIcon from '../../assets/images/details-icon.svg';
import KeywordIcon from '../../assets/images/keyword-icon.svg';
import TweetObject from '../TweetObject/tweetObject';
import { getSortedObject } from '../../utils/functions/general';
import TrendGraph from '../TrendGraph/trendGraph';

/*
    tweetType: [general, positive, negative, neutral, verified],
    sidePanelSegment: [tweet, keyword, trend],
    secondaryType: [keyword, location]
*/

const SidePanel = (props) => {
    const [sidePanelItems, toggleSidePanel] = useState({ openSidePanel: false, sidePanelSegment: '' });
    const [displayTypes, updateDisplayTypes] = useState({ tweetType: 'general', secondaryType: 'keyword' });

    const callToggleSidePanel = (sidePanelSegment) => {
        const sidePanelStatus = (sidePanelSegment === sidePanelItems.sidePanelSegment && sidePanelItems.openSidePanel) ? false : true;

        props.handleOverlayChange(sidePanelStatus);

        toggleSidePanel({ openSidePanel: sidePanelStatus, sidePanelSegment });
    }

    const renderTagItem = (sidePanelSegment, tweetType, label) => {
        return (
            <div
                className={tweetType === label || displayTypes.secondaryType === label ? 'TweetTagItem TweetTagItem--Active' : 'TweetTagItem'}
                onClick={() => tweetType !== label ? ((sidePanelSegment === 'tweet') ? updateDisplayTypes(currentState => ({ ...currentState, tweetType: label })) : updateDisplayTypes(currentState => ({ ...currentState, secondaryType: label }))) : null}
            >
                <p className='TweetTagItem__Label'>{label}</p>
            </div>
        );
    }

    const renderPanel = (finalDisplayTweets) => {
        const { sidePanelSegment } = sidePanelItems;
        const { tweetType, secondaryType } = displayTypes;

        if (sidePanelSegment === 'tweet') {
            return (
                <>
                    <div className='TweetTag'>
                        {renderTagItem('tweet', tweetType, 'general')}
                        {renderTagItem('tweet', tweetType, 'positive')}
                        {renderTagItem('tweet', tweetType, 'negative')}
                        {renderTagItem('tweet', tweetType, 'neutral')}
                        {renderTagItem('tweet', tweetType, 'verified')}
                    </div>

                    <div className='TweetSection'>
                        {finalDisplayTweets.length === 0
                            ? <p className='EmptyCaption'>No {tweetType} Tweets To Show</p>
                            : finalDisplayTweets.map((tweet) => <TweetObject key={tweet.id} tweet={tweet} />)}
                    </div>
                </>
            );
        } else if (sidePanelSegment === 'keyword') {
            return (
                <>
                    <div className='TweetTag'>
                        {renderTagItem('keyword', secondaryType, 'keyword')}
                        {renderTagItem('keyword', secondaryType, 'location')}
                    </div>

                    <div className='TweetSection'>
                        {renderSecondarySection(secondaryType)}
                    </div>
                </>
            );
        } else if (sidePanelSegment === 'trend') {
            return <TrendGraph data={props.trend} searchTerm={props.searchTerm} />
        }
    }

    const renderSecondarySection = (secondaryType) => {
        // map the words based on sentiment
        // 1. positive words
        let positiveWords = [];

        props.displayPositiveTweet.map((tweet) => {
            positiveWords = positiveWords.concat(tweet.sentiments.positive);
        });

        positiveWords = [...new Set(positiveWords)];

        // 2. negative words
        let negativeWords = [];

        props.displayNegativeTweet.map((tweet) => {
            negativeWords = negativeWords.concat(tweet.sentiments.negative);
        });

        negativeWords = [...new Set(negativeWords)];

        if (secondaryType === 'keyword') {
            if (positiveWords.length === 0 && negativeWords.length === 0) return <div><p className='EmptyCaption'>No Keywords To Show</p></div>
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
            const locations = getSortedObject(props.locations);
            const locationKeys = Object.keys(locations);

            if (locationKeys.length === 0) return <div><p className='EmptyCaption'>No Locations To Show</p></div>

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

    const mapDisplayTweets = (tweetType) => {
        let finalDisplayTweets = [];

        switch (tweetType) {
            case 'general': finalDisplayTweets = props.displayGeneralTweet;
                break;
            case 'positive': finalDisplayTweets = props.displayPositiveTweet;
                break;
            case 'negative': finalDisplayTweets = props.displayNegativeTweet;
                break;
            case 'neutral': finalDisplayTweets = props.displayNeutralTweet;
                break;
            default: finalDisplayTweets = props.displayVerifiedTweet;
                break;
        }

        return finalDisplayTweets;
    }

    const getCurrentSidePanelIconClass = (isSelected, sidePanelSegment) => {
        let isActive = isSelected === sidePanelSegment;
        let inactiveClass = 'SidePanel__Icon';
        let activeClass = `${inactiveClass} SidePanel__Icon--Active`;

        switch (sidePanelSegment) {
            case 'tweet': return isActive ? activeClass : inactiveClass;
            case 'keyword': return isActive ? `${activeClass} SidePanel__Icon--Keyword` : `${inactiveClass} SidePanel__Icon--Keyword`;
            case 'trend': return isActive ? `${activeClass} SidePanel__Icon--Trend` : `${inactiveClass} SidePanel__Icon--Trend`;
            default: return isActive ? activeClass : inactiveClass;
        }
    }

    const { openSidePanel, sidePanelSegment } = sidePanelItems;
    const { tweetType } = displayTypes;

    const SidePanelClass = openSidePanel ? 'SidePanel' : 'SidePanel SidePanel--Hide';

    let finalDisplayTweets = mapDisplayTweets(tweetType);

    return (
        <div className={SidePanelClass}>
            <img
                src={DetailIcon}
                alt='detail-icon'
                className={getCurrentSidePanelIconClass(sidePanelSegment, 'tweet')}
                onClick={() => callToggleSidePanel('tweet')}
            />
            <img
                src={KeywordIcon}
                alt='keywordIcon-icon'
                className={getCurrentSidePanelIconClass(sidePanelSegment, 'keyword')}
                onClick={() => callToggleSidePanel('keyword')}
            />
            <img
                src={KeywordIcon}
                alt='tweetIcon-icon'
                className={getCurrentSidePanelIconClass(sidePanelSegment, 'trend')}
                onClick={() => callToggleSidePanel('trend')}
            />

            {renderPanel(finalDisplayTweets)}
        </div>
    );
}

export default SidePanel;

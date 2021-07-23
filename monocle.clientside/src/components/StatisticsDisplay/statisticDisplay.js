import React from 'react';
import './statisticDisplay.scss';
import CounterTile from '../CounterTile/counterTile';

const StatisticDisplay = (props) => {
    return (
        <div className='StatisticDisplay'>
            <CounterTile tileLabel={'Total'} tileCount={props.tweetCount}/>
            <CounterTile tileLabel={'Positive'} tileCount={props.positiveTweetCount}/>
            <CounterTile tileLabel={'Negative'} tileCount={props.negativeTweetCount}/>
            <CounterTile tileLabel={'Neutral'} tileCount={props.neutralTweetCount}/>
        </div>
    );
}

export default React.memo(StatisticDisplay);

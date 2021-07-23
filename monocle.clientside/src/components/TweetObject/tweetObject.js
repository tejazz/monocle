import React from 'react';
import './tweetObject.scss';
import { getDate } from '../../utils/functions/general';

const TweetObject = (props) => {
    const { tweet } = props;
    const SentimentClass = tweet.sentiments.score > 0 ? 'TweetItem__Sentiment TweetItem__Sentiment--Positive' : (tweet.sentiments.score < 0 ? 'TweetItem__Sentiment TweetItem__Sentiment--Negative' : 'TweetItem__Sentiment');

    return (
        <div className='TweetItem'>
            <div className='TweetItem__Group'>
                <p className='TweetItem__User'>{tweet.user}</p>
                <p className='TweetItem__Followers'>({tweet.followers})</p>
            </div>
            <p className='TweetItem__Tweet'>{tweet.text}</p>
            <div className='TweetItem__Group'>
                {tweet.location && <p className='TweetItem__Location'>{tweet.location}</p>}
                <p className='TweetItem__Timestamp'>{getDate(tweet.timestamp)}</p>
                <p className={SentimentClass}>Sentiment: {tweet.sentiments.score}</p>
            </div>
        </div>
    );
}

export default React.memo(TweetObject);

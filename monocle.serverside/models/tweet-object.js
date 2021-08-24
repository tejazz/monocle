// tweet object constructor 
// enables consistent object creation
const Sentiment = require('sentiment');
const sentiment = new Sentiment();

function TweetObject(tweet) {
    let { extended_tweet, retweeted_status, id, name, user, timestamp_ms, text } = tweet;

    let tweetText = (extended_tweet) ? extended_tweet.full_text : text;

    // check for retweets
    if (text.includes('RT @') && retweeted_status) {
        tweetText = (retweeted_status.extended_tweet) ? retweeted_status.extended_tweet.full_text : retweeted_status.text;
    }

    this.id = id;
    this.text = tweetText;
    this.user = user.name;
    this.location = user.location ?? '';
    this.followers = user.followers_count;
    this.userImage = user.profile_image_url;
    this.timestamp = timestamp_ms;
    this.sentiments = sentiment.analyze((extended_tweet) ? extended_tweet.full_text : text);
}

module.exports = TweetObject;

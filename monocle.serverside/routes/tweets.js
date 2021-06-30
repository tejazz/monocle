// tweets module 
// func() => help stream tweets based on values and sentiments
const Twit = require('twit');
const Sentiment = require('sentiment');

var T = new Twit({
    consumer_key: 'MVopGkJWEzBkqtT7Senc5RzTL',
    consumer_secret: '5ChifOadpZvaOhlMAEpbegLwltadBNm3TpDHXJJfe5DBR50e4a',
    access_token: '2669827570-cB3RRsdbJYsh0d3I0PTmVIYFyPbbm44ibtGpPll',
    access_token_secret: 'tVqxV9JgyKRjVGlo7ZerIAmtUpMXh7e1wQM0jz6ZCmyPa',
    timeout_ms: 60 * 1000,  // optional HTTP request timeout to apply to all requests.
    strictSSL: true,     // optional - requires SSL certificates to be valid.
});

const sentiment = new Sentiment();

let searchTerm = 'caa';
let stream = T.stream('statuses/filter', { track: searchTerm });
let isStreamStopped = false;

function updateStream(socket, term) {
    console.log(`New Stream Track Setup with Term: ${term}`);
    if (stream) {
        stream.on('tweet', function (tweet) { return });
        stream.stop();
        delete stream;
    };

    stream = T.stream('statuses/filter', { 'track': term });

    stream.on('tweet', function (tweet) {
        let TweetObject = getTweetObject(tweet);

        socket.emit('latest tweets', TweetObject);
    });
}

function getTweetObject(tweet) {
    let tweetText = (tweet.extended_tweet) ? tweet.extended_tweet.full_text : tweet.text;

    // check for retweets
    if (tweet.text.includes('RT @') && tweet.retweeted_status) {
        tweetText = (tweet.retweeted_status.extended_tweet) ? tweet.retweeted_status.extended_tweet.full_text : tweet.retweeted_status.text;
    }

    let TweetObject = {
        id: tweet.id,
        text: tweetText,
        user: tweet.user.name,
        location: (tweet.user.location !== null) ? tweet.user.location : '',
        followers: tweet.user.followers_count,
        userImage: tweet.user.profile_image_url,
        timestamp: tweet.timestamp_ms,
        sentiments: sentiment.analyze((tweet.extended_tweet) ? tweet.extended_tweet.full_text : tweet.text),
    };

    return TweetObject;
}

module.exports = (io) => {
    io.on('connection', function (socket) {
        console.log('Socket Connection: Established');

        socket.on('update track', (term) => {
            updateStream(this, term);
        });

        socket.on('stop stream', () => {
            console.log('Streaming Tweets: Stopped');
            stream.stop();
            isStreamStopped = true;
        });

        socket.on('force stop stream', () => {
            if (!isStreamStopped) {
                console.log('Streaming Tweets: Focibly Stopped');
                stream.stop();
            }
        });

        socket.on('restart stream', () => {
            console.log('Streaming Tweets: Restarted');
            stream.start();
            isStreamStopped = false;
        });

        socket.on('start stream', () => {
            console.log('Streaming Tweets: Started');

            if (!isStreamStopped) {
                stream.stop();
            }

            stream.on('tweet', function (tweet) {
                let TweetObject = getTweetObject(tweet);

                socket.emit('latest tweets', TweetObject);
            });

            stream.start();

            isStreamStopped = false;
        });

        socket.on('close the connection', () => {
            if (!isStreamStopped) {
                stream.stop();
                isStreamStopped = true;
            } 

            console.log('Disconnected');
        });

        /* monitoring stream calls */
        stream.on('limit', (limitMessage) => {
            console.log(limitMessage);
        });

        stream.on('disconnect', function (disconnectMessage) {
            console.log('Disconnected');
            console.log(disconnectMessage);
        });

        stream.on('error', (ErrorMessage) => {
            console.log('Error:');
            console.log(ErrorMessage);
        });

        stream.on('connect', (request) => {
            console.log('Twitter API: Connection Pending');
        });

        stream.on('connected', function (response) {
            console.log('Twitter API: Connected');
        });

    });
}
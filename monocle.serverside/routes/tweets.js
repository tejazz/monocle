// tweets module 
// func() => help stream tweets based on values and sentiments
const Twit = require('twit');
const Sentiment = require('sentiment');

var T = new Twit({
    consumer_key: 'IzdXfGapEofwFb4BqFg6kp3fU',
    consumer_secret: 'S5OjtMC6SXZvTgCKbL3kozS9cIoeDbqLnmm8CWBgVoUdjy2WBw',
    access_token: '2669827570-786eyaIhti9nKnlzXa6krxnZ9yBc653vbbQfGR3',
    access_token_secret: '38ZSABiZil7m0jrT1t5oLPkg1gFoWaJWd3uH1TWLW6JPA',
    timeout_ms: 60 * 1000,  // optional HTTP request timeout to apply to all requests.
    strictSSL: true,     // optional - requires SSL certificates to be valid.
});

const sentiment = new Sentiment();

let searchTerm = 'caa';
let stream = T.stream('statuses/filter', { track: searchTerm });
let isStreamStopped = false;

function updateStream(socket, term) {
    console.log(`setting up new stream with track: ${term}`);
    if (stream) {
        stream.on('tweet', function (tweet) { return });
        stream.stop();
        delete stream;
    };

    stream = T.stream('statuses/filter', { 'track': term });

    stream.on('tweet', function (tweet) {
        console.log('tweeting');

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
        console.log('sockets connected');

        socket.on('update track', (term) => {
            updateStream(this, term);
        });

        socket.on('stop stream', () => {
            console.log('stopped streaming tweets');
            stream.stop();
            isStreamStopped = true;
        });

        socket.on('restart stream', () => {
            console.log('restarted streaming tweets');
            stream.start();
            isStreamStopped = false;
        });

        socket.on('start stream', () => {
            console.log('started streaming tweets');

            if (!isStreamStopped) {
                stream.stop();
            }

            stream.on('tweet', function (tweet) {
                console.log('tweeting');

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

            console.log('disconnected');
        });

        /* monitoring stream calls */
        stream.on('limit', (limitMessage) => {
            console.log(limitMessage);
        });

        stream.on('disconnect', function (disconnectMessage) {
            console.log('disconnected');
            console.log(disconnectMessage);
        });

        stream.on('error', (ErrorMessage) => {
            console.log(ErrorMessage);
        });

        stream.on('connect', (request) => {
            console.log('connecting to twitter');
        });

        stream.on('connected', function (response) {
            console.log('connected to twitter');
        });

    });
}
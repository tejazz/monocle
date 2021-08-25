const Twitter = require('twitter-lite');
const TweetObject = require('../models/tweet-object');

const client = new Twitter({
    consumer_key: process.env.TWITTER_CONSUMER_KEY,
    consumer_secret: process.env.TWITTER_CONSUMER_SECRET,
    access_token_key: process.env.TWITTER_ACCESS_TOKEN,
    access_token_secret: process.env.TWITTER_ACCESS_TOKEN_SECRET
});

let parameters = {
    track: "tesla",
};

let stream = client.stream("statuses/filter", parameters);

function updateStream(socket, term) {
    parameters.track = term;

    stream = client.stream("statuses/filter", parameters);

    stream
        .on("start", response => console.log("Twitter API Streaming: Connected"))
        .on("data", tweet => {
            let tweetObject = new TweetObject(tweet);

            socket.emit('latest tweets', tweetObject);
        });
}

module.exports = (io) => {
    io.on('connection', function (socket) {
        console.log('Socket Connection: Established');

        socket.on('update track', (term) => {
            updateStream(this, term);
        });

        socket.on('stop stream', async () => {
            console.log('Streaming Tweets: Stopped');
            if (stream) {
                await stream.destroy();
            }
        });

        socket.on('force stop stream', () => {
            console.log('Streaming Tweets: Focibly Stopped');
            stream.destroy();
        });

        // socket.on('restart stream', () => {
        //     console.log('Streaming Tweets: Restarted');
        //     stream
        //         .on("start", response => console.log("Twitter API Streaming: Connected"))
        //         .on("data", tweet => {
        //             let tweetObject = new TweetObject(tweet);

        //             socket.emit('latest tweets', tweetObject);
        //         });;
        // });

        socket.on('start stream', () => {
            console.log('Streaming Tweets: Started');
            // if (!stream) {
                stream = client.stream("statuses/filter", parameters);
            // }

            stream
                .on("start", response => console.log("Twitter API Streaming: Connected"))
                .on("data", tweet => {
                    let tweetObject = new TweetObject(tweet);

                    socket.emit('latest tweets', tweetObject);
                });
        });

        socket.on('close the connection', () => {
            stream.destroy();

            console.log('Disconnected');
        });

        /* monitoring stream calls */
        // stream.on('limit', (limitMessage) => {
        //     console.log(limitMessage);
        // });

        stream.on('end', function (disconnectMessage) {
            console.log('Disconnected');
            console.log(disconnectMessage);
        });

        stream.on('error', (ErrorMessage) => {
            console.log('Error:');
            console.log(ErrorMessage);
        });

        stream.on('connect', () => {
            console.log('Twitter API: Connection Pending');
        });

        stream.on('connected', function () {
            console.log('Twitter API: Connected');
        });
    });
}
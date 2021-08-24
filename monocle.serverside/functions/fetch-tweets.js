const Twitter = require('twitter-lite');

// const user = new Twitter({
//     consumer_key: "MVopGkJWEzBkqtT7Senc5RzTL",
//     consumer_secret: "5ChifOadpZvaOhlMAEpbegLwltadBNm3TpDHXJJfe5DBR50e4a"
// });

const client = new Twitter({
    consumer_key: "MVopGkJWEzBkqtT7Senc5RzTL", // from Twitter.
    consumer_secret: "5ChifOadpZvaOhlMAEpbegLwltadBNm3TpDHXJJfe5DBR50e4a", // from Twitter.
    access_token_key: "2669827570-cB3RRsdbJYsh0d3I0PTmVIYFyPbbm44ibtGpPll", // from your User (oauth_token)
    access_token_secret: "tVqxV9JgyKRjVGlo7ZerIAmtUpMXh7e1wQM0jz6ZCmyPa" // from your User (oauth_token_secret)
});

const parameters = {
    track: "tesla",
};
  
let stream = client.stream("statuses/filter", parameters)
    .on("start", response => console.log("start"))
    .on("data", tweet => console.log("data", tweet.text))
    .on("ping", () => console.log("ping"))
    .on("error", error => console.log("error", error))
    .on("end", response => console.log("end"));
  
  // To stop the stream:
// setTimeout(() => {
//     console.log('stop stream')
//     stream.destroy();

//     stream = client.stream("statuses/filter", parameters)

//     stream
//     .on("start", response => console.log("start"))
//     .on("data", tweet => console.log("data", tweet.text))
//     .on("ping", () => console.log("ping"))
//     .on("error", error => console.log("error", error))
//     .on("end", response => console.log("end"));
// }, 10000);
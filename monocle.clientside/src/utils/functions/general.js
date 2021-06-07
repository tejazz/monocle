// returns a date-time string for a timestamp
// e.g. Input: 15267782123
// output: January 22, 2020, 10:14:00 AM
export function getDate(timestamp) {
    const dateConfig = {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
    };

    return new Date(parseInt(timestamp)).toLocaleString(undefined, dateConfig);
}

// sorts an object based on the values it possesses
// order of sort: descending
export function getSortedObject(unsortedObject) {
    let sortable = [];
    let sortedObject = {}

    for (var key in unsortedObject) {
        sortable.push([key, unsortedObject[key]]);
    }

    sortable.sort(function (a, b) {
        return b[1] - a[1];
    });

    sortable.forEach(function (item) {
        sortedObject[item[0]] = item[1]
    })

    return sortedObject;
}

// adds new tweet to sentiment-based tweet temporary array
export function mapSentimentBasedTweets(tweet, displaySentimentTweets, tempDisplaySentimentTweets) {
    if (tempDisplaySentimentTweets.findIndex(existTweet => existTweet.id === tweet.id) === -1) {
        tempDisplaySentimentTweets.push(tweet);
    }

    tempDisplaySentimentTweets.sort((a, b) => { return b.followers - a.followers; });

    if (displaySentimentTweets.length >= 20) {
        tempDisplaySentimentTweets = tempDisplaySentimentTweets.slice(0, 20);
    }

    return tempDisplaySentimentTweets;
}

// adds new tweet to general tweet temporary array
export function mapGeneralCaseTweets(tweet, displayGeneralTweets, bufferGeneralTweets) {
    if (displayGeneralTweets.length === 0) {
        return bufferGeneralTweets.slice(0, 20);
    }

    if (displayGeneralTweets.findIndex(existTweet => existTweet.id === tweet.id) === -1) {
        displayGeneralTweets.push(tweet);
    }

    displayGeneralTweets.sort((a, b) => { return b.followers - a.followers; });
  
    return displayGeneralTweets.slice(0, 20);
}

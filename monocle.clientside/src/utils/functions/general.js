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

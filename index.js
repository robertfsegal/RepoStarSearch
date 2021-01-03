// Taken from...
//
// Waiting for all promises called in a loop to finish
// https://stackoverflow.com/questions/37213783/waiting-for-all-promises-called-in-a-loop-to-finish
//

const { default: axios } = require("axios");

// Example of gathering latest Stack Exchange questions across multiple sites
// Helpers for example
const apiUrl = 'https://api.stackexchange.com/2.2/questions?pagesize=1&order=desc&sort=activity&site=',
    sites = ['stackoverflow', 'ubuntu', 'superuser'],
    myArrayOfData = sites.map(function (site) {
        return {webAddress: apiUrl + site};
    });

function convertToStringValue(obj) {
    return JSON.stringify(obj, null, '\t');
}

// Original question code
let mainObject = {},
    promises = [];

myArrayOfData.forEach(function (singleElement) {
    const myUrl = singleElement.webAddress;
    promises.push(axios.get(myUrl));
});

Promise.all(promises).then(function (results) {
    results.forEach(function (response) {
        const question = response.data.items[0];
        mainObject[question.question_id] = {
            title: question.title,
            link: question.link
        };
    });

    console.log(convertToStringValue(mainObject));
});
// Taken from...
//
// Waiting for all promises called in a loop to finish
// https://stackoverflow.com/questions/37213783/waiting-for-all-promises-called-in-a-loop-to-finish
//

const { default: axios } = require("axios");

require('dotenv').config()

let webRequestMainObject = {}, webRequestsPromises = [];
var resultRepos = new Array();

axios.get('https://api.github.com/users/robertfsegal/starred', {                       
             'headers': 
             {
                 'Authorization': `token ${process.env.GITHUB_PERSONAL_ACCESS_TOKEN}` 
             }
         }).then(r => {
        
            var pages = r.headers.link.match(/.*page=(\d+).*$/)[1];

            pageWebRequests = [];

            for (var i = 0; i < pages; i++)
            {
                pageWebRequests.push("https://api.github.com/users/robertfsegal/starred?page=" + i);
            }
          
          pageWebRequests.forEach(function (s) 
          {
            webRequestsPromises.push(axios.get(s));
          });

          Promise.all(webRequestsPromises).then(function (results) 
          {
                results.forEach(function (response) 
                {
                    response.data.forEach(function(result) {
                        let item = {
                            name     : result.name,
                            html_url : result.html_url,
                            desc     : result.description
                        }

                        resultRepos.push(item);
                    });
                });

                resultRepos.forEach(function(r) {
                    console.log(r);
                });
           });
});


        

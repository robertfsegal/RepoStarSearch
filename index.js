// Taken from...
//
// Waiting for all promises called in a loop to finish
// https://stackoverflow.com/questions/37213783/waiting-for-all-promises-called-in-a-loop-to-finish
//

const { default: axios } = require("axios");

const express = require('express')
const app     = express()

require('dotenv').config()

app.get('/', function (req, res) {
    res.send('Hello World')
})

app.get('/repos', function (req, res) {    
    let webRequestMainObject = {}, webRequestsPromises = [];
    var resultRepos = new Array();

    var q = req.query.q != null ? req.query.q : "";

    axios.get('https://api.github.com/users/robertfsegal/starred', {                       
        'headers': 
        {
            Authorization: `Bearer ${process.env.GITHUB_PERSONAL_ACCESS_TOKEN}`,
            "Content-Type": "application/json"
        }
    }).then(r => {
        // Extract the number of pages from the header
        //
        var pages = r.headers.link.match(/.*page=(\d+).*$/)[1];

        pageWebRequests = [];

        // Specify a web request for each page of results
        //
        for (var i = 0; i < pages; i++)
        {
            pageWebRequests.push("https://api.github.com/users/robertfsegal/starred?page=" + i);
        }

        pageWebRequests.forEach(function (s) 
        {
            webRequestsPromises.push(
                axios.get(s, {
                    'headers': 
                    {
                        Authorization: `Bearer ${process.env.GITHUB_PERSONAL_ACCESS_TOKEN}`,
                        "Content-Type": "application/json"
                    }
                })
            );
        });

        html = "";

        Promise.all(webRequestsPromises).then(function (results) 
        {
            results.forEach(function (response) 
            {
                response.data.forEach(function(result) {
                    let item = {
                        name     : result.name,
                        html_url : result.html_url,
                        desc     : result.description ? result.description : ""
                    }

                    // Search for the query test in repo data
                    //
                    if (q.length > 0)
                    {
                        if (item.name.toLowerCase().includes(q) || item.desc.toLowerCase().includes(q))
                        {
                            resultRepos.push(item);
                        }
                    }
                    else
                    {
                        resultRepos.push(item);
                    }
                });
            });

            resultRepos.forEach(function(r) 
            {
                html += " <a href='" +  r.html_url +  "'>" + r.name + "</a><br>" + r.desc + "<br><br>";
            });

            res.send(html);
        });       
    });
})

app.listen(process.env.PORT || 3000);


        

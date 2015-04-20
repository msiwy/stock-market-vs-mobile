var fs = require('fs');
var request = require('request');
var cheerio = require('cheerio');

var jsonDataArray = [];
var companies = ['Motorola', 'Apple', 'Microsoft', 'Sony', 'Blackberry', 'Google'];

/*
 var specsList = [];
 var evenCounter = 0;
 $('.s_lv_1').each(function (i, element) {
 var data = $(this);
 if (evenCounter++ % 2 == 0) {
 specsList.push(data.text());
 }
 });
 console.log(specsList); */

var getUrls = function(company, callback) {
    /* GET URLS FOR EACH PHONE */
    var url = 'http://www.phonearena.com/phones/manufacturers/' + company + '/view/list/';
    var urls = [];
    var symbol;

    switch (company) {
        case 'Motorola':
            symbol = 'MSI';
            break;
        case 'Apple':
            symbol = 'AAPL';
            break;
        case 'Microsoft':
            symbol = 'MSFT';
            break;
        case 'Sony':
            symbol = 'SNE';
            break;
        case 'BlackBerry':
            symbol = 'BBRY';
            break;
        case 'Google':
            symbol = 'GOOG';
            break;
    }

    request(url, function(error, response, html) {
        if (error || response.statusCode != 200) {
            console.log('ERROR: ' + error.toString());
            return;
        }

        var $ = cheerio.load(html);

        $('.s_block_1_s1').each(function(i, element) {
            var a = $(this);
            var image = a.find('.s_thumb').attr('href');
            var phoneName = a.children('h3').children().eq(0).attr('href');
            if (phoneName != undefined) {
                urls.push(phoneName);
            }
        });
        callback(symbol, urls);
    });
};

var phoneData = function(jsonDataArray, symbol, urls, index, callback) {
    url = 'http://www.phonearena.com' + urls[index];
    console.log('RETRIEVING ', url);
    request(url, function(error, response, html) {
        if (error || response.statusCode != 200) {
            console.log('ERROR: ' + error.toString());
            return;
        }

        var $ = cheerio.load(html);

        var json = {
            symbol: '',
            name: '',
            description: '',
            phonearenaRating: '',
            userRating: '',
            announceDate: '',
            status: '',
            releaseDate: '',
            imageUrl: ''
        };

        $('#phone').filter(function() {
            var data = $(this);
            var name = data.children('h1').children().eq(0).text();
            var description = data.find('.desc').text();

            var phonearenaRating = data.find('.rating').children().eq(0).text().replace(/[^0-9]/gi, '');
            var userRating = data.find('.s_rating_overal').text();

            var datesClassLocation = data.children('.leftspecscol').find('.metablock');
            // TODO Not sure if this will work properly
            var announceDate = datesClassLocation.eq(0).text().substr(33).trim();
            var status = datesClassLocation.eq(1).text().substr(27).trim();
            var releaseDate = datesClassLocation.eq(2).text().substr(25).trim();

            var imageUrl = data.find('.lead').attr('href');

            json.symbol = symbol;
            json.name = name;
            json.description = description;
            json.phonearenaRating = phonearenaRating;
            json.userRating = userRating;
            json.announceDate = announceDate;
            json.status = status;
            json.releaseDate = releaseDate;
            json.imageUrl = imageUrl;
        });
        jsonDataArray.push(json);
        callback(jsonDataArray);
    });
};

var retrieveData = function(jsonDataArray, symbol, urls, callback) {
    console.log('Retrieving info for each phone', urls.length);
    for (var index = 0; index < urls.length; index++) {
        phoneData(jsonDataArray, symbol, urls, index, callback);
    }
};

/*  @TODO I am still not good with javascript... mutable variable? Couldn't run for loop */
// @TODO callback hell
// Generate a file for each company.
getUrls(companies[0], function(symbol, urls) {
    var jsonDataArray = [];
    retrieveData(jsonDataArray, symbol, urls, function(jsonDataArray) {
        /* OUTPUT TO JSON */
        if (jsonDataArray.length == urls.length) {
            fs.writeFile('' + companies[0] + '.json', JSON.stringify(jsonDataArray, null, 4), function(err) {
                console.log('File successfully written! - Check output.');
            });
        }
    })
});

getUrls(companies[1], function(symbol, urls) {
    var jsonDataArray = [];
    retrieveData(jsonDataArray, symbol, urls, function(jsonDataArray) {
        /* OUTPUT TO JSON */
        if (jsonDataArray.length == urls.length) {
            fs.writeFile('' + companies[1] + '.json', JSON.stringify(jsonDataArray, null, 4), function(err) {
                console.log('File successfully written! - Check output.');
            });
        }
    })
});

getUrls(companies[2], function(symbol, urls) {
    var jsonDataArray = [];
    retrieveData(jsonDataArray, symbol, urls, function(jsonDataArray) {
        /* OUTPUT TO JSON */
        if (jsonDataArray.length == urls.length) {
            fs.writeFile('' + companies[2] + '.json', JSON.stringify(jsonDataArray, null, 4), function(err) {
                console.log('File successfully written! - Check output.');
            });
        }
    })
});

getUrls(companies[3], function(symbol, urls) {
    var jsonDataArray = [];
    retrieveData(jsonDataArray, symbol, urls, function(jsonDataArray) {
        /* OUTPUT TO JSON */
        if (jsonDataArray.length == urls.length) {
            fs.writeFile('' + companies[3] + '.json', JSON.stringify(jsonDataArray, null, 4), function(err) {
                console.log('File successfully written! - Check output.');
            });
        }
    })
});

getUrls(companies[4], function(symbol, urls) {
    var jsonDataArray = [];
    retrieveData(jsonDataArray, symbol, urls, function(jsonDataArray) {
        /* OUTPUT TO JSON */
        if (jsonDataArray.length == urls.length) {
            fs.writeFile('' + companies[4] + '.json', JSON.stringify(jsonDataArray, null, 4), function(err) {
                console.log('File successfully written! - Check output.');
            });
        }
    })
});

getUrls(companies[5], function(symbol, urls) {
    var jsonDataArray = [];
    retrieveData(jsonDataArray, symbol, urls, function(jsonDataArray) {
        /* OUTPUT TO JSON */
        if (jsonDataArray.length == urls.length) {
            fs.writeFile('' + companies[5] + '.json', JSON.stringify(jsonDataArray, null, 4), function(err) {
                console.log('File successfully written! - Check output.');
            });
        }
    })
});
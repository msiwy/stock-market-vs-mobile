var fs = require('fs');
var url = require('url');

/**
 * GET /stacked-graph
 * Stacked graph page.
 */
exports.getStackedGraph = function(req, res) {
    var phoneData = [];
    //var computerData = [];
    //var softwareData = [];
    var companies = [];

    var phoneDataFiles = fs.readdirSync('./public/phone-data');
    //var phoneDataFiles = fs.readdirSync('./public/phone-data');
    //var phoneDataFiles = fs.readdirSync('./public/phone-data');

    // for each file in public/phone-data parse data
    for (i=0; i<fs.readdirSync('./public/phone-data').length; i++) {
        phoneData[i] = JSON.parse(fs.readFileSync("./public/phone-data/" + phoneDataFiles[i], "utf8"));
    }

    res.render('stacked-graph', {
        title: 'Stacked Graph',
        phoneData: phoneData
    });
};
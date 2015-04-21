var parseDate = d3.time.format("%Y-%m-%d").parse;
var color = d3.scale.category10();

var sources = ["https://www.quandl.com/api/v1/datasets/WIKI/AAPL.json?auth_token=MX4jg7jQAHp7SDTxGxd4&trim_start=2014-12-31&column=4",
    "https://www.quandl.com/api/v1/datasets/WIKI/IBM.json?auth_token=MX4jg7jQAHp7SDTxGxd4&trim_start=2014-12-31&column=4",
    "https://www.quandl.com/api/v1/datasets/WIKI/MSFT.json?auth_token=MX4jg7jQAHp7SDTxGxd4&trim_start=2014-12-31&column=4"];

var retrieveSingleStockInfo = function (lineData, index, callback) {
    d3.json(sources[index], function (error, stockJson) {
        lineData[index] = {
            values: [],
            key: stockJson.code,
            color: color(stockJson.code)
        };

        var stockData = stockJson.data.map(function (d) {
            return {
                x: parseDate(d[0]), // Date
                y: d[1] // Close Price
            };
        });

        lineData[index].values = stockData;
        // After last request, make the graph because we have all the JSON requests have returned
        callback(lineData);
    });
};
var fetchJSON = function (lineData, callback) {
    for (var index = 0; index < sources.length; index++) {
        retrieveSingleStockInfo(lineData, index, callback);
    }
};

var lineData = [];
var finished;
fetchJSON(lineData, function (linedata) {
    /* OUTPUT TO JSON */
    if (linedata.length == sources.length && linedata[0] != null && linedata[1] != null && linedata[2] != null && !finished) {
        buildTimeSeries(linedata);
        console.log(linedata);
        finished = true;
    }
});

buildTimeSeries = function (data) {
    console.log("RAN FIRST:", lineData);
    nv.addGraph(function () {
        var chart = nv.models.lineWithFocusChart();

        chart.brushExtent([50, 70]);

        // Main chart formating
        chart.xAxis
            .axisLabel('Date')
            .tickFormat(function (d) {
                return d3.time.format('%x')(new Date(d))
            });

        chart.yAxis
            .axisLabel('Close Price ($)')

        // Linked chart formating
        chart.x2Axis.tickFormat(function (d) {
            return d3.time.format('%x')(new Date(d))
        });

        d3.select('#chart svg')
            .datum(data)
            .call(chart);
        nv.utils.windowResize(chart.update);

        chart.useInteractiveGuideline(true);

        return chart;
    });
};

var color = d3.scale.category10();
var parseDate = d3.time.format('%Y-%m-%d').parse;
var parsePhoneDate = d3.time.format('%b %e, %Y').parse;
var lineData = [];
var phonearenaMarkers = [];
var finished = false;
var phonearenaCount = 0;

var sources = [
    'https://www.quandl.com/api/v1/datasets/GOOG/NASDAQ_AAPL.json?auth_token=MX4jg7jQAHp7SDTxGxd4&collapse=monthly&trim_start=2012-12-31',
    'https://www.quandl.com/api/v1/datasets/GOOG/NYSE_MSI.json?auth_token=MX4jg7jQAHp7SDTxGxd4&collapse=monthly&trim_start=2012-12-31',
    'https://www.quandl.com/api/v1/datasets/GOOG/NASDAQ_GOOG.json?auth_token=MX4jg7jQAHp7SDTxGxd4&collapse=monthly&trim_start=2012-12-31',
    //'../phone-data/Apple.json',
    //'../phone-data/Google.json',
    '../major-events-data/Microsoft.json'
];

var retrieveSingleStockInfo = function (index, callback) {
    d3.json(sources[index], function (error, stockJson) {
        if (stockJson.code) {
            lineData[index] = {
                values: stockJson.data.map(function (data) {
                    return ({
                        date: parseDate(data[0]), // date
                        open: data[1], // open price
                        close: data[4], // close price
                        percentChange: (((data[4] - data[1]) / data[1]) * 100)
                    });
                }),
                key: stockJson.code,
                color: color(stockJson.code)
            };
        } else {
            phonearenaMarkers = phonearenaMarkers.concat(stockJson.map(function (d) {
                return {
                    value: parsePhoneDate(d.releaseDate), // some dates will be out of view
                    text: d.name,
                    stockSymbol: d.symbol
                    // imageUrl
                    // ratings
                    // release date?
                };
            }));
            phonearenaCount++;
        }

        // After last request, make the graph because we have all the JSON requests have returned
        callback();
    });
};

var fetchJSON = function (callback) {
    for (var index = 0; index < sources.length; index++) {
        retrieveSingleStockInfo(index, callback);
    }
};

fetchJSON(function () {
    // output data to JSON
    if (lineData.length == 3 &&
            lineData[0] != null &&
            lineData[1] != null &&
            lineData[2] != null &&
            !finished) {
        buildTimeSeries();
        finished = true;
    }
});

buildTimeSeries = function () {
    // REWORK THIS IF TIME PERMITS ---
    var modData = [];
    var xValues = [];

    lineData.forEach(function (d) {
        var item = [d.key];
        var xDate = [d.key + 'x'];
        d.values.forEach(function (j) {
            item.push(j.percentChange);
            xDate.push(j.date);
        });

        modData.push(item);
        xValues.push(xDate);
    });

    /* NOW TO ACTUALLY MAKE THE CHART */

    for (i=0; i<modData.length; i++) {
        console.log(modData[i]);
    }

    var chart = c3.generate({
        bindto: '#chart',
        size: {
            height: 600
        },
        data: {
            xs: {
                "NASDAQ_AAPL": "NASDAQ_AAPLx",
                "NYSE_MSI": "NYSE_MSIx",
                "NASDAQ_GOOG": "NASDAQ_GOOGx"
            },
            columns: [
                modData[0],
                modData[1],
                modData[2],
                xValues[0],
                xValues[1],
                xValues[2]
            ],
            types: {
                NASDAQ_AAPL: 'area-spline',
                NYSE_MSI: 'area-spline',
                NASDAQ_GOOG: 'area-spline'
                // 'line', 'spline', 'step', 'area', 'area-step' are also available to stack
            },
            groups: [
                //['AAPL', 'MSI']
                ////['AAPL', 'GOOG'],
                ////['GOOG', 'MSI']
            ]
        },
        axis: {
            x: {
                type: 'timeseries',
                tick: {
                    format: '%Y-%m-%d'
                }
            }
        },
        grid: {
            x: {
                lines: phonearenaMarkers
            }
        },
        legend: {
            show: true
        },
        zoom: {
            enabled: true
        },
        subchart: {
            show: true
        }
    });
};
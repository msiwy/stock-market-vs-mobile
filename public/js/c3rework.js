
var color = d3.scale.category10();
var parseDate = d3.time.format("%Y-%m-%d").parse;
var parsePhoneDate = d3.time.format("%b %e, %Y").parse
var lineData = [];
var phonearenaMarkers = [];
var finished;
var phonearenaCount = 0;

var sources = ["https://www.quandl.com/api/v1/datasets/WIKI/AAPL.json?auth_token=MX4jg7jQAHp7SDTxGxd4&trim_start=2012-12-31&column=4",
    "https://www.quandl.com/api/v1/datasets/WIKI/MSI.json?auth_token=MX4jg7jQAHp7SDTxGxd4&trim_start=2012-12-31&column=4",
    "https://www.quandl.com/api/v1/datasets/WIKI/GOOG.json?auth_token=MX4jg7jQAHp7SDTxGxd4&trim_start=2012-12-31&column=4",
    "../data/Apple.json",
    "../data/Google.json"];

var retrieveSingleStockInfo = function (index, callback) {
    d3.json(sources[index], function (error, stockJson) {
        if (stockJson.code) {
            lineData[index] = {
              values: [],
              key: stockJson.code,
              color: color(stockJson.code)
            };

            var stockData = stockJson.data.map(function (d) {
                return {
                    datej: parseDate(d[0]), // Date
                    pricej: d[1] // Close Price
                };
            });

            lineData[index].values = stockData;
        } else {
            phonearenaMarkers = phonearenaMarkers.concat(stockJson.map(function (d) {
                return {
                    value: parsePhoneDate(d.announceDate), // some dates will be out of view
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
    /* OUTPUT TO JSON */
    // sources.length MINUES NUM OF JSON FILES!!!
    if (lineData.length == sources.length-2 && lineData[0] != null && lineData[1] != null && lineData[2] != null && !finished && 
          phonearenaCount == 2) {
        buildTimeSeries();
        finished = true;
    }
});

buildTimeSeries = function () {   
    // REWORK THIS IF TIME PERMITS ---
    var modData = [];
    var xValues = [];

    lineData.forEach(function(d,i) {
        var item = [d.key];
        var xDate = [d.key + "x"];
        d.values.forEach(function(j) {
            item.push(j.pricej);
            xDate.push(j.datej);
        });
        
        modData.push(item);
        xValues.push(xDate);
    }); 
    // ------------------------------

    var chart = c3.generate({
      bindto: '#chart',
      size: {
        height: 600
      },
      data: {
          xs: {
            "AAPL": "AAPLx",
            "MSI": "MSIx",
            "GOOG": "GOOGx"
          },
          columns: [
            modData[0],
            modData[1],
            modData[2],
            xValues[0],
            xValues[1],
            xValues[2]
          ]
      },
      axis: {
          x: {
              type: 'timeseries',
              tick: {
                  format: '%Y-%m-%d'
              }
          },
      },
      grid: {
          x: {
              lines: phonearenaMarkers
          }
      },
      zoom: {
        enabled: true
      }, 
      subchart: {
          show: true
      }     
  });
};




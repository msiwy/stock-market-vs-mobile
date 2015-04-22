
var color = d3.scale.category10();
var parseDate = d3.time.format("%Y-%m-%d").parse;
var compliedStocks = [];

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
                datej: parseDate(d[0]), // Date
                pricej: d[1] // Close Price
            };
        });

        lineData[index].values = stockData;
        compliedStocks = compliedStocks.concat(stockData); // all the stock prices and dates complied into 1 array 
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
        finished = true;
    }
});

buildTimeSeries = function (dataa) {   
    
    // REWORK THIS IF TIME PERMITS ---
    var modData = [];
    var dates = ["dates"];
    dataa.forEach(function(d,i) {
        var item = [d.key];
        d.values.forEach(function(j) {
            item.push(j.pricej);
        });
        
        modData.push(item);
    }); 

    // Only log the dates once - fixes tooltip hover
    dataa[0].values.forEach(function(j) {
        dates.push(j.datej);
    });

    modData.push(dates);
    // ------------------------------

    var chart = c3.generate({
      bindto: '#chart',
      data: {
          x: 'dates',
          columns: modData
      },
      axis: {
          x: {
              type: 'timeseries',
              tick: {
                  format: '%Y-%m-%d'
              }
          },
      },
      subchart: {
          show: true
      }      
  });
};




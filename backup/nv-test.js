var parseDate = d3.time.format("%Y-%m-%d").parse;
var color = d3.scale.category10();
var lineData = []; 
var stockData;   

var sources = ["https://www.quandl.com/api/v1/datasets/WIKI/AAPL.json?auth_token=MX4jg7jQAHp7SDTxGxd4&trim_start=2014-12-31&column=4",
               "https://www.quandl.com/api/v1/datasets/WIKI/IBM.json?auth_token=MX4jg7jQAHp7SDTxGxd4&trim_start=2014-12-31&column=4",
               "https://www.quandl.com/api/v1/datasets/WIKI/MSFT.json?auth_token=MX4jg7jQAHp7SDTxGxd4&trim_start=2014-12-31&column=4"];

sources.forEach(function(source, index) {
    d3.json(source, function(error, stockJson) {
        lineData[index] = {
            values: [],
            key: stockJson.code,
            color: color(stockJson.code)
        };

        stockData = stockJson.data.map(function(d) {
            return {
              x: parseDate(d[0]), // Date
              y: d[1] // Close Price
            };
          });

        lineData[index].values = stockData;

        // After last request, make the graph because we have all the JSON requests have returned
        if ((sources.length - 1) == 2) {
            buildTimeSeries(lineData);
        }
    });
}); 

buildTimeSeries = function(data){
    nv.addGraph(function() {
        var chart = nv.models.lineWithFocusChart();
        chart.brushExtent([50,70]);

        // Main chart formating 
        chart.xAxis
            .axisLabel('Date')
            .tickFormat(function(d) {
                return d3.time.format('%x')(new Date(d))
            });

        chart.yAxis
            .axisLabel('Close Price ($)')    

        // Linked chart formating
        chart.x2Axis.tickFormat(function(d) {
            return d3.time.format('%x')(new Date(d))
          });

        d3.select('#chart svg')
            .datum(data)
            .call(chart);
        nv.utils.windowResize(chart.update);

        return chart;
    });  
} 
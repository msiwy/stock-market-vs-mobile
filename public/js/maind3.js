var margin = {top: 10, right: 10, bottom: 100, left: 40},
    margin2 = {top: 430, right: 10, bottom: 20, left: 40},
    width = 960 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom,
    height2 = 500 - margin2.top - margin2.bottom;

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

var x = d3.time.scale().range([0, width]),
    x2 = d3.time.scale().range([0, width]),
    y = d3.scale.linear().range([height, 0]),
    y2 = d3.scale.linear().range([height2, 0]);

var xAxis = d3.svg.axis().scale(x).orient("bottom"),
    xAxis2 = d3.svg.axis().scale(x2).orient("bottom"),
    yAxis = d3.svg.axis().scale(y).orient("left");

var brush = d3.svg.brush()
    .x(x2)
    .on("brush", brushed);

var priceline = d3.svg.line()
    .x(function (d) {
        return x(d.datej);
    })
    .y(function (d) {
        return y(d.pricej);
    });

var priceline2 = d3.svg.line()
    .x(function (d) {
        return x2(d.datej);
    })
    .y(function (d) {
        return y2(d.pricej);
    });

var xMap = function (d) {
        return x(d.datej);
    },
    yMap = function (d) {
        return y(d.pricej);
    };

var svg = d3.select("body").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom);

svg.append("defs").append("clipPath")
    .attr("id", "clip")
    .append("rect")
    .attr("width", width)
    .attr("height", height);

var focus = svg.append("g")
    .attr("class", "focus")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

var context = svg.append("g")
    .attr("class", "context")
    .attr("transform", "translate(" + margin2.left + "," + margin2.top + ")");


buildTimeSeries = function (data) {
    // Seperate array of all the stock prices and dates complied so the domain is accurate
    x.domain(d3.extent(compliedStocks.map(function (d) {
        return d.datej;
    })));
    y.domain([0, d3.max(compliedStocks.map(function (d) {
        return d.pricej;
    }))]);

    x2.domain(x.domain());
    y2.domain(y.domain());

    data.forEach(function (da, index) {
        // Focus is top graph
        focus.append("path")
            .datum(da.values)
            .style("stroke", function (d) {
                return color(da.key);
            })
            //.attr("id", 'tag'+d.key.replace(/\s+/g, '')) // assign ID
            .attr("class", "linePos" + index) // indices to identify stocks by class
            .attr("d", priceline);

        focus.append("circle")
            .data(da.values)
            .style("fill", function (d) {
                return color(da.key);
            })
            .attr("r", 3.5)
            .attr("class", "dot")
            .attr("cx", xMap)
            .attr("cy", yMap);

        // Context is bottom graph
        context.append("path")
            .datum(da.values)
            .style("stroke", function (d) {
                return color(da.key);
            })
            //.attr("id", 'tag'+d.key.replace(/\s+/g, '')) // assign ID
            .attr("class", "linePos" + index) // indices to identify stocks by class
            .attr("d", priceline2);
    });

    // Focus is top graph
    focus.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + height + ")")
        .call(xAxis);

    focus.append("g")
        .attr("class", "y axis")
        .call(yAxis);

    // Context is bottom graph
    context.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + height2 + ")")
        .call(xAxis2);

    context.append("g")
        .attr("class", "x brush")
        .call(brush)
        .selectAll("rect")
        .attr("y", -6)
        .attr("height", height2 + 7);
};

function brushed() {
    x.domain(brush.empty() ? x2.domain() : brush.extent());
    focus.select(".linePos0").attr("d", priceline);
    focus.select(".linePos1").attr("d", priceline);
    focus.select(".linePos2").attr("d", priceline);
    focus.select(".x.axis").call(xAxis);
}

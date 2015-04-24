var color = d3.scale.category10();
var parseDate = d3.time.format("%Y-%m-%d").parse;
var parsePhoneDate = d3.time.format("%b %e, %Y").parse;
var lineData = [];
var phonearenaMarkers = [];
var finished;
var phonearenaCount = 0;
var stockMarkerBoxes = ["hidden", "hidden", "hidden", "hidden"];
var modData = [];
var xValues = [];
var xValuesMs = [];

var sources = ["https://www.quandl.com/api/v1/datasets/GOOG/NASDAQ_AAPL.json?auth_token=BF_415Fh7xADmmnHJDEs&trim_start=2012-04-22&column=4",
    "https://www.quandl.com/api/v1/datasets/GOOG/NYSE_MSI.json?auth_token=BF_415Fh7xADmmnHJDEs&trim_start=2012-04-22&column=4",
    "https://www.quandl.com/api/v1/datasets/GOOG/NASDAQ_GOOG.json?auth_token=BF_415Fh7xADmmnHJDEs&trim_start=2012-04-22&column=4",
    "https://www.quandl.com/api/v1/datasets/GOOG/NYSE_SNE.json?auth_token=BF_415Fh7xADmmnHJDEs&trim_start=2012-04-22&column=4",
    "../phone-data/Apple.json",
    "../phone-data/Google.json",
    "../phone-data/Motorola.json",
    "../phone-data/Sony.json"];    

// Filtering JSON results
var retrieveSingleStockInfo = function (index, callback) {
    d3.json(sources[index], function (error, stockJson) {
        if (stockJson.code) {
            lineData[index] = {
                values: [],
                key: stockJson.code
            };

            var stockData = stockJson.data.map(function (d) {
                return {
                    datej: parseDate(d[0]), // Date
                    pricej: d[1] // Close Price
                };
            });

            lineData[index].values = stockData;
        } else {
            // Storing all the phone announcement markers into an array
            phonearenaMarkers = phonearenaMarkers.concat(stockJson.map(function (d) {
                return {
                    value: parsePhoneDate(d.announceDate), 
                    text: d.name,
                    class: d.symbol + "-marker",
                    stockSymbol: d.symbol
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
    if (lineData.length == sources.length - 4 && lineData[0] != null && lineData[1] != null && lineData[2] != null && lineData[3] != null  && !finished &&
        phonearenaCount == 4) {
        buildTimeSeries();
        finished = true;
    }
});

buildTimeSeries = function () {
    // Formating JSON results to meet C3.js data requirements. ['dataLabel', value1, value2, .....]
    lineData.forEach(function (d, i) {
        var item = [d.key];
        var xDate = [d.key + "x"];
        var xDateMs = [d.key + "x"];
        d.values.forEach(function (j) {
            item.push(j.pricej);
            xDate.push(j.datej);
            xDateMs.push(j.datej.getTime()); // Getting time in miliseconds to compare dates
        });

        modData.push(item);
        xValues.push(xDate);
        xValuesMs.push(xDateMs); // Pushing time in miliseconds to compare dates
    });

    var chart = c3.generate({
        bindto: '#chart',
        size: {
            height: 580
        },
        data: {
            xs: {
                // y-values modData[i] are paired with x-values xValues[i]
                "NASDAQ_AAPL": "NASDAQ_AAPLx", 
                "NYSE_MSI": "NYSE_MSIx",
                "NASDAQ_GOOG": "NASDAQ_GOOGx",
                "NYSE_SNE": "NYSE_SNEx"
            },
            columns: [
                modData[0], // ["NASDAQ_AAPL", 564, 566, ...]
                modData[1],
                modData[2],
                modData[3],
                xValues[0], // ["NASDAQ_AAPLx", 2015-01-13, .....]
                xValues[1],
                xValues[2],
                xValues[3]
            ],
            names: {
                // Rename legend values
                NASDAQ_AAPL: 'Apple',
                NYSE_MSI: 'Motorola',
                NASDAQ_GOOG: 'Google',
                NYSE_SNE: 'Sony'
            },
            onclick: function (d, element) { 
                /*
                 Selecting a data point finds the closest event marker in the past for the corresponding stock.
                 A box then appears with information relating to stock changes in relation to that marker as well at 
                 the data point selected. There is a limit of 4 boxes, but they can be closed by the user
                */
                showStockMarkerBox(findClosestMarker(d), d);
            }
        },
        axis: {
            x: {
                type: 'timeseries',
                tick: {
                    format: '%Y-%m-%d',
                    count: 20
                }
            },
            y: {
                label: {
                    text: 'Stock value',
                    position: 'outer-middle'
                }
            }
        },
        grid: {
            x: {
                // Vertical dashed lines on the chart indicate phone announcemnet dates
                lines: phonearenaMarkers 
            }
        },
        legend: {
            show: true
        },
        zoom: {
            // You are able to zoom with use of the mousewheel
            enabled: true, 
            rescale: true
        },
        subchart: {
            // Brushing chart below the main time series
            show: true 
        }
    });

    // Checkboxes toggle if a company's event markers are displayed
    updateTimeSeriesMarkers = function (value, checked) {
        if (checked) {
            d3.selectAll("." + value + "-marker").attr('display', 'inline'); // Display markers
        } else {
            d3.selectAll("." + value + "-marker").attr('display', 'none'); // Hide markers
        }
    };

    $(document).ready(function () {
        // Hide all the boxes on load
        $("#box0").hide();
        $("#box1").hide();
        $("#box2").hide();
        $("#box3").hide();

        // If a box becomes visible, clicking the X will hide it
        $("#boxClose0").click(function(){
            $("#box0").hide();
            stockMarkerBoxes[0] = "hidden";
        });

        $("#boxClose1").click(function(){
            $("#box1").hide();
            stockMarkerBoxes[1] = "hidden";
        });

        $("#boxClose2").click(function(){
            $("#box2").hide();
            stockMarkerBoxes[2] = "hidden";
        });

        $("#boxClose3").click(function(){
            $("#box3").hide();
            stockMarkerBoxes[3] = "hidden";
        });
    });

    // Determines if a marker box should be shown and displays if it should
    showStockMarkerBox = function(closestMarker, dataPoint) {
        if (closestMarker) {
            var showBoxSuccess = false;
            for (var i = 0; i < stockMarkerBoxes.length; i++) {
                if (stockMarkerBoxes[i] === "hidden") {
                    stockMarkerBoxes[i] = "visible";
                    showBoxSuccess = true;
                    $("#box" + i).show();
                    // stockText = [Announce day price, Price diff. 1 day, Price diff. 1 week, Price diff. 1 month]
                    var stockText = calcMarkerBoxInfo(closestMarker, dataPoint);
                    $("#box" + i + " p").html(function() {
                        var htmlString ="<p>" + closestMarker.text + "</p>" +
                                        "<p>Price on event: " + stockText[0] + "</p>" +
                                        "<p>Price diff. next day: " + stockText[1] + "</p>" +
                                        "<p>Price diff. next week: " + stockText[2] + "</p>" +
                                        "<p>Price diff. next month: " + stockText[3] + "</p>" +
                                        "<p>Price diff. point selected: " + stockText[4] + "</p>";
                        return htmlString;
                    });

                    return;
                }
            }

            if (!showBoxSuccess) {
                console.log("Boxes full!")
            }
        } else {
            // Should never be reached
            console.log("no marker found");
        }
    };

    // Finds the closest event marker prior to the data point selected and with the same company
    findClosestMarker = function(dataPoint) {
        var dataPointDate = dataPoint.x,
            dataPointSymbol = dataPoint.id;

        for (var i = 0; i < phonearenaMarkers.length; i++) {
            // Check for marker with same stock symbol and closest marker prior to data point
            if (dataPointSymbol.includes(phonearenaMarkers[i].stockSymbol) && (phonearenaMarkers[i].value <= dataPointDate)) {
                return phonearenaMarkers[i];
            }
        }            
    };

    // Calculates the info to display in the marker box
    calcMarkerBoxInfo = function(closestMarker, dataPoint) {
        var boxInfo = [];
        if (dataPoint.id === "NASDAQ_AAPL") {
            var markerDateIndex = xValuesMs[0].indexOf(closestMarker.value.getTime()),
                dataPointDateIndex = xValuesMs[0].indexOf(dataPoint.x.getTime()),
                dataPointDayPrice = modData[0][dataPointDateIndex],
                announceDayPrice = modData[0][markerDateIndex],
                nextDayPrice = modData[0][markerDateIndex + 1],
                nextWeekPrice = modData[0][markerDateIndex + 5], // Roughly next business week 
                nextMonthPrice = modData[0][markerDateIndex + 26]; // Roughly next business month 

            // [Announce day price, Price diff. 1 day, Price diff. 1 week, Price diff. 1 month]    
            boxInfo = [announceDayPrice, (nextDayPrice - announceDayPrice).toFixed(2), (nextWeekPrice - announceDayPrice).toFixed(2), 
                        (nextMonthPrice - announceDayPrice).toFixed(2), (dataPointDayPrice - announceDayPrice).toFixed(2)];    
        }

        if (dataPoint.id === "NYSE_MSI") {
            var markerDateIndex = xValuesMs[1].indexOf(closestMarker.value.getTime()),
                dataPointDateIndex = xValuesMs[1].indexOf(dataPoint.x.getTime()),
                dataPointDayPrice = modData[1][dataPointDateIndex],
                announceDayPrice = modData[1][markerDateIndex],
                nextDayPrice = modData[1][markerDateIndex + 1],
                nextWeekPrice = modData[1][markerDateIndex + 5], // Roughly next business week 
                nextMonthPrice = modData[1][markerDateIndex + 26]; // Roughly next business month 

            // [Announce day price, Price diff. 1 day, Price diff. 1 week, Price diff. 1 month]    
            boxInfo = [announceDayPrice, (nextDayPrice - announceDayPrice).toFixed(2), (nextWeekPrice - announceDayPrice).toFixed(2),
                        (nextMonthPrice - announceDayPrice).toFixed(2), (dataPointDayPrice - announceDayPrice).toFixed(2)];    
        }

        if (dataPoint.id === "NASDAQ_GOOG") {
            var markerDateIndex = xValuesMs[2].indexOf(closestMarker.value.getTime()),
                dataPointDateIndex = xValuesMs[2].indexOf(dataPoint.x.getTime()),
                dataPointDayPrice = modData[2][dataPointDateIndex],
                announceDayPrice = modData[2][markerDateIndex],
                nextDayPrice = modData[2][markerDateIndex + 1],
                nextWeekPrice = modData[2][markerDateIndex + 5], // Roughly next business week 
                nextMonthPrice = modData[2][markerDateIndex + 26]; // Roughly next business month 

            // [Announce day price, Price diff. 1 day, Price diff. 1 week, Price diff. 1 month]    
            boxInfo = [announceDayPrice, (nextDayPrice - announceDayPrice).toFixed(2), (nextWeekPrice - announceDayPrice).toFixed(2),
                        (nextMonthPrice - announceDayPrice).toFixed(2), (dataPointDayPrice - announceDayPrice).toFixed(2)];    
        }

        if (dataPoint.id === "NYSE_SNE") {
            var markerDateIndex = xValuesMs[3].indexOf(closestMarker.value.getTime()),
                dataPointDateIndex = xValuesMs[3].indexOf(dataPoint.x.getTime()),
                dataPointDayPrice = modData[3][dataPointDateIndex],
                announceDayPrice = modData[3][markerDateIndex],
                nextDayPrice = modData[3][markerDateIndex + 1],
                nextWeekPrice = modData[3][markerDateIndex + 5], // Roughly next business week 
                nextMonthPrice = modData[3][markerDateIndex + 26]; // Roughly next business month 

            // [Announce day price, Price diff. 1 day, Price diff. 1 week, Price diff. 1 month]    
            boxInfo = [announceDayPrice, (nextDayPrice - announceDayPrice).toFixed(2), (nextWeekPrice - announceDayPrice).toFixed(2),
                        (nextMonthPrice - announceDayPrice).toFixed(2), (dataPointDayPrice - announceDayPrice).toFixed(2)];    
        }
        return boxInfo;
    };

};




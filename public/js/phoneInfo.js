var parsePhoneDate = d3.time.format('%b %e, %Y').parse;

/* RATINGS GAUGE CHARTS */
var phoneArenaRatingsChart = c3.generate({
    bindto: '#phoneArenaRatings',
    size: {
        height: 100
    },
    data: {
        hide: false,
        columns: [
            ['Phone Arena Ratings', 0]
        ],
        type: 'gauge'
    },
    gauge: {
        max: 10
    },
    color: {
        pattern: ['#FF0000', '#F97600', '#F6C600', '#60B044'], // the three color levels for the percentage values.
        threshold: {
            max: 10,
            values: [3, 6, 9, 10]
        }
    },
    tooltip: {
        show: true
    }
});

var userRatingsChart = c3.generate({
    bindto: '#userRatings',
    size: {
        height: 100
    },
    data: {
        hide: false,
        columns: [
            ['User Ratings', 0]
        ],
        type: 'gauge'
    },
    gauge: {
        max: 10
    },
    color: {
        pattern: ['#FF0000', '#F97600', '#F6C600', '#60B044'],
        threshold: {
            unit: 'Score',
            max: 10,
            values: [3, 6, 9, 10]
        }
    }
});

// END OF RATINGS GAUGE CHARTS

/* SPARKLINE */
var sparklineChart = c3.generate({
    bindto: sparkline,
    size: {
        height: 100
    },
    grid: {
        y: {
            show: true
        }
    },
    legend: {
        hide: true
    },
    point: {
        show: false
    },
    axis: {
        x: {
            show: false,
            type: 'timeseries',
            tick: {
                format: '%Y-%m-%d'
            }
        },
        y: {
            show: false,
            label: {
                text: '$'
            },
            tick: {
                count: 3
            }
        }
    },
    data: {
        x: 'x',
        columns: [
            ['x', '2013-01-01', '2013-01-02', '2013-01-03', '2013-01-04', '2013-01-05', '2013-01-06'],
            ['price', 0, 0, 0, 0, 0, 0]
        ]
    }
});

sparklineChart.zoom.enable(true);

/* UPDATE PHONE INFO ON SELECT */
var onPhoneSelect = function (name) {

    var div = document.getElementById('phoneInfo');
    $.getJSON('data/All.json', function (json) {
        /* LOAD PHONE INFORMATION TO HTML */
        // Find the appropriate index of the phone
        var index = 0;
        for (var i = 0; i < json.length; i++) {
            if (json[i].name == name) {
                index = i;
                console.log(name);
                break;
            }
        }

        // Phone
        var phoneName = json[index].name;
        var phoneNameHTML = document.getElementById('phoneSelect');
        phoneNameHTML.innerText = phoneName;

        // Image
        var imageUrl = "<image src=\"http:" + json[index].imageUrl + "\" class = \"img-rounded\">";
        var image = document.getElementById('image');
        image.innerHTML = imageUrl;

        // URL for stocks
        var stockUrlCode = json[index].symbol;
        switch (stockUrlCode) {
            case "GOOG":
                stockUrlCode = "NASDAQ_GOOG";
                break;
            case "SNE":
                stockUrlCode = "NYSE_SNE";
                break;
            case "MSI":
                stockUrlCode = "NYSE_MSI";
                break;
            case "AAPL":
                stockUrlCode = "NASDAQ_AAPL";
                break;
        }

        // Edge cases for no data in json
        if (json[index].phonearenaRating == "" || json[index].userRating == "") {
            setTimeout(function () {
                phoneArenaRatingsChart.load({
                    columns: [
                        ['Phone Arena Ratings', 0]
                    ]
                });
            }, 0);

            setTimeout(function () {
                userRatingsChart.load({
                    columns: [
                        ['User Ratings', 0]
                    ]
                });
            }, 0);
        }

        if (json[index].releaseDate == "unknown" || json[index].releaseDate == "" || json[index].announceDate == "unknown" || json[index].announceDate == "") {
            setTimeout(function () {
                sparklineChart.load({
                    columns: [
                        ['x', '2013-01-01', '2013-01-02', '2013-01-03', '2013-01-04', '2013-01-05', '2013-01-06'],
                        ['price', 0, 0, 0, 0, 0, 0]
                    ]
                });
            }, 500);
        }

        // PhoneArena doesn't have correct scoring across all phones.
        var phonearenaRating = json[index].phonearenaRating;
        if (phonearenaRating > 10) phonearenaRating /= 10;
        var userRating = json[index].userRating;
        if (userRating > 10) userRating /= 10;

        // Format Date for sparkline
        var annouceDate = parsePhoneDate(json[index].announceDate);
        var releaseDate = parsePhoneDate(json[index].releaseDate);

        var date = ("0" + (annouceDate.getMonth() + 1)).slice(-2);
        var dateR = ("0" + (releaseDate.getMonth() + 1)).slice(-2);
        var month = ("0" + (annouceDate.getMonth() + 1)).slice(-2);
        var monthR = ("0" + (releaseDate.getMonth() + 1)).slice(-2);

        var year = annouceDate.getFullYear();
        var yearR = releaseDate.getFullYear();
        var formattedAnnounceDate = year + "-" + month + "-" + date;
        var formattedReleaseDate = yearR + "-" + monthR + "-" + dateR;

        // Removes cluttering if release and announce dates are same.
        // Keeps release date only.
        if (formattedReleaseDate == formattedAnnounceDate) {
            formattedAnnounceDate = "";
        }

        var d = new Date(year, month + 1, 0);
        var startDate = year + "-" + month + "-" + "01";
        month++;

        if (month == 13) {
            month = "01";
            year += 1;
        }

        var endDate = year + "-" + (month + 1) + "-" + (d.getDate() - 2);

        // URL for sparkline
        var stockJsonUrl = "https://www.quandl.com/api/v1/datasets/GOOG/" + stockUrlCode + ".json?auth_token=dvyP1iucHz_BKyh_YD_e&trim_start=" + startDate + "&trim_end=" + endDate + "&column=4";
        $.ajax({
            url: stockJsonUrl,
            async: true,
            success: function (jsonData) {
                var dates = ['x'];
                var prices = ['price'];
                jsonData.data.forEach(function (d, i) {
                    dates.push(d[0]);
                    prices.push(d[1].toFixed(2));
                });
                // Update sparkline
                setTimeout(function () {
                    sparklineChart.load({
                        columns: [
                            dates,
                            prices
                        ]
                    });
                }, 500);
                sparklineChart.xgrids([{value: formattedAnnounceDate, text: 'Announced'}, {
                    value: formattedReleaseDate,
                    text: 'Released'
                }]);
            }
        });


        // Unload and load all scores
        setTimeout(function () {
            phoneArenaRatingsChart.load({
                columns: [
                    ['Phone Arena Ratings', 0]
                ]
            });
        }, 0);

        setTimeout(function () {
            phoneArenaRatingsChart.load({
                columns: [
                    ['Phone Arena Ratings', phonearenaRating]
                ]
            });
        }, 500);

        setTimeout(function () {
            userRatingsChart.load({
                columns: [
                    ['User Ratings', 0]
                ]
            });
        }, 0);

        setTimeout(function () {
            userRatingsChart.load({
                columns: [
                    ['User Ratings', userRating]
                ]
            });
        }, 500);
    });
};
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
        },
        x: {
            lines: [
                {value: 1, text: 'Annoucement'}
            ]
        }
    },
    legend: {
        hide: true
    },
    axis: {
        x: {
            show: false
        },
        y: {
            label: {
                text: '$',
            },
            tick: {
                count: 3
            },
            show: true
        }
    },
    data: {
        columns: [
            ['data1', 0, 0, 0, 0, 0, 0]
        ]
    }
});

setTimeout(function () {
    sparklineChart.load({
        columns: [
            ['data1', 80, 150, 100, 180, 80, 150]
        ]
    });
}, 4000);

/* UPDATE PHONE INFO ON SELECT */
var onPhoneSelect = function(name) {

    var div = document.getElementById('phoneInfo');
    $.getJSON('data/All.json', function(json) {
        /* LOAD PHONE INFORMATION TO HTML */
        // Find the appropriate index of the phone
        var index = 0;
        for (var i = 0; i < json.length; i++) {
            if (json[i].name == name) {
                index = i;
                break;
            }
        }

        // Image
        var imageUrl = "<image src=\"http:" + json[index].imageUrl + "\" class = \"img-rounded\">";
        var image = document.getElementById('image');
        image.innerHTML = imageUrl;

        // PhoneArena doesn't have correct scoring across all phones.
        var phonearenaRating = json[index].phonearenaRating;
        if (phonearenaRating > 10) phonearenaRating /= 10;
        var userRating = json[index].userRating;
        if (userRating > 10) userRating /= 10;

        // Unload and load all scores
        setTimeout(function() {
            phoneArenaRatingsChart.load({
                columns: [
                    ['Phone Arena Ratings', 0]
                ]
            });
        }, 0);

        setTimeout(function() {
            phoneArenaRatingsChart.load({
                columns: [
                    ['Phone Arena Ratings', phonearenaRating]
                ]
            });
        }, 500);

        setTimeout(function() {
            userRatingsChart.load({
                columns: [
                    ['User Ratings', 0]
                ]
            });
        }, 0);

        setTimeout(function() {
            userRatingsChart.load({
                columns: [
                    ['User Ratings', userRating]
                ]
            });
        }, 500);

    });
};
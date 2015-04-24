var onPhoneSelect = function () {

    var div = document.getElementById('phoneInfo');
    $.getJSON('phone-data/Google.json', function (json) {
        /* LOAD PHONE INFORMATION TO HTML */
        // Image
        var imageUrl = "<image src=\"http:" + json[0].imageUrl + "\" class = \"img-rounded\">";
        var image = document.getElementById('image');
        image.innerHTML = imageUrl;

        // Company name
        var company = document.getElementById('company');
        company.innerHTML = json[0].symbol;

        // Phone name
        var phone = document.getElementById('name');
        phone.innerHTML = json[0].name;

        // Phone description
        var description = document.getElementById('description');
        description.innerHTML = json[0].description;
    });
};

/* RATINGS GAUGE CHARTS */
var phoneArenaRatingsChart = c3.generate({
    bindto: '#phoneArenaRatings',
    size: {
        height: 100
    },
    data: {
        hide: true,
        columns: [
            ['Phone Arena Ratings', 10]
        ],
        type: 'gauge'
    },
    gauge: {
        max: 10,
        units: ' Score'
    },
    color: {
        pattern: ['#FF0000', '#F97600', '#F6C600', '#60B044'], // the three color levels for the percentage values.
        threshold: {
            unit: 'Score', // percentage is default
            max: 10,
            values: [3, 6, 9, 10]
        }
    }
});

var userRatingsChart = c3.generate({
    bindto: '#userRatings',
    size: {
        height: 100
    },
    data: {
        hide: true,
        columns: [
            ['Phone Arena Ratings', 10]
        ],
        type: 'gauge'
    },
    gauge: {
        max: 10,
        units: ' Score'
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

setTimeout(function () {
    phoneArenaRatingsChart.load({
        hide: false,
        columns: [['data', 10]]
    });
}, 3000);

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


onPhoneSelect();
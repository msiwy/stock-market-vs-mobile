$(".loading").hide();
$(".error").hide();

// Constants
var authToken = "dvyP1iucHz_BKyh_YD_e";
var start = "2004-03-23";

function getStockData(exchange, symbol) {

    // Get stock phone-data
    var json = $.getJSON("https://www.quandl.com/api/v1/datasets/GOOG/" + exchange.toUpperCase() + "_"
    + symbol.toUpperCase() + ".json?auth_token=" + this.authToken + "&trim_start=" + this.start + "", function () {
        console.log("Data load success.");
    })
        .fail(function () {
            $(".error").show();
        })
        .success(function () {
            $(".error").hide();
        });

    $(".loading").show();

    var price = [];
    var stockData, company, description;

    json.complete(function () {
        $(".loading").hide();

        stockData = json.responseJSON.data;
        company = json.responseJSON.name;
        description = json.responseJSON.description;
        console.log(company);
        console.log(stockData[2]);
        console.log(stockData);
        return [stockData, company, description];
    });

}
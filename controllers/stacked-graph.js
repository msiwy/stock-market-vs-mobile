var fs = require('fs');

/**
 * GET /stacked-graph
 * Stacked graph page.
 */
exports.getStackedGraph = function(req, res) {
    var phoneData = [];

    var phoneDataFiles = fs.readdirSync('./public/phone-data');

    for (i=0; i<fs.readdirSync('./public/phone-data').length; i++) {
        phoneData[i] = JSON.parse(fs.readFileSync("./public/phone-data/" + phoneDataFiles[i], "utf8"));
    }

    var phone = req.param('phone');


    res.render('stacked-graph', {
        title: 'Stacked Graph',
        phoneData: phoneData,
        phone: phone.toString()
    });
};



//$.getJSON('phone-data/Google.json', function (json) {
//    /* LOAD PHONE INFORMATION TO HTML */
//    // Image
//    var imageUrl = "<image src=\"http:" + json[0].imageUrl + "\" class = \"img-rounded\">";
//    var image = document.getElementById('image');
//    image.innerHTML = imageUrl;
//
//    console.log(json[0]);
//
//    // Company name
//    var company = document.getElementById('company');
//    company.innerHTML = json[0].symbol;
//
//    // Phone name
//    var phone = document.getElementById('name');
//    phone.innerHTML = json[0].name;
//
//    // Phone description
//    var description = document.getElementById('description');
//    description.innerHTML = json[0].description;
//});
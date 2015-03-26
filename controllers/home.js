var Quandl = require("quandl");

/**
 * GET /
 * Home page.
 */
exports.index = function(req, res) {
    res.render('home', {
        title: 'Home'
    });
};

// start getting quandl data
var quandl = new Quandl({
    auth_token: "fUZ2XXTui3uvGnAkyqx1"
});


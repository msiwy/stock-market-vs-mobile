/**
 * GET / and GET /time-series
 * Time series page.
 */
exports.getTimeSeries = function(req, res) {
    res.render('time-series', {
        title: 'Time Series'
    });
};


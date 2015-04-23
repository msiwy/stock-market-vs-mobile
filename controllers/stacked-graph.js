/**
 * GET /stacked-graph
 * Stacked graph page.
 */
exports.getStackedGraph = function(req, res) {
    res.render('stacked-graph', {
        title: 'Stacked Graph'
    });
};
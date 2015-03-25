/**
 * Module dependencies.
 */

var express = require('express');

var _ = require('lodash');
var path = require('path');
var connectAssets = require('connect-assets');
var errorHandler = require('errorhandler');
var compress = require('compression');

/**
 * Controllers (route handlers).
 */

var homeController = require('./controllers/home');

/**
 * API keys and Passport configuration.
 */
//var secrets = require('./config/secrets');

/**
 * Create Express server.
 */

var app = express();

/**
 * Express configuration.
 */

app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
app.use(compress());
app.use(connectAssets({
  paths: [path.join(__dirname, 'public/css'), path.join(__dirname, 'public/js')],
  helperContext: app.locals
}));
app.use(express.static(path.join(__dirname, 'public'), { maxAge: 31540000000 }));

/**
 * Main routes.
 */

app.get('/', homeController.index);

/**
 * 500 Error Handler.
 */

app.use(errorHandler());

/**
 * Start Express server.
 */

app.listen(app.get('port'), function() {
  console.log('Express server listening on port %d in %s mode', app.get('port'), app.get('env'));
});

module.exports = app;
var express = require('express');
var path = require('path');
var logger = require('winston');
var bodyParser = require('body-parser');

require('dotenv').load();
var nconf = require('nconf');
nconf.argv().env();
logger.info('environment: ', nconf.get('NODE_ENV'));
// var routes = require('./routes/index');
var parse = require('./routes/parse');

var app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// app.use('/', routes);
app.use('/parse', parse);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (nconf.get('NODE_ENV') === 'development') {
  app.use(function(err, req, res, next) {
    if(err) {
      logger.error('Error in development: ', err);
    }
    res.sendStatus(err.status || 500);
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  if(err) {
    logger.error('Error: ', err);
  }
  res.sendStatus(err.status || 500);
});

module.exports = app;

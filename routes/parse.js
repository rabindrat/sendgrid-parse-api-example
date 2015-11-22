var express = require('express');
var router = express.Router();
var logger = require('winston');
nconf = require('nconf');
var sendgrid  = require('sendgrid')(nconf.get('SENDGRID_APIKEY'));
var multer = require('multer');
var upload = multer();

/* GET users listing. */
router.post('/inbound', upload.single(), function(req, res, next) {
	var envelope;
  var to;
  var payload   = req.body;

  logger.info('payload received', payload);
  res.sendStatus(204);

  if (payload.envelope) { 
    envelope = JSON.parse(payload.envelope); 
  }
  if (envelope){ 
    to = envelope.from; 
  }
  else {
    logger.error('inbound sendgrid parse data couldn\'t be parsed');
    return;
  }

  var Email     = sendgrid.Email;
  var email     = new Email({
    to:       to,
    from:     "hi@sendgrid-parse-api-example.com",
    subject:  "[sendgrid-parse-api-example] Inbound Payload",
    html:     "A payload was just delivered via SendGrid's Inbound Parse API. It should be attached." + 
      "<br><hr><br><h2>Payload</h2><hr>" + payload.email
  });

  email.addFile({
    filename: 'payload.txt',
    content: new Buffer(JSON.stringify(payload))
  });

  sendgrid.send(email, function(err, json) {
    if (err) { 
      logger.error('Error in sending email: ', err);
    } else {
      logger.error('email sent to: ', to);
    }
  });
});

router.get('/test', function(req, res, next) {
  logger.info('testing ibound', sendgrid);
  logger.info('key', nconf.get('SENDGRID_APIKEY'));
  var Email     = sendgrid.Email;
  var email     = new Email({
    to:       nconf.get('MY_EMAIL'),
    from:     "hi@sendgrid-parse-api-example.com",
    subject:  "[sendgrid-parse-api-example] Test",
    html:     "Testing email " + "<br><hl><bold>Cheers </bold>"
  });
  sendgrid.send(email, function(err, json) {
    if (err) { 
      logger.info('Error in sending email: ', err);
      res.json({ success: false, error: {message: err.message} });
    } else {
      res.json({ success: true });
    }
  });
});

module.exports = router;

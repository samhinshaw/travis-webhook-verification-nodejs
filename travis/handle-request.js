const got = require('got');

const verifyTravisRequest = require('./verify-request');
const fireWebhook = require('./fire-webhook');

const { SCRIPT_NAME } = require('./constants');

function handleRequest(req, res, next) {
  if (!req.headers.signature || !req.body.payload) {
    res.sendStatus(400);
    next();
    return;
  }

  const travisSignature = Buffer.from(req.headers.signature, 'base64');
  const { payload } = req.body;
  console.log(JSON.stringify(payload));
  let isRequestVerified = false;

  got('https://api.travis-ci.com/config', {
    timeout: 10000
  })
    .then(response => {
      isRequestVerified = verifyTravisRequest(response, payload, travisSignature);
    })
    .catch(error => {
      // eslint-disable-next-line no-console
      console.log(`There was an error verifying the webhook:\n${error}`);
    })
    .then(() => {
      // If our request was verified, fire the webhook!
      if (isRequestVerified) {
        fireWebhook(SCRIPT_NAME, payload);
      }
      res.sendStatus(200);
    });
}

module.exports = handleRequest;

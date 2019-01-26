const got = require('got');

const verifyTravisRequest = require('./verify-request');
const fireWebhook = require('./fire-webhook');

const { SCRIPT_NAME } = require('./constants');

function handleRequest(req, res, next) {
  if (!req.headers.signature || !req.body.payload) {
    console.log('Request missing signature or payload.');
    res.sendStatus(400);
    next();
    return;
  }

  const travisSignature = Buffer.from(req.headers.signature, 'base64');
  const { payload } = JSON.parse(req.body);

  let isRequestVerified = false;

  got('https://api.travis-ci.com/config', {
    timeout: 10000
  })
    .then(response => {
      isRequestVerified = verifyTravisRequest(response, payload, travisSignature);
    })
    .catch(error => {
      console.log(`There was an error verifying the webhook:\n${error}`);
    })
    .then(() => {
      // If our request was verified, fire the webhook!
      if (isRequestVerified) {
        fireWebhook(SCRIPT_NAME, payload)
          .then(stdout => {
            console.log(stdout);
            // If all went well, send 200!
            res.sendStatus(200);
          })
          .catch(err => {
            console.error(err);
            // If there was an error on our end, send 500
            res.sendStatus(500);
          });
      } else {
        console.log('Request was not verifiable.');
      }
    })
    .catch(error => {
      console.log(`There was an error firing the webhook:\n${error}`);
    });
}

module.exports = handleRequest;

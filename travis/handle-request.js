const got = require('got');

const verifyTravisRequest = require('./verify-request');
const checkShouldFireWebHook = require('./check-should-fire-webhook');
const fireWebhook = require('./fire-webhook');

const { SCRIPT_NAME } = require('./constants');

function handleRequest(req, res) {
  const travisSignature = Buffer.from(req.headers.signature, 'base64');
  const { payload } = req.body;
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
      if (isRequestVerified && checkShouldFireWebHook(payload)) {
        const options = {
          tag: payload.tag
        };
        // Fire our webhook!
        fireWebhook(SCRIPT_NAME, options);
      }
      res.sendStatus(200);
    });
}

module.exports = handleRequest;

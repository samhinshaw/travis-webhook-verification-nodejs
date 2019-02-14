const got = require(`got`);

const verifyTravisRequest = require(`./verify-request`);
const fireWebhook = require(`./fire-webhook`);

const { SCRIPT_NAME, TIMEZONE } = require(`./constants`);

function handleRequest(req, res, next) {
  // Timestamp the request
  const timestamp = new Date();
  const humanReadableTimestamp = timestamp.toLocaleString(`en-US`, {
    timeZone: TIMEZONE
  });

  console.log(`Request received at ${humanReadableTimestamp} (TZ: ${TIMEZONE})`);

  if (!req.headers.signature || !req.body.payload) {
    console.log(`Request missing signature or payload.`);
    res.sendStatus(400);
    next();
    return;
  }

  const travisSignature = Buffer.from(req.headers.signature, `base64`);

  let isRequestVerified = false;

  console.log(`Verifying request...`);

  got(`https://api.travis-ci.com/config`, {
    timeout: 10000
  })
    .then(response => {
      // We have to verify on the unparsed payload to obtain the signing signature
      isRequestVerified = verifyTravisRequest(response, req.body.payload, travisSignature);
    })
    .catch(error => {
      console.log(`There was an error verifying the webhook:`);
      console.error(error);
    })
    .then(() => {
      // If our request was verified, parse the payload and fire the webhook!
      if (isRequestVerified) {
        console.log(`Valid request received from Travis.`);
        const payload = JSON.parse(req.body.payload);
        fireWebhook(SCRIPT_NAME, payload)
          .then(result => {
            if (result.failure) {
              console.log(result.failure);
            }
            if (result.stdout) {
              console.log(`Script output:`);
              console.log(result.stdout);
            }
            if (result.sterr) {
              console.log(`Script error:`);
              console.log(result.sterr);
            }
            // If all went well, send 200!
            res.sendStatus(200);
          })
          .catch(err => {
            console.error(`Error executing script:`);
            console.error(err);
            // If there was an error on our end, send 500
            res.sendStatus(500);
          });
      } else {
        console.log(`Request was not verifiable.`);
      }
    })
    .catch(error => {
      console.log(`There was an error firing the webhook:`);
      console.error(error);
    });
}

module.exports = handleRequest;

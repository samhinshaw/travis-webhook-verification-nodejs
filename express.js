const express = require('express');
const bodyParser = require('body-parser');

const handleTravisRequest = require('./travis/handle-request');

const EXPRESS_PORT = 8025;

const app = express();

// Let Express know it's behind a nginx proxy
app.set('trust proxy', 'loopback');

// Set up the body-parser middleware to parse the Travis POSTed JSON payload
app.use(bodyParser.urlencoded({ extended: false }));

// Set up route for travis posts
app.post('/travis', handleTravisRequest);

// Start up the server
app.listen(EXPRESS_PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`Webhook server listening on port ${EXPRESS_PORT}!`);
});

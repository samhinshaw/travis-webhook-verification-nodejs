const express = require('express');
const bodyParser = require('body-parser');

const handleRequest = require('./travis/handle-request');

const EXPRESS_PORT = 8025;

const app = express();

// Let Express know it's behind a nginx proxy
app.set('trust proxy', 'loopback');

// Set up the body-parser middleware to parse the Travis POSTed JSON payload
app.use(bodyParser.urlencoded({ extended: false }));
// Use the express JSON middleware when sending debug requests
// app.use(express.json());

// Set up route for travis posts
app.post('/travis', handleRequest);

// Start up the server
app.listen(EXPRESS_PORT, () => {
  console.log(`Webhook server listening on port ${EXPRESS_PORT}!`);
});

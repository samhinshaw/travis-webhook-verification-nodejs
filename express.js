const express = require('express');
const bodyParser = require('body-parser');

const handleTravisRequest = require('./travis/handle-request');

const app = express();

const EXPRESS_PORT = 8025;

app.use(bodyParser.urlencoded({ extended: false }));

app.post('/travis', handleTravisRequest);

app.listen(EXPRESS_PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`Example app listening on port ${EXPRESS_PORT}!`);
});

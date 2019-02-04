const crypto = require(`crypto`);

function verifyTravisRequest(response, payload, signature) {
  const travisPublicKey = JSON.parse(response.body).config.notifications.webhook.public_key;
  const verifier = crypto.createVerify(`sha1`);
  verifier.update(payload);
  return verifier.verify(travisPublicKey, signature);
}

module.exports = verifyTravisRequest;

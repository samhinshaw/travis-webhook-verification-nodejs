const crypto = require('crypto');

function verifyTravisRequest(response, payload, signature) {
  console.warn('Travis signature:');
  console.warn(signature);
  const travisPublicKey = JSON.parse(response.body).config.notifications.webhook.public_key;
  console.warn('Travis public key:');
  console.warn(travisPublicKey);
  const verifier = crypto.createVerify('sha1');
  verifier.update(payload);
  console.warn('Was signature verified?');
  console.warn(verifier.verify(travisPublicKey, signature));
  return verifier.verify(travisPublicKey, signature);
}

module.exports = verifyTravisRequest;

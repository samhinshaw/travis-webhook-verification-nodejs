const { REPO_NAME, REPO_OWNER } = require('./constants');

function checkShouldFireWebHook(payload) {
  //   All of the following must be true:
  //   - master or develop branches
  //   - a tag must be present
  //   - status & result must be 0 (meaning successful builds)
  //   - repository owner is "samhinshaw"
  //   - repository is "get_fit"
  const isBranchDeployable = payload.branch === 'master' || payload.branch === 'develop';
  const isTagPresent = !!payload.tag;
  const isStatusSuccess = payload.status === 0 && payload.result === 0;
  const isWebhookForGetFit = payload.repository.name === REPO_NAME;
  const isWebhookMine = payload.repository.owner_name === REPO_OWNER;

  // Make sure ALL conditions are met
  return (
    isBranchDeployable && isTagPresent && isStatusSuccess && isWebhookMine && isWebhookForGetFit
  );
}

module.exports = checkShouldFireWebHook;

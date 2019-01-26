const { REPO_NAME, REPO_OWNER } = require('./constants');

function checkShouldFireWebHook(payload) {
  //   All of the following must be true:
  //   - release/* branch (or tag on any branch)
  //   - a tag must be present
  //   - status & result must be 0 (meaning successful builds)
  //   - repository owner is "samhinshaw"
  //   - repository is "get_fit"
  try {
    console.warn('Checking whether webhook should fire...');
    console.warn(
      payload.branch,
      payload.tag,
      payload.status,
      payload.repository.name,
      payload.repository.owner_name
    );
    const isBranchDeployable = payload.branch.startsWith('release/');
    const isTagPresent = !!payload.tag;

    const isCommitDeployable = isBranchDeployable || isTagPresent;
    const isStatusSuccess = payload.status === 0 && payload.result === 0;
    const isWebhookForGetFit = payload.repository.name === REPO_NAME;
    const isWebhookMine = payload.repository.owner_name === REPO_OWNER;
    // Make sure ALL conditions are met
    return isCommitDeployable && isStatusSuccess && isWebhookMine && isWebhookForGetFit;
  } catch (err) {
    console.error('Error determining whether webhook should fire:');
    console.error(err);
    return false;
  }
}

module.exports = checkShouldFireWebHook;

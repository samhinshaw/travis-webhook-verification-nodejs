const util = require('util');
const exec = util.promisify(require('child_process').exec);

const checkShouldFireWebHook = require('./check-should-fire-webhook');

const { REPO_OWNER, REPO_NAME, REPO_COMPOSE_PATH, SERVER_DEPLOY_PATH } = require('./constants');

function fireWebhook(script, payload) {
  return new Promise((resolve, reject) => {
    // Check whether we should fire
    if (!checkShouldFireWebHook(payload)) {
      reject(new Error('This webhook should not be fired.'));
    }

    // Our tag format contains `-XX` at the end, where XX is Travis' build number.
    // We need to strip this off to get the GitHub branch name. Furthermore, we
    // need to account for builds triggered off of a branch, not a tag.

    let githubBranch;

    try {
      // For branches, this is relatively straightforward--we'll just pull the
      // branch from the payload.
      if (!payload.tag) {
        githubBranch = payload.branch;
      } else {
        // But for tags, we'll have to strip the -XX off of the tag.
        const lastDash = payload.tag.lastIndexOf('-');
        githubBranch = payload.tag.substring(0, lastDash);
      }
    } catch (err) {
      console.error('Error getting branch name.');
      reject(err);
    }

    const composeFileURL = `https://raw.githubusercontent.com/${REPO_OWNER}/${REPO_NAME}/${githubBranch}/${REPO_COMPOSE_PATH}`;

    // Be very careful! The order of these arguments is vital
    exec(
      `bash ${script} ${
        payload.tag
      } ${composeFileURL} ${SERVER_DEPLOY_PATH} ${REPO_OWNER} ${REPO_NAME}`
    )
      .catch(err => {
        reject(err);
      })
      .then((stdout, stderr) => {
        if (stderr) console.error(`stderr: ${stderr}`);
        resolve(stdout);
      });
  });
}

module.exports = fireWebhook;

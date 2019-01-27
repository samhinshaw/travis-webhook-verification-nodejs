const { exec } = require('child_process');

const checkShouldFireWebHook = require('./check-should-fire-webhook');

const { REPO_OWNER, REPO_NAME, REPO_COMPOSE_PATH, SERVER_DEPLOY_PATH } = require('./constants');

function fireWebhook(script, payload) {
  return new Promise((resolve, reject) => {
    // Check whether we should fire
    if (!checkShouldFireWebHook(payload)) {
      reject(new Error('This webhook should not be fired.'));
    }

    // Our Docker tag format contains `-XX` at the end (where XX is Travis' build number).
    // We need to add this to the GitHub branch name or tag.
    // Additionally, if our tag originates from a github branch, remove any prefix.

    let githubBranch;
    let dockerTag;
    try {
      if (payload.tag) {
        githubBranch = payload.tag;
        dockerTag = `${payload.tag}-${payload.number}`;
        // Otherwise, we're dealing with a build from a branch:
      } else {
        githubBranch = payload.branch;
        // First make the branch without the prefix (release/release-name -> release-name).
        // Awesomely, this works when a '/' isn't present either, as indexOf
        // returns -1 if the specified character isn't present, meaning we
        // substring from (-1 + 1 = 0) to the end of the string!
        const cutBranch = payload.branch.substring(payload.branch.indexOf('/') + 1);
        // then construct the docker tag
        dockerTag = `${cutBranch}-${payload.number}`;
      }
    } catch (err) {
      reject(err);
    }

    const composeFileURL = `https://raw.githubusercontent.com/${REPO_OWNER}/${REPO_NAME}/${githubBranch}/${REPO_COMPOSE_PATH}`;

    // Be very careful! The order of these arguments is vital
    exec(
      `bash ${script} ${dockerTag} ${composeFileURL} ${SERVER_DEPLOY_PATH} ${REPO_OWNER} ${REPO_NAME}`,
      (error, stdout, stderr) => {
        if (error) reject(error);
        resolve({ stdout, stderr });
      }
    );
  });
}

module.exports = fireWebhook;

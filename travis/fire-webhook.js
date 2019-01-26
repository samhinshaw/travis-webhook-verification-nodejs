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

    // Our Docker tag format contains `-XX` at the end (where XX is Travis' build number).
    // We need to add this to the GitHub branch name or tag.

    const githubBranch = payload.tag ? payload.tag : payload.branch;

    const dockerTag = `${githubBranch}-${payload.number}`;

    const composeFileURL = `https://raw.githubusercontent.com/${REPO_OWNER}/${REPO_NAME}/${githubBranch}/${REPO_COMPOSE_PATH}`;

    // Be very careful! The order of these arguments is vital
    exec(
      `bash ${script} ${dockerTag} ${composeFileURL} ${SERVER_DEPLOY_PATH} ${REPO_OWNER} ${REPO_NAME}`
    )
      .then((stdout, stderr) => {
        if (stderr) console.error(`stderr: ${stderr}`);
        resolve(stdout);
      })
      .catch(err => {
        reject(err);
      });
  });
}

module.exports = fireWebhook;

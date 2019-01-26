const { exec } = require('child_process');

const checkShouldFireWebHook = require('./check-should-fire-webhook');

const { REPO_OWNER, REPO_NAME, REPO_COMPOSE_PATH, SERVER_DEPLOY_PATH } = require('./constants');

function fireWebhook(script, payload) {
  // Check whether we should fire
  if (!checkShouldFireWebHook(payload)) {
    return;
  }

  const composeFileURL = `https://raw.githubusercontent.com/${REPO_OWNER}/${REPO_NAME}/${
    payload.tag
  }/${REPO_COMPOSE_PATH}`;

  // Be very careful! The order of these arguments is vital
  exec(
    `bash ${script} ${
      payload.tag
    } ${composeFileURL} ${SERVER_DEPLOY_PATH} ${REPO_OWNER} ${REPO_NAME}`,
    (error, stdout, stderr) => {
      if (error) {
        console.error(`exec error: ${error}`);
        return;
      }
      console.log(`stdout: ${stdout}`);
      console.error(`stderr: ${stderr}`);
    }
  );
}

module.exports = fireWebhook;

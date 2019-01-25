const { exec } = require('child_process');

const { REPO_OWNER, REPO_NAME, REPO_COMPOSE_PATH, SERVER_DEPLOY_PATH } = require('./constants');

function fireWebhook(script, options) {
  // Check that this is a tagged release
  if (!options.tag) {
    console.error('Not a tagged release, not deploying.');
    return;
  }

  const composeFileURL = `https://raw.githubusercontent.com/${REPO_OWNER}/${REPO_NAME}/${
    options.tag
  }/${REPO_COMPOSE_PATH}`;

  // Be very careful! The order of these arguments is vital
  exec(
    `bash ${script} ${
      options.tag
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

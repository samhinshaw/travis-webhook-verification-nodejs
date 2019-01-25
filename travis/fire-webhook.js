const { exec } = require('child_process');

function fireWebhook(script, options) {
  if (!options.tag) {
    console.error('Not a tagged release, not deploying.');
    return;
  }
  exec(`bash ${script} ${options.tag}`, (error, stdout, stderr) => {
    if (error) {
      console.error(`exec error: ${error}`);
      return;
    }
    console.log(`stdout: ${stdout}`);
    console.error(`stderr: ${stderr}`);
  });
}

module.exports = fireWebhook;

const fs = require('fs');
const path = require('path');

module.exports = function(context) {
  const projectRoot = context.opts.projectRoot;
  const cordovaConfigPath = path.join(projectRoot, 'config.xml');

  let cordovaConfig = fs.readFileSync(cordovaConfigPath, 'utf-8');

  const lines = cordovaConfig.split(/\r?\n/g);
  const regexContent = /\s+<content/;
  // eslint-disable-next-line
  const allowNavigationRegex = /<allow-navigation href="(http|https):\/\/(([a-z0-9]|[a-z0-9][a-z0-9\-]*[a-z0-9])\.)*([a-z0-9]|[a-z0-9][a-z0-9\-]*[a-z0-9])(:[0-9]+)?\/\*"\s?\/>/;
  const contentIndex = lines.findIndex(line => line.match(regexContent));

  if (contentIndex > -1) {
    lines[contentIndex] = `    <content src="index.html"/>`;
    // -1 because list is reversed
    const foundAllowNavigationIndex = lines.findIndex(line =>
      line.match(allowNavigationRegex)
    );

    if (foundAllowNavigationIndex > -1) {
      lines.splice(foundAllowNavigationIndex, 1);
    }

    cordovaConfig = lines.join('\n');
    fs.writeFileSync(cordovaConfigPath, cordovaConfig);
  }

  const symlinkDestPath = path.join(projectRoot, '/public/cordova');

  if (fs.existsSync(symlinkDestPath)) {
    fs.unlinkSync(symlinkDestPath);
  }
};

const fs = require('fs');
const path = require('path');
var os = require('os');

module.exports = function(context) {
  const projectRoot = context.opts.projectRoot;

  var ifaces = os.networkInterfaces();

  const ip = ifaces['en0'].find(iface => iface.family === 'IPv4').address;
  const port = process.env.PORT;
  const url = `http://${ip}:${port}`;

  const cordovaConfigPath = path.join(projectRoot, 'config.xml');
  let cordovaConfig = fs.readFileSync(cordovaConfigPath, 'utf-8');

  const lines = cordovaConfig.split(/\r?\n/g).reverse();
  const regexContent = /\s+<content/;
  // eslint-disable-next-line
  const regexAllowNavigation = /<allow-navigation href="(http|https):\/\/(([a-z0-9]|[a-z0-9][a-z0-9\-]*[a-z0-9])\.)*([a-z0-9]|[a-z0-9][a-z0-9\-]*[a-z0-9])(:[0-9]+)?\/\*"\s?\/>/;

  const contentIndex = lines.findIndex(line => line.match(regexContent));
  const allowNavigation = `    <allow-navigation href="${url}/*" />`;
  if (contentIndex > -1) {
    lines[contentIndex] = `    <content src="${url}"/>`;
    if (url && !lines.find(line => line.match(regexAllowNavigation))) {
      lines.splice(contentIndex, 0, allowNavigation);
    }
    cordovaConfig = lines.reverse().join('\n');
    fs.writeFileSync(cordovaConfigPath, cordovaConfig);
  }

  //create symlinks for platforms
  const platform = context.opts.platforms[0];
  const symlinkDestPath = path.join(projectRoot, '/public/cordova');
  const symlinkSrcPath = path.join(
    projectRoot,
    `platforms/${platform}/platform_www`
  );

  if (fs.existsSync(symlinkDestPath)) {
    fs.unlinkSync(symlinkDestPath);
  }
  fs.symlinkSync(symlinkSrcPath, symlinkDestPath, 'dir');
};

const address = require('address');
const defaultGateway = require('default-gateway');
const fs = require('fs');
const os = require('os');
const path = require('path');
const xmlToJs = require('xml2js');

module.exports = async function (context) {
  const { projectRoot } = context.opts;

  const result = defaultGateway.v4.sync();
  const ip = address.ip(result && result.interface);
  const port = process.env.PORT;
  const url = `http://${ip}:${port}`;

  const cordovaConfigPath = path.join(projectRoot, 'config.xml');
  const cordovaConfig = fs.readFileSync(cordovaConfigPath, 'utf-8');

  const json = await xmlToJs.parseStringPromise(cordovaConfig);

  json.widget.content[0].$.src = url;
  json.widget['allow-navigation'] = json.widget['allow-navigation'] || [];
  if (
    !json.widget['allow-navigation'].find((item) => item.$.href === `${url}/*`)
  ) {
    json.widget['allow-navigation'].push({
      $: {
        href: `${url}/*`,
      },
    });
  }
  const builder = new xmlToJs.Builder();
  const xml = builder.buildObject(json);
  fs.writeFileSync(cordovaConfigPath, xml);

  //create symlinks for platforms
  const symlinkType = os.platform() === 'win32' ? 'junction' : 'dir';
  const platform = context.opts.platforms[0];

  const cordovaFiles = ['cordova.js', 'cordova_plugins.js', 'plugins'];

  cordovaFiles.forEach((filename) => {
    const symlinkSrcPath = path.join(
      projectRoot,
      'platforms',
      platform,
      'platform_www',
      filename
    );

    const symlinkDestPath = path.join(projectRoot, 'public', filename);

    if (fs.existsSync(symlinkDestPath)) {
      fs.unlinkSync(symlinkDestPath);
    }
    fs.symlinkSync(symlinkSrcPath, symlinkDestPath, symlinkType);
  });
};

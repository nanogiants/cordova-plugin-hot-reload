const fs = require('fs');
const path = require('path');
const address = require('address');
const defaultGateway = require('default-gateway');
const xmlToJs = require('xml2js');

module.exports = async function (context) {
  const { projectRoot } = context.opts;

  const result = defaultGateway.v4.sync();
  const ip = address.ip(result && result.interface);
  const url = `http://${ip}`;

  const cordovaConfigPath = path.join(projectRoot, 'config.xml');
  const cordovaConfig = fs.readFileSync(cordovaConfigPath, 'utf-8');

  const json = await xmlToJs.parseStringPromise(cordovaConfig);

  json.widget.content[0].$.src = 'index.html';
  if (json.widget['allow-navigation']) {
    json.widget['allow-navigation'] = json.widget['allow-navigation'].filter(
      (item) => !item.$.href.startsWith(url)
    );
    if (json.widget['allow-navigation'].length === 0) {
      delete json.widget['allow-navigation'];
    }
  }

  const builder = new xmlToJs.Builder();
  const xml = builder.buildObject(json);

  fs.writeFileSync(cordovaConfigPath, xml);

  const cordovaFiles = ['cordova.js', 'cordova_plugins.js', 'plugins'];

  cordovaFiles.forEach((filename) => {
    const symlinkDestPath = path.join(projectRoot, 'public', filename);

    if (fs.existsSync(symlinkDestPath)) {
      fs.unlinkSync(symlinkDestPath);
    }
  });
};

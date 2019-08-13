# cordova-plugin-hot-reload

This plugin enables you to develop cordova apps with hot-reloading in your app in your development environment.
It creates two hooks that modify your config.xml and point the content to the local development server when you serve the app and point to the `index.html` file when you build your app.

### Cordova files
To load the cordova files in your app you have to inject them to your app in your webpack build-process, based on your environment.
These files only need to be injected in development mode.
```js
const HtmlWebpackTagsPlugin = require('html-webpack-tags-plugin');

const environment = process.env.NODE_ENV;

const plugins = [];
if (environment === 'development') {
  plugins.push(new HtmlWebpackTagsPlugin({ tags: ['cordova/cordova.js'], append: false }));
}

module.exports = {
  publicPath: '',
  outputDir: 'www',
  devServer: {
    host: '0.0.0.0'
  },
  configureWebpack: {
    plugins
  }
};
```

The files are served via symlinks from your public folder and pointing to the correct platform files.
To keep your symlinks out of git remember to add `public/cordova` to your `.gitignore` file.

### preparation
```
npm i concurrently wait-on cross-env
```

To serve your frontend files you could start your app like so
```
"serve:android": "PORT=8080 concurrently \"npm run serve --mode=development\" \"wait-on http://localhost:8080 && cordova run android\""
```
you *have* to set the `PORT` environment, so the plugin can point to the correct port.

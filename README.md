# cordova-plugin-hot-reload

This plugin enables you to develop cordova apps with hot-reloading in your app in your development environment.
It creates two hooks that modify your config.xml and point the content to the local development server when you serve the app and point to the `index.html` file when you build your app.

### Cordova files
To load the cordova files in your app you have to require them in your app
```js
if (window.location.protocol !== 'file:') {
  const cordovaScript = document.createElement('script');
  cordovaScript.setAttribute('type', 'text/javascript');
  cordovaScript.setAttribute('src', 'cordova/cordova.js');
  document.body.appendChild(cordovaScript);
}
```

The files are served via symlinks from your public folder and pointing to the correct platform files.
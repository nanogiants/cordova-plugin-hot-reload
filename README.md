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

### preparation
```
npm i concurrently wait-on
```

To serve your frontend files you could start your app like so
```
"serve:android": "PORT=8080 concurrently \"npm run serve -- --mode=development\" \"wait-on http://localhost:8080 && cordova run android\""
```
you *have* to set the `PORT` environment, so the plugin can point to the correct port.

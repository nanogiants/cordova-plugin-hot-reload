# cordova-plugin-hot-reload

This plugin enables you to develop cordova apps with hot-reloading in your app in your development environment.
It creates two hooks that modify your config.xml and point the content to the local development server when you serve the app and point to the `index.html` file when you build your app.

### Installation

```
cordova plugin add @appcominteractive/cordova-plugin-hot-reload
```

### Cordova files

The files are served via symlinks from your public folder and pointing to the correct platform files.
Remember to keep your symlinks out of git and add them to your `.gitignore` file.

### preparation

```
npm i concurrently wait-on cross-env
```

To serve your frontend files you could start your app like so

```
"serve:android": "cross-env PORT=8080 concurrently \"npm run serve\" \"wait-on http://localhost:8080 && cordova run android\""
```

you _have_ to set the `PORT` environment, so the plugin can point to the correct port.

### Variables

You can add variables to the plugin by adding the following to your `config.xml` in the `widget` tag:

```xml
<plugin name="@appcominteractive/cordova-plugin-hot-reload">
  <variable name="publicPath" value="www"/>
</plugin>
```

Now all symlinks get set to your folder named `www`. The path must be relative to your `config.xml`
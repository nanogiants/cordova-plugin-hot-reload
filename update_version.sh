#!/bin/bash

CONFIG='plugin.xml'
NEW_VERSION=${npm_package_version}

if [ -e $CONFIG ]; then
    # sed to replace version in plugin.xml
    sed -i '' "s/\(plugin.*version=\"\)\([0-9,.]*\)\"/\1$NEW_VERSION\"/" $CONFIG
    git add $CONFIG
    echo "Updated $CONFIG with version $NEW_VERSION"
else
    echo "Could not find $CONFIG"
    exit 1
fi

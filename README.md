# BigBlueButton Etherpad Integration-Plugin
This plugin isolates the changes to etherpad in the BigBlueButton fork [bigbluebutton/etherpad-lite](https://github.com/bigbluebutton/etherpad-lite).

The official BigBlueButton setup still uses the quite outdated etherpad fork, but the docker method ([alangecker/bigbluebutton-docker](https://github.com/alangecker/bigbluebutton-docker)) rather relies on...
- the official up-to-date etherpad branch (>= 1.8.7)
- this plugin for necessary functional patches
- a skin [alangecker/bbb-etherpad-skin](https://github.com/alangecker/bbb-etherpad-skin) for the same nice homogeneous appearance

## Features
- appends the sessionToken to all URL's
- adds the HTML elements for a loading spinner.
- removes the Import UI
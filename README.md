# Custom-ui adapted
From Homeassistant version 110.+, icon handling has changes causing the original Custom-ui by @andrey-git no longer to be functional. Original repo at https://github.com/andrey-git/home-assistant-custom-ui
I've been a longtime and heavy user, and this is the place to applaud Andrey for his amazing plugin. Homeassisant wouldn't be the same without the global customizing it enables us to do. Couldn't live without it!
All credits go to Andrey.

This adapted version makes it compatible again with HA 110+.

Installing is super easy:

-1 add a new folder under your resources folder. suggestion: custom-ui

-2 copy the custom-ui.js file to the folder

-3 add the following to your resources.yaml (adapt to your personal file hierarchy)
   ```
   - url: /local/lovelace/resources/custom-ui/custom-ui.js?v=20200528
     type: module
  ```

-4 refresh the Lovelace resources

-5 refresh Lovelace

-6 happy customizing

If you don't use extra resources in Lovelace yet, you can also load the new custom-ui by changing you configuration.yaml as follows:
   ```
   frontend:
     extra_module_url:
       - /local/lovelace/resources/custom-ui/custom-ui.js
   ```

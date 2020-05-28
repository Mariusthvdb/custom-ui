# custom-ui
From Homeassistant version 110.+, icon handling has changes causing the original Custom-ui by @andrey-git no longer to be functional.
This adapted version makes it compatible again with HA 110+.

Installing is super easy.
1- add a new folder under your resources folder. suggestion: custom-ui
2- copy the custom-ui.js to tht folder
3- add the following to your resources.yaml
   ```
   - url: /local/lovelace/resources/custom-ui/custom-ui.js?v=20200528
     type: module
  ```
4- refresh the Lovelace resources
5- refresh Lovelace
6- happy customizing

If you don't use extra resources in Lovelace yet, you can also load the new custom-ui by changing you configuration.yaml as follows:
   ```
   frontend:
     extra_module_url:
       - /local/lovelace/resources/custom-ui/custom-ui.js
   ```

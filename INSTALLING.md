# Installing Custom-ui

## Prepare

0. Skip this step if you're new to custom-ui.
Delete all existing references to custom-ui in your current config (or, if you don't trust it, comment them out, as I always do before major changes..) Also, you can delete all old custom-ui files.

## Installing is super easy:

1. Create a new folder under your resources folder. Suggestion: custom-ui.

-2 Copy the [custom-ui.js](https://github.com/Mariusthvdb/custom-ui/blob/master/custom-ui.js) file to that folder.

### Using Frontend
-3 This resembles the 'old' way most. You can load the new custom-ui by adding it via [extra_module_url:](https://www.home-assistant.io/integrations/frontend/#extra_module_url) in the [`frontend:`](https://www.home-assistant.io/integrations/frontend/) section in your configuration.yaml as follows (previously we used `/config/www/custom_ui` but, you can use any folder you like. So why not start using the 'resources' folder we use in Home Assistant nowadays):

   ```yaml
   frontend:
     extra_module_url:
       - /local/lovelace/resources/custom-ui/custom-ui.js
   ```

-4 Restart Home Assistant.

-5 Refresh cache...
You might have to refresh your cache a few times. In my personal experience, especially Safari on the Mac and the iPhone app can be a bit obnoxious....

### Using Resources
-3 Add the following to your [resources.yaml](https://www.home-assistant.io/lovelace/dashboards-and-views/#resources) (adapt to your personal file hierarchy):

  ```yaml
   - url: /local/lovelace/resources/custom-ui/custom-ui.js?v=20200918 #change this v-number on each update
     type: module
  ```
-4 Reload the Lovelace resources.
Click the top right Lovelace menu triple dots and Reload resources, or call service `lovelace.reload_resources` in `/developer-tools/service/`.

-5 Refresh Lovelace. 

### Or, use The Modern way: UI
For the official docs on this see [Registering Resources](https://developers.home-assistant.io/docs/frontend/custom-ui/registering-resources)

Register these resources with the Lovelace interface. This is done by navigating to the Lovelace resources page by following below link:

[![Open your Home Assistant instance and show your Lovelace resources.](https://my.home-assistant.io/badges/lovelace_resources.svg)](https://my.home-assistant.io/redirect/lovelace_resources/)

> Note: This tab is only available when the active user's profile has "advanced mode" enabled.

### Step by step
- Click Configuration at `/config/dashboard`, click Lovelace Dashboards, click Resources.
- Click
![configuration-resources](https://github.com/Mariusthvdb/custom-ui/blob/master/add.png)
- Fill out the path in your configuration
- Select `JavaScript Module`
- Create

![configuration-resources](https://github.com/Mariusthvdb/custom-ui/blob/master/configuration-resources.png)

### HACS
As I don't use [HACS](https://hacs.xyz) myself, I won't go into the details of a HACS install, but if you do use HACS, this repo can be added to the custom repositories.

## Check the correct loading of Custom-ui
Having finished the above procedure, you should check if everything went well, and the info screens reflect the newly adapted file as it should. See below:

In `/config/info`:

![info](https://github.com/Mariusthvdb/custom-ui/blob/master/info.png)

In Inspector:

![inspector](https://github.com/Mariusthvdb/custom-ui/blob/master/Module-in-Inspector.png)

In Resources:

![listed](https://github.com/Mariusthvdb/custom-ui/blob/master/listed-resources.png)

-6 If you don't see the above: repeat 5 until you do. Eventually it will show up (unless there's an error somewhere, which you will see in inspector most likely).

## Finally...drumroll
-7 Happy customizing!


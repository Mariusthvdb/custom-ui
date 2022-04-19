# Other Installation
Thw two main methods for installation is mentioned in the [README](https://github.com/Mariusthvdb/custom-ui/blob/master/README.md).

## Downloading custom-ui
1. Create a new folder under your resources folder (`/www`). Suggestion: `custom-ui`.
2. Copy the [custom-ui.js](https://github.com/Mariusthvdb/custom-ui/blob/master/custom-ui.js) file to that folder.

## UI - The Modern way
For the official docs on this see [Registering Resources](https://developers.home-assistant.io/docs/frontend/custom-ui/registering-resources)

Register these resources with the Lovelace interface. This is done by navigating to the Lovelace resources page by following below link:

[![Open your Home Assistant instance and show your Lovelace resources.](https://my.home-assistant.io/badges/lovelace_resources.svg)](https://my.home-assistant.io/redirect/lovelace_resources/)

> Note: This tab is only available when the active user's profile has "advanced mode" enabled.

### Step by step
- Go to Configuration -> Dashboards -> Resources
- Click "Add resource" button in the bottom right corner
- Add the path to the Url field. Usually something like `/local/www/custom-ui/custom-ui.js`
- Select `JavaScript Module`
- Click Create

![configuration-resources](https://github.com/Mariusthvdb/custom-ui/blob/master/configuration-resources.png)

## Using Resources
- Add the following to your [resources.yaml](https://www.home-assistant.io/dashboards/dashboards/#resources) 
(adapt to your own file structure):

  ```yaml
   - url: /local/lovelace/resources/custom-ui/custom-ui.js
     type: module
  ```

- Reload the Lovelace resources.
Click the top right Lovelace menu triple dots and Reload resources, or call service `lovelace.reload_resources` in `/developer-tools/service/`.

- Refresh Lovelace. 

---

## Installation verification 
Having finished the above procedure, you should check if everything went well, and the info screen
reflect the newly adapted file as it should. See below:

In `/config/info`:

![info](https://github.com/Mariusthvdb/custom-ui/blob/master/info.png)

In Inspector:

![inspector](https://github.com/Mariusthvdb/custom-ui/blob/master/module-in-inspector.png)

In Resources:

![listed](https://github.com/Mariusthvdb/custom-ui/blob/master/listed-resources.png)

If you don't see the above: repeat clearing your browser cache. Eventually it will show up (unless 
there's an error somewhere, which you will see in inspector most likely).

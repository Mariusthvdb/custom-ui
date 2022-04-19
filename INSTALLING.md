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

<img width="1054" alt="configuration-resources" src="https://user-images.githubusercontent.com/812265/163999674-f487f6e0-e216-49ab-ad25-596a338e8002.png">

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

<img width="351" alt="info" src="https://user-images.githubusercontent.com/812265/163999719-e19f0da6-162f-46b1-86c3-ca4e6bfe6ad4.png">

In Inspector:

<img width="622" alt="module-in-inspector" src="https://user-images.githubusercontent.com/812265/163999748-3093774e-12da-40a8-b33b-727ba15eb7a1.png">

In Resources:

<img width="1012" alt="listed-resources" src="https://user-images.githubusercontent.com/812265/163999777-81e62605-e698-47a2-a8a8-262b3da2f10e.png">

If you don't see the above: repeat clearing your browser cache. Eventually it will show up (unless 
there's an error somewhere, which you will see in inspector most likely).

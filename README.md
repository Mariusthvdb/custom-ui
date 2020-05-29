# Custom-ui adapted for Home Assistant 110.+

## No more icon_color?
Since Home Assistant saw version 110.+, icon handling has changed, causing the [original custom-ui](https://github.com/andrey-git/home-assistant-custom-ui) by @andrey-git to no longer be fully functional. The loss of icon_color was a major pain.

I've been a longtime and heavy user of custom-ui, and this is the place to applaud Andrey for his amazing plugin. Home Assisant wouldn't be the same without the global customizing it enables us to do. Couldn't live without it!
All credits go to Andrey.

This adapted version makes it compatible again with HA 110+. And allows us to use icon_color like before!

## First

-0 Delete all existing references to custom-ui in your current config (or, if you don't trust it, comment them out, as I always do before major changes..) Also, you can delete all old custom-ui files. (Again, for safety: after you have established all is functioning properly with the new setup).

Installing is super easy:

-1 Create a new folder under your resources folder. Suggestion: custom-ui.

-2 Copy the [custom-ui.js](https://github.com/Mariusthvdb/custom-ui/blob/master/custom-ui.js) file to the folder.

## Using Resources
-3 Add the following to your resources.yaml (adapt to your personal file hierarchy):

   ```yaml
   - url: /local/lovelace/resources/custom-ui/custom-ui.js?v=20200528
     type: module
  ```
-4 Reload the Lovelace resources.

-5 Refresh Lovelace. 

## Using Frontend
If you don't use extra custom resources in Lovelace yet, you can also load the new custom-ui by changing your configuration.yaml as follows (you can use any folder you like, so why not use the same as the above):

   ```yaml
   frontend:
     extra_module_url:
       - /local/lovelace/resources/custom-ui/custom-ui.js
   ```

-4 Restart Home Assistant.

-5 Refresh cache...
You might have to refresh your cache a few times. In my personal experience, especially Safari on the Mac and the iPhone app can be a bit obnoxious....

## Or, use The Modern way
- Click Configuration at `/config/dashboard`, click Lovelace Dashboards, click Resources.
- Click
![configuration-resources](https://github.com/Mariusthvdb/custom-ui/blob/master/add.png)
- Fill out the path in your configuration
- Select `JavaScript Module`
- Create

![configuration-resources](https://github.com/Mariusthvdb/custom-ui/blob/master/configuration-resources.png)

## Check the correct loading of Custom-ui
Having finished the above procedure, you should check if everything went well, and the info screens reflect the newly adapted file as it should. See below:

In `/developer-tools/info`:

![info](https://github.com/Mariusthvdb/custom-ui/blob/master/Developer-tools.png)

In Inspector:

![inspector](https://github.com/Mariusthvdb/custom-ui/blob/master/Module-in-Inspector.png)


-6 If you don't see the above: repeat either 5 until you do. Eventually it will show up (unless there's an error somewhere, which you will see in inspector most likely).

## Finally...drumroll
-7 Happy customizing!


## No more States, Lovelace it is
Note that this adapted version still holds all options of the original custom-ui. Since that was designed for Home Assistant   States, and we now live Lovelace, many of these options are no longer supported. I haven't yet streamlined the file to cut out these, as I am not sure whether Lovelace won't ever bring these back. 'Per entity theming' for one was a major feature now defunct.
As are all other features specifically used in the state-cards. Like `show_last_changed`. We all now how to do that easily in Lovelace.

For a still valid explanation of the JavaScript templating custom-ui uses, I best simply point you to the [original docs on the subject](https://github.com/andrey-git/home-assistant-custom-ui/blob/master/docs/templates.md).

## Learn core Homeassistant customization 
It goes without saying that custom-ui is an extension of core Home Assistant functionality. As such, you should understand what is documented on [Homeassisant.io](https://www.home-assistant.io/docs/configuration/customizing-devices/) about the subject.

Some examples can be found [here](https://github.com/Mariusthvdb/custom-ui/blob/master/examples.yaml).

## Just to be sure....
Don't, let me repeat, Don't use the guidelines from the original repo (I won't provide a link, as you'd probably click it ;-) ) anymore on downloading, installing and activating custom-ui. All of that info now is obsolete. Follow 1 - 6 above and you're set.

## Known error
About `e.push is not a function`. It has been there ever since we used custom-ui in Lovelace. Or at least since a very long time. And has nothing to do with the change for Home Assistant 110+ used in this repo. So never mind. Or preferably: help me edit the custom-ui.js to prevent it from happening if you feel like it. Most welcome!

![known error](https://github.com/Mariusthvdb/custom-ui/blob/master/e.push%20is%20not%20a%20function.png)

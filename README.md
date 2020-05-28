# Custom-ui adapted
From Homeassistant version 110.+, icon handling has changed causing the original Custom-ui by @andrey-git no longer to be functional. Original repo at https://github.com/andrey-git/home-assistant-custom-ui

I've been a longtime and heavy user, and this is the place to applaud Andrey for his amazing plugin. Homeassisant wouldn't be the same without the global customizing it enables us to do. Couldn't live without it!
All credits go to Andrey.

This adapted version makes it compatible again with HA 110+.

## First

-0 Delete all existing references to custom-ui in your current config (or,if you don't trust it, comment them out, as I always do before major changes..) Also, you can delete all files. Again, for safety: after you have established all is fucntioning properly with the new setup).

Installing is super easy:

-1 Create a new folder under your resources folder. suggestion: custom-ui

-2 Copy the [custom-ui.js](https://github.com/Mariusthvdb/custom-ui/blob/master/custom-ui.js) file to the folder

## Using Resources
-3 Add the following to your resources.yaml (adapt to your personal file hierarchy)
   ```yaml
   - url: /local/lovelace/resources/custom-ui/custom-ui.js?v=20200528
     type: module
  ```
-4 Reload the Lovelace resources

-5 Refresh Lovelace

## Using Frontend
If you don't use extra resources in Lovelace yet, you can also load the new custom-ui by changing you configuration.yaml as follows (you can use any folder you like, so why not use the same as the above):
   ```yaml
   frontend:
     extra_module_url:
       - /local/lovelace/resources/custom-ui/custom-ui.js
   ```

-4 Restart Homeassistant

-5 Refresh cache..
You might have to refresh you cache a few times. In my personal experience, especially Safari on the Mac and the iPhone app can be a bit obnoxious....


## Check the correct loading of Custom-ui
Having finished the above process, you should check if everything went well, and the info screens reflect the newly adapted file as it should.

In `/developer-tools/info`
![info](https://github.com/Mariusthvdb/custom-ui/blob/master/Schermafbeelding%202020-05-28%20om%2012.31.07.png)

In Inspector
![inspector](https://github.com/Mariusthvdb/custom-ui/blob/master/Schermafbeelding%202020-05-28%20om%2012.31.51.png)


-6 If you don't see the above: repeat either 5 until you do. Eventually it will showup (unless there's an error somewhere, which you will see in inspector most likely.

## Finally...drumroll
-7 Happy customizing!


## No more States, Lovelace it is
Note that this adapted version still holds all options of the original custom-ui. Since that was designed for Homeassistant   States, and we now live Lovelace, many of these options are no longer supported. I haven't yet streamlined the file to cut out these, as I am not sure whether Lovelace won't ever bring these back. Entity theming for one was a major feature now defunct.
As are all other features specifically used in the state-cards. Like `show_last_changed`. We all now how to do that easily in Lovelace.

For a still valid explanation of the used JavaScript templating Custom-ui uses, I best simply point you to the [original docs on the subject](https://github.com/andrey-git/home-assistant-custom-ui/blob/master/docs/templates.md).

## Learn core Homeassistant customization 
It goes without saying that custom-ui is an extension of core HA functionality. As such you should understand what is documented on [Homeassisant.io](https://www.home-assistant.io/docs/configuration/customizing-devices/) about the subject.
Some examples can be found [here](https://github.com/Mariusthvdb/custom-ui/blob/master/examples.yaml).

## Just to be sure....
Don't, let me repeat, Don't use the guidelines from the original repo (I won't provide a link, as you'd probably click it ;-) ) anymore on downloading, installing and activating Custom-ui. All of that info now is obsolete. Follow 1 - 6 above and you're set.


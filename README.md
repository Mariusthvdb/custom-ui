# Custom-ui adapted for Home Assistant 110.+ / 2021.6

[![hacs_badge](https://img.shields.io/badge/HACS-Default-orange.svg)](https://github.com/custom-components/hacs)

## Main features Custom-ui
We can [customize entities in core Home Assistant](https://www.home-assistant.io/docs/configuration/customizing-devices/). This is however rather limited. Two of the most important features Custom-ui offers on top of the core customization are **Templates** and support for the **icon_color** attribute. We can use these features **globally** in our Home Assistant configuration and thus create extremely powerful yet very compact [customizations](https://github.com/Mariusthvdb/custom-ui/blob/master/EXAMPLES.md).

## Credits
I've been a longtime and heavy user of custom-ui, and this is the place to applaud Andrey for his amazing plugin. Home Assisant wouldn't be the same without the global customizing it enables us to do. Couldn't live without it!
All credits go to @andrey-git.

## History
Since Home Assistant saw version 110.+, [icon handling in state-badge](https://github.com/home-assistant/frontend/issues/5892#issuecomment-630872617) has changed, causing the [original custom-ui](https://github.com/andrey-git/home-assistant-custom-ui) by @andrey-git to no longer be fully functional. 

The loss of icon_color would be a major pain, and reason enough to hold off updating Home Assistant until I would be able to globally colorize my icons again.

Second to that, it was announced that the `extra_html_url` config option was soon to be [deprecated and removed](https://github.com/home-assistant/frontend/issues/6028). So things had to change.

I rang [the alarmbell](https://github.com/home-assistant/frontend/issues/5892) on this, and the core Dev team (thanks Bram and Thomas) helped me transform the 'old' state-card-custom-ui.html import into a modern JS version. 

This adapted version makes it compatible again with HA 110+.

## Installing

See: [Installing custom-ui](https://github.com/Mariusthvdb/custom-ui/blob/master/INSTALLING.md)


## No more States, Lovelace it is
Note that this adapted version doesn't hold all options of the original custom-ui. Since that was designed for Home Assistant States, and we now live Lovelace, many of these options are no longer supported or used. These are now 'carved out' of custom-ui too. Per-entity-theming for one was a major feature now defunct.
As are all other features specifically used in the state-cards. Like `show_last_changed`. We all know how to do that easily in Lovelace now.

For a still valid explanation of the JavaScript templating custom-ui uses, I best simply point you to the [original docs on the subject](https://github.com/andrey-git/home-assistant-custom-ui/blob/master/docs/templates.md).

### More-info
 While you are there, you may have found the [Customizer companion](https://github.com/andrey-git/home-assistant-customizer) too. We used that to hide stuff from the `more-info` windows. This was useful, because we could also hide the templates we set in custom-ui. However, current Lovelace has changed the effect of customizer, which stopped customizer from working, resulting in:

![more-info](https://github.com/Mariusthvdb/custom-ui/blob/master/templates-in-more-info.png)

@CAB426 has changed custom-ui.js, so it again allows to hide attributes in `more-info`, and even better, we can now do so using custom-ui.js only.
Customizer companion is no longer needed. Please delete `/custom_components/customizer/`, and all contents and references to it in your config.

This is confirmed to work for HA 0.112+ and can look like:

![more-info](https://github.com/Mariusthvdb/custom-ui/blob/master/hidden-templates-more-info.png)

Ha 2021.6 changed Frontend representation of more-info attributes once again, and custom-ui updated to follow that. Thank you @spacegaier and Bram for helping out!

#### Hide attributes
To hide attributes in the `more-info` popup, you need to add the `hide_attributes` customization option under the entity in `customize.yaml` or in the global customize configuration `customize_glob.yaml`. 
Single attributes can be hidden by listing them under the corresponding entity (or global definition) or you can choose to hide all attributes by adding the new `all` entry.

## Learn core Home Assistant customization 
It goes without saying that custom-ui is an extension of core Home Assistant functionality. As such, you should understand what is documented on [Homeassisant.io](https://www.home-assistant.io/docs/configuration/customizing-devices/) about the subject. 
Important to note, is that Home Assistant [core Jinja templating](https://home-assistant.io/docs/configuration/templating/) is calculated in the back-end, server side, (the device Home Assistant is running on). Custom-ui Javascript templating is calculated in the front-end, browser side, (the device Home Assistant is displayed on). 

Heavy templating might impact the performance of the system and will depend on processor power and memory available on either side of your devices.

## Examples
Some examples, including the newly added option for `hide_attributes` can be found [here](https://github.com/Mariusthvdb/custom-ui/blob/master/EXAMPLES.md).

## Just to be sure....
Don't, let me repeat, Don't use the guidelines from the original repo (I won't provide a link, as you'd probably click it ;-) ) anymore on downloading, installing and activating custom-ui or using Customizer. All of that info now is obsolete. Follow 1 - 6 in [installation instructions](https://github.com/Mariusthvdb/custom-ui/blob/master/INSTALLING.md) and you're set.

## Caveats
As always, there are caveats. I've stressed before, custom-ui was designed for HA States. Current HA is in very active development, and the Lovelace Frontend team constantly updates. Meaning this custom-ui can suddenly break completely. Nothing I can do about that, other than warn you here. And, of course, try to fix it in custom-ui. But, no promises made.

Also, custom-ui can not customize everything. Entities created in python scripts (you need to set the customization in the script itself) and entities created by several add-ons can't be touched by custom-ui. Eg Home Assistant Google Drive Backup, and Argon One active cooling. You can work around that, by creating template sensors for those entities, which you can again customize in HA ;-)

## Not all Lovelace cards are equal
Lastly, not all core HA cards use the same icon handling. Because of that custom-ui doesn't work with [Entity card](https://www.home-assistant.io/lovelace/entity/) and [Picture-glance card](https://www.home-assistant.io/lovelace/picture-glance/).

Thomas Loven's [Card-mod](https://github.com/thomasloven/lovelace-card-mod), which is an amazing plugin for Lovelace with many features, to the rescue.

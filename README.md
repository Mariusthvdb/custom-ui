# Custom-ui adapted for Home Assistant 110.+ / 2021.6

[![hacs_badge](https://img.shields.io/badge/HACS-Default-orange.svg)](https://github.com/custom-components/hacs)

## Main features Custom-ui
We can [customize entities in core Home Assistant](https://www.home-assistant.io/docs/configuration/customizing-devices/). This is however rather limited. Two of the most important features Custom-ui offers on top of the core customization are **Templates** and support for the **icon_color** attribute. We can use these features **globally** in our Home Assistant configuration and thus create extremely powerful yet very compact customizations. Added to that, custom-ui allows one to **hide attributes** from the more-info pane. Check the [examples](https://github.com/Mariusthvdb/custom-ui/blob/master/EXAMPLES.md) how.

## Credits
I've been a longtime and heavy user of custom-ui, and this is the place to applaud Andrey for his amazing plugin. Home Assisant wouldn't be the same without the global customizing it enables us to do. Couldn't live without it!
All credits go to @andrey-git. 
You can read up on a bit if [history](https://github.com/Mariusthvdb/custom-ui/blob/master/HISTORY.md) how it came to this adapted version.

## Installing

See: [Installing custom-ui](https://github.com/Mariusthvdb/custom-ui/blob/master/INSTALLING.md)

## Learn core Home Assistant customization 
It goes without saying that custom-ui is an extension of core Home Assistant functionality. As such, you should understand what is documented on [Homeassisant.io](https://www.home-assistant.io/docs/configuration/customizing-devices/) about the subject. 

Important to note, is that Home Assistant [core Jinja templating](https://home-assistant.io/docs/configuration/templating/) is calculated in the back-end, server side, (the device Home Assistant is running on). Custom-ui Javascript templating is calculated in the front-end, browser side, (the device Home Assistant is displayed on). 

Heavy templating might impact the performance of the system and will depend on processor power and memory available on either side of your devices.

## Examples
Some examples, including the newly added option for `hide_attributes` can be found [here](https://github.com/Mariusthvdb/custom-ui/blob/master/EXAMPLES.md).

## Just to be sure....
Don't, let me repeat, Don't use the guidelines from the original repo (I won't provide a link, as you'd probably click it ;-) ) anymore on downloading, installing and activating custom-ui or using Customizer. All of that info now is obsolete. Follow 1 - 6 in [installation instructions](https://github.com/Mariusthvdb/custom-ui/blob/master/INSTALLING.md) and you're set.

## Caveats
As always, there are caveats. Current HA is in very active development, and the Lovelace Frontend team constantly updates. Meaning this custom-ui can suddenly break completely. Nothing I can do about that, other than warn you here. And, of course, try to fix it in custom-ui. But, no promises made.

Also, custom-ui can not customize everything. Entities created in python scripts (you need to set the customization in the script itself) and entities created by several add-ons can't be touched by custom-ui. Eg Home Assistant Google Drive Backup, and Argon One active cooling. You can work around that, by creating template sensors for those entities, which you can again customize in HA ;-)

## Not all Lovelace cards are equal
Lastly, not all core HA cards use the same icon handling. Because of that custom-ui doesn't work with [Entity card](https://www.home-assistant.io/lovelace/entity/) , [Button card](https://www.home-assistant.io/lovelace/button/) and [Picture-glance card](https://www.home-assistant.io/lovelace/picture-glance/).

Thomas Loven's [Card-mod](https://github.com/thomasloven/lovelace-card-mod), which is an amazing plugin for Lovelace with many features, to the rescue.

## Interaction with Card-mod
Be aware that Custom-ui is very impactful. As a matter of fact, it is 'stronger' than card-mod. Meaning, if you have eg a customize_glob on icon_color set using Custom-ui, any Card-mod config won't work.

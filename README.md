# Custom-ui adapted for Home Assistant 2022.4
[![hacs_badge](https://img.shields.io/badge/HACS-Default-orange.svg)](https://github.com/custom-components/hacs)
[![GH-release](https://img.shields.io/github/v/release/Mariusthvdb/custom-ui.svg?style=flat-square)](https://github.com/Mariusthvdb/custom-ui/releases)
[![GH-downloads](https://img.shields.io/github/downloads/Mariusthvdb/custom-ui/total?style=flat-square)](https://github.com/Mariusthvdb/custom-ui/releases)
[![GH-last-commit](https://img.shields.io/github/last-commit/Mariusthvdb/custom-ui.svg?style=flat-square)](https://github.com/Mariusthvdb/custom-ui/commits/master)
[![GH-code-size](https://img.shields.io/github/languages/code-size/Mariusthvdb/custom-ui.svg?color=red&style=flat-square)](https://github.com/Mariusthvdb/custom-ui)

We can 
[customize entities in core Home Assistant](https://www.home-assistant.io/docs/configuration/customizing-devices/). 
This is however rather limited. Two of the most important features Custom-ui offers on top of the 
core customization are **Templates** and support for the **icon_color** attribute. We can use these 
features **globally** in our Home Assistant configuration and thus create extremely powerful yet 
very compact customizations. Added to that, custom-ui allows one to **hide attributes** from the 
more-info pane. Check the [examples](https://github.com/Mariusthvdb/custom-ui/blob/master/EXAMPLES.md) 
how.

## NEWS
[@bratanon](https://github.com/bratanon) joined and please welcome him as new co-maintainer of this 
repo. Thanks to Emil we can again enjoy the full options of Custom-ui, and do so with more readable
code than the minimized version we were using up to now.

As of HA 2022.4, state templating (using `state:`) is no longer supported in custom-ui. We now show users a warning 
in the console if using the none supported state templating. 

```yaml
# !!! THIS DOES NOT WORK ANYMORE AND WILL SHOW A WARNING !!!
templates:
   state: if (state === 'home') return 'Online'; return 'Offline';
```

To clearify this again. Using `state` **IN** the condition **WILL WORK**.
```yaml
# This is STILL VALID
templates:
   icon_color: if (state === 'home') return 'blue'; return 'red';
```
**Note the "keys" (state, icon_color) differs.**

Other templating still works the same.

--- 

## Installation

### Manual Installation

1. Download the [custom-ui](http://www.github.com/Mariusthvdb/custom-ui/releases/latest/download/custom-ui.js)
2. Place the file in your `config/www` folder or any subfolders.
3. Include the card code in your `ui-lovelace-card.yaml`

   ```yaml
   title: Home
   resources:
     - url: /local/custom-ui.js
       type: module
   ```

### Installation and tracking with `hacs`

1. Make sure the [HACS](https://github.com/custom-components/hacs) component is installed and working.
2. Search for `custom-ui` and add it through HACS
3. Add the configuration to your `ui-lovelace.yaml`

   ```yaml
   resources:
     - url: /hacsfiles/custom-ui/custom-ui.js
       type: module
   ```

4. Refresh home-assistant.

### Other installation methods
See [INSTALLING.md](https://github.com/Mariusthvdb/custom-ui/blob/master/INSTALLING.md)

## Examples
Examples can be found 
[here](https://github.com/Mariusthvdb/custom-ui/blob/master/EXAMPLES.md).

---

## Learn core Home Assistant customization 
It goes without saying that custom-ui is an extension of core Home Assistant functionality. As 
such, you should understand what is documented on 
[Homeassisant.io](https://www.home-assistant.io/docs/configuration/customizing-devices/) about the 
subject. 

Important to note, is that Home Assistant 
[core Jinja templating](https://home-assistant.io/docs/configuration/templating/) is calculated in 
the back-end, server side, (the device Home Assistant is running on). Custom-ui Javascript 
templating is calculated in the front-end, browser side, (the device Home Assistant is displayed 
on). 

Heavy templating might impact the performance of the system and will depend on processor power and 
memory available on either side of your devices.

### Caveats
Custom-ui can't customize everything. Entities created in python scripts (you need to set the 
customization in the script itself) and entities created by several add-ons can't be touched by 
custom-ui. E.g. Home Assistant Google Drive Backup, and Argon One active cooling. You can work 
around that by creating template sensors for those entities, which you can again customize in HA.

### Not all Lovelace cards are equal
Not all core HA cards use the same icon handling. Because of that custom-ui doesn't work with 
* [Entity card](https://www.home-assistant.io/lovelace/entity/)
* [Button card](https://www.home-assistant.io/lovelace/button/)
* [Picture-glance card](https://www.home-assistant.io/lovelace/picture-glance/).

Thomas Loven's [Card-mod](https://github.com/thomasloven/lovelace-card-mod), which is an amazing 
plugin for Lovelace with many features, to the rescue.

### Interaction with Card-mod
Be aware that custom-ui is very impactful. As a matter of fact, it is 'stronger' than card-mod. 
Meaning if you have e.g. a `customize_glob` on `icon_color` set using custom-ui, any card-mod 
config won't work.

### Credits
I've been a longtime and heavy user of custom-ui, and this is the place to applaud Andrey for his 
amazing plugin. Home Assistant wouldn't be the same without the global customizing it enables us 
to do. Couldn't live without it! All credits go to @andrey-git.
You can read up on a bit if 
[history](https://github.com/Mariusthvdb/custom-ui/blob/master/HISTORY.md) how it came to this 
adapted version.

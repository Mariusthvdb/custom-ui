# What is Custom-ui
[![Marketplace](https://my.home-assistant.io/badges/marketplace_repository.svg)](https://my.home-assistant.io/redirect/marketplace_repository/?owner=Mariusthvdb&repository=custom-ui&category=plugin)
[![GH-release](https://img.shields.io/github/v/release/Mariusthvdb/custom-ui.svg?style=flat-square)](https://github.com/Mariusthvdb/custom-ui/releases)
[![GH-downloads](https://img.shields.io/github/downloads/Mariusthvdb/custom-ui/total?style=flat-square)](https://github.com/Mariusthvdb/custom-ui/releases)
[![GH-last-commit](https://img.shields.io/github/last-commit/Mariusthvdb/custom-ui.svg?style=flat-square)](https://github.com/Mariusthvdb/custom-ui/commits/master)
[![GH-code-size](https://img.shields.io/github/languages/code-size/Mariusthvdb/custom-ui.svg?color=red&style=flat-square)](https://github.com/Mariusthvdb/custom-ui)

## Please read this before using custom-ui

Custom-ui was developed a long time ago, before Home Assistant introduced the modern Dashboard (Lovelace). Home Assistant has evolved significantly since then, so most users no longer need custom-ui.

[Theming](https://www.home-assistant.io/integrations/frontend/#defining-themes) and the use of [state-colors](https://www.home-assistant.io/integrations/frontend/#supported-theme-variables) in the Frontend have become very powerful and should be your first choice for customizing colors based on states.

If you need more, especially if you want to use templates, consider using [UIX](https://uix.lf.technology) by @dcapslock, which allows the user to modify almost anything in the Dashboard views (the Frontend).

Only as a last resort should you consider using custom-ui, and only in those cases where you need more power and control.

The Core development team consistently emphasizes keeping the state machine clean and warns against overloading it with (custom) attributes, especially templating those attributes. **The Home Assistant developers actively discourage frontend plugins like custom-ui**; if you want dashboard customization, prefer core features and [UIX](https://uix.lf.technology) by @dcapslock where possible. Use custom-ui only when nothing else covers your case.

**So, again, only use custom-ui if you know what you are doing and if no other option is available.**

______

We can 
[customize entities in core Home Assistant](https://www.home-assistant.io/docs/configuration/customizing-entities/). 
However, this is rather limited. Two of the most important features Custom-ui offers on top of the 
core customization are support for:
* **Templates** 
* **icon_color** attribute.

We can use these features **globally** in our Home Assistant configuration and thus create extremely powerful yet 
very compact customizations. Added to that, custom-ui allows one to **hide attributes** from the 
more-info pane. Check the [examples](https://github.com/Mariusthvdb/custom-ui/blob/master/EXAMPLES.md) 
how.

<img width="492" alt="icon-color" src="https://user-images.githubusercontent.com/33354141/168234088-ee5a5b11-0e68-49fd-b664-6e5a13c79fb0.png">

**Did you know....**: custom-ui facilitates setting a [Jinja template on custom attributes](https://github.com/Mariusthvdb/custom-ui/blob/master/EXAMPLES.md#did-you-know) in core integrations that allow setting a custom attribute.

--- 

## Installation


### Manual Installation

1. Download [custom-ui-2026.js](https://raw.githubusercontent.com/Mariusthvdb/custom-ui/master/custom-ui-2026.js) (raw file; for HA 2026.11+ — use `custom-ui.js` on older versions)
2. Place the file in your `config/www` folder or any subfolders.
3. Include the card code in your `ui-lovelace-card.yaml`

   ```yaml
   title: Home
   resources:
     - url: /local/custom-ui-2026.js
       type: module
   ```
or when using the UI, click 

<a href="https://my.home-assistant.io/redirect/lovelace_resources/" target="_blank"><img src="https://my.home-assistant.io/badges/lovelace_resources.svg" alt="Open your Home Assistant instance and show your Lovelace resources." /></a>

### Installation and tracking with the Marketplace

Since Home Assistant 2026.11, HACS is built in as the Marketplace (Settings > Marketplace); on older versions, install HACS first.

1. Add this repository as a custom repository in the Marketplace (menu > Custom repositories).
2. Search for `custom-ui` and add it.
3. Add the configuration to your `ui-lovelace.yaml`

   ```yaml
   resources:
     - url: /hacsfiles/custom-ui/custom-ui.js
       type: module
   ```

4. Refresh home-assistant.

For Home Assistant 2026.11 and newer, use `custom-ui-2026.js` instead of `custom-ui.js`.
Note: the Marketplace/HACS resource path (`/hacsfiles/custom-ui/...`) always serves `custom-ui.js`, so install `custom-ui-2026.js` manually: download it and add `- url: /local/custom-ui-2026.js\n  type: module` to your dashboard resources.

### Other installation methods
See [INSTALLING](https://github.com/Mariusthvdb/custom-ui/blob/master/INSTALLING.md)

## Examples
See [EXAMPLES](https://github.com/Mariusthvdb/custom-ui/blob/master/EXAMPLES.md).

For examples, see [EXAMPLES.md](https://github.com/Mariusthvdb/custom-ui/blob/master/EXAMPLES.md) in this repo.

---

## Learn core Home Assistant customization 
It goes without saying that custom-ui is an extension of core Home Assistant functionality. As 
such, you should understand what is documented on 
[Homeassisant.io](https://www.home-assistant.io/docs/configuration/customizing-entities/) about the 
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
custom-ui. E.g. Home Assistant Google Drive Backup. You can work 
around that by creating template sensors for those entities, which you can again customize in HA.

Also, do notice that changes to configuration used by this plugin will only apply on the state
change of the related entity. Thus, if you have already reloaded your new YAML config via Developer
Tools > YAML > Location & Customizations, but it didn't "kick in", try to force a state change in 
the entity you're testing

### Not all Lovelace cards are equal
Not all core HA cards use the same icon handling. Because of that, cards like
* [Picture-glance card](https://www.home-assistant.io/dashboards/picture-glance/)
* [Statistic card](https://www.home-assistant.io/dashboards/statistic/)

are not customized by `custom-ui`.

[UIX](https://uix.lf.technology) by @dcapslock, an amazing 
plugin for the Dashboard with many features, to the rescue.

### Interaction with UIX
Be aware that custom-ui is very impactful. As a matter of fact, it is 'stronger' than UIX. 
Meaning if you have e.g. a `customize_glob` on `icon_color` set using custom-ui, any UIX 
config won't work.

### Credits
I've been a longtime and heavy user of custom-ui, and this is the place to applaud Andrey for his 
amazing plugin. Home Assistant wouldn't be the same without the global customizing it enables us to do. Couldn't live without it! All credits go to @andrey-git.
You can read up on a bit if 
[history](https://github.com/Mariusthvdb/custom-ui/blob/master/HISTORY.md) how it came to this 
adapted version.

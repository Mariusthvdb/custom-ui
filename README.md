# What is Custom-ui
[![hacs_badge](https://img.shields.io/badge/HACS-Default-41BDF5.svg)](https://github.com/hacs/integration)
[![GH-release](https://img.shields.io/github/v/release/Mariusthvdb/custom-ui.svg?style=flat-square)](https://github.com/Mariusthvdb/custom-ui/releases)
[![GH-downloads](https://img.shields.io/github/downloads/Mariusthvdb/custom-ui/total?style=flat-square)](https://github.com/Mariusthvdb/custom-ui/releases)
[![GH-last-commit](https://img.shields.io/github/last-commit/Mariusthvdb/custom-ui.svg?style=flat-square)](https://github.com/Mariusthvdb/custom-ui/commits/master)
[![GH-code-size](https://img.shields.io/github/languages/code-size/Mariusthvdb/custom-ui.svg?color=red&style=flat-square)](https://github.com/Mariusthvdb/custom-ui)

## Please read this before using custom-ui

Custom-ui was developed a long time ago, before Home Assistant introduced the modern Dashboard (Lovelace). Home Assistant has evolved significantly since then, so most users no longer need custom-ui.

[Theming](https://www.home-assistant.io/integrations/frontend/#defining-themes) and the use of [state-colors](https://www.home-assistant.io/integrations/frontend/#supported-theme-variables) in the Frontend have become very powerful and should be your first choice for customizing colors based on states.

If you need more, especially if you want to use templates, consider using the custom [Card-mod](https://github.com/thomasloven/lovelace-card-mod), which allows the user to modify almost anything in the Dashboard views (the Frontend).

Only as a last resort should you consider using custom-ui, and only in those cases where you need more power and control.

The use of the templating feature on all attributes (yes, custom-ui is that powerful) should be discouraged because it interferes with entities in the Home Assistant state machine (the back-end).

The Core development team consistently emphasizes the importance of maintaining as clean a state machine as possible and warns against overloading it with (custom) attributes, especially templating those attributes.

**So, again, only use custom-ui if you know what you are doing and if no other option is available.**

______

We can 
[customize entities in core Home Assistant](https://www.home-assistant.io/docs/configuration/customizing-devices/). 
However, this is rather limited. Two of the most important features Custom-ui offers on top of the 
core customization are support for:
* **Templates** 
* **icon_color** attribute.

We can use these features **globally** in our Home Assistant configuration and thus create extremely powerful yet 
very compact customizations. Added to that, custom-ui allows one to **hide attributes** from the 
more-info pane. Check the [examples](https://github.com/Mariusthvdb/custom-ui/blob/master/EXAMPLES.md) 
how.

<img width="492" alt="icon-color" src="https://user-images.githubusercontent.com/33354141/168234088-ee5a5b11-0e68-49fd-b664-6e5a13c79fb0.png">

## Development of this plugin, strategy forward

Please see the pinned [discussion](https://github.com/Mariusthvdb/custom-ui/discussions/128) on development of this plugin.

In short:
- If you want a tool to customize icon_color: Use either custom-ui (with template support) or custom-icon-color.
- If you want a tool to customize more-info dialogs: Use custom-more-info

Current custom-ui (with legacy more-info manipulation) will be archived, and renamed, so we can keep the custom-ui name for the current custom-ui-only.

## NEWS

**New Custom template attributes**

All modifications in my entire config are now implemented using [Card-mod](https://github.com/thomasloven/lovelace-card-mod). I am aware this only works in the actual cards in the View, and not on the more-info of entities. It is a choice I made to accept that as a trade-off between optimal desktop customization, and optimal core handling of the state machine. 

I don't want to overload the state machine with anything custom anymore. In the end, it is the best way forward.

However, there is 1 modification I 'need', that can't be done with card-mod.

My persons entity_picture need to grayscale when `not_home`, specifically in the [`type: map`](https://www.home-assistant.io/dashboards/map/) cards. 
Currently we can succesfully set a css filter in most other regular cards with card-mod, but those modifications do not affect the Map card.
For that purpose only, the new `custom-attributes-templates` now sees the light.

I all honesty, I hope this can be deleted as soon as core Home Assistant would provide other means to do so. 
There is not a single hint entity_picture will ever be leveraged (we can not even set an [entity_picture in the UI](https://www.home-assistant.io/docs/configuration/customizing-devices/#customizing-an-entity-in-yaml) and need [`customize:` in Yaml](https://www.home-assistant.io/integrations/homeassistant/#manual-customization) for that), eg. like we can now do with [state-colors](https://www.home-assistant.io/integrations/frontend/#supported-theme-variables).

Until that moment, this will have to do:

```
homeassistant:

  customize_domain:

    person:
      templates:
        entity_picture: >
          var id = entity.entity_id.split('.')[1];
          return state === 'not_home'
          ? '/local/family/' + id + '_not_home.png' : '/local/family/' + id + '.jpg';
```

I purposely dont provide an easy way to download it via HACS, or plan a release. the file can bw downloaded from the list above, and insgtalled like any other resource:

```
- url: /local/resources/custom-attributes-templates/custom-attributes-templates.js?v=202400815
  type: module
```

**New Custom More-info**

[Custom More-info](https://github.com/Mariusthvdb/custom-more-info) is a new custom Plugin for Home Assistant and superseeds the plugin `custom-attributes` announced below. 

Next to the functionality of `custom-attributes`, with `custom-more-info` users can customize when and when not to display the History and Logbook sections in the More-info card. Even hide the History icon in the Header completely. Automatically, or based on manual settings.

From now on you are in control of the More-info attributes and all other sections. Filter all, unfilter all, or select which to see/hide by glob, domain, device_class, or entity_id. Any combination is possible!

Custom More-info gives the user ultimate control over the More-info panel.
___
**New Custom Attributes**

[Custom attributes](https://github.com/Mariusthvdb/custom-attributes) is a new resource for Home Assistant to customize which entity attributes are displayed in the Dashboard on more-info cards. Moreover, if configured so that no more attributes are left to display (all attributes are filtered), the attributes dropdown box is not rendered at all. This is replacing that specific functionality from Custom-ui.

### DON'T INSTALL BOTH CUSTOM-ATTRIBUTES AND CUSTOM-MORE-INFO SIMULTANEOUSLY. USE ONLY 1 OF THESE 2 NEW PLUGINS
___
**New Custom icon_color**

A new custom-ui sibling was released, [custom-icon-color](https://github.com/Mariusthvdb/custom-icon-color), which can be used *only* for adding an attribute in `customize:` and the attributes configuration options of [template:](https://www.home-assistant.io/integrations/template/#attributes) entities.

*No more templates possible* with this version, which minimizes impact on the HA system and Frontend if you wish to do so. There was never a huge impact, but this brings it down even further, if you don't need the template options and still want the icon_color attribute in your options.
Configuration is identical to what is already explained in the example section

___
**Did you know....**: custom-ui facilitates setting a [Jinja template on custom attributes](https://github.com/Mariusthvdb/custom-ui/blob/master/EXAMPLES.md#did-you-know) in core integrations that allow setting a custom attribute.

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
or when using the UI, click 

<a href="https://my.home-assistant.io/redirect/lovelace_resources/" target="_blank"><img src="https://my.home-assistant.io/badges/lovelace_resources.svg" alt="Open your Home Assistant instance and show your Lovelace resources." /></a>

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
See [INSTALLING](https://github.com/Mariusthvdb/custom-ui/blob/master/INSTALLING.md)

## Examples
See [EXAMPLES](https://github.com/Mariusthvdb/custom-ui/blob/master/EXAMPLES.md).

For card-mod replacement mods, see [CARD-MOD-EXAMPLES](https://github.com/Mariusthvdb/custom-ui-icon-color/blob/main/CARD-MOD-EXAMPLES.md)

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

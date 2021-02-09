# Some examples using custom-ui.

This is an excerpt of my own package, and can be used
directly if you copy it to your own homeassistant structure and activate packages. Of
course other methods work also, like pointing to a dedicated customize file, and
referencing that in your configuration.yaml

Note that the triple `===` which is used throughout the community and examples on the
original repo are not necessary. `==` suffices. Secondly, always use a guard for unexpected states.
Of course this holds for Jinja templates in HA too...
The guard is used by setting the `else` clause, which in the examples below are on the
last lines, starting with 'return'. Dont need to use the word `else` itself, though it
will be valid if you do.

Lastly, remember to delimit the lines with a `;` .

Why use custom-ui? 2 huge reasons:

# Icon color

Setting a color for an icon is not possible in core HA. There is no attribute icon_color out of the box.

Personally, I can't live without the icon_color attribute. Fully aware of the modern days custom card-mod, with which you can set a style on any card and entity, this still doesn't come close to the ease of custom-ui. Keeping as many styling issues out of the Lovelace cards makes for much better readable configs (imho) and, last but not least: using custom-ui we can set colors and color templates globally. 

Declare once, use everywhere. 

The color in the JS custom-ui syntax can take any CSS color value. For example: #FFACAC, red, rgba(10, 20, 30, 0.5) etc.
Note that the color will be applied as-is and it won't be affected by the brightness attribute

# Templates
Core HA customizing is straightforward and can't use templates based on states or attributes. Thats where custom-ui enters.

The `templates` attributes allow you to inject your own expressions and code using JavaScript code or template literals in order to override entity attributes and state.
Within the code / template literals, you have full access to the entity's state object, which allows you to access other properties such as last_changed,
attributes.friendly_name, etc.

In order for a template to return "nothing", return `null` from your template. Note that `null` can only be returned using code format,
as template literal format always returns a string.


If you dont need the 2 above, don't use custom-ui. Since you came here looking for examples, I take it you do, so read on ;-)

**Note that all JavaScript templates are evaluated in your browser, unlike Jinja2 templates, which are evaluated server-side and use a different syntax.**

### Available variables
#### Global variables
Those variables allow one entity to set state / attribute based on another entity or some other "external" thing. Using those hurts UI performance,
so use them only if you indeed want an entity to depend on something external.

`hass` - the hass object

`entities` - a map object from `entity_id` to state objects.

#### Local Variables
`entity` - the state object for the current entity.
 Note that if you are using device or context aware attributes then the object you get is already modified.

`attributes` attributes map of the current entity. Shortcut for `entity.attributes`.

`attribute` the original (non-template) value of the attribute being calculated by a template.

`state` the original (non-template) state of the entity.

### Formats
You can provide the template in two different formats.
*   If the template contains the word `return` it will be treated as raw JavaScript code.
*   Otherwise it will be treated as JavaScript template literal that returns a string.

```yaml
##########################################################################################
# Domain
# this is by far the most powerful option. Set and forget, and never have to set any Style
# in a Lovelace card. Do remember that customizing an individual entity overrides domain
# or global customizations.
# If customizing an entity belonging to one these domains, you have to customize it
# completely
##########################################################################################

homeassistant:
  customize_domain:

    automation:
      templates: &state_color  # <-- define a yaml anchor here
        icon_color: >
          if (state == 'on') return 'gold';
          return 'steelblue';

# or use a theme variable:

      templates: &state_color
        icon_color: >
          if (state == 'on') return 'var(--primary-color)';
          return 'steelblue';

    binary_sensor:
      templates:
        <<: *state_color  # <-- and use it on any other entity in this file
  
    input_boolean:
      templates: *state_color # <-- or even shorter like this
  
    switch:
      templates:
        icon: >
          if (state == 'on') return 'mdi:toggle-switch';
          return 'mdi:toggle-switch-off';
        <<: *state_color

##########################################################################################
# Glob
# second powerful option used in Homeassistant, profits enormously of custom-ui.
##########################################################################################

  customize_glob:
    # All Entities - Hide Templates & Icon Color
    # Note that yaml keys can't start with an asterisk. Use quotes in that case:
    "*.*":
      hide_attributes:
        - templates
        - icon_color
        - all # <-- this hides, well, all customizations ;-)
    
    light.hue_ambiance_spot_*:
      icon: mdi:spotlight-beam
    
    device_tracker.*_bt:
      templates:
        icon: >
          if (state == 'home') return 'mdi:bluetooth';
          return 'mdi:bluetooth-off';
        icon_color: >
          if (state == 'home') return 'blue';
          return 'grey';
    
    device_tracker.*laptop*:
      templates: &device_color
        icon_color: >
          if (state == 'home') return 'gold';
          return 'steelblue';
    
    device_tracker.ipad*:
      templates:
        <<: *device_color
    
    device_tracker.googlehome_*:
      templates:
        icon_color: >
          if (state == 'home') return 'rgb(0,128,0)';
          return 'rgb(255,0,0)';

# as stated in the readme, any valid Css color code is allowed.
# above 'rgb(1,2,3)' is identical to using the color names 'green' and 'red'

    input_number.*_volume:
      templates: # state is a string
        icon: >
          if (state == '0.0') return 'mdi:volume-off';
          if (state <= '0.3') return 'mdi:volume-low';
          if (state <= '0.6') return 'mdi:volume-medium';
          return 'mdi:volume-high';
        icon_color: >
          if (state == '0.0') return 'darkblue';
          if (state <= '0.1') return 'mediumblue';
          if (state <= '0.2') return 'blue';
          if (state <= '0.3') return 'dodgerblue';
          if (state <= '0.4') return 'lightblue';
          if (state <= '0.5') return 'turquoise';
          if (state <= '0.6') return 'green';
          if (state <= '0.7') return 'darkgreen';
          if (state <= '0.8') return 'orange';
          if (state <= '0.9') return 'crimson';
          return 'firebrick';
    
    sensor.*_sensor*temperature:
      templates: # state is a number
        icon_color: >
          if (state < -20) return 'black';
          if (state < -15) return 'navy';
          if (state < -10) return 'darkblue';
          if (state < -5) return 'mediumblue';
          if (state < 0) return 'blue';
          if (state < 5) return 'dodgerblue';
          if (state < 10) return 'lightblue';
          if (state < 15) return 'turquoise';
          if (state < 20) return 'green';
          if (state < 25) return 'darkgreen';
          if (state < 30) return 'orange';
          if (state < 35) return 'crimson';
          return 'firebrick';
    
    sensor.*_bewegingssensor:
      templates: &battery_color
        icon_color: >
          if (state > 75) return 'green';
          if (state > 50) return 'gold';
          if (state > 25) return 'orange';
          if (state > 10) return 'brown';
          return 'red';
    
    sensor.*_dimmer:
      templates:
        <<: *battery_color
    
    sensor.*_afstandsbediening*:
      templates:
        <<: *battery_color
    
    switch.sw_boiler_bijkeuken*:
      templates:
        icon: >
          if (state == 'on') return 'mdi:water-boiler';
          return 'mdi:water-boiler-off';
        <<: *state_color # remember this one? defined in the Domain above, also use here.
                         # Yaml anchors are defined per text file. Within that file you
                         # can re-use them anywhere.
                         # You can NOT use anchors from another file.
    
    switch.sw_freezer_bijkeuken*:
      templates:
        icon: >
          if (state == 'on') return 'mdi:fridge';
          return 'mdi:fridge-outline';
        <<: *state_color
    
    sensor.synology_exceeded_max_bad_sectors_*:
      templates:
        icon: >
          if (state == 'True') return 'mdi:alert-circle';
          return 'mdi:check-circle';
        icon_color: >
          if (state == 'True') return 'red';
          return 'green';
    
    sensor.synology_status_*:
      templates:
        icon_color: >
          if (state == 'warning') return 'red';
          return 'green';
    
    sensor.synology_below_min_remaining_life_*:
      templates:
        icon: >
          if (state == 'True') return 'mdi:alert-circle';
          return 'mdi:check-circle';
        icon_color: >
          if (state == 'True') return 'red';
          return 'green';
    
    sensor.*_motion_sensor_sensitivity:
      templates:
        icon: >
          return 'mdi:numeric-' + state + '-box-multiple-outline';
        icon_color: >
          if (state == '0') return 'grey';
          if (state == '1') return 'blue';
          if (state == '2') return 'green';
          if (state == '3') return 'orange';
          return 'red';

# This is another fine example, and very powerful using entity_picture on state:
    sensor.dark_sky*icon*:
      templates:
        entity_picture: >
          return '/local/weather/icons/' + state + '.png';

# since this doesn't have a guard, and 'unknown' could happen, I have an 'unknown.png' in
# same folder.

##########################################################################################
# Entities
# We all have some individually customized entities
##########################################################################################

  customize:
# Single Entity - Hide Editable
    input_boolean.development:
      hide_attributes:
        - editable

# or simply hide all attributes
    input_boolean.development:
      hide_attributes:
        - all

    sensor.synology_status_volume_1:
      templates:
        icon_color: >
          if (state == 'warning') return 'red';
          return 'green';
    
    device_tracker.tv_auditorium_samsung_8k:
      templates: &green_color
        icon_color: >
          if (state == 'home') return 'green';
          return 'steelblue';
    
    device_tracker.tv_library_philips:
      templates: *green_color
    
    device_tracker.ziggo_cablemodem:
      templates:
        entity_picture: >
          return '/local/devices/ziggo_' + entity.state + '.png'

# since this doesn't have a guard, and 'unknown' could happen, I have an 'unknown.png' in
# same folder.
    
    sensor.huidig_tarief:
      templates:
        icon: >
          if (state == '1') return 'mdi:numeric-1-box-multiple-outline';
          if (state == '2') return 'mdi:numeric-2-box-multiple-outline';
          return 'mdi:fire';
        icon_color: >
          if (state == '1') return 'green';
          return 'orange';

##########################################################################################
# Customize using attributes of States
##########################################################################################

# using an attribute (of the local entity)
    sensor.smart_meter:
      templates:
        icon_color: >
          if (attributes.power > 3000) return 'red';
          return green;

# using an attribute of another (global) entity
    sensor.power_consumption:
      templates:
        icon_color: >
          if (entities['sensor.smart_meter'].attributes.power > 3000) return 'red';
          return green;

##########################################################################################
# Some extravaganza ;-)
##########################################################################################

    sensor.owm_wind_bearing:
      friendly_name: Wind bearing
      templates: &direction_icon
        icon: >
          var icons = ['mdi:arrow-down','mdi:arrow-bottom-left','mdi:arrow-left',
                       'mdi:arrow-top-left','mdi:arrow-up','mdi:arrow-top-right',
                       'mdi:arrow-right','mdi:arrow-bottom-right'];
          var quadrant = Math.round(Number(state)/45);
          if (quadrant < icons.length) return icons[quadrant];
          return 'mdi:arrow-down';

# below is somewhat over the top, but it prevents one from creating template sensors for
# each and every light_level sensor
# it first creates the function to capitalize the first letter.
# also note the replace technique `/_/g`, necessary to replace all
# occurences of an '_'. The new function replaceAll() seems not to work just yet in all
# browsers. Lastly, note the 'escaped quotes', using `\'string\'`, necessary to have a quoted string
# in the returned value.
# btw, this is a glob customization so should go under `customize_glob:`

    sensor.*_sensor_light_level_raw:
      templates:
        friendly_name: >
          function capitalizeFirstLetter(string) {
              return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
              }
          var id = entity.entity_id.split('.')[1].split('_sensor_light_level_raw')[0].replace(/_/g,' ');
          var id = capitalizeFirstLetter(id);
          if (state < 1) return id + ': dark';
          if (state < 3000 ) return id + ': bright moonlight';
          if (state < 10000) return id + ': night light';
          if (state < 17000) return id + ': dimmed light';
          if (state < 22000) return id + ': \'cosy\' living room';
          if (state < 25500 ) return id + ': \'normal\' non-task light';
          if (state < 28500) return id + ': working / reading';
          if (state < 33000) return id + ': inside daylight';
          if (state < 40000) return id + ': maximum to avoid glare';
          if (state < 51000) return id + ': clear daylight';
          return id + ': direct sunlight';
    
    input_select.sound_bite_player:
      templates: &player_icon
        icon: >
          var player = {
            'Hub':'mdi:tablet-dashboard',
            'Woonkamer':'mdi:sofa',
            'Hall':'mdi:transit-transfer',
            'Master bedroom':'mdi:human-male-female',
            'Hobbykamer':'mdi:xbox',
            'Gym':'mdi:dumbbell',
            'Office':'mdi:desktop-mac',
            'Dorm M':'mdi:human-child',
            'Dorm L':'mdi:human-child',
            'TheBoss':'mdi:cellphone-iphone'};
          return player[state] ? player[state] : 'mdi:radio-tower';

# test if a string contains another string, or test for 2 strings, and select an entity_picture
# https://community.home-assistant.io/t/add-service-integration-reload/231940/52?u=mariusthvdb

    input_select.select_integration:
      templates:
        entity_picture: >
          var path = '/local/images/integrations/';
          return state.includes('Luftdaten')
                 ? path + 'luftdaten.png'
                 : state.includes('Philips') ? path + 'hue.png'
                 : path + state.toLowerCase() + '.png';

# Dont want to use a lot of 'if' statements, but calculate based on entity? That's fine, you can use any valid
# CCS color value, and template away:

    sensor.speedtest_upload:
      icon: mdi:arrow-up
      templates:
        icon_color: >
          var hue = Math.round(Number(state)/1000*240);
          return 'hsl(' + hue + ',80%,50%)';

# or
    sensor.speedtest_download:
      icon: mdi:arrow-down
      templates:
        icon_color: >
          var r = Math.round(Number(state)/1000*240);
          return 'rgb(' + r + ',200,0)';

# the above rgb() template is not very useful, but it is shown for illustrating purposes.

# customize based on the state of another entity:
    input_boolean.flash_color:
      templates:
        icon: >
          if (state == 'on') return 'mdi:alarm-light';
          return 'mdi:alarm-light-outline';
        icon_color: >
          if (state == 'on') return entities['input_select.select_flash_color'].state.toLowerCase();
          return 'steelblue';

##########################################################################################
# Even template the unit_of_measurement (with a guard for the startup sequence)
##########################################################################################

     binary_sensor.ha_update_available:
      templates:
        unit_of_measurement: >
          if (entities['sensor.ha_available_version']) return entities['sensor.ha_available_version'].state;
          return 'starting up';

 # or
       templates:
        unit_of_measurement: ${entities['sensor.ha_latest_version'].state}

 # Note the reference to the other entity using `entities[].state` is different from the JS templates used in eg
 # custom button-card, where a syntax with `states[].state` is used
```

# Single line notation
Though above templates all use my preferred syntax of the multiline notation, they can
also be written on single lines, as discussed in issue 29
https://github.com/Mariusthvdb/custom-ui/issues/29#issuecomment-757144431:

```yaml
homeassistant:
  customize_domain:
    device_tracker:
      templates:
        icon_color: if (state == 'home') return 'green';return 'purple';

  customize:
    binary_sensor.updater:
      templates:
        icon_color: if (state == 'on') return 'red';return 'green';

    device_tracker.hall:
      templates:
        icon_color: if (state == 'home') return 'green';return 'orange';
        icon: if (state == 'home') return 'mdi:speaker-wireless';return 'mdi:speaker-off';

    person.marius:
      templates:
        entity_picture: return '/local/images/family/marius_bmj_' + state + '.png';
```

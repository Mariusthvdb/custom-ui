## History
Since Home Assistant saw version 110.+, [icon handling in state-badge](https://github.com/home-assistant/frontend/issues/5892#issuecomment-630872617) has changed, causing the [original custom-ui](https://github.com/andrey-git/home-assistant-custom-ui) by @andrey-git to no longer be fully functional. 

The loss of icon_color would be a major pain, and reason enough to hold off updating Home Assistant until I would be able to globally colorize my icons again.

Second to that, it was announced that the `extra_html_url` config option was soon to be [deprecated and removed](https://github.com/home-assistant/frontend/issues/6028). So things had to change.

I rang [the alarmbell](https://github.com/home-assistant/frontend/issues/5892) on this, and the core Dev team (thanks Bram and Thomas) helped me transform the 'old' state-card-custom-ui.html import into a modern JS version. 

This adapted version makes it compatible again with HA 110+.

## No more States, Lovelace it is
Note that this adapted version doesn't hold all options of the original custom-ui. Since that was designed for Home Assistant States, and we now live Lovelace, many of these options are no longer supported or used. These are now 'carved out' of custom-ui too. Per-entity-theming for one was a major feature now defunct.
As are all other features specifically used in the state-cards. Like `show_last_changed`. We all know how to do that easily in Lovelace now.

### More-info
Coming from the original custom-ui, you may have used the [Customizer companion](https://github.com/andrey-git/home-assistant-customizer) too. We used that to hide stuff from the `more-info` windows. This was useful, because we could also hide the templates we set in custom-ui. However, current Lovelace broke customizer, resulting in:

![more-info](https://github.com/Mariusthvdb/custom-ui/blob/master/templates-in-more-info.png)

@CAB426 has changed custom-ui.js, so it again allows to hide attributes in `more-info`, and even better, we can now do so using custom-ui.js only.

More-info with `hide_attributes`:

![more-info](https://github.com/Mariusthvdb/custom-ui/blob/master/hidden-templates-more-info.png)

Ha 2021.6 changed Frontend representation of more-info attributes once again, and custom-ui updated to follow that. Thank you @spacegaier and Bram for helping out!

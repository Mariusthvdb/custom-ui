## History
Since Home Assistant saw version 110.+, [icon handling in state-badge](https://github.com/home-assistant/frontend/issues/5892#issuecomment-630872617) has changed, causing the [original custom-ui](https://github.com/andrey-git/home-assistant-custom-ui) by @andrey-git to no longer be fully functional. 

The loss of icon_color would be a major pain, and reason enough to hold off updating Home Assistant until I would be able to globally colorize my icons again.

Second to that, it was announced that the `extra_html_url` config option was soon to be [deprecated and removed](https://github.com/home-assistant/frontend/issues/6028). So things had to change.

I rang [the alarmbell](https://github.com/home-assistant/frontend/issues/5892) on this, and the core Dev team (thanks Bram and Thomas) helped me transform the 'old' state-card-custom-ui.html import into a modern JS version. 

This adapted version makes it compatible again with HA 110+.

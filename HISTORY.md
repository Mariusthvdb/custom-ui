## History
Since Home Assistant saw version 110.+, 
[icon handling in state-badge](https://github.com/home-assistant/frontend/issues/5892#issuecomment-630872617) 
has changed, causing the 
[original custom-ui](https://github.com/andrey-git/home-assistant-custom-ui) by @andrey-git to no 
longer be fully functional. 

The loss of `icon_color` would be a major pain, and reason enough to hold off updating Home 
Assistant until I would be able to globally colorize my icons again.

Second to that, it was announced that the `extra_html_url` config option was soon to be
[deprecated and removed](https://github.com/home-assistant/frontend/issues/6028). So things had to 
change.

I rang [the alarmbell](https://github.com/home-assistant/frontend/issues/5892) on this, and the 
core Dev team (thanks Bram and Thomas) helped me transform the 'old' state-card-custom-ui.html 
import into a modern JS version. 

This adapted version makes it compatible again with HA 110+.

## No more States, Lovelace it is
Note that this adapted version doesn't hold all options of the original custom-ui. Since that was 
designed for Home Assistant States, and we now live Lovelace, many of these options are no longer 
supported or used. These are now 'carved out' of custom-ui. Per-entity-theming for one was a major 
feature now defunct. As are all other features specifically used in the state-cards. 
Like `show_last_changed`. We all know how to do that easily in Lovelace now.

### More-info
Coming from the original custom-ui, you may have used the 
[Customizer companion](https://github.com/andrey-git/home-assistant-customizer) too. We used that 
to hide stuff from the `more-info` windows. This was useful, because we could also hide the 
templates we set in custom-ui. However, current Lovelace broke customizer, resulting in:

<img width="199" alt="templates-in-more-info" src="https://user-images.githubusercontent.com/812265/163999169-76d5c984-1a1c-4b19-a035-4293a9bb7d50.png">

@CAB426 has changed custom-ui.js, so it again allows us to hide attributes in `more-info`, and even 
better, we can now do so using custom-ui.js only.

More-info with `hide_attributes`:

<img width="199" alt="hidden-templates-more-info" src="https://user-images.githubusercontent.com/812265/163999236-e269b90f-92a0-48d6-b3bc-408f4ce35d01.png">

HA 2021.6 changed frontend representation of more-info attributes once again, and custom-ui updated 
to follow that. Thank you @spacegaier and Bram for helping out!

## Websocket update / HA 2022.4
As of Home Assistant 
[2022.4](https://www.home-assistant.io/blog/2022/04/06/release-20224/#frontend-ui-performance), 
the frontend will change and has 
[another way](https://github.com/home-assistant/frontend/pull/12016) of handling 
[Websockets](https://github.com/home-assistant/core/pull/67891). This heavily impacts custom-ui. 
As of then state changes are no longer followed, but entities are subscribed to. Checkout 
[Paulus's explanation](https://youtu.be/wOrJUWYYWdY?t=4862) in the 2022.4 release party on the 
matter.

For custom-ui this means the templates we use are no longer immediately executed, but need a view 
reload. Which obviously makes many templates useless, especially the ones that set an icon on state 
change (on/off...) or where a signal color was used as the indication of an alert color.

I did file an [issue](https://github.com/home-assistant/frontend/issues/12115) but fear that won't 
help a lot, as using custom-ui is on our own, and not a core HA project.
[@bratanon](https://github.com/bratanon) joined and he made the original minimized code more 
readable, and we have released a new and 2022.4 ready version.

## Templating `state` no longer supported
As of HA 2022.4, templating `state:` is no longer supported in custom-ui. We now show users a warning 
in the console if using the none supported `state:` templating. This means the actual entity state itself can no longer be customized.

```yaml
# !!! THIS DOES NOT WORK ANYMORE AND WILL SHOW A WARNING !!!
templates:
   state: if (state === 'home') return 'Online'; return 'Offline';
```

Using `state` **IN** the condition **WILL WORK** as that is core custom-ui functionality. 
```yaml
# This is STILL VALID
templates:
   icon_color: if (state === 'home') return 'blue'; return 'red';
```
**Note the "keys" (state, icon_color) differs.**

Other templating still works the same.

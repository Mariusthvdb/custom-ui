"use strict";

const Name = "Custom-ui";
const Version = "20221227-GPT";
const Description = "adapted for HA 2022.4 + ";
const Url = "https://github.com/Mariusthvdb/custom-ui";
console.info(
  `%c  ${Name}  \n%c  Version ${Version} ${Description}`,
  "color: gold; font-weight: bold; background: black",
  "color: white; font-weight: bold; background: steelblue"
);

window.customUI = window.customUI || {

  lightOrShadow: (elem, selector) => {
    let result;
    if (elem.shadowRoot) {
      result = elem.shadowRoot.querySelector(selector);
    } else {
      result = elem.querySelector(selector);
    }
    return result;
  },

  maybeApplyTemplateAttributes(hass, states, entity) {
    const newAttributes = {};
    Object.keys(entity.attributes.templates).forEach((key) => {
      if (key === "state") {
        console.warn(`State templating is not supported anymore, please check you customization for ${entity.entity_id}`);
        return;
      }
      const template = entity.attributes.templates[key];
      const value = window.customUI.computeTemplate(template, hass, states, entity, entity.attributes, (entity.untemplated_attributes?.[key]) || entity.attributes[key], entity.untemplated_state || entity.state);
      if (value === null) return;
      newAttributes[key] = value;
    });
    return {
      ...entity,
      attributes: {
        ...entity.attributes,
        ...newAttributes,
      },
      untemplated_attributes: entity.untemplated_attributes ?? entity.attributes,
    };
  },


  updateMoreInfo(ev) {
    if (!ev.detail.expanded) return;

    let s = 0;
    const i = setInterval(() => {
      s++;
      if (s >= 2) clearInterval(i);

      try {
        const homeAssistantEl = document.querySelector('home-assistant');
        const moreInfoDialogEl = homeAssistantEl.shadowRoot.querySelector('ha-more-info-dialog');
        const dialogEl = moreInfoDialogEl.shadowRoot.querySelector('ha-dialog');
        const contentEl = dialogEl.getElementsByClassName('content')[0];
        const moreInfoInfoEl = contentEl.querySelector('ha-more-info-info');
        const moreInfoContentEl = moreInfoInfoEl.shadowRoot.querySelector('more-info-content');
        const moreInfoEl = moreInfoContentEl.firstElementChild;
        const moreInfoNodeName = moreInfoEl.nodeName.toLowerCase();

        let t;
        if (moreInfoNodeName === 'more-info-group') {
          const moreInfoGroupEl = moreInfoEl;
          const moreInfoNestedEl = moreInfoGroupEl.firstElementChild;
          const moreInfoNestedNodeName = moreInfoNestedEl.nodeName.toLowerCase();
          t = moreInfoGroupEl.shadowRoot.querySelector(moreInfoNestedNodeName).shadowRoot.querySelector('ha-attributes').shadowRoot.querySelectorAll('.data-entry');
        } else {
          t = moreInfoEl.shadowRoot.querySelector('ha-attributes').shadowRoot.querySelectorAll('.data-entry');
        }

        if (t.length) {
          let e;
          for (let n = 0; n < t.length; n++) {
            const keyEl = t[n].getElementsByClassName('key')[0];
            if (keyEl.innerText.toLowerCase().trim() === 'hide attributes') {
              e = keyEl.parentNode.getElementsByClassName('value')[0].innerText.split(',').map((item) => item.replace('_', ' ').trim());
              e.push('hide attributes');
            }
          }

          for (let n = 0; n < t.length; n++) {
            const keyEl = t[n].getElementsByClassName('key')[0];
            if (e.includes(keyEl.innerText.toLowerCase().trim()) || e.includes('all')) keyEl.parentNode.style.display = 'none';
          }
          clearInterval(i);
        }
      } catch (err) {}
    }, 100);
  },

//   installStatesHook() {
//     const homeAssistant = customElements.get('home-assistant');
//     if (!homeAssistant?.prototype?._updateHass)
//       return;
//
//     const originalUpdate = homeAssistant.prototype._updateHass;
//     homeAssistant.prototype._updateHass = function update(obj) {
//       const { hass } = this;
//
//       if (obj.hasOwnProperty('states')) {
//         for (const key in obj.states) {
//           if (!obj.states.hasOwnProperty(key)) continue;
//
//           const entity = obj.states[key];
//
//           if (!entity.attributes.templates) continue;
//
//           const newEntity = window.customUI.maybeApplyTemplateAttributes(hass, obj.states, entity);
//           if (hass.states && entity !== hass.states[key]) {
//             obj.states[key] = newEntity;
//           } else if (entity !== newEntity) {
//             obj.states[key] = newEntity;
//           }
//         }
//       }
//
//       originalUpdate.call(this, obj);
//     };
//   },

// The main difference between the two code blocks is that the first one waits for the
// home-assistant custom element to be defined before it modifies the _updateHass method,
// while the second block modifies the _updateHass method immediately.
//
// In the first code block, the whenDefined method is used to wait until the home-assistant
// custom element is defined, and then it modifies the _updateHass method. This is useful
// if the home-assistant element has not yet been defined when the code is executed, as it
// ensures that the modification is applied only when the element is available.
//
// In the second code block, the _updateHass method is modified immediately, without waiting
// for the home-assistant element to be defined. This assumes that the home-assistant element
//  is already defined and available.
//
// Both code blocks perform the same function, which is to modify the _updateHass method
//  of the home-assistant element in order to update the states of the entity with a new
//   value. The difference is just in the way that the modification is applied, either
//    immediately or after waiting for the element to be defined.

  installStatesHook() {
    customElements.whenDefined("home-assistant").then(() => {
      const homeAssistant = customElements.get('home-assistant');
      if (!homeAssistant?.prototype?._updateHass) return;

      window.customUI.updateHass = homeAssistant.prototype._updateHass;
      homeAssistant.prototype._updateHass = function update(obj) {
        const { hass } = this;

        if (obj.states) {
          Object.values(obj.states).forEach((entity) => {
            if (!entity.attributes.templates) return;
            obj.states[entity.entity_id] = window.customUI.maybeApplyTemplateAttributes(hass, obj.states, entity);
          });
        }

        window.customUI.updateHass.call(this, obj);
      };
    });
  },


  installStateBadge() {
    customElements.whenDefined("state-badge").then(() => {
      const stateBadge = customElements.get('state-badge');
      if (!stateBadge) return;

      if (stateBadge.prototype.updated) {
        const originalUpdated = stateBadge.prototype.updated;
        stateBadge.prototype.updated = function customUpdated(changedProps) {
          if (!changedProps.has('stateObj')) return;

          const { stateObj } = this;

          if (stateObj.attributes.icon_color && !stateObj.attributes.entity_picture) {
            this.style.backgroundImage = '';
            this._showIcon = true;
            this._iconStyle= { color: stateObj.attributes.icon_color };
          }

          originalUpdated.call(this, changedProps);
        };
      }
    });
  },

  installClassHooks() {
    if (window.customUI.classInitDone)
      return;

    window.customUI.classInitDone = true;
    window.customUI.installStatesHook();
    window.customUI.installStateBadge();
  },

  init() {
    if (window.customUI.initDone)
      return;

    window.customUI.installClassHooks();

    const main = window.customUI.lightOrShadow(document, "home-assistant");
    if (!main.hass?.states) {
      window.setTimeout(window.customUI.init, 1000);
      return;
    }

    window.customUI.initDone = true;
    window.addEventListener("expanded-changed", window.customUI.updateMoreInfo);

    window.CUSTOM_UI_LIST = window.CUSTOM_UI_LIST || [];
    window.CUSTOM_UI_LIST.push({
      name: `${Name}`,
      version: `${Version} ${Description}`,
      url: `${Url}`
    });
  },

  computeTemplate(template, hass, entities, entity, attributes, attribute, state) {
    const functionBody = (template.indexOf('return') >= 0) ? template : `return \`${template}\`;`;

    try {
      return new Function('hass', 'entities', 'entity', 'attributes', 'attribute', 'state', functionBody)
      (hass, entities, entity, attributes, attribute, state);
    } catch (e) {
      if ((e instanceof SyntaxError) || e instanceof ReferenceError) {
        console.warn(`${e.name}: ${e.message} in template ${functionBody}`);
        return null;
      }
      throw e;
    }
  }
};

window.customUI.init();
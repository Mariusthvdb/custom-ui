"use strict";

const Name = "Custom-ui";
const Version = "20220416";
const Description = "adapted for HA 2022.4 + ";
const Url = "https://github.com/Mariusthvdb/custom-ui";
console.info(
  `%c  ${Name}  \n%c  Version ${Version} ${Description}`,
  "color: gold; font-weight: bold; background: black",
  "color: white; font-weight: bold; background: steelblue"
);

window.customUI = window.customUI || {

  lightOrShadow: (elem, selector) => elem.shadowRoot ? elem.shadowRoot.querySelector(selector) : elem.querySelector(selector),

  maybeApplyTemplateAttributes(hass, states, stateObj, attributes) {
    if (!attributes.templates) {
      return stateObj;
    }

    const newAttributes = {};
    Object.keys(attributes.templates).forEach((key) => {
      const template = attributes.templates[key];

      const value = window.customUI.computeTemplate(
        template, hass, states, stateObj, attributes, attributes[key],stateObj.state);

      if (value === null) return;
      newAttributes[key] = value;
    });

    if (stateObj.attributes === attributes) {
      const result = window.customUI.applyAttributes(stateObj, newAttributes);

      if (Object.prototype.hasOwnProperty.call(newAttributes, 'state')) {
        if (newAttributes.state !== null) {
          result.state = String(newAttributes.state);
          result.untemplated_state = stateObj.state;
        }
      }

      return result;
    }

    return Object.assign({}, stateObj);
  },

  maybeApplyTemplates(hass, states, stateObj) {
    const newResult = window.customUI.maybeApplyTemplateAttributes(
      hass, states, stateObj, stateObj.attributes);
    let hasChanges = (newResult !== stateObj);

    if (newResult !== stateObj) return newResult;
    if (hasChanges) {
      return Object.assign({}, stateObj);
    }
    return stateObj;
  },

  applyAttributes: (stateObj, attributes) => ({
    entity_id: stateObj.entity_id,
    state: stateObj.state,
    attributes: Object.assign({}, stateObj.attributes, attributes),
    untemplated_attributes: stateObj.attributes,
    last_changed: stateObj.last_changed,
    last_updated: stateObj.last_updated
  }),

  updateMoreInfo(ev) {
    if (!ev.detail.expanded)
      return;

    var s = 0, i = setInterval(function () {
      ++s >= 2 && clearInterval(i);
      try {
        var t;
        {
          var moreInfoNodeName;
          var contentChild;
          contentChild = document.querySelector("home-assistant").shadowRoot.querySelector("ha-more-info-dialog").shadowRoot.querySelector("ha-dialog").getElementsByClassName("content")[0].querySelector("more-info-content").childNodes;
          for (var c = 0; c < contentChild.length; c++) {
            var nodeItem = contentChild.item(c);
            if (nodeItem.nodeName.toLowerCase().startsWith("more-info-")) {
              moreInfoNodeName = nodeItem.nodeName.toLowerCase();
            }
          }

          if (moreInfoNodeName == "more-info-group") {
            var moreInfoNestedNodeName;
            var contentChildNested;
            contentChildNested = document.querySelector("home-assistant").shadowRoot.querySelector("ha-more-info-dialog").shadowRoot.querySelector("ha-dialog").getElementsByClassName("content")[0].querySelector("more-info-group").shadowRoot.childNodes;
            for (var c = 0; c < contentChildNested.length; c++) {
              var nodeItemNested = contentChildNested.item(c);

              if (nodeItemNested.nodeName.toLowerCase().startsWith("more-info-")) {
                moreInfoNestedNodeName = nodeItemNested.nodeName.toLowerCase();
              }
            }
            t = document.querySelector("home-assistant").shadowRoot.querySelector("ha-more-info-dialog").shadowRoot.querySelector("ha-dialog").getElementsByClassName("content")[0].querySelector("more-info-group").shadowRoot.querySelector(moreInfoNestedNodeName).shadowRoot.querySelector("ha-attributes").shadowRoot.querySelectorAll(".data-entry");
          } else {
            t = document.querySelector("home-assistant").shadowRoot.querySelector("ha-more-info-dialog").shadowRoot.querySelector("ha-dialog").getElementsByClassName("content")[0].querySelector(moreInfoNodeName).shadowRoot.querySelector("ha-attributes").shadowRoot.querySelectorAll(".data-entry");
          }
        }

        if (t.length) {
          var e;
          for (var n = 0; n < t.length; n++) {
            var o = t[n].getElementsByClassName("key")[0];
            if (o.innerText.toLowerCase().trim() == "hide attributes") {
              e = o.parentNode.getElementsByClassName("value")[0].innerText.split(",").map(function (item) {
                return item.replace("_", " ").trim();
              });
              e.push("hide attributes");
            }
          }

          for (var n = 0; n < t.length; n++) {
            var o = t[n].getElementsByClassName("key")[0];
            (e.includes(o.innerText.toLowerCase().trim()) || e.includes("all")) && (o.parentNode.style.display = "none");
          }
          clearInterval(i);
        }
      } catch (err) { }
    }, 100);
  },

  installStatesHook() {
    customElements.whenDefined("home-assistant").then(() => {
      const homeAssistant = customElements.get('home-assistant');
      if (!homeAssistant || !homeAssistant.prototype._updateHass) return;
      const originalUpdate = homeAssistant.prototype._updateHass;
      homeAssistant.prototype._updateHass = function update(obj) {
        const { hass } = this;
        if (obj.states) {
          Object.keys(obj.states).forEach((key) => {
            const entity = obj.states[key];
            const newEntity = window.customUI.maybeApplyTemplates(hass, obj.states, entity);
            if (hass.states && entity !== hass.states[key]) {
              obj.states[key] = newEntity;
            } else if (entity !== newEntity) {
              obj.states[key] = newEntity;
            }
          });
        }

        originalUpdate.call(this, obj);
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
            this._iconStyle= {
              color: stateObj.attributes.icon_color,
              filter: '',
            };
            originalUpdated.call(this, changedProps);
          } else {
            originalUpdated.call(this, changedProps);
          }
        };
      }
    });
  },

  installClassHooks() {
    if (window.customUI.classInitDone) return;
    window.customUI.classInitDone = true;
    window.customUI.installStatesHook();
    window.customUI.installStateBadge();
  },

  init() {
    if (window.customUI.initDone) return;
    window.customUI.installClassHooks();
    const main = window.customUI.lightOrShadow(document, "home-assistant");
    if (!main.hass || !main.hass.states) {
      window.setTimeout(window.customUI.init, 1000);
      return;
    }

    window.customUI.initDone = true;
    window.addEventListener("expanded-changed", window.customUI.updateMoreInfo);
  },

  computeTemplate(template, hass, entities, entity, attributes, attribute, state) {
    const functionBody = (template.indexOf('return') >= 0) ? template : `return \`${template}\`;`;

    try {
      return new Function('hass', 'entities', 'entity', 'attributes', 'attribute', 'state', functionBody)(hass, entities, entity, attributes, attribute, state);
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

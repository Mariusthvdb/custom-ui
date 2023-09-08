const Name = "Custom-ui";
const Version = "20230908";
const Description = "add templates and icon_color to UI";
const Url = "https://github.com/Mariusthvdb/custom-ui";
console.info(
  `%c  ${Name}  \n%c  Version ${Version} ${Description}`,
  "color: gold; font-weight: bold; background: black",
  "color: white; font-weight: bold; background: steelblue"
);
window.customUI = {
  lightOrShadow: (elem, selector) =>
    elem.shadowRoot
      ? elem.shadowRoot.querySelector(selector)
      : elem.querySelector(selector),
  async maybeApplyTemplateAttributes(hass, states, entity) {
    const newAttributes = {};
    const templateKeys = Object.keys(entity.attributes.templates);
    for (const key of templateKeys) {
      if (key === "state") {
        console.warn(
          `State templating is not supported anymore, please check your customization for ${entity.entity_id}`
        );
        continue;
      }
      const template = entity.attributes.templates[key];
      const value = await window.customUI.computeTemplate(
        template,
        hass,
        states,
        entity,
        entity.attributes,
        entity.untemplated_attributes?.[key] || entity.attributes[key],
        entity.untemplated_state || entity.state
      );
      if (value === null) continue;
      newAttributes[key] = value;
    }
    const newEntity = {
      ...entity,
      attributes: {
        ...entity.attributes,
        ...newAttributes
      },
      untemplated_attributes: entity.untemplated_attributes ?? entity.attributes
    };
    return newEntity;
  },
  updateMoreInfo(ev) {
    if (!ev.detail.expanded) return;
    const moreInfoInfo = document
      .querySelector("home-assistant")
      .shadowRoot.querySelector("ha-more-info-dialog")
      .shadowRoot.querySelector("ha-dialog")
      .getElementsByClassName("content")[0]
      .querySelector("ha-more-info-info");

    try {
      let t;
      {
        let moreInfoNodeName;
        const contentChild = moreInfoInfo.shadowRoot.querySelector(
          "more-info-content"
        ).childNodes;
        for (const nodeItem of contentChild) {
          if (nodeItem.nodeName.toLowerCase().startsWith("more-info-")) {
            moreInfoNodeName = nodeItem.nodeName.toLowerCase();
            break;
          }
        }
        if (moreInfoNodeName == "more-info-group") {
          let moreInfoNestedNodeName;
          const contentChildNested =
            moreInfoInfo.shadowRoot
              .querySelector("more-info-group")
              .shadowRoot.childNodes;
          for (const nodeItemNested of contentChildNested) {
            if (
              nodeItemNested.nodeName.toLowerCase().startsWith("more-info-")
            ) {
              moreInfoNestedNodeName = nodeItemNested.nodeName.toLowerCase();
              break;
            }
          }
          t = moreInfoInfo.shadowRoot
            .querySelector("more-info-group")
            .shadowRoot.querySelector(moreInfoNestedNodeName)
            .shadowRoot.querySelector("ha-attributes")
            .shadowRoot.querySelectorAll(".data-entry");
        } else {
          t = moreInfoInfo.shadowRoot
            .querySelector(moreInfoNodeName)
            .shadowRoot.querySelector("ha-attributes")
            .shadowRoot.querySelectorAll(".data-entry");
        }
      }
      if (t.length) {
        let e;
        for (const node of t) {
          const o = node.getElementsByClassName("key")[0];
  // make compatible for both 2023.8 and 2023.9
          if (o.innerText.toLowerCase().trim() == "hide attributes") {
            const valueContainer = o.parentNode.getElementsByClassName("value")[0];
            const haAttributeValue = valueContainer.querySelector('ha-attribute-value');
            const text = haAttributeValue
              ? haAttributeValue.shadowRoot.textContent
              : valueContainer.innerText;
            e = text
              .split(",")
              .map((item) => item.replace("_", " ").trim());
            e.push("hide attributes");
          }
        }
        for (const node of t) {
          const o = node.getElementsByClassName("key")[0];
          if (
            e.includes(o.innerText.toLowerCase().trim()) ||
            e.includes("all")
          ) {
            o.parentNode.style.display = "none";
          }
        }
      }
    } catch (err) {}
  },
  installStatesHook() {
    customElements.whenDefined("home-assistant").then(() => {
      const homeAssistant = customElements.get("home-assistant");
      if (!homeAssistant?.prototype?._updateHass) return;
      const originalUpdate = homeAssistant.prototype._updateHass;
      homeAssistant.prototype._updateHass = function update(obj) {
        const { hass } = this;
        if (obj.states) {
          Object.keys(obj.states).forEach(async (key) => {
            const entity = obj.states[key];
            if (!entity.attributes.templates) {
              return;
            }
            const newEntity =
              await window.customUI.maybeApplyTemplateAttributes(
                hass,
                obj.states,
                entity
              );
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
      const stateBadge = customElements.get("state-badge");
      if (!stateBadge) return;
      if (stateBadge.prototype?.updated) {
        const originalUpdated = stateBadge.prototype.updated;
        stateBadge.prototype.updated = function customUpdated(changedProps) {
          if (!changedProps.has("stateObj")) return;
          const { stateObj } = this;
          if (
            stateObj.attributes.icon_color &&
            !stateObj.attributes.entity_picture
          ) {
            this.style.backgroundImage = "";
            this._showIcon = true;
            this._iconStyle = {
              color: stateObj.attributes.icon_color
            };
          }
          originalUpdated.call(this, changedProps);
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
    if (!main?.hass?.states) {
      window.setTimeout(window.customUI.init, 1000);
      return;
    }
    window.customUI.initDone = true;
    window.addEventListener("expanded-changed", window.customUI.updateMoreInfo);
    window.CUSTOM_UI_LIST = window.CUSTOM_UI_LIST || [];
    window.CUSTOM_UI_LIST.push({
      name: Name,
      version: `${Version} ${Description}`,
      url: Url
    });
  },
  computeTemplate(
    template,
    hass,
    entities,
    entity,
    attributes,
    attribute,
    state
  ) {
    const functionBody =
      template.indexOf("return") >= 0 ? template : `return \`${template}\`;`;
    try {
      return new Function(
        "hass",
        "entities",
        "entity",
        "attributes",
        "attribute",
        "state",
        functionBody
      )(hass, entities, entity, attributes, attribute, state);
    } catch (e) {
      if (e instanceof SyntaxError || e instanceof ReferenceError) {
        console.warn(`${e.name}: ${e.message} in template ${functionBody}`);
        return null;
      }
      throw e;
    }
  }
};
window.customUI.init();

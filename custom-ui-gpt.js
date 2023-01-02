"use strict";

const Name = "Custom-ui";
const Version = "20230102-GPT";
const Description = "adapted for HA 2022.4 + ";
const Url = "https://github.com/Mariusthvdb/custom-ui";
console.info(
  `%c  ${Name}  \n%c  Version ${Version} ${Description}`,
  "color: gold; font-weight: bold; background: black",
  "color: white; font-weight: bold; background: steelblue"
);
window.customUI = window.customUI || {
  lightOrShadow(elem, selector) {
    const result = elem.shadowRoot
      ? elem.shadowRoot.querySelector(selector)
      : elem.querySelector(selector);
    return result;
  },
  maybeApplyTemplateAttributes(hass, states, entity) {
    var _entity$untemplated_a2;
    const newAttributes = {};
    Object.keys(entity.attributes.templates).forEach((key) => {
      var _entity$untemplated_a;
      if (key === "state") {
        console.warn(
          `State templating is not supported anymore, please check you customization for ${entity.entity_id}`
        );
        return;
      }
      const template = entity.attributes.templates[key];
      const value = window.customUI.computeTemplate(
        template,
        hass,
        states,
        entity,
        entity.attributes,
        ((_entity$untemplated_a = entity.untemplated_attributes) === null ||
        _entity$untemplated_a === void 0
          ? void 0
          : _entity$untemplated_a[key]) || entity.attributes[key],
        entity.untemplated_state || entity.state
      );
      if (value === null) return;
      newAttributes[key] = value;
    });
    return {
      ...entity,
      attributes: {
        ...entity.attributes,
        ...newAttributes
      },
      untemplated_attributes:
        (_entity$untemplated_a2 = entity.untemplated_attributes) !== null &&
        _entity$untemplated_a2 !== void 0
          ? _entity$untemplated_a2
          : entity.attributes
    };
  },
  updateMoreInfo(ev) {
    if (!ev.detail.expanded) return;
    let homeAssistantEl;
    let moreInfoDialogEl;
    let dialogEl;
    let contentEl;
    let moreInfoInfoEl;
    let moreInfoContentEl;
    let moreInfoEl;
    let moreInfoNodeName;
    let moreInfoGroupEl;
    let moreInfoNestedEl;
    let moreInfoNestedNodeName;
    let attributesEl;
    let t;
    let e;
    const checkElements = () => {
      homeAssistantEl =
        homeAssistantEl || document.querySelector("home-assistant");
      moreInfoDialogEl =
        moreInfoDialogEl ||
        homeAssistantEl.shadowRoot.querySelector("ha-more-info-dialog");
      dialogEl =
        dialogEl || moreInfoDialogEl.shadowRoot.querySelector("ha-dialog");
      contentEl = contentEl || dialogEl.getElementsByClassName("content")[0];
      moreInfoInfoEl =
        moreInfoInfoEl || contentEl.querySelector("ha-more-info-info");
      moreInfoContentEl =
        moreInfoContentEl ||
        moreInfoInfoEl.shadowRoot.querySelector("more-info-content");
      moreInfoEl = moreInfoEl || moreInfoContentEl.firstElementChild;
      moreInfoNodeName = moreInfoNodeName || moreInfoEl.nodeName.toLowerCase();
      if (moreInfoNodeName === "more-info-group") {
        moreInfoGroupEl = moreInfoGroupEl || moreInfoEl;
        moreInfoNestedEl =
          moreInfoNestedEl || moreInfoGroupEl.firstElementChild;
        moreInfoNestedNodeName =
          moreInfoNestedNodeName || moreInfoNestedEl.nodeName.toLowerCase();
        attributesEl =
          attributesEl ||
          moreInfoGroupEl.shadowRoot
            .querySelector(moreInfoNestedNodeName)
            .shadowRoot.querySelector("ha-attributes").shadowRoot;
      } else {
        attributesEl =
          attributesEl ||
          moreInfoEl.shadowRoot.querySelector("ha-attributes").shadowRoot;
      }
      t = attributesEl ? attributesEl.querySelectorAll(".data-entry") : null;
      if (t && t.length) {
        e = [];
        for (const entry of t) {
          const keyEl = entry.getElementsByClassName("key")[0];
          if (keyEl.innerText.toLowerCase().trim() === "hide attributes") {
            e = keyEl.parentNode
              .getElementsByClassName("value")[0]
              .innerText.split(",")
              .map((item) => item.replace("_", " ").trim());
            e.push("hide attributes");
          }
        }
        for (const entry of t) {
          const keyEl = entry.getElementsByClassName("key")[0];
          if (
            e.includes(keyEl.innerText.toLowerCase().trim()) ||
            e.includes("all")
          )
            keyEl.parentNode.style.display = "none";
        }
      } else {
        // elements are not available yet, schedule another check
        requestAnimationFrame(checkElements);
      }
    };
    requestAnimationFrame(checkElements);
  },
  installStatesHook() {
    customElements.whenDefined("home-assistant").then(() => {
      var _homeAssistant$protot;
      const homeAssistant = customElements.get("home-assistant");
      if (
        !(
          homeAssistant !== null &&
          homeAssistant !== void 0 &&
          (_homeAssistant$protot = homeAssistant.prototype) !== null &&
          _homeAssistant$protot !== void 0 &&
          _homeAssistant$protot._updateHass
        )
      )
        return;
      window.customUI.updateHass = homeAssistant.prototype._updateHass;
      homeAssistant.prototype._updateHass = function update(obj) {
        const { hass } = this;
        if (obj.states) {
          Object.values(obj.states).forEach((entity) => {
            if (!entity.attributes.templates) return;
            obj.states[entity.entity_id] =
              window.customUI.maybeApplyTemplateAttributes(
                hass,
                obj.states,
                entity
              );
          });
        }
        window.customUI.updateHass.call(this, obj);
      };
    });
  },
  installStateBadge() {
    customElements.whenDefined("state-badge").then(() => {
      const stateBadge = customElements.get("state-badge");
      if (!stateBadge) return;
      if (stateBadge.prototype.updated) {
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
    var _main$hass;
    if (window.customUI.initDone) return;
    window.customUI.installClassHooks();
    const main = window.customUI.lightOrShadow(document, "home-assistant");
    if (
      !(
        (_main$hass = main.hass) !== null &&
        _main$hass !== void 0 &&
        _main$hass.states
      )
    ) {
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
      const computeTemplateFn = new Function(
        "hass",
        "entities",
        "entity",
        "attributes",
        "attribute",
        "state",
        functionBody
      );
      let result;
      let error;
      do {
        try {
          result = computeTemplateFn(
            hass,
            entities,
            entity,
            attributes,
            attribute,
            state
          );
          error = null;
        } catch (e) {
          if (e instanceof SyntaxError || e instanceof ReferenceError) {
            console.warn(`${e.name}: ${e.message} in template ${functionBody}`);
            return null;
          }
          error = e;
        }
      } while (error);
      return result;
    } catch (e) {
      throw e;
    }
  }
};
window.customUI.init();

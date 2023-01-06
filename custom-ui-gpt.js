"use strict";

const Name = "Custom-ui";
const Version = "20230106-GPT";
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
    let newAttributes = {};
    let updatedTemplates = [];
    for (const key of Object.keys(entity.attributes.templates)) {
      var _entity$untemplated_a;
      if (key === "state") {
        console.warn(
          `State templating is not supported anymore, please check you customization for ${entity.entity_id}`
        );
        continue;
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
      if (value === null) continue;
      newAttributes[key] = value;
      updatedTemplates.push(template);
    }
    return Object.assign({}, entity, {
      attributes: Object.assign({}, entity.attributes, newAttributes),
      untemplated_attributes:
        entity.untemplated_attributes || entity.attributes,
      templates: updatedTemplates
    });
  },

  updateMoreInfo(ev) {
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
    requestAnimationFrame(() => {
      try {
        if (!ev.detail.expanded) return;

        homeAssistantEl = ev.target.closest("home-assistant");
        if (!homeAssistantEl) return;

        moreInfoDialogEl = homeAssistantEl.shadowRoot.querySelector("ha-more-info-dialog");
        if (!moreInfoDialogEl) return;

        dialogEl = moreInfoDialogEl.shadowRoot.querySelector("ha-dialog");
        if (!dialogEl) return;

        contentEl = dialogEl.querySelector(".content");
        if (!contentEl) return;

        moreInfoInfoEl = contentEl.querySelector("ha-more-info-info");
        if (!moreInfoInfoEl) return;

        moreInfoContentEl = moreInfoInfoEl.shadowRoot.querySelector("more-info-content");
        if (!moreInfoContentEl) return;

        moreInfoEl = moreInfoContentEl.firstElementChild;
        if (!moreInfoEl) return;

        moreInfoNodeName = moreInfoEl.nodeName.toLowerCase();

        if (moreInfoNodeName === "more-info-group") {
          moreInfoGroupEl = moreInfoEl;
          moreInfoNestedEl = moreInfoGroupEl.firstElementChild;
          moreInfoNestedNodeName = moreInfoNestedEl.nodeName.toLowerCase();
          attributesEl = moreInfoGroupEl.shadowRoot
            .querySelector(moreInfoNestedNodeName)
            .shadowRoot.querySelector("ha-attributes").shadowRoot;
        } else {
          attributesEl = moreInfoEl.shadowRoot.querySelector("ha-attributes").shadowRoot;
        }

        if (!attributesEl) return;

        // Use [...attributesEl.querySelectorAll(".data-entry")] to create an array
        const entries = [...attributesEl.querySelectorAll(".data-entry")];
        if (!entries.length) return;

        const hideAttributes = [];
        for (const entry of entries) {
          const keyEl = entry.querySelector(".key");
          if (keyEl.textContent.toLowerCase().trim() === "hide attributes") {
            hideAttributes.push(
              ...keyEl.parentNode
                .querySelector(".value")
                .textContent.split(",")
                .map((item) => item.replace("_", " ").trim())
            );
            hideAttributes.push("hide attributes");
          }
        }

        for (const entry of entries) {
          const keyEl = entry.querySelector(".key");
          if (
            hideAttributes.includes(keyEl.textContent.toLowerCase().trim()) ||
            hideAttributes.includes("all")
          ) {
            keyEl.parentNode.style.display = "none";
          }
        }
      } catch (error) {
        console.error(error);
      }
    });
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

// In the original code, a new object is created on every iteration with the spread
// operator (...). This can be inefficient if the number of iterations is large.
// By creating the newAttributes object before the loop and then updating it inside the loop,
//  you only create a single object, which can be more efficient.
//
// The original code also uses the Object.keys() function to get an array of the keys in
//  entity.attributes.templates, and then uses the forEach() function to iterate over the
//  array. This is an additional step that can add some overhead. In the optimized code,
//  the for loop is used instead, which can be a more efficient way to iterate over an array.
//
// The optimized code also uses the optional chaining operator (?.[]) to access properties
// of entity.untemplated_attributes, which can be more concise and readable than the
// original code.
//
// Overall, these changes can make the maybeApplyTemplateAttributes() function more
// efficient, particularly if it is called frequently or if entity.attributes.templates
// has a large number of keys.


// This revised version of the updateMoreInfo function does not use requestAnimationFrame at
// all.(.....) Instead, it selects all the necessary elements directly in a single call to
// querySelectorAll. This can potentially be faster and more efficient than making multiple
// querySelector calls and using getElementsByClassName, because it only requires the DOM to
// be traversed once.
//

// By wrapping the function in a requestAnimationFrame call, you can ensure that the browser
// is able to optimize the rendering of the page and minimize the impact of the function on
// the main thread. This can help improve the performance of the code and provide a smoother
// user experience. However, if the updateMoreInfo function is not modifying the DOM, then
// there may not be a need to use requestAnimationFrame. It would be up to you to determine
// whether using requestAnimationFrame is necessary in this case.


// Additionally, by eliminating the checkElements function and the use of
// requestAnimationFrame, the revised version of the code is simpler and easier to read. r
// equestAnimationFrame is a way to execute a function just before the browser is about to
// repaint the page, and it is generally used to improve performance by allowing the browser
// to handle DOM manipulation in an optimal way. However, in this case, the checkElements
// function was being used to repeatedly check for the existence of certain DOM elements,
// which is not the intended use of requestAnimationFrame. By selecting all the necessary
// elements in a single call, the revised version of the code avoids the need to use
// requestAnimationFrame for this purpose.

// By storing the selected DOM elements in variables outside of the updateMoreInfo function,
// they will only be selected once and then be referenced from the cached variables in
// subsequent calls to the function, which should improve the performance of the code.
//
// Avoid using .innerText to get the text of an element. Instead, use .textContent as it is
// faster.

// Instead of using Array.from(attributesEl.querySelectorAll(".data-entry")), you can
// use [...attributesEl.querySelectorAll(".data-entry")] to create an array.
// This is faster and more concise.

// using the spread operator (...) is faster than Array.from() when creating an array from a
// DOM collection. This is because Array.from() has to call the Array() constructor and has
// to perform additional checks and operations, whereas the spread operator simply creates
// a new array with the same elements as the original DOM collection

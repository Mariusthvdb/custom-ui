// Define constants for the custom-ui component
const Name = "Custom-ui";
const Version = "20230802";
const Description = "add icon_color and templates";
const Url = "https://github.com/Mariusthvdb/custom-ui";

// Log information about the custom-ui component
console.info(
  `%c  ${Name}  \n%c  Version ${Version} ${Description}`,
  "color: gold; font-weight: bold; background: black",
  "color: white; font-weight: bold; background: steelblue"
);

// Define the custom-ui object and its methods
window.customUI = {
  // Helper function to find an element either in shadowRoot or regular DOM
  lightOrShadow: (elem, selector) =>
    elem.shadowRoot
      ? elem.shadowRoot.querySelector(selector)
      : elem.querySelector(selector),
  // Apply template attributes to an entity's attributes
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
  // Update the more-info dialog to hide certain attributes based on custom logic
//   async updateMoreInfo(ev) {
//     if (!ev.detail.expanded) return;
//     const moreInfoInfo = document
//       .querySelector("home-assistant")
//       .shadowRoot.querySelector("ha-more-info-dialog")
//       .shadowRoot.querySelector("ha-dialog")
//       .getElementsByClassName("content")[0]
//       .querySelector("ha-more-info-info");
//
//     try {
//       let t;
//       {
//         let moreInfoNodeName;
//         const contentChild = moreInfoInfo.shadowRoot.querySelector(
//           "more-info-content"
//         ).childNodes;
//         for (const nodeItem of contentChild) {
//           if (nodeItem.nodeName.toLowerCase().startsWith("more-info-")) {
//             moreInfoNodeName = nodeItem.nodeName.toLowerCase();
//             break;
//           }
//         }
//         if (moreInfoNodeName == "more-info-group") {
//           let moreInfoNestedNodeName;
//           const contentChildNested =
//             moreInfoInfo.shadowRoot
//               .querySelector("more-info-group")
//               .shadowRoot.childNodes;
//           for (const nodeItemNested of contentChildNested) {
//             if (
//               nodeItemNested.nodeName.toLowerCase().startsWith("more-info-")
//             ) {
//               moreInfoNestedNodeName = nodeItemNested.nodeName.toLowerCase();
//               break;
//             }
//           }
//           t = moreInfoInfo.shadowRoot
//             .querySelector("more-info-group")
//             .shadowRoot.querySelector(moreInfoNestedNodeName)
//             .shadowRoot.querySelector("ha-attributes")
//             .shadowRoot.querySelectorAll(".data-entry");
//         } else {
//           t = moreInfoInfo.shadowRoot
//             .querySelector(moreInfoNodeName)
//             .shadowRoot.querySelector("ha-attributes")
//             .shadowRoot.querySelectorAll(".data-entry");
//         }
//       }
//       if (t.length) {
//         let e;
//         for (const node of t) {
//           const o = node.getElementsByClassName("key")[0];
//           if (o.innerText.toLowerCase().trim() == "hide attributes") {
//             e = o.parentNode
//               .getElementsByClassName("value")[0]
//               .innerText.split(",")
//               .map((item) => item.replace("_", " ").trim());
//             e.push("hide attributes");
//           }
//         }
//         for (const node of t) {
//           const o = node.getElementsByClassName("key")[0];
//           if (
//             e.includes(o.innerText.toLowerCase().trim()) ||
//             e.includes("all")
//           ) {
//             o.parentNode.style.display = "none";
//           }
//         }
//       }
//     } catch (err) {}
//   },

  // Install a hook to update the states with template attributes
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
  // Install a hook to update the state badge with custom styling
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
  // Install the hooks for updating states and state badges
  installClassHooks() {
    window.customUI.installStatesHook();
    window.customUI.installStateBadge();
  },
  async init() {
    // Check if initialization has already been done
    if (window.customUI.initDone) return;

    // Wait for the hass.states to be populated
    const main = window.customUI.lightOrShadow(document, "home-assistant");
    await new Promise((resolve) => {
      const intervalId = setInterval(() => {
        if (main?.hass?.states) {
          clearInterval(intervalId);
          resolve();
        }
      }, 100);
    });

    // Install the hooks and mark initialization as done
    window.customUI.installClassHooks();
    window.customUI.initDone = true;

    // Add an event listener for expanded-changed events
//     window.addEventListener("expanded-changed", window.customUI.updateMoreInfo);

    // Push custom-ui information to a global list
    window.CUSTOM_UI_LIST = window.CUSTOM_UI_LIST || [];
    window.CUSTOM_UI_LIST.push({
      name: Name,
      version: `${Version} ${Description}`,
      url: Url
    });
  },
  // Evaluate a template expression
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
      console.warn(`${e.name}: ${e.message} in custom-ui template ${functionBody}`);
      return null;
    }
  }
};
// Initialize the custom-ui component
window.customUI.init();


// The code you provided seems to be responsible for initializing and setting up some hooks in your application. Here are a few suggestions for potential improvements:
//
// Consolidate Hook Installation: Currently, the installClassHooks function checks if the hooks have already been installed and then sets a flag to avoid repeated installation. Instead of checking the flag in both installClassHooks and init functions, you can move the flag check to the init function and directly call installClassHooks without the need for a separate flag.
// Use setTimeout with Promises: In the init function, you're using setTimeout to delay the initialization if main.hass.states is falsy. Instead of using setTimeout, you can use await with a Promise to wait for a certain condition to be met. For example, you could wrap the initialization logic in a Promise and use await to delay the execution until main.hass.states is truthy.
// Error Handling in computeTemplate: In the computeTemplate function, you catch SyntaxError and ReferenceError exceptions and log a warning. However, you rethrow other types of exceptions. It might be beneficial to handle all types of exceptions consistently, either by logging warnings or by throwing them.

// Here are the applied recommendations:
//
// Consolidate Hook Installation: The flag check for installation has been moved to the init function, and the installClassHooks function is directly called without the need for a separate flag.
// Use setTimeout with Promises: The use of setTimeout has been replaced with await and a Promise to wait for the main.hass.states to be populated before initializing.
// Error Handling in computeTemplate: The error handling in computeTemplate has been updated to log a warning for all types of exceptions consistently.
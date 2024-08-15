// Define constants for the custom-ui component
const NAME = "Custom-attributes-templates";
const VERSION = "20240815";
const DESCRIPTION = "add attributes templates";
const URL = "https://github.com/Mariusthvdb/custom-ui";

// Log information about the custom-ui component
console.groupCollapsed(
  `%c ${NAME} ${VERSION} is installed \n%c ${DESCRIPTION}`,
  "color: red; font-weight: bold; background: black",
  "color: white; font-weight: bold; background: steelblue"
);
console.log("Readme:", URL);
console.groupEnd();

// Define the custom-ui object and its methods
window.customUI = {
  // Helper function to find an element either in shadowRoot or regular DOM
  lightOrShadow: (elem, selector) =>
    elem.shadowRoot ? elem.shadowRoot.querySelector(selector) : elem.querySelector(selector),

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
      const value = await this.computeTemplate(
        template,
        hass,
        states,
        entity,
        entity.attributes,
        entity.untemplated_attributes?.[key] || entity.attributes[key],
        entity.untemplated_state || entity.state
      );
      if (value !== null) {
        newAttributes[key] = value;
      }
    }
    return {
      ...entity,
      attributes: {
        ...entity.attributes,
        ...newAttributes,
      },
      untemplated_attributes: entity.untemplated_attributes ?? entity.attributes,
    };
  },

  // Install a hook to update the states with template attributes
  installTemplateAttributesHook() {
    customElements.whenDefined("home-assistant").then(() => {
      const homeAssistant = customElements.get("home-assistant");
      if (!homeAssistant?.prototype?._updateHass) return;
      const originalUpdate = homeAssistant.prototype._updateHass;
      homeAssistant.prototype._updateHass = async function update(obj) {
        if (obj.states) {
          for (const key of Object.keys(obj.states)) {
            const entity = obj.states[key];
            if (entity.attributes.templates) {
              const newEntity = await window.customUI.maybeApplyTemplateAttributes(
                this.hass,
                obj.states,
                entity
              );
              if (JSON.stringify(entity) !== JSON.stringify(newEntity)) {
                obj.states[key] = newEntity;
              }
            }
          }
        }
        originalUpdate.call(this, obj);
      };
    });
  },

  // Evaluate a template expression
  computeTemplate(template, hass, entities, entity, attributes, attribute, state) {
    const functionBody = template.includes("return") ? template : `return \`${template}\`;`;
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
  },

  async init() {
    if (this.initDone) return;

    // Wait for the hass.states to be populated
    await new Promise((resolve) => {
      const intervalId = setInterval(() => {
        const main = this.lightOrShadow(document, "home-assistant");
        if (main?.hass?.states) {
          clearInterval(intervalId);
          resolve();
        }
      }, 100);
    });

    // Install the hooks and mark initialization as done
    this.installTemplateAttributesHook();
    this.initDone = true;

    // Push custom-ui information to a global list
    window.CUSTOM_UI_LIST = window.CUSTOM_UI_LIST || [];
    window.CUSTOM_UI_LIST.push({
      name: NAME,
      version: `${VERSION} ${DESCRIPTION}`,
      url: URL,
    });
  },
};

// Initialize the custom-ui component
window.customUI.init();

// Key Optimizations:
// Consolidated Hook Installation: The installation of hooks is now managed entirely
// within init, removing the need for redundant checks.
//
// Simplified Hook Installation: The installCustomHooks function has been removed
// since it only called one method. The hook installation (installTemplateAttributesHook)
// is now directly invoked within the init method.

// Promise-based Initialization: Used await with a Promise to handle the asynchronous
// waiting, ensuring that the initialization occurs only after hass.states is populated.
//
// Consistent Error Handling: The computeTemplate function now catches and logs all
// exceptions, providing more consistent error handling.
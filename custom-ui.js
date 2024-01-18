// Define constants for the custom-ui component
const Name = "Custom-ui";
const Version = "20240118";
const Description = "add attributes icon_color and templates";
const Url = "https://github.com/Mariusthvdb/custom-ui";

// Log information about the custom-ui component
console.groupCollapsed(
  `%c ${Name} ${Version} is installed \n%c ${Description} `,
  "color: gold; font-weight: bold; background: black",
  "color: white; font-weight: bold; background: steelblue"),
console.log("Readme:",Url),
console.groupEnd()

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

// Install a hook to update the states with template attributes
  installTemplateAttributesHook() {
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
            if (hass.states && JSON.stringify(entity) !== JSON.stringify(hass.states[key])) {
              obj.states[key] = newEntity;
            } else if (JSON.stringify(entity) !== JSON.stringify(newEntity)) {
              obj.states[key] = newEntity;
            }
          });
        }
        originalUpdate.call(this, obj);
      };
    });
  },

// Install a hook to update the button card with custom styling
  installButtonCardStylingHook() {
    customElements.whenDefined("hui-button-card").then(() => {
        const buttonCard = customElements.get("hui-button-card");
        if (!buttonCard) return;
        if (buttonCard.prototype?.updated) {
            const originalUpdated = buttonCard.prototype.updated;
            buttonCard.prototype.updated = function customUpdated(changedProps) {
                if (!changedProps.has('_stateObj')) {
                    return;
                }
                const { _stateObj } = this;
                if (_stateObj.attributes?.icon_color) {
                    this.style?.setProperty('--icon-primary-color', _stateObj.attributes.icon_color);
                }
                originalUpdated.call(this, changedProps);
            }
        }
    });
  },

// Install a hook to update the entity card with custom styling
  installEntityCardStylingHook() {
    customElements.whenDefined("hui-entity-card").then(() => {
      const entityCard = customElements.get("hui-entity-card");
      if (!entityCard) return;
      if (entityCard.prototype?.updated) {
        const originalUpdated = entityCard.prototype.updated;
        entityCard.prototype.updated = function customUpdated(changedProps) {
          if (
            !changedProps.has('_config') ||
            !changedProps.has('hass')
          ) {
            return;
          }
          const { _config, hass } = this;
          const entityId = _config?.entity;
          const states = hass?.states;
          const iconColor = states?.[entityId]?.attributes?.icon_color;
          if (iconColor) {
            this.style?.setProperty('--paper-item-icon-color', iconColor);
          }
          originalUpdated.call(this, changedProps);
        }
      }
    });
  },

// Install a hook to update the Tile card with custom styling
  installTileCardStylingHook() {
    customElements.whenDefined("hui-tile-card").then(() => {
        const tileCard = customElements.get("hui-tile-card");
        if (!tileCard) return;
        if (tileCard.prototype?.updated) {
            const originalUpdated = tileCard.prototype.updated;
            tileCard.prototype.updated = function customUpdated(changedProps) {

                if (
                    !changedProps.has('_config') ||
                    !changedProps.has('hass')
                ) {
                    return;
                }
                const { _config, hass } = this;
                const entityId = _config?.entity;
                const states = hass?.states;
                const iconColor = states?.[entityId]?.attributes?.icon_color;

                if (iconColor) {
                    this.style?.setProperty('--icon-primary-color', iconColor);
                }
                originalUpdated.call(this, changedProps);
            }
        }
    });
  },

// Install a hook to update the state badge with custom styling
  installStateBadgeStylingHook() {
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

// Install the hooks for updating states, entity cards, and state badges
  installCustomHooks() {
    window.customUI.installTemplateAttributesHook();
    window.customUI.installButtonCardStylingHook();
    window.customUI.installEntityCardStylingHook();
    window.customUI.installTileCardStylingHook();
    window.customUI.installStateBadgeStylingHook();
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
    window.customUI.installCustomHooks();
    window.customUI.initDone = true;

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

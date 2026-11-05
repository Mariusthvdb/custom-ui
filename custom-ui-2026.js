// === Meta ===
const Name = "Custom-ui";
const Version = "20261105";
const Description = "add attributes icon_color and templates";
const Url = "https://github.com/Mariusthvdb/custom-ui";

console.groupCollapsed(
  `%c ${Name} ${Version} is installed \n%c ${Description} `,
  "color: gold; font-weight: bold; background: black",
  "color: white; font-weight: bold; background: steelblue"
);
console.log("Readme:", Url);
console.groupEnd();

// Define the custom-ui object and its methods
window.customUI = {
  // Debug logging follows this browser's own HA toggle (Settings > Tools > Debug
  // writes the localStorage "debugConnection" key), so each browser debugs independently.
  get debug() {
    try { return !!localStorage.getItem("debugConnection"); } catch (e) { return false; }
  },

  // Helper function to find an element either in shadowRoot or regular DOM
  lightOrShadow(elem, selector) {
    const root = elem?.renderRoot ?? elem?.shadowRoot ?? elem;
    return root?.querySelector(selector);
  },

  // Apply template attributes to an entity's attributes
  async maybeApplyTemplateAttributes(hass, states, entity) {
    const templates = entity.attributes?.templates;
    if (!templates) return entity;

    const newAttributes = {};
    const templateKeys = Object.keys(templates);

    for (const key of templateKeys) {
      if (key === "state") {
        console.warn(
          `State templating is not supported anymore, please check your customization for ${entity.entity_id}`
        );
        continue;
      }

      const template = templates[key];
      const value = await window.customUI.computeTemplate(
        template,
        hass,
        states,
        entity,
        entity.attributes,
        entity.untemplated_attributes?.[key] || entity.attributes[key],
        entity.untemplated_state || entity.state
      );

      if (value !== null) newAttributes[key] = value;
    }

    if (!Object.keys(newAttributes).length) return entity;

    return {
      ...entity,
      attributes: {
        ...entity.attributes,
        ...newAttributes
      },
      untemplated_attributes: entity.untemplated_attributes ?? entity.attributes
    };
  },

  // Install a hook to update the states with template attributes (content-hash skip + counters)
  installTemplateAttributesHook() {
    customElements.whenDefined("home-assistant").then(() => {
      const homeAssistant = customElements.get("home-assistant");
      if (!homeAssistant?.prototype?._updateHass) return;

      const originalUpdate = homeAssistant.prototype._updateHass;

      homeAssistant.prototype._updateHass = new Proxy(originalUpdate, {
        async apply(target, thisArg, args) {
          const obj = args[0];
          const hass = thisArg.hass;

          if (obj.states && hass?.states) {

            // === Micro-counter ===
            let totalWithTemplates = 0;
            let totalEvaluated = 0;
            let totalSkipped = 0;
            let evaluatedList = [];

            for (const key of Object.keys(obj.states)) {
              const entity = obj.states[key];
              if (!entity.attributes?.templates) continue;

              totalWithTemplates++;

              // === Build ultra-light content hash ===
              const templateKeys = Object.keys(entity.attributes.templates);

              const attrHash = templateKeys
                .map(k => `${k}:${entity.attributes[k]}`)
                .join("|");

              const untHash = templateKeys
                .map(k => `${k}:${entity.untemplated_attributes?.[k]}`)
                .join("|");

              const currHash = `${entity.state}|${attrHash}|${untHash}`;
              const prevHash = entity._customUiHash;

              // === Skip if content identical ===
              if (prevHash === currHash) {
                totalSkipped++;
                obj.states[key] = entity;
                continue;
              }

              // === Evaluate templates ===
              const newEntity =
                await window.customUI.maybeApplyTemplateAttributes(
                  hass,
                  obj.states,
                  entity
                );

              newEntity._customUiHash = currHash;

              obj.states[key] = newEntity;
              totalEvaluated++;
              evaluatedList.push(entity.entity_id);
            }

            // Micro-counter logging: only when something was actually evaluated
            if (window.customUI.debug && totalEvaluated > 0) {
              console.log(
                `[custom-ui] templates: ${totalWithTemplates} | evaluated: ${totalEvaluated} (${evaluatedList.join(", ")}) | skipped: ${totalSkipped}`
              );
            }
          }

          return Reflect.apply(target, thisArg, args);
        }
      });
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
          if (!changedProps.has("_config") || !changedProps.has("hass")) {
            return originalUpdated.call(this, changedProps);
          }

          const entityId = this._config?.entity;
          const iconColor = this.hass?.states?.[entityId]?.attributes?.icon_color;

          if (iconColor) {
            this.style?.setProperty("--state-icon-color", iconColor);
          }

          return originalUpdated.call(this, changedProps);
        };
      }
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
          if (!changedProps.has("_stateObj")) {
            return originalUpdated.call(this, changedProps);
          }

          const color = this._stateObj?.attributes?.icon_color;
          if (color) {
            this.style?.setProperty("--icon-primary-color", color);
          }

          return originalUpdated.call(this, changedProps);
        };
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
          if (!changedProps.has("hass")) {
            return originalUpdated.call(this, changedProps);
          }

          const entityId = this._config?.entity;
          const iconColor = this.hass?.states?.[entityId]?.attributes?.icon_color;

          if (iconColor) {
            const haCard = this.renderRoot?.querySelector("ha-card");
            haCard?.style?.setProperty("--tile-color", iconColor, "important");
          }

          return originalUpdated.call(this, changedProps);
        };
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
          if (!changedProps.has("stateObj")) {
            return originalUpdated.call(this, changedProps);
          }

          const color = this.stateObj?.attributes?.icon_color;
          const hasPicture = !!this.stateObj?.attributes?.entity_picture;

          if (color && !hasPicture) {
            this.style.backgroundImage = "";
            this._showIcon = true;
            this._iconStyle = { color };
          }

          return originalUpdated.call(this, changedProps);
        };
      }
    });
  },

  // Install all hooks
  installCustomHooks() {
    this.installTemplateAttributesHook();
    this.installEntityCardStylingHook();
    this.installButtonCardStylingHook();
    this.installTileCardStylingHook();
    this.installStateBadgeStylingHook();
  },

  async init() {
    if (this.initDone) return;

    const main = this.lightOrShadow(document, "home-assistant");

    await new Promise((resolve) => {
      const intervalId = setInterval(() => {
        if (main?.hass?.states) {
          clearInterval(intervalId);
          resolve();
        }
      }, 100);
    });

    this.installCustomHooks();
    this.initDone = true;

    window.CUSTOM_UI_LIST = window.CUSTOM_UI_LIST || [];
    window.CUSTOM_UI_LIST.push({
      name: Name,
      version: `${Version} ${Description}`,
      url: Url
    });
  },

  // Evaluate a template expression
  computeTemplate(template, hass, entities, entity, attributes, attribute, state) {
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

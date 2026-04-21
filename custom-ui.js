// Define constants for the custom-ui component
const Name = "Custom-ui";
const Version = "20240118";
const Description = "add attributes icon_color and templates";
const Url = "https://github.com/Mariusthvdb/custom-ui";

// Log information about the custom-ui component
console.groupCollapsed(
  `%c ${Name} ${Version} is installed \n%c ${Description} `,
  "color: gold; font-weight: bold; background: black",
  "color: white; font-weight: bold; background: steelblue");
console.log("Readme:", Url);
console.groupEnd();

// Define the custom-ui object with performance optimizations
window.customUI = {
  // Cache for template computation results
  _templateCache: new Map(),
  _cacheMaxSize: 100,

  // Helper function to find an element either in shadowRoot or regular DOM
  lightOrShadow: (elem, selector) =>
    elem.shadowRoot
      ? elem.shadowRoot.querySelector(selector)
      : elem.querySelector(selector),

  // Memoized template computation with caching
  async maybeApplyTemplateAttributes(hass, states, entity) {
    const newAttributes = {};
    const templateKeys = Object.keys(entity.attributes.templates || {});
    
    for (const key of templateKeys) {
      if (key === "state") {
        console.warn(
          `State templating is not supported anymore, please check your customization for ${entity.entity_id}`
        );
        continue;
      }
      
      const template = entity.attributes.templates[key];
      const cacheKey = `${entity.entity_id}:${key}:${template}`;
      
      // Check cache first
      let value;
      if (this._templateCache.has(cacheKey)) {
        value = this._templateCache.get(cacheKey);
      } else {
        value = await window.customUI.computeTemplate(
          template,
          hass,
          states,
          entity,
          entity.attributes,
          entity.untemplated_attributes?.[key] || entity.attributes[key],
          entity.untemplated_state || entity.state
        );
        
        // Manage cache size
        if (this._templateCache.size >= this._cacheMaxSize) {
          const firstKey = this._templateCache.keys().next().value;
          this._templateCache.delete(firstKey);
        }
        this._templateCache.set(cacheKey, value);
      }
      
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

  // Debounced hook installation to prevent multiple installations
  _hookInstallationInProgress: new Set(),

  _installHookOnce(elementName, hookFn) {
    if (this._hookInstallationInProgress.has(elementName)) return;
    this._hookInstallationInProgress.add(elementName);
    
    customElements.whenDefined(elementName).then(() => {
      try {
        hookFn();
      } catch (e) {
        console.error(`Error installing hook for ${elementName}:`, e);
      } finally {
        this._hookInstallationInProgress.delete(elementName);
      }
    });
  },

  // Install a hook to update the states with template attributes
  installTemplateAttributesHook() {
    this._installHookOnce("home-assistant", () => {
      const homeAssistant = customElements.get("home-assistant");
      if (!homeAssistant?.prototype?._updateHass) return;
      
      const originalUpdate = homeAssistant.prototype._updateHass;
      let updateInProgress = false;

      homeAssistant.prototype._updateHass = function update(obj) {
        const { hass } = this;
        
        // Skip if update already in progress
        if (updateInProgress || !obj.states) {
          originalUpdate.call(this, obj);
          return;
        }

        updateInProgress = true;
        const stateKeys = Object.keys(obj.states);
        const updates = stateKeys.filter(key => 
          obj.states[key].attributes?.templates
        );

        // Process template updates in batch
        Promise.all(
          updates.map(key =>
            window.customUI.maybeApplyTemplateAttributes(
              hass,
              obj.states,
              obj.states[key]
            ).then(newEntity => {
              if (JSON.stringify(obj.states[key]) !== JSON.stringify(newEntity)) {
                obj.states[key] = newEntity;
              }
            })
          )
        ).finally(() => {
          updateInProgress = false;
          originalUpdate.call(this, obj);
        });
      };
    });
  },

  // Optimized button card styling hook
  installButtonCardStylingHook() {
    this._installHookOnce("hui-button-card", () => {
      const buttonCard = customElements.get("hui-button-card");
      if (!buttonCard?.prototype?.updated) return;

      const originalUpdated = buttonCard.prototype.updated;
      buttonCard.prototype.updated = function customUpdated(changedProps) {
        if (changedProps.has('_stateObj')) {
          const iconColor = this._stateObj?.attributes?.icon_color;
          if (iconColor) {
            this.style.setProperty('--icon-primary-color', iconColor);
          }
        }
        originalUpdated.call(this, changedProps);
      };
    });
  },

  // Optimized entity card styling hook
  installEntityCardStylingHook() {
    this._installHookOnce("hui-entity-card", () => {
      const entityCard = customElements.get("hui-entity-card");
      if (!entityCard?.prototype?.updated) return;

      const originalUpdated = entityCard.prototype.updated;
      entityCard.prototype.updated = function customUpdated(changedProps) {
        if (changedProps.has('_config') || changedProps.has('hass')) {
          const entityId = this._config?.entity;
          const iconColor = this.hass?.states?.[entityId]?.attributes?.icon_color;
          if (iconColor) {
            this.style.setProperty('--paper-item-icon-color', iconColor);
          }
        }
        originalUpdated.call(this, changedProps);
      };
    });
  },

  // Optimized tile card styling hook
  installTileCardStylingHook() {
    this._installHookOnce("hui-tile-card", () => {
      const tileCard = customElements.get("hui-tile-card");
      if (!tileCard?.prototype?.updated) return;

      const originalUpdated = tileCard.prototype.updated;
      tileCard.prototype.updated = function customUpdated(changedProps) {
        if (changedProps.has('_config') || changedProps.has('hass')) {
          const entityId = this._config?.entity;
          const iconColor = this.hass?.states?.[entityId]?.attributes?.icon_color;
          if (iconColor) {
            this.style.setProperty('--icon-primary-color', iconColor);
          }
        }
        originalUpdated.call(this, changedProps);
      };
    });
  },

  // Optimized state badge styling hook
  installStateBadgeStylingHook() {
    this._installHookOnce("state-badge", () => {
      const stateBadge = customElements.get("state-badge");
      if (!stateBadge?.prototype?.updated) return;

      const originalUpdated = stateBadge.prototype.updated;
      stateBadge.prototype.updated = function customUpdated(changedProps) {
        if (changedProps.has("stateObj")) {
          const { stateObj } = this;
          if (stateObj.attributes?.icon_color && !stateObj.attributes?.entity_picture) {
            this.style.backgroundImage = "";
            this._showIcon = true;
            this._iconStyle = { color: stateObj.attributes.icon_color };
          }
        }
        originalUpdated.call(this, changedProps);
      };
    });
  },

  // Install all hooks with error handling
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

    // Wait for the hass.states to be populated with timeout
    const main = window.customUI.lightOrShadow(document, "home-assistant");
    const timeoutPromise = new Promise((_, reject) =>
      setTimeout(() => reject(new Error("Timeout waiting for hass.states")), 5000)
    );

    try {
      await Promise.race([
        new Promise((resolve) => {
          const intervalId = setInterval(() => {
            if (main?.hass?.states) {
              clearInterval(intervalId);
              resolve();
            }
          }, 100);
        }),
        timeoutPromise
      ]);
    } catch (e) {
      console.warn(`custom-ui initialization: ${e.message}`);
    }

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

  // Optimized template computation with error handling
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
      template.indexOf("return") >= 0 ? template : `return \\`${template}\`;`;
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
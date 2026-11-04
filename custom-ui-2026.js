// === Meta ===
// Copilot
const Name = "Custom-ui only";
const Version = "20261103-deps-tracking";
const Description = "add attributes icon_color and templates (dependency-aware evaluation)";
const Url = "https://github.com/Mariusthvdb/custom-ui";

console.groupCollapsed(
  `%c ${Name} ${Version} is installed \n%c ${Description} `,
  "color: gold; font-weight: bold; background: black",
  "color: white; font-weight: bold; background: steelblue"
);
console.log("Readme:", Url);
console.groupEnd();

// Define the custom-ui object and its methods
if (window.__customUI2026Loaded) throw new Error("custom-ui-2026 already loaded");
window.__customUI2026Loaded = true;
window.customUI = {
  _debugDefault: false,   // hardcoded default; set true only while developing
  hassUpdates: 0,
  // Debug logging follows this browser's own HA toggle (Settings > Tools > Debug
  // writes the localStorage "debugConnection" key), so each browser debugs independently.
  get debug() {
    if (this._debugDefault) return true;
    try { return !!localStorage.getItem("debugConnection"); } catch (e) { return false; }
  },

  // Registry of templated entities: entity_id -> { templates, deps }
  _templated: new Map(),

  // Snapshot of the states object seen in the previous _updateHass call
  _prevStates: null,

  // Counter to trigger a periodic full rescan for newly templated entities
  _rescanCounter: 0,

  // Helper function to find an element either in shadowRoot or regular DOM
  lightOrShadow(elem, selector) {
    const root = elem?.renderRoot ?? elem?.shadowRoot ?? elem;
    return root?.querySelector(selector);
  },

  // Extract the entity_ids a template depends on.
  // Falls back to "*" (depends on everything) when the template uses
  // hass/states/entities as a whole and no literal entity id is found.
  extractDependencies(template) {
    const deps = new Set();
    const re = /(?:states|entities|hass\.states)\s*(?:\(\s*['"]([^'"]+)['"]\s*\)|\[\s*['"]([^'"]+)['"]\s*\]|\.([a-z_]+\.[a-z0-9_]+))/g;
    let m;
    while ((m = re.exec(template)) !== null) {
      const id = m[1] || m[2] || m[3];
      if (id && id.includes(".")) deps.add(id);
    }
    // After stripping recognized literal accesses, any remaining reference to
    // the collections (Object.values(entities), entities[variable], ...) is a
    // whole-map/dynamic read: conservatively treat it as a wildcard dependency.
    const rest = template.replace(re, " ");
    if (/\b(hass|states|entities)\b/.test(rest)) deps.add("*");
    return deps;
  },

  // Parse the dependencies of one templates object into a list
  parseDeps(templates) {
    const deps = new Set();
    for (const t of Object.values(templates ?? {})) {
      for (const d of this.extractDependencies(String(t))) deps.add(d);
    }
    return [...deps];
  },

  // Full scan: (re)build the registry of templated entities and their deps.
  // Runs once at startup and periodically afterwards; per-update work only
  // touches registered templated entities and their dependencies.
  rescanTemplated(states) {
    this._templated.clear();
    for (const key of Object.keys(states)) {
      const templates = states[key]?.attributes?.templates;
      if (!templates) continue;
      this._templated.set(key, { templates, deps: this.parseDeps(templates) });
    }
  },

  // Is a registered templated entity dirty? Only inspects the entity itself
  // and its parsed dependencies — never the full state list.
  isDirty(key, states, prevStates) {
    const entry = this._templated.get(key);
    if (!entry) return false;
    if (entry.deps.includes("*")) return true;
    const changedRef = (id) => {
      const curr = states[id];
      const prev = prevStates[id];
      if (curr === prev) return false;   // same reference: unchanged (covers absent-in-both)
      if (!curr) return !!prev;          // present -> absent: changed
      if (!prev) return true;            // absent -> present: changed
      return true;                       // different reference: changed (covers templated rewrites)
    };
    return changedRef(key) || entry.deps.some(changedRef);
  },

  // Apply template attributes to an entity's attributes
  async maybeApplyTemplateAttributes(hass, states, entity) {
    const templates = entity.attributes?.templates;
    if (!templates) return entity;

    // Start from the untemplated originals for every templated key, so a null
    // template result clears a previously templated value instead of keeping it.
    const untemplated = entity.untemplated_attributes ?? entity.attributes;
    const templateKeys = Object.keys(templates);
    const newAttributes = {};
    for (const key of templateKeys) newAttributes[key] = untemplated[key];

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
        untemplated[key],
        entity.untemplated_state || entity.state
      );

      if (value !== null && value !== undefined) newAttributes[key] = value;
    }

    return {
      ...entity,
      attributes: {
        ...entity.attributes,
        ...newAttributes
      },
      untemplated_attributes: untemplated
    };
  },

  // Install a hook to update the states with template attributes.
  // Only entities whose own state or template dependencies changed are re-evaluated.
  installTemplateAttributesHook() {
    customElements.whenDefined("home-assistant").then(() => {
      const homeAssistant = customElements.get("home-assistant");
      const originalUpdate = homeAssistant?.prototype?._updateHass;

      // Guard against frontend renames/removals: fail loudly but never break HA itself
      if (typeof originalUpdate !== "function") {
        console.warn(
          "[custom-ui] home-assistant._updateHass not found, template attributes are disabled"
        );
        return;
      }

      homeAssistant.prototype._updateHass = new Proxy(originalUpdate, {
        async apply(target, thisArg, args) {
          // Serialize updates: each one's async template work finishes before the
          // next update is forwarded, so stale states can never overwrite newer ones.
          const prev = customUI._updateChain || Promise.resolve();
          const run = prev.then(async () => {
          customUI.hassUpdates++;

          const obj = args[0];
          // _updateHass can receive partial patches ({ states }); merge with the
          // current hass so template context (user, config, methods) is preserved.
          const hass = (obj && thisArg.hass && typeof obj === "object")
            ? Object.assign({}, thisArg.hass, obj)
            : (obj ?? thisArg.hass);
          // Keep our own snapshot of the previous states: thisArg.hass may already
          // hold the NEW hass (the hass setter stores it before _updateHass runs)
          const prevStates = customUI._prevStates ?? null;

          if (obj.states && hass?.states) {

            // === (Re)scan for templated entities on first run and periodically ===
            if (!prevStates || ++customUI._rescanCounter % 600 === 0) {
              customUI.rescanTemplated(obj.states);
            }

            // === Per-update work is O(templated entities x their deps) ===
            {
              let totalConsidered = 0;
              let totalEvaluated = 0;
              let totalSkipped = 0;
              let evaluatedList = [];

              // Refresh deps first (templates object may have been replaced),
              // then order: templated producers before consumers; wildcard
              // consumers (Object.values(entities) etc.) last, cycle-safe.
              for (const k of customUI._templated.keys()) {
                const e0 = obj.states[k];
                const entry = customUI._templated.get(k);
                if (e0?.attributes?.templates && entry.templates !== e0.attributes.templates) {
                  entry.templates = e0.attributes.templates;
                  entry.deps = customUI.parseDeps(e0.attributes.templates);
                }
              }
              const order = [];
              const seen = new Set();
              const visit = (k) => {
                if (seen.has(k)) return;
                seen.add(k);
                const e = customUI._templated.get(k);
                if (e) for (const d of e.deps) {
                  if (d !== "*" && customUI._templated.has(d)) visit(d);
                }
                order.push(k);
              };
              for (const k of customUI._templated.keys()) {
                const e = customUI._templated.get(k);
                if (e?.deps.includes("*")) continue;   // wildcard consumers last
                visit(k);
              }
              for (const k of customUI._templated.keys()) {
                const e = customUI._templated.get(k);
                if (e?.deps.includes("*")) visit(k);
              }

              for (const key of order) {
                const entity = obj.states[key];
                if (!entity?.attributes?.templates) continue;

                const entry = customUI._templated.get(key);

                // === Only process entities that are dirty (or never evaluated) ===
                if (entity._customUiHash &&
                    !customUI.isDirty(key, obj.states, prevStates ?? {})) continue;

                totalConsidered++;

                // === Evaluate templates ===
                const newEntity =
                  await window.customUI.maybeApplyTemplateAttributes(
                    hass,
                    obj.states,
                    entity
                  );

                newEntity._customUiHash = `${entity.state}|${Date.now()}`;

                obj.states[key] = newEntity;
                totalEvaluated++;
                evaluatedList.push(entity.entity_id);
              }

              // === Only log when something was actually evaluated ===
              if (window.customUI.debug && totalEvaluated > 0) {
                console.log(
                  `[custom-ui] hass: ${customUI.hassUpdates} | templates considered: ${totalConsidered} | evaluated: ${totalEvaluated} (${evaluatedList.join(", ")}) | skipped: ${totalSkipped}`
                );
              }
            }
          }

          const result = Reflect.apply(target, thisArg, args);
          if (obj?.states) customUI._prevStates = obj.states;
          return result;
          });
          customUI._updateChain = run.catch(() => {});
          return run;
        }
      });

      if (window.customUI.debug) {
        console.log("[custom-ui] template attributes hook installed on home-assistant._updateHass");
      }
    });
  },

  // Install a hook to update the entity card with custom styling
  installEntityCardStylingHook() {
    customElements.whenDefined("hui-entity-card").then(() => {
      const entityCard = customElements.get("hui-entity-card");
      if (!entityCard?.prototype?.updated) return;

      const originalUpdated = entityCard.prototype.updated;

      entityCard.prototype.updated = function customUpdated(changedProps) {
        if (!changedProps.has("_config") && !changedProps.has("hass")) {
          return originalUpdated.call(this, changedProps);
        }

        const entityId = this._config?.entity;
        const iconColor = this.hass?.states?.[entityId]?.attributes?.icon_color;

        if (iconColor) {
          this.style?.setProperty("--state-icon-color", iconColor);
          if (customUI.debug) {
            console.log(`[custom-ui] icon_color: ${entityId} → ${iconColor} [entity-card]`);
          }
        } else {
          this.style?.removeProperty("--state-icon-color");
        }

        return originalUpdated.call(this, changedProps);
      };

      if (window.customUI.debug) {
        console.log("[custom-ui] icon_color hook installed on hui-entity-card");
      }
    });
  },

  // Install a hook to update the button card with custom styling
  installButtonCardStylingHook() {
    customElements.whenDefined("hui-button-card").then(() => {
      const buttonCard = customElements.get("hui-button-card");
      if (!buttonCard?.prototype?.updated) return;

      const originalUpdated = buttonCard.prototype.updated;

      buttonCard.prototype.updated = function customUpdated(changedProps) {
        if (!changedProps.has("_stateObj")) {
          return originalUpdated.call(this, changedProps);
        }

        const entityId = this._stateObj?.entity_id;
        const color = this._stateObj?.attributes?.icon_color;
        if (color) {
          this.style?.setProperty("--icon-primary-color", color);
          if (customUI.debug) {
            console.log(`[custom-ui] icon_color: ${entityId} → ${color} [button-card]`);
          }
        } else {
          this.style?.removeProperty("--icon-primary-color");
        }

        return originalUpdated.call(this, changedProps);
      };

      if (window.customUI.debug) {
        console.log("[custom-ui] icon_color hook installed on hui-button-card");
      }
    });
  },

  // Install a hook to update the Tile card with custom styling
  installTileCardStylingHook() {
    customElements.whenDefined("hui-tile-card").then(() => {
      const tileCard = customElements.get("hui-tile-card");
      if (!tileCard?.prototype?.updated) return;

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
          if (customUI.debug) {
            console.log(`[custom-ui] icon_color: ${entityId} → ${iconColor} [tile-card]`);
          }
        } else {
          const haCard = this.renderRoot?.querySelector("ha-card");
          haCard?.style?.removeProperty("--tile-color");
        }

        return originalUpdated.call(this, changedProps);
      };

      if (window.customUI.debug) {
        console.log("[custom-ui] icon_color hook installed on hui-tile-card");
      }
    });
  },

  // Install a hook to update the state badge with custom styling
  installStateBadgeStylingHook() {
    customElements.whenDefined("state-badge").then(() => {
      const stateBadge = customElements.get("state-badge");
      if (!stateBadge?.prototype?.updated) return;

      const originalUpdated = stateBadge.prototype.updated;

      stateBadge.prototype.updated = function customUpdated(changedProps) {
        if (!changedProps.has("stateObj")) {
          return originalUpdated.call(this, changedProps);
        }

        const entityId = this.stateObj?.entity_id;
        const color = this.stateObj?.attributes?.icon_color;
        const hasPicture = !!this.stateObj?.attributes?.entity_picture;

        if (color && !hasPicture) {
          this.style.backgroundImage = "";
          this._showIcon = true;
          this._iconStyle = { color };
          if (customUI.debug) {
            console.log(`[custom-ui] icon_color: ${entityId} → ${color} [state-badge]`);
          }
        } else if (this._iconStyle) {
          this._iconStyle = null;
        }

        return originalUpdated.call(this, changedProps);
      };

      if (window.customUI.debug) {
        console.log("[custom-ui] icon_color hook installed on state-badge");
      }
    });
  },

  // Install a hook to update the entity badge with custom styling
  installEntityBadgeStylingHook() {
    customElements.whenDefined("hui-entity-badge").then(() => {
      const entityBadge = customElements.get("hui-entity-badge");
      if (!entityBadge?.prototype?.updated) return;

      const originalUpdated = entityBadge.prototype.updated;

      entityBadge.prototype.updated = function customUpdated(changedProps) {
        if (!changedProps.has("hass")) {
          return originalUpdated.call(this, changedProps);
        }

        const entityId = this._config?.entity;
        const color = this.hass?.states?.[entityId]?.attributes?.icon_color;

        if (color) {
          const icon = this.renderRoot?.querySelector("ha-state-icon");
          icon?.style?.setProperty("color", color);
          if (customUI.debug) {
            console.log(`[custom-ui] icon_color: ${entityId} → ${color} [entity-badge]`);
          }
        } else {
          const icon = this.renderRoot?.querySelector("ha-state-icon");
          icon?.style?.removeProperty("color");
        }

        return originalUpdated.call(this, changedProps);
      };

      if (window.customUI.debug) {
        console.log("[custom-ui] icon_color hook installed on hui-entity-badge");
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
    this.installEntityBadgeStylingHook();
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
  async computeTemplate(template, hass, entities, entity, attributes, attribute, state) {
    try {
      if (typeof template !== "string") return null;   // YAML null/number/etc.
      const functionBody =
        template.indexOf("return") >= 0 ? template : `return \`${template}\`;`;

      // await so a rejected promise returned by the template is caught here
      return await new Function(
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

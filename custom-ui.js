"use strict";

var Name = "Custom-ui";
var Version = "20210505";
var Description = "adapted for HA 2020.X.X + ";
var Url = "https://github.com/Mariusthvdb/custom-ui";
console.info(`%c  ${Name}  \n%c  Version ${Version} ${Description}`, "color: gold; font-weight: bold; background: black", "color: white; font-weight: bold; background: steelblue");
!function (t) {
  var e = {};

  function s(i) {
    if (e[i]) return e[i].exports;
    var n = e[i] = {
      i: i,
      l: !1,
      exports: {}
    };
    return t[i].call(n.exports, n, n.exports, s), n.l = !0, n.exports;
  }

  s.m = t, s.c = e, s.d = function (t, e, i) {
    s.o(t, e) || Object.defineProperty(t, e, {
      configurable: !1,
      enumerable: !0,
      get: i
    });
  }, s.r = function (t) {
    Object.defineProperty(t, "__esModule", {
      value: !0
    });
  }, s.n = function (t) {
    var e = t && t.__esModule ? function () {
      return t.default;
    } : function () {
      return t;
    };
    return s.d(e, "a", e), e;
  }, s.o = function (t, e) {
    return Object.prototype.hasOwnProperty.call(t, e);
  }, s.p = "", s(s.s = 0);
}([function (t, e, s) {
  "use strict";

  function i(t, e, s, i = !1) {
    if (o) {
      o.hasAttribute("default-content") || o.setAttribute("default-content", o.getAttribute("content"));
      const t = a["--primary-color"] || o.getAttribute("default-content");
      o.setAttribute("content", t);
    }
  }

  window.customUI = window.customUI || {
    domHost(t) {
      if (t === document) return null;
      const e = t.getRootNode();
      return e instanceof DocumentFragment ? e.host : e;
    },

    lightOrShadow: (t, e) => t.shadowRoot ? t.shadowRoot.querySelector(e) : t.querySelector(e),

    _setKeep(t, e) {
      void 0 === t._cui_keep ? t._cui_keep = e : t._cui_keep = t._cui_keep && e;
    },

    maybeApplyTemplateAttributes(t, e, s, i) {
      if (!i.templates) return window.customUI._setKeep(s, !0), s;
      const n = {};
      let a = !1,
          o = !1;
      if (Object.keys(i.templates).forEach(r => {
        const l = i.templates[r];
        l.match(/\b(entities|hass)\b/) && (a = !0);
        const c = window.customUI.computeTemplate(l, t, e, s, i, s.untemplated_attributes && s.untemplated_attributes[r] || i[r], s.untemplated_state || s.state);
        null !== c && (n[r] = c, "state" === r ? c !== s.state && (o = !0) : c !== i[r] && (o = !0));
      }), window.customUI._setKeep(s, !a), !o) return s;

      if (s.attributes === i) {
        const t = window.customUI.applyAttributes(s, n);
        return Object.prototype.hasOwnProperty.call(n, "state") && null !== n.state && (t.state = String(n.state), t.untemplated_state = s.state), window.customUI._setKeep(t, !a), t;
      }

      return Object.assign({}, s);
    },

    maybeApplyTemplates(t, e, s) {
      const i = window.customUI.maybeApplyTemplateAttributes(t, e, s, s.attributes);
      let n = i !== s;

      function a(s) {
        s && Object.values(s).forEach(s => {
          const a = window.customUI.maybeApplyTemplateAttributes(t, e, i, s);
          n |= a !== i;
        });
      }

      return i !== s ? i : n ? Object.assign({}, s) : s;
    },

    applyAttributes: (t, e) => ({
      entity_id: t.entity_id,
      state: t.state,
      attributes: Object.assign({}, t.attributes, e),
      untemplated_attributes: t.attributes,
      last_changed: t.last_changed,
      last_updated: t.last_updated
    }),

    maybeChangeObject(t, e, s, i) {
      if (s) return e;
      return n = (n = window.customUI.maybeApplyTemplateAttributes(t.hass, t.hass.states, n, n.attributes)) !== e && i ? null : n;
    },

    updateMoreInfo() {
      s = 0, i = setInterval(function () {
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
        } catch (err) {}
      }, 100);
    },

    installStatesHook() {
      customElements.whenDefined("home-assistant").then(() => {
        const t = customElements.get("home-assistant");
        if (!t || !t.prototype._updateHass) return;
        const e = t.prototype._updateHass;

        t.prototype._updateHass = function (t) {
          const {
            hass: s
          } = this;
          t.states && Object.keys(t.states).forEach(e => {
            const i = t.states[e];
            if (i._cui_keep) return;
            const n = window.customUI.maybeApplyTemplates(s, t.states, i);
            s.states && i !== s.states[e] ? t.states[e] = n : i !== n && (t.states[e] = n);
          }), e.call(this, t);
        };

        const s = window.customUI.lightOrShadow(document, "home-assistant");
        s.hass && s.hass.states && s._updateHass({
          states: s.hass.states
        });
      });
    },

    installStateBadge() {
      customElements.whenDefined("state-badge").then(() => {
        const t = customElements.get("state-badge");
        if (t) if (t.prototype._updateIconAppearance) {
          const e = t.prototype._updateIconAppearance;

          t.prototype._updateIconAppearance = function (t) {
            t.attributes.icon_color && !t.attributes.entity_picture ? (this.style.backgroundImage = "", Object.assign(this.$.icon.style, {
              color: t.attributes.icon_color,
              filter: ""
            })) : e.call(this, t);
          };
        } else if (t.prototype.updated) {
          const e = t.prototype.updated;

          t.prototype.updated = function (t) {
            if (!t.has("stateObj")) return;
            const {
              stateObj: s
            } = this;
            s.attributes.icon_color && !s.attributes.entity_picture ? (this.style.backgroundImage = "", this._showIcon = true, this._iconStyle = {
              color: s.attributes.icon_color
            }) : e.call(this, t);
          };
        }
      });
    },

    installClassHooks() {
      window.customUI.classInitDone || (window.customUI.classInitDone = !0, window.customUI.installStatesHook(), window.customUI.installStateBadge());
    },

    init() {
      if (window.customUI.initDone) return;
      window.customUI.installClassHooks();
      const t = window.customUI.lightOrShadow(document, "home-assistant");
      t.hass && t.hass.states ? (window.customUI.initDone = !0, window.addEventListener("location-changed", window.setTimeout.bind(null, 100)), console.log(`Loaded ${Name} ${Version} ${Description}`), window.addEventListener("hass-more-info", window.customUI.updateMoreInfo), window.CUSTOM_UI_LIST || (window.CUSTOM_UI_LIST = []), window.CUSTOM_UI_LIST.push({
        name: `${Name}`,
        version: `${Version} ${Description}`,
        url: `${Url}`
      })) : window.setTimeout(window.customUI.init, 1e3);
    },

    getName: () => window.localStorage.getItem("ha-device-name") || "",

    setName(t) {
      window.localStorage.setItem("ha-device-name", t || "");
    },

    computeTemplate(t, e, s, i, n, a, o) {
      const r = t.indexOf("return") >= 0 ? t : `return \`${t}\`;`;

      try {
        return new Function("hass", "entities", "entity", "attributes", "attribute", "state", r)(e, s, i, n, a, o);
      } catch (t) {
        if (t instanceof SyntaxError || t instanceof ReferenceError) return console.warn(`${t.name}: ${t.message} in template ${r}`), null;
        throw t;
      }
    }

  }, window.customUI.init(), s(1);

  class lt {
    constructor(t) {
      this.value = t.toString();
    }

    toString() {
      return this.value;
    }

  }

  const ct = function (t, ...e) {
    const s = document.createElement("template");
    return s.innerHTML = e.reduce((e, s, i) => e + function (t) {
      if (t instanceof HTMLTemplateElement) return t.innerHTML;
      if (t instanceof lt) return function (t) {
        if (t instanceof lt) return t.value;
        throw new Error(`non-literal value passed to Polymer's htmlLiteral function: ${t}`);
      }(t);
      throw new Error(`non-template value passed to Polymer's html function: ${t}`);
    }(s) + t[i + 1], t[0]), s;
  };
}, function (t, e) {
  window.JSCompiler_renameProperty = function (t) {
    return t;
  };
}]);
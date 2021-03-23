var Name = "CUSTOM-UI (JS)";
var Version = "20210323-BETA";
var Description= "adapted for HA 2020.X.X + ";
console.info(
`%c  ${Name} is installed \n%c  Version ${Version} ${Description}`,
    'color: gold; font-weight: bold; background: black',
    'color: white; font-weight: bold; background: steelblue' );

!function (t) {
    var e = {};
    function s(i) {
        if (e[i])
            return e[i].exports;
        var n = e[i] = {
            i: i,
            l: !1,
            exports: {}
        };
        return t[i].call(n.exports, n, n.exports, s),
        n.l = !0,
        n.exports
    }
    s.m = t,
    s.c = e,
    s.d = function (t, e, i) {
        s.o(t, e) || Object.defineProperty(t, e, {
            configurable: !1,
            enumerable: !0,
            get: i
        })
    },
    s.r = function (t) {
        Object.defineProperty(t, "__esModule", {
            value: !0
        })
    },
    s.n = function (t) {
        var e = t && t.__esModule ? function () {
            return t.default
        }
         : function () {
            return t
        };
        return s.d(e, "a", e),
        e
    },
    s.o = function (t, e) {
        return Object.prototype.hasOwnProperty.call(t, e)
    },
    s.p = "",
    s(s.s = 0)
}
([function (t, e, s) {
            "use strict";
            function i(t, e, s, i = !1) {
                t._themes || (t._themes = {});
                let n = e.default_theme;
                ("default" === s || s && e.themes[s]) && (n = s);
                const a = {
                    ...t._themes
                };
                if ("default" !== n) {
                    const s = e.themes[n];
                    Object.keys(s).forEach(e => {
                        const i = "--" + e;
                        t._themes[i] = "",
                        a[i] = s[e]
                    })
                }
                if (t.updateStyles ? t.updateStyles(a) : window.ShadyCSS && window.ShadyCSS.styleSubtree(t, a), !i)
                    return;
                const o = document.querySelector("meta[name=theme-color]");
                if (o) {
                    o.hasAttribute("default-content") || o.setAttribute("default-content", o.getAttribute("content"));
                    const t = a["--primary-color"] || o.getAttribute("default-content");
                    o.setAttribute("content", t)
                }
            }
            function n(t) {
                return t.substr(0, t.indexOf("."))
            }
            function a(t) {
                return n(t.entity_id)
            }
            function o(t, e, s) {
                const i = t;
                let n;
                i.lastChild && i.lastChild.tagName === e ? n = i.lastChild : (i.lastChild && i.removeChild(i.lastChild), n = document.createElement(e.toLowerCase())),
                n.setProperties ? n.setProperties(s) : Object.keys(s).forEach(t => {
                    n[t] = s[t]
                }),
                null === n.parentNode && i.appendChild(n)
            }
            s.r(e);
            const r = (t, e) => 0 != (t.attributes.supported_features & e),
            l = ["climate", "cover", "configurator", "input_select", "input_number", "input_text", "lock", "media_player", "scene", "script", "timer", "vacuum", "water_heater", "weblink"];
            new Set(["fan", "input_boolean", "light", "switch", "group", "automation"]);
            const c = new WeakMap,
            d = t => "function" == typeof t && c.has(t),
            u = void 0 !== window.customElements && void 0 !== window.customElements.polyfillWrapFlushCallback,
            h = (t, e, s = null) => {
                let i = e;
                for (; i !== s; ) {
                    const e = i.nextSibling;
                    t.removeChild(i),
                    i = e
                }
            },
            p = {},
            m = {},
            g = `{{lit-${String(Math.random()).slice(2)}}}`,
            y = `\x3c!--${g}--\x3e`,
            b = new RegExp(`${g}|${y}`),
            _ = "$lit$";
            class f {
                constructor(t, e) {
                    this.parts = [],
                    this.element = e;
                    let s = -1,
                    i = 0;
                    const n = [],
                    a = e => {
                        const o = e.content,
                        r = document.createTreeWalker(o, 133, null, !1);
                        let l = 0;
                        for (; r.nextNode(); ) {
                            s++;
                            const e = r.currentNode;
                            if (1 === e.nodeType) {
                                if (e.hasAttributes()) {
                                    const n = e.attributes;
                                    let a = 0;
                                    for (let t = 0; t < n.length; t++)
                                        n[t].value.indexOf(g) >= 0 && a++;
                                    for (; a-- > 0; ) {
                                        const n = t.strings[i],
                                        a = S.exec(n)[2],
                                        o = a.toLowerCase() + _,
                                        r = e.getAttribute(o).split(b);
                                        this.parts.push({
                                            type: "attribute",
                                            index: s,
                                            name: a,
                                            strings: r
                                        }),
                                        e.removeAttribute(o),
                                        i += r.length - 1
                                    }
                                }
                                "TEMPLATE" === e.tagName && a(e)
                            } else if (3 === e.nodeType) {
                                const t = e.data;
                                if (t.indexOf(g) >= 0) {
                                    const a = e.parentNode,
                                    o = t.split(b),
                                    r = o.length - 1;
                                    for (let t = 0; t < r; t++)
                                        a.insertBefore("" === o[t] ? v() : document.createTextNode(o[t]), e), this.parts.push({
                                            type: "node",
                                            index: ++s
                                        });
                                    "" === o[r] ? (a.insertBefore(v(), e), n.push(e)) : e.data = o[r],
                                    i += r
                                }
                            } else if (8 === e.nodeType)
                                if (e.data === g) {
                                    const t = e.parentNode;
                                    null !== e.previousSibling && s !== l || (s++, t.insertBefore(v(), e)),
                                    l = s,
                                    this.parts.push({
                                        type: "node",
                                        index: s
                                    }),
                                    null === e.nextSibling ? e.data = "" : (n.push(e), s--),
                                    i++
                                } else {
                                    let t = -1;
                                    for (; -1 !== (t = e.data.indexOf(g, t + 1)); )
                                        this.parts.push({
                                            type: "node",
                                            index: -1
                                        })
                                }
                        }
                    };
                    a(e);
                    for (const t of n)
                        t.parentNode.removeChild(t)
                }
            }
            const w = t => -1 !== t.index,
            v = () => document.createComment(""),
            S = /([ \x09\x0a\x0c\x0d])([^\0-\x1F\x7F-\x9F \x09\x0a\x0c\x0d"'>=/]+)([ \x09\x0a\x0c\x0d]*=[ \x09\x0a\x0c\x0d]*(?:[^ \x09\x0a\x0c\x0d"'`<>=]*|"[^"]*|'[^']*))$/;
            class C {
                constructor(t, e, s) {
                    this._parts = [],
                    this.template = t,
                    this.processor = e,
                    this.options = s
                }
                update(t) {
                    let e = 0;
                    for (const s of this._parts)
                        void 0 !== s && s.setValue(t[e]), e++;
                    for (const t of this._parts)
                        void 0 !== t && t.commit()
                }
                _clone() {
                    const t = u ? this.template.element.content.cloneNode(!0) : document.importNode(this.template.element.content, !0),
                    e = this.template.parts;
                    let s = 0,
                    i = 0;
                    const n = t => {
                        const a = document.createTreeWalker(t, 133, null, !1);
                        let o = a.nextNode();
                        for (; s < e.length && null !== o; ) {
                            const t = e[s];
                            if (w(t))
                                if (i === t.index) {
                                    if ("node" === t.type) {
                                        const t = this.processor.handleTextExpression(this.options);
                                        t.insertAfterNode(o.previousSibling),
                                        this._parts.push(t)
                                    } else
                                        this._parts.push(...this.processor.handleAttributeExpressions(o, t.name, t.strings, this.options));
                                    s++
                                } else
                                    i++, "TEMPLATE" === o.nodeName && n(o.content), o = a.nextNode();
                            else
                                this._parts.push(void 0), s++
                        }
                    };
                    return n(t),
                    u && (document.adoptNode(t), customElements.upgrade(t)),
                    t
                }
            }
            class x {
                constructor(t, e, s, i) {
                    this.strings = t,
                    this.values = e,
                    this.type = s,
                    this.processor = i
                }
                getHTML() {
                    const t = this.strings.length - 1;
                    let e = "";
                    for (let s = 0; s < t; s++) {
                        const t = this.strings[s],
                        i = S.exec(t);
                        e += i ? t.substr(0, i.index) + i[1] + i[2] + _ + i[3] + g : t + y
                    }
                    return e + this.strings[t]
                }
                getTemplateElement() {
                    const t = document.createElement("template");
                    return t.innerHTML = this.getHTML(),
                    t
                }
            }
            const E = t => null === t || !("object" == typeof t || "function" == typeof t);
            class O {
                constructor(t, e, s) {
                    this.dirty = !0,
                    this.element = t,
                    this.name = e,
                    this.strings = s,
                    this.parts = [];
                    for (let t = 0; t < s.length - 1; t++)
                        this.parts[t] = this._createPart()
                }
                _createPart() {
                    return new T(this)
                }
                _getValue() {
                    const t = this.strings,
                    e = t.length - 1;
                    let s = "";
                    for (let i = 0; i < e; i++) {
                        s += t[i];
                        const e = this.parts[i];
                        if (void 0 !== e) {
                            const t = e.value;
                            if (null != t && (Array.isArray(t) || "string" != typeof t && t[Symbol.iterator]))
                                for (const e of t)
                                    s += "string" == typeof e ? e : String(e);
                            else
                                s += "string" == typeof t ? t : String(t)
                        }
                    }
                    return s + t[e]
                }
                commit() {
                    this.dirty && (this.dirty = !1, this.element.setAttribute(this.name, this._getValue()))
                }
            }
            class T {
                constructor(t) {
                    this.value = void 0,
                    this.committer = t
                }
                setValue(t) {
                    t === p || E(t) && t === this.value || (this.value = t, d(t) || (this.committer.dirty = !0))
                }
                commit() {
                    for (; d(this.value); ) {
                        const t = this.value;
                        this.value = p,
                        t(this)
                    }
                    this.value !== p && this.committer.commit()
                }
            }
            class A {
                constructor(t) {
                    this.value = void 0,
                    this._pendingValue = void 0,
                    this.options = t
                }
                appendInto(t) {
                    this.startNode = t.appendChild(v()),
                    this.endNode = t.appendChild(v())
                }
                insertAfterNode(t) {
                    this.startNode = t,
                    this.endNode = t.nextSibling
                }
                appendIntoPart(t) {
                    t._insert(this.startNode = v()),
                    t._insert(this.endNode = v())
                }
                insertAfterPart(t) {
                    t._insert(this.startNode = v()),
                    this.endNode = t.endNode,
                    t.endNode = this.startNode
                }
                setValue(t) {
                    this._pendingValue = t
                }
                commit() {
                    for (; d(this._pendingValue); ) {
                        const t = this._pendingValue;
                        this._pendingValue = p,
                        t(this)
                    }
                    const t = this._pendingValue;
                    t !== p && (E(t) ? t !== this.value && this._commitText(t) : t instanceof x ? this._commitTemplateResult(t) : t instanceof Node ? this._commitNode(t) : Array.isArray(t) || t[Symbol.iterator] ? this._commitIterable(t) : t === m ? (this.value = m, this.clear()) : this._commitText(t))
                }
                _insert(t) {
                    this.endNode.parentNode.insertBefore(t, this.endNode)
                }
                _commitNode(t) {
                    this.value !== t && (this.clear(), this._insert(t), this.value = t)
                }
                _commitText(t) {
                    const e = this.startNode.nextSibling;
                    t = null == t ? "" : t,
                    e === this.endNode.previousSibling && 3 === e.nodeType ? e.data = t : this._commitNode(document.createTextNode("string" == typeof t ? t : String(t))),
                    this.value = t
                }
                _commitTemplateResult(t) {
                    const e = this.options.templateFactory(t);
                    if (this.value instanceof C && this.value.template === e)
                        this.value.update(t.values);
                    else {
                        const s = new C(e, t.processor, this.options),
                        i = s._clone();
                        s.update(t.values),
                        this._commitNode(i),
                        this.value = s
                    }
                }
                _commitIterable(t) {
                    Array.isArray(this.value) || (this.value = [], this.clear());
                    const e = this.value;
                    let s,
                    i = 0;
                    for (const n of t)
                        void 0 === (s = e[i]) && (s = new A(this.options), e.push(s), 0 === i ? s.appendIntoPart(this) : s.insertAfterPart(e[i - 1])), s.setValue(n), s.commit(), i++;
                    i < e.length && (e.length = i, this.clear(s && s.endNode))
                }
                clear(t = this.startNode) {
                    h(this.startNode.parentNode, t.nextSibling, this.endNode)
                }
            }
            class I extends T {}
            let U = !1;
            try {
                const t = {
                    get capture() {
                        return U = !0,
                        !1
                    }
                };
                window.addEventListener("test", t, t),
                window.removeEventListener("test", t, t)
            } catch (t) {}
            const N = t => t && (U ? {
                    capture: t.capture,
                    passive: t.passive,
                    once: t.once
                }
                     : t.capture),
            k = new class {
                handleAttributeExpressions(t, e, s, i) {
                    const n = e[0];
                    return "." === n ? new class extends O {
                        constructor(t, e, s) {
                            super(t, e, s),
                            this.single = 2 === s.length && "" === s[0] && "" === s[1]
                        }
                        _createPart() {
                            return new I(this)
                        }
                        _getValue() {
                            return this.single ? this.parts[0].value : super._getValue()
                        }
                        commit() {
                            this.dirty && (this.dirty = !1, this.element[this.name] = this._getValue())
                        }
                    }
                    (t, e.slice(1), s).parts : "@" === n ? [new class {
                            constructor(t, e, s) {
                                this.value = void 0,
                                this._pendingValue = void 0,
                                this.element = t,
                                this.eventName = e,
                                this.eventContext = s,
                                this._boundHandleEvent = (t => this.handleEvent(t))
                            }
                            setValue(t) {
                                this._pendingValue = t
                            }
                            commit() {
                                for (; d(this._pendingValue); ) {
                                    const t = this._pendingValue;
                                    this._pendingValue = p,
                                    t(this)
                                }
                                if (this._pendingValue === p)
                                    return;
                                const t = this._pendingValue,
                                e = this.value,
                                s = null == t || null != e && (t.capture !== e.capture || t.once !== e.once || t.passive !== e.passive),
                                i = null != t && (null == e || s);
                                s && this.element.removeEventListener(this.eventName, this._boundHandleEvent, this._options),
                                i && (this._options = N(t), this.element.addEventListener(this.eventName, this._boundHandleEvent, this._options)),
                                this.value = t,
                                this._pendingValue = p
                            }
                            handleEvent(t) {
                                "function" == typeof this.value ? this.value.call(this.eventContext || this.element, t) : this.value.handleEvent(t)
                            }
                        }
                        (t, e.slice(1), i.eventContext)] : "?" === n ? [new class {
                            constructor(t, e, s) {
                                if (this.value = void 0, this._pendingValue = void 0, 2 !== s.length || "" !== s[0] || "" !== s[1])
                                    throw new Error("Boolean attributes can only contain a single expression");
                                this.element = t,
                                this.name = e,
                                this.strings = s
                            }
                            setValue(t) {
                                this._pendingValue = t
                            }
                            commit() {
                                for (; d(this._pendingValue); ) {
                                    const t = this._pendingValue;
                                    this._pendingValue = p,
                                    t(this)
                                }
                                if (this._pendingValue === p)
                                    return;
                                const t = !!this._pendingValue;
                                this.value !== t && (t ? this.element.setAttribute(this.name, "") : this.element.removeAttribute(this.name)),
                                this.value = t,
                                this._pendingValue = p
                            }
                        }
                        (t, e.slice(1), s)] : new O(t, e, s).parts
                }
                handleTextExpression(t) {
                    return new A(t)
                }
            };
            function P(t) {
                let e = j.get(t.type);
                void 0 === e && (e = {
                        stringsArray: new WeakMap,
                        keyString: new Map
                    }, j.set(t.type, e));
                let s = e.stringsArray.get(t.strings);
                if (void 0 !== s)
                    return s;
                const i = t.strings.join(g);
                return void 0 === (s = e.keyString.get(i)) && (s = new f(t, t.getTemplateElement()), e.keyString.set(i, s)),
                e.stringsArray.set(t.strings, s),
                s
            }
            const j = new Map,
            D = new WeakMap;
            (window.litHtmlVersions || (window.litHtmlVersions = [])).push("1.0.0");
            const L = (t, ...e) => new x(t, e, "html", k),
            M = 133;
            function R(t, e) {
                const {
                    element: {
                        content: s
                    },
                    parts: i
                } = t,
                n = document.createTreeWalker(s, M, null, !1);
                let a = V(i),
                o = i[a],
                r = -1,
                l = 0;
                const c = [];
                let d = null;
                for (; n.nextNode(); ) {
                    r++;
                    const t = n.currentNode;
                    for (t.previousSibling === d && (d = null), e.has(t) && (c.push(t), null === d && (d = t)), null !== d && l++; void 0 !== o && o.index === r; )
                        o.index = null !== d ? -1 : o.index - l, o = i[a = V(i, a)]
                }
                c.forEach(t => t.parentNode.removeChild(t))
            }
            const B = t => {
                let e = 11 === t.nodeType ? 0 : 1;
                const s = document.createTreeWalker(t, M, null, !1);
                for (; s.nextNode(); )
                    e++;
                return e
            },
            V = (t, e = -1) => {
                for (let s = e + 1; s < t.length; s++) {
                    const e = t[s];
                    if (w(e))
                        return s
                }
                return -1
            },
            H = (t, e) => `${t}--${e}`;
            let z = !0;
            void 0 === window.ShadyCSS ? z = !1 : void 0 === window.ShadyCSS.prepareTemplateDom && (console.warn("Incompatible ShadyCSS version detected.Please update to at least @webcomponents/webcomponentsjs@2.0.2 and@webcomponents/shadycss@1.3.1."), z = !1);
            const W = ["html", "svg"],
            F = new Set;
            window.JSCompiler_renameProperty = ((t, e) => t);
            const $ = {
                toAttribute(t, e) {
                    switch (e) {
                    case Boolean:
                        return t ? "" : null;
                    case Object:
                    case Array:
                        return null == t ? t : JSON.stringify(t)
                    }
                    return t
                },
                fromAttribute(t, e) {
                    switch (e) {
                    case Boolean:
                        return null !== t;
                    case Number:
                        return null === t ? null : Number(t);
                    case Object:
                    case Array:
                        return JSON.parse(t)
                    }
                    return t
                }
            },
            q = (t, e) => e !== t && (e == e || t == t),
            G = {
                attribute: !0,
                type: String,
                converter: $,
                reflect: !1,
                hasChanged: q
            },
            J = Promise.resolve(!0),
            K = 1,
            Y = 4,
            Q = 8,
            X = 16,
            Z = 32;






        window.customUI = window.customUI || {

            domHost(t) {
                if (t === document)
                    return null;
                const e = t.getRootNode();
                return e instanceof DocumentFragment ? e.host : e
            },
            lightOrShadow: (t, e) => t.shadowRoot ? t.shadowRoot.querySelector(e) : t.querySelector(e),
            getElementHierarchy(t, e) {
                if (null === t)
                    return null;
                const s = e.shift();
                return s ? window.customUI.getElementHierarchy(window.customUI.lightOrShadow(t, s), e) : t
            },
            getContext(t) {
                if (void 0 === t._context) {
                    t._context = [];
                    for (let e = "HA-ENTITIES-CARD" === t.tagName ? window.customUI.domHost(t) : t; e; e = window.customUI.domHost(e))
                        switch (e.tagName) {
                        case "HA-ENTITIES-CARD":
                            e.groupEntity ? t._context.push(e.groupEntity.entity_id) : !1 === e.groupEntity && e.states && e.states.length && t._context.push(`group.${a(e.states[0])}`);
                            break;
                        case "MORE-INFO-GROUP":
                        case "STATE-CARD-CONTENT":
                            e.stateObj && t._context.push(e.stateObj.entity_id);
                            break;
                        case "HA-CARDS":
                            t._context.push(e.getAttribute("data-view") || "default_view")
                        }
                    t._context.reverse()
                }
                return t._context
            },
            findMatch: (t, e) => e ? e[t] ? t : Object.keys(e).find(e => t.match(`^${e}$`)) : null,
            maybeChangeObjectByDevice(t) {
                const e = window.customUI.getName();
                if (!e)
                    return t;
                const s = this.findMatch(e, t.attributes.device);
                if (!s)
                    return t;
                const i = Object.assign({}, t.attributes.device[s]);
                return Object.keys(i).length ? window.customUI.applyAttributes(t, i) : t
            },
            maybeChangeObjectByGroup(t, e) {
                const s = window.customUI.getContext(t);
                if (!s)
                    return e;
                if (!e.attributes.group)
                    return e;
                const i = {};
                return s.forEach(t => {
                    const s = this.findMatch(t, e.attributes.group);
                    e.attributes.group[s] && Object.assign(i, e.attributes.group[s])
                }),
                Object.keys(i).length ? window.customUI.applyAttributes(e, i) : e
            },
            _setKeep(t, e) {
                void 0 === t._cui_keep ? t._cui_keep = e : t._cui_keep = t._cui_keep && e
            },
            maybeApplyTemplateAttributes(t, e, s, i) {
                if (!i.templates)
                    return window.customUI._setKeep(s, !0) , s;
                    const n = {};
                    let a = !1,
                    o = !1;
                    if (Object.keys(i.templates).forEach(r => {
                            const l = i.templates[r];
                            l.match(/\b(entities|hass)\b/) && (a = !0);
                            const c = window.customUI.computeTemplate(l, t, e, s, i, s.untemplated_attributes && s.untemplated_attributes[r] || i[r], s.untemplated_state || s.state);
                            null !== c && (n[r] = c, "state" === r ? c !== s.state && (o = !0) : "_stateDisplay" === r ? c !== s._stateDisplay && (o = !0) : c !== i[r] && (o = !0))
                        }), window.customUI._setKeep(s, !a), !o)
                        return s;
                    if (s.attributes === i) {
                        const t = window.customUI.applyAttributes(s, n);
                        return Object.prototype.hasOwnProperty.call(n, "state") && null !== n.state && (t.state = String(n.state), t.untemplated_state = s.state),
                        Object.prototype.hasOwnProperty.call(n, "_stateDisplay") && (t._stateDisplay = n._stateDisplay, t.untemplated_stateDisplay = s._stateDisplay),
                        window.customUI._setKeep(t, !a),
                        t
                    }
                    return Object.assign({}, s)
                },
                maybeApplyTemplates(t, e, s) {
                    const i = window.customUI.maybeApplyTemplateAttributes(t, e, s, s.attributes);
                    let n = i !== s;
                    function a(s) {
                        s && (Object.values(s).forEach(s => {
                                const a = window.customUI.maybeApplyTemplateAttributes(t, e, i, s);
                                n |= a !== i
                            }), a(s.device), a(s.group))
                    }
                    return a(s.attributes.device),
                    a(s.attributes.group),
                    i !== s ? i : n ? Object.assign({}, s) : s
                },
                applyAttributes: (t, e) => ({
                    entity_id: t.entity_id,
                    state: t.state,
                    attributes: Object.assign({}, t.attributes, e),
                    untemplated_attributes: t.attributes,
                    last_changed: t.last_changed
                }),
                maybeChangeObject(t, e, s, i) {
                    if (s)
                        return e;
                    let n = window.customUI.maybeChangeObjectByDevice(e);
                    return n = window.customUI.maybeChangeObjectByGroup(t, n),
                    (n = window.customUI.maybeApplyTemplateAttributes(t.hass, t.hass.states, n, n.attributes)) !== e && n.attributes.hidden && i ? null : n
                },
                updateMoreInfo() {
                    var majorVersion = window.customUI.lightOrShadow(document, "home-assistant").hass.connection.haVersion.split(".")[0];
                    var minorVersion = window.customUI.lightOrShadow(document, "home-assistant").hass.connection.haVersion.split(".")[1];
                    s = 0,
                    i = setInterval(function () {
                            ++s >= 2 && clearInterval(i);
                            try {
                                var t;
                                if (majorVersion > 0 || minorVersion >= 118) {
                                   var moreInfoNodeName;
                                   var contentChild;
                                   contentChild = document.querySelector("home-assistant").shadowRoot.querySelector("ha-more-info-dialog").shadowRoot.querySelector("ha-dialog").getElementsByClassName("content")[0].querySelector("more-info-content").childNodes;
                                   for(var c=0; c< contentChild.length;c++){
                                     var nodeItem = contentChild.item(c);
                                     if(nodeItem.nodeName.toLowerCase().startsWith("more-info-")){
                                       moreInfoNodeName = nodeItem.nodeName.toLowerCase()
                                     }
                                   }
                                   if (moreInfoNodeName == "more-info-group") {
                                     var moreInfoNestedNodeName;
                                     var contentChildNested;
                                     contentChildNested = document.querySelector("home-assistant").shadowRoot.querySelector("ha-more-info-dialog").shadowRoot.querySelector("ha-dialog").getElementsByClassName("content")[0].querySelector("more-info-group").shadowRoot.childNodes;
                                     for(var c=0; c< contentChildNested.length;c++){
                                       var nodeItemNested = contentChildNested.item(c);
                                       if(nodeItemNested.nodeName.toLowerCase().startsWith("more-info-")){
                                         moreInfoNestedNodeName = nodeItemNested.nodeName.toLowerCase()
                                       }
                                     }
                                     t = document.querySelector("home-assistant").shadowRoot.querySelector("ha-more-info-dialog").shadowRoot.querySelector("ha-dialog").getElementsByClassName("content")[0].querySelector("more-info-group").shadowRoot.querySelector(moreInfoNestedNodeName).shadowRoot.querySelector("ha-attributes").shadowRoot.querySelectorAll(".data-entry")
                                   } else {
                                     t = document.querySelector("home-assistant").shadowRoot.querySelector("ha-more-info-dialog").shadowRoot.querySelector("ha-dialog").getElementsByClassName("content")[0].querySelector(moreInfoNodeName).shadowRoot.querySelector("ha-attributes").shadowRoot.querySelectorAll(".data-entry")
                                   }
                                 } else if (minorVersion >= 115) {
                                  var moreInfoNodeName;
                                  var contentChild;
                                  contentChild = document.querySelector("home-assistant").shadowRoot.querySelector("ha-more-info-dialog").shadowRoot.querySelector("ha-dialog").getElementsByClassName("content")[0].childNodes;
                                  for(var c=0; c< contentChild.length;c++){
                                    var nodeItem = contentChild.item(c);
                                    if(nodeItem.nodeName.toLowerCase().startsWith("more-info-")){
                                      moreInfoNodeName = nodeItem.nodeName.toLowerCase()
                                    }
                                  }
                                  if (moreInfoNodeName == "more-info-group") {
                                    var moreInfoNestedNodeName;
                                    var contentChildNested;
                                    contentChildNested = document.querySelector("home-assistant").shadowRoot.querySelector("ha-more-info-dialog").shadowRoot.querySelector("ha-dialog").getElementsByClassName("content")[0].querySelector("more-info-group").shadowRoot.childNodes;
                                    for(var c=0; c< contentChildNested.length;c++){
                                      var nodeItemNested = contentChildNested.item(c);
                                      if(nodeItemNested.nodeName.toLowerCase().startsWith("more-info-")){
                                        moreInfoNestedNodeName = nodeItemNested.nodeName.toLowerCase()
                                      }
                                    }
                                    t = document.querySelector("home-assistant").shadowRoot.querySelector("ha-more-info-dialog").shadowRoot.querySelector("ha-dialog").getElementsByClassName("content")[0].querySelector("more-info-group").shadowRoot.querySelector(moreInfoNestedNodeName).shadowRoot.querySelector("ha-attributes").shadowRoot.querySelectorAll(".data-entry")
                                  } else {
                                    t = document.querySelector("home-assistant").shadowRoot.querySelector("ha-more-info-dialog").shadowRoot.querySelector("ha-dialog").getElementsByClassName("content")[0].querySelector(moreInfoNodeName).shadowRoot.querySelector("ha-attributes").shadowRoot.querySelectorAll(".data-entry")
                                  }
                                } else if (minorVersion >= 113) {
                                  // >= 113
                                  t = document.getElementsByTagName("home-assistant")[0].shadowRoot.querySelector("ha-more-info-dialog").shadowRoot.querySelector("ha-dialog").getElementsByClassName("content")[0].querySelector("more-info-content").childNodes[0].shadowRoot.querySelector("ha-attributes").shadowRoot.querySelectorAll(".data-entry")
                                  } else {
                                  // < 113
                                  t = document.getElementsByTagName("home-assistant")[0].shadowRoot.querySelector("ha-more-info-dialog").shadowRoot.querySelector("more-info-controls").shadowRoot.querySelector("paper-dialog-scrollable").querySelector("more-info-content").childNodes[0].shadowRoot.querySelector("ha-attributes").shadowRoot.querySelectorAll(".data-entry")
                                }
                                if (t.length) {
                                    var e;
                                    for (var n = 0; n < t.length; n++) {
                                        var o = t[n].getElementsByClassName("key")[0];
                                        if (o.innerText.toLowerCase().trim() == "hide attributes") {
                                          e = o.parentNode.getElementsByClassName("value")[0].innerText.split(",").map(function(item) { return item.replace("_", " ").trim(); });
                                          e.push("hide attributes");
                                        }
                                    }
                                    for (var n = 0; n < t.length; n++) {
                                        var o = t[n].getElementsByClassName("key")[0];
                                        (e.includes(o.innerText.toLowerCase().trim()) || e.includes("all")) && (o.parentNode.style.display = "none")
                                    }
                                    clearInterval(i)
                                }
                            } catch (err) {}
                        }, 100)
                },
                installStatesHook() {
                    customElements.whenDefined("home-assistant").then(() => {
                        const t = customElements.get("home-assistant");
                        if (!t || !t.prototype._updateHass)
                            return;
                        const e = t.prototype._updateHass;
                        t.prototype._updateHass = function (t) {
                            const {
                                hass: s
                            } = this;
                            t.states && Object.keys(t.states).forEach(e => {
                                const i = t.states[e];
                                if (i._cui_keep)
                                    return;
                                const n = window.customUI.maybeApplyTemplates(s, t.states, i);
                                s.states && i !== s.states[e] ? t.states[e] = n : i !== n && (t.states[e] = n)
                            }),
                            e.call(this, t),
                            t.themes && s._themeWaiters && (s._themeWaiters.forEach(t => t.stateChanged(t.state)), s._themeWaiters = void 0)
                        };
                        const s = window.customUI.lightOrShadow(document, "home-assistant");
                        s.hass && s.hass.states && s._updateHass({
                            states: s.hass.states
                        })
                    })
                },
                installStateBadge() {
                    customElements.whenDefined("state-badge").then(() => {
                        const t = customElements.get("state-badge");
                        if (t)
                            if (t.prototype._updateIconAppearance) {
                                const e = t.prototype._updateIconAppearance;
                                t.prototype._updateIconAppearance = function (t) {
                                    t.attributes.icon_color && !t.attributes.entity_picture ? (this.style.backgroundImage = "", Object.assign(this.$.icon.style, {
                                            color: t.attributes.icon_color,
                                            filter: ""
                                        })) : e.call(this, t)
                                }
                            } else if (t.prototype.updated) {
                                const e = t.prototype.updated;
                                t.prototype.updated = function (t) {
                                    if (!t.has("stateObj"))
                                        return;
                                    const {
                                        stateObj: s
                                    } = this;
                                    s.attributes.icon_color && !s.attributes.entity_picture ? (this.style.backgroundImage = "", this._showIcon = true, this._iconStyle = {
                                            color: s.attributes.icon_color
                                        }) : e.call(this, t)
                                }
                            }
                    })
                },
                installClassHooks() {
                    window.customUI.classInitDone || (window.customUI.classInitDone = !0, window.customUI.installStatesHook(), window.customUI.installStateBadge())
                },
                init() {
                    if (window.customUI.initDone)
                        return;
                    window.customUI.installClassHooks();
                    const t = window.customUI.lightOrShadow(document, "home-assistant");
                    t.hass && t.hass.states ? (window.customUI.initDone = !0, window.addEventListener("location-changed", window.setTimeout.bind(null, 100)), console.log(`Loaded ${Name} ${Version} ${Description}`), window.addEventListener("hass-more-info", window.customUI.updateMoreInfo), window.CUSTOM_UI_LIST || (window.CUSTOM_UI_LIST = []), window.CUSTOM_UI_LIST.push({
                            name: `${Name}`,
                            version: `${Version} ${Description}`,
                            url: "https://github.com/Mariusthvdb/custom-ui"
                        })) : window.setTimeout(window.customUI.init, 1e3)
                },
                getName: () => window.localStorage.getItem("ha-device-name") || "",
                setName(t) {
                    window.localStorage.setItem("ha-device-name", t || "")
                },
                computeTemplate(t, e, s, i, n, a, o) {
                    const r = t.indexOf("return") >= 0 ? t : `return \`${t}\`;`;
                    try {
                        return new Function("hass", "entities", "entity", "attributes", "attribute", "state", r)(e, s, i, n, a, o)
                    } catch (t) {
                        if (t instanceof SyntaxError || t instanceof ReferenceError)
                            return console.warn(`${t.name}: ${t.message} in template ${r}`), null;
                        throw t
                    }
                }
            },
            window.customUI.init(),
            s(1);
            class lt {
                constructor(t) {
                    this.value = t.toString()
                }
                toString() {
                    return this.value
                }
            }
            const ct = function (t, ...e) {
                const s = document.createElement("template");
                return s.innerHTML = e.reduce((e, s, i) => e + function (t) {
                        if (t instanceof HTMLTemplateElement)
                            return t.innerHTML;
                        if (t instanceof lt)
                            return function (t) {
                                if (t instanceof lt)
                                    return t.value;
                                throw new Error(`non-literal value passed to Polymer's htmlLiteral function: ${t}`)
                            }
                        (t);
                        throw new Error(`non-template value passed to Polymer's html function: ${t}`)
                    }
                        (s) + t[i + 1], t[0]),
                s
            };
            function ut() {
                customElements.define("dynamic-element", class extends Polymer.Element {
                    static get properties() {
                        return {
                            hass: Object,
                            stateObj: Object,
                            elementName: String,
                            inDialog: {
                                type: Boolean,
                                value: !1
                            }
                        }
                    }
                    static get observers() {
                        return ["observerFunc(hass, stateObj, elementName, inDialog)"]
                    }
                    observerFunc(t, e, s, i) {
                        o(this, s ? s.toUpperCase() : "DIV", {
                            hass: t,
                            stateObj: e,
                            inDialog: i
                        })
                    }
                })
            }
            Polymer && Polymer.Element && customElements.get("home-assistant") ? ut() : customElements.whenDefined("home-assistant").then(() => ut()),
            customElements.whenDefined("state-card-display").then(() => {
                customElements.define("dynamic-with-extra", class extends(customElements.get("state-card-display")) {
                    static get template() {
                        return ct
                    }
                })
            })
        }, function (t, e) {
            window.JSCompiler_renameProperty = function (t) {
                return t
            }
        }
    ]);
/*! Cola UI - v1.0.0
 * Copyright (c) 2002-2016 BSTEK Corp. All rights reserved.
 *
 * This file is dual-licensed under the AGPLv3 (http://www.gnu.org/licenses/agpl-3.0.html)
 * and BSDN commercial (http://www.bsdn.org/licenses) licenses.
 *
 * If you are unsure which license is appropriate for your use, please contact the sales department
 * at http://www.bstek.com/contact.
 */(function() {
  var ALIAS_REGEXP, IGNORE_NODES, LinkedList, ON_NODE_REMOVED_KEY, Page, TYPE_SEVERITY, USER_DATA_KEY, VALIDATION_ERROR, VALIDATION_INFO, VALIDATION_NONE, VALIDATION_WARN, _$, _DOMNodeRemovedListener, _Entity, _EntityList, _RESERVE_NAMES, _compileResourceUrl, _cssCache, _destroyDomBinding, _doRrenderDomTemplate, _evalDataPath, _findRouter, _getData, _getHashPath, _jsCache, _loadCss, _loadHtml, _loadJs, _matchValue, _onHashChange, _onStateChange, _removeNodeData, _setValue, _sortConvertor, _switchRouter, _toJSON, alertException, appendChild, browser, buildAliasFeature, buildAttrFeature, buildBindFeature, buildClassFeature, buildContent, buildEvent, buildI18NFeature, buildRepeatFeature, buildStyleFeature, buildWatchFeature, cola, colaEventRegistry, compileConvertor, createContentPart, createNodeForAppend, currentRoutePath, currentRouter, defaultDataTypes, defaultLocale, definedSetting, digestExpression, doMergeDefinitions, doms, exceptionStack, getEntityPath, i18nStore, key, oldIE, originalAjax, os, preprocessClass, routerRegistry, setAttrs, setting, splitExpression, sprintf, tagSplitter, trimPath, typeRegistry, uniqueIdSeed, value, xCreate,
    extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty,
    slice = [].slice;

  this.cola = cola = function() {
    var ref;
    return (ref = cola["_rootFunc"]) != null ? ref.apply(cola, arguments) : void 0;
  };

  cola.util = {};

  cola.constants = {
    VARIABLE_NAME_REGEXP: /^[_a-zA-Z][_a-zA-Z0-9]*$/g,
    VIEW_CLASS: "c-view",
    VIEW_PORT_CLASS: "c-viewport",
    IGNORE_DIRECTIVE: "c-ignore",
    COLLECTION_CURRENT_CLASS: "current",
    DEFAULT_PATH: "$root",
    DOM_USER_DATA_KEY: "_d",
    DOM_BINDING_KEY: "_binding",
    DOM_INITIALIZER_KEY: "_initialize",
    REPEAT_TEMPLATE_KEY: "_template",
    REPEAT_TAIL_KEY: "_tail",
    DOM_ELEMENT_KEY: "_element",
    NOT_WHITE_REG: /\S+/g,
    CLASS_REG: /[\t\r\n\f]/g,
    WIDGET_DIMENSION_UNIT: "px",
    MESSAGE_REFRESH: 0,
    MESSAGE_DATA_CHANGE: 1,
    MESSAGE_CURRENT_CHANGE: 10,
    MESSAGE_EDITING_STATE_CHANGE: 11,
    MESSAGE_VALIDATION_STATE_CHANGE: 15,
    MESSAGE_INSERT: 20,
    MESSAGE_REMOVE: 21,
    MESSAGE_LOADING_START: 30,
    MESSAGE_LOADING_END: 31
  };

  oldIE = !-[1,];

  $.xCreate = xCreate = function(template, context) {
    var $el, child, content, el, element, elements, l, len1, len2, len3, o, part, q, ref, tagName, templateProcessor;
    if (template instanceof Array) {
      elements = [];
      for (l = 0, len1 = template.length; l < len1; l++) {
        part = template[l];
        element = xCreate(part, context);
        if (element != null) {
          elements.push(element);
        }
      }
      return elements;
    }
    if (xCreate.templateProcessors.length) {
      ref = xCreate.templateProcessors;
      for (o = 0, len2 = ref.length; o < len2; o++) {
        templateProcessor = ref[o];
        element = templateProcessor(template);
        if (element != null) {
          return element;
        }
      }
    }
    if (typeof template === "string") {
      if (template.charAt(0) === '^') {
        template = {
          tagName: template.substring(1)
        };
      } else {
        return document.createTextNode(template);
      }
    }
    tagName = template.tagName || "DIV";
    tagName = tagName.toUpperCase();
    if (oldIE && tagName.toUpperCase() === "INPUT" && template.type) {
      el = document.createElement("<" + tagName + " type=\"" + template.type + "\"/>");
    } else {
      el = document.createElement(tagName);
    }
    $el = $(el);
    setAttrs(el, $el, template, context);
    content = template.content;
    if (content != null) {
      if (typeof content === "string") {
        if (content.charAt(0) === '^') {
          appendChild(el, document.createElement(content.substring(1)));
        } else {
          $el.text(content);
        }
      } else {
        if (content instanceof Array) {
          for (q = 0, len3 = content.length; q < len3; q++) {
            part = content[q];
            if (typeof part === "string") {
              if (part.charAt(0) === '^') {
                appendChild(el, document.createElement(part.substring(1)));
              } else {
                appendChild(el, document.createTextNode(part));
              }
            } else {
              child = xCreate(part, context);
              if (child != null) {
                appendChild(el, child);
              }
            }
          }
        } else if (content.nodeType) {
          appendChild(el, content);
        } else {
          child = xCreate(content, context);
          if (child != null) {
            appendChild(el, child);
          }
        }
      }
    } else if (template.html) {
      $el.html(template.html);
    }
    return el;
  };

  xCreate.templateProcessors = [];

  xCreate.attributeProcessor = {
    data: function($el, attrName, attrValue, context) {
      $el.data(attrValue);
    },
    style: function($el, attrName, attrValue, context) {
      if (typeof attrValue === "string") {
        $el.attr("style", attrValue);
      } else if (attrValue !== null) {
        $el.css(attrValue);
      }
    }
  };

  setAttrs = function(el, $el, attrs, context) {
    var attrName, attrValue, attributeProcessor;
    for (attrName in attrs) {
      attrValue = attrs[attrName];
      attributeProcessor = xCreate.attributeProcessor[attrName];
      if (attributeProcessor) {
        attributeProcessor($el, attrName, attrValue, context);
      } else {
        switch (attrName) {
          case "tagName":
          case "nodeName":
          case "content":
          case "html":
            continue;
          case "contextKey":
            if (context instanceof Object && attrValue && typeof attrValue === "string") {
              context[attrValue] = el;
            }
            break;
          default:
            if (typeof attrValue === "function") {
              $el.bind(attrName, attrValue);
            } else {
              $el.attr(attrName, attrValue);
            }
        }
      }
    }
  };

  appendChild = function(parentEl, el) {
    var tbody;
    if (parentEl.nodeName === "TABLE" && el.nodeName === "TR") {
      tbody;
      if (parentEl && parentEl.tBodies[0]) {
        tbody = parentEl.tBodies[0];
      } else {
        tbody = parentEl.appendChild(document.createElement("tbody"));
      }
      parentEl = tbody;
    }
    return parentEl.appendChild(el);
  };

  createNodeForAppend = function(template, context) {
    var element, fragment, l, len1, result;
    result = xCreate(template, context);
    if (!result) {
      return null;
    }
    if (result instanceof Array) {
      fragment = document.createDocumentFragment();
      for (l = 0, len1 = result.length; l < len1; l++) {
        element = result[l];
        fragment.appendChild(element);
      }
      result = fragment;
    }
    return result;
  };

  $.fn.xAppend = function(template, context) {
    var result;
    result = createNodeForAppend(template, context);
    if (!result) {
      return null;
    }
    return this.append(result);
  };

  $.fn.xInsertBefore = function(template, context) {
    var result;
    result = createNodeForAppend(template, context);
    if (!result) {
      return null;
    }
    return this.before(result);
  };

  $.fn.xInsertAfter = function(template, context) {
    var result;
    result = createNodeForAppend(template, context);
    if (!result) {
      return null;
    }
    return this.after(result);
  };

  cola.util.KeyedArray = (function() {
    KeyedArray.prototype.size = 0;

    function KeyedArray() {
      this.elements = [];
      this.keyMap = {};
    }

    KeyedArray.prototype.add = function(key, element) {
      var i;
      if (this.keyMap.hasOwnProperty(key)) {
        i = this.elements.indexOf(element);
        if (i > -1) {
          this.elements.splice(i, 1);
        }
      }
      this.keyMap[key] = element;
      this.size = this.elements.push(element);
      return this;
    };

    KeyedArray.prototype.remove = function(key) {
      var element, i;
      if (typeof key === "number") {
        i = key;
        element = this.elements[i];
        this.elements.splice(i, 1);
        this.size = this.elements.length;
        if (element) {
          for (key in this.keyMap) {
            if (this.keyMap[key] === element) {
              delete this.keyMap[key];
              break;
            }
          }
        }
      } else {
        element = this.keyMap[key];
        delete this.keyMap[key];
        if (element) {
          i = this.elements.indexOf(element);
          if (i > -1) {
            this.elements.splice(i, 1);
            this.size = this.elements.length;
          }
        }
      }
      return element;
    };

    KeyedArray.prototype.get = function(key) {
      if (typeof key === "number") {
        return this.elements[key];
      } else {
        return this.keyMap[key];
      }
    };

    KeyedArray.prototype.getIndex = function(key) {
      var element;
      element = this.keyMap[key];
      if (element) {
        return this.elements.indexOf(element);
      }
      return -1;
    };

    KeyedArray.prototype.clear = function() {
      this.elements = [];
      this.keyMap = {};
      this.size = 0;
    };

    KeyedArray.prototype.elements = function() {
      return this.elements;
    };

    KeyedArray.prototype.each = function(fn) {
      var element, l, len1, ref;
      ref = this.elements;
      for (l = 0, len1 = ref.length; l < len1; l++) {
        element = ref[l];
        if (fn.call(this, element) === false) {
          break;
        }
      }
    };

    return KeyedArray;

  })();

  cola.util.trim = function(text) {
    if (text != null) {
      return String.prototype.trim.call(text);
    } else {
      return "";
    }
  };

  cola.util.capitalize = function(text) {
    if (!text) {
      return text;
    }
    return text.charAt(0).toUpperCase() + text.slice(1);
  };

  cola.util.isSimpleValue = function(value) {
    var type;
    if (value === null || value === void 0) {
      return false;
    }
    type = typeof value;
    return type !== "object" && type !== "function" || type instanceof Date;
  };

  cola.util.parseStyleLikeString = function(styleStr, headerProp) {
    var i, j, l, len1, part, parts, style, styleExpr, styleProp;
    if (!styleStr) {
      return false;
    }
    style = {};
    parts = styleStr.split(";");
    for (i = l = 0, len1 = parts.length; l < len1; i = ++l) {
      part = parts[i];
      j = part.indexOf(":");
      if (j > 0) {
        styleProp = this.trim(part.substring(0, j));
        styleExpr = this.trim(part.substring(j + 1));
        if (styleProp && styleExpr) {
          style[styleProp] = styleExpr;
        }
      } else {
        part = this.trim(part);
        if (!part) {
          continue;
        }
        if (i === 0 && headerProp) {
          style[headerProp] = part;
        } else {
          style[part] = true;
        }
      }
    }
    return style;
  };

  cola.util.parseFunctionArgs = function(func) {
    var arg, argStr, args, i, l, len1, rawArgs;
    argStr = func.toString().match(/\([^\(\)]*\)/)[0];
    rawArgs = argStr.substring(1, argStr.length - 1).split(",");
    args = [];
    for (i = l = 0, len1 = rawArgs.length; l < len1; i = ++l) {
      arg = rawArgs[i];
      arg = cola.util.trim(arg);
      if (arg) {
        args.push(arg);
      }
    }
    return args;
  };

  cola.util.parseListener = function(listener) {
    var argStr, args, argsMode;
    argsMode = 1;
    argStr = listener.toString().match(/\([^\(\)]*\)/)[0];
    args = argStr.substring(1, argStr.length - 1).split(",");
    if (args.length) {
      if (cola.util.trim(args[0]) === "arg") {
        argsMode = 2;
      }
    }
    listener._argsMode = argsMode;
    return argsMode;
  };

  cola.util.isCompatibleType = function(baseType, type) {
    if (type === baseType) {
      return true;
    }
    while (type.__super__) {
      type = type.__super__.constructor;
      if (type === baseType) {
        return true;
      }
    }
    return false;
  };

  cola.util.delay = function(owner, name, delay, fn) {
    cola.util.cancelDelay(owner, name);
    owner["_timer_" + name] = setTimeout(function() {
      fn.call(owner);
    }, delay);
  };

  cola.util.cancelDelay = function(owner, name) {
    var key, timerId;
    key = "_timer_" + name;
    timerId = owner[key];
    if (timerId) {
      delete owner[key];
      clearTimeout(timerId);
    }
  };

  cola.util.waitForAll = function(funcs, callback) {
    var completed, func, id, l, len1, procedures, subCallback, total;
    if (!funcs || !funcs.length) {
      cola.callback(callback, true);
    }
    completed = 0;
    total = funcs.length;
    procedures = {};
    for (l = 0, len1 = funcs.length; l < len1; l++) {
      func = funcs[l];
      id = cola.uniqueId();
      procedures[id] = true;
      subCallback = {
        id: id,
        complete: function(success) {
          var disabled;
          if (disabled) {
            return;
          }
          if (success) {
            if (procedures[this.id]) {
              delete procedures[this.id];
              completed++;
              if (completed === total) {
                cola.callback(callback, true);
                disabled = true;
              }
            }
          } else {
            cola.callback(callback, false);
            disabled = true;
          }
        }
      };
      subCallback.scope = subCallback;
      func(subCallback);
    }
  };

  cola.version = "${version}";

  uniqueIdSeed = 1;

  cola.uniqueId = function() {
    return "_id" + (uniqueIdSeed++);
  };

  cola.sequenceNo = function() {
    return uniqueIdSeed++;
  };

  cola._EMPTY_FUNC = function() {};

  if (typeof window !== "undefined" && window !== null) {
    (function() {
      var s, theshold, ua;
      cola.browser = {};
      cola.os = {};
      cola.device = {};
      ua = window.navigator.userAgent.toLowerCase();
      if ((s = ua.match(/webkit\/([\d.]+)/))) {
        cola.browser.webkit = s[1] || -1;
        if ((s = ua.match(/chrome\/([\d.]+)/))) {
          cola.browser.chrome = parseFloat(s[1]) || -1;
        } else if ((s = ua.match(/version\/([\d.]+).*safari/))) {
          cola.browser.safari = parseFloat(s[1]) || -1;
        }
        if ((s = ua.match(/qqbrowser\/([\d.]+)/))) {
          cola.browser.qqbrowser = parseFloat(s[1]) || -1;
        }
      } else if ((s = ua.match(/msie ([\d.]+)/))) {
        cola.browser.ie = parseFloat(s[1]) || -1;
      } else if ((s = ua.match(/trident/))) {
        cola.browser.ie = 11;
      } else if ((s = ua.match(/firefox\/([\d.]+)/))) {
        cola.browser.mozilla = parseFloat(s[1]) || -1;
      } else if ((s = ua.match(/opera.([\d.]+)/))) {
        cola.browser.opera = parseFloat(s[1]) || -1;
      }
      if ((s = ua.match(/(iphone|ipad).*os\s([\d_]+)/))) {
        cola.os.ios = parseFloat(s[2]) || -1;
        cola.device.pad = s[1] === "ipad";
        cola.device.phone = !cola.device.pad;
      } else {
        if ((s = ua.match(/(android)\s+([\d.]+)/))) {
          cola.os.android = parseFloat(s[1]) || -1;
          if ((s = ua.match(/micromessenger\/([\d.]+)/))) {
            cola.browser.weixin = parseFloat(s[1]) || -1;
          }
        } else if ((s = ua.match(/(windows)[\D]*([\d]+)/))) {
          cola.os.windows = parseFloat(s[1]) || -1;
        }
      }
      cola.device.mobile = !!(("ontouchstart" in window) && ua.match(/(mobile)/));
      cola.device.desktop = !cola.device.mobile;
      if (cola.device.mobile && !cola.os.ios) {
        theshold = 768;
        if (cola.browser.qqbrowser) {
          cola.device.pad = (window.screen.width / 2) >= theshold || (window.screen.height / 2) >= theshold;
        } else {
          cola.device.pad = window.screen.width >= theshold || window.screen.height >= theshold;
        }
        cola.device.phone = !cola.device.pad;
      }
    })();
  }


  /*
  Event
   */

  colaEventRegistry = {
    ready: {},
    settingChange: {},
    exception: {},
    beforeRouterSwitch: {},
    routerSwitch: {}
  };

  cola.on = function(eventName, listener) {
    var alias, aliasMap, i, listenerRegistry, listeners;
    i = eventName.indexOf(":");
    if (i > 0) {
      alias = eventName.substring(i + 1);
      eventName = eventName.substring(0, i);
    }
    listenerRegistry = colaEventRegistry[eventName];
    if (!listenerRegistry) {
      throw new cola.Exception("Unrecognized event \"" + eventName + "\".");
    }
    if (typeof listener !== "function") {
      throw new cola.Exception("Invalid event listener.");
    }
    listeners = listenerRegistry.listeners;
    aliasMap = listenerRegistry.aliasMap;
    if (listeners) {
      if (alias && (aliasMap != null ? aliasMap[alias] : void 0) > -1) {
        cola.off(eventName + ":" + alias);
      }
      listeners.push(listener);
      i = listeners.length - 1;
    } else {
      listenerRegistry.listeners = listeners = [listener];
      i = 0;
    }
    if (alias) {
      if (!aliasMap) {
        listenerRegistry.aliasMap = aliasMap = {};
      }
      aliasMap[alias] = i;
    }
    return this;
  };

  cola.off = function(eventName, listener) {
    var alias, aliasMap, i, listenerRegistry, listeners;
    i = eventName.indexOf(":");
    if (i > 0) {
      alias = eventName.substring(i + 1);
      eventName = eventName.substring(0, i);
    }
    listenerRegistry = colaEventRegistry[eventName];
    if (!listenerRegistry) {
      return this;
    }
    listeners = listenerRegistry.listeners;
    if (!listeners || listeners.length === 0) {
      return this;
    }
    i = -1;
    if (alias) {
      aliasMap = listenerRegistry.aliasMap;
      i = aliasMap != null ? aliasMap[alias] : void 0;
      if (i > -1) {
        if (aliasMap != null) {
          delete aliasMap[alias];
        }
        listeners.splice(i, 1);
      }
    } else if (listener) {
      i = listeners.indexOf(listener);
      if (i > -1) {
        listeners.splice(i, 1);
        aliasMap = listenerRegistry.aliasMap;
        if (aliasMap) {
          for (alias in aliasMap) {
            if (aliasMap[alias] === listener) {
              delete aliasMap[alias];
              break;
            }
          }
        }
      }
    } else {
      delete listenerRegistry.listeners;
      delete listenerRegistry.aliasMap;
    }
    return this;
  };

  cola.getListeners = function(eventName) {
    var listener, ref;
    listener = (ref = colaEventRegistry[eventName]) != null ? ref.listeners : void 0;
    if (listener != null ? listener.length : void 0) {
      return listener;
    } else {
      return null;
    }
  };

  cola.fire = function(eventName, self, arg) {
    var argsMode, l, len1, listener, listeners, ref, retValue;
    if (arg == null) {
      arg = {};
    }
    listeners = (ref = colaEventRegistry[eventName]) != null ? ref.listeners : void 0;
    if (listeners) {
      for (l = 0, len1 = listeners.length; l < len1; l++) {
        listener = listeners[l];
        argsMode = listener._argsMode;
        if (!listener._argsMode) {
          argsMode = cola.util.parseListener(listener);
        }
        if (argsMode === 1) {
          retValue = listener.call(this, self, arg);
        } else {
          retValue = listener.call(this, arg, self);
        }
        if (retValue === false) {
          return false;
        }
      }
    }
    return true;
  };

  cola.ready = function(listener) {
    return this.on("ready", listener);
  };


  /*
  Setting
   */

  setting = {
    defaultCharset: "utf-8"
  };

  cola.setting = function(key, value) {
    var k, v;
    if (typeof key === "string") {
      if (value !== void 0) {
        setting[key] = value;
        if (cola.getListeners("settingChange")) {
          cola.fire("settingChange", cola, {
            key: key
          });
        }
      } else {
        return setting[key];
      }
    } else if (typeof key === "object") {
      for (k in key) {
        v = key[k];
        setting[k] = v;
        if (cola.getListeners("settingChange")) {
          cola.fire("settingChange", cola, {
            key: k
          });
        }
      }
    }
    return this;
  };

  definedSetting = (typeof colaSetting !== "undefined" && colaSetting !== null) || (typeof global !== "undefined" && global !== null ? global.colaSetting : void 0);

  if (definedSetting) {
    for (key in definedSetting) {
      value = definedSetting[key];
      cola.setting(key, value);
    }
  }


  /*
  Exception
   */

  exceptionStack = [];

  alertException = function(ex) {
    var msg;
    if (ex instanceof cola.Exception || ex instanceof Error) {
      msg = ex.message;
    } else {
      msg = ex + "";
    }
    if (typeof alert === "function") {
      alert(msg);
    }
  };

  cola.Exception = (function() {
    function Exception(message3, error1) {
      this.message = message3;
      this.error = error1;
      if (this.error) {
        if (typeof console !== "undefined" && console !== null) {
          if (typeof console.trace === "function") {
            console.trace(this.error);
          }
        }
      }
      exceptionStack.push(this);
      setTimeout((function(_this) {
        return function() {
          if (exceptionStack.indexOf(_this) > -1) {
            cola.Exception.processException(_this);
          }
        };
      })(this), 50);
    }

    Exception.processException = function(ex) {
      var ex2, scope;
      if (cola.Exception.ignoreAll) {
        return;
      }
      if (ex) {
        cola.Exception.removeException(ex);
      }
      if (ex instanceof cola.AbortException) {
        return;
      }
      if (cola.fire("exception", cola, {
        exception: ex
      }) === false) {
        return;
      }
      if (ex instanceof cola.RunnableException) {
        eval("var fn = function(){" + ex.script + "}");
        scope = typeof window !== "undefined" && window !== null ? window : this;
        fn.call(scope);
      } else {
        if (cola.Exception.ignoreAll) {
          return;
        }
        try {
          if (typeof document !== "undefined" && document !== null ? document.body : void 0) {
            if (ex.showException) {
              ex.showException();
            } else {
              cola.Exception.showException(ex);
            }
          } else {
            if (ex.safeShowException) {
              ex.safeShowException();
            } else {
              cola.Exception.safeShowException(ex);
            }
          }
        } catch (_error) {
          ex2 = _error;
          cola.Exception.removeException(ex2);
          if (ex2.safeShowException) {
            ex2.safeShowException();
          } else {
            cola.Exception.safeShowException(ex2);
          }
        }
      }
    };

    Exception.removeException = function(ex) {
      var i;
      i = exceptionStack.indexOf(ex);
      if (i > -1) {
        exceptionStack.splice(i, 1);
      }
    };

    Exception.safeShowException = function(exception) {
      alertException(exception);
    };

    Exception.showException = function(exception) {
      alertException(exception);
    };

    return Exception;

  })();

  cola.AbortException = (function(superClass) {
    extend(AbortException, superClass);

    function AbortException() {}

    return AbortException;

  })(cola.Exception);

  cola.RunnableException = (function(superClass) {
    extend(RunnableException, superClass);

    function RunnableException(script1) {
      this.script = script1;
      RunnableException.__super__.constructor.call(this, "[script]");
    }

    return RunnableException;

  })(cola.Exception);


  /*
  I18N
   */

  defaultLocale = "en";

  i18nStore = {};

  sprintf = function() {
    var i, l, len1, param, params, templ;
    templ = arguments[0], params = 2 <= arguments.length ? slice.call(arguments, 1) : [];
    for (i = l = 0, len1 = params.length; l < len1; i = ++l) {
      param = params[i];
      templ = templ.replace(new RegExp("\\{" + i + "\\}", "g"), param);
    }
    return templ;
  };

  cola.i18n = function() {
    var bundle, key, locale, oldBundle, params, ref, str, templ;
    key = arguments[0], params = 2 <= arguments.length ? slice.call(arguments, 1) : [];
    if (typeof key === "string") {
      locale = cola.setting("locale") || defaultLocale;
      templ = (ref = i18nStore[locale]) != null ? ref[key] : void 0;
      if (templ) {
        if (params.length) {
          return sprintf.apply(this, [templ].concat(params));
        } else {
          return templ;
        }
      } else {
        return key;
      }
    } else {
      bundle = key;
      locale = params[0] || defaultLocale;
      oldBundle = i18nStore[locale];
      if (oldBundle) {
        for (key in bundle) {
          str = bundle[key];
          oldBundle[key] = str;
        }
      } else {
        i18nStore[locale] = oldBundle = bundle;
      }
    }
  };

  cola.I18nException = (function(superClass) {
    extend(I18nException, superClass);

    function I18nException() {
      var key, params;
      key = arguments[0], params = 2 <= arguments.length ? slice.call(arguments, 1) : [];
      I18nException.__super__.constructor.call(this, cola.i18n.apply(cola, [key].concat(slice.call(params))));
    }

    return I18nException;

  })(cola.Exception);


  /*
  Mothods
   */

  cola.callback = function(callback, success, result) {
    var scope;
    if (!callback) {
      return;
    }
    if (typeof callback === "function") {
      if (success) {
        return callback.call(this, result);
      }
    } else {
      scope = callback.scope || this;
      if (callback.delay) {
        setTimeout(function() {
          callback.complete.call(scope, success, result);
        }, callback.delay);
      } else {
        return callback.complete.call(scope, success, result);
      }
    }
  };

  _toJSON = function(data) {
    var p, rawData, v;
    if (data) {
      if (typeof data === "object") {
        if (data instanceof cola.Entity || data instanceof cola.EntityList) {
          data = data.toJSON();
        } else {
          rawData = data;
          data = {};
          for (p in rawData) {
            v = rawData[p];
            data[p] = _toJSON(v);
          }
        }
      } else if (typeof data === "function") {
        data = void 0;
      }
    }
    return data;
  };

  originalAjax = jQuery.ajax;

  $.ajax = function(url, settings) {
    var data, p, rawData, v;
    if (typeof url === "object" && !settings) {
      settings = url;
    }
    data = settings.data;
    if (data) {
      if (typeof data === "object") {
        if (data instanceof cola.Entity || data instanceof cola.EntityList) {
          data = data.toJSON();
        } else {
          rawData = data;
          data = {};
          for (p in rawData) {
            v = rawData[p];
            data[p] = _toJSON(v);
          }
        }
      } else if (typeof data === "function") {
        data = void 0;
      }
      settings.data = data;
    }
    return originalAjax.apply(this, [url, settings]);
  };

  tagSplitter = " ";

  doMergeDefinitions = function(definitions, mergeDefinitions, overwrite) {
    var definition, mergeDefinition, name, prop;
    if (definitions === mergeDefinitions) {
      return;
    }
    for (name in mergeDefinitions) {
      mergeDefinition = mergeDefinitions[name];
      if (definitions.hasOwnProperty(name)) {
        definition = definitions[name];
        if (definition) {
          for (prop in mergeDefinition) {
            if (overwrite || !definition.hasOwnProperty(prop)) {
              definition[prop] = mergeDefinition[prop];
            }
          }
        } else {
          definitions[name] = mergeDefinition;
        }
      } else {
        definitions[name] = mergeDefinition;
      }
    }
  };

  preprocessClass = function(classType) {
    var attributes, events, ref, superType;
    superType = (ref = classType.__super__) != null ? ref.constructor : void 0;
    if (superType) {
      if (classType.__super__) {
        preprocessClass(superType);
      }
      attributes = classType.ATTRIBUTES;
      if (!attributes._inited) {
        attributes._inited = true;
        doMergeDefinitions(attributes, superType.ATTRIBUTES, false);
      }
      events = classType.EVENTS;
      if (!events._inited) {
        events._inited = true;
        doMergeDefinitions(events, superType.EVENTS, false);
      }
    }
  };

  cola.Element = (function() {
    Element.mixin = function(classType, mixin) {
      var attributes, events, member, mixInEvents, mixinAttributes, name;
      for (name in mixin) {
        member = mixin[name];
        if (name === "ATTRIBUTES") {
          mixinAttributes = member;
          if (mixinAttributes) {
            attributes = classType.ATTRIBUTES != null ? classType.ATTRIBUTES : classType.ATTRIBUTES = {};
            doMergeDefinitions(attributes, mixinAttributes, true);
          }
        } else if (name === "EVENTS") {
          mixInEvents = member;
          if (mixInEvents) {
            events = classType.EVENTS != null ? classType.EVENTS : classType.EVENTS = {};
            doMergeDefinitions(events, mixInEvents, true);
          }
        } else if (name === "constructor") {
          if (!classType._constructors) {
            classType._constructors = [member];
          } else {
            classType._constructors.push(member);
          }
        } else if (name === "destroy") {
          if (!classType._destructors) {
            classType._destructors = [member];
          } else {
            classType._destructors.push(member);
          }
        } else {
          classType.prototype[name] = member;
        }
      }
    };

    Element.ATTRIBUTES = {
      tag: {
        getter: function() {
          if (this._tag) {
            return this._tag.join(tagSplitter);
          } else {
            return null;
          }
        },
        setter: function(tag) {
          var l, len1, len2, o, ref, t, ts;
          if (this._tag) {
            ref = this._tag;
            for (l = 0, len1 = ref.length; l < len1; l++) {
              t = ref[l];
              cola.tagManager.unreg(t, this);
            }
          }
          if (tag) {
            this._tag = ts = tag.split(tagSplitter);
            for (o = 0, len2 = ts.length; o < len2; o++) {
              t = ts[o];
              cola.tagManager.reg(t, this);
            }
          } else {
            this._tag = null;
          }
        }
      },
      userData: null
    };

    Element.EVENTS = {
      attributeChange: null,
      destroy: null
    };

    function Element(config) {
      var attr, attrConfig, attrConfigs, classType, constructor, l, len1, ref;
      this._constructing = true;
      classType = this.constructor;
      if (!classType.ATTRIBUTES._inited || !classType.EVENTS._inited) {
        preprocessClass(classType);
      }
      this._scope = (config != null ? config.scope : void 0) || cola.currentScope;
      attrConfigs = classType.ATTRIBUTES;
      for (attr in attrConfigs) {
        attrConfig = attrConfigs[attr];
        if ((attrConfig != null ? attrConfig.defaultValue : void 0) !== void 0) {
          if (attrConfig.setter) {
            attrConfig.setter.call(this, attrConfig.defaultValue, attr);
          } else {
            this["_" + attr] = attrConfig.defaultValue;
          }
        }
      }
      if (classType._constructors) {
        ref = classType._constructors;
        for (l = 0, len1 = ref.length; l < len1; l++) {
          constructor = ref[l];
          constructor.call(this);
        }
      }
      if (config) {
        this.set(config, true);
      }
      delete this._constructing;
    }

    Element.prototype.destroy = function() {
      var classType, destructor, elementAttrBinding, l, len1, p, ref, ref1;
      classType = this.constructor;
      if (classType._destructors) {
        ref = classType._destructors;
        for (l = 0, len1 = ref.length; l < len1; l++) {
          destructor = ref[l];
          destructor.call(this);
        }
      }
      if (this._elementAttrBindings) {
        ref1 = this._elementAttrBindings;
        for (p in ref1) {
          elementAttrBinding = ref1[p];
          elementAttrBinding.destroy();
        }
      }
      this.fire("destroy", this);
      if (this._tag) {
        this._set("tag", null);
      }
    };

    Element.prototype.get = function(attr, ignoreError) {
      var l, len1, obj, path, paths;
      if (attr.indexOf(".") > -1) {
        paths = attr.split(".");
        obj = this;
        for (l = 0, len1 = paths.length; l < len1; l++) {
          path = paths[l];
          if (obj instanceof cola.Element) {
            obj = obj._get(path, ignoreError);
          } else if (typeof obj.get === "function") {
            obj = obj.get(path);
          } else {
            obj = obj[path];
          }
          if (obj == null) {
            break;
          }
        }
        return obj;
      } else {
        return this._get(attr, ignoreError);
      }
    };

    Element.prototype._get = function(attr, ignoreError) {
      var attrConfig;
      if (!this.constructor.ATTRIBUTES.hasOwnProperty(attr)) {
        if (ignoreError) {
          return;
        }
        throw new cola.Exception("Unrecognized Attribute \"" + attr + "\".");
      }
      attrConfig = this.constructor.ATTRIBUTES[attr];
      if (attrConfig != null ? attrConfig.getter : void 0) {
        return attrConfig.getter.call(this, attr);
      } else {
        return this["_" + attr];
      }
    };

    Element.prototype.set = function(attr, value, ignoreError) {
      var config, i, l, len1, obj, path, paths;
      if (typeof attr === "string") {
        if (attr.indexOf(".") > -1) {
          paths = attr.split(".");
          obj = this;
          for (i = l = 0, len1 = paths.length; l < len1; i = ++l) {
            path = paths[i];
            if (obj instanceof cola.Element) {
              obj = obj._get(path, ignoreError);
            } else {
              obj = obj[path];
            }
            if (obj == null) {
              break;
            }
            if (i >= (paths.length - 2)) {
              break;
            }
          }
          if ((obj == null) && !ignoreError) {
            throw new cola.Exception("Cannot set attribute \"" + (path.slice(0, i).join(".")) + "\" of undefined.");
          }
          if (obj instanceof cola.Element) {
            obj._set(paths[paths.length - 1], value, ignoreError);
          } else if (typeof obj.set === "function") {
            obj.set(paths[paths.length - 1], value);
          } else {
            obj[paths[paths.length - 1]] = value;
          }
        } else {
          this._set(attr, value, ignoreError);
        }
      } else {
        config = attr;
        ignoreError = value;
        for (attr in config) {
          this.set(attr, config[attr], ignoreError);
        }
      }
      return this;
    };

    Element.prototype._set = function(attr, value, ignoreError) {
      var action, attrConfig, eventName, expression, i, parts, ref, scope;
      if (typeof value === "string" && this._scope) {
        if (value.charCodeAt(0) === 123) {
          parts = cola._compileText(value);
          if ((parts != null ? parts.length : void 0) > 0) {
            value = parts[0];
          }
        }
      }
      if (this.constructor.ATTRIBUTES.hasOwnProperty(attr)) {
        attrConfig = this.constructor.ATTRIBUTES[attr];
        if (attrConfig) {
          if (attrConfig.readOnly) {
            if (ignoreError) {
              return;
            }
            throw new cola.Exception("Attribute \"" + attr + "\" is readonly.");
          }
          if (!this._constructing && attrConfig.readOnlyAfterCreate) {
            if (ignoreError) {
              return;
            }
            throw new cola.Exception("Attribute \"" + attr + "\" cannot be changed after create.");
          }
        }
      } else if (value) {
        eventName = attr;
        i = eventName.indexOf(":");
        if (i > 0) {
          eventName = eventName.substring(0, i);
        }
        if (this.constructor.EVENTS.hasOwnProperty(eventName)) {
          if (value instanceof cola.Expression) {
            expression = value;
            scope = this._scope;
            this.on(attr, function(self, arg) {
              expression.evaluate(scope, "never", {
                vars: {
                  self: self,
                  arg: arg
                }
              });
            }, ignoreError);
            return;
          } else if (typeof value === "function") {
            this.on(attr, value);
            return;
          } else if (typeof value === "string") {
            action = (ref = this._scope) != null ? ref.action(value) : void 0;
            if (action) {
              this.on(attr, action);
              return;
            }
          }
        }
        if (ignoreError) {
          return;
        }
        throw new cola.Exception("Unrecognized Attribute \"" + attr + "\".");
      }
      this._doSet(attr, attrConfig, value);
      if (this._eventRegistry) {
        if (this.getListeners("attributeChange")) {
          this.fire("attributeChange", this, {
            attribute: attr
          });
        }
      }
    };

    Element.prototype._doSet = function(attr, attrConfig, value) {
      var elementAttrBinding, elementAttrBindings, expression, scope;
      if (!this._duringBindingRefresh && this._elementAttrBindings) {
        elementAttrBinding = this._elementAttrBindings[attr];
        if (elementAttrBinding) {
          elementAttrBinding.destroy();
          delete this._elementAttrBindings[attr];
        }
      }
      if (value instanceof cola.Expression && cola.currentScope) {
        expression = value;
        scope = cola.currentScope;
        if (expression.isStatic) {
          value = expression.evaluate(scope, "never");
        } else {
          elementAttrBinding = new cola.ElementAttrBinding(this, attr, expression, scope);
          if (this._elementAttrBindings == null) {
            this._elementAttrBindings = {};
          }
          elementAttrBindings = this._elementAttrBindings;
          if (elementAttrBindings) {
            elementAttrBindings[attr] = elementAttrBinding;
          }
          value = elementAttrBinding.evaluate();
        }
      }
      if (attrConfig) {
        if (attrConfig.type === "boolean") {
          if ((value != null) && typeof value !== "boolean") {
            value = value === "true";
          }
        } else if (attrConfig.type === "number") {
          if ((value != null) && typeof value !== "number") {
            value = parseFloat(value) || 0;
          }
        }
        if (attrConfig["enum"] && attrConfig["enum"].indexOf(value) < 0) {
          throw new cola.Exception("The value \"" + value + "\" of attribute \"" + attr + "\" is out of range.");
        }
        if (attrConfig.setter) {
          attrConfig.setter.call(this, value, attr);
          return;
        }
      }
      this["_" + attr] = value;
    };

    Element.prototype._on = function(eventName, listener, alias, once) {
      var aliasMap, eventConfig, i, listenerRegistry, listeners;
      eventConfig = this.constructor.EVENTS[eventName];
      if (this._eventRegistry) {
        listenerRegistry = this._eventRegistry[eventName];
      } else {
        this._eventRegistry = {};
      }
      if (!listenerRegistry) {
        this._eventRegistry[eventName] = listenerRegistry = {};
      }
      if (once) {
        if (listenerRegistry.onceListeners == null) {
          listenerRegistry.onceListeners = [];
        }
        listenerRegistry.onceListeners.push(listener);
      }
      listeners = listenerRegistry.listeners;
      aliasMap = listenerRegistry.aliasMap;
      if (listeners) {
        if ((eventConfig != null ? eventConfig.singleListener : void 0) && listeners.length) {
          throw new cola.Exception("Multi listeners is not allowed for event \"" + eventName + "\".");
        }
        if (alias && (aliasMap != null ? aliasMap[alias] : void 0) > -1) {
          cola.off(eventName + ":" + alias);
        }
        listeners.push(listener);
        i = listeners.length - 1;
      } else {
        listenerRegistry.listeners = listeners = [listener];
        i = 0;
      }
      if (alias) {
        if (!aliasMap) {
          listenerRegistry.aliasMap = aliasMap = {};
        }
        aliasMap[alias] = i;
      }
    };

    Element.prototype.on = function(eventName, listener, once) {
      var alias, i;
      i = eventName.indexOf(":");
      if (i > 0) {
        alias = eventName.substring(i + 1);
        eventName = eventName.substring(0, i);
      }
      if (!this.constructor.EVENTS.hasOwnProperty(eventName)) {
        throw new cola.Exception("Unrecognized event \"" + eventName + "\".");
      }
      if (typeof listener !== "function") {
        throw new cola.Exception("Invalid event listener.");
      }
      this._on(eventName, listener, alias, once);
      return this;
    };

    Element.prototype.one = function(eventName, listener) {
      return this.on(eventName, listener, true);
    };

    Element.prototype._off = function(eventName, listener, alias) {
      var aliasMap, i, listenerRegistry, listeners, onceListeners;
      listenerRegistry = this._eventRegistry[eventName];
      if (!listenerRegistry) {
        return this;
      }
      listeners = listenerRegistry.listeners;
      if (!(listeners && listeners.length)) {
        return this;
      }
      i = -1;
      if (alias || listener) {
        if (alias) {
          aliasMap = listenerRegistry.aliasMap;
          i = aliasMap != null ? aliasMap[alias] : void 0;
          if (i > -1) {
            if (aliasMap != null) {
              delete aliasMap[alias];
            }
            listener = listeners[i];
            listeners.splice(i, 1);
          }
        } else if (listener) {
          i = listeners.indexOf(listener);
          if (i > -1) {
            listeners.splice(i, 1);
            aliasMap = listenerRegistry.aliasMap;
            if (aliasMap) {
              for (alias in aliasMap) {
                if (aliasMap[alias] === listener) {
                  delete aliasMap[alias];
                  break;
                }
              }
            }
          }
        }
        if (listenerRegistry.onceListeners && listener) {
          onceListeners = listenerRegistry.onceListeners;
          i = onceListeners.indexOf(listener);
          if (i > -1) {
            onceListeners.splice(i, 1);
            if (!onceListeners.length) {
              delete listenerRegistry.onceListeners;
            }
          }
        }
      } else {
        delete listenerRegistry.listeners;
        delete listenerRegistry.aliasMap;
      }
    };

    Element.prototype.off = function(eventName, listener) {
      var alias, i;
      if (!this._eventRegistry) {
        return this;
      }
      i = eventName.indexOf(":");
      if (i > 0) {
        alias = eventName.substring(i + 1);
        eventName = eventName.substring(0, i);
      }
      this._off(eventName, listener, alias);
      return this;
    };

    Element.prototype.getListeners = function(eventName) {
      var ref, ref1;
      return (ref = this._eventRegistry) != null ? (ref1 = ref[eventName]) != null ? ref1.listeners : void 0 : void 0;
    };

    Element.prototype.fire = function(eventName, self, arg) {
      var argsMode, l, len1, len2, listener, listenerRegistry, listeners, o, onceListeners, result, retValue;
      if (!this._eventRegistry) {
        return true;
      }
      listenerRegistry = this._eventRegistry[eventName];
      if (listenerRegistry) {
        listeners = listenerRegistry.listeners;
        if (listeners) {
          if (arg) {
            arg.model = this._scope;
          } else {
            arg = {
              model: this._scope
            };
          }
          for (l = 0, len1 = listeners.length; l < len1; l++) {
            listener = listeners[l];
            if (typeof listener === "function") {
              argsMode = listener._argsMode;
              if (!listener._argsMode) {
                argsMode = cola.util.parseListener(listener);
              }
              if (argsMode === 1) {
                retValue = listener.call(self, self, arg);
              } else {
                retValue = listener.call(self, arg, self);
              }
            } else if (typeof listener === "string") {
              retValue = (function(_this) {
                return function(self, arg) {
                  return eval(listener);
                };
              })(this)(self, arg);
            }
            if (retValue !== void 0) {
              result = retValue;
            }
            if (retValue === false) {
              break;
            }
          }
          if (listenerRegistry.onceListeners) {
            onceListeners = listenerRegistry.onceListeners.slice();
            delete listenerRegistry.onceListeners;
            for (o = 0, len2 = onceListeners.length; o < len2; o++) {
              listener = onceListeners[o];
              this.off(eventName, listener);
            }
          }
        }
      }
      return result;
    };

    return Element;

  })();

  cola.Definition = (function(superClass) {
    extend(Definition, superClass);

    function Definition(config) {
      var scope;
      if (config != null ? config.name : void 0) {
        this._name = config.name;
        delete config.name;
        scope = (config != null ? config.scope : void 0) || cola.currentScope;
        if (scope) {
          scope.data.regDefinition(this);
        }
      }
      Definition.__super__.constructor.call(this, config);
    }

    return Definition;

  })(cola.Element);


  /*
      Element Group
   */

  cola.Element.createGroup = function(elements, model) {
    var ele, l, len1, scope;
    if (model) {
      elements = [];
      for (l = 0, len1 = elements.length; l < len1; l++) {
        ele = elements[l];
        if (ele._scope && !ele._model) {
          scope = ele._scope;
          while (scope) {
            if (scope instanceof cola.Model) {
              ele._model = scope;
              break;
            }
            scope = scope.parent;
          }
        }
        if (ele._model === model) {
          elements.push(ele);
        }
      }
    } else {
      elements = elements ? elements.slice(0) : [];
    }
    elements.set = function(attr, value) {
      var element, len2, o;
      for (o = 0, len2 = elements.length; o < len2; o++) {
        element = elements[o];
        element.set(attr, value);
      }
      return this;
    };
    elements.on = function(eventName, listener) {
      var element, len2, o;
      for (o = 0, len2 = elements.length; o < len2; o++) {
        element = elements[o];
        element.on(eventName, listener);
      }
      return this;
    };
    elements.off = function(arg1) {
      var element, len2, o, string;
      string = arg1.eventName;
      for (o = 0, len2 = elements.length; o < len2; o++) {
        element = elements[o];
        element.off(eventName);
      }
      return this;
    };
    return elements;
  };


  /*
      Tag Manager
   */

  cola.tagManager = {
    registry: {},
    reg: function(tag, element) {
      var elements;
      elements = this.registry[tag];
      if (elements) {
        elements.push(element);
      } else {
        this.registry[tag] = [element];
      }
    },
    unreg: function(tag, element) {
      var elements, i;
      if (element) {
        elements = this.registry[tag];
        if (elements) {
          i = elements.indexOf(element);
          if (i > -1) {
            if (i === 0 && elements.length === 1) {
              delete this.registry[tag];
            } else {
              elements.splice(i, 1);
            }
          }
        }
      } else {
        delete this.registry[tag];
      }
    },
    find: function(tag) {
      return this.registry[tag];
    }
  };

  cola.tag = function(tag) {
    var elements;
    elements = cola.tagManager.find(tag);
    return cola.Element.createGroup(elements);
  };


  /*
      Type Registry
   */

  typeRegistry = {};

  cola.registerType = function(namespace, typeName, constructor) {
    var holder;
    holder = typeRegistry[namespace] || (typeRegistry[namespace] = {});
    holder[typeName] = constructor;
  };

  cola.registerTypeResolver = function(namespace, typeResolver) {
    var holder;
    holder = typeRegistry[namespace] || (typeRegistry[namespace] = {});
    if (holder._resolvers == null) {
      holder._resolvers = [];
    }
    holder._resolvers.push(typeResolver);
  };

  cola.resolveType = function(namespace, config, baseType) {
    var constructor, holder, l, len1, ref, resolver;
    constructor = null;
    holder = typeRegistry[namespace];
    if (holder) {
      constructor = holder[(config != null ? config.$type : void 0) || "_default"];
      if (!constructor && holder._resolvers) {
        ref = holder._resolvers;
        for (l = 0, len1 = ref.length; l < len1; l++) {
          resolver = ref[l];
          constructor = resolver(config);
          if (constructor) {
            if (baseType && !cola.util.isCompatibleType(baseType, constructor)) {
              throw new cola.Exception("Incompatiable class type.");
            }
            break;
          }
        }
      }
      return constructor;
    }
  };

  cola.create = function(namespace, config, baseType) {
    var constr;
    if (typeof config === "string") {
      config = {
        $type: config
      };
    }
    constr = cola.resolveType(namespace, config, baseType);
    return new constr(config);
  };

  if (XDate) {
    if (typeof $ === "function") {
      $(function() {
        var localeStrings;
        XDate.defaultLocale = cola.setting("locale") || defaultLocale;
        XDate.locales[defaultLocale] = localeStrings = {};
        if (cola.i18n("cola.date.monthNames")) {
          localeStrings.monthNames = cola.i18n("cola.date.monthNames").split(",");
        }
        if (cola.i18n("cola.date.monthNamesShort")) {
          localeStrings.monthNamesShort = cola.i18n("cola.date.monthNamesShort").split(",");
        }
        if (cola.i18n("cola.date.dayNames")) {
          localeStrings.dayNames = cola.i18n("cola.date.dayNames").split(",");
        }
        if (cola.i18n("cola.date.dayNamesShort")) {
          localeStrings.dayNamesShort = cola.i18n("cola.date.dayNamesShort").split(",");
        }
        if (cola.i18n("cola.date.amDesignator")) {
          localeStrings.amDesignator = cola.i18n("cola.date.amDesignator");
        }
        if (cola.i18n("cola.date.pmDesignator")) {
          localeStrings.pmDesignator = cola.i18n("cola.date.pmDesignator");
        }
      });
    }
    XDate.parsers.push(function(str) {
      var c, dateStr, digit, digits, format, hasText, i, inQuota, l, len1, len2, o, part, parts, pattern, patterns, shouldReturn, start;
      if (str.indexOf("||") < 0) {
        return;
      }
      parts = str.split("||");
      format = parts[0];
      dateStr = parts[1];
      parts = {
        y: {
          len: 0,
          value: 1900
        },
        M: {
          len: 0,
          value: 1
        },
        d: {
          len: 0,
          value: 1
        },
        h: {
          len: 0,
          value: 0
        },
        m: {
          len: 0,
          value: 0
        },
        s: {
          len: 0,
          value: 0
        }
      };
      patterns = [];
      hasText = false;
      inQuota = false;
      i = 0;
      while (i < format.length) {
        c = format.charAt(i);
        if (c === "\"") {
          hasText = true;
          if (inQuota === c) {
            inQuota = false;
          } else if (!inQuota) {
            inQuota = c;
          }
        } else if (!inQuota && parts[c]) {
          if (parts[c].len === 0) {
            patterns.push(c);
          }
          parts[c].len++;
        } else {
          hasText = true;
        }
        i++;
      }
      shouldReturn = false;
      if (!hasText) {
        if (dateStr.match(/^\d{2,14}$/)) {
          shouldReturn = true;
          start = 0;
          for (l = 0, len1 = patterns.length; l < len1; l++) {
            pattern = patterns[l];
            part = parts[pattern];
            if (part.len) {
              digit = dateStr.substring(start, start + part.len);
              part.value = parseInt(digit, 10);
              start += part.len;
            }
          }
        }
      } else {
        digits = dateStr.split(/\D+/);
        if (digits[digits.length - 1] === "") {
          digits.splice(digits.length - 1, 1);
        }
        if (digits[0] === "") {
          digits.splice(0, 1);
        }
        if (patterns.length === digits.length) {
          shouldReturn = true;
          for (i = o = 0, len2 = patterns.length; o < len2; i = ++o) {
            pattern = patterns[i];
            parts[pattern].value = parseInt(digits[i], 10);
          }
        }
      }
      if (shouldReturn) {
        return new XDate(parts.y.value, parts.M.value - 1, parts.d.value, parts.h.value, parts.m.value, parts.s.value);
      } else {

      }
    });
  }

  cola.convertor = {};

  cola.convertor["upper"] = function(value) {
    return value != null ? value.toUpperCase() : void 0;
  };

  cola.convertor["lower"] = function(value) {
    return value != null ? value.toLowerCase() : void 0;
  };

  cola.convertor["default"] = function(value, defaultValue) {
    if (defaultValue == null) {
      defaultValue = "";
    }
    if (value != null) {
      return value;
    } else {
      return defaultValue;
    }
  };

  _matchValue = function(value, propFilter) {
    if (propFilter.strict) {
      if (!propFilter.caseSensitive && typeof propFilter.value === "string") {
        return (value + "").toLowerCase() === propFilter.value;
      } else {
        return value === propFilter.value;
      }
    } else {
      if (!propFilter.caseSensitive) {
        return (value + "").toLowerCase().indexOf(propFilter.value) > -1;
      } else {
        return (value + "").indexOf(propFilter.value) > -1;
      }
    }
  };

  cola.convertor["filter"] = function() {
    var caseSensitive, collection, criteria, filtered, params, prop, propFilter;
    collection = arguments[0], criteria = arguments[1], params = 3 <= arguments.length ? slice.call(arguments, 2) : [];
    if (!(collection && criteria)) {
      return collection;
    }
    if (cola.util.isSimpleValue(criteria)) {
      caseSensitive = params[0];
      if (!caseSensitive) {
        criteria = (criteria + "").toLowerCase();
      }
      criteria = {
        "$": {
          value: criteria,
          caseSensitive: caseSensitive,
          strict: params[1]
        }
      };
    }
    if (typeof criteria === "object") {
      for (prop in criteria) {
        propFilter = criteria[prop];
        if (typeof propFilter === "string") {
          criteria[prop] = {
            value: propFilter.toLowerCase()
          };
        } else {
          if (cola.util.isSimpleValue(propFilter)) {
            criteria[prop] = {
              value: propFilter
            };
          }
          if (!propFilter.strict) {
            propFilter.value = propFilter.value ? propFilter.value + "" : "";
          }
          if (!propFilter.caseSensitive && typeof propFilter.value === "string") {
            propFilter.value = propFilter.value.toLowerCase();
          }
        }
      }
      filtered = [];
      cola.each(collection, function(item) {
        var data, matches, p, v;
        matches = false;
        if (cola.util.isSimpleValue(item)) {
          if (criteria.$) {
            matches = _matchValue(v, criteria.$);
          }
        } else {
          for (prop in criteria) {
            propFilter = criteria[prop];
            if (prop === "$") {
              if (item instanceof cola.Entity) {
                data = item._data;
              } else {
                data = item;
              }
              for (p in data) {
                v = data[p];
                if (_matchValue(v, propFilter)) {
                  matches = true;
                  break;
                }
              }
              if (matches) {
                break;
              }
            } else if (item instanceof cola.Entity) {
              if (_matchValue(item.get(prop), propFilter)) {
                matches = true;
                break;
              }
            } else {
              if (_matchValue(item[prop], propFilter)) {
                matches = true;
                break;
              }
            }
          }
        }
        if (matches) {
          filtered.push(item);
        }
      });
      return filtered;
    } else if (typeof criteria === "function") {
      filtered = [];
      cola.each(collection, function(item) {
        if (criteria.apply(null, [item].concat(slice.call(params)))) {
          filtered.push(item);
        }
      });
      return filtered;
    } else {
      return collection;
    }
  };

  _sortConvertor = function(collection, comparator, caseSensitive) {
    var c, comparatorFunc, comparatorProps, l, len1, part, prop, propDesc, ref;
    if (!collection) {
      return null;
    }
    if (collection instanceof cola.EntityList) {
      collection = collection.toArray();
    }
    if (comparator) {
      if (typeof comparator === "string") {
        comparatorProps = [];
        ref = comparator.split(",");
        for (l = 0, len1 = ref.length; l < len1; l++) {
          part = ref[l];
          c = part.charCodeAt(0);
          propDesc = false;
          if (c === 43) {
            prop = part.substring(1);
          } else if (c === 45) {
            prop = part.substring(1);
            propDesc = true;
          } else {
            prop = part;
          }
          comparatorProps.push({
            prop: prop,
            desc: propDesc
          });
        }
        comparator = function(item1, item2) {
          var comparatorProp, len2, o, result, value1, value2;
          for (o = 0, len2 = comparatorProps.length; o < len2; o++) {
            comparatorProp = comparatorProps[o];
            value1 = null;
            value2 = null;
            prop = comparatorProp.prop;
            if (prop) {
              if (prop === "$random") {
                return Math.random() * 2 - 1;
              } else {
                if (item1 instanceof cola.Entity) {
                  value1 = item1.get(prop);
                } else if (cola.util.isSimpleValue(item1)) {
                  value1 = item1;
                } else {
                  value1 = item1[prop];
                }
                if (!caseSensitive && typeof value1 === "string") {
                  value1 = value1.toLowerCase();
                }
                if (item2 instanceof cola.Entity) {
                  value2 = item2.get(prop);
                } else if (cola.util.isSimpleValue(item2)) {
                  value2 = item2;
                } else {
                  value2 = item2[prop];
                }
                if (!caseSensitive && typeof value2 === "string") {
                  value2 = value2.toLowerCase();
                }
                result = 0;
                if (value1 == null) {
                  result = -1;
                } else if (value2 == null) {
                  result = 1;
                } else if (value1 > value2) {
                  result = 1;
                } else if (value1 < value2) {
                  result = -1;
                }
                if (result !== 0) {
                  if (comparatorProp.desc) {
                    return 0 - result;
                  } else {
                    return result;
                  }
                }
              }
            } else {
              result = 0;
              if (item1 == null) {
                result = -1;
              } else if (item2 == null) {
                result = 1;
              } else if (item1 > item2) {
                result = 1;
              } else if (item1 < item2) {
                result = -1;
              }
              if (result !== 0) {
                if (comparatorProp.desc) {
                  return 0 - result;
                } else {
                  return result;
                }
              }
            }
          }
          return 0;
        };
      }
    } else if (comparator === "$none") {
      return collection;
    } else {
      comparator = function(item1, item2) {
        var result;
        result = 0;
        if (!caseSensitive) {
          if (typeof item1 === "string") {
            item1 = item1.toLowerCase();
          }
          if (typeof item2 === "string") {
            item2 = item2.toLowerCase();
          }
        }
        if (item1 == null) {
          result = -1;
        } else if (item2 == null) {
          result = 1;
        } else if (item1 > item2) {
          result = 1;
        } else if (item1 < item2) {
          result = -1;
        }
        return result;
      };
    }
    comparatorFunc = function(item1, item2) {
      return comparator(item1, item2);
    };
    return collection.sort(comparatorFunc);
  };

  cola.convertor["orderBy"] = _sortConvertor;

  cola.convertor["sort"] = _sortConvertor;

  cola.convertor["top"] = function(collection, top) {
    var i, items;
    if (top == null) {
      top = 1;
    }
    if (!collection) {
      return null;
    }
    items = [];
    i = 0;
    cola.each(collection, function(item) {
      i++;
      items.push(item);
      return i < top;
    });
    return items;
  };

  cola.convertor["date"] = function(date, format) {
    if (date == null) {
      return "";
    }
    if (!(date instanceof XDate)) {
      date = new XDate(date);
    }
    return date.toString(format);
  };

  cola.convertor["number"] = function(number, format) {
    if (number == null) {
      return "";
    }
    return formatNumber(format, number);
  };

  cola._compileText = function(text) {
    var expr, exprStr, p, parts, s;
    p = 0;
    s = 0;
    while ((s = text.indexOf("{{", p)) > -1) {
      exprStr = digestExpression(text, s + 2);
      if (exprStr) {
        if (s > p) {
          if (!parts) {
            parts = [];
          }
          parts.push(text.substring(p, s));
        }
        expr = cola._compileExpression(exprStr, exprStr.indexOf(" in ") > 0 ? "repeat" : void 0);
        if (!parts) {
          parts = [expr];
        } else {
          parts.push(expr);
        }
        p = s + exprStr.length + 4;
      } else {
        break;
      }
    }
    if (parts) {
      if (p < text.length - 1) {
        parts.push(text.substring(p));
      }
      return parts;
    } else {
      return null;
    }
  };

  digestExpression = function(text, p) {
    var c, endBracket, len, quota, s;
    s = p;
    len = text.length;
    endBracket = 0;
    while (p < len) {
      c = text.charCodeAt(p);
      if (c === 125 && !quota) {
        if (endBracket === 1) {
          return text.substring(s, p - 1);
        }
        endBracket++;
      } else {
        endBracket = 0;
        if (c === 39 || c === 34) {
          if (quota) {
            if (quota === c) {
              quota = false;
            }
          } else {
            quota = c;
          }
        }
      }
      p++;
    }
  };

  cola._compileExpression = function(exprStr, specialType) {
    var aliasName, exp, i, isStatic, j, l, last, len1, len2, o, oldParts, part, parts, path, pathStr, paths, ref;
    if (!exprStr) {
      return null;
    }
    if (exprStr.charCodeAt(0) === 61) {
      exprStr = exprStr.substring(1);
      isStatic = true;
    }
    i = exprStr.indexOf(" on ");
    if (i > 0) {
      pathStr = exprStr.substring(i + 4);
      exprStr = exprStr.substring(0, i);
      paths = [];
      ref = pathStr.split(",");
      for (l = 0, len1 = ref.length; l < len1; l++) {
        path = ref[l];
        path = cola.util.trim(path);
        if (!path) {
          continue;
        }
        if (path.indexOf(".") > 0) {
          parts = [];
          oldParts = path.split(".");
          last = oldParts.length - 1;
          for (j = o = 0, len2 = oldParts.length; o < len2; j = ++o) {
            part = oldParts[j];
            if (j < last && part.charCodeAt(0) !== 33) {
              part = "!" + part;
            }
            parts.push(part);
          }
          path = parts.join(".");
        }
        paths.push(path);
      }
    }
    if (specialType === "repeat") {
      i = exprStr.indexOf(" in ");
      if (i > 0) {
        aliasName = exprStr.substring(0, i);
        if (aliasName.match(cola.constants.VARIABLE_NAME_REGEXP)) {
          exprStr = exprStr.substring(i + 4);
          if (!exprStr) {
            return null;
          }
          exp = new cola.Expression(exprStr, true);
          exp.raw = aliasName + " in " + exp.raw;
          exp.repeat = true;
          exp.alias = aliasName;
        }
        if (!exp) {
          throw new cola.Exception("\"" + exprStr + "\" is not a valid expression.");
        }
      } else {
        exp = new cola.Expression(exprStr, true);
        exp.repeat = true;
        exp.alias = "item";
      }
    } else if (specialType === "alias") {
      i = exprStr.indexOf(" as ");
      if (i > 0) {
        aliasName = exprStr.substring(i + 4);
        if (aliasName && aliasName.match(cola.constants.VARIABLE_NAME_REGEXP)) {
          exprStr = exprStr.substring(0, i);
          if (!exprStr) {
            return null;
          }
          exp = new cola.Expression(exprStr, true);
          exp.raw = exp.raw + " as " + aliasName;
          exp.setAlias = true;
          exp.alias = aliasName;
        }
      }
      if (!exp) {
        throw new cola.Exception("\"" + exprStr + "\" should be a alias expression.");
      }
    } else {
      exp = new cola.Expression(exprStr, true);
    }
    if (isStatic) {
      exp.isStatic = true;
    }
    if (paths) {
      exp.path = paths;
    }
    return exp;
  };

  splitExpression = function(text, separator) {
    var c, i, len, p, part, parts, quota, separatorCharCode;
    separatorCharCode = separator.charCodeAt(0);
    parts = null;
    p = 0;
    i = 0;
    len = text.length;
    while (i < len) {
      c = text.charCodeAt(i);
      if (c === separatorCharCode && !quota) {
        part = text.substring(p, i);
        if (parts == null) {
          parts = [];
        }
        parts.push(cola.util.trim(part));
        p = i + 1;
      } else {
        if (c === 39 || c === 34) {
          if (quota) {
            if (quota === c) {
              quota = false;
            }
          } else {
            quota = c;
          }
        }
      }
      i++;
    }
    if (p < len) {
      part = text.substring(p);
      if (parts == null) {
        parts = [];
      }
      parts.push(cola.util.trim(part));
    }
    return parts;
  };

  compileConvertor = function(text) {
    var bindStr, convertor, expr, i, l, len1, len2, o, params, part, parts, path, ref;
    parts = splitExpression(text, ":");
    if (parts == null) {
      parts = [text];
    }
    convertor = {
      name: parts[0],
      params: []
    };
    params = convertor.params;
    if (convertor.name === "watch") {
      bindStr = parts[1];
      if (!bindStr) {
        return null;
      }
      ref = bindStr.split(",");
      for (l = 0, len1 = ref.length; l < len1; l++) {
        path = ref[l];
        params.push(cola.util.trim(path));
      }
    } else {
      if (parts.length > 1) {
        for (i = o = 0, len2 = parts.length; o < len2; i = ++o) {
          part = parts[i];
          if (i === 0) {
            continue;
          }
          expr = new cola.Expression(part);
          params.push(expr);
        }
      }
    }
    return convertor;
  };

  cola.Expression = (function() {
    function Expression(exprStr, supportConvertor) {
      var convertor, i, l, len1, len2, len3, mainExprCompiled, o, param, part, parts, q, ref, ref1, subPath;
      this.raw = exprStr;
      if (supportConvertor) {
        i = exprStr.indexOf("|");
        if ((0 < i && i < (exprStr.length - 1))) {
          parts = splitExpression(exprStr, "|");
          if ((parts != null ? parts.length : void 0) > 1) {
            this.convertors = [];
            for (i = l = 0, len1 = parts.length; l < len1; i = ++l) {
              part = parts[i];
              if (i === 0) {
                this.compile(part);
                mainExprCompiled = true;
              } else {
                convertor = compileConvertor(part);
                if (convertor) {
                  if (convertor.name === "watch") {
                    this.watch = convertor.params[0];
                  } else {
                    this.convertors.push(convertor);
                  }
                }
              }
            }
          }
        }
      }
      if (!mainExprCompiled) {
        this.compile(exprStr);
      }
      if (this.watch) {
        this.path = this.watch;
      } else if (supportConvertor && this.convertors) {
        subPath = null;
        ref = this.convertors;
        for (o = 0, len2 = ref.length; o < len2; o++) {
          convertor = ref[o];
          ref1 = convertor.params;
          for (q = 0, len3 = ref1.length; q < len3; q++) {
            param = ref1[q];
            if (param instanceof cola.Expression && param.path) {
              if (subPath == null) {
                subPath = [];
              }
              subPath = subPath.concat(param.path);
            }
          }
        }
        if (subPath) {
          if (!this.path) {
            this.path = subPath;
          } else if (typeof this.path === "string") {
            this.path = [this.path].concat(subPath);
          } else {
            this.path = this.path.concat(subPath);
          }
        }
      }
    }

    Expression.prototype.compile = function(exprStr) {
      var parts, stringify, stringifyMemberExpression, tree;
      stringifyMemberExpression = function(node, parts, context) {
        var type;
        type = node.type;
        if (type === "Identifier") {
          parts.push(node.name);
        } else {
          stringifyMemberExpression(node.object, parts, context);
          parts.push(node.property.name);
        }
      };
      stringify = function(node, parts, context) {
        var argument, element, i, l, len1, len2, o, path, pathPart, ref, ref1, ref2, type;
        type = node.type;
        switch (type) {
          case "MemberExpression":
          case "Identifier":
            pathPart = [];
            stringifyMemberExpression(node, pathPart, context);
            path = pathPart.join(".");
            if (!context.path) {
              context.path = path;
            } else if (typeof context.path === "string") {
              context.path = [context.path, path];
            } else {
              context.path.push(path);
            }
            parts.push("_getData(scope,'");
            parts.push(path);
            parts.push("',loadMode,dataCtx)");
            break;
          case "CallExpression":
            context.hasCallStatement = true;
            parts.push("scope.action(\"");
            stringifyMemberExpression(node.callee, parts, context);
            parts.push("\")(");
            if ((ref = node["arguments"]) != null ? ref.length : void 0) {
              ref1 = node["arguments"];
              for (i = l = 0, len1 = ref1.length; l < len1; i = ++l) {
                argument = ref1[i];
                if (i > 0) {
                  parts.push(",");
                }
                stringify(argument, parts, context);
              }
            }
            parts.push(")");
            break;
          case "Literal":
            parts.push(node.raw);
            break;
          case "BinaryExpression":
          case "LogicalExpression":
            parts.push("(");
            stringify(node.left, parts, context);
            parts.push(node.operator);
            stringify(node.right, parts, context);
            parts.push(")");
            break;
          case "ThisExpression":
            parts.push("scope");
            break;
          case "UnaryExpression":
            parts.push(node.operator);
            stringify(node.argument, parts, context);
            break;
          case "ConditionalExpression":
            parts.push("(");
            stringify(node.test, parts, context);
            parts.push("?");
            stringify(node.consequent, parts, context);
            parts.push(":");
            stringify(node.alternate, parts, context);
            parts.push(")");
            break;
          case "ArrayExpression":
            parts.push("[");
            ref2 = node.elements;
            for (i = o = 0, len2 = ref2.length; o < len2; i = ++o) {
              element = ref2[i];
              if (i > 0) {
                parts.push(",");
              }
              stringify(element, parts, context);
            }
            parts.push("]");
        }
      };
      tree = jsep(exprStr);
      this.type = tree.type;
      parts = [];
      stringify(tree, parts, this);
      return this.expression = parts.join("");
    };

    Expression.prototype.evaluate = function(scope, loadMode, dataCtx) {
      var args, convertor, convertorDef, l, len1, len2, o, paramExpr, paramValue, ref, ref1, retValue;
      retValue = eval(this.expression);
      if (retValue instanceof cola.Entity || retValue instanceof cola.EntityList) {
        if (dataCtx != null) {
          dataCtx.path = retValue.getPath();
        }
      }
      if (this.convertors) {
        if (dataCtx != null) {
          dataCtx.originData = retValue;
        }
        ref = this.convertors;
        for (l = 0, len1 = ref.length; l < len1; l++) {
          convertorDef = ref[l];
          convertor = cola.convertor[convertorDef.name];
          if (convertor) {
            args = [retValue];
            ref1 = convertorDef.params;
            for (o = 0, len2 = ref1.length; o < len2; o++) {
              paramExpr = ref1[o];
              paramValue = paramExpr.evaluate(scope, "never");
              args.push(paramValue);
            }
            retValue = convertor.apply(null, args);
          } else {
            throw new cola.Exception("Unknown convert \"" + convertorDef.name + "\".");
          }
        }
      }
      return retValue;
    };

    Expression.prototype.toString = function() {
      return this.expression;
    };

    return Expression;

  })();

  _getData = function(scope, path, loadMode, dataCtx) {
    var retValue;
    retValue = scope.get(path, loadMode, dataCtx);
    if (retValue === void 0 && (dataCtx != null ? dataCtx.vars : void 0)) {
      retValue = dataCtx.vars[path];
    }
    return retValue;
  };

  cola.AjaxServiceInvoker = (function() {
    function AjaxServiceInvoker(ajaxService1, invokerOptions1) {
      this.ajaxService = ajaxService1;
      this.invokerOptions = invokerOptions1;
      this.callbacks = [];
    }

    AjaxServiceInvoker.prototype.invokeCallback = function(success, result) {
      var callback, callbacks, l, len1;
      this.invoking = false;
      callbacks = this.callbacks;
      this.callbacks = [];
      for (l = 0, len1 = callbacks.length; l < len1; l++) {
        callback = callbacks[l];
        cola.callback(callback, success, result);
      }
    };

    AjaxServiceInvoker.prototype._internalInvoke = function(async) {
      var ajaxService, invokerOptions, options, p, retValue, v;
      if (async == null) {
        async = true;
      }
      ajaxService = this.ajaxService;
      invokerOptions = this.invokerOptions;
      retValue = void 0;
      options = {};
      for (p in invokerOptions) {
        v = invokerOptions[p];
        options[p] = v;
      }
      options.async = async;
      if (options.sendJson) {
        options.data = JSON.stringify(options.data);
      }
      if (ajaxService.getListeners("beforeSend")) {
        if (ajaxService.fire("beforeSend", ajaxService, {
          options: options
        }) === false) {
          return;
        }
      }
      jQuery.ajax(options).done((function(_this) {
        return function(result) {
          _this.invokeCallback(true, result);
          if (ajaxService.getListeners("success")) {
            ajaxService.fire("success", ajaxService, {
              options: options,
              result: result
            });
          }
          if (ajaxService.getListeners("complete")) {
            ajaxService.fire("complete", ajaxService, {
              success: true,
              options: options,
              result: result
            });
          }
          retValue = result;
        };
      })(this)).fail((function(_this) {
        return function(xhr) {
          var error;
          error = xhr.responseJSON;
          _this.invokeCallback(false, error);
          ajaxService.fire("error", ajaxService, {
            options: options,
            xhr: xhr,
            error: error
          });
          ajaxService.fire("complete", ajaxService, {
            success: false,
            options: options,
            xhr: xhr,
            error: error
          });
        };
      })(this));
      return retValue;
    };

    AjaxServiceInvoker.prototype.invokeAsync = function(callback) {
      this.callbacks.push(callback);
      if (this.invoking) {
        return false;
      }
      this.invoking = true;
      this._internalInvoke();
      return true;
    };

    AjaxServiceInvoker.prototype.invokeSync = function(callback) {
      if (this.invoking) {
        throw new cola.Exception("Cannot perform synchronized request during an asynchronized request executing. [" + this.url + "]");
      }
      this.callbacks.push(callback);
      return this._internalInvoke(false);
    };

    return AjaxServiceInvoker;

  })();

  cola.AjaxService = (function(superClass) {
    extend(AjaxService, superClass);

    AjaxService.ATTRIBUTES = {
      url: null,
      sendJson: null,
      method: null,
      parameter: null,
      ajaxOptions: null
    };

    AjaxService.EVENTS = {
      beforeSend: null,
      complete: null,
      success: null,
      error: null
    };

    function AjaxService(config) {
      if (typeof config === "string") {
        config = {
          url: config
        };
      }
      AjaxService.__super__.constructor.call(this, config);
    }

    AjaxService.prototype.getUrl = function() {
      return this._url;
    };

    AjaxService.prototype.getInvokerOptions = function(context) {
      var ajaxOptions, options, p, v;
      options = {};
      ajaxOptions = this._ajaxOptions;
      if (ajaxOptions) {
        for (p in ajaxOptions) {
          v = ajaxOptions[p];
          options[p] = v;
        }
      }
      options.url = this.getUrl(context);
      options.data = this._parameter;
      options.sendJson = this._sendJson;
      if (options.sendJson && !options.method) {
        options.method = "post";
      }
      return options;
    };

    AjaxService.prototype.getInvoker = function(context) {
      return new cola.AjaxServiceInvoker(this, this.getInvokerOptions(context));
    };

    return AjaxService;

  })(cola.Definition);

  cola.Provider = (function(superClass) {
    extend(Provider, superClass);

    function Provider() {
      return Provider.__super__.constructor.apply(this, arguments);
    }

    Provider.ATTRIBUTES = {
      pageSize: null
    };

    Provider.prototype._evalParamValue = function(expr, context) {
      if (expr.charCodeAt(0) === 58) {
        if (context) {
          return cola.Entity._evalDataPath(context, expr.substring(1), true, "never");
        } else {
          return null;
        }
      } else {
        return expr;
      }
    };

    Provider.prototype.getUrl = function(context) {
      var l, len1, part, parts, ref, url;
      url = this._url;
      if (url.indexOf(":") > -1) {
        parts = [];
        ref = url.split("/");
        for (l = 0, len1 = ref.length; l < len1; l++) {
          part = ref[l];
          parts.push(this._evalParamValue(part, context));
        }
        url = parts.join("/");
      }
      return url;
    };

    Provider.prototype.getInvokerOptions = function(context) {
      var data, oldParameter, options, p, parameter, v;
      options = Provider.__super__.getInvokerOptions.call(this, context);
      parameter = options.data;
      if (parameter != null) {
        if (typeof parameter === "string") {
          parameter = this._evalParamValue(parameter, context);
        } else if (typeof parameter === "object") {
          oldParameter = parameter;
          parameter = {};
          for (p in oldParameter) {
            v = oldParameter[p];
            if (typeof v === "string") {
              v = this._evalParamValue(v, context);
            }
            parameter[p] = v;
          }
        }
      }
      data = {};
      if (this._pageSize > 1) {
        data.from = 0;
        data.limit = this._pageSize;
      }
      if (parameter != null) {
        data.parameter = parameter;
      }
      options.data = data;
      return options;
    };

    return Provider;

  })(cola.AjaxService);

  cola.Resolver = (function(superClass) {
    extend(Resolver, superClass);

    function Resolver() {
      return Resolver.__super__.constructor.apply(this, arguments);
    }

    Resolver.ATTRIBUTES = {
      sendJson: {
        defaultValue: true
      }
    };

    return Resolver;

  })(cola.AjaxService);

  cola.registerTypeResolver("validator", function(config) {
    if (!(config && config.$type)) {
      return;
    }
    return cola[cola.util.capitalize(config.$type) + "Validator"];
  });

  cola.registerTypeResolver("validator", function(config) {
    if (typeof config === "function") {
      return cola.CustomValidator;
    }
  });

  cola.Validator = (function(superClass) {
    extend(Validator, superClass);

    function Validator() {
      return Validator.__super__.constructor.apply(this, arguments);
    }

    Validator.ATTRIBUTES = {
      message: null,
      messageType: {
        defaultValue: "error",
        "enum": ["error", "warning", "info"]
      },
      disabled: null,
      validateEmptyValue: null
    };

    Validator.prototype._getDefaultMessage = function(data) {
      return "\"" + data + "\" is not a valid value.";
    };

    Validator.prototype._parseValidResult = function(result, data) {
      var text;
      if (typeof result === "boolean") {
        if (result) {
          result = null;
        } else {
          text = this._message;
          if (text == null) {
            text = this._getDefaultMessage(data);
          }
          result = {
            type: this._messageType,
            text: text
          };
        }
      } else if (result && typeof result === "string") {
        result = {
          type: this._messageType,
          text: result
        };
      }
      return result;
    };

    Validator.prototype.validate = function(data) {
      var result;
      if (!this._validateEmptyValue) {
        if (!((data != null) && data !== "")) {
          return;
        }
      }
      result = this._validate(data);
      return this._parseValidResult(result, data);
    };

    return Validator;

  })(cola.Definition);

  cola.RequiredValidator = (function(superClass) {
    extend(RequiredValidator, superClass);

    function RequiredValidator() {
      return RequiredValidator.__super__.constructor.apply(this, arguments);
    }

    RequiredValidator.ATTRIBUTES = {
      validateEmptyValue: {
        defaultValue: true
      },
      trim: {
        defaultValue: true
      }
    };

    RequiredValidator.prototype._getDefaultMessage = function(data) {
      return cola.i18n("cola.validator.error.required", data);
    };

    RequiredValidator.prototype._validate = function(data) {
      if (!(typeof data === "string")) {
        return data != null;
      }
      if (this._trim) {
        data = cola.util.trim(data);
      }
      return !!data;
    };

    return RequiredValidator;

  })(cola.Validator);

  cola.NumberValidator = (function(superClass) {
    extend(NumberValidator, superClass);

    function NumberValidator() {
      return NumberValidator.__super__.constructor.apply(this, arguments);
    }

    NumberValidator.ATTRIBUTES = {
      min: null,
      minInclude: {
        defaultValue: true
      },
      max: null,
      maxInclude: {
        defaultValue: true
      }
    };

    NumberValidator.prototype._getDefaultMessage = function(data) {
      return cola.i18n("cola.validator.error.number", data);
    };

    NumberValidator.prototype._validate = function(data) {
      var result;
      result = true;
      if (this._min != null) {
        result = this._minInclude ? data >= this._min : data > this._min;
      }
      if (result && (this._max != null)) {
        result = this._maxInclude ? data <= this._max : data < this._max;
      }
      return result;
    };

    return NumberValidator;

  })(cola.Validator);

  cola.LengthValidator = (function(superClass) {
    extend(LengthValidator, superClass);

    function LengthValidator() {
      return LengthValidator.__super__.constructor.apply(this, arguments);
    }

    LengthValidator.ATTRIBUTES = {
      min: null,
      max: null
    };

    LengthValidator.prototype._getDefaultMessage = function(data) {
      return cola.i18n("cola.validator.error.length", data);
    };

    LengthValidator.prototype._validate = function(data) {
      var len, result;
      if (typeof data === "string" || typeof data === "number") {
        result = true;
        len = (data + "").length;
        if (this._min != null) {
          result = len >= this._min;
        }
        if (result && (this._max != null)) {
          result = len <= this._max;
        }
        return result;
      }
      return true;
    };

    return LengthValidator;

  })(cola.Validator);

  cola.RegExpValidator = (function(superClass) {
    extend(RegExpValidator, superClass);

    function RegExpValidator() {
      return RegExpValidator.__super__.constructor.apply(this, arguments);
    }

    RegExpValidator.ATTRIBUTES = {
      regExp: null,
      mode: {
        defaultValue: "white",
        "enum": ["white", "black"]
      }
    };

    RegExpValidator.prototype._getDefaultMessage = function(data) {
      return cola.i18n("cola.validator.error.regExp", data);
    };

    RegExpValidator.prototype._validate = function(data) {
      var regExp, result;
      regExp = this._regExp;
      if (regExp && typeof data === "string") {
        if (!regExp instanceof RegExp) {
          regExp = new RegExp(regExp);
        }
        result = true;
        result = !!data.match(regExp);
        if (this._mode === "black") {
          result = !result;
        }
        return result;
      }
      return true;
    };

    return RegExpValidator;

  })(cola.Validator);

  cola.EmailValidator = (function(superClass) {
    extend(EmailValidator, superClass);

    function EmailValidator() {
      return EmailValidator.__super__.constructor.apply(this, arguments);
    }

    EmailValidator.prototype._getDefaultMessage = function(data) {
      return cola.i18n("cola.validator.error.email", data);
    };

    EmailValidator.prototype._validate = function(data) {
      if (typeof data === "string") {
        return !!data.match(/^[a-z]([a-z0-9]*[-_\.]?[a-z0-9]+)*@([a-z0-9]*[-_]?[a-z0-9]+)+[\.][a-z]{2,3}([\.][a-z]{2})?$/i);
      }
      return true;
    };

    return EmailValidator;

  })(cola.Validator);

  cola.UrlValidator = (function(superClass) {
    extend(UrlValidator, superClass);

    function UrlValidator() {
      return UrlValidator.__super__.constructor.apply(this, arguments);
    }

    UrlValidator.prototype._getDefaultMessage = function(data) {
      return cola.i18n("cola.validator.error.email", data);
    };

    UrlValidator.prototype._validate = function(data) {
      if (typeof data === "string") {
        return !!data.match(/^(https?:\/\/(?:www\.|(?!www))[^\s\.]+\.[^\s]{2,}|www\.[^\s]+\.[^\s]{2,})/i);
      }
      return true;
    };

    return UrlValidator;

  })(cola.Validator);

  cola.AsyncValidator = (function(superClass) {
    extend(AsyncValidator, superClass);

    function AsyncValidator() {
      return AsyncValidator.__super__.constructor.apply(this, arguments);
    }

    AsyncValidator.ATTRIBUTES = {
      async: {
        defaultValue: true
      }
    };

    AsyncValidator.prototype.validate = function(data, callback) {
      var result;
      if (!this._validateEmptyValue) {
        if (!((data != null) && data !== "")) {
          return;
        }
      }
      if (this._async) {
        result = this._validate(data, {
          complete: (function(_this) {
            return function(success, result) {
              if (success) {
                result = _this._parseValidResult(result);
              }
              cola.callback(callback, success, result);
            };
          })(this)
        });
      } else {
        result = this._validate(data);
        result = this._parseValidResult(result);
        cola.callback(callback, true, result);
      }
      return result;
    };

    return AsyncValidator;

  })(cola.Validator);

  cola.AjaxValidator = (function(superClass) {
    extend(AjaxValidator, superClass);

    function AjaxValidator() {
      return AjaxValidator.__super__.constructor.apply(this, arguments);
    }

    AjaxValidator.ATTRIBUTES = {
      url: null,
      sendJson: null,
      method: null,
      ajaxOptions: null,
      data: null
    };

    AjaxValidator.prototype._validate = function(data, callback) {
      var ajaxOptions, invoker, options, p, realSendData, sendData, v;
      sendData = this._data;
      if ((sendData == null) || sendData === ":data") {
        sendData = data;
      } else if (typeof sendData === "object") {
        realSendData = {};
        for (p in sendData) {
          v = sendData[p];
          if (v === ":data") {
            v = data;
          }
          realSendData[p] = v;
        }
        sendData = realSendData;
      }
      options = {};
      ajaxOptions = this._ajaxOptions;
      if (ajaxOptions) {
        for (p in ajaxOptions) {
          v = ajaxOptions[p];
          options[p] = v;
        }
      }
      options.async = !!callback;
      options.url = this._url;
      options.data = sendData;
      options.sendJson = this._sendJson;
      options.method = this._method;
      if (options.sendJson && !options.method) {
        options.method = "post";
      }
      invoker = new cola.AjaxServiceInvoker(this, options);
      if (callback) {
        return invoker.invokeAsync(callback);
      } else {
        return invoker.invokeSync();
      }
    };

    return AjaxValidator;

  })(cola.AsyncValidator);

  cola.CustomValidator = (function(superClass) {
    extend(CustomValidator, superClass);

    CustomValidator.ATTRIBUTES = {
      validateEmptyValue: {
        defaultValue: true
      },
      func: null
    };

    function CustomValidator(config) {
      if (typeof config === "function") {
        CustomValidator.__super__.constructor.call(this);
        this.set({
          func: config,
          async: cola.util.parseFunctionArgs(config).length > 1
        });
      } else {
        CustomValidator.__super__.constructor.call(this, config);
      }
    }

    CustomValidator.prototype._validate = function(data, callback) {
      if (callback) {
        if (this._func) {
          this._func(data, callback);
        } else {
          cola.callback(callback, true);
        }
      } else {
        return typeof this._func === "function" ? this._func(data) : void 0;
      }
    };

    return CustomValidator;

  })(cola.AsyncValidator);

  cola.DataType = (function(superClass) {
    extend(DataType, superClass);

    function DataType() {
      return DataType.__super__.constructor.apply(this, arguments);
    }

    DataType.ATTRIBUTES = {
      name: {
        readOnlyAfterCreate: true
      }
    };

    return DataType;

  })(cola.Definition);

  cola.BaseDataType = (function(superClass) {
    extend(BaseDataType, superClass);

    function BaseDataType() {
      return BaseDataType.__super__.constructor.apply(this, arguments);
    }

    return BaseDataType;

  })(cola.DataType);

  cola.StringDataType = (function(superClass) {
    extend(StringDataType, superClass);

    function StringDataType() {
      return StringDataType.__super__.constructor.apply(this, arguments);
    }

    StringDataType.prototype.toText = function(value) {
      if (value != null) {
        return value + "";
      } else {
        return "";
      }
    };

    StringDataType.prototype.parse = function(text) {
      return text;
    };

    return StringDataType;

  })(cola.BaseDataType);

  cola.NumberDataType = (function(superClass) {
    extend(NumberDataType, superClass);

    function NumberDataType() {
      return NumberDataType.__super__.constructor.apply(this, arguments);
    }

    NumberDataType.ATTRIBUTES = {
      isInteger: null
    };

    NumberDataType.prototype.parse = function(text) {
      var n;
      if (!text) {
        return 0;
      }
      if (typeof text === "number") {
        if (this._isInteger) {
          return Math.round(text);
        } else {
          return text;
        }
      }
      if (this._isInteger) {
        n = Math.round(parseInt(text, 10));
      } else {
        n = parseFloat(text, 10);
      }
      if (isNaN(n)) {
        return 0;
      } else {
        return n;
      }
    };

    return NumberDataType;

  })(cola.BaseDataType);

  cola.BooleanDataType = (function(superClass) {
    extend(BooleanDataType, superClass);

    function BooleanDataType() {
      return BooleanDataType.__super__.constructor.apply(this, arguments);
    }

    BooleanDataType.prototype.parse = function(text) {
      if (!text) {
        return false;
      }
      if (typeof text === "boolean") {
        return text;
      }
      if (["true", "on", "yes", "y", "1"].indexOf((text + "").toLowerCase()) > -1) {
        return true;
      }
      return false;
    };

    return BooleanDataType;

  })(cola.BaseDataType);

  cola.DateDataType = (function(superClass) {
    extend(DateDataType, superClass);

    function DateDataType() {
      return DateDataType.__super__.constructor.apply(this, arguments);
    }

    DateDataType.prototype.parse = function(text) {
      var xDate;
      if (!text) {
        return new Date(NaN);
      }
      xDate = new XDate(text);
      return xDate.toDate();
    };

    return DateDataType;

  })(cola.BaseDataType);

  cola.JSONDataType = (function(superClass) {
    extend(JSONDataType, superClass);

    function JSONDataType() {
      return JSONDataType.__super__.constructor.apply(this, arguments);
    }

    JSONDataType.prototype.toText = function(value) {
      return JSON.stringify(value);
    };

    JSONDataType.prototype.parse = function(text) {
      return JSON.parse(text);
    };

    return JSONDataType;

  })(cola.DataType);


  /*
  EntityDataType
   */

  cola.EntityDataType = (function(superClass) {
    extend(EntityDataType, superClass);

    EntityDataType.ATTRIBUTES = {
      readOnly: null,
      properties: {
        setter: function(properties) {
          var config, l, len1, property, results, results1;
          this._properties.clear();
          if (properties instanceof Array) {
            results = [];
            for (l = 0, len1 = properties.length; l < len1; l++) {
              property = properties[l];
              results.push(this.addProperty(property));
            }
            return results;
          } else {
            results1 = [];
            for (property in properties) {
              config = properties[property];
              if (config) {
                if (!(config instanceof cola.Property)) {
                  config.property = property;
                }
                results1.push(this.addProperty(config));
              } else {
                results1.push(void 0);
              }
            }
            return results1;
          }
        }
      }
    };

    EntityDataType.EVENTS = {
      beforeCurrentChange: null,
      currentChange: null,
      beforeDataChange: null,
      dataChange: null,
      beforeEntityInsert: null,
      entityInsert: null,
      beforeEntityDelete: null,
      entityDelete: null
    };

    function EntityDataType(config) {
      this._properties = new cola.util.KeyedArray();
      EntityDataType.__super__.constructor.call(this, config);
    }

    EntityDataType.prototype.addProperty = function(property) {
      if (!(property instanceof cola.Property)) {
        if (typeof property === "string") {
          property = new cola.BaseProperty({
            property: property
          });
        } else if (typeof property.compute === "function") {
          property = new cola.ComputeProperty(property);
        } else {
          property = new cola.BaseProperty(property);
        }
      } else if (property._owner && property._owner !== this) {
        throw new cola.Exception("Property(" + property._property + ") is already belongs to anthor DataType.");
      }
      if (this._properties.get(property._property)) {
        this.removeProperty(property._property);
      }
      this._properties.add(property._property, property);
      property._owner = this;
      return property;
    };

    EntityDataType.prototype.removeProperty = function(property) {
      if (property instanceof cola.Property) {
        this._properties.remove(property._property);
      } else {
        property = this._properties.remove(property);
      }
      delete property._owner;
      return property;
    };

    EntityDataType.prototype.getProperty = function(path) {
      var i, part1, part2, prop;
      i = path.indexOf(".");
      if (i > 0) {
        part1 = path.substring(0, i);
        part2 = path.substring(i + 1);
        prop = this._getProperty(part1);
        if (prop != null ? prop._dataType : void 0) {
          return prop != null ? prop._dataType.getProperty(part2) : void 0;
        }
      } else {
        return this._getProperty(path);
      }
    };

    EntityDataType.prototype._getProperty = function(property) {
      return this._properties.get(property);
    };

    EntityDataType.prototype.getProperties = function() {
      return this._properties;
    };

    return EntityDataType;

  })(cola.DataType);

  cola.DataType.dataTypeSetter = function(dataType) {
    var name, scope;
    if (typeof dataType === "string") {
      name = dataType;
      scope = this._scope;
      if (scope) {
        dataType = scope.dataType(name);
      } else {
        dataType = cola.DataType.defaultDataTypes[name];
      }
      if (!dataType) {
        throw new cola.Exception("Unrecognized DataType \"" + name + "\".");
      }
    } else if ((dataType != null) && !(dataType instanceof cola.DataType)) {
      dataType = new cola.EntityDataType(dataType);
    }
    this._dataType = dataType || null;
  };

  cola.Property = (function(superClass) {
    extend(Property, superClass);

    Property.ATTRIBUTES = {
      property: {
        readOnlyAfterCreate: true
      },
      name: {
        readOnlyAfterCreate: true,
        setter: function(name) {
          this._name = name;
          if (this._property == null) {
            this._property = name;
          }
        }
      },
      owner: {
        readOnly: true
      },
      caption: null,
      dataType: {
        setter: cola.DataType.dataTypeSetter
      },
      description: null
    };

    function Property(config) {
      Property.__super__.constructor.call(this, config);
    }

    return Property;

  })(cola.Definition);

  cola.BaseProperty = (function(superClass) {
    extend(BaseProperty, superClass);

    function BaseProperty() {
      return BaseProperty.__super__.constructor.apply(this, arguments);
    }

    BaseProperty.ATTRIBUTES = {
      provider: {
        setter: function(provider) {
          if ((provider != null) && !(provider instanceof cola.Provider)) {
            provider = new cola.Provider(provider);
          }
          this._provider = provider;
        }
      },
      defaultValue: null,
      readOnly: null,
      required: null,
      aggregated: {
        readOnlyAfterCreate: true
      },
      validators: {
        setter: function(validators) {
          var addValidator, l, len1, validator;
          addValidator = (function(_this) {
            return function(validator) {
              if (!(validator instanceof cola.Validator)) {
                validator = cola.create("validator", validator, cola.Validator);
              }
              _this._validators.push(validator);
              if (validator instanceof cola.RequiredValidator && !_this._required) {
                _this._required = true;
              }
            };
          })(this);
          delete this._validators;
          if (validators) {
            this._validators = [];
            if (typeof validators === "string") {
              validator = cola.create("validator", validators, cola.Validator);
              addValidator(validator);
            } else if (validators instanceof Array) {
              for (l = 0, len1 = validators.length; l < len1; l++) {
                validator = validators[l];
                addValidator(validator);
              }
            } else {
              addValidator(validators);
            }
          }
        }
      },
      rejectInvalidValue: null
    };

    BaseProperty.EVENTS = {
      beforeWrite: null,
      write: null,
      beforeLoad: null,
      loaded: null
    };

    return BaseProperty;

  })(cola.Property);

  cola.ComputeProperty = (function(superClass) {
    extend(ComputeProperty, superClass);

    function ComputeProperty() {
      return ComputeProperty.__super__.constructor.apply(this, arguments);
    }

    ComputeProperty.ATTRIBUTES = {
      delay: null,
      watchingDataPath: null
    };

    ComputeProperty.EVENTS = {
      compute: {
        singleListener: true
      }
    };

    ComputeProperty.prototype.compute = function(entity) {
      return this.fire("compute", this, {
        entity: entity
      });
    };

    return ComputeProperty;

  })(cola.Property);

  cola.DataType.jsonToEntity = function(json, dataType, aggregated) {
    var entityList;
    if (aggregated === void 0) {
      if (json instanceof Array) {
        aggregated = true;
      } else if (typeof json === "object" && json.hasOwnProperty("$data")) {
        aggregated = json.$data instanceof Array;
      } else {
        aggregated = false;
      }
    }
    if (aggregated) {
      entityList = new cola.EntityList(dataType);
      entityList.fillData(json);
      return entityList;
    } else {
      if (json instanceof Array) {
        throw new cola.Exception("Unmatched DataType. expect \"Object\" but \"Array\".");
      }
      return new cola.Entity(dataType, json);
    }
  };

  cola.DataType.jsonToData = function(json, dataType, aggregated) {
    var result;
    if (dataType instanceof cola.StringDataType && typeof json !== "string" || dataType instanceof cola.BooleanDataType && typeof json !== "boolean" || dataType instanceof cola.NumberDataType && typeof json !== "number" || dataType instanceof cola.DateDataType && !(json instanceof Date)) {
      result = dataType.parse(json);
    } else if (dataType instanceof cola.EntityDataType) {
      result = cola.DataType.jsonToEntity(json, dataType, aggregated);
    } else if (dataType && typeof json === "object") {
      result = dataType.parse(json);
    } else {
      result = json;
    }
    return result;
  };

  cola.DataType.defaultDataTypes = defaultDataTypes = {
    "string": new cola.StringDataType({
      name: "string"
    }),
    "int": new cola.NumberDataType({
      name: "int",
      isInteger: true
    }),
    "float": new cola.NumberDataType({
      name: "float"
    }),
    "boolean": new cola.BooleanDataType({
      name: "boolean"
    }),
    "date": new cola.DateDataType({
      name: "date"
    }),
    "json": new cola.JSONDataType({
      name: "json"
    }),
    "entity": new cola.EntityDataType({
      name: "entity"
    })
  };

  defaultDataTypes["number"] = defaultDataTypes["int"];

  getEntityPath = function(markNoncurrent) {
    var lastEntity, parent, part, path, self;
    if (!markNoncurrent && this._pathCache) {
      return this._pathCache;
    }
    parent = this._parent;
    if (parent == null) {
      return;
    }
    path = [];
    self = this;
    while (parent != null) {
      if (parent instanceof _EntityList) {
        lastEntity = self;
      }
      part = self._parentProperty;
      if (part) {
        if (markNoncurrent && self instanceof _EntityList) {
          if (markNoncurrent === "always" || lastEntity && self.current !== lastEntity) {
            path.push("!" + part);
          } else {
            path.push(part);
          }
        } else {
          path.push(part);
        }
      }
      self = parent;
      parent = parent._parent;
    }
    path = path.reverse();
    if (!markNoncurrent) {
      this._pathCache = path;
    }
    return path;
  };

  cola.Entity = (function() {
    Entity.STATE_NONE = "none";

    Entity.STATE_NEW = "new";

    Entity.STATE_MODIFIED = "modified";

    Entity.STATE_DELETED = "deleted";

    Entity.prototype.state = Entity.STATE_NONE;

    Entity.prototype._disableObserverCount = 0;

    Entity.prototype._disableWriteObservers = 0;

    function Entity(dataType, data) {
      this.id = cola.uniqueId();
      this.timestamp = cola.sequenceNo();
      this.dataType = dataType;
      this._data = {};
      if (data != null) {
        this._disableWriteObservers++;
        this.set(data);
        this._disableWriteObservers--;
      }
    }

    Entity.prototype.hasValue = function(prop) {
      var ref;
      return this._data.hasOwnProperty(prop) || (((ref = this.dataType) != null ? ref.getProperty(prop) : void 0) != null);
    };

    Entity.prototype.get = function(prop, loadMode, context) {
      var callback;
      if (loadMode == null) {
        loadMode = "async";
      }
      if (typeof loadMode === "function") {
        loadMode = "async";
        callback = loadMode;
      }
      if (prop.indexOf(".") > 0) {
        return _evalDataPath(this, prop, false, loadMode, callback, context);
      } else {
        return this._get(prop, loadMode, callback, context);
      }
    };

    Entity.prototype._get = function(prop, loadMode, callback, context) {
      var callbackProcessed, loadData, property, provider, providerInvoker, ref;
      loadData = function(provider) {
        var providerInvoker, retValue;
        retValue = void 0;
        providerInvoker = provider.getInvoker(this);
        if (loadMode === "sync") {
          retValue = providerInvoker.invokeSync();
          retValue = this._set(prop, retValue);
          if (retValue && (retValue instanceof cola.EntityList || retValue instanceof cola.Entity)) {
            retValue._providerInvoker = providerInvoker;
          }
        } else if (loadMode === "async") {
          if (context) {
            context.unloaded = true;
            if (context.providerInvokers == null) {
              context.providerInvokers = [];
            }
            context.providerInvokers.push(providerInvoker);
          }
          this._data[prop] = providerInvoker;
          providerInvoker.invokeAsync({
            complete: (function(_this) {
              return function(success, result) {
                if (_this._data[prop] !== providerInvoker) {
                  success = false;
                }
                if (success) {
                  result = _this._set(prop, result);
                  retValue = result;
                  if (result && (result instanceof cola.EntityList || result instanceof cola.Entity)) {
                    result._providerInvoker = providerInvoker;
                  }
                } else {
                  _this._set(prop, null);
                }
                if (callback) {
                  cola.callback(callback, success, result);
                }
              };
            })(this)
          });
        } else {
          cola.callback(callback, true, void 0);
        }
        return retValue;
      };
      property = (ref = this.dataType) != null ? ref.getProperty(prop) : void 0;
      value = this._data[prop];
      if (value === void 0) {
        if (property) {
          if (property instanceof cola.BaseProperty) {
            provider = property.get("provider");
            if (context != null) {
              context.unloaded = true;
            }
            if (provider) {
              value = loadData.call(this, provider);
              callbackProcessed = true;
            }
          } else if (property instanceof cola.ComputeProperty) {
            value = property.compute(this);
          }
        }
      } else if (value instanceof cola.Provider) {
        value = loadData.call(this, value);
        callbackProcessed = true;
      } else if (value instanceof cola.AjaxServiceInvoker) {
        providerInvoker = value;
        if (loadMode === "sync") {
          value = providerInvoker.invokeSync();
          value = this._set(prop, value);
        } else if (loadMode === "async") {
          if (callback) {
            providerInvoker.callbacks.push(callback);
          }
          callbackProcessed = true;
        }
        if (context) {
          context.unloaded = true;
          if (context.providerInvokers == null) {
            context.providerInvokers = [];
          }
          context.providerInvokers.push(providerInvoker);
        }
      }
      if (callback && !callbackProcessed) {
        cola.callback(callback, true, value);
      }
      return value;
    };

    Entity.prototype.set = function(prop, value, context) {
      var config;
      if (typeof prop === "string") {
        _setValue(this, prop, value, context);
      } else if (prop && (typeof prop === "object")) {
        config = prop;
        for (prop in config) {
          if (prop.charAt(0) === "$") {
            continue;
          }
          this.set(prop, config[prop]);
        }
      }
      return this;
    };

    Entity.prototype._jsonToEntity = function(value, dataType, aggregated, provider) {
      var result;
      result = cola.DataType.jsonToEntity(value, dataType, aggregated);
      if (result && provider) {
        result.pageSize = provider._pageSize;
        result._providerInvoker = provider.getInvoker(this);
      }
      return result;
    };

    Entity.prototype._set = function(prop, value) {
      var actualType, changed, convert, dataType, expectedType, item, l, len1, len2, len3, matched, message, messages, o, oldValue, property, provider, q, ref, ref1, ref2, ref3, ref4, validator;
      oldValue = this._data[prop];
      property = (ref = this.dataType) != null ? ref.getProperty(prop) : void 0;
      if (property && property instanceof cola.ComputeProperty) {
        throw new cola.Exception("Cannot set value to ComputeProperty \"" + prop + "\".");
      }
      if (value != null) {
        if (value instanceof cola.Provider) {
          changed = oldValue !== void 0;
        } else {
          if (property) {
            dataType = property._dataType;
            provider = property._provider;
          }
          if (dataType) {
            if (value != null) {
              if (dataType instanceof cola.StringDataType && typeof value !== "string" || dataType instanceof cola.BooleanDataType && typeof value !== "boolean" || dataType instanceof cola.NumberDataType && typeof value !== "number" || dataType instanceof cola.DateDataType && !(value instanceof Date)) {
                value = dataType.parse(value);
              } else if (dataType instanceof cola.EntityDataType) {
                matched = true;
                if (value instanceof _Entity) {
                  matched = value.dataType === dataType && !property._aggregated;
                } else if (value instanceof _EntityList) {
                  matched = value.dataType === dataType && property._aggregated;
                } else {
                  value = this._jsonToEntity(value, dataType, property._aggregated, provider);
                }
                if (!matched) {
                  expectedType = dataType.get("name");
                  actualType = ((ref1 = value.dataType) != null ? ref1.get("name") : void 0) || "undefined";
                  if (property._aggregated) {
                    expectedType = "[" + expectedType + "]";
                  }
                  if (value instanceof cola.EntityList) {
                    actualType = "[" + actualType + "]";
                  }
                  throw new cola.Exception("Unmatched DataType. expect \"" + expectedType + "\" but \"" + actualType + "\".");
                }
              } else {
                value = dataType.parse(value);
              }
            }
          } else if (typeof value === "object" && (value != null)) {
            if (value instanceof Array) {
              convert = true;
              if (value.length > 0) {
                item = value[0];
                if (cola.util.isSimpleValue(item)) {
                  convert = false;
                }
              }
              if (convert) {
                value = this._jsonToEntity(value, null, true, provider);
              }
            } else if (value.hasOwnProperty("$data")) {
              value = this._jsonToEntity(value, null, true, provider);
            } else if (value instanceof Date) {

            } else {
              value = this._jsonToEntity(value, null, false, provider);
            }
          }
          changed = oldValue !== value;
        }
      } else {
        changed = oldValue !== value;
      }
      if (changed) {
        if (property && property instanceof cola.BaseProperty) {
          if (property._validators && property._rejectInvalidValue) {
            messages = null;
            ref2 = property._validators;
            for (l = 0, len1 = ref2.length; l < len1; l++) {
              validator = ref2[l];
              if ((value != null) || validator instanceof cola.RequiredValidator) {
                if (!(validator._disabled && validator instanceof cola.AsyncValidator && validator.get("async"))) {
                  message = validator.validate(value);
                  if (message) {
                    if (messages == null) {
                      messages = [];
                    }
                    if (message instanceof Array) {
                      Array.prototype.push.apply(messages, message);
                    } else {
                      messages.push(message);
                    }
                  }
                }
              }
            }
            if (messages) {
              for (o = 0, len2 = messages.length; o < len2; o++) {
                message = messages[o];
                if (message === VALIDATION_ERROR) {
                  throw new cola.Exception(message.text);
                }
              }
            }
          }
        }
        if (this._disableWriteObservers === 0) {
          if ((oldValue != null) && (oldValue instanceof _Entity || oldValue instanceof _EntityList)) {
            delete oldValue._parent;
            delete oldValue._parentProperty;
          }
          if (this.state === _Entity.STATE_NONE) {
            this.setState(_Entity.STATE_MODIFIED);
          }
        }
        this._data[prop] = value;
        if ((value != null) && (value instanceof _Entity || value instanceof _EntityList)) {
          if (value._parent && value._parent !== this) {
            throw new cola.Exception("Entity/EntityList is already belongs to another owner. \"" + prop + "\"");
          }
          value._parent = this;
          value._parentProperty = prop;
          value._setListener(this._listener);
          value._onPathChange();
          this._mayHasSubEntity = true;
        }
        this.timestamp = cola.sequenceNo();
        if (this._disableWriteObservers === 0) {
          this._notify(cola.constants.MESSAGE_DATA_CHANGE, {
            entity: this,
            property: prop,
            value: value,
            oldValue: oldValue
          });
        }
        if (messages !== void 0) {
          if ((ref3 = this._messageHolder) != null) {
            ref3.clear(prop);
          }
          this.addMessage(prop, messages);
          if (value != null) {
            ref4 = property._validators;
            for (q = 0, len3 = ref4.length; q < len3; q++) {
              validator = ref4[q];
              if (!validator._disabled && validator instanceof cola.AsyncValidator && validator.get("async")) {
                validator.validate(value, (function(_this) {
                  return function(message) {
                    if (message) {
                      _this.addMessage(prop, message);
                    }
                  };
                })(this));
              }
            }
          }
        } else {
          this.validate(prop);
        }
      }
      return value;
    };

    Entity.prototype.getText = function(prop, loadMode, callback, context) {
      var entity, i, part1, part2, text;
      if (loadMode == null) {
        loadMode = "async";
      }
      if (typeof loadMode === "function") {
        loadMode = "async";
        callback = loadMode;
      }
      i = prop.lastIndexOf(".");
      if (i > 0) {
        part1 = prop.substring(0, i);
        part2 = prop.substring(i + 1);
        if (callback) {
          return this.get(part1, loadMode, {
            complete: function(success, entity) {
              var text;
              if (success) {
                if (entity) {
                  if (typeof entity._getText === "function") {
                    entity._getText(part2, loadMode, callback);
                  } else {
                    text = entity[path];
                    cola.callback(callback, true, (text != null ? text + "" : ""));
                  }
                } else {
                  cola.callback(callback, true, "");
                }
              } else {
                cola.callback(callback, false, entity);
              }
            }
          }, context);
        } else {
          entity = this.get(part1, loadMode, null, context);
          if (entity) {
            if (typeof entity._getText === "function") {
              return entity._getText(part2, null, null, context);
            } else {
              text = entity[path] + "";
              if (text != null) {
                return text + "";
              } else {
                return "";
              }
            }
          }
        }
      } else {
        return this._getText(prop, loadMode, callback, context);
      }
    };

    Entity.prototype._getText = function(prop, loadMode, callback, context) {
      var dataType, property, propertyDataType, ref;
      if (callback) {
        dataType = this.dataType;
        this._get(prop, loadMode, {
          complete: function(success, value) {
            var property, propertyDataType, text;
            if (success) {
              if (value != null) {
                property = dataType != null ? dataType.getProperty(prop) : void 0;
                propertyDataType = property != null ? property._dataType : void 0;
                if (propertyDataType) {
                  text = propertyDataType.toText(value, property._format);
                } else {
                  text = value != null ? value + "" : "";
                }
              }
              cola.callback(callback, true, text || "");
            } else {
              cola.callback(callback, false, value);
            }
          }
        }, context);
        return "";
      } else {
        value = this._get(prop, loadMode, null, context);
        if (value != null) {
          property = (ref = this.dataType) != null ? ref.getProperty(prop) : void 0;
          propertyDataType = property != null ? property._dataType : void 0;
          if (propertyDataType) {
            return propertyDataType.toText(value, property._format);
          } else {
            if (value != null) {
              return value + "";
            } else {
              return "";
            }
          }
        } else {
          return "";
        }
      }
    };

    Entity.prototype.remove = function() {
      if (this._parent) {
        if (this._parent instanceof _EntityList) {
          this._parent.remove(this);
        } else {
          this.setState(_Entity.STATE_DELETED);
          this._parent.set(this._parentProperty, null);
        }
      } else {
        this.setState(_Entity.STATE_DELETED);
      }
      return this;
    };

    Entity.prototype.createChild = function(prop, data) {
      var entityList, property, propertyDataType, provider, ref;
      if (data && data instanceof Array) {
        throw new cola.Exception("Unmatched DataType. expect \"Object\" but \"Array\".");
      }
      property = (ref = this.dataType) != null ? ref.getProperty(prop) : void 0;
      propertyDataType = property != null ? property._dataType : void 0;
      if (propertyDataType && !(propertyDataType instanceof cola.EntityDataType)) {
        throw new cola.Exception("Unmatched DataType. expect \"cola.EntityDataType\" but \"" + propertyDataType._name + "\".");
      }
      if (property != null ? property._aggregated : void 0) {
        entityList = this._get(prop, "never");
        if (entityList == null) {
          entityList = new cola.EntityList(propertyDataType);
          provider = property._provider;
          if (provider) {
            entityList.pageSize = provider._pageSize;
            entityList._providerInvoker = provider.getInvoker(this);
          }
          this._disableWriteObservers++;
          this._set(prop, entityList);
          this._disableWriteObservers--;
        }
        return entityList.insert(data);
      } else {
        return this._set(prop, data);
      }
    };

    Entity.prototype.createBrother = function(data) {
      var brother, parent;
      if (data && data instanceof Array) {
        throw new cola.Exception("Unmatched DataType. expect \"Object\" but \"Array\".");
      }
      brother = new _Entity(this.dataType, data);
      brother.setState(_Entity.STATE_NEW);
      parent = this._parent;
      if (parent && parent instanceof _EntityList) {
        parent.insert(brother);
      }
      return brother;
    };

    Entity.prototype.setState = function(state) {
      var oldState;
      if (this.state === state) {
        return this;
      }
      if (this.state === _Entity.STATE_NONE && state === _Entity.STATE_MODIFIED) {
        this._storeOldData();
      }
      oldState = this.state;
      this.state = state;
      this._notify(cola.constants.MESSAGE_EDITING_STATE_CHANGE, {
        entity: this,
        oldState: oldState,
        state: state
      });
      return this;
    };

    Entity.prototype._storeOldData = function() {
      var data, oldData, p;
      if (this._oldData) {
        return;
      }
      data = this._data;
      oldData = this._oldData = {};
      for (p in data) {
        value = data[p];
        if (value && (value instanceof _Entity || value instanceof _EntityList)) {
          continue;
        }
        oldData[p] = value;
      }
    };

    Entity.prototype.getOldValue = function(prop) {
      var ref;
      return (ref = this._oldData) != null ? ref[prop] : void 0;
    };

    Entity.prototype.reset = function(prop) {
      var data;
      if (prop) {
        this._set(prop, void 0);
        this.clearMessages(prop);
      } else {
        this.disableObservers();
        data = this._data;
        for (prop in data) {
          value = data[prop];
          if (value !== void 0) {
            delete data[prop];
          }
        }
        this.resetState();
        this.enableObservers();
        this._notify(cola.constants.MESSAGE_REFRESH, {
          entity: this
        });
      }
      return this;
    };

    Entity.prototype.resetState = function() {
      delete this._oldData;
      this.clearMessages();
      this.setState(_Entity.STATE_NONE);
      return this;
    };

    Entity.prototype.getDataType = function(path) {
      var data, dataType, l, len1, part, parts, property;
      if (path) {
        dataType = this.dataType;
        if (dataType) {
          parts = path.split(".");
          for (l = 0, len1 = parts.length; l < len1; l++) {
            part = parts[l];
            property = typeof dataType.getProperty === "function" ? dataType.getProperty(part) : void 0;
            if (property == null) {
              break;
            }
            dataType = property.get("dataType");
            if (dataType == null) {
              break;
            }
          }
        }
      } else {
        dataType = this.dataType;
      }
      if (dataType == null) {
        data = this.get(path);
        dataType = data != null ? data.dataType : void 0;
      }
      return dataType;
    };

    Entity.prototype.getPath = getEntityPath;

    Entity.prototype.flush = function(property, loadMode) {
      var callback, notifyArg, propertyDef;
      if (loadMode == null) {
        loadMode = "async";
      }
      propertyDef = this.dataType.getProperty(property);
      if ((propertyDef != null ? propertyDef._provider : void 0) == null) {
        throw new cola.Exception("Provider undefined.");
      }
      this._set(property, void 0);
      if (typeof loadMode === "function") {
        callback = loadMode;
        loadMode = "async";
      }
      notifyArg = {
        entity: this,
        property: property
      };
      if (loadMode === "async") {
        this._notify(cola.constants.MESSAGE_LOADING_START, notifyArg);
      }
      return this._get(property, loadMode, {
        complete: (function(_this) {
          return function(success, result) {
            cola.callback(callback, success, result);
            if (loadMode === "async") {
              return _this._notify(cola.constants.MESSAGE_LOADING_END, notifyArg);
            }
          };
        })(this)
      });
    };

    Entity.prototype._setListener = function(listener) {
      var data, p;
      if (this._listener === listener) {
        return;
      }
      this._listener = listener;
      if (this._mayHasSubEntity) {
        data = this._data;
        for (p in data) {
          value = data[p];
          if (value && (value instanceof _Entity || value instanceof _EntityList)) {
            value._setListener(listener);
          }
        }
      }
    };

    Entity.prototype._onPathChange = function() {
      var data, p;
      delete this._pathCache;
      if (this._mayHasSubEntity) {
        data = this._data;
        for (p in data) {
          value = data[p];
          if (value && (value instanceof _Entity || value instanceof _EntityList)) {
            value._onPathChange();
          }
        }
      }
    };

    Entity.prototype.disableObservers = function() {
      if (this._disableObserverCount < 0) {
        this._disableObserverCount = 1;
      } else {
        this._disableObserverCount++;
      }
      return this;
    };

    Entity.prototype.enableObservers = function() {
      if (this._disableObserverCount < 1) {
        this._disableObserverCount = 0;
      } else {
        this._disableObserverCount--;
      }
      return this;
    };

    Entity.prototype._notify = function(type, arg) {
      var path;
      if (this._disableObserverCount === 0) {
        path = this.getPath(true);
        if ((type === cola.constants.MESSAGE_DATA_CHANGE || type === cola.constants.MESSAGE_VALIDATION_STATE_CHANGE || type === cola.constants.MESSAGE_LOADING_START || type === cola.constants.MESSAGE_LOADING_END) && arg.property) {
          if (path) {
            path = path.concat(arg.property);
          } else {
            path = [arg.property];
          }
        }
        this._doNotify(path, type, arg);
      }
    };

    Entity.prototype._doNotify = function(path, type, arg) {
      var ref;
      if ((ref = this._listener) != null) {
        ref.onMessage(path, type, arg);
      }
    };

    Entity.prototype._validate = function(prop) {
      var data, l, len1, message, messageChanged, property, ref, validator;
      property = this.dataType.getProperty(prop);
      if (property && property instanceof cola.BaseProperty) {
        if (property._validators) {
          data = this._data[prop];
          if (data && (data instanceof cola.Provider || data instanceof cola.AjaxServiceInvoker)) {
            return;
          }
          ref = property._validators;
          for (l = 0, len1 = ref.length; l < len1; l++) {
            validator = ref[l];
            if (!validator._disabled) {
              if (validator instanceof cola.AsyncValidator && validator.get("async")) {
                validator.validate(data, (function(_this) {
                  return function(message) {
                    if (message) {
                      _this.addMessage(prop, message);
                    }
                  };
                })(this));
              } else {
                message = validator.validate(data);
                if (message) {
                  this._addMessage(prop, message);
                  messageChanged = true;
                }
              }
            }
          }
        }
      }
      return messageChanged;
    };

    Entity.prototype.validate = function(prop) {
      var keyMessage, l, len1, oldKeyMessage, property, ref, ref1;
      if (this._messageHolder) {
        oldKeyMessage = this._messageHolder.getKeyMessage();
        this._messageHolder.clear(prop);
      }
      if (this.dataType) {
        if (prop) {
          this._validate(prop);
          this._notify(cola.constants.MESSAGE_VALIDATION_STATE_CHANGE, {
            entity: this,
            property: prop
          });
        } else {
          ref = this.dataType.getProperties().elements;
          for (l = 0, len1 = ref.length; l < len1; l++) {
            property = ref[l];
            this._validate(property._property);
            this._notify(cola.constants.MESSAGE_VALIDATION_STATE_CHANGE, {
              entity: this,
              property: property._property
            });
          }
        }
      }
      keyMessage = (ref1 = this._messageHolder) != null ? ref1.getKeyMessage() : void 0;
      if ((oldKeyMessage || keyMessage) && oldKeyMessage !== keyMessage) {
        this._notify(cola.constants.MESSAGE_VALIDATION_STATE_CHANGE, {
          entity: this
        });
      }
      return keyMessage;
    };

    Entity.prototype._addMessage = function(prop, message) {
      var l, len1, m, messageHolder, topKeyChanged;
      messageHolder = this._messageHolder;
      if (!messageHolder) {
        this._messageHolder = messageHolder = new _Entity.MessageHolder();
      }
      if (message instanceof Array) {
        for (l = 0, len1 = message.length; l < len1; l++) {
          m = message[l];
          if (messageHolder.add(prop, m)) {
            topKeyChanged = true;
          }
        }
      } else {
        if (messageHolder.add(prop, message)) {
          topKeyChanged = true;
        }
      }
      return topKeyChanged;
    };

    Entity.prototype.clearMessages = function(prop) {
      var hasPropMessage, topKeyChanged;
      if (!this._messageHolder) {
        return this;
      }
      if (prop) {
        hasPropMessage = this._messageHolder.getKeyMessage(prop);
      }
      topKeyChanged = this._messageHolder.clear(prop);
      if (hasPropMessage) {
        this._notify(cola.constants.MESSAGE_VALIDATION_STATE_CHANGE, {
          entity: this,
          property: prop
        });
      }
      if (topKeyChanged) {
        this._notify(cola.constants.MESSAGE_VALIDATION_STATE_CHANGE, {
          entity: this
        });
      }
      return this;
    };

    Entity.prototype.addMessage = function(prop, message) {
      var topKeyChanged;
      if (arguments.length === 1) {
        message = prop;
        prop = "$";
      }
      if (prop === "$") {
        this._notify(cola.constants.MESSAGE_VALIDATION_STATE_CHANGE, {
          entity: this
        });
      } else {
        topKeyChanged = this._addMessage(prop, message);
        this._notify(cola.constants.MESSAGE_VALIDATION_STATE_CHANGE, {
          entity: this,
          property: prop
        });
        if (topKeyChanged) {
          this._notify(cola.constants.MESSAGE_VALIDATION_STATE_CHANGE, {
            entity: this
          });
        }
      }
      return this;
    };

    Entity.prototype.getKeyMessage = function(prop) {
      var ref;
      return (ref = this._messageHolder) != null ? ref.getKeyMessage(prop) : void 0;
    };

    Entity.prototype.findMessages = function(prop, type) {
      var ref;
      return (ref = this._messageHolder) != null ? ref.findMessages(prop, type) : void 0;
    };

    Entity.prototype.toJSON = function(options) {
      var data, json, oldData, prop, state;
      state = (options != null ? options.state : void 0) || false;
      oldData = (options != null ? options.oldData : void 0) || false;
      data = this._data;
      json = {};
      for (prop in data) {
        value = data[prop];
        if (value) {
          if (value instanceof cola.AjaxServiceInvoker) {
            continue;
          } else if (value instanceof _Entity || value instanceof _EntityList) {
            value = value.toJSON(options);
          }
        }
        json[prop] = value;
      }
      if (state) {
        json.$state = this.state;
      }
      if (oldData && this._oldData) {
        json.$oldData = this._oldData;
      }
      return json;
    };

    return Entity;

  })();

  LinkedList = (function() {
    function LinkedList() {}

    LinkedList.prototype._size = 0;

    LinkedList.prototype._insertElement = function(element, insertMode, refEntity) {
      var next, previous;
      if (!this._first) {
        this._first = this._last = element;
      } else {
        if (!insertMode || insertMode === "end") {
          element._previous = this._last;
          this._last._next = element;
          this._last = element;
        } else if (insertMode === "before") {
          previous = refEntity._previous;
          if (previous != null) {
            previous._next = element;
          }
          refEntity._previous = element;
          element._previous = previous;
          element._next = refEntity;
          if (this._first === refEntity) {
            this._first = element;
          }
        } else if (insertMode === "after") {
          next = refEntity._next;
          if (next != null) {
            next._previous = element;
          }
          refEntity._next = element;
          element._previous = refEntity;
          element._next = next;
          if (this._last === refEntity) {
            this._last = element;
          }
        } else if (insertMode === "begin") {
          element._next = this._first;
          this._first._previous = element;
          this._first = element;
        }
      }
      element._page = this;
      this._size++;
    };

    LinkedList.prototype._removeElement = function(element) {
      var next, previous;
      previous = element._previous;
      next = element._next;
      if (previous != null) {
        previous._next = next;
      }
      if (next != null) {
        next._previous = previous;
      }
      if (this._first === element) {
        this._first = next;
      }
      if (this._last === element) {
        this._last = previous;
      }
      this._size++;
    };

    LinkedList.prototype._clearElements = function() {
      this._first = this._last = null;
      this._size = 0;
    };

    return LinkedList;

  })();

  Page = (function(superClass) {
    extend(Page, superClass);

    Page.prototype.loaded = false;

    Page.prototype.entityCount = 0;

    function Page(entityList1, pageNo1) {
      this.entityList = entityList1;
      this.pageNo = pageNo1;
    }

    Page.prototype.initData = function(json) {
      var data, dataType, entity, entityList, l, len1, rawJson;
      rawJson = json;
      entityList = this.entityList;
      if (json.hasOwnProperty("$data")) {
        json = rawJson.$data;
      }
      if (!(json instanceof Array)) {
        throw new cola.Exception("Unmatched DataType. expect \"Array\" but \"Object\".");
      }
      dataType = entityList.dataType;
      for (l = 0, len1 = json.length; l < len1; l++) {
        data = json[l];
        entity = new _Entity(dataType, data);
        this._insertElement(entity);
      }
      if (rawJson.$entityCount != null) {
        entityList.totalEntityCount = rawJson.$entityCount;
      }
      if (entityList.totalEntityCount != null) {
        entityList.pageCount = parseInt((entityList.totalEntityCount + entityList.pageSize - 1) / entityList.pageSize);
        entityList.pageCountDetermined = true;
      }
      entityList.entityCount += json.length;
      entityList._notify(cola.constants.MESSAGE_REFRESH, {
        entityList: entityList
      });
    };

    Page.prototype._insertElement = function(entity, insertMode, refEntity) {
      var entityList;
      Page.__super__._insertElement.call(this, entity, insertMode, refEntity);
      entityList = this.entityList;
      entity._page = this;
      entity._parent = entityList;
      delete entity._parentProperty;
      if (!this.dontAutoSetCurrent && (entityList.current == null)) {
        if (entity.state !== _Entity.STATE_DELETED) {
          entityList.current = entity;
          entityList._setCurrentPage(entity._page);
        }
      }
      entity._setListener(entityList._listener);
      entity._onPathChange();
      if (entity.state !== _Entity.STATE_DELETED) {
        this.entityCount++;
      }
    };

    Page.prototype._removeElement = function(entity) {
      Page.__super__._removeElement.call(this, entity);
      delete entity._page;
      delete entity._parent;
      entity._setListener(null);
      entity._onPathChange();
      if (entity.state !== _Entity.STATE_DELETED) {
        this.entityCount--;
      }
    };

    Page.prototype._clearElements = function() {
      var entity;
      entity = this._first;
      while (entity) {
        delete entity._page;
        delete entity._parent;
        entity._setListener(null);
        entity._onPathChange();
        entity = entity._next;
      }
      this.entityCount = 0;
      Page.__super__._clearElements.call(this);
    };

    Page.prototype.loadData = function(callback) {
      var pageSize, providerInvoker, result;
      providerInvoker = this.entityList._providerInvoker;
      if (providerInvoker) {
        pageSize = this.entityList.pageSize;
        if (pageSize > 1 && this.pageNo > 1) {
          providerInvoker.invokerOptions.data.from = pageSize * (this.pageNo - 1);
        }
        if (callback) {
          providerInvoker.invokeAsync({
            complete: (function(_this) {
              return function(success, result) {
                if (success) {
                  _this.initData(result);
                }
                return cola.callback(callback, success, result);
              };
            })(this)
          });
        } else {
          result = providerInvoker.invokeSync();
          this.initData(result);
        }
      }
    };

    return Page;

  })(LinkedList);

  cola.EntityList = (function(superClass) {
    extend(EntityList, superClass);

    EntityList.prototype.current = null;

    EntityList.prototype.entityCount = 0;

    EntityList.prototype.pageMode = "append";

    EntityList.prototype.pageSize = 0;

    EntityList.prototype.pageNo = 1;

    EntityList.prototype.pageCount = 1;

    EntityList.prototype._disableObserverCount = 0;

    function EntityList(dataType) {
      this.id = cola.uniqueId();
      this.timestamp = cola.sequenceNo();
      this.dataType = dataType;
    }

    EntityList.prototype.fillData = function(array) {
      var page;
      page = this._findPage(this.pageNo);
      if (page == null) {
        page = new Page(this, this.pageNo);
      }
      this._insertElement(page, "begin");
      page.initData(array);
    };

    EntityList.prototype._setListener = function(listener) {
      var next, page;
      if (this._listener === listener) {
        return;
      }
      this._listener = listener;
      page = this._first;
      if (!page) {
        return;
      }
      next = page._first;
      while (page) {
        if (next) {
          next._setListener(listener);
          next = next._next;
        } else {
          page = page._next;
          next = page != null ? page._first : void 0;
        }
      }
    };

    EntityList.prototype._setCurrentPage = function(page) {
      this._currentPage = page;
      this.pageNo = (page != null ? page.pageNo : void 0) || 1;
    };

    EntityList.prototype._onPathChange = function() {
      var next, page;
      delete this._pathCache;
      page = this._first;
      if (!page) {
        return;
      }
      next = page._first;
      while (page) {
        if (next) {
          next._onPathChange();
          next = next._next;
        } else {
          page = page._next;
          next = page != null ? page._first : void 0;
        }
      }
    };

    EntityList.prototype._findPrevious = function(entity) {
      var page, previous;
      if (entity && entity._parent !== this) {
        return;
      }
      if (entity) {
        page = entity._page;
        previous = entity._previous;
      } else {
        page = this._last;
        previous = page._last;
      }
      while (page) {
        if (previous) {
          if (previous.state !== _Entity.STATE_DELETED) {
            return previous;
          } else {
            previous = previous._previous;
          }
        } else {
          page = page._previous;
          previous = page != null ? page._last : void 0;
        }
      }
    };

    EntityList.prototype._findNext = function(entity) {
      var next, page;
      if (entity && entity._parent !== this) {
        return;
      }
      if (entity) {
        page = entity._page;
        next = entity._next;
      } else {
        page = this._first;
        next = page._first;
      }
      while (page) {
        if (next) {
          if (next.state !== _Entity.STATE_DELETED) {
            return next;
          } else {
            next = next._next;
          }
        } else {
          page = page._next;
          next = page != null ? page._first : void 0;
        }
      }
    };

    EntityList.prototype._findPage = function(pageNo) {
      var page;
      if (pageNo < 1) {
        return null;
      }
      if (pageNo > this.pageCount) {
        if (this.pageCountDetermined || pageNo > (this.pageCount + 1)) {
          return null;
        }
      }
      page = this._currentPage || this._first;
      if (!page) {
        return null;
      }
      if (page.pageNo === pageNo) {
        return page;
      } else if (page.pageNo < pageNo) {
        page = page._next;
        while (page != null) {
          if (page.pageNo === pageNo) {
            return page;
          } else if (page.pageNo > pageNo) {
            break;
          }
          page = page._next;
        }
      } else {
        page = page._previous;
        while (page != null) {
          if (page.pageNo === pageNo) {
            return page;
          } else if (page.pageNo < pageNo) {
            break;
          }
          page = page._previous;
        }
      }
      return null;
    };

    EntityList.prototype._createPage = function(pageNo) {
      var insertMode, page, refPage;
      if (pageNo < 1) {
        return null;
      }
      if (pageNo > this.pageCount) {
        if (this.pageCountDetermined || pageNo > (this.pageCount + 1)) {
          return null;
        }
      }
      insertMode = "end";
      refPage = this._currentPage || this._first;
      if (refPage) {
        if (refPage.page === pageNo - 1) {
          insertMode = "after";
        } else if (refPage.page === pageNo + 1) {
          insertMode = "before";
        } else {
          page = this._last;
          while (page) {
            if (page.pageNo < pageNo) {
              refPage = page;
              insertMode = "after";
              break;
            }
            page = page._previous;
          }
        }
      }
      page = new Page(this, pageNo);
      this._insertElement(page, insertMode, refPage);
      return page;
    };

    EntityList.prototype.hasNextPage = function() {
      var pageNo;
      pageNo = this.pageNo + 1;
      return !this.pageCountDetermined || pageNo <= this.pageCount;
    };

    EntityList.prototype._loadPage = function(pageNo, setCurrent, loadMode) {
      var callback, entity, page;
      if (loadMode == null) {
        loadMode = "async";
      }
      if (typeof loadMode === "function") {
        callback = loadMode;
        loadMode = "async";
      }
      page = this._findPage(pageNo);
      if (page !== this._currentPage) {
        if (page) {
          this._setCurrentPage(page);
          if (setCurrent) {
            entity = page._first;
            while (entity) {
              if (entity.state !== _Entity.STATE_DELETED) {
                this.setCurrent(entity);
                break;
              }
              entity = entity._next;
            }
          }
          cola.callback(callback, true);
        } else if (loadMode !== "never") {
          if (setCurrent) {
            this.setCurrent(null);
          }
          page = this._createPage(pageNo);
          if (loadMode === "async") {
            page.loadData({
              complete: (function(_this) {
                return function(success, result) {
                  if (success) {
                    _this._setCurrentPage(page);
                    if (page.entityCount && _this.pageCount < pageNo) {
                      _this.pageCount = pageNo;
                    }
                  }
                  cola.callback(callback, success, result);
                };
              })(this)
            });
          } else {
            page.loadData();
            this._setCurrentPage(page);
            cola.callback(callback, true);
          }
        }
      }
      return this;
    };

    EntityList.prototype.loadPage = function(pageNo, loadMode) {
      return this._loadPage(pageNo, false, loadMode);
    };

    EntityList.prototype.gotoPage = function(pageNo, loadMode) {
      if (pageNo < 1) {
        pageNo = 1;
      } else if (this.pageCountDetermined && pageNo > this.pageCount) {
        pageNo = this.pageCount;
      }
      return this._loadPage(pageNo, true, loadMode);
    };

    EntityList.prototype.firstPage = function(loadMode) {
      this.gotoPage(1, loadMode);
      return this;
    };

    EntityList.prototype.previousPage = function(loadMode) {
      var pageNo;
      pageNo = this.pageNo - 1;
      if (pageNo < 1) {
        pageNo = 1;
      }
      this.gotoPage(pageNo, loadMode);
      return this;
    };

    EntityList.prototype.nextPage = function(loadMode) {
      var pageNo;
      pageNo = this.pageNo + 1;
      if (this.pageCountDetermined && pageNo > this.pageCount) {
        pageNo = this.pageCount;
      }
      this.gotoPage(pageNo, loadMode);
      return this;
    };

    EntityList.prototype.lastPage = function(loadMode) {
      this.gotoPage(this.pageCount, loadMode);
      return this;
    };

    EntityList.prototype.insert = function(entity, insertMode, refEntity) {
      var page;
      if (insertMode === "before" || insertMode === "after") {
        if (refEntity && refEntity._parent !== this) {
          refEntity = null;
        }
        if (refEntity == null) {
          refEntity = this.current;
        }
        if (refEntity) {
          page = refEntity._page;
        }
      } else if (this.pageMode === "append") {
        if (insertMode === "end") {
          page = this._last;
        } else if (insertMode === "begin") {
          page = this._first;
        }
      }
      if (!page) {
        page = this._currentPage;
        if (!page) {
          this.gotoPage(1);
          page = this._currentPage;
        }
      }
      if (entity instanceof _Entity) {
        if (entity._parent && entity._parent !== this) {
          throw new cola.Exception("Entity is already belongs to another owner. \"" + (this._parentProperty || "Unknown") + "\".");
        }
      } else {
        entity = new _Entity(this.dataType, entity);
        entity.setState(_Entity.STATE_NEW);
      }
      page.dontAutoSetCurrent = true;
      page._insertElement(entity, insertMode, refEntity);
      page.dontAutoSetCurrent = false;
      if (entity.state !== _Entity.STATE_DELETED) {
        this.entityCount++;
      }
      this.timestamp = cola.sequenceNo();
      this._notify(cola.constants.MESSAGE_INSERT, {
        entityList: this,
        entity: entity,
        insertMode: insertMode,
        refEntity: refEntity
      });
      if (!this.current) {
        this.setCurrent(entity);
      }
      return entity;
    };

    EntityList.prototype.remove = function(entity, detach) {
      var changeCurrent, newCurrent, page;
      if (entity == null) {
        entity = this.current;
        if (entity == null) {
          return void 0;
        }
      }
      if (entity._parent !== this) {
        return void 0;
      }
      if (entity === this.current) {
        changeCurrent = true;
        newCurrent = this._findNext(entity);
        if (!newCurrent) {
          newCurrent = this._findPrevious(entity);
        }
      }
      page = entity._page;
      if (detach) {
        page._removeElement(entity);
        this.entityCount--;
      } else if (entity.state === _Entity.STATE_NEW) {
        entity.setState(_Entity.STATE_DELETED);
        page._removeElement(entity);
        this.entityCount--;
      } else if (entity.state !== _Entity.STATE_DELETED) {
        entity.setState(_Entity.STATE_DELETED);
        this.entityCount--;
      }
      this.timestamp = cola.sequenceNo();
      this._notify(cola.constants.MESSAGE_REMOVE, {
        entityList: this,
        entity: entity
      });
      if (changeCurrent) {
        this.setCurrent(newCurrent);
      }
      return entity;
    };

    EntityList.prototype.setCurrent = function(entity) {
      var oldCurrent;
      if (this.current === entity || (entity != null ? entity.state : void 0) === cola.Entity.STATE_DELETED) {
        return this;
      }
      if (entity && entity._parent !== this) {
        return this;
      }
      oldCurrent = this.current;
      if (oldCurrent) {
        oldCurrent._onPathChange();
      }
      this.current = entity;
      if (entity) {
        this._setCurrentPage(entity._page);
        entity._onPathChange();
      }
      this._notify(cola.constants.MESSAGE_CURRENT_CHANGE, {
        entityList: this,
        current: entity,
        oldCurrent: oldCurrent
      });
      return this;
    };

    EntityList.prototype.first = function() {
      var entity;
      entity = this._findNext();
      if (entity) {
        this.setCurrent(entity);
        return entity;
      } else {
        return this.current;
      }
    };

    EntityList.prototype.previous = function() {
      var entity;
      entity = this._findPrevious(this.current);
      if (entity) {
        this.setCurrent(entity);
        return entity;
      } else {
        return this.current;
      }
    };

    EntityList.prototype.next = function() {
      var entity;
      entity = this._findNext(this.current);
      if (entity) {
        this.setCurrent(entity);
        return entity;
      } else {
        return this.current;
      }
    };

    EntityList.prototype.last = function() {
      var entity;
      entity = this._findPrevious();
      if (entity) {
        this.setCurrent(entity);
        return entity;
      } else {
        return this.current;
      }
    };

    EntityList.prototype._reset = function() {
      var page;
      this.current = null;
      this.entityCount = 0;
      this.pageNo = 1;
      this.pageCount = 1;
      page = this._first;
      while (page) {
        page._clearElements();
        page = page._next;
      }
      this.timestamp = cola.sequenceNo();
      return this;
    };

    EntityList.prototype.disableObservers = function() {
      if (this._disableObserverCount < 0) {
        this._disableObserverCount = 1;
      } else {
        this._disableObserverCount++;
      }
      return this;
    };

    EntityList.prototype.enableObservers = function() {
      if (this._disableObserverCount < 1) {
        this._disableObserverCount = 0;
      } else {
        this._disableObserverCount--;
      }
      return this;
    };

    EntityList.prototype._notify = function(type, arg) {
      var ref;
      if (this._disableObserverCount === 0) {
        if ((ref = this._listener) != null) {
          ref.onMessage(this.getPath(true), type, arg);
        }
      }
    };

    EntityList.prototype.flush = function(loadMode) {
      var callback, notifyArg, page;
      if (this._providerInvoker == null) {
        throw new cola.Exception("Provider undefined.");
      }
      if (typeof loadMode === "function") {
        callback = loadMode;
        loadMode = "async";
      }
      this._reset();
      page = this._findPage(this.pageNo);
      if (!page) {
        this._createPage(this.pageNo);
      }
      if (loadMode === "async") {
        notifyArg = {
          entityList: this
        };
        this._notify(cola.constants.MESSAGE_LOADING_START, notifyArg);
        page.loadData({
          complete: (function(_this) {
            return function(success, result) {
              cola.callback(callback, success, result);
              return _this._notify(cola.constants.MESSAGE_LOADING_END, notifyArg);
            };
          })(this)
        });
      } else {
        page.loadData();
      }
      return this;
    };

    EntityList.prototype.each = function(fn, options) {
      var deleted, i, next, page, pageNo;
      page = this._first;
      if (!page) {
        return this;
      }
      if (options != null) {
        if (typeof options === "boolean") {
          deleted = options;
        } else {
          deleted = options.deleted;
          pageNo = options.pageNo;
          if (!pageNo && options.currentPage) {
            pageNo = this.pageNo;
          }
        }
      }
      if (pageNo > 1) {
        page = this._findPage(pageNo);
        if (!page) {
          return this;
        }
      }
      next = page._first;
      i = 0;
      while (page) {
        if (next) {
          if (deleted || next.state !== _Entity.STATE_DELETED) {
            if (fn.call(this, next, i++) === false) {
              break;
            }
          }
          next = next._next;
        } else if (!pageNo) {
          page = page._next;
          next = page != null ? page._first : void 0;
        }
      }
      return this;
    };

    EntityList.prototype.getPath = getEntityPath;

    EntityList.prototype.toJSON = function(options) {
      var array, deleted, next, page;
      deleted = options != null ? options.deleted : void 0;
      array = [];
      page = this._first;
      if (page) {
        next = page._first;
        while (page) {
          if (next) {
            if (deleted || next.state !== _Entity.STATE_DELETED) {
              array.push(next.toJSON(options));
            }
            next = next._next;
          } else {
            page = page._next;
            next = page != null ? page._first : void 0;
          }
        }
      }
      return array;
    };

    EntityList.prototype.toArray = function() {
      var array, next, page;
      array = [];
      page = this._first;
      if (page) {
        next = page._first;
        while (page) {
          if (next) {
            if (next.state !== _Entity.STATE_DELETED) {
              array.push(next);
            }
            next = next._next;
          } else {
            page = page._next;
            next = page != null ? page._first : void 0;
          }
        }
      }
      return array;
    };

    return EntityList;

  })(LinkedList);

  _Entity = cola.Entity;

  _EntityList = cola.EntityList;

  _Entity._evalDataPath = _evalDataPath = function(data, path, noEntityList, loadMode, callback, context) {
    var i, isLast, l, lastIndex, len1, part, parts, returnCurrent;
    if (path) {
      parts = path.split(".");
      lastIndex = parts.length - 1;
      for (i = l = 0, len1 = parts.length; l < len1; i = ++l) {
        part = parts[i];
        returnCurrent = false;
        if (i === 0 && data instanceof _EntityList) {
          if (part === "#") {
            data = data.current;
          } else {
            data = data[part];
          }
        } else {
          isLast = i === lastIndex;
          if (!noEntityList) {
            if (!isLast) {
              returnCurrent = true;
            }
            if (part.charCodeAt(part.length - 1) === 35) {
              returnCurrent = true;
              part = part.substring(0, part.length - 1);
            }
          }
          if (data instanceof _Entity) {
            if (typeof data._get === "function") {
              data = data._get(part, loadMode, callback, context);
            } else {

            }
            if (data && data instanceof _EntityList) {
              if (noEntityList || returnCurrent) {
                data = data.current;
              }
            }
          } else {
            data = data[part];
          }
        }
        if (data == null) {
          break;
        }
      }
    }
    return data;
  };

  _Entity._setValue = _setValue = function(entity, path, value, context) {
    var i, part1, part2;
    i = path.lastIndexOf(".");
    if (i > 0) {
      part1 = path.substring(0, i);
      part2 = path.substring(i + 1);
      entity = _evalDataPath(entity, part1, true, "never", context);
      if ((entity != null) && !(entity instanceof _EntityList)) {
        if (entity instanceof cola.AjaxServiceInvoker) {
          entity = void 0;
        } else if (typeof entity._set === "function") {
          entity._set(part2, value);
        } else {
          entity[part2] = value;
        }
      } else {
        throw new cola.Exception("Cannot set value to EntityList \"" + path + "\".");
      }
    } else if (typeof entity._set === "function") {
      entity._set(path, value);
    } else {
      entity[path] = value;
    }
  };

  _Entity._getEntityId = function(entity) {
    if (!entity) {
      return null;
    }
    if (entity instanceof cola.Entity) {
      return entity.id;
    } else if (typeof entity === "object") {
      if (entity._id == null) {
        entity._id = cola.uniqueId();
      }
      return entity._id;
    }
  };

  VALIDATION_NONE = "none";

  VALIDATION_INFO = "info";

  VALIDATION_WARN = "warning";

  VALIDATION_ERROR = "error";

  TYPE_SEVERITY = {
    VALIDATION_INFO: 1,
    VALIDATION_WARN: 2,
    VALIDATION_ERROR: 4
  };

  cola.Entity.MessageHolder = (function() {
    function MessageHolder() {
      this.keyMessage = {};
      this.propertyMessages = {};
    }

    MessageHolder.prototype.compare = function(message1, message2) {
      return (TYPE_SEVERITY[message1.type] || 0) - (TYPE_SEVERITY[message2.type] || 0);
    };

    MessageHolder.prototype.add = function(prop, message) {
      var isTopKey, keyMessage, messages, topKeyChanged;
      messages = this.propertyMessages[prop];
      if (!messages) {
        this.propertyMessages[prop] = [message];
      } else {
        messages.push(message);
      }
      isTopKey = prop === "$";
      if (keyMessage) {
        if (this.compare(message, keyMessage) > 0) {
          this.keyMessage[prop] = message;
          topKeyChanged = isTopKey;
        }
      } else {
        this.keyMessage[prop] = message;
        topKeyChanged = isTopKey;
      }
      if (!topKeyChanged && !isTopKey) {
        keyMessage = this.keyMessage["$"];
        if (keyMessage) {
          if (this.compare(message, keyMessage) > 0) {
            this.keyMessage["$"] = message;
            topKeyChanged = true;
          }
        } else {
          this.keyMessage["$"] = message;
          topKeyChanged = true;
        }
      }
      return topKeyChanged;
    };

    MessageHolder.prototype.clear = function(prop) {
      var keyMessage, l, len1, message, messages, p, ref, topKeyChanged;
      if (prop) {
        delete this.propertyMessages[prop];
        delete this.keyMessage[prop];
        ref = this.propertyMessages;
        for (p in ref) {
          messages = ref[p];
          for (l = 0, len1 = messages.length; l < len1; l++) {
            message = messages[l];
            if (!keyMessage) {
              keyMessage = message;
            } else if (this.compare(message, keyMessage) > 0) {
              keyMessage = message;
            } else {
              continue;
            }
            if (keyMessage.type === VALIDATION_ERROR) {
              break;
            }
          }
        }
        topKeyChanged = this.keyMessage["$"] !== keyMessage;
        if (topKeyChanged) {
          this.keyMessage["$"] = keyMessage;
        }
      } else {
        topKeyChanged = true;
        this.keyMessage = {};
        this.propertyMessages = {};
      }
      return topKeyChanged;
    };

    MessageHolder.prototype.getMessages = function(prop) {
      if (prop == null) {
        prop = "$";
      }
      return this.propertyMessages[prop];
    };

    MessageHolder.prototype.getKeyMessage = function(prop) {
      if (prop == null) {
        prop = "$";
      }
      return this.keyMessage[prop];
    };

    MessageHolder.prototype.findMessages = function(prop, type) {
      var l, len1, len2, m, messages, ms, o, p, ref;
      if (prop) {
        ms = this.propertyMessages[prop];
        if (type) {
          messages = [];
          for (l = 0, len1 = ms.length; l < len1; l++) {
            m = ms[l];
            if (m.type === type) {
              messages.push(m);
            }
          }
        } else {
          messages = ms;
        }
      } else {
        messages = [];
        ref = this.propertyMessages;
        for (p in ref) {
          ms = ref[p];
          for (o = 0, len2 = ms.length; o < len2; o++) {
            m = ms[o];
            if (!type || m.type === type) {
              messages.push(m);
            }
          }
        }
      }
      return messages;
    };

    return MessageHolder;

  })();


  /*
  Functions
   */

  cola.each = function(collection, fn) {
    if (collection instanceof cola.EntityList) {
      collection.each(fn);
    } else if (collection instanceof Array) {
      if (typeof collection.each === "function") {
        collection.each(fn);
      } else {
        collection.forEach(fn);
      }
    }
  };


  /*
  Model and Scope
   */

  _RESERVE_NAMES = {
    self: null,
    arg: null
  };

  cola.model = function(name, model) {
    if (arguments.length === 2) {
      if (model) {
        if (cola.model[name]) {
          throw new cola.Exception("Duplicated model name \"" + name + "\".");
        }
        cola.model[name] = model;
      } else {
        model = cola.removeModel(name);
      }
      return model;
    } else {
      return cola.model[name];
    }
  };

  cola.model.defaultActions = {};

  cola.removeModel = function(name) {
    var model;
    model = cola.model[name];
    delete cola.model[name];
    return model;
  };

  cola.AbstractModel = (function() {
    function AbstractModel() {}

    AbstractModel.prototype.get = function(path, loadMode, context) {
      return this.data.get(path, loadMode, context);
    };

    AbstractModel.prototype.set = function(path, data, context) {
      this.data.set(path, data, context);
      return this;
    };

    AbstractModel.prototype.describe = function(property, config) {
      return this.data.describe(property, config);
    };

    AbstractModel.prototype.dataType = function(name) {
      var dataType, l, len1;
      if (typeof name === "string") {
        dataType = this.data.getDefinition(name);
        if (dataType instanceof cola.DataType) {
          return dataType;
        } else {
          return null;
        }
      } else if (name) {
        if (name instanceof Array) {
          for (l = 0, len1 = name.length; l < len1; l++) {
            dataType = name[l];
            if (!(dataType instanceof cola.DataType)) {
              dataType = new cola.EntityDataType(dataType);
            }
            this.data.regDefinition(dataType);
          }
        } else {
          dataType = name;
          if (!(dataType instanceof cola.DataType)) {
            dataType = new cola.EntityDataType(dataType);
          }
          this.data.regDefinition(dataType);
        }
      }
    };

    AbstractModel.prototype.getDefinition = function(name) {
      return this.data.getDefinition(name);
    };

    AbstractModel.prototype.flush = function(name, loadMode) {
      this.data.flush(name, loadMode);
      return this;
    };

    AbstractModel.prototype.disableObservers = function() {
      this.data.disableObservers();
      return this;
    };

    AbstractModel.prototype.enableObservers = function() {
      this.data.enableObservers();
      return this;
    };

    return AbstractModel;

  })();

  cola.Model = (function(superClass) {
    extend(Model, superClass);

    function Model(name, parent) {
      var parentName;
      if (name instanceof cola.Model) {
        parent = name;
        name = void 0;
      }
      if (name) {
        this.name = name;
        cola.model(name, this);
      }
      if (parent && typeof parent === "string") {
        parentName = parent;
        parent = cola.model(parentName);
      }
      if (parent) {
        this.parent = parent;
      }
      this.data = new cola.DataModel(this);
      this.action = function(name, action) {
        var a, config, fn, n, scope, store;
        store = this.action;
        if (arguments.length === 1) {
          if (typeof name === "string") {
            scope = this;
            while (store) {
              fn = store[name];
              if (fn) {
                return fn.action || fn;
              }
              scope = scope.parent;
              if (!scope) {
                break;
              }
              store = scope.action;
            }
            fn = cola.model.defaultActions[name];
            if (fn) {
              return fn.action || fn;
            }
          } else if (name && typeof name === "object") {
            config = name;
            for (n in config) {
              a = config[n];
              this.action(n, a);
            }
          }
          return null;
        } else {
          if (action) {
            store[name] = action;
          } else {
            delete store[name];
          }
          return this;
        }
      };
    }

    Model.prototype.destroy = function() {
      var base;
      if (this.name) {
        cola.removeModel(this.name);
      }
      if (typeof (base = this.data).destroy === "function") {
        base.destroy();
      }
    };

    return Model;

  })(cola.AbstractModel);

  cola.SubScope = (function(superClass) {
    extend(SubScope, superClass);

    function SubScope() {
      return SubScope.__super__.constructor.apply(this, arguments);
    }

    SubScope.prototype.watchPath = function(path) {
      var l, len1, p, parent, paths;
      if (this._watchAllMessages || this._watchPath === path) {
        return;
      }
      this._unwatchPath();
      if (path) {
        this._watchPath = paths = [];
        parent = this.parent;
        if (path instanceof Array) {
          for (l = 0, len1 = path.length; l < len1; l++) {
            p = path[l];
            p = p + ".**";
            paths.push(p);
            if (parent != null) {
              parent.data.bind(p, this);
            }
          }
        } else {
          path = path + ".**";
          paths.push(path);
          if (parent != null) {
            parent.data.bind(path, this);
          }
        }
      } else {
        delete this._watchPath;
      }
    };

    SubScope.prototype._unwatchPath = function() {
      var l, len1, p, parent, path;
      if (!this._watchPath) {
        return;
      }
      path = this._watchPath;
      delete this._watchPath;
      parent = this.parent;
      if (parent) {
        if (path instanceof Array) {
          for (l = 0, len1 = path.length; l < len1; l++) {
            p = path[l];
            parent.data.unbind(p, this);
          }
        } else {
          parent.data.unbind(path, this);
        }
      }
    };

    SubScope.prototype.watchAllMessages = function() {
      var parent;
      if (this._watchAllMessages) {
        return;
      }
      this._watchAllMessages = true;
      this._unwatchPath();
      parent = this.parent;
      if (parent) {
        parent.data.bind("**", this);
        if (typeof parent.watchAllMessages === "function") {
          parent.watchAllMessages();
        }
      }
    };

    SubScope.prototype.destroy = function() {
      if (this.parent) {
        if (this._watchAllMessages) {
          this.parent.data.unbind("**", this);
        } else if (this._watchPath) {
          this._unwatchPath();
        }
      }
    };

    return SubScope;

  })(cola.AbstractModel);

  cola.AliasScope = (function(superClass) {
    extend(AliasScope, superClass);

    function AliasScope(parent1, expression) {
      var dataType;
      this.parent = parent1;
      if (expression && typeof expression.path === "string" && !expression.hasCallStatement && !expression.convertors) {
        dataType = this.parent.data.getDataType(expression.path);
      }
      this.data = new cola.AliasDataModel(this, expression.alias, dataType);
      this.action = this.parent.action;
      this.expression = expression;
      if (!expression.path && expression.hasCallStatement) {
        this.watchAllMessages();
      } else {
        this.watchPath(expression.path);
      }
    }

    AliasScope.prototype.destroy = function() {
      AliasScope.__super__.destroy.call(this);
      this.data.destroy();
    };

    AliasScope.prototype.repeatNotification = true;

    AliasScope.prototype._processMessage = function(bindingPath, path, type, arg) {
      if (this.messageTimestamp >= arg.timestamp) {
        return;
      }
      this.data._processMessage(bindingPath, path, type, arg);
    };

    return AliasScope;

  })(cola.SubScope);

  cola.ItemScope = (function(superClass) {
    extend(ItemScope, superClass);

    function ItemScope(parent1, alias) {
      var ref;
      this.parent = parent1;
      this.data = new cola.AliasDataModel(this, alias, (ref = this.parent) != null ? ref.dataType : void 0);
      this.action = this.parent.action;
    }

    ItemScope.prototype.watchPath = function() {};

    ItemScope.prototype.watchAllMessages = function() {
      var ref;
      if ((ref = this.parent) != null) {
        if (typeof ref.watchAllMessages === "function") {
          ref.watchAllMessages();
        }
      }
    };

    ItemScope.prototype._processMessage = function(bindingPath, path, type, arg) {
      return this.data._processMessage(bindingPath, path, type, arg);
    };

    return ItemScope;

  })(cola.SubScope);

  cola.ItemsScope = (function(superClass) {
    extend(ItemsScope, superClass);

    function ItemsScope(parent, expression) {
      this.setParent(parent);
      this.setExpression(expression);
    }

    ItemsScope.prototype.setParent = function(parent) {
      if (this.parent) {
        if (this._watchAllMessages) {
          this.parent.data.unbind("**", this);
        } else if (this._watchPath) {
          this._unwatchPath();
        }
      }
      this.parent = parent;
      this.data = parent.data;
      this.action = parent.action;
      if (this._watchAllMessages) {
        parent.data.bind("**", this);
      } else if (this._watchPath) {
        this.watchPath(this._watchPath);
      }
    };

    ItemsScope.prototype.setExpression = function(expression) {
      var l, len1, path, paths, ref;
      this.expression = expression;
      if (expression) {
        this.alias = expression.alias;
        if (typeof expression.path === "string") {
          this.expressionPath = [expression.path.split(".")];
        } else if (expression.path instanceof Array) {
          paths = [];
          ref = expression.path;
          for (l = 0, len1 = ref.length; l < len1; l++) {
            path = ref[l];
            paths.push(path.split("."));
          }
          this.expressionPath = paths;
        }
        if (!expression.path && expression.hasCallStatement) {
          this.watchAllMessages();
        } else {
          this.watchPath(expression.path);
        }
      } else {
        this.alias = "item";
        this.expressionPath = [];
      }
      if (expression && typeof expression.path === "string" && !expression.hasCallStatement && !expression.convertors) {
        this.dataType = this.parent.data.getDataType(expression.path);
      }
    };

    ItemsScope.prototype.setItems = function() {
      var items, originItems;
      items = arguments[0], originItems = 2 <= arguments.length ? slice.call(arguments, 1) : [];
      this._setItems.apply(this, [items].concat(slice.call(originItems)));
    };

    ItemsScope.prototype.retrieveItems = function(dataCtx) {
      var items;
      if (dataCtx == null) {
        dataCtx = {};
      }
      if (this._retrieveItems) {
        return this._retrieveItems(dataCtx);
      }
      if (this.expression) {
        items = this.expression.evaluate(this.parent, "async", dataCtx);
        this._setItems(items, dataCtx.originData);
      }
    };

    ItemsScope.prototype._setItems = function() {
      var it, items, l, len1, originItems, targetPath;
      items = arguments[0], originItems = 2 <= arguments.length ? slice.call(arguments, 1) : [];
      this.items = items;
      if (originItems && originItems.length === 1) {
        this.originItems = originItems[0];
      } else {
        this.originItems = originItems;
        this.originItems._multiItems = true;
      }
      targetPath = null;
      if (originItems) {
        for (l = 0, len1 = originItems.length; l < len1; l++) {
          it = originItems[l];
          if (it && it instanceof cola.EntityList) {
            if (targetPath == null) {
              targetPath = [];
            }
            targetPath.push(it.getPath());
          }
        }
      }
      if (targetPath) {
        this.targetPath = targetPath.concat(this.expressionPath);
      } else {
        this.targetPath = this.expressionPath;
      }
    };

    ItemsScope.prototype.refreshItems = function(dataCtx) {
      this.retrieveItems(dataCtx);
      if (typeof this.onItemsRefresh === "function") {
        this.onItemsRefresh();
      }
    };

    ItemsScope.prototype.refreshItem = function(arg) {
      arg.itemsScope = this;
      if (typeof this.onItemRefresh === "function") {
        this.onItemRefresh(arg);
      }
    };

    ItemsScope.prototype.insertItem = function(arg) {
      arg.itemsScope = this;
      if (typeof this.onItemInsert === "function") {
        this.onItemInsert(arg);
      }
    };

    ItemsScope.prototype.removeItem = function(arg) {
      arg.itemsScope = this;
      if (typeof this.onItemRemove === "function") {
        this.onItemRemove(arg);
      }
    };

    ItemsScope.prototype.changeCurrentItem = function(arg) {
      arg.itemsScope = this;
      if (typeof this.onCurrentItemChange === "function") {
        this.onCurrentItemChange(arg);
      }
    };

    ItemsScope.prototype.resetItemScopeMap = function() {
      this.itemScopeMap = {};
    };

    ItemsScope.prototype.getItemScope = function(item) {
      var itemId;
      itemId = cola.Entity._getEntityId(item);
      return this.itemScopeMap[itemId];
    };

    ItemsScope.prototype.regItemScope = function(itemId, itemScope) {
      this.itemScopeMap[itemId] = itemScope;
    };

    ItemsScope.prototype.unregItemScope = function(itemId) {
      delete this.itemScopeMap[itemId];
    };

    ItemsScope.prototype.findItemDomBinding = function(item) {
      var itemId, itemScopeMap, items, l, len1, matched, multiOriginItems, oi, originItems;
      itemScopeMap = this.itemScopeMap;
      items = this.items;
      originItems = this.originItems;
      multiOriginItems = originItems != null ? originItems._multiItems : void 0;
      if (items || originItems) {
        while (item) {
          if (item instanceof cola.Entity) {
            matched = item._parent === items;
            if (!matched && originItems) {
              if (multiOriginItems) {
                for (l = 0, len1 = originItems.length; l < len1; l++) {
                  oi = originItems[l];
                  if (item._parent === oi) {
                    matched = true;
                    break;
                  }
                }
              } else {
                matched = item._parent === originItems;
              }
            }
            if (matched) {
              itemId = cola.Entity._getEntityId(item);
              if (itemId) {
                return itemScopeMap[itemId];
              } else {
                return null;
              }
            }
          }
          item = item._parent;
        }
      }
      return null;
    };

    ItemsScope.prototype.isRootOfTarget = function(changedPath, targetPath) {
      var i, isRoot, l, len1, len2, len3, o, part, q, targetPaths;
      if (!targetPath) {
        return false;
      }
      if (!changedPath) {
        return true;
      }
      if (targetPath instanceof Array) {
        targetPaths = targetPath;
        for (l = 0, len1 = targetPaths.length; l < len1; l++) {
          targetPath = targetPaths[l];
          isRoot = true;
          for (i = o = 0, len2 = changedPath.length; o < len2; i = ++o) {
            part = changedPath[i];
            if (part !== targetPath[i]) {
              isRoot = false;
              break;
            }
          }
          if (isRoot) {
            return true;
          }
        }
        return false;
      } else {
        for (i = q = 0, len3 = changedPath.length; q < len3; i = ++q) {
          part = changedPath[i];
          if (part !== targetPath[i]) {
            return false;
          }
        }
        return true;
      }
    };

    ItemsScope.prototype.repeatNotification = true;

    ItemsScope.prototype._processMessage = function(bindingPath, path, type, arg) {
      var allProcessed, id, itemScope, ref;
      if (this.messageTimestamp >= arg.timestamp) {
        return;
      }
      allProcessed = this.processItemsMessage(bindingPath, path, type, arg);
      if (allProcessed) {
        this.messageTimestamp = arg.timestamp;
      } else if (this.itemScopeMap) {
        itemScope = this.findItemDomBinding(arg.entity || arg.entityList);
        if (itemScope) {
          itemScope._processMessage(bindingPath, path, type, arg);
        } else {
          ref = this.itemScopeMap;
          for (id in ref) {
            itemScope = ref[id];
            itemScope._processMessage(bindingPath, path, type, arg);
          }
        }
      }
    };

    ItemsScope.prototype.isOriginItems = function(items) {
      var l, len1, originItems, ref;
      if (!this.originItems) {
        return false;
      }
      if (this.originItems === items) {
        return true;
      }
      if (this.originItems instanceof Array && this.originItems._multiItems) {
        ref = this.originItems;
        for (l = 0, len1 = ref.length; l < len1; l++) {
          originItems = ref[l];
          if (originItems === items) {
            return true;
          }
        }
      }
      return false;
    };

    ItemsScope.prototype.processItemsMessage = function(bindingPath, path, type, arg) {
      var allProcessed, i, items, parent, ref, targetPath;
      targetPath = this.targetPath ? this.targetPath.concat(this.expressionPath) : this.expressionPath;
      if (type === cola.constants.MESSAGE_REFRESH) {
        if (this.isRootOfTarget(path, targetPath)) {
          this.refreshItems();
          allProcessed = true;
        }
      } else if (type === cola.constants.MESSAGE_DATA_CHANGE) {
        if (this.isRootOfTarget(path, targetPath)) {
          this.refreshItems();
          allProcessed = true;
        } else {
          parent = (ref = arg.entity) != null ? ref._parent : void 0;
          if (parent === this.items || this.isOriginItems(arg.parent)) {
            this.refreshItem(arg);
          }
        }
      } else if (type === cola.constants.MESSAGE_CURRENT_CHANGE) {
        if (arg.entityList === this.items || this.isOriginItems(arg.entityList)) {
          if (typeof this.onCurrentItemChange === "function") {
            this.onCurrentItemChange(arg);
          }
        } else if (this.isRootOfTarget(path, targetPath)) {
          this.refreshItems();
          allProcessed = true;
        }
      } else if (type === cola.constants.MESSAGE_INSERT) {
        if (arg.entityList === this.items) {
          this.insertItem(arg);
          allProcessed = true;
        } else if (this.isOriginItems(arg.entityList)) {
          this.retrieveItems();
          this.insertItem(arg);
          allProcessed = true;
        }
      } else if (type === cola.constants.MESSAGE_REMOVE) {
        if (arg.entityList === this.items) {
          this.removeItem(arg);
          allProcessed = true;
        } else if (this.isOriginItems(arg.entityList)) {
          items = this.items;
          if (items instanceof Array) {
            i = items.indexOf(arg.entity);
            if (i > -1) {
              items.splice(i, 1);
            }
          }
          this.removeItem(arg);
          allProcessed = true;
        }
      }
      return allProcessed;
    };

    return ItemsScope;

  })(cola.SubScope);


  /*
  DataModel
   */

  cola.AbstractDataModel = (function() {
    function AbstractDataModel(model1) {
      this.model = model1;
      this.disableObserverCount = 0;
    }

    AbstractDataModel.prototype.get = function(path, loadMode, context) {
      var aliasData, aliasHolder, callback, firstPart, i, prop, ref, ref1, rootData;
      if (!path) {
        return this._getRootData() || ((ref = this.model.parent) != null ? ref.get() : void 0);
      }
      if (this._aliasMap) {
        i = path.indexOf('.');
        firstPart = i > 0 ? path.substring(0, i) : path;
        aliasHolder = this._aliasMap[firstPart];
        if (aliasHolder) {
          aliasData = aliasHolder.data;
          if (i > 0) {
            if (typeof loadMode === "function") {
              loadMode = "async";
              callback = loadMode;
            }
            return cola.Entity._evalDataPath(aliasData, path.substring(i + 1), false, loadMode, callback, context);
          } else {
            return aliasData;
          }
        }
      }
      rootData = this._rootData;
      if (rootData != null) {
        if (this.model.parent) {
          i = path.indexOf('.');
          if (i > 0) {
            prop = path.substring(0, i);
          } else {
            prop = path;
          }
          if (rootData.hasValue(prop)) {
            return rootData.get(path, loadMode, context);
          } else {
            return this.model.parent.data.get(path, loadMode, context);
          }
        } else {
          return rootData.get(path, loadMode, context);
        }
      } else {
        return (ref1 = this.model.parent) != null ? ref1.data.get(path, loadMode, context) : void 0;
      }
    };

    AbstractDataModel.prototype.set = function(path, data, context) {
      var aliasHolder, firstPart, i, p, rootData;
      if (path) {
        rootData = this._getRootData();
        if (typeof path === "string") {
          i = path.indexOf('.');
          if (i > 0) {
            firstPart = path.substring(0, i);
            if (this._aliasMap) {
              aliasHolder = this._aliasMap[firstPart];
              if (aliasHolder) {
                if (aliasHolder.data) {
                  cola.Entity._setValue(aliasHolder.data, path.substring(i + 1), data, context);
                } else {
                  throw new cola.Exception("Cannot set value to \"" + path + "\"");
                }
                return this;
              }
            }
            if (this.model.parent) {
              if (rootData.hasValue(firstPart)) {
                rootData.set(path, data, context);
              } else {
                this.model.parent.data.set(path, data, context);
              }
            } else {
              rootData.set(path, data, context);
            }
          } else {
            this._set(path, data, context);
          }
        } else {
          data = path;
          for (p in data) {
            this.set(p, data[p], context);
          }
        }
      }
      return this;
    };

    AbstractDataModel.prototype._set = function(prop, data, context) {
      var aliasHolder, dataModel, hasValue, oldAliasData, oldAliasHolder, path, property, provider, ref, rootData, rootDataType;
      rootData = this._rootData;
      hasValue = rootData.hasValue(prop);
      if ((ref = this._aliasMap) != null ? ref[prop] : void 0) {
        oldAliasHolder = this._aliasMap[prop];
        if (oldAliasHolder.data !== data) {
          oldAliasData = oldAliasHolder.data;
          delete this._aliasMap[prop];
          this.unbind(oldAliasHolder.bindingPath, oldAliasHolder);
        }
      }
      if (data != null) {
        if (data.$provider || data.$dataType) {
          if (data.$provider) {
            provider = new cola.Provider(data.$provider);
          }
          rootDataType = rootData.dataType;
          property = rootDataType.getProperty(prop);
          if (property == null) {
            property = rootDataType.addProperty({
              property: prop
            });
          }
          if (provider) {
            property.set("provider", provider);
          }
          if (data.$dataType) {
            property.set("dataType", data.$dataType);
          }
        }
      }
      if (!provider || hasValue) {
        if (data && (data instanceof cola.Entity || data instanceof cola.EntityList) && data._parent && data !== rootData._data[prop]) {
          if (this._aliasMap == null) {
            this._aliasMap = {};
          }
          path = data.getPath("always");
          dataModel = this;
          this._aliasMap[prop] = aliasHolder = {
            data: data,
            path: path,
            bindingPath: path.slice(0).concat("**"),
            _processMessage: function(bindingPath, path, type, arg) {
              var relativePath;
              relativePath = path.slice(this.path.length);
              dataModel._onDataMessage([prop].concat(relativePath), type, arg);
            }
          };
          this.bind(aliasHolder.bindingPath, aliasHolder);
          this._onDataMessage([prop], cola.constants.MESSAGE_DATA_CHANGE, {
            entity: rootData,
            property: prop,
            oldValue: oldAliasData,
            value: data
          });
        } else {
          rootData.set(prop, data, context);
        }
      }
    };

    AbstractDataModel.prototype.flush = function(name, loadMode) {
      var ref;
      if ((ref = this._rootData) != null) {
        ref.flush(name, loadMode);
      }
      return this;
    };

    AbstractDataModel.prototype.bind = function(path, processor) {
      if (!this.bindingRegistry) {
        this.bindingRegistry = {
          __path: "",
          __processorMap: {}
        };
      }
      if (typeof path === "string") {
        path = path.split(".");
      }
      if (path) {
        if (this._bind(path, processor, false)) {
          this._bind(path, processor, true);
        }
      }
      return this;
    };

    AbstractDataModel.prototype._bind = function(path, processor, nonCurrent) {
      var hasNonCurrent, l, len1, node, nodePath, part, subNode;
      node = this.bindingRegistry;
      if (path) {
        for (l = 0, len1 = path.length; l < len1; l++) {
          part = path[l];
          if (!nonCurrent && part.charCodeAt(0) === 33) {
            hasNonCurrent = true;
            part = part.substring(1);
          }
          subNode = node[part];
          if (subNode == null) {
            nodePath = !node.__path ? part : node.__path + "." + part;
            node[part] = subNode = {
              __path: nodePath,
              __processorMap: {}
            };
          }
          node = subNode;
        }
        if (processor.id == null) {
          processor.id = cola.uniqueId();
        }
        node.__processorMap[processor.id] = processor;
      }
      return hasNonCurrent;
    };

    AbstractDataModel.prototype.unbind = function(path, processor) {
      if (!this.bindingRegistry) {
        return;
      }
      if (typeof path === "string") {
        path = path.split(".");
      }
      if (path) {
        if (this._unbind(path, processor, false)) {
          this._unbind(path, processor, true);
        }
      }
      return this;
    };

    AbstractDataModel.prototype._unbind = function(path, processor, nonCurrent) {
      var hasNonCurrent, l, len1, node, part;
      node = this.bindingRegistry;
      for (l = 0, len1 = path.length; l < len1; l++) {
        part = path[l];
        if (!nonCurrent && part.charCodeAt(0) === 33) {
          hasNonCurrent = true;
          part = part.substring(1);
        }
        node = node[part];
        if (node == null) {
          break;
        }
      }
      if (node != null) {
        delete node.__processorMap[processor.id];
      }
      return hasNonCurrent;
    };

    AbstractDataModel.prototype.disableObservers = function() {
      if (this.disableObserverCount < 0) {
        this.disableObserverCount = 1;
      } else {
        this.disableObserverCount++;
      }
      return this;
    };

    AbstractDataModel.prototype.enableObservers = function() {
      if (this.disableObserverCount < 1) {
        this.disableObserverCount = 0;
      } else {
        this.disableObserverCount--;
      }
      return this;
    };

    AbstractDataModel.prototype.isObserversDisabled = function() {
      return this.disableObserverCount > 0;
    };

    AbstractDataModel.prototype._onDataMessage = function(path, type, arg) {
      var anyChildNode, anyPropNode, i, l, lastIndex, len1, node, oldScope, part;
      if (arg == null) {
        arg = {};
      }
      if (!this.bindingRegistry) {
        return;
      }
      if (this.isObserversDisabled()) {
        return;
      }
      oldScope = cola.currentScope;
      cola.currentScope = this;
      try {
        if (!arg.timestamp) {
          arg.timestamp = cola.sequenceNo();
        }
        if (path) {
          node = this.bindingRegistry;
          lastIndex = path.length - 1;
          for (i = l = 0, len1 = path.length; l < len1; i = ++l) {
            part = path[i];
            if (i === lastIndex) {
              anyPropNode = node["*"];
            }
            if (anyPropNode) {
              this._processDataMessage(anyPropNode, path, type, arg);
            }
            anyChildNode = node["**"];
            if (anyChildNode) {
              this._processDataMessage(anyChildNode, path, type, arg);
            }
            node = node[part];
            if (!node) {
              break;
            }
          }
        } else {
          node = this.bindingRegistry;
          anyPropNode = node["*"];
          if (anyPropNode) {
            this._processDataMessage(anyPropNode, null, type, arg);
          }
          anyChildNode = node["**"];
          if (anyChildNode) {
            this._processDataMessage(anyChildNode, null, type, arg);
          }
        }
        if (node) {
          this._processDataMessage(node, path, type, arg, true);
        }
      } finally {
        cola.currentScope = oldScope;
      }
    };

    AbstractDataModel.prototype._processDataMessage = function(node, path, type, arg, notifyChildren) {
      var id, notifyChildren2, part, processor, processorMap, subNode;
      processorMap = node.__processorMap;
      for (id in processorMap) {
        processor = processorMap[id];
        if (!processor.disabled && (!(processor.timestamp >= arg.timestamp) || processor.repeatNotification)) {
          processor.timestamp = arg.timestamp;
          processor._processMessage(node.__path, path, type, arg);
        }
      }
      if (notifyChildren) {
        notifyChildren2 = !((cola.constants.MESSAGE_EDITING_STATE_CHANGE <= type && type <= cola.constants.MESSAGE_VALIDATION_STATE_CHANGE)) && !((cola.constants.MESSAGE_LOADING_START <= type && type <= cola.constants.MESSAGE_LOADING_END));
        if (type === cola.constants.MESSAGE_CURRENT_CHANGE) {
          type = cola.constants.MESSAGE_REFRESH;
        }
        for (part in node) {
          subNode = node[part];
          if (subNode && (part === "**" || notifyChildren2) && part !== "__processorMap" && part !== "__path") {
            this._processDataMessage(subNode, path, type, arg, true);
          }
        }
      }
    };

    return AbstractDataModel;

  })();

  cola.DataModel = (function(superClass) {
    extend(DataModel, superClass);

    function DataModel() {
      return DataModel.__super__.constructor.apply(this, arguments);
    }

    DataModel.prototype._getRootData = function() {
      var dataModel, rootData;
      if (this._rootData == null) {
        if (this._rootDataType == null) {
          this._rootDataType = new cola.EntityDataType();
        }
        this._rootData = rootData = new cola.Entity(this._rootDataType);
        rootData.state = cola.Entity.STATE_NEW;
        dataModel = this;
        rootData._setListener({
          onMessage: function(path, type, arg) {
            return dataModel._onDataMessage(path, type, arg);
          }
        });
      }
      return this._rootData;
    };

    DataModel.prototype.describe = function(property, config) {
      var dataType, propertyConfig, propertyDef, propertyName, ref;
      this._getRootData();
      if (typeof property === "string") {
        propertyDef = (ref = this._rootDataType) != null ? ref.getProperty(property) : void 0;
        if (config) {
          if (!propertyDef) {
            propertyDef = this._rootDataType.addProperty({
              property: property
            });
          }
          if (typeof config === "string") {
            dataType = this.getDefinition(config);
            if (!dataType) {
              throw new cola.Exception("Unrecognized DataType \"" + config + "\".");
            }
            propertyDef.set("dataType", dataType);
          } else {
            propertyDef.set(config);
          }
        }
      } else if (property) {
        config = property;
        for (propertyName in config) {
          propertyConfig = config[propertyName];
          this.describe(propertyName, propertyConfig);
        }
      }
    };

    DataModel.prototype.getProperty = function(path) {
      var ref;
      return (ref = this._rootDataType) != null ? ref.getProperty(path) : void 0;
    };

    DataModel.prototype.getDataType = function(path) {
      var dataType, property;
      property = this.getProperty(path);
      dataType = property != null ? property.get("dataType") : void 0;
      return dataType;
    };

    DataModel.prototype.getDefinition = function(name) {
      var definition, ref;
      definition = (ref = this._definitionStore) != null ? ref[name] : void 0;
      if (definition == null) {
        definition = cola.DataType.defaultDataTypes[name];
      }
      return definition;
    };

    DataModel.prototype.regDefinition = function(definition) {
      var name, store;
      name = definition._name;
      if (!name) {
        throw new cola.Exception("Attribute \"name\" cannot be emtpy.");
      }
      if (definition._scope && definition._scope !== this.model) {
        throw new cola.Exception("DataType(" + definition._name + ") is already belongs to anthor Model.");
      }
      store = this._definitionStore;
      if (store == null) {
        this._definitionStore = store = {};
      } else if (store[name]) {
        throw new cola.Exception("Duplicated Definition name \"" + name + "\".");
      }
      store[name] = definition;
      return this;
    };

    DataModel.prototype.unregDefinition = function(name) {
      var definition;
      if (this._definitionStore) {
        definition = this._definitionStore[name];
        delete this._definitionStore[name];
      }
      return definition;
    };

    return DataModel;

  })(cola.AbstractDataModel);

  cola.AliasDataModel = (function(superClass) {
    extend(AliasDataModel, superClass);

    function AliasDataModel(model1, alias1, dataType1) {
      var parentModel;
      this.model = model1;
      this.alias = alias1;
      this.dataType = dataType1;
      parentModel = this.model.parent;
      while (parentModel) {
        if (parentModel.data) {
          this.parent = parentModel.data;
          break;
        }
        parentModel = parentModel.parent;
      }
    }

    AliasDataModel.prototype.getTargetData = function() {
      return this._targetData;
    };

    AliasDataModel.prototype.setTargetData = function(data, silence) {
      var oldData;
      oldData = this._targetData;
      if (oldData === data) {
        return;
      }
      this._targetData = data;
      if (data && (data instanceof cola.Entity || data instanceof cola.EntityList)) {
        this._targetPath = data.getPath();
      }
      if (!silence) {
        this._onDataMessage([this.alias], cola.constants.MESSAGE_DATA_CHANGE, {
          entity: null,
          property: this.alias,
          value: data,
          oldValue: oldData
        });
      }
    };

    AliasDataModel.prototype.describe = function(property, config) {
      if (property === this.alias) {
        return AliasDataModel.__super__.describe.call(this, property, config);
      } else {
        return this.parent.describe(property, config);
      }
    };

    AliasDataModel.prototype.getDataType = function(path) {
      var dataType, i, property, ref;
      i = path.indexOf(".");
      if (i > 0) {
        if (path.substring(0, i) === this.alias) {
          if (this._rootDataType) {
            property = (ref = this._rootDataType) != null ? ref.getProperty(path.substring(i + 1)) : void 0;
            dataType = property != null ? property.get("dataType") : void 0;
          }
          return dataType;
        } else {
          return this.parent.getDataType(path);
        }
      } else if (path === this.alias) {
        return this.dataType;
      } else {
        return this.parent.getDataType(path);
      }
    };

    AliasDataModel.prototype.getDefinition = function(name) {
      return this.parent.getDefinition(name);
    };

    AliasDataModel.prototype.regDefinition = function(definition) {
      return this.parent.regDefinition(definition);
    };

    AliasDataModel.prototype.unregDefinition = function(definition) {
      return this.parent.unregDefinition(definition);
    };

    AliasDataModel.prototype._bind = function(path, processor, nonCurrent) {
      var hasNonCurrent, i;
      hasNonCurrent = AliasDataModel.__super__._bind.call(this, path, processor, nonCurrent);
      i = path.indexOf(".");
      if (i > 0) {
        if (path.substring(0, i) !== this.alias) {
          this.model.watchAllMessages();
        }
      } else if (path !== this.alias) {
        this.model.watchAllMessages();
      }
      return hasNonCurrent;
    };

    AliasDataModel.prototype._processMessage = function(bindingPath, path, type, arg) {
      var i, l, len1, matching, part, relativePath, targetPart, targetPath;
      this._onDataMessage(path, type, arg);
      targetPath = this._targetPath;
      if (targetPath != null ? targetPath.length : void 0) {
        matching = true;
        for (i = l = 0, len1 = targetPath.length; l < len1; i = ++l) {
          targetPart = targetPath[i];
          part = path[i];
          if (part && part.charCodeAt(0) === 33) {
            part = part.substring(1);
          }
          if (part !== targetPart) {
            matching = false;
            break;
          }
        }
        if (matching) {
          relativePath = path.slice(targetPath.length);
          this._onDataMessage([this.alias].concat(relativePath), type, arg);
        }
      }
    };

    AliasDataModel.prototype.get = function(path, loadMode, context) {
      var alias, aliasLen, c, targetData;
      alias = this.alias;
      aliasLen = alias.length;
      if (path.substring(0, aliasLen) === alias) {
        c = path.charCodeAt(aliasLen);
        if (c === 46) {
          if (path.indexOf(".") > 0) {
            targetData = this._targetData;
            if (targetData instanceof cola.Entity) {
              return targetData.get(path.substring(aliasLen + 1), loadMode, context);
            } else if (targetData && typeof targetData === "object") {
              return targetData[path.substring(aliasLen + 1)];
            }
          }
        } else if (isNaN(c)) {
          return this._targetData;
        }
      }
      return this.parent.get(path, loadMode, context);
    };

    AliasDataModel.prototype.set = function(path, data, context) {
      var alias, aliasLen, c, ref;
      alias = this.alias;
      aliasLen = alias.length;
      if (path.substring(0, aliasLen) === alias) {
        c = path.charCodeAt(aliasLen);
        if (c === 46) {
          if (path.indexOf(".") > 0) {
            if ((ref = this._targetData) != null) {
              ref.set(path.substring(aliasLen + 1), data, context);
            }
            return this;
          }
        } else if (isNaN(c)) {
          this.setTargetData(data);
          return this;
        }
      }
      this.parent.set(path, data, context);
      return this;
    };

    AliasDataModel.prototype.dataType = function(path) {
      return this.parent.dataType(path);
    };

    AliasDataModel.prototype.regDefinition = function(name, definition) {
      this.parent.regDefinition(name, definition);
      return this;
    };

    AliasDataModel.prototype.unregDefinition = function(name) {
      return this.parent.unregDefinition(name);
    };

    AliasDataModel.prototype.flush = function(path, loadMode) {
      var alias, c, ref, ref1;
      alias = this.alias;
      if (path.substring(0, alias.length) === alias) {
        c = path.charCodeAt(1);
        if (c === 46) {
          if ((ref = this._targetData) != null) {
            ref.flush(path.substring(alias.length + 1), loadMode);
          }
          return this;
        } else if (isNaN(c)) {
          if ((ref1 = this._targetData) != null) {
            ref1.flush(loadMode);
          }
          return this;
        }
      }
      this.parent.flush(path, loadMode);
      return this;
    };

    AliasDataModel.prototype.disableObservers = function() {
      this.parent.disableObservers();
      return this;
    };

    AliasDataModel.prototype.enableObservers = function() {
      this.parent.enableObservers();
      return this;
    };

    AliasDataModel.prototype.isObserversDisabled = function() {
      return this.parent.isObserversDisabled();
    };

    return AliasDataModel;

  })(cola.AbstractDataModel);


  /*
  Root Model
   */

  new cola.Model(cola.constants.DEFAULT_PATH);


  /*
  Function
   */

  cola.data = function(config) {
    var dataType, k, name, provider, v;
    if (!config) {
      return config;
    }
    if (config.provider) {
      provider = config.provider;
    } else {
      provider = {};
      for (k in config) {
        v = config[k];
        if (k !== "dataType") {
          provider[k] = v;
        }
      }
    }
    dataType = config.dataType;
    if (dataType) {
      if (typeof dataType === "string") {
        name = dataType;
        dataType = cola.currentScope.dataType(name);
        if (!dataType) {
          throw new cola.Exception("Unrecognized DataType \"" + name + "\".");
        }
      } else if (!(dataType instanceof cola.DataType)) {
        dataType = new cola.EntityDataType(dataType);
      }
    }
    return {
      $dataType: dataType,
      $provider: provider
    };
  };


  /*
  Element binding
   */

  cola.ElementAttrBinding = (function() {
    function ElementAttrBinding(element1, attr1, expression1, scope) {
      var l, len1, p, path;
      this.element = element1;
      this.attr = attr1;
      this.expression = expression1;
      this.scope = scope;
      this.path = path = this.expression.path;
      if (!path && this.expression.hasCallStatement) {
        this.path = path = "**";
        this.watchingMoreMessage = this.expression.hasCallStatement || this.expression.convertors;
      }
      if (path) {
        if (typeof path === "string") {
          scope.data.bind(path, this);
        } else {
          for (l = 0, len1 = path.length; l < len1; l++) {
            p = path[l];
            scope.data.bind(p, this);
          }
        }
      }
    }

    ElementAttrBinding.prototype.destroy = function() {
      var l, len1, p, path, scope;
      path = this.path;
      if (path) {
        scope = this.scope;
        if (typeof path === "string") {
          scope.data.unbind(path, this);
        } else {
          for (l = 0, len1 = path.length; l < len1; l++) {
            p = path[l];
            this.scope.data.unbind(p, this);
          }
        }
      }
    };

    ElementAttrBinding.prototype._processMessage = function(bindingPath, path, type) {
      if ((cola.constants.MESSAGE_REFRESH <= type && type <= cola.constants.MESSAGE_CURRENT_CHANGE) || this.watchingMoreMessage) {
        this.refresh();
      }
    };

    ElementAttrBinding.prototype.evaluate = function(dataCtx) {
      if (dataCtx == null) {
        dataCtx = {};
      }
      return this.expression.evaluate(this.scope, "async", dataCtx);
    };

    ElementAttrBinding.prototype._refresh = function() {
      var element;
      value = this.evaluate(this.attr);
      element = this.element;
      element._duringBindingRefresh = true;
      try {
        element.set(this.attr, value);
      } finally {
        element._duringBindingRefresh = false;
      }
    };

    ElementAttrBinding.prototype.refresh = function() {
      if (!this._refresh) {
        return;
      }
      if (this.delay) {
        cola.util.delay(this, "refresh", 100, function() {
          this._refresh();
        });
      } else {
        this._refresh();
      }
    };

    return ElementAttrBinding;

  })();

  cola.model.defaultActions.not = function(value) {
    return !value;
  };

  cola.model.defaultActions.i18n = function() {
    var key, params;
    key = arguments[0], params = 2 <= arguments.length ? slice.call(arguments, 1) : [];
    return cola.i18n.apply(cola, [key].concat(slice.call(params)));
  };

  cola.submit = function(options, callback) {
    var data, filter, originalOptions, p, v;
    originalOptions = options;
    options = {};
    for (p in originalOptions) {
      v = originalOptions[p];
      options[p] = v;
    }
    data = options.data;
    if (data) {
      if (!(data instanceof cola.Entity || data instanceof cola.EntityList)) {
        throw new cola.Exception("Invalid submit data.");
      }
      if (this.dataFilter) {
        filter = cola.submit.filter[this.dataFilter];
        data = filter ? filter(data) : data;
      }
    }
    if (data || options.alwaysSubmit) {
      if (options.parameter) {
        options.data = {
          data: data,
          parameter: options.parameter
        };
      } else {
        options.data = data;
      }
      jQuery.post(options.url, options.data).done(function(result) {
        cola.callback(callback, true, result);
      }).fail(function(result) {
        cola.callback(callback, true, result);
      });
      return true;
    } else {
      return false;
    }
  };

  cola.submit.filter = {
    "dirty": function(data) {
      var filtered;
      if (data instanceof cola.EntityList) {
        filtered = [];
        data.each(function(entity) {
          if (entity.state !== cola.Entity.STATE_NONE) {
            filtered.push(entity);
          }
        });
      } else if (data.state !== cola.Entity.STATE_NONE) {
        filtered = data;
      }
      return filtered;
    },
    "child-dirty": function(data) {
      return data;
    },
    "dirty-tree": function(data) {
      return data;
    }
  };

  _$ = $();

  _$.length = 1;

  this.$fly = function(dom) {
    _$[0] = dom;
    return _$;
  };

  doms = {};

  cola.util.cacheDom = function(ele) {
    if (!doms.hiddenDiv) {
      doms.hiddenDiv = $.xCreate({
        tagName: "div",
        id: "_hidden_div",
        style: {
          display: "none"
        }
      });
      doms.hiddenDiv.setAttribute(cola.constants.IGNORE_DIRECTIVE, "");
      document.body.appendChild(doms.hiddenDiv);
    }
    cola._ignoreNodeRemoved = true;
    doms.hiddenDiv.appendChild(ele);
    cola._ignoreNodeRemoved = false;
  };

  USER_DATA_KEY = cola.constants.DOM_USER_DATA_KEY;

  cola.util.userDataStore = {};

  cola.util.userData = function(node, key, data) {
    var i, id, store, text, userData;
    if (node.nodeType === 3) {
      return;
    }
    userData = cola.util.userDataStore;
    if (node.nodeType === 8) {
      text = node.nodeValue;
      i = text.indexOf("|");
      if (i > -1) {
        id = text.substring(i + 1);
      }
    } else {
      id = node.getAttribute(USER_DATA_KEY);
    }
    if (arguments.length === 3) {
      if (!id) {
        id = cola.uniqueId();
        if (node.nodeType === 8) {
          if (i > -1) {
            node.nodeValue = text.substring(0, i + 1) + id;
          } else {
            node.nodeValue = text ? text + "|" + id : "|" + id;
          }
        } else {
          node.setAttribute(USER_DATA_KEY, id);
        }
        userData[id] = store = {};
      } else {
        store = userData[id];
        if (!store) {
          userData[id] = store = {};
        }
      }
      store[key] = data;
    } else if (arguments.length === 2) {
      if (typeof key === "string") {
        if (id) {
          store = userData[id];
          return store != null ? store[key] : void 0;
        }
      } else if (key && typeof key === "object") {
        id = cola.uniqueId();
        if (node.nodeType === 8) {
          if (i > -1) {
            node.nodeValue = text.substring(0, i + 1) + id;
          } else {
            node.nodeValue = text ? text + "|" + id : "|" + id;
          }
        } else {
          node.setAttribute(USER_DATA_KEY, id);
        }
        userData[id] = key;
      }
    } else if (arguments.length === 1) {
      if (id) {
        return userData[id];
      }
    }
  };

  cola.util.removeUserData = function(node, key) {
    var id, store;
    id = node.getAttribute(USER_DATA_KEY);
    if (id) {
      store = cola.util.userDataStore[id];
      if (store) {
        delete store[key];
      }
    }
  };

  ON_NODE_REMOVED_KEY = "__onNodeRemoved";

  cola.detachNode = function(node) {
    if (!node.parentNode) {
      return;
    }
    cola._ignoreNodeRemoved = true;
    node.parentNode.removeChild(ele);
    cola._ignoreNodeRemoved = false;
  };

  cola.util.onNodeRemoved = function(node, listener) {
    var oldListener;
    oldListener = cola.util.userData(node, ON_NODE_REMOVED_KEY);
    if (oldListener) {
      if (oldListener instanceof Array) {
        oldListener.push(listener);
      } else {
        cola.util.userData(node, ON_NODE_REMOVED_KEY, [oldListener, listener]);
      }
    } else {
      cola.util.userData(node, ON_NODE_REMOVED_KEY, listener);
    }
  };

  _removeNodeData = function(node) {
    var i, id, l, len1, listener, nodeRemovedListener, store, text;
    if (node.nodeType === 3) {
      return;
    }
    if (node.nodeType === 8) {
      text = node.nodeValue;
      i = text.indexOf("|");
      if (i > -1) {
        id = text.substring(i + 1);
      }
    } else {
      id = node.getAttribute(USER_DATA_KEY);
    }
    if (id) {
      store = cola.util.userDataStore[id];
      if (store) {
        nodeRemovedListener = store[ON_NODE_REMOVED_KEY];
        if (nodeRemovedListener) {
          if (nodeRemovedListener instanceof Array) {
            for (l = 0, len1 = nodeRemovedListener.length; l < len1; l++) {
              listener = nodeRemovedListener[l];
              listener(node, store);
            }
          } else {
            nodeRemovedListener(node, store);
          }
        }
        delete cola.util.userDataStore[id];
      }
    }
  };

  _DOMNodeRemovedListener = function(evt) {
    var child, node;
    if (cola._ignoreNodeRemoved || window.closed) {
      return;
    }
    node = evt.target;
    if (!node) {
      return;
    }
    child = node.firstChild;
    while (child) {
      _removeNodeData(child);
      child = child.nextSibling;
    }
    _removeNodeData(node);
  };

  document.addEventListener("DOMNodeRemoved", _DOMNodeRemovedListener);

  $fly(window).on("unload", function() {
    document.removeEventListener("DOMNodeRemoved", _DOMNodeRemovedListener);
  });

  if (cola.device.mobile) {
    $fly(window).on("load", function() {
      FastClick.attach(document.body);
    });
  }

  if (cola.browser.webkit) {
    browser = "webkit";
    if (cola.browser.chrome) {
      browser += " chrome";
    } else if (cola.browser.safari) {
      browser += " safari";
    }
  } else if (cola.browser.ie) {
    browser = "ie";
  } else if (cola.browser.mozilla) {
    browser = "mozilla";
  } else {
    browser = "";
  }

  if (cola.os.android) {
    os = " android";
  } else if (cola.os.ios) {
    os = " ios";
  } else if (cola.os.windows) {
    os = " windows";
  } else {
    os = "";
  }

  if (cola.device.mobile) {
    os += " mobile";
  } else if (cola.device.desktop) {
    os += " desktop";
  }

  if (browser || os) {
    $fly(document.documentElement).addClass(browser + os);
  }

  if (cola.os.mobile) {
    $(function() {
      if (typeof FastClick !== "undefined" && FastClick !== null) {
        FastClick.attach(document.body);
      }
    });
  }

  cola.loadSubView = function(targetDom, context) {
    var cssUrl, cssUrls, failed, htmlUrl, jsUrl, jsUrls, l, len1, len2, len3, len4, loadingUrls, o, q, r, ref, ref1, resourceLoadCallback;
    loadingUrls = [];
    failed = false;
    resourceLoadCallback = function(success, context, url) {
      var error, errorMessage, i, initFunc, l, len1, ref;
      if (success) {
        if (!failed) {
          i = loadingUrls.indexOf(url);
          if (i > -1) {
            loadingUrls.splice(i, 1);
          }
          if (loadingUrls.length === 0) {
            $fly(targetDom).removeClass("loading");
            if (context.suspendedInitFuncs.length) {
              ref = context.suspendedInitFuncs;
              for (l = 0, len1 = ref.length; l < len1; l++) {
                initFunc = ref[l];
                initFunc(targetDom, context.model, context.param);
              }
            } else {
              cola(targetDom, context.model);
            }
            if (cola.getListeners("ready")) {
              cola.fire("ready", cola);
              cola.off("ready");
            }
            cola.callback(context.callback, true);
          }
        }
      } else {
        failed = true;
        error = context;
        if (cola.callback(context.callback, false, error) !== false) {
          if (error.xhr) {
            errorMessage = error.status + " " + error.statusText;
          } else {
            errorMessage = error.message;
          }
          throw new cola.Exception(("Failed to load resource from [" + url + "]. ") + errorMessage);
        }
      }
    };
    $fly(targetDom).addClass("loading");
    htmlUrl = context.htmlUrl;
    if (htmlUrl) {
      loadingUrls.push(htmlUrl);
    }
    if (context.jsUrl) {
      jsUrls = [];
      if (context.jsUrl instanceof Array) {
        ref = context.jsUrl;
        for (l = 0, len1 = ref.length; l < len1; l++) {
          jsUrl = ref[l];
          jsUrl = _compileResourceUrl(jsUrl, htmlUrl, ".js");
          if (jsUrl) {
            loadingUrls.push(jsUrl);
            jsUrls.push(jsUrl);
          }
        }
      } else {
        jsUrl = _compileResourceUrl(context.jsUrl, htmlUrl, ".js");
        if (jsUrl) {
          loadingUrls.push(jsUrl);
          jsUrls.push(jsUrl);
        }
      }
    }
    if (context.cssUrl) {
      cssUrls = [];
      if (context.cssUrl instanceof Array) {
        ref1 = context.cssUrl;
        for (o = 0, len2 = ref1.length; o < len2; o++) {
          cssUrl = ref1[o];
          cssUrl = _compileResourceUrl(cssUrl, htmlUrl, ".css");
          if (cssUrl) {
            cssUrls.push(cssUrl);
          }
        }
      } else {
        cssUrl = _compileResourceUrl(context.cssUrl, htmlUrl, ".css");
        if (cssUrl) {
          cssUrls.push(cssUrl);
        }
      }
    }
    context.suspendedInitFuncs = [];
    if (htmlUrl) {
      _loadHtml(targetDom, htmlUrl, void 0, {
        complete: function(success, result) {
          return resourceLoadCallback(success, (success ? context : result), htmlUrl);
        }
      });
    }
    if (jsUrls) {
      for (q = 0, len3 = jsUrls.length; q < len3; q++) {
        jsUrl = jsUrls[q];
        _loadJs(context, jsUrl, {
          complete: function(success, result) {
            return resourceLoadCallback(success, (success ? context : result), jsUrl);
          }
        });
      }
    }
    if (cssUrls) {
      for (r = 0, len4 = cssUrls.length; r < len4; r++) {
        cssUrl = cssUrls[r];
        _loadCss(cssUrl);
      }
    }
  };

  _compileResourceUrl = function(resUrl, htmlUrl, suffix) {
    var defaultRes, i;
    if (resUrl === "$") {
      defaultRes = true;
    } else if (resUrl.indexOf("$.") === 0) {
      defaultRes = true;
      suffix = resUrl.substring(2);
    }
    if (defaultRes) {
      resUrl = null;
      if (htmlUrl) {
        i = htmlUrl.lastIndexOf(".");
        resUrl = (i > 0 ? htmlUrl.substring(0, i) : htmlUrl) + suffix;
      }
    }
    return resUrl;
  };

  _loadHtml = function(targetDom, url, data, callback) {
    $(targetDom).load(url, data, function(response, status, xhr) {
      if (status === "error") {
        cola.callback(callback, false, {
          xhr: xhr,
          status: xhr.status,
          statusText: xhr.statusText
        });
      } else {
        cola.callback(callback, true);
      }
    });
  };

  _jsCache = {};

  _loadJs = function(context, url, callback) {
    var initFuncs;
    initFuncs = _jsCache[url];
    if (initFuncs) {
      Array.prototype.push.apply(context.suspendedInitFuncs, initFuncs);
      cola.callback(callback, true);
    } else {
      $.ajax(url, {
        dataType: "text",
        cache: true
      }).done(function(script) {
        var e, head, scriptElement;
        scriptElement = $.xCreate({
          tagName: "script",
          language: "javascript",
          type: "text/javascript",
          charset: cola.setting("defaultCharset")
        });
        scriptElement.text = script;
        cola._suspendedInitFuncs = context.suspendedInitFuncs;
        try {
          try {
            head = document.querySelector("head") || document.documentElement;
            head.appendChild(scriptElement);
          } finally {
            delete cola._suspendedInitFuncs;
            _jsCache[url] = context.suspendedInitFuncs;
          }
          cola.callback(callback, true);
        } catch (_error) {
          e = _error;
          cola.callback(callback, false, e);
        }
      }).fail(function(xhr) {
        cola.callback(callback, false, {
          xhr: xhr,
          status: xhr.status,
          statusText: xhr.statusText
        });
      });
    }
  };

  _cssCache = {};

  _loadCss = function(url) {
    var head, linkElement;
    if (!_cssCache[url]) {
      linkElement = $.xCreate({
        tagName: "link",
        rel: "stylesheet",
        type: "text/css",
        charset: cola.setting("defaultCharset"),
        href: url
      });
      head = document.querySelector("head") || document.documentElement;
      head.appendChild(linkElement);
      _cssCache[url] = true;
    }
  };

  routerRegistry = null;

  currentRoutePath = null;

  currentRouter = null;

  trimPath = function(path) {
    if (path) {
      if (path.charCodeAt(0) === 47) {
        path = path.substring(1);
      }
      if (path.charCodeAt(path.length - 1) === 47) {
        path = path.substring(0, path.length - 1);
      }
    }
    return path || "";
  };

  cola.route = function(path, router) {
    var hasVariable, l, len1, optional, part, pathParts, ref, variable;
    if (routerRegistry == null) {
      routerRegistry = new cola.util.KeyedArray();
    }
    if (typeof router === "function") {
      router = {
        enter: router
      };
    }
    path = trimPath(path);
    router.path = path;
    if (router.model == null) {
      router.model = path || cola.constants.DEFAULT_PATH;
    }
    router.pathParts = pathParts = [];
    if (path) {
      hasVariable = false;
      ref = path.split("/");
      for (l = 0, len1 = ref.length; l < len1; l++) {
        part = ref[l];
        if (part.charCodeAt(0) === 58) {
          optional = part.charCodeAt(part.length - 1) === 63;
          if (optional) {
            variable = part.substring(1, part.length - 1);
          } else {
            variable = part.substring(1);
          }
          hasVariable = true;
          pathParts.push({
            variable: variable,
            optional: optional
          });
        } else {
          pathParts.push(part);
        }
      }
      router.hasVariable = hasVariable;
    }
    routerRegistry.add(path, router);
    return this;
  };

  cola.getCurrentRoutePath = function() {
    return currentRoutePath;
  };

  cola.getCurrentRouter = function() {
    return currentRouter;
  };

  cola.setRoutePath = function(path) {
    var routerMode;
    if (path && path.charCodeAt(0) === 35) {
      routerMode = "hash";
      path = path.substring(1);
    }
    if (routerMode === "hash") {
      if (path.charCodeAt(0) !== 47) {
        path = "/" + path;
      }
      if (window.location.hash !== path) {
        window.location.hash = path;
      }
    } else {
      window.history.pushState({
        path: path
      }, null, path);
      _onStateChange(path);
    }
  };

  _findRouter = function(path) {
    var defPart, defPathParts, gap, i, l, len1, len2, matching, o, param, pathParts, ref, router;
    if (!routerRegistry) {
      return null;
    }
    path || (path = trimPath(cola.setting("defaultRouterPath")));
    pathParts = path ? path.split(/[\/\?\#]/) : [];
    ref = routerRegistry.elements;
    for (l = 0, len1 = ref.length; l < len1; l++) {
      router = ref[l];
      defPathParts = router.pathParts;
      gap = defPathParts.length - pathParts.length;
      if (!(gap === 0 || gap === 1 && defPathParts.length > 0 && defPathParts[defPathParts.length - 1].optional)) {
        continue;
      }
      matching = true;
      param = {};
      for (i = o = 0, len2 = defPathParts.length; o < len2; i = ++o) {
        defPart = defPathParts[i];
        if (typeof defPart === "string") {
          if (defPart !== pathParts[i]) {
            matching = false;
            break;
          }
        } else {
          if (i >= pathParts.length && !defPart.optional) {
            matching = false;
            break;
          }
          param[defPart.variable] = pathParts[i];
        }
      }
      if (matching) {
        break;
      }
    }
    if (matching) {
      router.param = param;
      return router;
    } else {
      return null;
    }
  };

  _switchRouter = function(router, path) {
    var eventArg, model, oldModel, parentModel, parentModelName, target;
    if (router.redirectTo) {
      cola.setRoutePath(router.redirectTo);
      return;
    }
    eventArg = {
      path: path,
      prev: currentRouter,
      next: router
    };
    cola.fire("beforeRouterSwitch", cola, eventArg);
    if (currentRouter) {
      oldModel = currentRouter.realModel;
      if (typeof currentRouter.leave === "function") {
        currentRouter.leave(currentRouter, oldModel);
      }
      delete currentRouter.realModel;
      if (currentRouter.destroyModel) {
        if (oldModel != null) {
          oldModel.destroy();
        }
      }
    }
    if (router.templateUrl) {
      if (router.target) {
        if (router.target.nodeType) {
          target = router.target;
        } else {
          target = $(router.target)[0];
        }
      }
      if (!target) {
        target = document.getElementsByClassName(cola.constants.VIEW_PORT_CLASS)[0];
        if (!target) {
          target = document.getElementsByClassName(cola.constants.VIEW_CLASS)[0];
          if (!target) {
            target = document.body;
          }
        }
      }
      router.targetDom = target;
      $fly(target).empty();
    }
    currentRouter = router;
    if (typeof router.model === "string") {
      model = cola.model(router.model);
    } else if (router.model instanceof cola.Model) {
      model = router.model;
    }
    if (!model) {
      parentModelName = router.parentModel || cola.constants.DEFAULT_PATH;
      parentModel = cola.model(parentModelName);
      if (!parentModel) {
        throw new cola.Exception("Parent Model \"" + parentModelName + "\" is undefined.");
      }
      model = new cola.Model(router.model, parentModel);
      router.destroyModel = true;
    } else {
      router.destroyModel = false;
    }
    router.realModel = model;
    if (router.templateUrl) {
      cola.loadSubView(router.targetDom, {
        model: model,
        htmlUrl: router.templateUrl,
        jsUrl: router.jsUrl,
        cssUrl: router.cssUrl,
        data: router.data,
        param: router.param,
        callback: function() {
          if (typeof router.enter === "function") {
            router.enter(router, model);
          }
          if (router.title) {
            document.title = router.title;
          }
        }
      });
    } else {
      if (typeof router.enter === "function") {
        router.enter(router, model);
      }
      if (router.title) {
        document.title = router.title;
      }
    }
    cola.fire("routerSwitch", cola, eventArg);
  };

  _getHashPath = function() {
    var path;
    path = location.hash;
    if (path) {
      path = path.substring(1);
    }
    if ((path != null ? path.charCodeAt(0) : void 0) === 33) {
      path = path.substring(1);
    }
    path = trimPath(path);
    return path || "";
  };

  _onHashChange = function() {
    var path, router;
    path = _getHashPath();
    if (path === currentRoutePath) {
      return;
    }
    currentRoutePath = path;
    router = _findRouter(path);
    if (router) {
      _switchRouter(router, path);
    }
  };

  _onStateChange = function(path) {
    var i, router;
    path = trimPath(path);
    i = path.indexOf("#");
    if (i > -1) {
      path = path.substring(i + 1);
    } else {
      i = path.indexOf("?");
      if (i > -1) {
        path = path.substring(0, i);
      }
    }
    if (path === currentRoutePath) {
      return;
    }
    currentRoutePath = path;
    router = _findRouter(path);
    if (router) {
      _switchRouter(router, path);
    }
  };

  $(function() {
    setTimeout(function() {
      var path, router;
      $fly(window).on("hashchange", _onHashChange).on("popstate", function() {
        var state;
        if (!location.hash) {
          state = window.history.state;
          _onStateChange((state != null ? state.path : void 0) || "");
        }
      });
      $(document.body).delegate("a.state", "click", function() {
        var href;
        href = this.getAttribute("href");
        if (href) {
          cola.setRoutePath(href);
        }
        return false;
      });
      path = _getHashPath() || trimPath(cola.setting("defaultRouterPath"));
      router = _findRouter(path);
      if (router) {
        currentRoutePath = path;
        _switchRouter(router, path);
      }
    }, 0);
  });


  /*
  BindingFeature
   */

  cola._BindingFeature = (function() {
    function _BindingFeature() {}

    _BindingFeature.prototype.init = function() {};

    return _BindingFeature;

  })();

  cola._ExpressionFeature = (function(superClass) {
    extend(_ExpressionFeature, superClass);

    function _ExpressionFeature(expression1) {
      this.expression = expression1;
      if (this.expression) {
        this.isStatic = this.expression.isStatic;
        this.path = this.expression.path;
        if (!this.path && this.expression.hasCallStatement) {
          this.path = "**";
          this.delay = true;
        }
        this.watchingMoreMessage = this.expression.hasCallStatement || this.expression.convertors;
      }
    }

    _ExpressionFeature.prototype.evaluate = function(domBinding, dataCtx) {
      return this.expression.evaluate(domBinding.scope, "async", dataCtx);
    };

    _ExpressionFeature.prototype.refresh = function(domBinding, force, dataCtx) {
      if (dataCtx == null) {
        dataCtx = {};
      }
      if (!this._refresh) {
        return;
      }
      if (this.delay && !force) {
        cola.util.delay(this, "refresh", 100, function() {
          this._refresh(domBinding, dataCtx);
          if (this.isStatic && !dataCtx.unloaded) {
            this.disabled = true;
          }
        });
      } else {
        this._refresh(domBinding, dataCtx);
        if (this.isStatic && !dataCtx.unloaded) {
          this.disabled = true;
        }
      }
    };

    return _ExpressionFeature;

  })(cola._BindingFeature);

  cola._WatchFeature = (function(superClass) {
    extend(_WatchFeature, superClass);

    function _WatchFeature(action1, path1) {
      this.action = action1;
      this.path = path1;
      this.watchingMoreMessage = true;
    }

    _WatchFeature.prototype._processMessage = function(domBinding) {
      this.refresh(domBinding);
    };

    _WatchFeature.prototype.refresh = function(domBinding) {
      var action;
      action = domBinding.scope.action(this.action);
      if (!action) {
        throw new cola.Exception("No action named \"" + this.action + "\" found.");
      }
      action(domBinding.dom, domBinding.scope);
    };

    return _WatchFeature;

  })(cola._BindingFeature);

  cola._EventFeature = (function(superClass) {
    extend(_EventFeature, superClass);

    function _EventFeature(expression1, event1) {
      this.expression = expression1;
      this.event = event1;
    }

    _EventFeature.prototype.init = function(domBinding) {
      var expression;
      expression = this.expression;
      domBinding.$dom.bind(this.event, function() {
        var oldScope;
        oldScope = cola.currentScope;
        cola.currentScope = domBinding.scope;
        try {
          return expression.evaluate(domBinding.scope, "never");
        } finally {
          cola.currentScope = oldScope;
        }
      });
    };

    return _EventFeature;

  })(cola._ExpressionFeature);

  cola._AliasFeature = (function(superClass) {
    extend(_AliasFeature, superClass);

    function _AliasFeature(expression) {
      _AliasFeature.__super__.constructor.call(this, expression);
      this.alias = expression.alias;
    }

    _AliasFeature.prototype.init = function(domBinding) {
      domBinding.scope = new cola.AliasScope(domBinding.scope, this.expression);
      domBinding.subScopeCreated = true;
    };

    _AliasFeature.prototype._processMessage = function(domBinding, bindingPath, path, type, arg) {
      if ((cola.constants.MESSAGE_REFRESH <= type && type <= cola.constants.MESSAGE_CURRENT_CHANGE) || this.watchingMoreMessage) {
        this.refresh(domBinding);
      }
    };

    _AliasFeature.prototype._refresh = function(domBinding, dataCtx) {
      var data;
      data = this.evaluate(domBinding, dataCtx);
      domBinding.scope.data.setTargetData(data);
    };

    return _AliasFeature;

  })(cola._ExpressionFeature);

  cola._RepeatFeature = (function(superClass) {
    extend(_RepeatFeature, superClass);

    function _RepeatFeature(expression) {
      _RepeatFeature.__super__.constructor.call(this, expression);
      this.alias = expression.alias;
    }

    _RepeatFeature.prototype.init = function(domBinding) {
      var scope;
      domBinding.scope = scope = new cola.ItemsScope(domBinding.scope, this.expression);
      scope.onItemsRefresh = (function(_this) {
        return function() {
          _this.onItemsRefresh(domBinding);
        };
      })(this);
      scope.onCurrentItemChange = function(arg) {
        var currentItemDomBinding, itemId;
        if (domBinding.currentItemDom) {
          $fly(domBinding.currentItemDom).removeClass(cola.constants.COLLECTION_CURRENT_CLASS);
        }
        if (arg.current && domBinding.itemDomBindingMap) {
          itemId = cola.Entity._getEntityId(arg.current);
          if (itemId) {
            currentItemDomBinding = domBinding.itemDomBindingMap[itemId];
            if (currentItemDomBinding) {
              $fly(currentItemDomBinding.dom).addClass(cola.constants.COLLECTION_CURRENT_CLASS);
            }
          }
        }
        domBinding.currentItemDom = currentItemDomBinding.dom;
      };
      scope.onItemInsert = (function(_this) {
        return function(arg) {
          var headDom, insertMode, itemDom, refDom, refEntityId, tailDom, templateDom;
          headDom = domBinding.dom;
          tailDom = cola.util.userData(headDom, cola.constants.REPEAT_TAIL_KEY);
          templateDom = cola.util.userData(headDom, cola.constants.REPEAT_TEMPLATE_KEY);
          itemDom = _this.createNewItem(domBinding, templateDom, domBinding.scope, arg.entity);
          insertMode = arg.insertMode;
          if (!insertMode || insertMode === "end") {
            $fly(tailDom).before(itemDom);
          } else if (insertMode === "begin") {
            $fly(headDom).after(itemDom);
          } else if (domBinding.itemDomBindingMap) {
            refEntityId = cola.Entity._getEntityId(arg.refEntity);
            if (refEntityId) {
              refDom = domBinding.itemDomBindingMap[refEntityId] != null;
              if (refDom) {
                if (insertMode === "before") {
                  $fly(refDom).before(itemDom);
                } else {
                  $fly(refDom).after(itemDom);
                }
              }
            }
          }
        };
      })(this);
      scope.onItemRemove = function(arg) {
        var itemDomBinding, itemId;
        itemId = cola.Entity._getEntityId(arg.entity);
        if (itemId) {
          itemDomBinding = domBinding.itemDomBindingMap[itemId];
          if (itemDomBinding) {
            arg.itemsScope.unregItemScope(itemId);
            itemDomBinding.remove();
            if (itemDomBinding.dom === domBinding.currentItemDom) {
              delete domBinding.currentItemDom;
            }
          }
        }
      };
      domBinding.subScopeCreated = true;
    };

    _RepeatFeature.prototype._refresh = function(domBinding, dataCtx) {
      domBinding.scope.refreshItems(dataCtx);
    };

    _RepeatFeature.prototype.onItemsRefresh = function(domBinding) {
      var currentDom, documentFragment, headDom, itemDom, items, originItems, scope, tailDom, templateDom;
      scope = domBinding.scope;
      items = scope.items;
      originItems = scope.originData;
      if (items && !(items instanceof cola.EntityList) && !(items instanceof Array)) {
        throw new cola.Exception("Expression \"" + this.expression + "\" must bind to EntityList or Array.");
      }
      if (items !== domBinding.items || (items && items.timestamp !== domBinding.timestamp)) {
        domBinding.items = items;
        domBinding.timestamp = (items != null ? items.timestamp : void 0) || 0;
        headDom = domBinding.dom;
        tailDom = cola.util.userData(headDom, cola.constants.REPEAT_TAIL_KEY);
        templateDom = cola.util.userData(headDom, cola.constants.REPEAT_TEMPLATE_KEY);
        if (!tailDom) {
          tailDom = document.createComment("Repeat Tail ");
          $fly(headDom).after(tailDom);
          cola.util.userData(headDom, cola.constants.REPEAT_TAIL_KEY, tailDom);
        }
        currentDom = headDom;
        documentFragment = null;
        if (items) {
          domBinding.itemDomBindingMap = {};
          scope.resetItemScopeMap();
          if (domBinding.currentItemDom) {
            $fly(domBinding.currentItemDom).removeClass(cola.constants.COLLECTION_CURRENT_CLASS);
          }
          cola.each(items, (function(_this) {
            return function(item) {
              var itemDom, itemDomBinding, itemId, itemScope;
              if (item == null) {
                return;
              }
              itemDom = currentDom.nextSibling;
              if (itemDom === tailDom) {
                itemDom = null;
              }
              if (itemDom) {
                itemDomBinding = cola.util.userData(itemDom, cola.constants.DOM_BINDING_KEY);
                itemScope = itemDomBinding.scope;
                if (typeof item === "object") {
                  itemId = cola.Entity._getEntityId(item);
                } else {
                  itemId = cola.uniqueId();
                }
                scope.regItemScope(itemId, itemScope);
                itemDomBinding.itemId = itemId;
                domBinding.itemDomBindingMap[itemId] = itemDomBinding;
                itemScope.data.setTargetData(item);
              } else {
                itemDom = _this.createNewItem(domBinding, templateDom, scope, item);
                if (documentFragment == null) {
                  documentFragment = document.createDocumentFragment();
                }
                documentFragment.appendChild(itemDom);
                $fly(tailDom).before(itemDom);
              }
              if (item === (items.current || (originItems != null ? originItems.current : void 0))) {
                $fly(itemDom).addClass(cola.constants.COLLECTION_CURRENT_CLASS);
                domBinding.currentItemDom = itemDom;
              }
              currentDom = itemDom;
            };
          })(this));
        }
        if (!documentFragment) {
          itemDom = currentDom.nextSibling;
          while (itemDom && itemDom !== tailDom) {
            currentDom = itemDom;
            itemDom = currentDom.nextSibling;
            $fly(currentDom).remove();
          }
        } else {
          $fly(tailDom).before(documentFragment);
        }
      }
    };

    _RepeatFeature.prototype.createNewItem = function(repeatDomBinding, templateDom, scope, item) {
      var domBinding, itemDom, itemId, itemScope, templateDomBinding;
      itemScope = new cola.ItemScope(scope, this.alias);
      itemScope.data.setTargetData(item, true);
      itemDom = templateDom.cloneNode(true);
      this.deepCloneNodeData(itemDom, itemScope, false);
      templateDomBinding = cola.util.userData(templateDom, cola.constants.DOM_BINDING_KEY);
      domBinding = templateDomBinding.clone(itemDom, itemScope);
      this.refreshItemDomBinding(itemDom, itemScope);
      if (typeof item === "object") {
        itemId = cola.Entity._getEntityId(item);
      } else {
        itemId = cola.uniqueId();
      }
      scope.regItemScope(itemId, itemScope);
      domBinding.itemId = itemId;
      repeatDomBinding.itemDomBindingMap[itemId] = domBinding;
      return itemDom;
    };

    _RepeatFeature.prototype.deepCloneNodeData = function(node, scope, cloneDomBinding) {
      var child, clonedStore, k, store, v;
      store = cola.util.userData(node);
      if (store) {
        clonedStore = {};
        for (k in store) {
          v = store[k];
          if (k === cola.constants.DOM_BINDING_KEY) {
            if (cloneDomBinding) {
              v = v.clone(node, scope);
            }
          } else if (k.substring(0, 2) === "__") {
            continue;
          }
          clonedStore[k] = v;
        }
        cola.util.userData(node, clonedStore);
      }
      child = node.firstChild;
      while (child) {
        if (child.nodeType !== 3 && !(typeof child.hasAttribute === "function" ? child.hasAttribute(cola.constants.IGNORE_DIRECTIVE) : void 0)) {
          this.deepCloneNodeData(child, scope, true);
        }
        child = child.nextSibling;
      }
    };

    _RepeatFeature.prototype.refreshItemDomBinding = function(dom, itemScope) {
      var child, currentDom, domBinding, initializer, initializers, l, len1;
      domBinding = cola.util.userData(dom, cola.constants.DOM_BINDING_KEY);
      if (domBinding) {
        domBinding.refresh();
        itemScope = domBinding.subScope || domBinding.scope;
        if (domBinding instanceof cola._RepeatDomBinding) {
          currentDom = cola.util.userData(domBinding.dom, cola.constants.REPEAT_TAIL_KEY);
        }
      }
      child = dom.firstChild;
      while (child) {
        if (child.nodeType !== 3 && !(typeof child.hasAttribute === "function" ? child.hasAttribute(cola.constants.IGNORE_DIRECTIVE) : void 0)) {
          child = this.refreshItemDomBinding(child, itemScope);
        }
        child = child.nextSibling;
      }
      initializers = cola.util.userData(dom, cola.constants.DOM_INITIALIZER_KEY);
      if (initializers) {
        for (l = 0, len1 = initializers.length; l < len1; l++) {
          initializer = initializers[l];
          initializer(itemScope, dom);
        }
        cola.util.removeUserData(dom, cola.constants.DOM_INITIALIZER_KEY);
      }
      return currentDom || dom;
    };

    return _RepeatFeature;

  })(cola._ExpressionFeature);

  cola._DomFeature = (function(superClass) {
    extend(_DomFeature, superClass);

    function _DomFeature() {
      return _DomFeature.__super__.constructor.apply(this, arguments);
    }

    _DomFeature.prototype.writeBack = function(domBinding, value) {
      var path;
      path = this.path;
      if (path && typeof path === "string") {
        this.ignoreMessage = true;
        domBinding.scope.set(path, value);
        this.ignoreMessage = false;
      }
    };

    _DomFeature.prototype._processMessage = function(domBinding, bindingPath, path, type, arg) {
      if ((cola.constants.MESSAGE_REFRESH <= type && type <= cola.constants.MESSAGE_CURRENT_CHANGE) || this.watchingMoreMessage) {
        this.refresh(domBinding);
      }
    };

    _DomFeature.prototype._refresh = function(domBinding, dataCtx) {
      if (this.ignoreMessage) {
        return;
      }
      value = this.evaluate(domBinding, dataCtx);
      this._doRender(domBinding, value);
    };

    return _DomFeature;

  })(cola._ExpressionFeature);

  cola._TextNodeFeature = (function(superClass) {
    extend(_TextNodeFeature, superClass);

    function _TextNodeFeature() {
      return _TextNodeFeature.__super__.constructor.apply(this, arguments);
    }

    _TextNodeFeature.prototype._doRender = function(domBinding, value) {
      $fly(domBinding.dom).text(value == null ? "" : value);
    };

    return _TextNodeFeature;

  })(cola._DomFeature);

  cola._DomAttrFeature = (function(superClass) {
    extend(_DomAttrFeature, superClass);

    function _DomAttrFeature(expression, attr1, isStyle) {
      this.attr = attr1;
      this.isStyle = isStyle;
      _DomAttrFeature.__super__.constructor.call(this, expression);
    }

    _DomAttrFeature.prototype._doRender = function(domBinding, value) {
      var attr;
      attr = this.attr;
      if (attr === "text") {
        domBinding.$dom.text(value == null ? "" : value);
      } else if (attr === "html") {
        domBinding.$dom.html(value == null ? "" : value);
      } else if (this.isStyle) {
        domBinding.$dom.css(attr, value);
      } else {
        domBinding.$dom.attr(attr, value == null ? "" : value);
      }
    };

    return _DomAttrFeature;

  })(cola._DomFeature);

  cola._DomClassFeature = (function(superClass) {
    extend(_DomClassFeature, superClass);

    function _DomClassFeature(expression, className1) {
      this.className = className1;
      _DomClassFeature.__super__.constructor.call(this, expression);
    }

    _DomClassFeature.prototype._doRender = function(domBinding, value) {
      domBinding.$dom[value ? "addClass" : "removeClass"](this.className);
    };

    return _DomClassFeature;

  })(cola._DomFeature);

  cola._TextBoxFeature = (function(superClass) {
    extend(_TextBoxFeature, superClass);

    function _TextBoxFeature() {
      return _TextBoxFeature.__super__.constructor.apply(this, arguments);
    }

    _TextBoxFeature.prototype.init = function(domBinding) {
      var feature;
      feature = this;
      domBinding.$dom.on("input", function() {
        feature.writeBack(domBinding, this.value);
      });
      _TextBoxFeature.__super__.init.call(this);
    };

    _TextBoxFeature.prototype._doRender = function(domBinding, value) {
      domBinding.dom.value = value || "";
    };

    return _TextBoxFeature;

  })(cola._DomFeature);

  cola._CheckboxFeature = (function(superClass) {
    extend(_CheckboxFeature, superClass);

    function _CheckboxFeature() {
      return _CheckboxFeature.__super__.constructor.apply(this, arguments);
    }

    _CheckboxFeature.prototype.init = function(domBinding) {
      var feature;
      feature = this;
      domBinding.$dom.on("click", function() {
        feature.writeBack(domBinding, this.checked);
      });
      _CheckboxFeature.__super__.init.call(this);
    };

    _CheckboxFeature.prototype._doRender = function(domBinding, value) {
      var checked;
      checked = cola.DataType.defaultDataTypes.boolean.parse(value);
      domBinding.dom.checked = checked;
    };

    return _CheckboxFeature;

  })(cola._DomFeature);

  cola._RadioFeature = (function(superClass) {
    extend(_RadioFeature, superClass);

    function _RadioFeature() {
      return _RadioFeature.__super__.constructor.apply(this, arguments);
    }

    _RadioFeature.prototype.init = function(domBinding) {
      domBinding.$dom.on("click", function() {
        var checked;
        checked = this.checked;
        if (checked) {
          this.writeBack(domBinding, checked);
        }
      });
      _RadioFeature.__super__.init.call(this);
    };

    _RadioFeature.prototype._doRender = function(domBinding, value) {
      domBinding.dom.checked = value === domBinding.dom.value;
    };

    return _RadioFeature;

  })(cola._DomFeature);

  cola._SelectFeature = (function(superClass) {
    extend(_SelectFeature, superClass);

    function _SelectFeature() {
      return _SelectFeature.__super__.constructor.apply(this, arguments);
    }

    _SelectFeature.prototype.init = function(domBinding) {
      var feature;
      feature = this;
      domBinding.$dom.on("change", function() {
        value = this.options[this.selectedIndex];
        feature.writeBack(domBinding, value != null ? value.value : void 0);
      });
      _SelectFeature.__super__.init.call(this);
    };

    _SelectFeature.prototype._doRender = function(domBinding, value) {
      domBinding.dom.value = value;
    };

    return _SelectFeature;

  })(cola._DomFeature);

  cola._DisplayFeature = (function(superClass) {
    extend(_DisplayFeature, superClass);

    function _DisplayFeature() {
      return _DisplayFeature.__super__.constructor.apply(this, arguments);
    }

    _DisplayFeature.prototype._doRender = function(domBinding, value) {
      domBinding.dom.style.display = value ? "" : "none";
    };

    return _DisplayFeature;

  })(cola._DomFeature);

  cola._SelectOptionsFeature = (function(superClass) {
    extend(_SelectOptionsFeature, superClass);

    function _SelectOptionsFeature() {
      return _SelectOptionsFeature.__super__.constructor.apply(this, arguments);
    }

    _SelectOptionsFeature.prototype._doRender = function(domBinding, optionValues) {
      var options;
      if (!(optionValues instanceof Array || optionValues instanceof cola.EntityList)) {
        return;
      }
      options = domBinding.dom.options;
      if (optionValues instanceof cola.EntityList) {
        options.length = optionValues.entityCount;
      } else {
        options.length = optionValues.length;
      }
      cola.each(optionValues, function(optionValue, i) {
        var option;
        option = options[i];
        if (cola.util.isSimpleValue(optionValue)) {
          $fly(option).removeAttr("value").text(optionValue);
        } else if (optionValue instanceof cola.Entity) {
          $fly(option).attr("value", optionValue.get("value") || optionValue.get("key")).text(optionValue.get("text") || optionValue.get("name"));
        } else {
          $fly(option).attr("value", optionValue.value || optionValue.key).text(optionValue.text || optionValue.name);
        }
      });
    };

    return _SelectOptionsFeature;

  })(cola._DomFeature);

  _destroyDomBinding = function(node, data) {
    var domBinding;
    domBinding = data[cola.constants.DOM_BINDING_KEY];
    if (domBinding != null) {
      domBinding.destroy();
    }
  };

  cola._DomBinding = (function() {
    function _DomBinding(dom, scope1, feature) {
      var f, l, len1;
      this.scope = scope1;
      this.dom = dom;
      this.$dom = $(dom);
      if (feature) {
        if (feature instanceof Array) {
          for (l = 0, len1 = feature.length; l < len1; l++) {
            f = feature[l];
            this.addFeature(f);
          }
        } else {
          this.addFeature(feature);
        }
      }
      cola.util.userData(dom, cola.constants.DOM_BINDING_KEY, this);
      cola.util.onNodeRemoved(dom, _destroyDomBinding);
    }

    _DomBinding.prototype.destroy = function() {
      var _feature, feature, l, len1;
      _feature = this.feature;
      if (_feature) {
        if (_feature instanceof Array) {
          for (l = 0, len1 = _feature.length; l < len1; l++) {
            feature = _feature[l];
            this.unbindFeature(feature);
          }
        } else {
          this.unbindFeature(_feature);
        }
      }
      delete this.dom;
      delete this.$dom;
    };

    _DomBinding.prototype.bindFeature = function(feature) {
      var l, len1, p, path;
      if (!feature._processMessage) {
        return;
      }
      path = feature.path;
      if (path) {
        if (typeof path === "string") {
          this.bind(path, feature);
        } else {
          for (l = 0, len1 = path.length; l < len1; l++) {
            p = path[l];
            this.bind(p, feature);
          }
        }
      }
    };

    _DomBinding.prototype.unbindFeature = function(feature) {
      var l, len1, p, path;
      if (!feature._processMessage) {
        return;
      }
      path = feature.path;
      if (path) {
        if (typeof path === "string") {
          this.unbind(path, feature);
        } else {
          for (l = 0, len1 = path.length; l < len1; l++) {
            p = path[l];
            this.unbind(p, feature);
          }
        }
      }
    };

    _DomBinding.prototype.addFeature = function(feature) {
      if (feature.id == null) {
        feature.id = cola.uniqueId();
      }
      if (typeof feature.init === "function") {
        feature.init(this);
      }
      if (!this.feature) {
        this.feature = feature;
      } else if (this.feature instanceof Array) {
        this.feature.push(feature);
      } else {
        this.feature = [this.feature, feature];
      }
      this.bindFeature(feature);
    };

    _DomBinding.prototype.removeFeature = function(feature) {
      var _feature, i;
      _feature = this.feature;
      if (_feature) {
        if (_feature === feature) {
          delete this.feature;
          if (_feature.length === 1) {
            delete this.feature;
          }
        } else {
          i = _feature.indexOf(feature);
          if (i > -1) {
            _feature.splice(i, 1);
          }
        }
        this.unbindFeature(feature);
      }
    };

    _DomBinding.prototype.bind = function(path, feature) {
      var pipe;
      pipe = {
        _processMessage: (function(_this) {
          return function(bindingPath, path, type, arg) {
            if (!feature.disabled) {
              feature._processMessage(_this, bindingPath, path, type, arg);
              if (feature.disabled) {
                pipe.disabled = true;
              }
            } else {
              pipe.disabled = true;
            }
          };
        })(this)
      };
      this.scope.data.bind(path, pipe);
      this[feature.id] = pipe;
    };

    _DomBinding.prototype.unbind = function(path, feature) {
      var pipe;
      pipe = this[feature.id];
      delete this[feature.id];
      this.scope.data.unbind(path, pipe);
    };

    _DomBinding.prototype.refresh = function(force) {
      var f, feature, l, len1;
      feature = this.feature;
      if (feature instanceof Array) {
        for (l = 0, len1 = feature.length; l < len1; l++) {
          f = feature[l];
          f.refresh(this, force);
        }
      } else if (feature) {
        feature.refresh(this, force);
      }
    };

    _DomBinding.prototype.clone = function(dom, scope) {
      return new this.constructor(dom, scope, this.feature, true);
    };

    return _DomBinding;

  })();

  cola._AliasDomBinding = (function(superClass) {
    extend(_AliasDomBinding, superClass);

    function _AliasDomBinding() {
      return _AliasDomBinding.__super__.constructor.apply(this, arguments);
    }

    _AliasDomBinding.prototype.destroy = function() {
      _AliasDomBinding.__super__.destroy.call(this);
      if (this.subScopeCreated) {
        this.scope.destroy();
      }
    };

    return _AliasDomBinding;

  })(cola._DomBinding);

  cola._RepeatDomBinding = (function(superClass) {
    extend(_RepeatDomBinding, superClass);

    function _RepeatDomBinding(dom, scope, feature, clone) {
      var f, headerNode, l, len1, repeatItemDomBinding;
      if (clone) {
        _RepeatDomBinding.__super__.constructor.call(this, dom, scope, feature);
      } else {
        this.scope = scope;
        headerNode = document.createComment("Repeat Head ");
        cola._ignoreNodeRemoved = true;
        dom.parentNode.replaceChild(headerNode, dom);
        cola.util.cacheDom(dom);
        cola._ignoreNodeRemoved = false;
        this.dom = headerNode;
        cola.util.userData(headerNode, cola.constants.DOM_BINDING_KEY, this);
        cola.util.userData(headerNode, cola.constants.REPEAT_TEMPLATE_KEY, dom);
        cola.util.onNodeRemoved(headerNode, _destroyDomBinding);
        repeatItemDomBinding = new cola._RepeatItemDomBinding(dom, null);
        repeatItemDomBinding.repeatDomBinding = this;
        repeatItemDomBinding.isTemplate = true;
        if (feature) {
          if (feature instanceof Array) {
            for (l = 0, len1 = feature.length; l < len1; l++) {
              f = feature[l];
              if (f instanceof cola._RepeatFeature) {
                this.addFeature(f);
              } else {
                repeatItemDomBinding.addFeature(f);
              }
            }
          } else {
            if (feature instanceof cola._RepeatFeature) {
              this.addFeature(feature);
            } else {
              repeatItemDomBinding.addFeature(feature);
            }
          }
        }
      }
    }

    _RepeatDomBinding.prototype.destroy = function() {
      _RepeatDomBinding.__super__.destroy.call(this);
      if (this.subScopeCreated) {
        this.scope.destroy();
      }
      delete this.currentItemDom;
    };

    return _RepeatDomBinding;

  })(cola._DomBinding);

  cola._RepeatItemDomBinding = (function(superClass) {
    extend(_RepeatItemDomBinding, superClass);

    function _RepeatItemDomBinding() {
      return _RepeatItemDomBinding.__super__.constructor.apply(this, arguments);
    }

    _RepeatItemDomBinding.prototype.destroy = function() {
      var ref;
      _RepeatItemDomBinding.__super__.destroy.call(this);
      if (!this.isTemplate) {
        if ((ref = this.repeatDomBinding.itemDomBindingMap) != null) {
          delete ref[this.itemId];
        }
      }
    };

    _RepeatItemDomBinding.prototype.clone = function(dom, scope) {
      var cloned;
      cloned = _RepeatItemDomBinding.__super__.clone.call(this, dom, scope);
      cloned.repeatDomBinding = this.repeatDomBinding;
      return cloned;
    };

    _RepeatItemDomBinding.prototype.bind = function(path, feature) {
      if (this.isTemplate) {
        return;
      }
      return _RepeatItemDomBinding.__super__.bind.call(this, path, feature);
    };

    _RepeatItemDomBinding.prototype.bindFeature = function(feature) {
      if (this.isTemplate) {
        return;
      }
      return _RepeatItemDomBinding.__super__.bindFeature.call(this, feature);
    };

    _RepeatItemDomBinding.prototype.processDataMessage = function(path, type, arg) {
      if (!this.isTemplate) {
        this.scope.data._processMessage("**", path, type, arg);
      }
    };

    _RepeatItemDomBinding.prototype.refresh = function() {
      if (this.isTemplate) {
        return;
      }
      return _RepeatItemDomBinding.__super__.refresh.call(this);
    };

    _RepeatItemDomBinding.prototype.remove = function() {
      if (!this.isTemplate) {
        this.$dom.remove();
      }
    };

    return _RepeatItemDomBinding;

  })(cola._AliasDomBinding);

  IGNORE_NODES = ["SCRIPT", "STYLE", "META", "TEMPLATE"];

  ALIAS_REGEXP = new RegExp("\\$default", "g");

  cola._mainInitFuncs = [];

  cola._rootFunc = function() {
    var arg, fn, init, l, len1, model, modelName, targetDom;
    fn = null;
    targetDom = null;
    modelName = null;
    for (l = 0, len1 = arguments.length; l < len1; l++) {
      arg = arguments[l];
      if (typeof arg === "function") {
        fn = arg;
      } else if (typeof arg === "string") {
        modelName = arg;
      } else if ((arg != null ? arg.nodeType : void 0) || typeof arg === "object" && arg.length > 0) {
        targetDom = arg;
      }
    }
    init = function(dom, model, param) {
      var len2, o, oldScope, viewDoms;
      oldScope = cola.currentScope;
      cola.currentScope = model;
      try {
        if (typeof fn === "function") {
          fn(model, param);
        }
        if (!dom) {
          viewDoms = document.getElementsByClassName(cola.constants.VIEW_CLASS);
          if (viewDoms != null ? viewDoms.length : void 0) {
            dom = viewDoms;
          }
        }
        if (dom == null) {
          dom = document.body;
        }
        if (dom.length) {
          doms = dom;
          for (o = 0, len2 = doms.length; o < len2; o++) {
            dom = doms[o];
            cola._renderDomTemplate(dom, model);
          }
        } else {
          cola._renderDomTemplate(dom, model);
        }
      } finally {
        cola.currentScope = oldScope;
      }
    };
    if (cola._suspendedInitFuncs) {
      cola._suspendedInitFuncs.push(init);
    } else {
      if (modelName == null) {
        modelName = cola.constants.DEFAULT_PATH;
      }
      model = cola.model(modelName);
      if (model == null) {
        model = new cola.Model(modelName);
      }
      if (cola._mainInitFuncs) {
        cola._mainInitFuncs.push({
          targetDom: targetDom,
          model: model,
          init: init
        });
      } else {
        init(targetDom, model);
      }
    }
    return cola;
  };

  $(function() {
    var initFunc, initFuncs, l, len1;
    initFuncs = cola._mainInitFuncs;
    delete cola._mainInitFuncs;
    for (l = 0, len1 = initFuncs.length; l < len1; l++) {
      initFunc = initFuncs[l];
      initFunc.init(initFunc.targetDom, initFunc.model);
    }
    if (cola.getListeners("ready")) {
      cola.fire("ready", cola);
      cola.off("ready");
    }
  });

  cola._userDomCompiler = {
    $: []
  };

  $.xCreate.templateProcessors.push(function(template) {
    var dom;
    if (template instanceof cola.Widget) {
      dom = template.getDom();
      dom.setAttribute(cola.constants.IGNORE_DIRECTIVE, "");
      return dom;
    }
  });

  $.xCreate.attributeProcessor["c-widget"] = function($dom, attrName, attrValue, context) {
    var configKey, widgetConfigs;
    if (!attrValue) {
      return;
    }
    if (typeof attrValue === "string") {
      $dom.attr(attrName, attrValue);
    } else if (context) {
      configKey = cola.uniqueId();
      $dom.attr("widget-config", configKey);
      widgetConfigs = context.widgetConfigs;
      if (!widgetConfigs) {
        context.widgetConfigs = widgetConfigs = {};
      }
      widgetConfigs[configKey] = attrValue;
    }
  };

  cola.xRender = function(template, model, context) {
    var child, div, documentFragment, dom, l, len1, next, node, oldScope, widget;
    if (!template) {
      return;
    }
    if (template.nodeType) {
      dom = template;
    } else if (typeof template === "string") {
      documentFragment = document.createDocumentFragment();
      div = document.createElement("div");
      div.innerHTML = template;
      child = div.firstChild;
      while (child) {
        next = child.nextSibling;
        documentFragment.appendChild(child);
        child = next;
      }
    } else {
      oldScope = cola.currentScope;
      cola.currentScope = model;
      try {
        if (context == null) {
          context = {};
        }
        if (template instanceof Array) {
          documentFragment = document.createDocumentFragment();
          for (l = 0, len1 = template.length; l < len1; l++) {
            node = template[l];
            if (node.tagName) {
              child = $.xCreate(node, context);
            } else {
              if (node instanceof cola.Widget) {
                widget = node;
              } else {

              }
              widget = cola.widget(node, context.namespace);
              child = widget.getDom();
              child.setAttribute(cola.constants.IGNORE_DIRECTIVE, "");
            }
            documentFragment.appendChild(child);
          }
        } else {
          if (template.tagName) {
            dom = $.xCreate(template, context);
          } else {
            if (template instanceof cola.Widget) {
              widget = template;
            } else {
              widget = cola.widget(template, context.namespace);
            }
            dom = widget.getDom();
            dom.setAttribute(cola.constants.IGNORE_DIRECTIVE, "");
          }
        }
      } finally {
        cola.currentScope = oldScope;
      }
    }
    if (dom) {
      cola._renderDomTemplate(dom, model, context);
    } else if (documentFragment) {
      cola._renderDomTemplate(documentFragment, model, context);
      if (documentFragment.firstChild === documentFragment.lastChild) {
        dom = documentFragment.firstChild;
      } else {
        dom = documentFragment;
      }
    }
    return dom;
  };

  cola._renderDomTemplate = function(dom, scope, context) {
    if (context == null) {
      context = {};
    }
    _doRrenderDomTemplate(dom, scope, context);
  };

  _doRrenderDomTemplate = function(dom, scope, context) {
    var attr, attrName, attrValue, bindingExpr, bindingType, child, childContext, customDomCompiler, defaultPath, domBinding, expression, feature, features, initializer, initializers, k, l, len1, len2, len3, len4, newFeatures, o, parts, q, r, ref, ref1, removeAttr, removeAttrs, result, tailDom, v;
    if (dom.nodeType === 8) {
      return dom;
    }
    if (dom.nodeType === 1 && dom.hasAttribute(cola.constants.IGNORE_DIRECTIVE)) {
      return dom;
    }
    if (IGNORE_NODES.indexOf(dom.nodeName) > -1) {
      return dom;
    }
    if (dom.nodeType === 3) {
      bindingExpr = dom.nodeValue;
      parts = cola._compileText(bindingExpr);
      if (parts != null ? parts.length : void 0) {
        buildContent(parts, dom, scope);
      }
      return dom;
    } else if (dom.nodeType === 11) {
      child = dom.firstChild;
      while (child) {
        child = _doRrenderDomTemplate(child, scope, context);
        child = child.nextSibling;
      }
      return dom;
    }
    initializers = null;
    features = null;
    removeAttrs = null;
    bindingExpr = dom.getAttribute("c-repeat");
    if (bindingExpr) {
      bindingExpr = bindingExpr.replace(ALIAS_REGEXP, context.defaultPath);
      dom.removeAttribute("c-repeat");
      expression = cola._compileExpression(bindingExpr, "repeat");
      if (expression) {
        bindingType = "repeat";
        feature = buildRepeatFeature(expression);
        if (features == null) {
          features = [];
        }
        features.push(feature);
      }
    } else {
      bindingExpr = dom.getAttribute("c-alias");
      if (bindingExpr) {
        bindingExpr = bindingExpr.replace(ALIAS_REGEXP, context.defaultPath);
        dom.removeAttribute("c-alias");
        bindingType = "alias";
        expression = cola._compileExpression(bindingExpr, "alias");
        if (expression) {
          feature = buildAliasFeature(expression);
          if (features == null) {
            features = [];
          }
          features.push(feature);
        }
      }
    }
    bindingExpr = dom.getAttribute("c-bind");
    if (bindingExpr) {
      bindingExpr = bindingExpr.replace(ALIAS_REGEXP, context.defaultPath);
      dom.removeAttribute("c-bind");
      expression = cola._compileExpression(bindingExpr);
      if (expression) {
        feature = buildBindFeature(expression, dom);
        if (features == null) {
          features = [];
        }
        features.push(feature);
      }
    }
    ref = dom.attributes;
    for (l = 0, len1 = ref.length; l < len1; l++) {
      attr = ref[l];
      attrName = attr.name;
      if (attrName.substring(0, 2) === "c-") {
        if (removeAttrs == null) {
          removeAttrs = [];
        }
        removeAttrs.push(attrName);
        attrValue = attr.value;
        if (attrValue && context.defaultPath) {
          attrValue = attrValue.replace(ALIAS_REGEXP, context.defaultPath);
        }
        attrName = attrName.substring(2);
        if (attrName === "style") {
          newFeatures = buildStyleFeature(attrValue);
          features = features ? features.concat(newFeatures) : newFeatures;
        } else if (attrName === "class") {
          newFeatures = buildClassFeature(attrValue);
          features = features ? features.concat(newFeatures) : newFeatures;
        } else {
          customDomCompiler = cola._userDomCompiler[attrName];
          if (customDomCompiler) {
            result = customDomCompiler(scope, dom, context);
            if (result) {
              if (result instanceof cola._BindingFeature) {
                features.push(result);
              }
              if (typeof result === "function") {
                if (initializers == null) {
                  initializers = [];
                }
                initializers.push(result);
              }
            }
          } else {
            if (attrName.substring(0, 2) === "on") {
              feature = buildEvent(scope, dom, attrName.substring(2), attrValue);
            } else if (attrName === "i18n") {
              feature = buildI18NFeature(scope, dom, attrValue);
            } else if (attrName === "watch") {
              feature = buildWatchFeature(scope, dom, attrValue);
            } else {
              feature = buildAttrFeature(dom, attrName, attrValue);
            }
            if (feature) {
              if (features == null) {
                features = [];
              }
              features.push(feature);
            }
          }
        }
      }
    }
    ref1 = cola._userDomCompiler.$;
    for (o = 0, len2 = ref1.length; o < len2; o++) {
      customDomCompiler = ref1[o];
      result = customDomCompiler(scope, dom, context);
      if (result) {
        if (result instanceof cola._BindingFeature) {
          features.push(result);
        }
        if (typeof result === "function") {
          if (initializers == null) {
            initializers = [];
          }
          initializers.push(result);
        }
      }
    }
    if (removeAttrs) {
      for (q = 0, len3 = removeAttrs.length; q < len3; q++) {
        removeAttr = removeAttrs[q];
        dom.removeAttribute(removeAttr);
      }
    }
    childContext = {};
    for (k in context) {
      v = context[k];
      childContext[k] = v;
    }
    childContext.inRepeatTemplate = context.inRepeatTemplate || bindingType === "repeat";
    if (defaultPath) {
      childContext.defaultPath = defaultPath;
    }
    child = dom.firstChild;
    while (child) {
      child = _doRrenderDomTemplate(child, scope, childContext);
      child = child.nextSibling;
    }
    if (features != null ? features.length : void 0) {
      if (bindingType === "repeat") {
        domBinding = new cola._RepeatDomBinding(dom, scope, features);
        scope = domBinding.scope;
        defaultPath = scope.data.alias;
      } else if (bindingType === "alias") {
        domBinding = new cola._AliasDomBinding(dom, scope, features);
        scope = domBinding.scope;
        defaultPath = scope.data.alias;
      } else {
        domBinding = new cola._DomBinding(dom, scope, features);
      }
      if (!domBinding.feature) {
        domBinding = null;
      }
    }
    if (initializers) {
      if (context.inRepeatTemplate || (domBinding && domBinding instanceof cola._RepeatDomBinding)) {
        cola.util.userData(dom, cola.constants.DOM_INITIALIZER_KEY, initializers);
      } else {
        for (r = 0, len4 = initializers.length; r < len4; r++) {
          initializer = initializers[r];
          initializer(scope, dom);
        }
      }
    }
    if (domBinding) {
      if (!context.inRepeatTemplate) {
        domBinding.refresh(true);
      }
      if (domBinding instanceof cola._RepeatDomBinding) {
        tailDom = cola.util.userData(domBinding.dom, cola.constants.REPEAT_TAIL_KEY);
        dom = tailDom || domBinding.dom;
      }
    }
    return dom;
  };

  buildAliasFeature = function(expression) {
    return new cola._AliasFeature(expression);
  };

  buildRepeatFeature = function(expression) {
    return new cola._RepeatFeature(expression);
  };

  buildBindFeature = function(expression, dom) {
    var feature, nodeName, type;
    nodeName = dom.nodeName;
    if (nodeName === "INPUT") {
      type = dom.type;
      if (type === "checkbox") {
        feature = new cola._CheckboxFeature(expression);
      } else if (type === "radio") {
        feature = new cola._RadioFeature(expression);
      } else {
        feature = new cola._TextBoxFeature(expression);
      }
    } else if (nodeName === "SELECT") {
      feature = new cola._SelectFeature(expression);
    } else if (nodeName === "TEXTAREA") {
      feature = new cola._TextBoxFeature(expression);
    } else {
      feature = new cola._DomAttrFeature(expression, "text", false);
    }
    return feature;
  };

  createContentPart = function(part, scope) {
    var domBinding, expression, feature, textNode;
    if (part instanceof cola.Expression) {
      expression = part;
      textNode = document.createElement("span");
      feature = new cola._TextNodeFeature(expression);
      domBinding = new cola._DomBinding(textNode, scope, feature);
      domBinding.refresh();
    } else {
      textNode = document.createTextNode(part);
    }
    return textNode;
  };

  buildContent = function(parts, dom, scope) {
    var childNode, l, len1, part, partNode;
    if (parts.length === 1) {
      childNode = createContentPart(parts[0], scope);
    } else {
      childNode = document.createDocumentFragment();
      for (l = 0, len1 = parts.length; l < len1; l++) {
        part = parts[l];
        partNode = createContentPart(part, scope);
        childNode.appendChild(partNode);
      }
    }
    cola._ignoreNodeRemoved = true;
    dom.parentNode.replaceChild(childNode, dom);
    cola._ignoreNodeRemoved = false;
  };

  buildStyleFeature = function(styleStr) {
    var expression, feature, features, style, styleExpr, styleProp;
    if (!styleStr) {
      return false;
    }
    style = cola.util.parseStyleLikeString(styleStr);
    features = [];
    for (styleProp in style) {
      styleExpr = style[styleProp];
      expression = cola._compileExpression(styleExpr);
      if (expression) {
        feature = new cola._DomAttrFeature(expression, styleProp, true);
        features.push(feature);
      }
    }
    return features;
  };

  buildClassFeature = function(classStr) {
    var classConfig, classExpr, className, expression, feature, features;
    if (!classStr) {
      return false;
    }
    classConfig = cola.util.parseStyleLikeString(classStr);
    features = [];
    for (className in classConfig) {
      classExpr = classConfig[className];
      expression = cola._compileExpression(classExpr);
      if (expression) {
        feature = new cola._DomClassFeature(expression, className, true);
        features.push(feature);
      }
    }
    return features;
  };

  buildAttrFeature = function(dom, attr, expr) {
    var expression, feature;
    expression = cola._compileExpression(expr);
    if (expression) {
      if (attr === "display") {
        feature = new cola._DisplayFeature(expression);
      } else if (attr === "options" && dom.nodeName === "SELECT") {
        feature = new cola._SelectOptionsFeature(expression);
      } else {
        feature = new cola._DomAttrFeature(expression, attr, false);
      }
    }
    return feature;
  };

  buildI18NFeature = function(scope, dom, expr) {
    expr = cola.util.trim(expr);
    if (expr) {
      $fly(dom).text(cola.i18n(expr));
    }
  };

  buildWatchFeature = function(scope, dom, expr) {
    var action, feature, i, l, len1, path, pathStr, paths, ref;
    i = expr.indexOf(" on ");
    if (i > 0) {
      action = expr.substring(0, i);
      pathStr = expr.substring(i + 4);
      if (pathStr) {
        paths = [];
        ref = pathStr.split(",");
        for (l = 0, len1 = ref.length; l < len1; l++) {
          path = ref[l];
          path = cola.util.trim(path);
          if (path) {
            paths.push(path);
          }
        }
        if (paths.length) {
          feature = new cola._WatchFeature(action, paths);
        }
      }
    }
    if (!feature) {
      throw new cola.Exception("\"" + expr + "\" is not a valid watch expression.");
    }
    return feature;
  };

  buildEvent = function(scope, dom, event, expr) {
    var expression, feature;
    expression = cola._compileExpression(expr);
    if (expression) {
      feature = new cola._EventFeature(expression, event);
    }
    return feature;
  };

}).call(this);

/*! Cola UI - v1.0.0
 * Copyright (c) 2002-2016 BSTEK Corp. All rights reserved.
 *
 * This file is dual-licensed under the AGPLv3 (http://www.gnu.org/licenses/agpl-3.0.html)
 * and BSDN commercial (http://www.bsdn.org/licenses) licenses.
 *
 * If you are unsure which license is appropriate for your use, please contact the sales department
 * at http://www.bstek.com/contact.
 */(function() {
  var ACTIVE_PINCH_REG, ACTIVE_ROTATE_REG, ALIAS_REGEXP, BLANK_PATH, Column, ContentColumn, DEFAULT_DATE_DISPLAY_FORMAT, DEFAULT_DATE_INPUT_FORMAT, DEFAULT_TIME_DISPLAY_FORMAT, DEFAULT_TIME_INPUT_FORMAT, DataColumn, DropBox, GroupColumn, LIST_SIZE_PREFIXS, NestedListBind, NestedListNode, PAN_VERTICAL_EVENTS, SAFE_PULL_EFFECT, SAFE_SLIDE_EFFECT, SLIDE_ANIMATION_SPEED, SWIPE_VERTICAL_EVENTS, SelectColumn, TEMP_TEMPLATE, TreeNode, TreeNodeBind, _columnsSetter, _createGroupArray, _destroyRenderableElement, _findWidgetConfig, _getEntityId, _removeTranslateStyle, containerEmptyChildren, currentDate, currentHours, currentMinutes, currentMonth, currentSeconds, currentYear, dateTimeSlotConfigs, dateTypeConfig, dropdownDialogMargin, emptyRadioGroupItems, now, slotAttributeGetter, slotAttributeSetter,
    extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  (function() {
    var escape, isStyleFuncSupported;
    escape = function(text) {
      return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
    };
    isStyleFuncSupported = !!CSSStyleDeclaration.prototype.getPropertyValue;
    if (!isStyleFuncSupported) {
      CSSStyleDeclaration.prototype.getPropertyValue = function(a) {
        return this.getAttribute(a);
      };
      CSSStyleDeclaration.prototype.setProperty = function(styleName, value, priority) {
        var rule;
        this.setAttribute(styleName, value);
        priority = typeof priority !== 'undefined' ? priority : '';
        if (priority !== '') {
          rule = new RegExp(escape(styleName) + '\\s*:\\s*' + escape(value)(+'(\\s*;)?', 'gmi'));
          return this.cssText = this.cssText.replace(rule, styleName + ': ' + value + ' !' + priority + ';');
        }
      };
      CSSStyleDeclaration.prototype.removeProperty = function(a) {
        return this.removeAttribute(a);
      };
      return CSSStyleDeclaration.prototype.getPropertyPriority = function(styleName) {
        var rule;
        rule = new RegExp(escape(styleName) + '\\s*:\\s*[^\\s]*\\s*!important(\\s*;)?', 'gmi');
        if (rule.test(this.cssText)) {
          return 'important';
        } else {
          return '';
        }
      };
    }
  })();

  cola.util.addClass = function(dom, value, continuous) {
    var className;
    if (!continuous) {
      $(dom).addClass(value);
      return cola.util;
    }
    if (dom.nodeType === 1) {
      className = dom.className ? (" " + dom.className + " ").replace(cola.constants.CLASS_REG, " ") : " ";
      if (className.indexOf(" " + value + " ") < 0) {
        className += value + " ";
        dom.className = $.trim(className);
      }
    }
    return cola.util;
  };

  cola.util.removeClass = function(dom, value, continuous) {
    var className;
    if (!continuous) {
      $(dom).removeClass(value);
      return cola.util;
    }
    if (dom.nodeType === 1) {
      className = dom.className ? (" " + dom.className + " ").replace(cola.constants.CLASS_REG, " ") : " ";
      if (className.indexOf(" " + value + " ") >= 0) {
        className = className.replace(" " + value + " ", " ");
        dom.className = $.trim(className);
      }
    }
    return cola.util;
  };

  cola.util.toggleClass = function(dom, value, stateVal, continuous) {
    if (!continuous) {
      $(dom).toggleClass(value, !!stateVal);
      return;
    }
    if (dom.nodeType === 1) {
      if (!!stateVal) {
        this._addClass(dom, value, true);
      } else {
        this._removeClass(dom, value, true);
      }
    }
    return cola.util;
  };

  cola.util.hasClass = function(dom, className) {
    var domClassName, l, len1, name, names;
    names = className.split(/\s+/g);
    domClassName = dom.className ? (" " + dom.className + " ").replace(cola.constants.CLASS_REG, " ") : " ";
    for (l = 0, len1 = names.length; l < len1; l++) {
      name = names[l];
      if (domClassName.indexOf(" " + name + " ") < 0) {
        return false;
      }
    }
    return true;
  };

  cola.util.style = function(dom, styleName, value, priority) {
    var style;
    style = dom.style;
    if (typeof styleName !== 'undefined') {
      if (typeof value !== 'undefined') {
        priority = typeof priority !== 'undefined' ? priority : '';
        return style.setProperty(styleName, value, priority);
      } else {
        return style.getPropertyValue(styleName);
      }
    } else {
      return style;
    }
  };

  cola.util.getTextChildData = function(dom) {
    var child;
    child = dom.firstChild;
    while (child) {
      if (child.nodeType === 3) {
        return child.textContent;
      }
      child = child.nextSibling;
    }
    return null;
  };

  cola.util.eachNodeChild = function(node, fn) {
    var child;
    if (!node || !fn) {
      return cola.util;
    }
    child = node.firstChild;
    while (child) {
      if (fn(child) === false) {
        break;
      }
      child = child.nextSibling;
    }
    return cola.util;
  };

  cola.util.getScrollerRender = function(element) {
    var helperElem, perspectiveProperty, transformProperty;
    helperElem = document.createElement("div");
    perspectiveProperty = cola.Fx.perspectiveProperty;
    transformProperty = cola.Fx.transformProperty;
    if (helperElem.style[perspectiveProperty] !== void 0) {
      return function(left, top, zoom) {
        element.style[transformProperty] = 'translate3d(' + (-left) + 'px,' + (-top) + 'px,0) scale(' + zoom + ')';
      };
    } else if (helperElem.style[transformProperty] !== void 0) {
      return function(left, top, zoom) {
        element.style[transformProperty] = 'translate(' + (-left) + 'px,' + (-top) + 'px) scale(' + zoom + ')';
      };
    } else {
      return function(left, top, zoom) {
        element.style.marginLeft = left ? (-left / zoom) + 'px' : '';
        element.style.marginTop = top ? (-top / zoom) + 'px' : '';
        element.style.zoom = zoom || '';
      };
    }
  };

  cola.util.getType = (function() {
    var classToType, l, len1, name, ref;
    classToType = {};
    ref = "Boolean Number String Function Array Date RegExp Undefined Null".split(" ");
    for (l = 0, len1 = ref.length; l < len1; l++) {
      name = ref[l];
      classToType["[object " + name + "]"] = name.toLowerCase();
    }
    return function(obj) {
      var strType;
      strType = Object.prototype.toString.call(obj);
      return classToType[strType] || "object";
    };
  })();

  cola.util.typeOf = function(obj, type) {
    return cola.util.getType(obj) === type;
  };

  cola.util.getDomRect = function(dom) {
    var rect;
    rect = dom.getBoundingClientRect();
    if (isNaN(rect.height)) {
      rect.height = rect.bottom - rect.top;
    }
    if (isNaN(rect.width)) {
      rect.width = rect.right - rect.left;
    }
    return rect;
  };

  (function() {
    var cancelTranslateElement, cssPrefix, docStyle, engine, getTranslate, helperElem, perspectiveProperty, transformProperty, transformStyleName, transitionEndProperty, transitionProperty, transitionStyleName, translate3d, translateElement, vendorPrefix;
    docStyle = window.document.documentElement.style;
    translate3d = false;
    if (window.opera && Object.prototype.toString.call(opera) === '[object Opera]') {
      engine = 'presto';
    } else if ('MozAppearance' in docStyle) {
      engine = 'gecko';
    } else if ('WebkitAppearance' in docStyle) {
      engine = 'webkit';
    } else if (typeof navigator.cpuClass === 'string') {
      engine = 'trident';
    }
    vendorPrefix = {
      trident: 'ms',
      gecko: 'Moz',
      webkit: 'Webkit',
      presto: 'O'
    }[engine];
    cssPrefix = {
      trident: '-ms-',
      gecko: '-moz-',
      webkit: '-webkit-',
      presto: '-o-'
    }[engine];
    helperElem = document.createElement("div");
    perspectiveProperty = vendorPrefix + "Perspective";
    transformProperty = vendorPrefix + "Transform";
    transformStyleName = cssPrefix + "transform";
    transitionProperty = vendorPrefix + "Transition";
    transitionStyleName = cssPrefix + "transition";
    transitionEndProperty = vendorPrefix.toLowerCase() + "TransitionEnd";
    if (helperElem.style[perspectiveProperty] !== void 0) {
      translate3d = true;
    }
    getTranslate = function(element) {
      var matches, result, transform;
      result = {
        left: 0,
        top: 0
      };
      if (element === null || element.style === null) {
        return result;
      }
      transform = element.style[transformProperty];
      matches = /translate\(\s*(-?\d+(\.?\d+?)?)px,\s*(-?\d+(\.\d+)?)px\)\s*translateZ\(0px\)/g.exec(transform);
      if (matches) {
        result.left = +matches[1];
        result.top = +matches[3];
      }
      return result;
    };
    cancelTranslateElement = function(element) {
      var transformValue;
      if (element === null || element.style === null) {
        return;
      }
      transformValue = element.style[transformProperty];
      if (transformValue) {
        transformValue = transformValue.replace(/translate\(\s*(-?\d+(\.?\d+?)?)px,\s*(-?\d+(\.\d+)?)px\)\s*translateZ\(0px\)/g, "");
        return element.style[transformProperty] = transformValue;
      }
    };
    translateElement = function(element, x, y) {
      var translate, value;
      if (x === null && y === null) {
        return;
      }
      if (element === null || element.style === null) {
        return;
      }
      if (!element.style[transformProperty] && x === 0 && y === 0) {
        return;
      }
      if (x === null || y === null) {
        translate = getTranslate(element);
        if (x == null) {
          x = translate.left;
        }
        if (y == null) {
          y = translate.top;
        }
      }
      cancelTranslateElement(element);
      value = ' translate(' + (x ? x + 'px' : '0px') + ',' + (y ? y + 'px' : '0px') + ')';
      if (translate3d) {
        value += ' translateZ(0px)';
      }
      element.style[transformProperty] += value;
      return element;
    };
    return cola.Fx = {
      transitionEndProperty: transitionEndProperty,
      translate3d: translate3d,
      transformProperty: transformProperty,
      transformStyleName: transformStyleName,
      transitionProperty: transitionProperty,
      transitionStyleName: transitionStyleName,
      perspectiveProperty: perspectiveProperty,
      getElementTranslate: getTranslate,
      translateElement: translateElement,
      cancelTranslateElement: cancelTranslateElement
    };
  })();

  cola.Model.prototype.widgetConfig = function(id, config) {
    var k, ref, v;
    if (arguments.length === 1) {
      if (typeof id === "string") {
        return (ref = this._widgetConfig) != null ? ref[id] : void 0;
      } else {
        config = id;
        for (k in config) {
          v = config[k];
          this.widgetConfig(k, v);
        }
      }
    } else {
      if (this._widgetConfig == null) {
        this._widgetConfig = {};
      }
      this._widgetConfig[id] = config;
    }
  };

  cola._userDomCompiler.widget = function() {};

  ALIAS_REGEXP = new RegExp("\\$default", "g");

  _findWidgetConfig = function(scope, name) {
    var ref, widgetConfig;
    while (scope) {
      widgetConfig = (ref = scope._widgetConfig) != null ? ref[name] : void 0;
      if (widgetConfig) {
        break;
      }
      scope = scope.parent;
    }
    return widgetConfig;
  };

  cola._userDomCompiler.$.push(function(scope, dom, context) {
    var config, configKey, constr, importConfig, importName, importNames, ip, iv, jsonConfig, k, l, len1, oldParentConstr, p, ref, v, widgetConfigStr;
    if (cola.util.userData(dom, cola.constants.DOM_ELEMENT_KEY)) {
      return null;
    }
    if (dom.id) {
      jsonConfig = _findWidgetConfig(scope, dom.id);
    }
    configKey = dom.getAttribute("widget-config");
    if (configKey) {
      dom.removeAttribute("widget-config");
      config = (ref = context.widgetConfigs) != null ? ref[configKey] : void 0;
    } else {
      widgetConfigStr = dom.getAttribute("c-widget");
      if (widgetConfigStr) {
        dom.removeAttribute("c-widget");
        if (context.defaultPath) {
          widgetConfigStr = widgetConfigStr.replace(ALIAS_REGEXP, context.defaultPath);
        }
        config = cola.util.parseStyleLikeString(widgetConfigStr, "$type");
        if (config) {
          importNames = null;
          for (p in config) {
            v = config[p];
            importName = null;
            if (p.charCodeAt(0) === 35) {
              importName = p.substring(1);
            } else if (p === "$type" && typeof v === "string" && v.charCodeAt(0) === 35) {
              importName = v.substring(1);
            }
            if (importName) {
              delete config[p];
              if (importNames == null) {
                importNames = [];
              }
              importNames.push(importName);
            }
          }
          if (importNames) {
            for (l = 0, len1 = importNames.length; l < len1; l++) {
              importName = importNames[l];
              importConfig = _findWidgetConfig(scope, importName);
              if (importConfig) {
                for (ip in importConfig) {
                  iv = importConfig[ip];
                  config[ip] = iv;
                }
              }
            }
          }
        }
      }
    }
    if (!(config || jsonConfig)) {
      return null;
    }
    if (config == null) {
      config = {};
    }
    if (jsonConfig) {
      for (k in jsonConfig) {
        v = jsonConfig[k];
        config[k] = v;
      }
    }
    if (typeof config === "string") {
      config = {
        $type: config
      };
    }
    oldParentConstr = context.constr;
    constr = cola.resolveType((oldParentConstr != null ? oldParentConstr.CHILDREN_TYPE_NAMESPACE : void 0) || "widget", config, cola.Widget);
    config.$constr = context.constr = constr;
    return function(scope, dom) {
      var oldScope, widget;
      context.constr = oldParentConstr;
      config.dom = dom;
      oldScope = cola.currentScope;
      cola.currentScope = scope;
      try {
        widget = cola.widget(config);
        return widget;
      } finally {
        cola.currentScope = oldScope;
      }
    };
  });

  cola.registerTypeResolver("widget", function(config) {
    if (!(config && config.$type)) {
      return;
    }
    return cola[cola.util.capitalize(config.$type)];
  });

  cola.registerType("widget", "_default", cola.Widget);

  cola.widget = function(config, namespace) {
    var c, constr, e, ele, group, l, len1, len2, n, widget;
    if (!config) {
      return null;
    }
    if (typeof config === "string") {
      ele = window[config];
      if (!ele) {
        return null;
      }
      if (ele.nodeType) {
        widget = cola.util.userData(ele, cola.constants.DOM_ELEMENT_KEY);
        if (widget instanceof cola.Widget) {
          return widget;
        } else {
          return null;
        }
      } else {
        group = [];
        for (l = 0, len1 = ele.length; l < len1; l++) {
          e = ele[l];
          widget = cola.util.userData(e, cola.constants.DOM_ELEMENT_KEY);
          if (widget instanceof cola.Widget) {
            group.push(widget);
          }
        }
        if (group.length) {
          return cola.Element.createGroup(group);
        } else {
          return null;
        }
      }
    } else {
      if (config instanceof Array) {
        group = [];
        for (n = 0, len2 = config.length; n < len2; n++) {
          c = config[n];
          group.push(cola.widget(c));
        }
        return cola.Element.createGroup(group);
      } else if (config.nodeType === 1) {
        widget = cola.util.userData(config, cola.constants.DOM_ELEMENT_KEY);
        if (widget instanceof cola.Widget) {
          return widget;
        } else {
          return null;
        }
      } else {
        constr = config.$constr || cola.resolveType(namespace || "widget", config, cola.Widget);
        return new constr(config);
      }
    }
  };

  cola.findWidget = function(dom, type) {
    var widget;
    if (type && typeof type === "string") {
      type = cola.resolveType("widget", {
        $type: type
      });
      if (!type) {
        return null;
      }
    }
    while (dom) {
      widget = cola.util.userData(dom, cola.constants.DOM_ELEMENT_KEY);
      if (widget) {
        if (!type || widget instanceof type) {
          return widget;
        }
      }
      dom = dom.parentNode;
    }
    return null;
  };

  TEMP_TEMPLATE = null;

  cola.TemplateSupport = {
    destroy: function() {
      var name;
      if (this._templates) {
        for (name in this._templates) {
          delete this._templates[name];
        }
      }
    },
    _parseTemplates: function() {
      var child;
      if (!this._dom) {
        return;
      }
      child = this._dom.firstChild;
      while (child) {
        if (child.nodeName === "TEMPLATE") {
          this._regTemplate(child);
        }
        child = child.nextSibling;
      }
      this._regDefaultTempaltes();
    },
    _trimTemplate: function(dom) {
      var child, next;
      child = dom.firstChild;
      while (child) {
        next = child.nextSibling;
        if (child.nodeType === 3) {
          if ($.trim(child.nodeValue) === "") {
            dom.removeChild(child);
          }
        }
        child = next;
      }
    },
    _regTemplate: function(name, template) {
      if (arguments.length === 1) {
        template = name;
        if (template.nodeType) {
          name = template.getAttribute("name");
        } else {
          name = template.name;
        }
      }
      if (this._templates == null) {
        this._templates = {};
      }
      this._templates[name || "default"] = template;
    },
    _regDefaultTempaltes: function() {
      var name, ref, ref1, template;
      ref = this.constructor.TEMPLATES;
      for (name in ref) {
        template = ref[name];
        if (((ref1 = this._templates) != null ? ref1.hasOwnProperty(name) : void 0) || !template) {
          continue;
        }
        this._regTemplate(name, template);
      }
    },
    _getTemplate: function(name, defaultName) {
      var c, child, html, k, ref, template, templs, widgetConfigs;
      if (name == null) {
        name = "default";
      }
      if (!this._templates) {
        return null;
      }
      template = this._templates[name];
      if (!template && defaultName) {
        name = defaultName;
        template = this._templates[name];
      }
      if (template && !template._trimed) {
        if (template.nodeType) {
          if (template.nodeName === "TEMPLATE") {
            if (!template.firstChild) {
              html = template.innerHTML;
              if (html) {
                if (TEMP_TEMPLATE == null) {
                  TEMP_TEMPLATE = document.createElement("div");
                }
                template = TEMP_TEMPLATE;
                template.innerHTML = html;
              }
            }
            this._trimTemplate(template);
            if (template.firstChild === template.lastChild) {
              template = template.firstChild;
            } else {
              templs = [];
              child = template.firstChild;
              while (child) {
                templs.push(child);
                child = child.nextSibling;
              }
              template = templs;
            }
          }
          this._templates[name] = template;
        } else {
          if (this._doms == null) {
            this._doms = {};
          }
          template = $.xCreate(template, this._doms);
          if (this._doms.widgetConfigs) {
            if (this._templateContext == null) {
              this._templateContext = {};
            }
            if (this._templateContext.widgetConfigs) {
              widgetConfigs = this._templateContext.widgetConfigs;
              ref = this._doms.widgetConfigs;
              for (k in ref) {
                c = ref[k];
                widgetConfigs[k] = c;
              }
            } else {
              this._templateContext.widgetConfigs = this._doms.widgetConfigs;
            }
          }
          this._templates[name] = template;
        }
        template._trimed = true;
      }
      return template;
    },
    _cloneTemplate: function(template, supportMultiNodes) {
      var templ;
      if (template instanceof Array) {
        if (supportMultiNodes) {
          return (function() {
            var l, len1, results;
            results = [];
            for (l = 0, len1 = template.length; l < len1; l++) {
              templ = template[l];
              results.push(templ.cloneNode(true));
            }
            return results;
          })();
        } else {
          return template[0].cloneNode(true);
        }
      } else {
        return template.cloneNode(true);
      }
    }
  };

  cola.DataWidgetMixin = {
    _bindSetter: function(bindStr) {
      var bindInfo, bindProcessor, expression, i, l, len1, len2, len3, n, o, p, path, paths, ref, ref1;
      if (this._bindStr === bindStr) {
        return;
      }
      if (this._bindInfo) {
        bindInfo = this._bindInfo;
        if (this._watchingPaths) {
          ref = this._watchingPaths;
          for (l = 0, len1 = ref.length; l < len1; l++) {
            path = ref[l];
            this._scope.data.unbind(path.join("."), this._bindProcessor);
          }
        }
        delete this._bindInfo;
      }
      this._bindStr = bindStr;
      if (bindStr && this._scope) {
        this._bindInfo = bindInfo = {};
        bindInfo.expression = expression = cola._compileExpression(bindStr);
        if (expression.repeat || expression.setAlias) {
          throw new cola.Exception("Expression \"" + bindStr + "\" must be a simple expression.");
        }
        if ((expression.type === "MemberExpression" || expression.type === "Identifier") && !expression.hasCallStatement && !expression.convertors) {
          bindInfo.isWriteable = true;
          i = bindStr.lastIndexOf(".");
          if (i > 0) {
            bindInfo.entityPath = bindStr.substring(0, i);
            bindInfo.property = bindStr.substring(i + 1);
          } else {
            bindInfo.entityPath = null;
            bindInfo.property = bindStr;
          }
        }
        if (!this._bindProcessor) {
          this._bindProcessor = bindProcessor = {
            _processMessage: (function(_this) {
              return function(bindingPath, path, type, arg) {
                if (_this._filterDataMessage) {
                  if (!_this._filterDataMessage(path, type, arg)) {
                    return;
                  }
                } else {
                  if (!((cola.constants.MESSAGE_REFRESH <= type && type <= cola.constants.MESSAGE_CURRENT_CHANGE) || _this._watchingMoreMessage)) {
                    return;
                  }
                }
                if (_this._bindInfo.watchingMoreMessage) {
                  cola.util.delay(_this, "processMessage", 100, function() {
                    if (this._processDataMessage) {
                      this._processDataMessage(this._bindInfo.watchingPaths[0], cola.constants.MESSAGE_REFRESH, {});
                    } else {
                      this._refreshBindingValue();
                    }
                  });
                } else {
                  if (_this._processDataMessage) {
                    _this._processDataMessage(path, type, arg);
                  } else {
                    _this._refreshBindingValue();
                  }
                }
              };
            })(this)
          };
        }
        path = expression.path;
        if (!path) {
          if (expression.hasCallStatement) {
            path = "**";
            bindInfo.watchingMoreMessage = expression.hasCallStatement || expression.convertors;
          }
        } else {
          if (typeof expression.path === "string") {
            bindInfo.expressionPaths = [expression.path.split(".")];
          }
          if (expression.path instanceof Array) {
            paths = [];
            ref1 = expression.path;
            for (n = 0, len2 = ref1.length; n < len2; n++) {
              p = ref1[n];
              paths.push(p.split("."));
            }
            bindInfo.expressionPaths = paths;
          }
        }
        if (path) {
          if (typeof path === "string") {
            paths = [path];
          } else {
            paths = path;
          }
          this._watchingPaths = paths;
          for (i = o = 0, len3 = paths.length; o < len3; i = ++o) {
            p = paths[i];
            this._scope.data.bind(p, bindProcessor);
            paths[i] = p.split(".");
          }
          if (this._processDataMessage) {
            this._processDataMessage(null, cola.constants.MESSAGE_REFRESH, {});
          } else {
            this._refreshBindingValue();
          }
        }
      }
    },
    destroy: function() {
      var l, len1, path, ref;
      if (this._watchingPaths) {
        ref = this._watchingPaths;
        for (l = 0, len1 = ref.length; l < len1; l++) {
          path = ref[l];
          this._scope.data.unbind(path.join("."), this._bindProcessor);
        }
      }
    },
    _readBindingValue: function(dataCtx) {
      var ref;
      if (!((ref = this._bindInfo) != null ? ref.expression : void 0)) {
        return;
      }
      if (dataCtx == null) {
        dataCtx = {};
      }
      return this._bindInfo.expression.evaluate(this._scope, "async", dataCtx);
    },
    _writeBindingValue: function(value) {
      var ref;
      if (!((ref = this._bindInfo) != null ? ref.expression : void 0)) {
        return;
      }
      if (!this._bindInfo.isWriteable) {
        throw new cola.Exception("Expression \"" + this._bindStr + "\" is not writable.");
      }
      this._scope.set(this._bindStr, value);
    },
    _getBindingProperty: function() {
      var ref;
      if (!(((ref = this._bindInfo) != null ? ref.expression : void 0) && this._bindInfo.isWriteable)) {
        return;
      }
      return this._scope.data.getProperty(this._bindStr);
    },
    _getBindingDataType: function() {
      var ref;
      if (!(((ref = this._bindInfo) != null ? ref.expression : void 0) && this._bindInfo.isWriteable)) {
        return;
      }
      return this._scope.data.getDataType(this._bindStr);
    },
    _isRootOfTarget: function(changedPath, targetPath) {
      var i, isRoot, l, len1, len2, len3, n, o, part, targetPaths;
      if (!changedPath || !targetPath) {
        return true;
      }
      if (targetPath instanceof Array) {
        targetPaths = targetPath;
        for (l = 0, len1 = targetPaths.length; l < len1; l++) {
          targetPath = targetPaths[l];
          isRoot = true;
          for (i = n = 0, len2 = changedPath.length; n < len2; i = ++n) {
            part = changedPath[i];
            if (part !== targetPath[i]) {
              isRoot = false;
              break;
            }
          }
          if (isRoot) {
            return true;
          }
        }
        return false;
      } else {
        for (i = o = 0, len3 = changedPath.length; o < len3; i = ++o) {
          part = changedPath[i];
          if (part !== targetPath[i]) {
            return false;
          }
        }
        return true;
      }
    }
  };

  cola.DataItemsWidgetMixin = {
    _alias: "item",
    _bindSetter: function(bindStr) {
      var expression;
      if (this._bindStr === bindStr) {
        return;
      }
      this._bindStr = bindStr;
      this._itemsRetrieved = false;
      if (bindStr && this._scope) {
        expression = cola._compileExpression(bindStr, "repeat");
        if (!expression.repeat) {
          throw new cola.Exception("Expression \"" + bindStr + "\" must be a repeat expression.");
        }
        this._alias = expression.alias;
      }
      this._itemsScope.setExpression(expression);
    },
    constructor: function() {
      var itemsScope;
      this._itemsScope = itemsScope = new cola.ItemsScope(this._scope);
      itemsScope.onItemsRefresh = (function(_this) {
        return function(arg) {
          return _this._onItemsRefresh(arg);
        };
      })(this);
      itemsScope.onItemRefresh = (function(_this) {
        return function(arg) {
          return _this._onItemRefresh(arg);
        };
      })(this);
      itemsScope.onItemInsert = (function(_this) {
        return function(arg) {
          return _this._onItemInsert(arg);
        };
      })(this);
      itemsScope.onItemRemove = (function(_this) {
        return function(arg) {
          return _this._onItemRemove(arg);
        };
      })(this);
      if (this._onCurrentItemChange) {
        return itemsScope.onCurrentItemChange = (function(_this) {
          return function(arg) {
            return _this._onCurrentItemChange(arg);
          };
        })(this);
      }
    },
    _getItems: function() {
      if (!this._itemsRetrieved) {
        this._itemsRetrieved = true;
        this._itemsScope.retrieveItems();
      }
      return {
        items: this._itemsScope.items,
        originItems: this._itemsScope.originItems
      };
    }
  };

  cola.semantic = {

    /*
    	fixVisibilityOnUpdate和fixVisibilityOnRefresh方法用于修正SemanticUI中visibility的一处计算错误。
       当我们尝试利用visibility处理非body的滚动时，SemanticUI中的一处对jQuery.offset()的误用导致获得对象偏移量总是相对于document的，而非实际滚动的容器。
       使用时，将fixVisibilityOnUpdate和fixVisibilityOnRefresh方法分别定义为visibility的onUpdate和onRefresh监听器。
     */
    fixVisibilityOnUpdate: function(calculations) {
      if (this._offset == null) {
        this._offset = {
          left: this.offsetLeft,
          top: this.offsetTop
        };
      }
      calculations.offset = this._offset;
    },
    fixVisibilityOnRefresh: function() {
      this._offset = {
        left: this.offsetLeft,
        top: this.offsetTop
      };
    }
  };

  ACTIVE_PINCH_REG = /^pinch/i;

  ACTIVE_ROTATE_REG = /^rotate/i;

  PAN_VERTICAL_EVENTS = ["panUp", "panDown"];

  SWIPE_VERTICAL_EVENTS = ["swipeUp", "swipeDown"];


  /*
      ClassName池对象
      用于刷新组件时频繁的编辑class name提高性能
   */

  cola.ClassNamePool = (function() {
    function ClassNamePool(domClass, semanticList) {
      if (semanticList == null) {
        semanticList = [];
      }
      this.elements = [];
      domClass = domClass ? (" " + domClass + " ").replace(cola.constants.CLASS_REG, " ") : " ";
      semanticList.forEach((function(_this) {
        return function(name) {
          var klass;
          klass = " " + name + " ";
          if (domClass.indexOf(klass) > -1) {
            domClass = domClass.replace(klass, " ");
            _this.add(name);
          }
        };
      })(this));
      $.trim(domClass).split(" ").forEach((function(_this) {
        return function(klass) {
          _this.add(klass);
        };
      })(this));
    }

    ClassNamePool.prototype.add = function(className) {
      var index;
      if (!className) {
        return;
      }
      index = this.elements.indexOf(className);
      if (index > -1) {
        return;
      }
      return this.elements.push(className);
    };

    ClassNamePool.prototype.remove = function(className) {
      var i;
      i = this.elements.indexOf(className);
      if (i > -1) {
        this.elements.splice(i, 1);
      }
      return this;
    };

    ClassNamePool.prototype.destroy = function() {
      return delete this["elements"];
    };

    ClassNamePool.prototype.join = function() {
      return this.elements.join(" ");
    };

    ClassNamePool.prototype.toggle = function(className, status) {
      if (!!status) {
        this.add(className);
      } else {
        this.remove(className);
      }
    };

    return ClassNamePool;

  })();

  _destroyRenderableElement = function(node, data) {
    var element;
    element = data[cola.constants.DOM_ELEMENT_KEY];
    if (!(typeof element === "function" ? element(_destroyed) : void 0)) {
      element._domRemoved = true;
      element.destroy();
    }
  };


  /*
      可渲染元素
   */

  cola.RenderableElement = (function(superClass) {
    extend(RenderableElement, superClass);

    RenderableElement.TAG_NAME = "DIV";

    function RenderableElement(config) {
      var dom;
      if (config) {
        dom = config.dom;
        if (dom) {
          delete config.dom;
        }
      }
      if (this._doms == null) {
        this._doms = {};
      }
      RenderableElement.__super__.constructor.call(this, config);
      if (dom) {
        this._setDom(dom, true);
      }
    }

    RenderableElement.prototype._initDom = function(dom) {};

    RenderableElement.prototype._parseDom = function(dom) {};

    RenderableElement.prototype._setDom = function(dom, parseChild) {
      if (!dom) {
        return;
      }
      this._dom = dom;
      cola.util.userData(dom, cola.constants.DOM_ELEMENT_KEY, this);
      cola.util.onNodeRemoved(dom, _destroyRenderableElement);
      if (parseChild) {
        this._parseDom(dom);
      }
      this._initDom(dom);
      this._refreshDom();
      this._rendered = true;
    };

    RenderableElement.prototype._createDom = function() {
      var className, dom;
      dom = document.createElement(this.constructor.TAG_NAME || "div");
      className = this.constructor.CLASS_NAME || "";
      dom.className = "ui " + className;
      return dom;
    };

    RenderableElement.prototype._doSet = function(attr, attrConfig, value) {
      if ((attrConfig != null ? attrConfig.refreshDom : void 0) && this._dom) {
        cola.util.delay(this, "refreshDom", 50, this._refreshDom);
      }
      return RenderableElement.__super__._doSet.call(this, attr, attrConfig, value);
    };

    RenderableElement.prototype._doRefreshDom = function() {
      var className, l, len1, name, names;
      cola.util.cancelDelay(this, "_refreshDom");
      if (!this._dom) {
        return;
      }
      this._classNamePool.add("ui");
      className = this.constructor.CLASS_NAME;
      if (className) {
        names = $.trim(className).split(" ");
        for (l = 0, len1 = names.length; l < len1; l++) {
          name = names[l];
          this._classNamePool.add(name);
        }
      }
      this._resetDimension();
    };

    RenderableElement.prototype._refreshDom = function() {
      var newClassName;
      if (!(this._dom || !this._destroyed)) {
        return;
      }
      this._classNamePool = new cola.ClassNamePool(this._dom.className, this.constructor.SEMANTIC_CLASS);
      this._doRefreshDom();
      newClassName = $.trim(this._classNamePool.join());
      this._dom.className = newClassName;
      this._classNamePool.destroy();
      delete this["_classNamePool"];
    };

    RenderableElement.prototype._resetDimension = function() {};

    RenderableElement.prototype.getDom = function() {
      var arg, dom;
      if (this._destroyed) {
        return null;
      }
      if (!this._dom) {
        dom = this._createDom();
        this._setDom(dom);
        arg = {
          dom: dom,
          returnValue: null
        };
        this.fire("createDom", this, arg);
      }
      return this._dom;
    };

    RenderableElement.prototype.get$Dom = function() {
      if (this._destroyed) {
        return null;
      }
      if (this._$dom == null) {
        this._$dom = $(this.getDom());
      }
      return this._$dom;
    };

    RenderableElement.prototype.refresh = function() {
      var arg;
      if (!this._dom) {
        return this;
      }
      this._refreshDom();
      arg = {
        dom: this._dom,
        returnValue: null
      };
      this.fire("refreshDom", this, arg);
      return this;
    };

    RenderableElement.prototype.appendTo = function(parentNode) {
      if (parentNode && this.getDom()) {
        $(parentNode).append(this._dom);
      }
      return this;
    };

    RenderableElement.prototype.remove = function() {
      this.get$Dom().remove();
      return this;
    };

    RenderableElement.prototype.destroy = function() {
      if (this._destroyed) {
        return;
      }
      cola.util.cancelDelay(this, "refreshDom");
      if (this._dom) {
        if (!this._domRemoved) {
          this.remove();
        }
        delete this._dom;
        delete this._$dom;
      }
      RenderableElement.__super__.destroy.call(this);
      this._destroyed = true;
    };

    RenderableElement.prototype.addClass = function(value, continuous) {
      if (continuous) {
        cola.util.addClass(this._dom, value, true);
      } else {
        this.get$Dom().addClass(value);
      }
      return this;
    };

    RenderableElement.prototype.removeClass = function(value, continuous) {
      if (continuous) {
        cola.util.removeClass(this._dom, value, true);
      } else {
        this.get$Dom().removeClass(value);
      }
      return this;
    };

    RenderableElement.prototype.toggleClass = function(value, state, continuous) {
      if (continuous) {
        cola.util.toggleClass(this._dom, value, state, true);
      } else {
        this.get$Dom().toggleClass(value, state);
      }
      return this;
    };

    RenderableElement.prototype.hasClass = function(value, continuous) {
      if (continuous) {
        return cola.util.hasClass(this._dom, value, true);
      } else {
        return this.get$Dom().hasClass(value);
      }
    };

    return RenderableElement;

  })(cola.Element);


  /*
  Dorado 基础组件
   */

  cola.Widget = (function(superClass) {
    extend(Widget, superClass);

    function Widget() {
      return Widget.__super__.constructor.apply(this, arguments);
    }

    Widget.CLASS_NAME = "control";

    Widget.SEMANTIC_CLASS = ["left floated", "right floated"];

    Widget.ATTRIBUTES = {
      display: {
        defaultValue: true,
        refreshDom: true,
        type: "boolean"
      },
      float: {
        refreshDom: true,
        "enum": ["left", "right", ""],
        defaultValue: "",
        setter: function(value) {
          var oldValue;
          oldValue = this["_float"];
          if (this._dom && oldValue && oldValue !== value) {
            cola.util.removeClass(this._dom, oldValue + " floated", true);
          }
          this["_float"] = value;
        }
      },
      "class": {
        refreshDom: true,
        setter: function(value) {
          var oldValue;
          oldValue = this["_class"];
          if (oldValue && this._dom && oldValue !== value) {
            this.get$Dom().removeClass(oldValue);
          }
          this["_class"] = value;
        }
      },
      popup: {
        setter: function(value) {
          var options;
          options = {};
          if (typeof value === "string") {
            options.content = value;
          } else if (value.constructor === Object.prototype.constructor && value.tagName) {
            options.html = $.xCreate(value);
          } else if (value.nodeType === 1) {
            options.html = value;
          } else {
            options = value;
          }
          this._popup = options;
          if (this._dom) {
            this.get$Dom().popup(this._popup);
          }
        }
      },
      dimmer: {
        setter: function(value) {
          var k, v;
          if (this._dimmer == null) {
            this._dimmer = {};
          }
          for (k in value) {
            v = value[k];
            this._dimmer[k] = v;
          }
        }
      },
      height: {
        refreshDom: true
      },
      width: {
        refreshDom: true
      }
    };

    Widget.EVENTS = {
      createDom: null,
      refreshDom: null,
      click: {
        $event: "click"
      },
      dblClick: {
        $event: "dblclick"
      },
      mouseDown: {
        $event: "mousedown"
      },
      mouseUp: {
        $event: "mouseup"
      },
      tap: {
        hammerEvent: "tap"
      },
      press: {
        hammerEvent: "press"
      },
      panStart: {
        hammerEvent: "panstart"
      },
      panMove: {
        hammerEvent: "panmove"
      },
      panEnd: {
        hammerEvent: "panend"
      },
      panCancel: {
        hammerEvent: "pancancel"
      },
      panLeft: {
        hammerEvent: "panleft"
      },
      panRight: {
        hammerEvent: "panright"
      },
      panUp: {
        hammerEvent: "panup"
      },
      panDown: {
        hammerEvent: "pandown"
      },
      pinchStart: {
        hammerEvent: "pinchstart"
      },
      pinchMove: {
        hammerEvent: "pinchmove"
      },
      pinchEnd: {
        hammerEvent: "pinchend"
      },
      pinchCancel: {
        hammerEvent: "pinchcancel"
      },
      pinchIn: {
        hammerEvent: "pinchin"
      },
      pinchOut: {
        hammerEvent: "pinchout"
      },
      rotateStart: {
        hammerEvent: "rotatestart"
      },
      rotateMove: {
        hammerEvent: "rotatemove"
      },
      rotateEnd: {
        hammerEvent: "rotateend"
      },
      rotateCancel: {
        hammerEvent: "rotatecancel"
      },
      swipeLeft: {
        hammerEvent: "swipeleft"
      },
      swipeRight: {
        hammerEvent: "swiperight"
      },
      swipeUp: {
        hammerEvent: "swipeup"
      },
      swipeDown: {
        hammerEvent: "swipedown"
      }
    };

    Widget.prototype._setDom = function(dom, parseChild) {
      var eventName;
      if (!dom) {
        return;
      }
      Widget.__super__._setDom.call(this, dom, parseChild);
      for (eventName in this.constructor.EVENTS) {
        if (this.getListeners(eventName)) {
          this._bindEvent(eventName);
        }
      }
      if (this._popup) {
        $(dom).popup(this._popup);
      }
    };

    Widget.prototype._on = function(eventName, listener, alias) {
      Widget.__super__._on.call(this, eventName, listener, alias);
      if (this._dom) {
        this._bindEvent(eventName);
      }
      return this;
    };

    Widget.prototype.fire = function(eventName, self, arg) {
      var eventConfig;
      if (!this._eventRegistry) {
        return true;
      }
      eventConfig = this.constructor.EVENTS[eventName];
      if (this.constructor.ATTRIBUTES.hasOwnProperty("disabled") && this.get("disabled") && eventConfig && (eventConfig.$event || eventConfig.hammerEvent)) {
        return true;
      }
      if (!this["_hasFireTapEvent"]) {
        this["_hasFireTapEvent"] = eventName === "tap";
      }
      if (eventName === "click" && this["_hasFireTapEvent"]) {
        return true;
      }
      return Widget.__super__.fire.call(this, eventName, self, arg);
    };

    Widget.prototype._doRefreshDom = function() {
      var l, len1, name, ref;
      if (!this._dom) {
        return;
      }
      Widget.__super__._doRefreshDom.call(this);
      if (this._float) {
        this._classNamePool.add(this._float + " floated");
      }
      this._classNamePool.toggle("display-none", !!!this._display);
      if (!this._rendered && this._class) {
        ref = this._class.split(" ");
        for (l = 0, len1 = ref.length; l < len1; l++) {
          name = ref[l];
          this._classNamePool.add(name);
        }
      }
    };

    Widget.prototype._bindEvent = function(eventName) {
      var $dom, eventConfig;
      if (!this._dom) {
        return;
      }
      if (this._bindedEvents == null) {
        this._bindedEvents = {};
      }
      if (this._bindedEvents[eventName]) {
        return;
      }
      $dom = this.get$Dom();
      eventConfig = this.constructor.EVENTS[eventName];
      if (eventConfig != null ? eventConfig.$event : void 0) {
        $dom.on(eventConfig.$event, (function(_this) {
          return function(evt) {
            var arg;
            arg = {
              dom: _this._dom,
              event: evt,
              returnValue: null
            };
            _this.fire(eventName, _this, arg);
          };
        })(this));
        this._bindedEvents[eventName] = true;
        return;
      }
      if (eventConfig != null ? eventConfig.hammerEvent : void 0) {
        if (this._hammer == null) {
          this._hammer = new Hammer(this._dom, {});
        }
        if (ACTIVE_PINCH_REG.test(eventName)) {
          this._hammer.get("pinch").set({
            enable: true
          });
        }
        if (ACTIVE_ROTATE_REG.test(eventName)) {
          this._hammer.get("rotate").set({
            enable: true
          });
        }
        if (PAN_VERTICAL_EVENTS.indexOf(eventName) >= 0) {
          this._hammer.get("pan").set({
            direction: Hammer.DIRECTION_ALL
          });
        }
        if (SWIPE_VERTICAL_EVENTS.indexOf(eventName) >= 0) {
          this._hammer.get("swipe").set({
            direction: Hammer.DIRECTION_ALL
          });
        }
        this._hammer.on(eventConfig.hammerEvent, (function(_this) {
          return function(evt) {
            var arg;
            arg = {
              dom: _this._dom,
              event: evt,
              returnValue: null,
              eventName: eventName
            };
            return _this.fire(eventName, _this, arg);
          };
        })(this));
        this._bindedEvents[eventName] = true;
        return;
      }
    };

    Widget.prototype._resetDimension = function() {
      var $dom, height, unit, width;
      $dom = this.get$Dom();
      unit = cola.constants.WIDGET_DIMENSION_UNIT;
      height = this.get("height");
      if (isFinite(height)) {
        height = "" + (parseInt(height)) + unit;
      }
      if (height) {
        $dom.css("height", height);
      }
      width = this.get("width");
      if (isFinite(width)) {
        width = "" + (parseInt(width)) + unit;
      }
      if (width) {
        $dom.css("width", width);
      }
    };

    Widget.prototype.showDimmer = function(options) {
      var $dom, content, dimmer, dimmerContent, k, v;
      if (options == null) {
        options = {};
      }
      if (!this._dom) {
        return this;
      }
      content = options.content;
      if (!content && this._dimmer) {
        content = this._dimmer.content;
      }
      if (content) {
        if (typeof content === "string") {
          dimmerContent = $.xCreate({
            tagName: "div",
            content: content
          });
        } else if (content.constructor === Object.prototype.constructor && content.tagName) {
          dimmerContent = $.xCreate(content);
        } else if (content.nodeType === 1) {
          dimmerContent = content;
        }
      }
      if (this._dimmer == null) {
        this._dimmer = {};
      }
      for (k in options) {
        v = options[k];
        if (k !== "content") {
          this._dimmer[k] = v;
        }
      }
      $dom = this.get$Dom();
      dimmer = $dom.dimmer("get dimmer");
      if (dimmerContent) {
        if (dimmer) {
          $(dimmer).empty();
        } else {
          $dom.dimmer("create");
        }
        $dom.dimmer("add content", dimmerContent);
      }
      $dom.dimmer(this._dimmer);
      $dom.dimmer("show");
      return this;
    };

    Widget.prototype.hideDimmer = function() {
      if (!this._dom) {
        return this;
      }
      this.get$Dom().dimmer("hide");
      return this;
    };

    Widget.prototype.destroy = function() {
      if (this._destroyed) {
        return;
      }
      if (this._dom) {
        delete this._hammer;
        delete this._bindedEvents;
        delete this._parent;
        delete this._doms;
      }
      Widget.__super__.destroy.call(this);
      this._destroyed = true;
    };

    return Widget;

  })(cola.RenderableElement);

  cola.floatWidget = {
    _zIndex: 1100,
    zIndex: function() {
      return ++cola.floatWidget._zIndex;
    }
  };

  containerEmptyChildren = [];

  cola.AbstractContainer = (function(superClass) {
    extend(AbstractContainer, superClass);

    function AbstractContainer() {
      return AbstractContainer.__super__.constructor.apply(this, arguments);
    }

    AbstractContainer.ATTRIBUTES = {
      content: {
        setter: function(value) {
          this._setContent(value, "content");
          return this;
        }
      }
    };

    AbstractContainer.prototype._initDom = function(dom) {
      var el, l, len1, ref;
      if (this._content) {
        ref = this._content;
        for (l = 0, len1 = ref.length; l < len1; l++) {
          el = ref[l];
          this._render(el, "content");
        }
      }
    };

    AbstractContainer.prototype._parseDom = function(dom) {
      var child, widget;
      if (this._content == null) {
        this._content = [];
      }
      child = dom.firstChild;
      while (child) {
        if (child.nodeType === 1) {
          widget = cola.widget(child);
          if (widget) {
            this._content.push(widget);
          }
        }
        child = child.nextSibling;
      }
    };

    AbstractContainer.prototype.getContentContainer = function() {
      return this.getDom();
    };

    AbstractContainer.prototype._clearContent = function(target) {
      var el, l, len1, old;
      old = this["_" + target];
      if (old) {
        for (l = 0, len1 = old.length; l < len1; l++) {
          el = old[l];
          if (el instanceof cola.widget) {
            el.destroy();
          }
        }
        this["_" + target] = [];
      }
      if (this._doms == null) {
        this._doms = {};
      }
      if (this._doms[target]) {
        $(this._doms[target]).empty();
      }
    };

    AbstractContainer.prototype._setContent = function(value, target) {
      var el, l, len1, result;
      this._clearContent(target);
      if (value instanceof Array) {
        for (l = 0, len1 = value.length; l < len1; l++) {
          el = value[l];
          result = cola.xRender(el, this._scope);
          if (result) {
            this._addContentElement(result, target);
          }
        }
      } else {
        result = cola.xRender(value, this._scope);
        if (result) {
          this._addContentElement(result, target);
        }
      }
    };

    AbstractContainer.prototype._makeContentDom = function(target) {
      if (this._doms == null) {
        this._doms = {};
      }
      this._doms[target] = this._dom;
      return this._dom;
    };

    AbstractContainer.prototype._addContentElement = function(element, target) {
      var dom, name, targetList;
      name = "_" + target;
      if (this[name] == null) {
        this[name] = [];
      }
      targetList = this[name];
      dom = null;
      if (element instanceof cola.Widget) {
        targetList.push(element);
        if (this._dom) {
          dom = element.getDom();
        }
      } else if (element.nodeType) {
        targetList.push(element);
        dom = element;
      }
      if (dom && this._dom) {
        this._render(dom, target);
      }
    };

    AbstractContainer.prototype._render = function(node, target) {
      var dom;
      if (this._doms == null) {
        this._doms = {};
      }
      if (!this._doms[target]) {
        this._makeContentDom(target);
      }
      dom = node;
      if (node instanceof cola.Widget) {
        dom = node.getDom();
      }
      if (dom.parentNode !== this._doms[target]) {
        this._doms[target].appendChild(dom);
      }
    };

    AbstractContainer.prototype.destroy = function() {
      var child, l, len1, ref;
      if (this._destroyed) {
        return;
      }
      if (this._content) {
        ref = this._content;
        for (l = 0, len1 = ref.length; l < len1; l++) {
          child = ref[l];
          if (typeof child.destroy === "function") {
            child.destroy();
          }
        }
        delete this._content;
      }
      AbstractContainer.__super__.destroy.call(this);
      return this;
    };

    return AbstractContainer;

  })(cola.Widget);

  cola.Link = (function(superClass) {
    extend(Link, superClass);

    function Link() {
      return Link.__super__.constructor.apply(this, arguments);
    }

    Link.TAG_NAME = "a";

    Link.ATTRIBUTES = {
      href: {
        refreshDom: true
      },
      target: {
        refreshDom: true
      }
    };

    Link.prototype._setDom = function(dom, parseChild) {
      var href, target;
      if (parseChild) {
        if (!this._href) {
          href = dom.getAttribute("href");
          if (href) {
            this._href = href;
          }
        }
        if (!this._target) {
          target = dom.getAttribute("target");
          if (target) {
            this._target = target;
          }
        }
      }
      return Link.__super__._setDom.call(this, dom, parseChild);
    };

    Link.prototype._doRefreshDom = function() {
      var $dom;
      if (!this._dom) {
        return;
      }
      Link.__super__._doRefreshDom.call(this);
      $dom = this.get$Dom();
      if (this._href) {
        $dom.attr("href", this._href);
      } else {
        $dom.removeAttr("href");
      }
      return $dom.attr("target", this._target || "");
    };

    return Link;

  })(cola.AbstractContainer);


  /*
      按钮的抽象类
   */

  cola.AbstractButton = (function(superClass) {
    extend(AbstractButton, superClass);

    function AbstractButton() {
      return AbstractButton.__super__.constructor.apply(this, arguments);
    }

    AbstractButton.ATTRIBUTES = {
      size: {
        "enum": ["mini", "tiny", "small", "medium", "large", "big", "huge", "massive"],
        refreshDom: true,
        setter: function(value) {
          var oldValue;
          oldValue = this._size;
          if (oldValue && oldValue !== value && this._dom) {
            this.removeClass(oldValue);
          }
          this._size = value;
        }
      },
      color: {
        refreshDom: true,
        "enum": ["red", "orange", "yellow", "olive", "green", "teal", "blue", "violet", "purple", "pink", "brown", "grey", "black"],
        setter: function(value) {
          var oldValue;
          oldValue = this._color;
          if (oldValue && oldValue !== value && this._dom) {
            this.removeClass(oldValue);
          }
          this._color = value;
        }
      },
      attached: {
        refreshDom: true,
        defaultValue: "",
        "enum": ["left", "right", "top", "bottom", ""],
        setter: function(value) {
          var oldValue;
          oldValue = this._attached;
          if (oldValue && oldValue !== value && this._dom) {
            this.removeClass(oldValue + " attached", true);
          }
          this._attached = value;
        }
      }
    };

    AbstractButton.prototype._doRefreshDom = function() {
      var attached, color, size;
      if (!this._dom) {
        return;
      }
      AbstractButton.__super__._doRefreshDom.call(this);
      size = this.get("size");
      if (size) {
        this._classNamePool.add(size);
      }
      color = this.get("color");
      if (color) {
        this._classNamePool.add(color);
      }
      attached = this.get("attached");
      if (attached) {
        this._classNamePool.add(attached + " attached");
      }
    };

    return AbstractButton;

  })(cola.Widget);

  cola.Button = (function(superClass) {
    extend(Button, superClass);

    function Button() {
      return Button.__super__.constructor.apply(this, arguments);
    }

    Button.SEMANTIC_CLASS = ["left floated", "right floated", "top attached", "bottom attached", "left attached", "right attached"];

    Button.CLASS_NAME = "button";

    Button.ATTRIBUTES = {
      caption: {
        refreshDom: true
      },
      icon: {
        refreshDom: true,
        setter: function(value) {
          var oldValue, ref;
          oldValue = this._icon;
          this._icon = value;
          if (oldValue && oldValue !== value && this._dom && ((ref = this._doms) != null ? ref.iconDom : void 0)) {
            $fly(this._doms.iconDom).removeClass(oldValue);
          }
        }
      },
      iconPosition: {
        refreshDom: true,
        defaultValue: "left",
        "enum": ["left", "right"]
      },
      focusable: {
        type: "boolean",
        refreshDom: true,
        defaultValue: false
      },
      disabled: {
        type: "boolean",
        refreshDom: true,
        defaultValue: false
      },
      states: {
        refreshDom: true,
        defaultValue: "",
        "enum": ["loading", "active", ""],
        setter: function(value) {
          var oldValue;
          oldValue = this._states;
          if (oldValue && oldValue !== value && this._dom) {
            $fly(this._dom).removeClass(oldValue);
          }
          this._states = value;
        }
      }
    };

    Button.prototype._parseDom = function(dom) {
      var child, text;
      if (!this._caption) {
        child = dom.firstChild;
        while (child) {
          if (child.nodeType === 3) {
            text = child.textContent;
            if (text) {
              this._caption = text;
              child.textContent = "";
              break;
            }
          }
          child = child.nextSibling;
        }
      }
    };

    Button.prototype._refreshIcon = function() {
      var $dom, base, caption, icon, iconDom, iconPosition;
      if (!this._dom) {
        return;
      }
      $dom = this.get$Dom();
      this._classNamePool.remove("right labeled");
      this._classNamePool.remove("left labeled");
      this._classNamePool.remove("labeled");
      this._classNamePool.remove("icon");
      icon = this.get("icon");
      iconPosition = this.get("iconPosition");
      caption = this.get("caption");
      if (icon) {
        if (caption) {
          if (iconPosition === "right") {
            this._classNamePool.add("right labeled");
          } else {
            this._classNamePool.add("labeled");
          }
        }
        this._classNamePool.add("icon");
        if ((base = this._doms).iconDom == null) {
          base.iconDom = document.createElement("i");
        }
        iconDom = this._doms.iconDom;
        $fly(iconDom).addClass(icon + " icon");
        if (iconDom.parentNode !== this._dom) {
          $dom.append(iconDom);
        }
      } else if (this._doms.iconDom) {
        $fly(this._doms.iconDom).remove();
      }
    };

    Button.prototype._doRefreshDom = function() {
      var $dom, caption, captionDom, classNamePool, states;
      if (!this._dom) {
        return;
      }
      Button.__super__._doRefreshDom.call(this);
      $dom = this.get$Dom();
      classNamePool = this._classNamePool;
      caption = this._caption;
      captionDom = this._doms.captionDom;
      if (caption) {
        if (!captionDom) {
          captionDom = document.createElement("span");
          this._doms.captionDom = captionDom;
        }
        $fly(captionDom).text(caption);
        if (captionDom.parentNode !== this._dom) {
          $dom.append(captionDom);
        }
      } else {
        if (captionDom) {
          $fly(captionDom).remove();
        }
      }
      if (this.get("focusable")) {
        $dom.attr("tabindex", "0");
      } else {
        $dom.removeAttr("tabindex");
      }
      this._refreshIcon();
      states = this._states;
      if (states) {
        classNamePool.add(states);
      }
      classNamePool.toggle("disabled", this._disabled);
    };

    return Button;

  })(cola.AbstractButton);

  cola.buttonGroup = {};

  cola.buttonGroup.Separator = (function(superClass) {
    extend(Separator, superClass);

    function Separator() {
      return Separator.__super__.constructor.apply(this, arguments);
    }

    Separator.SEMANTIC_CLASS = [];

    Separator.CLASS_NAME = "or";

    Separator.ATTRIBUTES = {
      text: {
        defaultValue: "or",
        refreshDom: true
      }
    };

    Separator.prototype._parseDom = function(dom) {
      var text;
      if (!dom) {
        return;
      }
      if (!this._text) {
        text = this._dom.getAttribute("data-text");
        if (text) {
          this._text = text;
        }
      }
    };

    Separator.prototype._doRefreshDom = function() {
      if (!this._dom) {
        return;
      }
      Separator.__super__._doRefreshDom.call(this);
      if (this._dom) {
        this.get$Dom().attr("data-text", this._text);
      }
      return this;
    };

    return Separator;

  })(cola.Widget);

  cola.buttonGroup.emptyItems = [];

  cola.ButtonGroup = (function(superClass) {
    extend(ButtonGroup, superClass);

    function ButtonGroup() {
      return ButtonGroup.__super__.constructor.apply(this, arguments);
    }

    ButtonGroup.SEMANTIC_CLASS = ["left floated", "right floated", "top attached", "bottom attached", "left attached", "right attached"];

    ButtonGroup.CHILDREN_TYPE_NAMESPACE = "button-group";

    ButtonGroup.CLASS_NAME = "buttons";

    ButtonGroup.ATTRIBUTES = {
      fluid: {
        type: "boolean",
        refreshDom: true,
        attrName: "c-fuild",
        defaultValue: false
      },
      mutuallyExclusive: {
        type: "boolean",
        refreshDom: true,
        defaultValue: true
      },
      items: {
        setter: function(value) {
          var item, l, len1;
          this.clear();
          if (value instanceof Array) {
            for (l = 0, len1 = value.length; l < len1; l++) {
              item = value[l];
              this.addItem(item);
            }
          }
        }
      }
    };

    ButtonGroup.prototype._setDom = function(dom, parseChild) {
      var activeExclusive, item, itemDom, l, len1, ref, ref1;
      ButtonGroup.__super__._setDom.call(this, dom, parseChild);
      if ((ref = this._items) != null ? ref.length : void 0) {
        ref1 = this._items;
        for (l = 0, len1 = ref1.length; l < len1; l++) {
          item = ref1[l];
          itemDom = item.getDom();
          if (itemDom.parentNode !== dom) {
            item.appendTo(this._dom);
          }
        }
      }
      activeExclusive = (function(_this) {
        return function(targetDom) {
          var targetBtn;
          if (!_this._mutuallyExclusive) {
            return;
          }
          if (cola.util.hasClass(targetDom, "disabled") || cola.util.hasClass(targetDom, "loading") || cola.util.hasClass(targetDom, "active")) {
            return;
          }
          $(">.ui.button.active", _this._dom).each(function(index, itemDom) {
            var button;
            if (itemDom !== targetDom) {
              button = cola.widget(itemDom);
              if (button) {
                button.set("states", "");
              } else {
                $(itemDom).removeClass("active");
              }
            }
          });
          targetBtn = cola.widget(targetDom);
          if (targetBtn) {
            targetBtn.set("states", "active");
          } else {
            $fly(targetDom).addClass("active");
          }
        };
      })(this);
      return this.get$Dom().delegate(">.ui.button", "click", function(event) {
        return activeExclusive(this, event);
      });
    };

    ButtonGroup.prototype._parseDom = function(dom) {
      var child, widget;
      if (!dom) {
        return;
      }
      child = dom.firstChild;
      while (child) {
        if (child.nodeType === 1) {
          widget = cola.widget(child);
          if (widget) {
            if (widget instanceof cola.Button || widget instanceof cola.buttonGroup.Separator) {
              this.addItem(widget);
            }
          }
        }
        child = child.nextSibling;
      }
    };

    ButtonGroup.prototype._resetFluid = function() {
      var $dom, attrName, fluid, item, items, l, len1, newFluid, oldFluid;
      if (!this._dom) {
        return;
      }
      $dom = this.get$Dom();
      attrName = this.constructor.ATTRIBUTES.fluid.attrName;
      oldFluid = $dom.attr(attrName);
      newFluid = 0;
      items = this._items || [];
      for (l = 0, len1 = items.length; l < len1; l++) {
        item = items[l];
        if (item instanceof cola.Button) {
          newFluid++;
        }
      }
      if (newFluid !== oldFluid) {
        if (oldFluid) {
          this._classNamePool.remove("" + oldFluid);
        }
      }
      fluid = this.get("fluid");
      if (!!fluid) {
        this._classNamePool.add("" + newFluid);
        this._classNamePool.add("fluid");
        $dom.attr(attrName, newFluid);
      }
    };

    ButtonGroup.prototype._doRefreshDom = function() {
      if (!this._dom) {
        return;
      }
      ButtonGroup.__super__._doRefreshDom.call(this);
      this._resetFluid();
    };

    ButtonGroup.prototype.addItem = function(item) {
      var itemDom, itemObj;
      if (this._destroyed) {
        return this;
      }
      if (this._items == null) {
        this._items = [];
      }
      itemObj = null;
      if (item instanceof cola.Widget) {
        itemObj = item;
      } else if (item.$type) {
        if (item.$type === "Separator" || item.$type === "-") {
          delete item["$type"];
          itemObj = new cola.buttonGroup.Separator(item);
        } else {
          itemObj = cola.widget(item);
        }
      } else if (typeof item === "string") {
        itemObj = new cola.buttonGroup.Separator({
          text: item
        });
      }
      if (itemObj) {
        this._items.push(itemObj);
        if (this._dom) {
          itemDom = itemObj.getDom();
          if (itemDom.parentNode !== this._dom) {
            this.get$Dom().append(itemDom);
            cola.util.delay(this, "refreshDom", 50, this._refreshDom);
          }
        }
      }
      return this;
    };

    ButtonGroup.prototype.add = function() {
      var arg, l, len1;
      for (l = 0, len1 = arguments.length; l < len1; l++) {
        arg = arguments[l];
        this.addItem(arg);
      }
      return this;
    };

    ButtonGroup.prototype.removeItem = function(item) {
      var index;
      if (!this._items) {
        return this;
      }
      index = this._items.indexOf(item);
      if (index > -1) {
        this._items.splice(index, 1);
        item.remove();
        cola.util.delay(this, "refreshDom", 50, this._refreshDom);
      }
      return this;
    };

    ButtonGroup.prototype.destroy = function() {
      var item, l, len1, ref;
      if (this._destroyed) {
        return;
      }
      if (this._items) {
        ref = this._items;
        for (l = 0, len1 = ref.length; l < len1; l++) {
          item = ref[l];
          item.destroy();
        }
        delete this._items;
      }
      ButtonGroup.__super__.destroy.call(this);
    };

    ButtonGroup.prototype.clear = function() {
      var item, l, len1, ref, ref1;
      if ((ref = this._items) != null ? ref.length : void 0) {
        ref1 = this._items;
        for (l = 0, len1 = ref1.length; l < len1; l++) {
          item = ref1[l];
          item.destroy();
        }
        this._items = [];
        cola.util.delay(this, "refreshDom", 50, this._refreshDom);
      }
    };

    ButtonGroup.prototype.getItem = function(index) {
      var ref;
      return (ref = this._items) != null ? ref[index] : void 0;
    };

    ButtonGroup.prototype.getItems = function() {
      return this._items || cola.buttonGroup.emptyItems;
    };

    return ButtonGroup;

  })(cola.AbstractButton);

  cola.registerType("button-group", "_default", cola.Button);

  cola.registerType("button-group", "Separator", cola.buttonGroup.Separator);

  cola.registerTypeResolver("button-group", function(config) {
    return cola.resolveType("widget", config);
  });

  if (cola.slotPicker == null) {
    cola.slotPicker = {};
  }

  cola.slotPicker.ZyngaScroller = (function(superClass) {
    extend(ZyngaScroller, superClass);

    ZyngaScroller.EVENTS = {
      scrolled: null
    };

    function ZyngaScroller(container, options) {
      var self;
      self = this;
      if (options == null) {
        options = {};
      }
      this.options = options;
      this.container = container;
      if ($fly(container).css("position") === "static") {
        $fly(container).css("position", "relative");
      }
      self.container.style.overflowX = "hidden";
      self.container.style.overflowY = "hidden";
      self.content = $fly(container).children(":first")[0];
      self.render = options.render;
      options.scrollingX = false;
      options.scrollingY = true;
      options.scrollingComplete = function() {
        return cola.util.delay(self, "scrolled", 50, self._scrolled);
      };
      self.scroller = new Scroller(function(left, top, zoom) {
        self.render(left, top, zoom);
        cola.util.delay(self, "scrolled", 50, self._scrolled);
        self._scrolling(left, top, zoom);
      }, options);
      this._bindEvents();
    }

    ZyngaScroller.prototype.scrollSize = function(dir, container, content) {
      var result, translate;
      translate = cola.Fx.getElementTranslate(content);
      cola.Fx.cancelTranslateElement(content);
      if (dir === "h") {
        result = Math.max(container.scrollWidth, content.clientWidth);
      } else {
        result = Math.max(container.scrollHeight, content.clientHeight);
      }
      cola.Fx.translateElement(content, translate.left, translate.top);
      return result;
    };

    ZyngaScroller.prototype.update = function() {
      var content, scrollHeight, scrollLeft, scrollTop, scrollWidth, viewHeight, viewWidth;
      if (!this._contentInited) {
        content = this.content = this.container.children[0];
        this._contentInited = !!this.content;
      }
      if (!this.content) {
        return;
      }
      viewWidth = this.container.clientWidth;
      viewHeight = this.container.clientHeight;
      scrollWidth = this.scrollSize("h", this.container, this.content);
      scrollHeight = this.scrollSize("v", this.container, this.content);
      this.scroller.options.scrollingX = false;
      this.scroller.options.scrollingY = true;
      this.scrollHeight = scrollHeight;
      this.scroller.setDimensions(viewWidth, viewHeight, scrollWidth, scrollHeight);
      if (this.snapHeight || this.snapWidth) {
        this.scroller.setSnapSize(this.snapWidth || 100, this.snapHeight || 100);
      }
      scrollTop = this.defaultScrollTop;
      scrollLeft = this.defaultScrollLeft;
      if (scrollTop !== void 0 || scrollLeft !== void 0) {
        this.scroller.scrollTo(scrollLeft, scrollTop, false);
        this.defaultScrollTop = void 0;
        this.defaultScrollLeft = void 0;
      }
      return this;
    };

    ZyngaScroller.prototype._scrolled = function() {
      var oldValue, top, value;
      value = this.getValues();
      oldValue = this._scrollTop;
      if (oldValue === value.top) {
        return;
      }
      top = Math.round(value.top / 60) * 60;
      this._scrollTop = top;
      this.scrollTo(value.left, top, true);
      this.fire("scrolled", this, {
        left: value,
        top: top
      });
    };

    ZyngaScroller.prototype._scrolling = function() {};

    ZyngaScroller.prototype._bindEvents = function() {
      var handleEnd, handleMouseWheel, handleMove, handleStart, self;
      self = this;
      handleStart = this._handleStart = function() {
        var event;
        event = window.event;
        if (event.target.tagName.match(/input|select/i)) {
          event.stopPropagation();
          return;
        }
        if (cola.os.mobile) {
          self.scroller.doTouchStart(event.touches, event.timeStamp);
        } else {
          self.scroller.doTouchStart([
            {
              pageX: event.pageX,
              pageY: event.pageY
            }
          ], event.timeStamp);
        }
        self._touchStart = true;
        event.preventDefault();
      };
      handleMove = this._handleMove = function() {
        var event;
        event = window.event;
        if (!self._touchStart) {
          return;
        }
        if (cola.os.mobile) {
          self.scroller.doTouchMove(event.touches, event.timeStamp);
        } else {
          self.scroller.doTouchMove([
            {
              pageX: event.pageX,
              pageY: event.pageY
            }
          ], event.timeStamp);
        }
      };
      handleEnd = this._handleEnd = function() {
        var event;
        if (!self._touchStart) {
          return;
        }
        event = window.event;
        self.scroller.doTouchEnd(event.timeStamp);
        self._touchStart = false;
      };
      handleMouseWheel = this._handleMouseWheel = function(event) {
        self.scroller.scrollBy(0, event.wheelDelta, true);
      };
      self.container.addEventListener("mousewheel", handleMouseWheel);
      if (cola.os.mobile) {
        $(self.container).on("touchstart", handleStart).on("touchmove", handleMove).on("touchend", handleEnd);
      } else {
        $(self.container).on("mousedown", handleStart).on("mousemove", handleMove).on("mouseup", handleEnd);
      }
      return this;
    };

    ZyngaScroller.prototype.scrollTo = function(left, top, animate) {
      this.scroller.scrollTo(left, top, animate);
    };

    ZyngaScroller.prototype.scrollBy = function(left, top) {
      this.scroller.scrollBy(left, top, animate);
    };

    ZyngaScroller.prototype.getValues = function() {
      return this.scroller.getValues();
    };

    ZyngaScroller.prototype.destroy = function() {
      cola.util.cancelDelay(this, "scrolled");
      if (cola.os.mobile) {
        $(this.container).off("touchstart", this._handleStart).off("touchmove", this._handleMove).off("touchend", this._handleEnd);
      } else {
        $(this.container).off("mousedown", this._handleStart).off("mousemove", this._handleMove).off("mouseup", this._handleEnd);
      }
      delete this.container;
      delete this.content;
    };

    return ZyngaScroller;

  })(cola.Element);

  cola.AbstractSlotList = (function(superClass) {
    extend(AbstractSlotList, superClass);

    function AbstractSlotList() {
      return AbstractSlotList.__super__.constructor.apply(this, arguments);
    }

    return AbstractSlotList;

  })(cola.RenderableElement);

  cola.SlotList = (function(superClass) {
    extend(SlotList, superClass);

    function SlotList() {
      return SlotList.__super__.constructor.apply(this, arguments);
    }

    SlotList.CLASS_NAME = "list";

    SlotList.ATTRIBUTES = {
      viewItemCount: {
        type: "number",
        refreshDom: true,
        defalutValue: 3
      },
      items: {
        refreshDom: true,
        setter: function(value) {
          var oldValue;
          oldValue = this._items;
          this._oldItems = oldValue || [];
          this._items = value;
          if (this._dom) {
            return this._itemChanged = true;
          }
        }
      },
      value: {
        getter: function() {
          var currentIndex, items;
          items = this.doGetItems();
          currentIndex = this._currentIndex || 0;
          if (items && currentIndex !== void 0) {
            return items[currentIndex];
          }
          return void 0;
        },
        setter: function(value) {
          var items, newIndex, oldIndex;
          items = this.doGetItems();
          oldIndex = this._currentIndex;
          newIndex = items.indexOf(value);
          if (newIndex === oldIndex) {
            return;
          }
          this._currentIndex = items.indexOf(value);
          if (this._dom) {
            return this.syncScroll();
          }
        }
      },
      defaultValue: null,
      currentIndex: {
        type: "number",
        refreshDom: true,
        defaultValue: 0
      },
      formatter: null
    };

    SlotList.EVENTS = {
      valueChange: null
    };

    SlotList.prototype.doTouchStart = function(touches, timeStamp) {
      var ref;
      cola.slotPicker._activePicker = this;
      if ((ref = this._scroller) != null) {
        ref.doTouchMove(touches, timeStamp);
      }
    };

    SlotList.prototype.doTouchMove = function(touches, timeStamp) {
      var ref;
      if ((ref = this._scroller) != null) {
        ref.doTouchMove(touches, timeStamp);
      }
    };

    SlotList.prototype.doTouchEnd = function(timeStamp) {
      var ref;
      if ((ref = this._scroller) != null) {
        ref.doTouchEnd(timeStamp);
      }
      cola.slotPicker._activePicker = null;
    };

    SlotList.prototype.syncScroll = function() {
      var doms, item, value;
      if (!this._zyngaScroller) {
        return;
      }
      doms = this._doms;
      value = this.get("value");
      if (value !== void 0) {
        item = $fly(doms.body).find(" > .slot-item")[this._currentIndex];
        if (item) {
          this._disableScrollEvent = true;
          this._zyngaScroller.scrollTo(0, item.offsetTop - 60, false);
          return this._disableScrollEvent = false;
        }
      }
    };

    SlotList.prototype._createDom = function() {
      var dom, doms, dummyItemCount, formatter, i, itemDom, items, list, viewItemCount;
      list = this;
      if (this._doms == null) {
        this._doms = {};
      }
      doms = this._doms;
      dom = $.xCreate({
        "class": this.constructor.CLASS_NAME,
        content: [
          {
            "class": "items-wrap",
            contextKey: "body"
          }
        ]
      }, this._doms);
      viewItemCount = this._viewItemCount || 3;
      dummyItemCount = Math.floor(viewItemCount / 2);
      i = 0;
      while (i < dummyItemCount) {
        itemDom = document.createElement("div");
        itemDom.className = "dummy-item";
        doms.body.appendChild(itemDom);
        i++;
      }
      items = list.doGetItems();
      formatter = this._formatter || function(index, value) {
        return value;
      };
      i = 0;
      while (i < items.length) {
        itemDom = document.createElement("div");
        itemDom.className = "slot-item";
        itemDom.innerHTML = formatter(i, items[i]);
        doms.body.appendChild(itemDom);
        i++;
      }
      i = 0;
      while (i < dummyItemCount) {
        itemDom = document.createElement("div");
        itemDom.className = "dummy-item";
        doms.body.appendChild(itemDom);
        i++;
      }
      return dom;
    };

    SlotList.prototype._initDom = function(dom) {
      var defaultValue, index, item, items, list, position, scrollTop;
      list = this;
      items = this.doGetItems();
      defaultValue = this._defaultValue;
      scrollTop = 0;
      if (defaultValue !== void 0) {
        index = this._currentIndex = items.indexOf(defaultValue);
        item = $fly(this._doms.body).find(" > *")[index];
        position = $fly(item).position();
        scrollTop = position.top;
      }
      list._zyngaScroller = new cola.slotPicker.ZyngaScroller(dom, {
        render: cola.util.getScrollerRender(this._doms.body)
      });
      list._zyngaScroller.on("scrolled", function(self, arg) {
        var itemIndex, value;
        itemIndex = Math.round(arg.top / 60);
        position = itemIndex * 60;
        if (position === arg.top) {
          list._currentIndex = Math.abs(itemIndex);
          value = list.get("value");
          return list.fire("valueChange", list, {
            currentIndex: Math.abs(itemIndex),
            value: value
          });
        }
      });
    };

    SlotList.prototype._updateScroller = function() {
      var dom, doms, rect;
      if (this._scroller) {
        rect = this._dom.getBoundingClientRect();
        dom = this._dom;
        doms = this._doms;
        this._scroller.setPosition(rect.left + dom.clientLeft, rect.top + dom.clientTop);
        return this._scroller.setDimensions(dom.clientWidth, dom.clientHeight, doms.body.offsetWidth, doms.body.offsetHeight);
      }
    };

    SlotList.prototype._refreshItemDoms = function() {
      var doms, dummyItemCount, finalLength, formatter, i, insertSize, itemDom, items, nodeLength, refDom, removeSize, viewItemCount;
      items = this.doGetItems();
      doms = this._doms;
      viewItemCount = this._viewItemCount || 3;
      dummyItemCount = Math.floor(viewItemCount / 2);
      formatter = this._formatter || function(index, value) {
        return value;
      };
      nodeLength = doms.body.children.length;
      finalLength = items.length + dummyItemCount * 2;
      if (finalLength > nodeLength) {
        refDom = doms.body.children[nodeLength - dummyItemCount];
        insertSize = finalLength - nodeLength;
        i = 0;
        while (i < insertSize) {
          itemDom = document.createElement("div");
          itemDom.className = "slot-item";
          doms.body.insertBefore(itemDom, refDom);
          i++;
        }
      } else if (finalLength < nodeLength) {
        removeSize = nodeLength - finalLength;
        i = 0;
        while (i < removeSize) {
          $fly(doms.body.children[finalLength - dummyItemCount]).remove();
          i++;
        }
      }
      i = 0;
      while (i < items.length) {
        itemDom = doms.body.children[i + 1];
        itemDom.className = "slot-item";
        itemDom.innerHTML = formatter(i, items[i]);
        i++;
      }
      return this._itemChanged = false;
    };

    SlotList.prototype._doRefreshDom = function() {
      var list;
      if (!this._dom) {
        return;
      }
      list = this;
      this._refreshItemDoms();
      if (list._zyngaScroller) {
        list._zyngaScroller.update();
        return list.syncScroll();
      }
    };

    SlotList.prototype.doGetItems = function() {
      return this._items || [];
    };

    return SlotList;

  })(cola.AbstractSlotList);

  cola.RangeSlotList = (function(superClass) {
    extend(RangeSlotList, superClass);

    function RangeSlotList() {
      return RangeSlotList.__super__.constructor.apply(this, arguments);
    }

    RangeSlotList.ATTRIBUTES = {
      range: {
        refreshDom: true,
        setter: function(value) {
          this._oldItems = this.doGetItems();
          this._range = value;
          if (this._dom) {
            this._itemChanged = true;
          }
          return this;
        }
      },
      step: {
        defaultValue: 1
      }
    };

    RangeSlotList.prototype.doGetItems = function() {
      var i, itemCount, items, range, start, step;
      range = this._range;
      items = [];
      if (range && range.length === 2) {
        start = range[0];
        step = this._step;
        itemCount = (range[1] - start) / step + 1;
        i = 0;
        while (i < itemCount) {
          items.push(start + i * step);
          i++;
        }
      }
      return items;
    };

    return RangeSlotList;

  })(cola.SlotList);

  cola.MultiSlotPicker = (function(superClass) {
    extend(MultiSlotPicker, superClass);

    MultiSlotPicker.CLASS_NAME = "multi-slot-picker";

    MultiSlotPicker.slotConfigs = [];

    MultiSlotPicker.ATTRIBUTES = {
      height: null
    };

    MultiSlotPicker.prototype._createDom = function() {
      var dom, domContext, doms, i, itemDom, items, j, list, picker, slotConfig, slotConfigs, slotDom, slotLists, slotName;
      picker = this;
      doms = {};
      dom = $.xCreate({
        "class": this.constructor.CLASS_NAME,
        content: [
          {
            "class": "body",
            contextKey: "body"
          }
        ]
      }, doms);
      picker._doms = doms;
      picker._slotListMap = {};
      slotConfigs = picker.slotConfigs;
      items = [];
      slotLists = [];
      i = 0;
      j = slotConfigs.length;
      while (i < j) {
        slotConfig = slotConfigs[i];
        slotName = slotConfig.name;
        domContext = {};
        itemDom = $.xCreate({
          "class": "slot-picker",
          style: {
            webkitBoxFlex: 1
          },
          content: [
            {
              content: slotConfig.unit || "",
              "class": "unit"
            }, {
              "class": "slot",
              contextKey: "slot",
              content: [
                {
                  "class": "mask",
                  content: {
                    "class": "bar"
                  }
                }
              ]
            }
          ]
        }, domContext);
        slotDom = domContext.slot;
        if (slotConfig.$type === "Range") {
          list = new cola.RangeSlotList({
            range: slotConfig.range,
            formatter: slotConfig.formatter,
            defaultValue: slotConfig.defaultValue,
            valueChange: function(self, arg) {
              var value;
              value = arg.value;
              return picker.setSlotValue(self._slotIndex, value);
            }
          });
        } else {
          list = new cola.SlotList({
            items: slotConfig.items,
            formatter: slotConfig.formatter,
            defaultValue: slotConfig.defaultValue,
            valueChange: function(self, arg) {
              var value;
              value = arg.value;
              return picker.setSlotValue(self._slotIndex, value);
            }
          });
        }
        list._slotIndex = i;
        picker._slotListMap[slotName] = list;
        list.appendTo(slotDom);
        doms.body.appendChild(itemDom);
        slotLists.push(list);
        items.push(slotDom);
        i++;
      }
      picker._slotLists = slotLists;
      picker._items = items;
      return dom;
    };

    function MultiSlotPicker(config) {
      if (this.slotConfigs) {
        this.initSlotConfigs();
      }
      MultiSlotPicker.__super__.constructor.call(this, config);
    }

    MultiSlotPicker.prototype.initSlotConfigs = function() {
      var config, i, j, name, slotConfigs, slotMap, values;
      slotConfigs = this.slotConfigs;
      slotMap = this._slotMap = {};
      values = this._values = [];
      i = 0;
      j = slotConfigs.length;
      while (i < j) {
        config = slotConfigs[i];
        name = config.name;
        config["class"] = config.className || "slot";
        config.range = config.range || [null, null];
        slotMap[name] = config;
        values[i] = config.defaultValue;
        i++;
      }
    };

    MultiSlotPicker.prototype.getSlotValue = function(slotIndex) {
      if (typeof slotIndex === "string") {
        slotIndex = this.getSlotIndexByName(slotIndex);
      }
      return this._values[slotIndex];
    };

    MultiSlotPicker.prototype.setSlotValue = function(slotIndex, value) {
      var config, maxValue, minValue, picker, range;
      picker = this;
      if (typeof slotIndex === "string") {
        slotIndex = picker.getSlotIndexByName(slotIndex);
      }
      if (slotIndex < 0) {
        return;
      }
      if (value !== null) {
        config = picker.slotConfigs[slotIndex];
        range = config.range || [];
        minValue = range[0];
        maxValue = range[1];
        value = parseInt(value, 10);
        if (isNaN(value)) {
          value = config.defaultValue || 0;
        }
        if (maxValue !== null && value > maxValue) {
          value = maxValue;
        } else if (minValue !== null && value < minValue) {
          value = minValue;
        }
      }
      this._values[slotIndex] = value;
      if (this._dom && this._slotLists) {
        return this._slotLists[slotIndex].set("value", value);
      }
    };

    MultiSlotPicker.prototype.getSlotText = function(slotIndex) {
      var config, i, negative, num, picker, text;
      picker = this;
      if (typeof slotIndex === "string") {
        slotIndex = picker.getSlotIndexByName(slotIndex);
      }
      if (slotIndex < 0) {
        return "";
      }
      config = picker.slotConfigs[slotIndex];
      text = picker.getSlotValue(slotIndex);
      if (text === null) {
        if (config.digit > 0) {
          text = '';
          i = 0;
          while (i < config.digit) {
            text += "&nbsp;";
            i++;
          }
        } else {
          text = "&nbsp;";
        }
      } else {
        num = text;
        negative = num < 0;
        text = Math.abs(num) + "";
        if (config.digit > 0 && text.length < config.digit) {
          i = text.length;
          while (i <= config.digit - 1) {
            text = '0' + text;
            i++;
          }
        }
        text = (negative != null ? negative : {
          '-': ''
        }) + text;
      }
      return text;
    };

    MultiSlotPicker.prototype.getText = function() {
      var config, i, picker, slotConfigs, text;
      picker = this;
      slotConfigs = picker.slotConfigs;
      text = "";
      i = 0;
      while (i < slotConfigs.length) {
        config = slotConfigs[i];
        text += config.prefix || "";
        text += picker.getSlotText(i);
        text += config.suffix || "";
        i++;
      }
      return text;
    };

    MultiSlotPicker.prototype.getSlotIndexByName = function(name) {
      var config;
      if (!this._slotMap) {
        this.initSlotConfigs();
      }
      config = this._slotMap[name];
      if (config) {
        return this.slotConfigs.indexOf(config);
      } else {
        return -1;
      }
    };

    MultiSlotPicker.prototype.doOnResize = function() {
      var columnCount, dom, flex, flexes, i, index, item, items, l, lastWidth, len1, picker, results, totalFlex, unitWidth, viewWidth, width;
      picker = this;
      items = picker._items || [];
      dom = picker._dom;
      flexes = [];
      for (index = l = 0, len1 = items.length; l < len1; index = ++l) {
        item = items[index];
        width = picker.slotConfigs[index].width || 90;
        flexes.push(width);
      }
      viewWidth = dom.clientWidth;
      columnCount = flexes.length;
      totalFlex = 0;
      i = 0;
      while (i < columnCount) {
        flex = flexes[i];
        totalFlex += parseInt(flex, 10) || 90;
        i++;
      }
      unitWidth = viewWidth / totalFlex;
      lastWidth = 0;
      i = 0;
      results = [];
      while (i < columnCount) {
        if (i !== columnCount - 1) {
          $fly(items[i]).css({
            width: Math.floor(unitWidth * flexes[i])
          });
          lastWidth += Math.floor(unitWidth * flexes[i]);
        } else {
          $fly(items[i]).css({
            width: viewWidth - lastWidth
          });
        }
        results.push(i++);
      }
      return results;
    };

    MultiSlotPicker.prototype.updateItems = function() {
      var l, len1, list, ref;
      ref = this._slotLists;
      for (l = 0, len1 = ref.length; l < len1; l++) {
        list = ref[l];
        list.refresh();
      }
      return this;
    };

    return MultiSlotPicker;

  })(cola.AbstractSlotList);

  now = new Date();

  currentYear = now.getFullYear();

  currentMonth = now.getMonth() + 1;

  currentDate = now.getDate();

  currentHours = now.getHours();

  currentMinutes = now.getMinutes();

  currentSeconds = now.getSeconds();

  dateTimeSlotConfigs = {
    year: {
      $type: "Range",
      name: "year",
      range: [currentYear - 50, currentYear + 50],
      defaultValue: currentYear,
      unit: "年",
      width: 120
    },
    month: {
      $type: "Range",
      name: "month",
      range: [1, 12],
      defaultValue: currentMonth,
      unit: "月",
      width: 90
    },
    date: {
      $type: "Range",
      name: "date",
      range: [1, 31],
      defaultValue: currentDate,
      unit: "日",
      width: 90
    },
    hours: {
      $type: "Range",
      name: "hours",
      range: [0, 23],
      defaultValue: currentHours,
      unit: "时",
      width: 90
    },
    minutes: {
      $type: "Range",
      name: "minutes",
      range: [0, 59],
      defaultValue: 0,
      unit: "分",
      width: 90
    },
    seconds: {
      $type: "Range",
      name: "seconds",
      range: [0, 59],
      defaultValue: 0,
      unit: "秒",
      width: 90
    }
  };

  slotAttributeGetter = function(attr) {
    return this.getSlotValue(attr);
  };

  slotAttributeSetter = function(value, attr) {
    return this.setSlotValue(attr, value);
  };

  dateTypeConfig = {
    year: [dateTimeSlotConfigs.year],
    month: [dateTimeSlotConfigs.year, dateTimeSlotConfigs.month],
    date: [dateTimeSlotConfigs.year, dateTimeSlotConfigs.month, dateTimeSlotConfigs.date],
    time: [dateTimeSlotConfigs.hours, dateTimeSlotConfigs.minutes, dateTimeSlotConfigs.seconds],
    dateTime: [dateTimeSlotConfigs.year, dateTimeSlotConfigs.month, dateTimeSlotConfigs.date, dateTimeSlotConfigs.hours, dateTimeSlotConfigs.minutes, dateTimeSlotConfigs.seconds],
    hours: [dateTimeSlotConfigs.hours],
    minutes: [dateTimeSlotConfigs.hours, dateTimeSlotConfigs.minutes],
    dateHours: [dateTimeSlotConfigs.year, dateTimeSlotConfigs.month, dateTimeSlotConfigs.date, dateTimeSlotConfigs.hours],
    dateMinutes: [dateTimeSlotConfigs.year, dateTimeSlotConfigs.month, dateTimeSlotConfigs.date, dateTimeSlotConfigs.hours, dateTimeSlotConfigs.minutes]
  };

  if (cola.mobile == null) {
    cola.mobile = {};
  }

  cola.mobile.DateTimePicker = (function(superClass) {
    extend(DateTimePicker, superClass);

    function DateTimePicker() {
      return DateTimePicker.__super__.constructor.apply(this, arguments);
    }

    DateTimePicker.CLASS_NAME = "multi-slot-picker";

    DateTimePicker.slotConfigs = [];

    DateTimePicker.ATTRIBUTES = {
      type: {
        "enum": ["year", "month", "date", "time", "datetime", "hours", "minutes", "dateHours", "dateMinutes"],
        defaultValue: "date"
      },
      year: {
        getter: slotAttributeGetter,
        setter: slotAttributeSetter
      },
      month: {
        getter: slotAttributeGetter,
        setter: slotAttributeSetter
      },
      date: {
        getter: slotAttributeGetter,
        setter: slotAttributeSetter
      },
      hours: {
        getter: slotAttributeGetter,
        setter: slotAttributeSetter
      },
      minutes: {
        getter: slotAttributeGetter,
        setter: slotAttributeSetter
      },
      seconds: {
        getter: slotAttributeGetter,
        setter: slotAttributeSetter
      },
      value: {
        getter: function() {
          var date, hours, minutes, month, seconds, year;
          year = this.getSlotValue("year") || 1980;
          month = (this.getSlotValue("month") - 1) || 0;
          date = this.getSlotValue("date") || 1;
          hours = this.getSlotValue("hours") || 0;
          minutes = this.getSlotValue("minutes") || 0;
          seconds = this.getSlotValue("seconds") || 0;
          return new Date(year, month, date, hours, minutes, seconds);
        },
        setter: function(d) {
          var date, hours, minutes, month, seconds, year;
          year = 0;
          month = 1;
          date = 1;
          hours = 0;
          minutes = 1;
          seconds = 1;
          if (d) {
            year = d.getFullYear();
            month = d.getMonth() + 1;
            date = d.getDate();
            hours = d.getHours();
            minutes = d.getMinutes();
            seconds = d.getSeconds();
          }
          this.setSlotValue("year", year);
          this.setSlotValue("month", month);
          this.setSlotValue("date", date);
          this.setSlotValue("hours", hours);
          this.setSlotValue("minutes", minutes);
          return this.setSlotValue("seconds", seconds);
        }
      }
    };

    DateTimePicker.prototype._createDom = function() {
      var configs, dayCount, dom, month, picker, type, year;
      picker = this;
      type = picker._type;
      configs = dateTypeConfig[type];
      picker.slotConfigs = configs;
      picker.initSlotConfigs();
      dom = DateTimePicker.__super__._createDom.call(this);
      if (picker._slotMap["date"]) {
        year = picker.getSlotValue("year");
        month = picker.getSlotValue("month");
        dayCount = XDate.getDaysInMonth(year, month - 1);
        picker.refreshSlotList("date", {
          range: [1, dayCount]
        });
      }
      return dom;
    };

    DateTimePicker.prototype._doRefreshDom = function() {
      if (!this._dom) {
        return;
      }
      DateTimePicker.__super__._doRefreshDom.call(this);
      this._classNamePool.add("multi-slot-picker");
    };

    DateTimePicker.prototype.refreshSlotList = function(slotName, value) {
      var picker, slotList;
      picker = this;
      slotList = picker._slotListMap[slotName];
      if (slotList && value !== void 0) {
        slotList.set(value);
      }
      return this;
    };

    DateTimePicker.prototype.setSlotValue = function(slotIndex, value) {
      var config, date, dateSlotIndex, dayCount, month, newDate, picker, slotName, year;
      picker = this;
      if (value === null) {
        DateTimePicker.__super__.setSlotValue.call(this, slotIndex, value);
        return;
      }
      if (typeof slotIndex === "number") {
        config = picker.slotConfigs[slotIndex];
        if (config) {
          slotName = config.name;
        }
      } else {
        slotName = slotIndex;
        slotIndex = picker.getSlotIndexByName(slotName);
      }
      if (!slotName || !picker._slotMap[slotName]) {
        return;
      }
      if (!picker._slotMap["date"]) {
        DateTimePicker.__super__.setSlotValue.call(this, slotIndex, value);
        return;
      }
      dateSlotIndex = picker.getSlotIndexByName("date");
      date = picker._values[dateSlotIndex];
      newDate = 0;
      year = slotIndex === 0 ? value : picker._values[0];
      month = slotIndex === 1 ? value : picker._values[1];
      dayCount = XDate.getDaysInMonth(year, month - 1);
      if (slotName === "year" || slotName === "month") {
        picker.refreshSlotList("date", {
          range: [1, dayCount]
        });
      }
      if (date >= 28 && date > dayCount) {
        newDate = dayCount;
      }
      if (newDate) {
        if (slotName === "year" || slotName === "month") {
          picker.setSlotValue("date", newDate);
          picker._slotListMap[slotName]._value = newDate;
          picker.refreshSlotList("date");
          return DateTimePicker.__super__.setSlotValue.call(this, slotIndex, value);
        } else {
          return DateTimePicker.__super__.setSlotValue.call(this, slotIndex, newDate);
        }
      } else {
        return DateTimePicker.__super__.setSlotValue.call(this, slotIndex, value);
      }
    };

    return DateTimePicker;

  })(cola.MultiSlotPicker);

  cola.mobile.showDateTimePicker = function(options) {
    var actionDom, layerDom, picker, timerLayer;
    timerLayer = cola.mobile._cacheDateTimer;
    if (timerLayer) {
      if (options.type !== timerLayer._picker.get("type")) {
        timerLayer.destroy();
        cola.mobile._cacheDateTimer = null;
        timerLayer = null;
      }
    }
    if (!timerLayer) {
      picker = new cola.mobile.DateTimePicker({
        type: options.type || "date"
      });
      timerLayer = new cola.Layer({
        animation: "slide up",
        vertical: true,
        horizontal: true,
        "class": "date-timer"
      });
      timerLayer._picker = picker;
      layerDom = timerLayer.getDom();
      layerDom.appendChild(picker.getDom());
      actionDom = $.xCreate({
        "class": "actions ui two fluid bottom attached buttons",
        content: [
          {
            "class": "ui button",
            content: "取消",
            click: function() {
              cola.commonDimmer.hide();
              return timerLayer.hide();
            }
          }, {
            "class": "ui positive button",
            content: "确定",
            click: function() {
              cola.commonDimmer.hide();
              timerLayer.hide();
              if (typeof timerLayer._hideCallback === "function") {
                timerLayer._hideCallback(picker);
              }
              return delete timerLayer._hideCallback;
            }
          }
        ]
      });
      layerDom.appendChild(actionDom);
      $fly(layerDom).css("top", "auto");
      window.document.body.appendChild(layerDom);
      cola.mobile._cacheDateTimer = timerLayer;
    }
    timerLayer = cola.mobile._cacheDateTimer;
    if (options == null) {
      options = {};
    }
    if (options.onHide) {
      timerLayer._hideCallback = options.onHide;
      delete options.onHide;
    }
    cola.commonDimmer.show();
    timerLayer.show(function() {
      timerLayer._picker.set(options);
      return timerLayer._picker.updateItems();
    });
    return timerLayer._picker;
  };

  (function() {
    var DateHelper, getCellPosition, getDateTableState;
    getCellPosition = function(event) {
      var column, element, row, tagName;
      element = event.srcElement || event.target;
      row = -1;
      column = -1;
      while (element && element !== element.ownerDocument.body) {
        tagName = element.tagName.toLowerCase();
        if (tagName === "td") {
          row = element.parentNode.rowIndex;
          column = element.cellIndex;
          break;
        }
        element = element.parentNode;
      }
      if (element !== element.ownerDocument.body) {
        return {
          row: row,
          column: column,
          element: element
        };
      }
      return null;
    };
    if (cola.calendar == null) {
      cola.calendar = {};
    }
    cola.calendar.DateGrid = (function(superClass) {
      extend(DateGrid, superClass);

      function DateGrid() {
        return DateGrid.__super__.constructor.apply(this, arguments);
      }

      DateGrid.ATTRIBUTES = {
        calendar: null,
        columnCount: {
          type: "number",
          defaultValue: 1
        },
        rowCount: {
          type: "number",
          defaultValue: 1
        },
        cellClassName: null,
        selectedCellClassName: "",
        rowClassName: null,
        tableClassName: null
      };

      DateGrid.EVENTS = {
        cellClick: null,
        refreshCellDom: null
      };

      DateGrid.prototype._createDom = function() {
        var columnCount, dom, i, j, picker, rowCount, td, tr;
        picker = this;
        columnCount = this._columnCount;
        rowCount = this._rowCount;
        if (this._doms == null) {
          this._doms = {};
        }
        dom = $.xCreate({
          tagName: "table",
          cellSpacing: 0,
          "class": (picker._className || "") + " " + (picker._tableClassName || ""),
          content: {
            tagName: "tbody",
            contextKey: "body"
          }
        }, this._doms);
        i = 0;
        while (i < rowCount) {
          tr = document.createElement("tr");
          j = 0;
          while (j < columnCount) {
            td = document.createElement("td");
            if (this._cellClassName) {
              td.className = this._cellClassName;
            }
            this.doRenderCell(td, i, j);
            tr.appendChild(td);
            j++;
          }
          if (this._rowClassName) {
            tr.className = this._rowClassName;
          }
          this._doms.body.appendChild(tr);
          i++;
        }
        $fly(dom).on("click", function(event) {
          var position;
          position = getCellPosition(event);
          if (position && position.element) {
            if (position.row >= picker._rowCount) {
              return;
            }
            return picker.fire("cellClick", picker, position);
          }
        });
        return dom;
      };

      DateGrid.prototype.doFireRefreshEvent = function(eventArg) {
        this.fire("refreshCellDom", this, eventArg);
        return this;
      };

      DateGrid.prototype.refreshGrid = function() {
        var cell, columnCount, dom, eventArg, i, j, lastSelectedCell, picker, rowCount, rows;
        picker = this;
        dom = this._doms.body;
        columnCount = this._columnCount;
        rowCount = this._rowCount;
        lastSelectedCell = this._lastSelectedCell;
        if (lastSelectedCell) {
          $fly(lastSelectedCell).removeClass(this._selectedCellClassName || "selected");
          this._lastSelectedCell = null;
        }
        i = 0;
        while (i < rowCount) {
          rows = dom.rows[i];
          j = 0;
          while (j < columnCount) {
            cell = rows.cells[j];
            if (picker._cellClassName) {
              cell.className = picker._cellClassName;
            }
            eventArg = {
              cell: cell,
              row: i,
              column: j
            };
            this.doFireRefreshEvent(eventArg);
            if (eventArg.processDefault !== false) {
              this.doRefreshCell(cell, i, j);
            }
            j++;
          }
          i++;
        }
        return this;
      };

      DateGrid.prototype.setSelectionCell = function(row, column) {
        var cell, lastSelectedCell, picker, tbody;
        picker = this;
        lastSelectedCell = this._lastSelectedCell;
        row = null;
        column = null;
        if (!this._dom) {
          this._selectionPosition = {
            row: row,
            column: column
          };
          return this;
        }
        if (lastSelectedCell) {
          $fly(lastSelectedCell).removeClass(this._selectedCellClassName || "selected");
          this._lastSelectedCell = null;
        }
        tbody = picker._doms.body;
        if (tbody.rows[row]) {
          cell = tbody.rows[row].cells[column];
        }
        if (!cell) {
          return this;
        }
        $fly(cell).addClass(this._selectedCellClassName || "selected");
        this._lastSelectedCell = cell;
        return this;
      };

      DateGrid.prototype.getYMForState = function(cellState) {
        var month, year;
        month = this._month;
        year = this._year;
        if (cellState.type === "prev-month") {
          year = month === 0 ? year - 1 : year;
          month = month === 0 ? 11 : month - 1;
        } else if (cellState.type === "next-month") {
          year = month === 11 ? year + 1 : year;
          month = month === 11 ? 0 : month + 1;
        }
        return {
          year: year,
          month: month
        };
      };

      DateGrid.prototype.doFireRefreshEvent = function(eventArg) {
        var cellState, column, row, ym;
        row = eventArg.row;
        column = eventArg.column;
        if (this._state && this._year && this._month) {
          cellState = this._state[row * 7 + column];
          ym = this.getYMForState(cellState);
          eventArg.date = new Date(ym.year, ym.month, cellState.text);
        }
        this.fire("refreshCellDom", this, eventArg);
        return this;
      };

      DateGrid.prototype.doRenderCell = function(cell, row, column) {
        var label;
        label = document.createElement("div");
        label.className = "label";
        cell.appendChild(label);
      };

      DateGrid.prototype.getDateCellDom = function(date) {
        var ddd, value;
        value = new XDate(date).toString("yyyy-M-d");
        ddd = $(this._dom).find("td[c-date='" + value + "']");
        console.log(ddd);
        return ddd;
      };

      DateGrid.prototype.doRefreshCell = function(cell, row, column) {
        var cellState, state, ym;
        state = this._state;
        if (!state) {
          return;
        }
        cellState = state[row * 7 + column];
        $fly(cell).removeClass("prev-month next-month").addClass(cellState.type).find(".label").html(cellState.text);
        ym = this.getYMForState(cellState);
        $fly(cell).attr("c-date", ym.year + "-" + (ym.month + 1) + "-" + cellState.text);
        if (cellState.type === "normal") {
          if (this._year === this._calendar._year && this._month === this._calendar._month && cellState.text === this._calendar._monthDate) {
            $fly(cell).addClass("selected");
            return this._lastSelectedCell = cell;
          }
        }
      };

      DateGrid.prototype.setState = function(year, month) {
        var oldMonth, oldYear;
        oldYear = this._year;
        oldMonth = this._month;
        if (oldYear !== year || oldMonth !== month) {
          this._year = year;
          this._month = month;
          this._state = getDateTableState(new Date(year, month, 1));
          this.refreshGrid();
        }
        return this.onCalDateChange();
      };

      DateGrid.prototype.onCalDateChange = function() {
        var cell, column, date, delta, firstDayPosition, month, monthDate, row, state, tbody, year;
        if (!this._dom) {
          return this;
        }
        date = this._calendar._date;
        year = this._year;
        month = this._month;
        if (date && year === date.getFullYear() && month === date.getMonth() && date.getDate()) {
          monthDate = date.getDate();
          state = this._state;
          firstDayPosition = state.firstDayPosition;
          delta = monthDate + firstDayPosition - 1;
          column = delta % 7;
          row = Math.floor(delta / 7);
          tbody = this._doms.body;
          cell = tbody.rows[row].cells[column];
          if (this._lastSelectedCell) {
            $fly(this._lastSelectedCell).removeClass("selected");
          }
          if (cell) {
            $fly(cell).addClass("selected");
          }
          this._lastSelectedCell = cell;
        } else {
          if (this._lastSelectedCell) {
            $fly(this._lastSelectedCell).removeClass("selected");
          }
          this._lastSelectedCell = null;
        }
        return this;
      };

      return DateGrid;

    })(cola.RenderableElement);
    cola.calendar.SwipePicker = (function(superClass) {
      extend(SwipePicker, superClass);

      function SwipePicker() {
        return SwipePicker.__super__.constructor.apply(this, arguments);
      }

      SwipePicker.CLASS_NAME = "ui swipe-picker";

      SwipePicker.ATTRIBUTES = {
        calendar: null
      };

      SwipePicker.EVENTS = {
        change: null
      };

      SwipePicker.prototype.createDateTable = function(dom) {
        var calendar, dateTable;
        calendar = this._calendar;
        dateTable = new cola.calendar.DateGrid({
          rowCount: 6,
          columnCount: 7,
          calendar: calendar,
          tableClassName: "date-table",
          refreshCellDom: function(self, arg) {
            return calendar.doFireCellRefresh(arg);
          },
          cellClick: function(self, arg) {
            var cellState, element, state;
            element = arg.element;
            state = self._state;
            if (!element) {
              return;
            }
            cellState = state[arg.row * 7 + arg.column];
            if (cellState.type === "prev-month") {
              calendar.prevMonth();
            } else if (cellState.type === "next-month") {
              calendar.nextMonth();
            }
            calendar.setDate(cellState.text);
            calendar.fire("change", calendar, {
              date: calendar._date
            });
            return calendar.fire("cellClick", calendar, {
              date: calendar._date,
              element: element
            });
          }
        });
        dateTable.appendTo(dom);
        return dateTable;
      };

      SwipePicker.prototype.doOnSwipeNext = function() {
        this._calendar.nextMonth();
        return this;
      };

      SwipePicker.prototype.doOnSwipePrev = function() {
        this._calendar.prevMonth();
        return this;
      };

      SwipePicker.prototype.setState = function(year, month) {
        var nextM, nextY, prevM, prevY;
        this._current.setState(year, month);
        prevY = month === 0 ? year - 1 : year;
        prevM = month === 0 ? 11 : month - 1;
        this._prev.setState(prevY, prevM);
        nextY = month === 11 ? year + 1 : year;
        nextM = month === 11 ? 0 : month + 1;
        this._next.setState(nextY, nextM);
        return this;
      };

      SwipePicker.prototype.setDate = function() {
        if (!this._dom) {
          return this;
        }
        this._current.onCalDateChange();
        this._prev.onCalDateChange();
        this._next.onCalDateChange();
        return this;
      };

      SwipePicker.prototype._createDom = function() {
        var dom, picker, setType, stackDom;
        dom = document.createElement("div");
        picker = this;
        dom.className = "date-table-wrapper";
        setType = function(type) {
          picker["_" + type] = this;
        };
        this._stack = new cola.Stack({
          change: (function(_this) {
            return function(self, arg) {
              var cDom;
              cDom = _this._current.getDom();
              if (arg.prev === cDom.parentNode) {
                return _this.doNext();
              } else {
                return _this.doPrev();
              }
            };
          })(this)
        });
        stackDom = this._stack.getDom();
        dom.appendChild(stackDom);
        this._current = this.createDateTable(this._stack._currentItem);
        this._current.setType = setType;
        this._current.setType("current");
        this._next = this.createDateTable(this._stack._nextItem);
        this._next.setType = setType;
        this._next.setType("next");
        this._prev = this.createDateTable(this._stack._prevItem);
        this._prev.setType = setType;
        this._prev.setType("prev");
        return dom;
      };

      SwipePicker.prototype.doNext = function() {
        var current, next, picker, prev;
        picker = this;
        current = picker._current;
        prev = picker._prev;
        next = picker._next;
        current.setType("prev");
        next.setType("current");
        prev.setType("next");
        return this.fire("change", this, {
          target: "next"
        });
      };

      SwipePicker.prototype.doPrev = function() {
        var current, next, picker, prev;
        picker = this;
        current = picker._current;
        prev = picker._prev;
        next = picker._next;
        current.setType("next");
        next.setType("prev");
        prev.setType("current");
        return this.fire("change", this, {
          target: "prev"
        });
      };

      SwipePicker.prototype.next = function(callback) {
        this._stack.next();
        if (typeof callback === "function") {
          callback();
        }
        return this;
      };

      SwipePicker.prototype.prev = function(callback) {
        this._stack.prev();
        if (typeof callback === "function") {
          callback();
        }
        return this;
      };

      SwipePicker.prototype.getDateCellDom = function(date) {
        return this._current.getDateCellDom(date);
      };

      return SwipePicker;

    })(cola.RenderableElement);
    DateHelper = {
      getDayCountOfMonth: function(year, month) {
        if (month === 3 || month === 5 || month === 8 || month === 10) {
          return 30;
        }
        if (month === 1) {
          if (year % 4 === 0 && year % 100 !== 0 || year % 400 === 0) {
            return 29;
          } else {
            return 28;
          }
        }
        return 31;
      },
      getFirstDayOfMonth: function(date) {
        var temp;
        temp = new Date(date.getTime());
        temp.setDate(1);
        return temp.getDay();
      },
      getWeekNumber: function(date) {
        var d;
        d = new Date(+date);
        d.setHours(0, 0, 0);
        d.setDate(d.getDate() + 4 - (d.getDay() || 7));
        return Math.ceil((((d - new Date(d.getFullYear(), 0, 1)) / 8.64e7) + 1) / 7);
      }
    };
    getDateTableState = function(date) {
      var cell, cells, count, day, firstDayPosition, i, j, lastM, lastMonthDay, maxDay;
      day = date.getDay();
      maxDay = DateHelper.getDayCountOfMonth(date.getFullYear(), date.getMonth());
      lastM = date.getMonth() === 0 ? 11 : date.getMonth() - 1;
      lastMonthDay = DateHelper.getDayCountOfMonth(date.getFullYear(), lastM);
      day = day === 0 ? 7 : day;
      cells = [];
      count = 1;
      firstDayPosition = null;
      i = 0;
      while (i < 6) {
        j = 0;
        while (j < 7) {
          cell = {
            row: i,
            column: j,
            type: "normal"
          };
          if (i === 0) {
            if (j >= day) {
              cell.text = count++;
              if (count === 2) {
                firstDayPosition = i * 7 + j;
              }
            } else {
              cell.text = lastMonthDay - (day - j % 7) + 1;
              cell.type = "prev-month";
            }
          } else {
            if (count <= maxDay) {
              cell.text = count++;
              if (count === 2) {
                firstDayPosition = i * 7 + j;
              }
            } else {
              cell.text = count++ - maxDay;
              cell.type = "next-month";
            }
          }
          cells.push(cell);
          j++;
        }
        i++;
      }
      cells.firstDayPosition = firstDayPosition;
      return cells;
    };
    return cola.Calendar = (function(superClass) {
      extend(Calendar, superClass);

      function Calendar() {
        return Calendar.__super__.constructor.apply(this, arguments);
      }

      Calendar.CLASS_NAME = "calendar";

      Calendar.ATTRIBUTES = {
        date: {
          getter: function() {
            return this._date || new Date();
          }
        }
      };

      Calendar.EVENTS = {
        refreshCellDom: null,
        change: null,
        cellClick: null
      };

      Calendar.prototype.doFireCellRefresh = function(arg) {
        return this.fire("refreshCellDom", this, arg);
      };

      Calendar.prototype.bindButtonsEvent = function() {
        var cal, doms, picker;
        cal = this;
        doms = this._doms;
        picker = this._datePicker;
        $fly(doms.prevMonthButton).on("click", function() {
          return picker.prev();
        });
        $fly(doms.nextMonthButton).on("click", function() {
          return picker.next();
        });
        $fly(doms.prevYearButton).on("click", function() {
          return cal.prevYear();
        });
        return $fly(doms.nextYearButton).on("click", function() {
          return cal.nextYear();
        });
      };

      Calendar.prototype._createDom = function() {
        var allWeeks, cal, dom, picker, weeks;
        allWeeks = "日,一,二,三,四,五,六";
        weeks = allWeeks.split(",");
        cal = this;
        if (this._doms == null) {
          this._doms = {};
        }
        dom = $.xCreate({
          tagName: "div",
          content: [
            {
              tagName: "div",
              "class": "header",
              contextKey: "header",
              content: [
                {
                  tagName: "div",
                  "class": "month",
                  content: [
                    {
                      tagName: "span",
                      "class": "button prev",
                      contextKey: "prevMonthButton"
                    }, {
                      tagName: "span",
                      "class": "button next",
                      contextKey: "nextMonthButton"
                    }, {
                      tagName: "div",
                      "class": "label",
                      contextKey: "monthLabel"
                    }
                  ]
                }, {
                  tagName: "div",
                  "class": "year",
                  content: [
                    {
                      tagName: "span",
                      "class": "button prev",
                      contextKey: "prevYearButton"
                    }, {
                      tagName: "span",
                      "class": "button next",
                      contextKey: "nextYearButton"
                    }, {
                      tagName: "div",
                      "class": "label",
                      contextKey: "yearLabel"
                    }
                  ]
                }
              ]
            }, {
              tagName: "table",
              cellPadding: 0,
              cellSpacing: 0,
              border: 0,
              "class": "date-header",
              contextKey: "dateHeader",
              content: [
                {
                  tagName: "tr",
                  "class": "header",
                  content: [
                    {
                      tagName: "td",
                      content: weeks[0]
                    }, {
                      tagName: "td",
                      content: weeks[1]
                    }, {
                      tagName: "td",
                      content: weeks[2]
                    }, {
                      tagName: "td",
                      content: weeks[3]
                    }, {
                      tagName: "td",
                      content: weeks[4]
                    }, {
                      tagName: "td",
                      content: weeks[5]
                    }, {
                      tagName: "td",
                      content: weeks[6]
                    }
                  ]
                }
              ]
            }
          ]
        }, this._doms);
        picker = cal._datePicker = new cola.calendar.SwipePicker({
          className: "date-table-wrapper",
          calendar: cal,
          change: function(self, arg) {
            if (arg.target === "next") {
              return cal.nextMonth();
            } else {
              return cal.prevMonth();
            }
          }
        });
        picker.appendTo(dom);
        this._doms.dateTableWrapper = picker._dom;
        cal.bindButtonsEvent();
        return dom;
      };

      Calendar.prototype.setState = function(year, month) {
        var doms;
        doms = this._doms;
        this._year = year;
        this._month = month;
        $fly(doms.monthLabel).html(month + 1 || "");
        $fly(doms.yearLabel).html(year || "");
        return this._datePicker.setState(year, month);
      };

      Calendar.prototype.setDate = function(date) {
        this._date = new Date(this._year, this._month, date);
        this._monthDate = date;
        this._datePicker.setDate(date);
        return this;
      };

      Calendar.prototype.prevMonth = function() {
        var month, newMonth, newYear, year;
        year = this._year;
        month = this._month;
        if (year !== void 0 && month !== void 0) {
          newYear = month === 0 ? year - 1 : year;
          newMonth = month === 0 ? 11 : month - 1;
          this.setState(newYear, newMonth);
        }
        return this;
      };

      Calendar.prototype.nextMonth = function() {
        var month, newMonth, newYear, year;
        year = this._year;
        month = this._month;
        if (year !== void 0 && month !== void 0) {
          newYear = month === 11 ? year + 1 : year;
          newMonth = month === 11 ? 0 : month + 1;
          this.setState(newYear, newMonth);
        }
        return this;
      };

      Calendar.prototype.prevYear = function() {
        var month, year;
        year = this._year;
        month = this._month;
        if (year !== void 0 && month !== void 0) {
          this.setState(year - 1, month);
        }
        return this;
      };

      Calendar.prototype.setYear = function(newYear) {
        var month, year;
        year = this._year;
        month = this._month;
        if (year !== void 0 && month !== void 0) {
          return this.setState(newYear, month);
        }
      };

      Calendar.prototype.nextYear = function() {
        var month, year;
        year = this._year;
        month = this._month;
        if (year !== void 0 && month !== void 0) {
          this.setState(year + 1, month);
        }
        return this;
      };

      Calendar.prototype._doRefreshDom = function() {
        var date;
        if (!this._dom) {
          return;
        }
        Calendar.__super__._doRefreshDom.call(this);
        date = this.get("date");
        if (date) {
          this.setState(date.getFullYear(), date.getMonth());
          return this.setDate(date.getDate());
        }
      };

      Calendar.prototype.getDateCellDom = function(date) {
        return this._datePicker.getDateCellDom(date);
      };

      return Calendar;

    })(cola.Widget);
  })();

  cola.Divider = (function(superClass) {
    extend(Divider, superClass);

    function Divider() {
      return Divider.__super__.constructor.apply(this, arguments);
    }

    Divider.CLASS_NAME = "divider";

    Divider.ATTRIBUTES = {
      direction: {
        "enum": ["vertical", "horizontal", ""],
        defaultValue: "",
        refreshDom: true,
        setter: function(value) {
          var oldValue;
          oldValue = this._direction;
          this._direction = value;
          if (this._dom && oldValue && oldValue !== value) {
            this.removeClass(oldValue);
          }
        }
      }
    };

    Divider.prototype._doRefreshDom = function() {
      if (!this._dom) {
        return;
      }
      Divider.__super__._doRefreshDom.call(this);
      if (this._direction) {
        this._classNamePool.add(this._direction);
      }
    };

    return Divider;

  })(cola.AbstractContainer);

  BLANK_PATH = "about:blank";

  cola.IFrame = (function(superClass) {
    extend(IFrame, superClass);

    function IFrame() {
      return IFrame.__super__.constructor.apply(this, arguments);
    }

    IFrame.CLASS_NAME = "iframe";

    IFrame.ATTRIBUTES = {
      path: {
        defaultValue: BLANK_PATH,
        setter: function(value) {
          var oldValue;
          oldValue = this._path;
          this._path = value;
          if (oldValue === value || !this._dom) {
            return;
          }
          this._loaded = false;
          this._replaceUrl(this._path);
        }
      },
      loadingText: null
    };

    IFrame.EVENTS = {
      load: null
    };

    IFrame.prototype._initDom = function(dom) {
      var $dom, frame, frameDoms;
      frame = this;
      frameDoms = this._doms;
      $dom = $(dom);
      $dom.addClass("loading").empty().append($.xCreate([
        {
          tagName: "div",
          "class": "ui active inverted dimmer",
          content: {
            tagName: "div",
            "class": "ui medium text loader",
            content: this._loadingText || "",
            contextKey: "loader"
          },
          contextKey: "dimmer"
        }, {
          tagName: "iframe",
          contextKey: "iframe",
          frameBorder: 0
        }
      ], frameDoms));
      $(frameDoms.iframe).load(function() {
        frame.fire("load", this, {});
        frame._loaded = true;
        return $(frameDoms.dimmer).removeClass("active");
      }).attr("src", this._path);
    };

    IFrame.prototype.getLoaderContainer = function() {
      if (!this._dom) {
        this.getDom();
      }
      return this._doms.dimmer;
    };

    IFrame.prototype.getContentWindow = function() {
      var contentWindow, e;
      if (this._doms == null) {
        this._doms = {};
      }
      try {
        if (this._doms.iframe) {
          contentWindow = this._doms.iframe.contentWindow;
        }
      } catch (_error) {
        e = _error;
      }
      return contentWindow;
    };

    IFrame.prototype.open = function(path, callback) {
      if (callback) {
        this.one("load", function() {
          return cola.callback(callback, true);
        });
      }
      this.set("path", path);
    };

    IFrame.prototype.reload = function(callback) {
      if (callback) {
        this.one("load", function() {
          return cola.callback(callback, true);
        });
      }
      this._replaceUrl(this._path);
      return this;
    };

    IFrame.prototype._replaceUrl = function(url) {
      var contentWindow;
      if (this._doms) {
        $fly(this._doms.dimmer).addClass("active");
      }
      contentWindow = this.getContentWindow();
      if (contentWindow) {
        contentWindow.location.replace(url);
      } else {
        $fly(this._doms.iframe).prop("src", url);
      }
      return this;
    };

    return IFrame;

  })(cola.Widget);

  cola.SubView = (function(superClass) {
    extend(SubView, superClass);

    function SubView() {
      return SubView.__super__.constructor.apply(this, arguments);
    }

    SubView.CLASS_NAME = "sub-view";

    SubView.ATTRIBUTES = {
      loading: null,
      url: {
        readOnlyAfterCreate: true
      },
      jsUrl: {
        readOnlyAfterCreate: true
      },
      cssUrl: {
        readOnlyAfterCreate: true
      },
      model: {
        readOnly: true,
        getter: function() {
          if (this._dom) {
            return cola.util.userData(this._dom, "_model");
          } else {
            return null;
          }
        }
      },
      param: {
        readOnlyAfterCreate: true
      }
    };

    SubView.EVENTS = {
      load: null,
      loadError: null,
      unload: null
    };

    SubView.prototype._initDom = function(dom) {
      if (this._url) {
        this.load({
          url: this._url,
          jsUrl: this._jsUrl,
          cssUrl: this._cssUrl,
          param: this._param
        });
      }
    };

    SubView.prototype.load = function(options, callback) {
      var dom, model;
      dom = this._dom;
      this.unload();
      model = new cola.Model(this._scope);
      cola.util.userData(dom, "_model", model);
      this._url = options.url;
      this._jsUrl = options.jsUrl;
      this._cssUrl = options.cssUrl;
      this._param = options.param;
      this._loading = true;
      cola.loadSubView(this._dom, {
        model: model,
        htmlUrl: this._url,
        jsUrl: this._jsUrl,
        cssUrl: this._cssUrl,
        param: this._param,
        callback: {
          complete: (function(_this) {
            return function(success, result) {
              _this._loading = false;
              if (success) {
                _this.fire("load", _this);
              } else {
                _this.fire("loadError", _this, {
                  error: result
                });
              }
              cola.callback(callback, success, result);
            };
          })(this)
        }
      });
    };

    SubView.prototype.loadIfNecessary = function(options, callback) {
      if (this._url === options.url) {
        cola.callback(callback, true);
      } else {
        this.load(options, callback);
      }
    };

    SubView.prototype.unload = function() {
      var dom, model;
      dom = this._dom;
      delete this._url;
      delete this._jsUrl;
      delete this._cssUrl;
      delete this._param;
      model = cola.util.userData(dom, "_model");
      if (model != null) {
        model.destroy();
      }
      cola.util.removeUserData(dom, "_model");
      $fly(dom).empty();
      this.fire("unload", this);
    };

    return SubView;

  })(cola.Widget);

  cola.Image = (function(superClass) {
    extend(Image, superClass);

    function Image() {
      return Image.__super__.constructor.apply(this, arguments);
    }

    Image.CLASS_NAME = "image";

    Image.TAG_NAME = "img";

    Image.ATTRIBUTES = {
      src: {
        refreshDom: true
      },
      size: {
        "enum": ["mini", "tiny", "small", "medium", "large", "big", "huge", "massive"],
        refreshDom: true,
        setter: function(value) {
          var oldValue;
          oldValue = this["_size"];
          if (oldValue && oldValue !== value && this._dom) {
            this.get$Dom().removeClass(oldValue);
          }
          this["_size"] = value;
        }
      },
      disabled: {
        type: "boolean",
        refreshDom: true,
        defaultValue: false
      }
    };

    Image.prototype._parseDom = function(dom) {
      var src;
      if (!dom) {
        return;
      }
      if (!this._src) {
        src = dom.getAttribute("src");
        if (src) {
          return this._src = src;
        }
      }
    };

    Image.prototype._doRefreshDom = function() {
      var $dom, classNamePool, size;
      if (!this._dom) {
        return;
      }
      Image.__super__._doRefreshDom.call(this);
      $dom = this.get$Dom();
      classNamePool = this._classNamePool;
      size = this.get("size");
      if (size) {
        classNamePool.add(size);
      }
      $dom.attr("src", this._src);
      classNamePool.toggle("disabled", this._disabled);
    };

    return Image;

  })(cola.Widget);

  cola.Avatar = (function(superClass) {
    extend(Avatar, superClass);

    function Avatar() {
      return Avatar.__super__.constructor.apply(this, arguments);
    }

    Avatar.CLASS_NAME = "avatar image";

    return Avatar;

  })(cola.Image);

  cola.Label = (function(superClass) {
    extend(Label, superClass);

    function Label() {
      return Label.__super__.constructor.apply(this, arguments);
    }

    Label.SEMANTIC_CLASS = ["left floated", "right floated", "left top attached", "right top attached", "right bottom attached", "left bottom attached", "top attached", "bottom attached", "left ribbon", "right ribbon", "center aligned"];

    Label.CLASS_NAME = "label";

    Label.ATTRIBUTES = {
      size: {
        "enum": ["mini", "tiny", "small", "medium", "large", "big", "huge", "massive"],
        refreshDom: true,
        setter: function(value) {
          var oldValue;
          oldValue = this._size;
          if (oldValue && oldValue !== value && this._dom) {
            this.removeClass(oldValue);
          }
          this._size = value;
        }
      },
      text: {
        refreshDom: true
      },
      icon: {
        refreshDom: true,
        setter: function(value) {
          var oldValue, ref;
          oldValue = this._icon;
          this._icon = value;
          if (oldValue !== value && this._dom && ((ref = this._doms) != null ? ref.iconDom : void 0)) {
            $fly(this._doms.iconDom).removeClass(oldValue);
          }
        }
      },
      iconPosition: {
        refreshDom: true,
        defaultValue: "left",
        "enum": ["left", "right"]
      },
      horizontal: {
        type: "boolean",
        defaultValue: false,
        refreshDom: true
      },
      color: {
        refreshDom: true,
        "enum": ["black", "yellow", "green", "blue", "orange", "purple", "red", "pink", "teal"],
        setter: function(value) {
          var oldValue;
          oldValue = this._color;
          if (oldValue && oldValue !== value && this._dom) {
            this.removeClass(oldValue);
          }
          this._color = value;
        }
      },
      attached: {
        refreshDom: true,
        defaultValue: "",
        "enum": ["left top", "left bottom", "right top", "right bottom", "top", "bottom", ""],
        setter: function(value) {
          var oldValue;
          oldValue = this._attached;
          if (oldValue && this._dom) {
            this.removeClass(oldValue + " attached", true);
          }
          this._attached = value;
        }
      }
    };

    Label.prototype._parseDom = function(dom) {
      var text;
      if (!dom) {
        return;
      }
      if (!this._text) {
        text = cola.util.getTextChildData(dom);
        if (text) {
          this._text = text;
        }
      }
      return this.get$Dom().empty();
    };

    Label.prototype._refreshIcon = function() {
      var base, icon, iconDom, iconPosition;
      if (!this._dom) {
        return;
      }
      if (this._doms == null) {
        this._doms = {};
      }
      icon = this._icon;
      iconPosition = this._iconPosition;
      if (icon) {
        if ((base = this._doms).iconDom == null) {
          base.iconDom = document.createElement("i");
        }
        iconDom = this._doms.iconDom;
        $(iconDom).addClass(icon + " icon");
        if (iconPosition === "left" && this._doms.textDom) {
          $(this._doms.textDom).before(iconDom);
        } else {
          this._dom.appendChild(iconDom);
        }
      } else if (this._doms.iconDom) {
        cola.detachNode(this._doms.iconDom);
      }
    };

    Label.prototype._doRefreshDom = function() {
      var attached, classNamePool, color, size, text, textDom;
      if (!this._dom) {
        return;
      }
      Label.__super__._doRefreshDom.call(this);
      classNamePool = this._classNamePool;
      text = this._text || "";
      textDom = this._doms.textDom;
      if (text) {
        if (!textDom) {
          textDom = document.createElement("span");
          this._doms.textDom = textDom;
        }
        $fly(textDom).text(text);
        this._dom.appendChild(textDom);
      } else {
        if (textDom) {
          cola.detachNode(textDom);
        }
      }
      size = this.get("size");
      if (size) {
        classNamePool.add(size);
      }
      color = this.get("color");
      if (color) {
        classNamePool.add(color);
      }
      this._refreshIcon();
      attached = this.get("attached");
      if (attached) {
        classNamePool.add(attached + " attached");
      }
    };

    return Label;

  })(cola.Widget);

  cola.ImageLabel = (function(superClass) {
    extend(ImageLabel, superClass);

    function ImageLabel() {
      return ImageLabel.__super__.constructor.apply(this, arguments);
    }

    ImageLabel.CLASS_NAME = "image label";

    ImageLabel.ATTRIBUTES = {
      image: null,
      iconPosition: {
        refreshDom: true,
        defaultValue: "right",
        "enum": ["left", "right"]
      },
      detail: null
    };

    ImageLabel.prototype._doRefreshDom = function() {
      var detailDom;
      if (!this._dom) {
        return;
      }
      ImageLabel.__super__._doRefreshDom.call(this);
      if (this._doms == null) {
        this._doms = {};
      }
      if (this._image) {
        if (!this._doms.image) {
          this._doms.image = $.xCreate({
            tagName: "img",
            src: this._image
          });
        }
        if (this._doms.image.parentNode !== this._dom) {
          this.get$Dom().prepend(this._doms.image);
        }
        $fly(this._doms.image).attr("src", this._image);
      } else {
        if (this._doms.image) {
          cola.detachNode(this._doms.image);
        }
      }
      detailDom = $(".detail", this._dom);
      if (this._detail) {
        if (detailDom.length > 0) {
          return detailDom.text(this._detail);
        } else {
          detailDom = $.xCreate({
            tagName: "div",
            "class": "detail",
            content: this._detail
          });
          return this._dom.appendChild(detailDom);
        }
      } else {
        return detailDom.remove();
      }
    };

    return ImageLabel;

  })(cola.Label);

  cola.PointingLabel = (function(superClass) {
    extend(PointingLabel, superClass);

    function PointingLabel() {
      return PointingLabel.__super__.constructor.apply(this, arguments);
    }

    PointingLabel.CLASS_NAME = "pointing label";

    PointingLabel.ATTRIBUTES = {
      pointing: {
        refreshDom: true,
        defaultValue: "top",
        "enum": ["left", "right", "top", "bottom"],
        setter: function(value) {
          var oldValue;
          oldValue = this._pointing;
          if (oldValue && this._dom) {
            this.removeClass(oldValue);
          }
          this._pointing = value;
        }
      }
    };

    PointingLabel.prototype._doRefreshDom = function() {
      if (!this._dom) {
        return;
      }
      PointingLabel.__super__._doRefreshDom.call(this);
      if (this._pointing) {
        return this._classNamePool.add(this._pointing);
      }
    };

    return PointingLabel;

  })(cola.Label);

  cola.Tag = (function(superClass) {
    extend(Tag, superClass);

    function Tag() {
      return Tag.__super__.constructor.apply(this, arguments);
    }

    Tag.CLASS_NAME = "tag label";

    return Tag;

  })(cola.Label);

  cola.Corner = (function(superClass) {
    extend(Corner, superClass);

    function Corner() {
      return Corner.__super__.constructor.apply(this, arguments);
    }

    Corner.CLASS_NAME = "corner label";

    Corner.ATTRIBUTES = {
      position: {
        "enum": ["left", "right"],
        defaultValue: "right",
        refreshDom: true,
        setter: function(value) {
          var oldValue;
          oldValue = this._position;
          if (oldValue && oldValue !== value && this._dom) {
            this.removeClass(oldValue);
          }
          this._position = value;
        }
      }
    };

    Corner.prototype._doRefreshDom = function() {
      if (!this._dom) {
        return;
      }
      Corner.__super__._doRefreshDom.call(this);
      return this._classNamePool.add(this._position);
    };

    return Corner;

  })(cola.Label);

  cola.Ribbon = (function(superClass) {
    extend(Ribbon, superClass);

    function Ribbon() {
      return Ribbon.__super__.constructor.apply(this, arguments);
    }

    Ribbon.CLASS_NAME = "ribbon label";

    Ribbon.ATTRIBUTES = {
      position: {
        "enum": ["left", "right"],
        defaultValue: "left",
        setter: function(value) {
          var oldValue;
          oldValue = this._position;
          if (oldValue === value) {
            return;
          }
          if (oldValue === "right" && this._dom) {
            this.removeClass("right ribbon", true);
            this.addClass("ribbon");
          }
          this._position = value;
        }
      }
    };

    Ribbon.prototype._doRefreshDom = function() {
      var position;
      if (!this._dom) {
        return;
      }
      Ribbon.__super__._doRefreshDom.call(this);
      position = this._position;
      if (position === "right") {
        this._classNamePool.remove("ribbon");
        return this._classNamePool.add("right ribbon");
      }
    };

    return Ribbon;

  })(cola.Label);

  (function() {
    var createMessageBoxDom, messageBox;
    cola.commonDimmer = {
      show: function() {
        var _dimmerDom;
        _dimmerDom = cola.commonDimmer._dom;
        if (!_dimmerDom) {
          _dimmerDom = $.xCreate({
            tagName: "Div",
            "class": "ui dimmer sys-dimmer",
            contextKey: "dimmer"
          });
          window.document.body.appendChild(_dimmerDom);
          cola.commonDimmer._dom = _dimmerDom;
        }
        $(_dimmerDom).addClass("active");
      },
      hide: function() {
        return $(cola.commonDimmer._dom).removeClass("active");
      }
    };
    messageBox = {
      animation: cola.device.phone ? "slide up" : "scale",
      settings: {
        info: {
          title: "消息",
          icon: "blue info icon"
        },
        warning: {
          title: "警告",
          icon: "yellow warning sign icon"
        },
        error: {
          title: "错误",
          icon: "red warning sign icon"
        },
        question: {
          title: "确认框",
          icon: "black help circle icon"
        }
      },
      "class": "standard",
      level: {
        WARNING: "warning",
        ERROR: "error",
        INFO: "info",
        QUESTION: "question"
      },
      _executeCallback: function(name) {
        var _eventName;
        _eventName = "_on" + name;
        if (!messageBox[_eventName]) {
          return;
        }
        setTimeout(function() {
          var config;
          config = messageBox[_eventName];
          if (typeof config === "function") {
            config.apply(null, []);
          }
          return messageBox[_eventName] = null;
        }, 0);
      },
      _doShow: function() {
        var $dom, animation, css, height, pHeight, pWidth, width;
        animation = messageBox.animation;
        css = {
          zIndex: cola.floatWidget.zIndex()
        };
        $dom = $(messageBox._dom);
        if (!cola.device.phone) {
          width = $dom.width();
          height = $dom.height();
          pWidth = $(window).width();
          pHeight = $(window).height();
          css.left = (pWidth - width) / 2;
          css.top = (pHeight - height) / 2;
        }
        $dom.css(css);
        $dom.transition(animation);
        return cola.commonDimmer.show();
      },
      _doApprove: function() {
        messageBox._executeCallback("approve");
        messageBox._doHide();
      },
      _doDeny: function() {
        messageBox._executeCallback("deny");
        messageBox._doHide();
      },
      _doHide: function() {
        $(messageBox._dom).transition(messageBox.animation);
        cola.commonDimmer.hide();
        messageBox._executeCallback("hide");
      },
      getDom: function() {
        if (!messageBox._dom) {
          createMessageBoxDom();
        }
        return messageBox._dom;
      },
      show: function(options) {
        var $dom, dom, doms, isAlert, level, oldUI, settings, ui;
        dom = messageBox.getDom();
        settings = messageBox.settings;
        level = options.level || messageBox.level.INFO;
        $dom = $(dom);
        if (options.title == null) {
          options.title = settings[level].title;
        }
        if (options.icon == null) {
          options.icon = settings[level].icon;
        }
        messageBox._onDeny = options.onDeny;
        messageBox._onApprove = options.onApprove;
        messageBox._onHide = options.onHide;
        $dom.removeClass("warning error info question").addClass(level);
        oldUI = $dom.attr("_ui");
        ui = options.ui || messageBox.ui;
        if (oldUI !== ui) {
          if (oldUI) {
            $dom.removeClass(oldUI);
          }
          $dom.addClass(ui).attr("_ui", ui);
        }
        doms = messageBox._doms;
        isAlert = options.mode === "alert";
        $(doms.actions).toggleClass("hidden", isAlert);
        $(doms.close).toggleClass("hidden", !isAlert);
        $(doms.description).html(options.content);
        $(doms.title).text(options.title);
        doms.icon.className = options.icon;
        messageBox._doShow();
        return this;
      }
    };
    createMessageBoxDom = function() {
      var actionsDom, bodyNode, dom, doms;
      doms = {};
      dom = $.xCreate({
        tagName: "Div",
        "class": "ui " + (cola.device.phone ? "mobile layer" : "desktop") + " message-box transition hidden",
        contextKey: "messageBox",
        content: {
          "class": "content-container ",
          contextKey: "contentContainer",
          content: [
            {
              tagName: "div",
              "class": "header",
              content: [
                {
                  tagName: "div",
                  "class": "caption",
                  contextKey: "title"
                }, {
                  tagName: "div",
                  contextKey: "close",
                  "class": " close-btn",
                  click: messageBox._doHide,
                  content: {
                    tagName: "i",
                    "class": "close icon"
                  }
                }
              ]
            }, {
              tagName: "div",
              "class": "image content",
              contextKey: "content",
              content: [
                {
                  tagName: "div",
                  "class": "image",
                  content: {
                    tagName: "i",
                    "class": "announcement icon",
                    contextKey: "icon",
                    style: {
                      "font-size": "4rem"
                    }
                  }
                }, {
                  tagName: "div",
                  "class": "description",
                  contextKey: "description"
                }
              ]
            }
          ]
        }
      }, doms);
      actionsDom = $.xCreate({
        tagName: "div",
        "class": "actions " + (cola.device.phone ? "ui buttons two fluid top attached" : ""),
        contextKey: "actions",
        content: [
          {
            tagName: "div",
            contextKey: "no",
            content: "取消",
            click: messageBox._doDeny,
            "class": "ui button"
          }, {
            tagName: "div",
            contextKey: "yes",
            click: messageBox._doApprove,
            "class": "ui positive right labeled icon button ",
            content: [
              {
                tagName: "i",
                "class": "checkmark icon"
              }, {
                tagName: "span",
                content: "确认",
                contextKey: "yesCaption"
              }
            ]
          }
        ]
      }, doms);
      if (cola.device.phone) {
        $(doms.content).before(actionsDom);
      } else {
        doms.contentContainer.appendChild(actionsDom);
      }
      bodyNode = window.document.body;
      if (bodyNode) {
        bodyNode.appendChild(dom);
      } else {
        $(window).on("load", function() {
          return $(window.document.body).append(dom);
        });
      }
      messageBox._dom = dom;
      messageBox._doms = doms;
      return dom;
    };
    cola.alert = function(msg, options) {
      var key, settings, value;
      settings = {};
      if (options) {
        if (typeof options === "function") {
          settings.onHide = options;
        } else {
          for (key in options) {
            value = options[key];
            settings[key] = value;
          }
        }
      }
      settings.content = msg;
      settings.mode = "alert";
      messageBox.show(settings);
      return this;
    };
    cola.confirm = function(msg, options) {
      var key, settings, value;
      settings = {};
      settings.actions = "block";
      if (options) {
        if (typeof options === "function") {
          settings.onApprove = options;
        } else {
          for (key in options) {
            value = options[key];
            settings[key] = value;
          }
        }
      }
      settings.content = msg;
      settings.level = messageBox.level.QUESTION;
      if (settings.title == null) {
        settings.title = messageBox.settings.question.title;
      }
      if (settings.icon == null) {
        settings.icon = messageBox.settings.question.icon;
      }
      settings.mode = "confirm";
      messageBox.show(settings);
      return this;
    };
    if (cola.os.mobile) {
      messageBox.getDom();
    }
    return cola.MessageBox = messageBox;
  })();


  /*
  Reveal 组件
   */

  cola.Reveal = (function(superClass) {
    extend(Reveal, superClass);

    function Reveal() {
      return Reveal.__super__.constructor.apply(this, arguments);
    }

    Reveal.CLASS_NAME = "ui reveal";

    Reveal.ATTRIBUTES = {
      type: {
        refreshDom: true,
        defaultValue: "fade",
        "enum": ["fade", "move", "rotate"],
        setter: function(value) {
          var oldValue;
          oldValue = this["_type"];
          if (oldValue && this._dom && oldValue !== value) {
            this.get$Dom().removeClass(oldValue);
          }
          this["_type"] = value;
        }
      },
      direction: {
        refreshDom: true,
        "enum": ["left", "right", "up", "down"],
        defaultValue: "left",
        setter: function(value) {
          var oldValue;
          oldValue = this["_direction"];
          if (oldValue && this._dom && oldValue !== value) {
            this.get$Dom().removeClass(oldValue);
          }
          this["_direction"] = value;
        }
      },
      active: {
        type: "boolean",
        refreshDom: true,
        defaultValue: false
      },
      instant: {
        type: "boolean",
        refreshDom: true,
        defaultValue: false
      },
      disabled: {
        type: "boolean",
        refreshDom: true,
        defaultValue: false
      },
      visibleContent: {
        refreshDom: true,
        setter: function(value) {
          this._setContent(value, "visibleContent");
          return this;
        }
      },
      hiddenContent: {
        refreshDom: true,
        setter: function(value) {
          this._setContent(value, "hiddenContent");
          return this;
        }
      }
    };

    Reveal.prototype._initDom = function(dom) {
      var container, el, key, l, len1, len2, n, ref, ref1, ref2;
      Reveal.__super__._initDom.call(this, dom);
      ref = ["visibleContent", "hiddenContent"];
      for (l = 0, len1 = ref.length; l < len1; l++) {
        container = ref[l];
        key = "_" + container;
        if ((ref1 = this[key]) != null ? ref1.length : void 0) {
          ref2 = this[key];
          for (n = 0, len2 = ref2.length; n < len2; n++) {
            el = ref2[n];
            this._render(el, container);
          }
        }
      }
    };

    Reveal.prototype._parseDom = function(dom) {
      var $child, child, results, widget, widget$Dom;
      if (!dom) {
        return;
      }
      if (this._doms == null) {
        this._doms = {};
      }
      child = dom.firstChild;
      results = [];
      while (child) {
        if (child.nodeType === 1) {
          widget = cola.widget(child);
          if (widget) {
            widget$Dom = widget.get$Dom();
            if (widget$Dom.has("visible content")) {
              this._visibleContent = widget;
            }
            if (widget$Dom.has("hidden content")) {
              this._hiddenContent = widget;
            }
          } else {
            $child = $(child);
            if ($child.has("visible content")) {
              this._doms.visibleContent = widget;
            }
            if ($child.has("hidden content")) {
              this._doms.hiddenContent = widget;
            }
          }
        }
        results.push(child = child.nextSibling);
      }
      return results;
    };

    Reveal.prototype._clearContent = function(target) {
      var el, l, len1, old;
      old = this["_" + target];
      if (old) {
        for (l = 0, len1 = old.length; l < len1; l++) {
          el = old[l];
          if (el instanceof cola.widget) {
            el.destroy();
          }
        }
        this["_" + target] = [];
      }
      if (this._doms == null) {
        this._doms = {};
      }
      if (this._doms[target]) {
        $fly(this._doms[target]).empty();
      }
    };

    Reveal.prototype._setContent = function(value, target) {
      var el, l, len1, result;
      this._clearContent(target);
      if (value instanceof Array) {
        for (l = 0, len1 = value.length; l < len1; l++) {
          el = value[l];
          result = cola.xRender(el, this._scope);
          if (result) {
            this._addContentElement(result, target);
          }
        }
      } else {
        result = cola.xRender(value, this._scope);
        if (result) {
          this._addContentElement(result, target);
        }
      }
    };

    Reveal.prototype._makeContentDom = function(target) {
      if (this._doms == null) {
        this._doms = {};
      }
      if (!this._doms[target]) {
        this._doms[target] = document.createElement("div");
        this._doms[target].className = (target === "visibleContent" ? "visible" : "hidden") + " content";
        this._dom.appendChild(this._doms[target]);
      }
      return this._doms[target];
    };

    Reveal.prototype._addContentElement = function(element, target) {
      var name, targetList;
      name = "_" + target;
      if (this[name] == null) {
        this[name] = [];
      }
      targetList = this[name];
      targetList.push(element);
      if (element && this._dom) {
        this._render(element, target);
      }
    };

    Reveal.prototype._render = function(node, target) {
      var dom;
      if (this._doms == null) {
        this._doms = {};
      }
      if (!this._doms[target]) {
        this._makeContentDom(target);
      }
      dom = node;
      if (node instanceof cola.Widget) {
        dom = node.getDom();
      }
      if (dom.parentNode !== this._doms[target]) {
        this._doms[target].appendChild(dom);
      }
    };

    Reveal.prototype._doRefreshDom = function() {
      var classNamePool, direction, type;
      if (!this._dom) {
        return;
      }
      Reveal.__super__._doRefreshDom.call(this);
      classNamePool = this._classNamePool;
      ["active", "instant", "disabled"].forEach((function(_this) {
        return function(property) {
          var value;
          value = _this.get(property);
          return classNamePool.toggle(property, !!value);
        };
      })(this));
      type = this.get("type");
      if (type) {
        classNamePool.add(type);
      }
      direction = this.get("direction");
      if (direction) {
        classNamePool.add(direction);
      }
    };

    Reveal.prototype._getContentContainer = function(target) {
      if (!this._dom) {
        return;
      }
      if (!this._doms[target]) {
        this._makeContentDom(target);
      }
      return this._doms[target];
    };

    Reveal.prototype.getVisibleContentContainer = function() {
      return this._getContentContainer("visible");
    };

    Reveal.prototype.getHiddenContentContainer = function() {
      return this._getContentContainer("hidden");
    };

    return Reveal;

  })(cola.Widget);

  cola.Segment = (function(superClass) {
    extend(Segment, superClass);

    function Segment() {
      return Segment.__super__.constructor.apply(this, arguments);
    }

    Segment.CLASS_NAME = "segment";

    Segment.SEMANTIC_CLASS = ["left floated", "right floated", "top attached", "bottom attached", "left attached", "right attached", "very basic", "left aligned", "right aligned", "center aligned", "vertical segment", "horizontal segment"];

    Segment.ATTRIBUTES = {
      textAlign: {
        refreshDom: true,
        "enum": ["left", "right", "center"],
        setter: function(value) {
          var oldValue;
          oldValue = this["_textAlign"];
          if (oldValue && this._dom && oldValue !== value) {
            cola.util.removeClass(this._dom, oldValue + " aligned", true);
          }
          this["_textAlign"] = value;
        }
      },
      attached: {
        refreshDom: true,
        "enum": ["left", "right", "top", "bottom"],
        setter: function(value) {
          var oldValue;
          oldValue = this["_attached"];
          if (oldValue && this._dom && oldValue !== value) {
            $removeClass(this._dom, oldValue + " attached", true);
          }
          this["_attached"] = value;
        }
      },
      color: {
        refreshDom: true,
        "enum": ["black", "yellow", "green", "blue", "orange", "purple", "red", "pink", "teal"],
        setter: function(value) {
          var oldValue;
          oldValue = this["_color"];
          this["_color"] = value;
          if (oldValue && oldValue !== value && this._dom) {
            this.get$Dom().removeClass(oldValue);
          }
        }
      }
    };

    Segment.prototype._doRefreshDom = function() {
      var attached, classNamePool, color, textAlign;
      if (!this._dom) {
        return;
      }
      Segment.__super__._doRefreshDom.call(this);
      classNamePool = this._classNamePool;
      color = this.get("color");
      if (color) {
        classNamePool.add(color);
      }
      attached = this.get("attached");
      if (attached) {
        classNamePool.add(attached + " attached");
      }
      textAlign = this.get("textAlign");
      if (textAlign) {
        classNamePool.add(textAlign + " aligned");
      }
    };

    return Segment;

  })(cola.AbstractContainer);

  _removeTranslateStyle = function(element) {
    var l, len1, prefix, ref;
    ref = ['Moz', 'Webkit', 'O', 'ms'];
    for (l = 0, len1 = ref.length; l < len1; l++) {
      prefix = ref[l];
      element.style[prefix + "Transform"] = "";
    }
    return element.style.transform = "";
  };

  cola.AbstractLayer = (function(superClass) {
    extend(AbstractLayer, superClass);

    function AbstractLayer() {
      return AbstractLayer.__super__.constructor.apply(this, arguments);
    }

    AbstractLayer.ATTRIBUTES = {
      duration: {
        defaultValue: 300
      },
      visible: {
        type: "boolean",
        readOnly: true,
        getter: function() {
          return this.isVisible();
        }
      }
    };

    AbstractLayer.EVENTS = {
      show: null,
      hide: null,
      beforeShow: null,
      beforeHide: null
    };

    AbstractLayer.prototype._onShow = function() {};

    AbstractLayer.prototype._onHide = function() {};

    AbstractLayer.prototype._transition = function(options, callback) {
      if (this.fire("before" + (cola.util.capitalize(options.target)), this, {}) === false) {
        return false;
      }
      this._doTransition(options, callback);
      return this;
    };

    AbstractLayer.prototype._doTransition = function(options, callback) {};

    AbstractLayer.prototype.show = function(options, callback) {
      if (options == null) {
        options = {};
      }
      if (!this._dom || this.isVisible()) {
        return this;
      }
      if (typeof options === "function") {
        callback = options;
        options = {};
      }
      options.target = "show";
      this._transition(options, callback);
      return this;
    };

    AbstractLayer.prototype.hide = function(options, callback) {
      if (options == null) {
        options = {};
      }
      if (!this._dom || !this.isVisible()) {
        return this;
      }
      if (typeof options === "function") {
        callback = options;
        options = {};
      }
      options.target = "hide";
      this._transition(options, callback);
      return this;
    };

    AbstractLayer.prototype.toggle = function() {
      return this[this.isVisible() ? "hide" : "show"].apply(this, arguments);
    };

    AbstractLayer.prototype.isVisible = function() {
      return this.get$Dom().transition("stop all").transition("is visible");
    };

    return AbstractLayer;

  })(cola.AbstractContainer);

  cola.Layer = (function(superClass) {
    extend(Layer, superClass);

    function Layer() {
      return Layer.__super__.constructor.apply(this, arguments);
    }

    Layer.CLASS_NAME = "layer transition hidden";

    Layer.ATTRIBUTES = {
      animation: {
        defaultValue: "slide left",
        "enum": ["scale", "drop", "browse right", "browse", "slide left", "slide right", "slide up", "slide down", "fade left", "fade right", "fade up", "fade down", "fly left", "fly right", "fly up", "fly down", "swing left", "swing right", "swing up", "swing down", "horizontal flip", "vertical flip"]
      }
    };

    Layer.SLIDE_ANIMATIONS = ["slide left", "slide right", "slide up", "slide down"];

    Layer.prototype._doTransition = function(options, callback) {
      var $dom, animation, configs, duration, height, isHorizontal, isShow, layer, onComplete, width, x, y;
      layer = this;
      onComplete = function() {
        if (typeof callback === "function") {
          callback.call(layer);
        }
        if (options.target === "show") {
          layer._onShow();
        } else {
          layer._onHide();
        }
        layer.fire(options.target, layer, {});
        return null;
      };
      if (options.animation === "none") {
        this.get$Dom().transition(options.target);
        onComplete();
        return this;
      }
      animation = options.animation || this._animation || "slide left";
      duration = options.duration || this._duration || 300;
      if (this.constructor.SLIDE_ANIMATIONS.indexOf(animation) < 0) {
        this.get$Dom().transition({
          animation: animation,
          duration: duration,
          onComplete: onComplete,
          queue: true
        });
      } else {
        $dom = this.get$Dom();
        width = $dom.width();
        height = $dom.height();
        isHorizontal = animation === "slide left" || animation === "slide right";
        if (animation === "slide left") {
          x = width;
          y = 0;
        } else if (animation === "slide right") {
          x = -width;
          y = 0;
        } else if (animation === "slide up") {
          x = 0;
          y = height;
        } else {
          x = 0;
          y = -height;
        }
        isShow = options.target === "show";
        if (isShow) {
          cola.Fx.translateElement(this._dom, x, y);
        }
        configs = {
          duration: duration,
          complete: (function(_this) {
            return function() {
              if (!isShow) {
                $dom.removeClass("visible").addClass("hidden");
              }
              _removeTranslateStyle(_this._dom);
              return onComplete();
            };
          })(this)
        };
        if (isHorizontal) {
          configs.x = isShow ? 0 : x;
          configs.y = 0;
        } else {
          configs.y = isShow ? 0 : y;
          configs.x = 0;
        }
        $dom.removeClass("hidden").addClass("visible").transit(configs);
      }
    };

    return Layer;

  })(cola.AbstractLayer);

  cola.Dialog = (function(superClass) {
    extend(Dialog, superClass);

    function Dialog() {
      return Dialog.__super__.constructor.apply(this, arguments);
    }

    Dialog.CLASS_NAME = "dialog transition v-box hidden";

    Dialog.ATTRIBUTES = {
      context: null,
      animation: {
        defaultValue: "scale",
        "enum": ["scale", "drop", "browse right", "browse", "slide left", "slide right", "slide up", "slide down", "fade left", "fade right", "fade up", "fade down", "fly left", "fly right", "fly up", "fly down", "swing left", "swing right", "swing up", "swing down", "horizontal flip", "vertical flip"]
      },
      header: {
        setter: function(value) {
          this._setContent(value, "header");
          return this;
        }
      },
      actions: {
        setter: function(value) {
          this._setContent(value, "actions");
          return this;
        }
      },
      modal: {
        type: "boolean",
        defaultValue: true
      },
      closeable: {
        type: "boolean",
        defaultValue: true
      },
      modalOpacity: {
        type: "number",
        defaultValue: 0.6
      },
      dimmerClose: {
        type: "boolean",
        defaultValue: false
      }
    };

    Dialog.prototype.getContentContainer = function() {
      if (!this._dom) {
        return null;
      }
      if (!this._doms.content) {
        this._makeContentDom("content");
      }
      return this._doms.content;
    };

    Dialog.prototype._initDom = function(dom) {
      var container, el, key, l, len1, len2, n, ref, ref1, ref2;
      Dialog.__super__._initDom.call(this, dom);
      ref = ["header", "actions"];
      for (l = 0, len1 = ref.length; l < len1; l++) {
        container = ref[l];
        key = "_" + container;
        if ((ref1 = this[key]) != null ? ref1.length : void 0) {
          ref2 = this[key];
          for (n = 0, len2 = ref2.length; n < len2; n++) {
            el = ref2[n];
            this._render(el, container);
          }
        }
      }
    };

    Dialog.prototype._createCloseButton = function() {
      var dom;
      dom = this._closeBtn = $.xCreate({
        tagName: "div",
        "class": "ui icon button close-btn",
        content: [
          {
            tagName: "i",
            "class": "close icon"
          }
        ],
        click: (function(_this) {
          return function() {
            return _this.hide();
          };
        })(this)
      });
      return dom;
    };

    Dialog.prototype._doRefreshDom = function() {
      if (!this._dom) {
        return;
      }
      Dialog.__super__._doRefreshDom.call(this);
      if (this.get("closeable")) {
        if (!this._closeBtn) {
          this._createCloseButton();
        }
        if (this._closeBtn.parentNode !== this._dom) {
          return this._dom.appendChild(this._closeBtn);
        }
      } else {
        return $(this._closeBtn).remove();
      }
    };

    Dialog.prototype._onShow = function() {
      var actionsDom, actionsHeight, headerHeight, height, minHeight;
      height = this._dom.offsetHeight;
      actionsDom = this._doms.actions;
      if (actionsDom) {
        actionsHeight = actionsDom.offsetHeight;
        headerHeight = 0;
        if (this._doms.header) {
          headerHeight = this._doms.header.offsetHeight;
        }
        minHeight = height - actionsHeight - headerHeight;
        $(this._doms.content).css("min-height", minHeight + "px");
      }
      return Dialog.__super__._onShow.call(this);
    };

    Dialog.prototype._transition = function(options, callback) {
      var $dom, height, isShow, pHeight, pWidth, parentNode, width;
      if (this.fire("before" + (cola.util.capitalize(options.target)), this, {}) === false) {
        return false;
      }
      $dom = this.get$Dom();
      isShow = options.target === "show";
      if (this.get("modal")) {
        if (isShow) {
          this._showModalLayer();
        } else {
          this._hideModalLayer();
        }
      }
      if (isShow) {
        width = $dom.width();
        height = $dom.height();
        parentNode = this._context || this._dom.parentNode;
        pWidth = $(parentNode).width();
        pHeight = $(parentNode).height();
        $dom.css({
          left: (pWidth - width) / 2,
          top: (pHeight - height) / 2,
          zIndex: cola.floatWidget.zIndex()
        });
      }
      options.animation = options.animation || this._animation || "scale";
      return this._doTransition(options, callback);
    };

    Dialog.prototype._makeContentDom = function(target) {
      var afterEl, dom, flex;
      if (this._doms == null) {
        this._doms = {};
      }
      dom = document.createElement("div");
      dom.className = target;
      if (target === "content") {
        if (this._doms["actions"]) {
          $(this._doms["actions"]).before(dom);
        } else {
          this._dom.appendChild(dom);
        }
      } else if (target === "header") {
        afterEl = this._doms["content"] || this._doms["actions"];
        if (afterEl) {
          $(afterEl).before(dom);
        } else {
          this._dom.appendChild(dom);
        }
      } else {
        this._dom.appendChild(dom);
      }
      flex = target === "content" ? "flex-box" : "box";
      $fly(dom).addClass(flex);
      this._doms[target] = dom;
      return dom;
    };

    Dialog.prototype._parseDom = function(dom) {
      var $child, _parseChild, child, className, l, len1, ref;
      if (this._doms == null) {
        this._doms = {};
      }
      _parseChild = (function(_this) {
        return function(node, target) {
          var childNode, widget;
          childNode = node.firstChild;
          while (childNode) {
            if (childNode.nodeType === 1) {
              widget = cola.widget(childNode);
              _this._addContentElement(widget || childNode, target);
            }
            childNode = childNode.nextSibling;
          }
        };
      })(this);
      child = dom.firstChild;
      while (child) {
        if (child.nodeType === 1) {
          if (child.nodeName === "I") {
            this._doms.icon = child;
            if (this._icon == null) {
              this._icon = child.className;
            }
          } else {
            $child = $(child);
            ref = ["header", "content", "actions"];
            for (l = 0, len1 = ref.length; l < len1; l++) {
              className = ref[l];
              if (!$child.hasClass(className)) {
                continue;
              }
              this._doms[className] = child;
              _parseChild(child, className);
              break;
            }
          }
        }
        child = child.nextSibling;
      }
    };

    Dialog.prototype._showModalLayer = function() {
      var _dimmerDom, container;
      if (this._doms == null) {
        this._doms = {};
      }
      _dimmerDom = this._doms.modalLayer;
      if (!_dimmerDom) {
        _dimmerDom = $.xCreate({
          tagName: "Div",
          "class": "ui dimmer",
          contextKey: "dimmer"
        });
        if (this._dimmerClose) {
          $(_dimmerDom).on("click", (function(_this) {
            return function() {
              return _this.hide();
            };
          })(this));
        }
        container = this._context || this._dom.parentNode;
        container.appendChild(_dimmerDom);
        this._doms.modalLayer = _dimmerDom;
      }
      $(_dimmerDom).css({
        opacity: this.get("modalOpacity"),
        zIndex: cola.floatWidget.zIndex()
      }).addClass("active");
    };

    Dialog.prototype._hideModalLayer = function() {
      var _dimmerDom;
      if (this._doms == null) {
        this._doms = {};
      }
      _dimmerDom = this._doms.modalLayer;
      return $(_dimmerDom).removeClass("active");
    };

    return Dialog;

  })(cola.Layer);

  cola.Sidebar = (function(superClass) {
    extend(Sidebar, superClass);

    function Sidebar() {
      return Sidebar.__super__.constructor.apply(this, arguments);
    }

    Sidebar.CLASS_NAME = "ui sidebar";

    Sidebar.ATTRIBUTES = {
      direction: {
        defaultValue: "left",
        refreshDom: true,
        "enum": ["left", "right", "top", "bottom"]
      },
      size: {
        type: "number",
        defaultValue: 200,
        refreshDom: true
      },
      modalOpacity: {
        type: "number",
        defaultValue: 0.6
      },
      dimmerClose: {
        type: "boolean",
        defaultValue: true
      }
    };

    Sidebar.prototype._doTransition = function(options, callback) {
      var $dom, configs, direction, duration, height, isHorizontal, isShow, onComplete, sidebar, width, x, y;
      if (options.target === "show") {
        this._showModalLayer();
      } else {
        this._hideModalLayer();
      }
      sidebar = this;
      this.get$Dom().css({
        zIndex: cola.floatWidget.zIndex()
      });
      onComplete = function() {
        if (typeof callback === "function") {
          callback.call(sidebar);
        }
        if (options.target === "show") {
          sidebar._onShow();
        } else {
          sidebar._onHide();
        }
        sidebar.fire(options.target, sidebar, {});
        return null;
      };
      direction = this._direction;
      duration = options.duration || this._duration || 300;
      $dom = this.get$Dom();
      width = $dom.width();
      height = $dom.height() || $dom.outerHeight();
      isHorizontal = direction === "left" || direction === "right";
      if (direction === "left") {
        x = -width;
        y = 0;
      } else if (direction === "right") {
        x = width;
        y = 0;
      } else if (direction === "top") {
        x = 0;
        y = -height;
      } else {
        x = 0;
        y = height;
      }
      isShow = options.target === "show";
      if (isShow) {
        cola.Fx.translateElement(this._dom, x, y);
      }
      configs = {
        duration: duration,
        complete: (function(_this) {
          return function() {
            if (!isShow) {
              $dom.removeClass("visible").addClass("hidden");
            }
            _removeTranslateStyle(_this._dom);
            return onComplete();
          };
        })(this)
      };
      if (isHorizontal) {
        configs.x = isShow ? 0 : x;
        configs.y = 0;
      } else {
        configs.y = isShow ? 0 : y;
        configs.x = 0;
      }
      $dom.removeClass("hidden").addClass("visible").transit(configs);
    };

    Sidebar.prototype._doRefreshDom = function() {
      if (!this._dom) {
        return;
      }
      Sidebar.__super__._doRefreshDom.call(this);
      this._setSize();
      return this._classNamePool.add(this._direction || "left");
    };

    Sidebar.prototype._setSize = function() {
      var direction, size, style, unit;
      unit = cola.constants.WIDGET_DIMENSION_UNIT;
      size = this.get("size");
      if (isFinite(size)) {
        size = "" + (parseInt(size)) + unit;
      }
      direction = this._direction || "left";
      style = direction === "left" || direction === "right" ? "width" : "height";
      cola.util.style(this._dom, style, size, "important");
    };

    Sidebar.prototype._showModalLayer = function() {
      var _dimmerDom, container;
      if (this._doms == null) {
        this._doms = {};
      }
      _dimmerDom = this._doms.modalLayer;
      if (!_dimmerDom) {
        _dimmerDom = $.xCreate({
          tagName: "Div",
          "class": "ui dimmer",
          contextKey: "dimmer"
        });
        if (this._dimmerClose) {
          $(_dimmerDom).on("click", (function(_this) {
            return function() {
              return _this.hide();
            };
          })(this));
        }
        $(_dimmerDom).css("position", "fixed");
        container = this._context || this._dom.parentNode;
        container.appendChild(_dimmerDom);
        this._doms.modalLayer = _dimmerDom;
      }
      $(_dimmerDom).css({
        opacity: 0,
        zIndex: cola.floatWidget.zIndex()
      }).addClass("active").transit({
        opacity: this._modalOpacity
      });
    };

    Sidebar.prototype._hideModalLayer = function() {
      var _dimmerDom;
      if (this._doms == null) {
        this._doms = {};
      }
      _dimmerDom = this._doms.modalLayer;
      return $(_dimmerDom).transit({
        opacity: 0,
        complete: function() {
          return $(_dimmerDom).removeClass("active").css({
            zIndex: 0
          });
        }
      });
    };

    Sidebar.prototype.isVisible = function() {
      if (this._dom) {
        return this.get$Dom().hasClass("visible");
      } else {
        return false;
      }
    };

    return Sidebar;

  })(cola.AbstractLayer);

  if (cola.tab == null) {
    cola.tab = {};
  }

  cola.tab.AbstractTabButton = (function(superClass) {
    extend(AbstractTabButton, superClass);

    function AbstractTabButton() {
      return AbstractTabButton.__super__.constructor.apply(this, arguments);
    }

    AbstractTabButton.TAG_NAME = "li";

    AbstractTabButton.CLASS_NAME = "tab-button";

    AbstractTabButton.ATTRIBUTES = {
      icon: {
        refreshDom: true,
        setter: function(value) {
          var oldValue, ref;
          oldValue = this["_icon"];
          this["_icon"] = value;
          if (oldValue && oldValue !== value && this._dom && ((ref = this._doms) != null ? ref.icon : void 0)) {
            $(this._doms.icon).removeClass(oldValue);
          }
        }
      },
      closeable: {
        type: "boolean",
        refreshDom: true,
        defaultValue: false
      },
      caption: {
        refreshDom: true
      },
      name: {
        refreshDom: true
      }
    };

    AbstractTabButton.prototype.getCaptionDom = function() {
      var dom;
      if (this._doms == null) {
        this._doms = {};
      }
      if (!this._doms.caption) {
        dom = this._doms.caption = document.createElement("div");
        dom.className = "caption";
        this._dom.appendChild(dom);
      }
      return this._doms.caption;
    };

    AbstractTabButton.prototype.getCloseDom = function() {
      var base, tabItem;
      if (this._doms == null) {
        this._doms = {};
      }
      tabItem = this;
      if ((base = this._doms)._closeBtn == null) {
        base._closeBtn = $.xCreate({
          tagName: "div",
          "class": "close-btn",
          content: {
            tagName: "i",
            "class": "close icon"
          },
          click: function() {
            tabItem.close();
            return false;
          }
        });
      }
      return this._doms._closeBtn;
    };

    AbstractTabButton.prototype._refreshIcon = function() {
      var base, captionDom, dom;
      if (!this._dom) {
        return;
      }
      if (this._icon) {
        captionDom = this.getCaptionDom();
        if ((base = this._doms).icon == null) {
          base.icon = document.createElement("i");
        }
        dom = this._doms.icon;
        $(dom).addClass(this._icon + " icon");
        if (dom.parentNode !== captionDom) {
          captionDom.appendChild(dom);
        }
      } else {
        if (this._doms.iconDom) {
          $(this._doms.iconDom).remove();
        }
      }
    };

    AbstractTabButton.prototype._refreshCaption = function() {
      var base, captionDom, span;
      if (!this._dom) {
        return;
      }
      if (this._caption) {
        captionDom = this.getCaptionDom();
        if ((base = this._doms).span == null) {
          base.span = document.createElement("span");
        }
        span = this._doms.span;
        $(span).text(this._caption);
        if (span.parentNode !== captionDom) {
          captionDom.appendChild(span);
        }
      } else if (this._doms.span) {
        $(this._doms.span).remove();
      }
    };

    AbstractTabButton.prototype._parseDom = function(dom) {
      var child, parseCaption, tabItem;
      child = dom.firstChild;
      tabItem = this;
      if (this._doms == null) {
        this._doms = {};
      }
      parseCaption = (function(_this) {
        return function(node) {
          var childNode;
          childNode = node.firstChild;
          while (childNode) {
            if (childNode.nodeType === 1) {
              if (childNode.nodeName === "SPAN") {
                _this._doms.span = childNode;
                if (_this._caption == null) {
                  _this._caption = cola.util.getTextChildData(childNode);
                }
              }
              if (childNode.nodeName === "I") {
                _this._doms.icon = childNode;
                if (_this._icon == null) {
                  _this._icon = childNode.className;
                }
              }
            }
            childNode = childNode.nextSibling;
          }
        };
      })(this);
      while (child) {
        if (child.nodeType === 1) {
          if (!this._doms.caption && cola.util.hasClass(child, "caption")) {
            this._doms.caption = child;
            parseCaption(child);
          } else if (!this._doms.closeBtn && cola.util.hasClass(child, "close-btn")) {
            this._doms._closeBtn = child;
            $(child).on("click", function() {
              tabItem.close();
              return false;
            });
          }
        }
        child = child.nextSibling;
      }
    };

    AbstractTabButton.prototype._doRefreshDom = function() {
      var closeDom;
      if (!this._dom) {
        return;
      }
      AbstractTabButton.__super__._doRefreshDom.call(this);
      this._refreshIcon();
      this._refreshCaption();
      if (!!this._closeable) {
        closeDom = this.getCloseDom();
        if (closeDom.parentNode !== this._dom) {
          this._dom.appendChild(closeDom);
        }
      } else if (this._doms && this._doms.closeDom) {
        $(this._doms.closeDom).remove();
      }
    };

    AbstractTabButton.prototype._createCaptionDom = function() {
      var dom;
      if (this._doms == null) {
        this._doms = {};
      }
      dom = $.xCreate({
        tagName: "div",
        "class": "caption",
        contextKey: "caption",
        content: [
          {
            tagName: "i",
            contextKey: "icon",
            "class": "icon"
          }, {
            tagName: "span",
            contextKey: "span",
            content: this._caption || ""
          }
        ]
      }, this._doms);
      return this._dom.appendChild(dom);
    };

    AbstractTabButton.prototype.destroy = function() {
      if (this._destroyed) {
        return;
      }
      AbstractTabButton.__super__.destroy.call(this);
      delete this._doms;
      return this;
    };

    return AbstractTabButton;

  })(cola.Widget);

  cola.TabButton = (function(superClass) {
    extend(TabButton, superClass);

    function TabButton() {
      return TabButton.__super__.constructor.apply(this, arguments);
    }

    TabButton.ATTRIBUTES = {
      control: {
        setter: function(control) {
          var old, widget;
          old = this._control;
          if (old) {
            if (old.nodeType === 1) {
              $(old).remove();
            } else if (old instanceof cola.Widget) {
              old.destroy();
            }
          }
          if (control.nodeType === 1) {
            widget = cola.widget(control);
          }
          this._control = widget || control;
        }
      },
      contentContainer: null,
      parent: null
    };

    TabButton.EVENTS = {
      beforeClose: null,
      afterClose: null
    };

    TabButton.prototype.close = function() {
      var arg, ref;
      arg = {
        tab: this
      };
      this.fire("beforeClose", this, arg);
      if (arg.processDefault === false) {
        return this;
      }
      if ((ref = this._parent) != null) {
        ref.removeTab(this);
      }
      this.destroy();
      this.fire("afterClose", this, arg);
      return this;
    };

    TabButton.prototype.getControlDom = function() {
      var control, dom;
      control = this._control;
      if (control.nodeType !== 1) {
        if (control instanceof cola.Widget) {
          dom = control.getDom();
        } else if (control.constructor === Object.prototype.constructor) {
          if (control.$type) {
            control = this._control = cola.widget(control);
            dom = control.getDom();
          } else {
            dom = this._control = $.xCreate(control);
          }
        }
      }
      return dom || control;
    };

    TabButton.prototype.destroy = function() {
      if (this._destroyed) {
        return;
      }
      TabButton.__super__.destroy.call(this);
      delete this._control;
      delete this._contentContainer;
      delete this._parent;
      return this;
    };

    return TabButton;

  })(cola.tab.AbstractTabButton);

  cola.Tab = (function(superClass) {
    extend(Tab, superClass);

    function Tab() {
      return Tab.__super__.constructor.apply(this, arguments);
    }

    Tab.CLASS_NAME = "c-tab";

    Tab.TAG_NAME = "div";

    Tab.CHILDREN_TYPE_NAMESPACE = "tab";

    Tab.ATTRIBUTES = {
      direction: {
        refreshDom: true,
        "enum": ["left", "right", "top", "bottom"],
        defaultValue: "top",
        setter: function(value) {
          var oldValue;
          oldValue = this._direction;
          if (oldValue && oldValue !== value && this._dom) {
            this.get$Dom().removeClass(oldValue + "-bar");
          }
          this._direction = value;
          return this;
        }
      },
      tabs: {
        setter: function(list) {
          var l, len1, tab;
          this.clear();
          for (l = 0, len1 = list.length; l < len1; l++) {
            tab = list[l];
            this.addTab(tab);
          }
        }
      },
      currentTab: {
        getter: function() {
          var index, tab;
          index = this._currentTab;
          tab = this.getTab(index);
          this._currentTab = tab;
          return tab;
        },
        setter: function(index) {
          this.setCurrentIndex(index);
          return this;
        }
      }
    };

    Tab.EVENTS = {
      beforeChange: null,
      afterChange: null
    };

    Tab.prototype._tabContentRender = function(tab) {
      var container, contentsContainer, controlDom, tagName;
      contentsContainer = this.getContentsContainer();
      container = tab.get("contentContainer");
      if (container && container.parentNode === contentsContainer) {
        return;
      }
      tagName = contentsContainer.nodeName === "UL" ? "li" : "div";
      container = $.xCreate({
        tagName: tagName,
        "class": "item"
      });
      contentsContainer.appendChild(container);
      tab.set("contentContainer", container);
      controlDom = tab.getControlDom();
      if (controlDom) {
        return container.appendChild(controlDom);
      }
    };

    Tab.prototype._doRefreshDom = function() {
      if (!this._dom) {
        return;
      }
      Tab.__super__._doRefreshDom.call(this);
      this._classNamePool.remove("top-bar");
      this._classNamePool.add(this._direction + "-bar");
    };

    Tab.prototype.setCurrentTab = function(index) {
      var arg, container, newTab, oldTab;
      oldTab = this.get("currentTab");
      newTab = this.getTab(index);
      if (oldTab === newTab) {
        return true;
      }
      arg = {
        oldTab: oldTab,
        newTab: newTab
      };
      this.fire("beforeChange", this, arg);
      if (arg.processDefault === false) {
        return false;
      }
      if (oldTab) {
        oldTab.get$Dom().removeClass("active");
        $(oldTab.get("contentContainer")).removeClass("active");
      }
      newTab.get$Dom().addClass("active");
      container = newTab.get("contentContainer");
      if (!container) {
        this._tabContentRender(newTab);
        container = newTab.get("contentContainer");
      }
      $(container).addClass("active");
      this._currentTab = newTab;
      this.fire("afterChange", this, arg);
      return true;
    };

    Tab.prototype._setDom = function(dom, parseChild) {
      var activeExclusive, l, len1, ref, tab;
      Tab.__super__._setDom.call(this, dom, parseChild);
      activeExclusive = (function(_this) {
        return function(targetDom) {
          var tab;
          tab = cola.widget(targetDom);
          if (tab && tab instanceof cola.TabButton) {
            _this.setCurrentTab(tab);
          }
        };
      })(this);
      $(dom).delegate("> .tab-bar > .tabs > .tab-button", "click", function(event) {
        return activeExclusive(this, event);
      });
      if (!this._tabs) {
        return this;
      }
      ref = this._tabs;
      for (l = 0, len1 = ref.length; l < len1; l++) {
        tab = ref[l];
        this._tabRender(tab);
      }
      this.setCurrentTab(this._currentTab || 0);
      return this;
    };

    Tab.prototype._parseTabBarDom = function(dom) {
      var child, parseTabs;
      if (this._doms == null) {
        this._doms = {};
      }
      parseTabs = (function(_this) {
        return function(node) {
          var childNode, name, tab;
          childNode = node.firstChild;
          while (childNode) {
            if (childNode.nodeType === 1) {
              tab = cola.widget(childNode);
              name = $(childNode).attr("name");
              if (!tab && name) {
                tab = new cola.TabButton({
                  dom: childNode
                });
              }
              if (tab && name) {
                tab.set("name", name);
              }
              if (tab && tab instanceof cola.TabButton) {
                _this.addTab(tab);
              }
            }
            childNode = childNode.nextSibling;
          }
        };
      })(this);
      child = dom.firstChild;
      while (child) {
        if (child.nodeType === 1 && !this._doms.tabs && cola.util.hasClass(child, "tabs")) {
          this._doms.tabs = child;
          parseTabs(child);
        }
        child = child.nextSibling;
      }
    };

    Tab.prototype._parseDom = function(dom) {
      var _contents, child, control, item, l, len1, name, parseContents, tab, tabs;
      child = dom.firstChild;
      if (this._doms == null) {
        this._doms = {};
      }
      _contents = {};
      parseContents = function(node) {
        var contentNode, name;
        contentNode = node.firstChild;
        while (contentNode) {
          if (contentNode.nodeType === 1) {
            name = $(contentNode).attr("name");
            _contents[name] = contentNode;
            $(contentNode).addClass("item");
          }
          contentNode = contentNode.nextSibling;
        }
      };
      while (child) {
        if (child.nodeType === 1) {
          if (!this._doms.contents && cola.util.hasClass(child, "contents")) {
            this._doms.contents = child;
            parseContents(child);
          } else if (!this._doms.tabs && cola.util.hasClass(child, "tab-bar")) {
            this._doms.tabBar = child;
            this._parseTabBarDom(child);
          }
        }
        child = child.nextSibling;
      }
      tabs = this._tabs || [];
      for (l = 0, len1 = tabs.length; l < len1; l++) {
        tab = tabs[l];
        name = tab.get("name");
        if (name && _contents[name]) {
          item = _contents[name];
          control = item.children[0];
          tab.set("control", _contents[name]);
          tab.set("contentContainer", item);
        }
      }
    };

    Tab.prototype.getTabBarDom = function() {
      var dom;
      if (this._doms == null) {
        this._doms = {};
      }
      if (!this._doms.tabBar) {
        dom = this._doms.tabBar = $.xCreate({
          tagName: "nav",
          "class": "tab-bar"
        });
        this._dom.appendChild(dom);
      }
      return this._doms.tabs;
    };

    Tab.prototype.getTabsContainer = function() {
      var dom;
      if (this._doms == null) {
        this._doms = {};
      }
      if (!this._doms.tabs) {
        dom = this._doms.tabs = $.xCreate({
          tagName: "ul",
          "class": "tabs"
        });
        this.getTabBarDom().appendChild(dom);
      }
      return this._doms.tabs;
    };

    Tab.prototype.getContentsContainer = function() {
      var dom;
      if (!this._doms.contents) {
        dom = this._doms.contents = $.xCreate({
          tagName: "ul",
          "class": "contents"
        });
        this._dom.appendChild(dom);
      }
      return this._doms.contents;
    };

    Tab.prototype._tabRender = function(tab) {
      var container, dom;
      container = this.getTabsContainer();
      dom = tab.getDom();
      if (dom.parentNode !== container) {
        container.appendChild(dom);
      }
    };

    Tab.prototype.addTab = function(tab) {
      if (this._tabs == null) {
        this._tabs = [];
      }
      if (this._tabs.indexOf(tab) > -1) {
        return this;
      }
      this._tabs.push(tab);
      tab.set("parent", this);
      if (this._dom) {
        this._tabRender(tab);
      }
      return this;
    };

    Tab.prototype.getTab = function(index) {
      var l, len1, tab, tabs;
      tabs = this._tabs || [];
      if (typeof index === "string") {
        for (l = 0, len1 = tabs.length; l < len1; l++) {
          tab = tabs[l];
          if (tab.get("name") === index) {
            return tab;
          }
        }
      } else if (typeof index === "number") {
        return tabs[index];
      } else if (index instanceof cola.TabButton) {
        return index;
      }
      return null;
    };

    Tab.prototype.removeTab = function(tab) {
      var contentContainer, index, newIndex, obj;
      index = -1;
      if (typeof tab === "number") {
        index = tab;
        obj = this._tabs[index];
      } else if (tab instanceof cola.TabButton) {
        index = this._tabs.indexOf(tab);
        obj = tab;
      } else if (typeof tab === "string") {
        obj = this.getTab(tab);
        index = this._tabs.indexOf(obj);
      }
      if (index > -1 && obj) {
        if (this.get("currentTab") === obj) {
          newIndex = index === (this._tabs.length - 1) ? index - 1 : index + 1;
          if (!this.setCurrentTab(newIndex)) {
            return false;
          }
        }
        this._tabs.splice(index, 1);
        obj.remove();
        contentContainer = obj.get("contentContainer");
        if ((contentContainer != null ? contentContainer.parentNode : void 0) === this._doms.tabs) {
          $(contentContainer).remove();
        }
      }
      return true;
    };

    Tab.prototype.clear = function() {
      var l, len1, tab, tabs;
      tabs = this._tabs || [];
      if (tabs.length < 1) {
        return this;
      }
      for (l = 0, len1 = tabs.length; l < len1; l++) {
        tab = tabs[l];
        tab.destroy();
      }
      return this._tabs = [];
    };

    return Tab;

  })(cola.Widget);

  cola.AbstractEditor = (function(superClass) {
    extend(AbstractEditor, superClass);

    function AbstractEditor() {
      return AbstractEditor.__super__.constructor.apply(this, arguments);
    }

    AbstractEditor.ATTRIBUTES = {
      value: {
        refreshDom: true,
        setter: function(value) {
          return this._setValue(value);
        }
      },
      bind: {
        refreshDom: true,
        setter: function(bindStr) {
          return this._bindSetter(bindStr);
        }
      },
      readOnly: {
        refreshDom: true,
        type: "boolean",
        defaultValue: false
      },
      state: {
        setter: function(state) {
          var dom, oldState;
          oldState = this._state;
          if (oldState !== state) {
            dom = this._dom;
            if (dom && oldState) {
              cola.util.removeClass(dom, oldState);
              if (this._fieldDom) {
                cola.util.removeClass(this._fieldDom, oldState);
              }
            }
            this._state = state;
            if (dom && state) {
              cola.util.addClass(dom, state);
              if (this._fieldDom) {
                cola.util.addClass(this._fieldDom, state);
              }
            }
          }
        }
      }
    };

    AbstractEditor.EVENTS = {
      beforePost: null,
      post: null,
      beforeChange: null,
      change: null
    };

    AbstractEditor.prototype._initDom = function(dom) {
      var fieldDom;
      if (this._state) {
        cola.util.addClass(dom, this._state);
      }
      fieldDom = dom.parentNode;
      if (fieldDom && !jQuery.find.matchesSelector(fieldDom, ".field")) {
        fieldDom = null;
      }
      this._fieldDom = fieldDom;
    };

    AbstractEditor.prototype._setValue = function(value) {
      var arg;
      if (this._value === value) {
        return false;
      }
      arg = {
        oldValue: this._value,
        value: value
      };
      if (this.fire("beforeChange", this, arg) === false) {
        return;
      }
      this._value = value;
      this.fire("change", this, arg);
      if (value !== this._modelValue) {
        this.post();
      }
      return true;
    };

    AbstractEditor.prototype.post = function() {
      if (this.fire("beforePost", this) === false) {
        return this;
      }
      this._post();
      this.fire("post", this);
      return this;
    };

    AbstractEditor.prototype._post = function() {
      this._writeBindingValue(this._value);
    };

    AbstractEditor.prototype._filterDataMessage = function(path, type, arg) {
      return (cola.constants.MESSAGE_REFRESH <= type && type <= cola.constants.MESSAGE_CURRENT_CHANGE) || type === cola.constants.MESSAGE_VALIDATION_STATE_CHANGE || this._watchingMoreMessage;
    };

    AbstractEditor.prototype._processDataMessage = function(path, type, arg) {
      var $formDom, form, keyMessage, value;
      if (type === cola.constants.MESSAGE_VALIDATION_STATE_CHANGE) {
        keyMessage = arg.entity.getKeyMessage(arg.property);
        this.set("state", keyMessage != null ? keyMessage.type : void 0);
        if (this._formDom === void 0) {
          if (this._fieldDom) {
            $formDom = $fly(this._fieldDom).closest(".ui.form");
          }
          this._formDom = ($formDom != null ? $formDom[0] : void 0) || null;
        }
        if (this._formDom) {
          form = cola.widget(this._formDom);
          if (form && form instanceof cola.Form) {
            return form.setFieldMessages(this, keyMessage);
          }
        }
      } else {
        value = this._readBindingValue();
        if (this._dataType) {
          value = this._dataType.parse(value);
        }
        this._modelValue = value;
        if (this._setValue(value)) {
          cola.util.delay(this, "refreshDom", 50, this._refreshDom);
        }
      }
    };

    return AbstractEditor;

  })(cola.Widget);

  cola.Element.mixin(cola.AbstractEditor, cola.DataWidgetMixin);

  cola.AbstractCheckbox = (function(superClass) {
    extend(AbstractCheckbox, superClass);

    function AbstractCheckbox() {
      return AbstractCheckbox.__super__.constructor.apply(this, arguments);
    }

    AbstractCheckbox.CLASS_NAME = "checkbox";

    AbstractCheckbox.INPUT_TYPE = "checkbox";

    AbstractCheckbox.ATTRIBUTES = {
      label: {
        refreshDom: true
      },
      name: {
        refreshDom: true
      },
      onValue: {
        defaultValue: true
      },
      offValue: {
        defaultValue: false
      },
      disabled: {
        refreshDom: true,
        type: "boolean",
        defaultValue: false
      },
      checked: {
        refreshDom: true,
        type: "boolean",
        defaultValue: false,
        getter: function() {
          return this._value === this._onValue;
        },
        setter: function(state) {
          var checked, value;
          checked = !!state;
          value = checked ? this.get("onValue") : this.get("offValue");
          this._setValue(value);
          return this;
        }
      },
      value: {
        defaultValue: false,
        refreshDom: true,
        setter: function(value) {
          return this._setValue(value);
        }
      }
    };

    AbstractCheckbox._modelValue = false;

    AbstractCheckbox.prototype._parseDom = function(dom) {
      var child, nameAttr;
      if (this._doms == null) {
        this._doms = {};
      }
      if (this._$dom == null) {
        this._$dom = $(dom);
      }
      child = dom.firstChild;
      while (child) {
        if (child.nodeType === 1) {
          if (child.nodeName === "LABEL") {
            this._doms.label = child;
            if (this._label == null) {
              this._label = cola.util.getTextChildData(child);
            }
          } else if (child.nodeName === "INPUT") {
            nameAttr = child.getAttribute("name");
            if (nameAttr) {
              if (this._name == null) {
                this._name = nameAttr;
              }
            }
            this._doms.input = child;
          }
        }
        child = child.nextSibling;
      }
      if (!this._doms.label && !this._doms.input) {
        this._$dom.append($.xCreate([
          {
            tagName: "input",
            type: this.constructor.INPUT_TYPE,
            contextKey: "input",
            name: this._name || ""
          }, {
            tagName: "label",
            content: this._label || "",
            contextKey: "label"
          }
        ], this._doms));
      }
      if (!this._doms.label) {
        this._doms.label = $.xCreate({
          tagName: "label",
          content: this._label || ""
        });
        this._$dom.append(this._doms.label);
      }
      if (!this._doms.input) {
        this._doms.input = $.xCreate({
          tagName: "input",
          type: this.constructor.INPUT_TYPE,
          name: this._name || ""
        });
        $(this._doms.label).before(this._doms.input);
      }
      this._bindToSemantic();
    };

    AbstractCheckbox.prototype._createDom = function() {
      return $.xCreate({
        tagName: "DIV",
        "class": "ui " + this.constructor.CLASS_NAME,
        content: [
          {
            tagName: "input",
            type: this.constructor.INPUT_TYPE,
            contextKey: "input",
            name: this.get("name") || ""
          }, {
            tagName: "label",
            content: this._label || "",
            contextKey: "label"
          }
        ]
      }, this._doms);
    };

    AbstractCheckbox.prototype._bindToSemantic = function() {
      return this.get$Dom().checkbox({
        onChange: (function(_this) {
          return function() {
            return _this._setValue(_this._getValue());
          };
        })(this)
      });
    };

    AbstractCheckbox.prototype._setDom = function(dom, parseChild) {
      this._dom = dom;
      if (!parseChild) {
        this._bindToSemantic();
      }
      AbstractCheckbox.__super__._setDom.call(this, dom, parseChild);
    };

    AbstractCheckbox.prototype._refreshEditorDom = function() {
      return this.get$Dom().checkbox(this._value === this._onValue ? "check" : "uncheck");
    };

    AbstractCheckbox.prototype._doRefreshDom = function() {
      var $dom, label, readOnly;
      if (!this._dom) {
        return;
      }
      AbstractCheckbox.__super__._doRefreshDom.call(this);
      if (this._doms == null) {
        this._doms = {};
      }
      label = this.get("label") || "";
      $(this._doms.label).text(label);
      readOnly = this.get("readOnly");
      this._classNamePool.toggle("read-only", readOnly);
      $dom = this.get$Dom();
      $dom.checkbox(!!this._disabled ? "disable" : "enable");
      return this._refreshEditorDom();
    };

    AbstractCheckbox.prototype._getValue = function() {
      if (this.get$Dom().checkbox("is checked")) {
        return this.get("onValue");
      } else {
        return this.get("offValue");
      }
    };

    AbstractCheckbox.prototype.toggle = function() {
      var state;
      state = !!this.get("checked");
      this.set("checked", !state);
      return this;
    };

    return AbstractCheckbox;

  })(cola.AbstractEditor);

  cola.Checkbox = (function(superClass) {
    extend(Checkbox, superClass);

    function Checkbox() {
      return Checkbox.__super__.constructor.apply(this, arguments);
    }

    Checkbox.ATTRIBUTES = {
      indeterminateValue: null,
      triState: {
        type: "boolean",
        defaultValue: false
      }
    };

    Checkbox.prototype._getValue = function() {
      if (this._triState && !this.get$Dom().checkbox("is determinate")) {
        return this.get("indeterminateValue");
      }
      return Checkbox.__super__._getValue.call(this);
    };

    Checkbox.prototype._refreshEditorDom = function() {
      if (this._triState && this._value !== this._onValue && this._value !== this._offValue) {
        this.get$Dom().checkbox('set indeterminate');
        return;
      }
      return Checkbox.__super__._refreshEditorDom.call(this);
    };

    return Checkbox;

  })(cola.AbstractCheckbox);

  cola.Toggle = (function(superClass) {
    extend(Toggle, superClass);

    function Toggle() {
      return Toggle.__super__.constructor.apply(this, arguments);
    }

    Toggle.CLASS_NAME = "toggle checkbox";

    return Toggle;

  })(cola.AbstractCheckbox);

  cola.Slider = (function(superClass) {
    extend(Slider, superClass);

    function Slider() {
      return Slider.__super__.constructor.apply(this, arguments);
    }

    Slider.CLASS_NAME = "slider checkbox";

    return Slider;

  })(cola.AbstractCheckbox);

  DEFAULT_DATE_DISPLAY_FORMAT = "yyyy-MM-dd";

  DEFAULT_DATE_INPUT_FORMAT = "yyyyMMdd";

  DEFAULT_TIME_DISPLAY_FORMAT = "HH:mm:ss";

  DEFAULT_TIME_INPUT_FORMAT = "HHmmss";

  cola.AbstractInput = (function(superClass) {
    extend(AbstractInput, superClass);

    function AbstractInput() {
      return AbstractInput.__super__.constructor.apply(this, arguments);
    }

    AbstractInput.CLASS_NAME = "input";

    AbstractInput.SEMANTIC_CLASS = ["left floated", "right floated", "corner labeled", "right labeled", "left icon", "left action"];

    AbstractInput.ATTRIBUTES = {
      name: null,
      value: {
        setter: function(value) {
          if (this._dataType) {
            value = this._dataType.parse(value);
          }
          return this._setValue(value);
        }
      },
      dataType: {
        setter: function(dataType) {
          this._dataTypeDefined = !!dataType;
          return cola.DataType.dataTypeSetter.call(this, dataType);
        }
      },
      size: {
        "enum": ["mini", "tiny", "small", "medium", "large", "big", "huge", "massive"],
        refreshDom: true,
        setter: function(value) {
          var oldValue;
          oldValue = this["_size"];
          if (oldValue && oldValue !== value && this._dom) {
            this.get$Dom().removeClass(oldValue);
          }
          this["_size"] = value;
        }
      },
      placeholder: {
        refreshDom: true
      },
      icon: {
        refreshDom: true,
        setter: function(value) {
          var $iconDom, oldValue, ref;
          oldValue = this["_icon"];
          this["_icon"] = value;
          if (oldValue && oldValue !== value && this._dom && ((ref = this._doms) != null ? ref.iconDom : void 0)) {
            $iconDom = $(this._doms.iconDom);
            $iconDom.removeClass(oldValue);
          }
        }
      },
      iconPosition: {
        refreshDom: true,
        defaultValue: "right",
        "enum": ["left", "right"],
        setter: function(value) {
          var oldValue;
          oldValue = this["_iconPosition"];
          this["_iconPosition"] = value;
          if (oldValue && oldValue !== value && oldValue === "left" && this._dom) {
            $removeClass(this._dom, "left icon", true);
          }
        }
      },
      corner: {
        setter: function(value) {
          var oldValue;
          oldValue = this["_corner"];
          if (oldValue != null) {
            oldValue.destroy();
          }
          delete this["_corner"];
          if (value) {
            if (value instanceof cola.Corner) {
              this["_corner"] = value;
            } else if (value.$type === "Corner") {
              this["_corner"] = cola.widget(value);
            }
          }
        }
      },
      label: {
        refreshDom: true,
        setter: function(value) {
          var oldValue;
          oldValue = this["_label"];
          if (oldValue != null) {
            oldValue.destroy();
          }
          delete this["_label"];
          if (value) {
            if (value instanceof cola.Label) {
              this["_label"] = value;
            } else if (value.$type) {
              this["_label"] = cola.widget(value);
            } else {
              delete this["_label"];
            }
          }
        }
      },
      labelPosition: {
        refreshDom: true,
        defaultValue: "left",
        "enum": ["left", "right"]
      },
      actionButton: {
        refreshDom: true,
        setter: function(value) {
          var oldValue;
          oldValue = this["_actionButton"];
          if (oldValue != null) {
            oldValue.destroy();
          }
          delete this["_actionButton"];
          if (value) {
            if (value instanceof cola.Button) {
              this["_actionButton"] = value;
            } else if (value.$type === "Button") {
              this["_actionButton"] = cola.widget(value);
            }
          }
        }
      },
      buttonPosition: {
        refreshDom: true,
        defaultValue: "right",
        "enum": ["left", "right"]
      }
    };

    AbstractInput.prototype.destroy = function() {
      if (!this._destroyed) {
        AbstractInput.__super__.destroy.call(this);
        delete this._doms;
        delete this["_corner"];
        delete this["_actionButton"];
        delete this["_label"];
      }
    };

    AbstractInput.prototype._bindSetter = function(bindStr) {
      AbstractInput.__super__._bindSetter.call(this, bindStr);
      cola.DataType.dataTypeSetter.call(this, this._getBindingDataType());
    };

    AbstractInput.prototype._parseDom = function(dom) {
      var $actionButtonDom, $labelDom, buttonIndex, child, childConfig, index, inputDom, inputIndex, l, labelIndex, len1, ref, widget;
      if (!dom) {
        return;
      }
      if (this._doms == null) {
        this._doms = {};
      }
      inputIndex = -1;
      buttonIndex = 0;
      labelIndex = 0;
      childConfig = {};
      ref = dom.childNodes;
      for (index = l = 0, len1 = ref.length; l < len1; index = ++l) {
        child = ref[index];
        if (child.nodeType !== 1) {
          continue;
        }
        widget = cola.widget(child);
        if (widget) {
          if (widget instanceof cola.Corner) {
            childConfig.corner = this._corner = widget;
          } else if (widget instanceof cola.Label) {
            labelIndex = index;
            childConfig.label = this._label = widget;
          } else if (widget instanceof cola.Button) {
            buttonIndex = index;
            childConfig.actionButton = this._actionButton = widget;
          }
        } else {
          if (child.nodeName === "I") {
            this._doms.iconDom = child;
            this._icon = child.className;
          } else if (this._isEditorDom(child)) {
            inputIndex = index;
            this._doms.input = child;
          }
        }
      }
      if (childConfig.label && inputIndex > -1 && labelIndex > inputIndex && !config.labelPosition) {
        this._labelPosition = "right";
      }
      if (childConfig.actionButton && inputIndex > -1 && buttonIndex < inputIndex && !config.buttonPosition) {
        this._buttonPosition = "left";
      }
      if (inputIndex === -1) {
        inputDom = this._doms.input = this._createEditorDom();
        if (childConfig.label) {
          $labelDom = childConfig.label.get$Dom();
          if (this._labelPosition === "right") {
            $labelDom.before(inputDom);
          } else {
            $labelDom.after(inputDom);
          }
        } else if (childConfig.actionButton) {
          $actionButtonDom = childConfig.actionButton.get$Dom();
          if (this._buttonPosition === "left") {
            $actionButtonDom.after(inputDom);
          } else {
            $actionButtonDom.before(inputDom);
          }
        } else if (childConfig.corner) {
          childConfig.corner.get$Dom().before(inputDom);
        } else {
          this.get$Dom().append(inputDom);
        }
      }
      return this;
    };

    AbstractInput.prototype._createEditorDom = function() {
      return $.xCreate({
        tagName: "input",
        type: "text"
      });
    };

    AbstractInput.prototype._isEditorDom = function(node) {
      return node.nodeName === "INPUT";
    };

    AbstractInput.prototype._createDom = function() {
      var className, dom, inputDom;
      className = this.constructor.CLASS_NAME;
      if (this._doms == null) {
        this._doms = {};
      }
      inputDom = this._doms.input = this._createEditorDom();
      dom = $.xCreate({
        tagName: "DIV",
        "class": "ui " + className
      }, this._doms);
      dom.appendChild(inputDom);
      return dom;
    };

    AbstractInput.prototype._refreshCorner = function() {
      var corner, cornerDom;
      corner = this.get("corner");
      if (!corner) {
        return;
      }
      cornerDom = corner.getDom();
      if (cornerDom.parentNode !== this._dom) {
        this._dom.appendChild(cornerDom);
      }
      this._classNamePool.remove("labeled");
      this._classNamePool.add("corner labeled");
    };

    AbstractInput.prototype._refreshLabel = function() {
      var label, labelDom, labelPosition, rightLabeled;
      if (!this._dom) {
        return;
      }
      label = this.get("label");
      labelPosition = this.get("labelPosition");
      this._classNamePool.remove("right labeled");
      this._classNamePool.remove("labeled");
      if (!label) {
        return;
      }
      labelDom = label.getDom();
      rightLabeled = labelPosition === "right";
      this._classNamePool.add(rightLabeled ? "right labeled" : "labeled");
      if (rightLabeled) {
        this._dom.appendChild(labelDom);
      } else {
        $(this._doms.input).before(labelDom);
      }
    };

    AbstractInput.prototype._refreshButton = function() {
      var actionButton, btnDom, buttonPosition, leftAction;
      actionButton = this.get("actionButton");
      buttonPosition = this.get("buttonPosition");
      this._classNamePool.remove("left action");
      this._classNamePool.remove("action");
      if (!actionButton) {
        return;
      }
      btnDom = actionButton.getDom();
      leftAction = buttonPosition === "left";
      this._classNamePool.add(leftAction ? "left action" : "action");
      cola._ignoreNodeRemoved = true;
      if (leftAction) {
        $(this._doms.input).before(btnDom);
      } else {
        this._dom.appendChild(btnDom);
      }
      cola._ignoreNodeRemoved = false;
    };

    AbstractInput.prototype._refreshIcon = function() {
      var base, classNamePool, icon, iconDom, iconPosition, leftIcon;
      icon = this.get("icon");
      iconPosition = this.get("iconPosition");
      classNamePool = this._classNamePool;
      classNamePool.remove("left icon");
      classNamePool.remove("icon");
      if (icon) {
        if ((base = this._doms).iconDom == null) {
          base.iconDom = document.createElement("i");
        }
        iconDom = this._doms.iconDom;
        $(iconDom).addClass(icon + " icon");
        leftIcon = iconPosition === "left";
        classNamePool.add(leftIcon ? "left icon" : "icon");
        cola._ignoreNodeRemoved = true;
        if (leftIcon) {
          $(this._doms.input).before(iconDom);
        } else {
          this._dom.appendChild(iconDom);
        }
        cola._ignoreNodeRemoved = false;
      } else {
        if (this._doms.iconDom) {
          $(this._doms.iconDom).remove();
        }
      }
    };

    AbstractInput.prototype._refreshInput = function() {
      var $inputDom, align, dataType, inputType, ref;
      $inputDom = $fly(this._doms.input);
      if (this._name) {
        $inputDom.attr("name", this._name);
      }
      $inputDom.attr("placeholder", this.get("placeholder"));
      $inputDom.prop("readOnly", this._finalReadOnly);
      if ((ref = this.get("actionButton")) != null) {
        ref.set("disabled", this._finalReadOnly);
      }
      dataType = this._dataType;
      if (dataType && !this._inputType) {
        inputType = "text";
        align = "left";
        if (dataType instanceof cola.NumberDataType) {
          inputType = "number";
          align = "right";
        }
        $inputDom.prop("type", inputType).css("text-align", align);
      }
      this._refreshInputValue(this._value);
    };

    AbstractInput.prototype._refreshInputValue = function(value) {
      $fly(this._doms.input).val(value != null ? value + "" || "" : void 0);
    };

    AbstractInput.prototype._doRefreshDom = function() {
      if (!this._dom) {
        return;
      }
      AbstractInput.__super__._doRefreshDom.call(this);
      this._finalReadOnly = !!this.get("readOnly");
      this._refreshIcon();
      this._refreshButton();
      this._refreshCorner();
      this._refreshLabel();
      this._refreshInput();
    };

    AbstractInput.prototype.focus = function() {
      var ref;
      if ((ref = this._doms.input) != null) {
        ref.focus();
      }
    };

    return AbstractInput;

  })(cola.AbstractEditor);

  cola.Input = (function(superClass) {
    extend(Input, superClass);

    function Input() {
      return Input.__super__.constructor.apply(this, arguments);
    }

    Input.CLASS_NAME = "input";

    Input.ATTRIBUTES = {
      displayFormat: null,
      inputFormat: null,
      inputType: {
        defaultValue: "text"
      }
    };

    Input.EVENTS = {
      focus: null,
      blur: null
    };

    Input.prototype._createEditorDom = function() {
      var config;
      config = {
        tagName: "input",
        type: this._inputType || "text"
      };
      if (this._inputType === "number") {
        config.style = {
          "text-align": "right"
        };
      }
      return $.xCreate(config);
    };

    Input.prototype._isEditorDom = function(node) {
      return node.nodeName === "INPUT";
    };

    Input.prototype._initDom = function(dom) {
      Input.__super__._initDom.call(this, dom);
      $(this._doms.input).on("change", (function(_this) {
        return function() {
          var dataType, inputFormat, readOnly, value;
          readOnly = !!_this.get("readOnly");
          if (!readOnly) {
            value = $(_this._doms.input).val();
            dataType = _this._dataType;
            if (dataType) {
              if (_this._inputType === "text") {
                inputFormat = _this._inputFormat;
                if (dataType instanceof cola.DateDataType) {
                  if (inputFormat == null) {
                    inputFormat = DEFAULT_DATE_INPUT_FORMAT;
                  }
                  value = inputFormat + "||" + value;
                }
              }
              value = dataType.parse(value);
            }
            _this.set("value", value);
          }
        };
      })(this)).on("focus", (function(_this) {
        return function() {
          _this._inputFocused = true;
          _this._refreshInputValue(_this._value);
          _this.fire("focus", _this);
        };
      })(this)).on("blur", (function(_this) {
        return function() {
          var entity, propertyDef;
          _this._inputFocused = false;
          _this._refreshInputValue(_this._value);
          _this.fire("blur", _this);
          if ((_this._value == null) || _this._value === "" && _this._bindInfo.isWriteable) {
            propertyDef = _this._getBindingProperty();
            if ((propertyDef != null ? propertyDef._required : void 0) && propertyDef._validators) {
              entity = _this._scope.get(_this._bindInfo.entityPath);
              if (entity) {
                entity.validate(_this._bindInfo.property);
              }
            }
          }
        };
      })(this));
    };

    Input.prototype._refreshInputValue = function(value) {
      var format, inputType;
      inputType = this._inputType;
      if (inputType === "text") {
        format = this._inputFocused ? this._inputFormat : this._displayFormat;
        if (typeof value === "number") {
          if (format) {
            value = formatNumber(format, value);
          }
        } else if (value instanceof Date) {
          if (!format) {
            format = this._inputFocused ? DEFAULT_DATE_INPUT_FORMAT : DEFAULT_DATE_DISPLAY_FORMAT;
          }
          value = (new XDate(value)).toString(format);
        }
      } else {
        if (value instanceof Date) {
          if (inputType === "date") {
            format = DEFAULT_DATE_DISPLAY_FORMAT;
          } else if (inputType === "time") {
            format = DEFAULT_TIME_DISPLAY_FORMAT;
          } else {
            format = ISO_FORMAT_STRING;
          }
          value = (new XDate(value)).toString(format);
        }
      }
      return Input.__super__._refreshInputValue.call(this, value);
    };

    return Input;

  })(cola.AbstractInput);

  cola.Progress = (function(superClass) {
    extend(Progress, superClass);

    function Progress() {
      return Progress.__super__.constructor.apply(this, arguments);
    }

    Progress.CLASS_NAME = "progress";

    Progress.SEMANTIC_CLASS = ["left floated", "right floated"];

    Progress.ATTRIBUTES = {
      total: {
        type: "number",
        defaultValue: 0,
        setter: function(value) {
          this._total = value;
          this._setting("total", value);
        }
      },
      value: {
        type: "number",
        defaultValue: 0,
        setter: function(value) {
          this._value = value;
          this.progress(value);
        }
      },
      showProgress: {
        defaultValue: true,
        type: "boolean",
        refreshDom: true
      },
      progressFormat: {
        "enum": ["percent", "ratio"],
        defaultValue: "percent",
        setter: function(value) {
          this._progressFormat = value;
          if (this._dom) {
            this._setting("label", value);
          }
        }
      },
      ratioText: {
        defaultValue: "{percent}%",
        setter: function(value) {
          this._ratioText = value;
          if (this._dom) {
            this._settingText();
          }
        }
      },
      activeMessage: {
        refreshDom: true,
        setter: function(value) {
          this._activeMessage = value;
          if (this._dom) {
            this._settingText();
          }
        }
      },
      successMessage: {
        refreshDom: true,
        setter: function(value) {
          this._successMessage = value;
          if (this._dom) {
            this._settingText();
          }
        }
      },
      autoSuccess: {
        defaultValue: true,
        type: "boolean",
        setter: function(value) {
          this._autoSuccess = !!value;
          if (this._dom) {
            this._setting("autoSuccess", this._autoSuccess);
          }
        }
      },
      showActivity: {
        type: "boolean",
        defaultValue: true,
        setter: function(value) {
          this._showActivity = !!value;
          if (this._dom) {
            this._setting("showActivity", this._showActivity);
          }
        }
      },
      limitValues: {
        type: "boolean",
        defaultValue: true,
        setter: function(value) {
          this._limitValues = value;
          if (this._dom) {
            this._setting("limitValues", this._limitValues);
          }
        }
      },
      precision: {
        type: "number",
        refreshDom: true,
        defaultValue: 1
      }
    };

    Progress.EVENTS = {
      change: null,
      success: null,
      active: null,
      error: null,
      warning: null
    };

    Progress.prototype._initDom = function(dom) {
      if (this._doms == null) {
        this._doms = {};
      }
      return $(dom).empty().append($.xCreate([
        {
          tagName: "div",
          "class": "bar",
          content: {
            tagName: "div",
            "class": "progress",
            contextKey: "progress"
          },
          contextKey: "bar"
        }, {
          tagName: "div",
          "class": "label",
          contextKey: "label"
        }
      ], this._doms));
    };

    Progress.prototype._setting = function(name, value) {
      if (!this._dom) {
        return;
      }
      if (this._dom) {
        this.get$Dom().progress("setting", name, value);
      }
    };

    Progress.prototype._settingText = function() {
      this._setting("text", {
        active: this._activeMessage || "",
        success: this._successMessage || "",
        ratio: this._ratioText || "{percent}%"
      });
    };

    Progress.prototype._doRefreshDom = function() {
      var $dom;
      if (!this._dom) {
        return;
      }
      Progress.__super__._doRefreshDom.call(this);
      $dom = this.get$Dom();
      if (this._doms == null) {
        this._doms = {};
      }
      if (this._activeMessage || this._successMessage) {
        if (!this._doms.label.parentNode) {
          $dom.append(this._doms.label);
        }
      } else {
        if (this._doms.label.parentNode) {
          $(this._doms.label).remove();
        }
      }
      if (this._showProgress) {
        if (this._doms.progress.parentNode !== this._doms.bar) {
          this._doms.bar.appendChild(this._doms.progress);
        }
      } else {
        if (this._doms.progress.parentNode) {
          $(this._doms.progress).remove();
        }
      }
    };

    Progress.prototype._setDom = function(dom, parseChild) {
      var listenState;
      Progress.__super__._setDom.call(this, dom, parseChild);
      listenState = (function(_this) {
        return function(eventName, arg) {
          return _this.fire(eventName, _this, arg);
        };
      })(this);
      this.get$Dom().progress({
        total: this.get("total"),
        label: this._labelFormat,
        autoSuccess: this._autoSuccess,
        showActivity: this._showActivity,
        limitValues: this._limitValues,
        precision: this._precision,
        text: {
          active: this._activeMessage || "",
          success: this._successMessage || "",
          ratio: this._ratioText
        },
        onChange: function(percent, value, total) {
          var arg;
          arg = {
            percent: percent,
            value: value,
            total: total
          };
          return listenState("change", arg);
        },
        onSuccess: function(total) {
          var arg;
          arg = {
            total: total
          };
          return listenState("success", arg);
        },
        onActive: function(value, total) {
          var arg;
          arg = {
            value: value,
            total: total
          };
          return listenState("active", arg);
        },
        onWarning: function(value, total) {
          var arg;
          arg = {
            value: value,
            total: total
          };
          return listenState("warning", arg);
        },
        onError: function(value, total) {
          var arg;
          arg = {
            value: value,
            total: total
          };
          return listenState("error", arg);
        }
      });
      this.progress(this._value);
    };

    Progress.prototype.reset = function() {
      if (this._dom) {
        this.get$Dom().progress("reset");
      }
      return this;
    };

    Progress.prototype.success = function(message) {
      if (message == null) {
        message = "";
      }
      if (this._dom) {
        this.get$Dom().progress("set success", message);
      }
      return this;
    };

    Progress.prototype.warning = function(message) {
      if (this._dom) {
        this.get$Dom().progress("set warning", message);
      }
      return this;
    };

    Progress.prototype.error = function(message) {
      if (this._dom) {
        this.get$Dom().progress("set error", message);
      }
      return this;
    };

    Progress.prototype.progress = function(progress) {
      this._value = progress;
      if (this._dom) {
        this.get$Dom().progress("set progress", progress);
      }
      return this;
    };

    Progress.prototype.complete = function() {
      this._value = this._total;
      if (this._dom) {
        this.get$Dom().progress("complete");
      }
      return this;
    };

    Progress.prototype.destroy = function() {
      var ref;
      if (this._destroyed) {
        return;
      }
      if ((ref = this._$dom) != null) {
        ref.progress("destroy");
      }
      Progress.__super__.destroy.call(this);
      delete this._doms;
    };

    return Progress;

  })(cola.Widget);

  cola.RadioButton = (function(superClass) {
    extend(RadioButton, superClass);

    function RadioButton() {
      return RadioButton.__super__.constructor.apply(this, arguments);
    }

    RadioButton.CLASS_NAME = "checkbox";

    RadioButton.INPUT_TYPE = "radio";

    RadioButton.ATTRIBUTES = {
      type: {
        "enum": ["radio", "toggle", "slider"],
        defaultValue: "radio",
        refreshDom: true,
        setter: function(value) {
          var oldValue;
          oldValue = this._type;
          this._type = value;
          if (oldValue && this._dom && oldValue !== value) {
            $fly(this._dom).removeClass(oldValue);
          }
          return this;
        }
      },
      label: {
        refreshDom: true
      },
      name: {
        refreshDom: true
      },
      disabled: {
        type: "boolean",
        refreshDom: true,
        defaultValue: false
      },
      checked: {
        type: "boolean",
        refreshDom: true,
        defaultValue: false
      },
      value: {
        defaultValue: true,
        refreshDom: true
      },
      readOnly: {
        type: "boolean",
        refreshDom: true,
        defaultValue: false
      }
    };

    RadioButton._modelValue = false;

    RadioButton.prototype._parseDom = function(dom) {
      var child, nameAttr;
      if (this._doms == null) {
        this._doms = {};
      }
      this._$dom = $(dom);
      child = dom.firstChild;
      while (child) {
        if (child.nodeType === 1) {
          if (child.nodeName === "LABEL") {
            this._doms.label = child;
            if (this._label == null) {
              this._label = cola.util.getTextChildData(child);
            }
          } else if (child.nodeName === "INPUT") {
            nameAttr = child.getAttribute("name");
            if (nameAttr) {
              if (this._name == null) {
                this._name = nameAttr;
              }
            }
            this._doms.input = child;
          }
        }
        child = child.nextSibling;
      }
      if (!this._doms.label && !this._doms.input) {
        this._$dom.append($.xCreate([
          {
            tagName: "input",
            type: this.constructor.INPUT_TYPE,
            contextKey: "input",
            name: this._name || ""
          }, {
            tagName: "label",
            content: this._label || "",
            contextKey: "label"
          }
        ], this._doms));
      }
      if (!this._doms.label) {
        this._doms.label = $.xCreate({
          tagName: "label",
          content: this._label || this._value || ""
        });
        this._$dom.append(this._doms.label);
      }
      if (!this._doms.input) {
        this._doms.input = $.xCreate({
          tagName: "input",
          type: this.constructor.INPUT_TYPE,
          name: this._name || ""
        });
        $(this._doms.label).before(this._doms.input);
      }
      this._bindToSemantic();
    };

    RadioButton.prototype._createDom = function() {
      return $.xCreate({
        tagName: "DIV",
        "class": "ui " + this.constructor.CLASS_NAME,
        content: [
          {
            tagName: "input",
            type: this.constructor.INPUT_TYPE,
            contextKey: "input",
            name: this._name || ""
          }, {
            tagName: "label",
            content: this._label || this._value || "",
            contextKey: "label"
          }
        ]
      }, this._doms);
    };

    RadioButton.prototype._bindToSemantic = function() {
      return this.get$Dom().checkbox({
        onChange: (function(_this) {
          return function() {
            return _this._changeState();
          };
        })(this)
      });
    };

    RadioButton.prototype._changeState = function() {
      var ref;
      this._checked = this.get$Dom().checkbox("is checked");
      if (this._checked) {
        return (ref = this._parent) != null ? ref.set("value", this._value) : void 0;
      }
    };

    RadioButton.prototype._setDom = function(dom, parseChild) {
      this._dom = dom;
      if (!parseChild) {
        this._bindToSemantic();
      }
      RadioButton.__super__._setDom.call(this, dom, parseChild);
    };

    RadioButton.prototype._refreshEditorDom = function() {
      var $dom;
      $dom = this.get$Dom();
      if (this._checked === $dom.checkbox("is checked")) {
        return;
      }
      return $dom.checkbox(this._checked ? "check" : "uncheck");
    };

    RadioButton.prototype._doRefreshDom = function() {
      var $dom, label, readOnly;
      if (!this._dom) {
        return;
      }
      RadioButton.__super__._doRefreshDom.call(this);
      if (this._doms == null) {
        this._doms = {};
      }
      label = this._label || this._value || "";
      $(this._doms.label).text(label);
      readOnly = this.get("readOnly");
      this._classNamePool.toggle("read-only", readOnly);
      this._classNamePool.add(this._type);
      $dom = this.get$Dom();
      $dom.checkbox(!!this._disabled ? "disable" : "enable");
      $(this._doms.input).attr("name", this._name);
      return this._refreshEditorDom();
    };

    RadioButton.prototype.toggle = function() {
      var state;
      state = !!this.get("checked");
      this.set("checked", !state);
      return this;
    };

    RadioButton.prototype.remove = function() {
      RadioButton.__super__.remove.call(this);
      return delete this._parent;
    };

    RadioButton.prototype.destroy = function() {
      if (this._destroyed) {
        return this;
      }
      delete this._parent;
      RadioButton.__super__.destroy.call(this);
      return delete this._doms;
    };

    return RadioButton;

  })(cola.Widget);

  emptyRadioGroupItems = [];

  cola.RadioGroup = (function(superClass) {
    extend(RadioGroup, superClass);

    function RadioGroup() {
      return RadioGroup.__super__.constructor.apply(this, arguments);
    }

    RadioGroup.CLASS_NAME = "grouped";

    RadioGroup.ATTRIBUTES = {
      name: null,
      items: {
        setter: function(items) {
          var item, l, len1;
          this.clear();
          for (l = 0, len1 = items.length; l < len1; l++) {
            item = items[l];
            this._addItem(item);
          }
          return this;
        }
      },
      type: {
        "enum": ["radio", "toggle", "slider"],
        defaultValue: "radio",
        refreshDom: true,
        setter: function(value) {
          var item, l, len1, ref;
          this._type = value;
          if (this._items) {
            ref = this._items;
            for (l = 0, len1 = ref.length; l < len1; l++) {
              item = ref[l];
              item.set("type", value);
            }
          }
          return this;
        }
      }
    };

    RadioGroup.prototype._doRefreshDom = function() {
      var item, l, len1, ref, value;
      if (!this._dom) {
        return;
      }
      RadioGroup.__super__._doRefreshDom.call(this);
      value = this._value;
      if (!this._items) {
        return;
      }
      ref = this._items;
      for (l = 0, len1 = ref.length; l < len1; l++) {
        item = ref[l];
        if (item.get("value") === value) {
          item.set("checked", true);
          break;
        }
      }
    };

    RadioGroup.prototype._initDom = function(dom) {
      var item, itemDom, l, len1, ref;
      RadioGroup.__super__._initDom.call(this, dom);
      if (!this._items) {
        return;
      }
      ref = this._items;
      for (l = 0, len1 = ref.length; l < len1; l++) {
        item = ref[l];
        itemDom = item.getDom();
        if (itemDom.parentNode === this._dom) {
          continue;
        }
        this._dom.appendChild(itemDom);
      }
    };

    RadioGroup.prototype._parseDom = function(dom) {
      var child, widget;
      child = dom.firstChild;
      while (child) {
        if (child.nodeType === 1) {
          widget = cola.widget(child);
          if (widget && widget instanceof cola.RadioButton) {
            this._addItem(widget);
          }
        }
        child = child.nextSibling;
      }
    };

    RadioGroup.prototype._addItem = function(item) {
      var classType, radioBtn, radioDom;
      if (this._destroyed) {
        return this;
      }
      if (this._items == null) {
        this._items = [];
      }
      if (item instanceof cola.RadioButton) {
        radioBtn = item;
      } else if (item.constructor === Object.prototype.constructor) {
        radioBtn = new cola.RadioButton(item);
      } else {
        classType = cola.util.getType(item);
        if (classType === "number" || classType === "string") {
          radioBtn = new cola.RadioButton({
            value: item
          });
        }
      }
      if (!radioBtn) {
        return;
      }
      radioBtn.set({
        name: this._name,
        type: this._type
      });
      radioBtn._parent = this;
      this._items.push(radioBtn);
      if (this._dom) {
        radioDom = radioBtn.getDom();
        radioDom.parentNode !== this._dom;
        this._dom.appendChild(radioDom);
      }
      return this;
    };

    RadioGroup.prototype.addRadioButton = function(config) {
      this._addItem(config);
      return this;
    };

    RadioGroup.prototype.getRadioButton = function(index) {
      var item, l, len1, ref;
      if (!this._items) {
        return;
      }
      if (typeof index === "string") {
        ref = this._items;
        for (l = 0, len1 = ref.length; l < len1; l++) {
          item = ref[l];
          if (item.get("value") === index) {
            return;
          }
        }
      } else {
        return this._items[index];
      }
      return null;
    };

    RadioGroup.prototype.removeRadioButton = function(index) {
      var radio;
      if (index instanceof cola.RadioButton) {
        radio = index;
      } else {
        radio = getRadioButton(index);
      }
      if (!radio) {
        return this;
      }
      index = this._items.indexOf(radio);
      this._items.splice(index, 1);
      radio.remove();
      return this;
    };

    RadioGroup.prototype.clear = function() {
      var item, l, len1, ref;
      if (!this._items) {
        return;
      }
      ref = this._items;
      for (l = 0, len1 = ref.length; l < len1; l++) {
        item = ref[l];
        item.destroy();
      }
      return this._items = [];
    };

    RadioGroup.prototype.destroy = function() {
      var item, l, len1, ref;
      if (this._destroyed) {
        return this;
      }
      if (this._items) {
        ref = this._items;
        for (l = 0, len1 = ref.length; l < len1; l++) {
          item = ref[l];
          item.destroy();
        }
        delete this._items;
      }
      RadioGroup.__super__.destroy.call(this);
      return this;
    };

    return RadioGroup;

  })(cola.AbstractEditor);

  cola.Rating = (function(superClass) {
    extend(Rating, superClass);

    function Rating() {
      return Rating.__super__.constructor.apply(this, arguments);
    }

    Rating.CLASS_NAME = "rating";

    Rating.ATTRIBUTES = {
      rating: {
        type: "number",
        defaultValue: 0,
        refreshDom: true
      },
      maxRating: {
        type: "number",
        refreshDom: true,
        defaultValue: 1,
        setter: function(value) {
          this._maxRating = value;
          return this._refreshRating = true;
        }
      },
      disabled: {
        type: "boolean",
        refreshDom: true,
        defaultValue: false
      },
      size: {
        "enum": ["mini", "tiny", "small", "medium", "large", "big", "huge", "massive"],
        refreshDom: true,
        setter: function(value) {
          var oldValue;
          oldValue = this["_size"];
          if (oldValue && oldValue !== value && this._dom) {
            this.get$Dom().removeClass(oldValue);
          }
          this["_size"] = value;
        }
      }
    };

    Rating.EVENTS = {
      rate: null
    };

    Rating.prototype._fireRate = function() {
      cola.util.cancelDelay(this, "_fireRate");
      return this.fire("rate", this, {
        rating: this._rating
      });
    };

    Rating.prototype._doRefreshRating = function() {
      var maxRating, rating;
      this._refreshRating = false;
      rating = this.get("rating");
      maxRating = this.get("maxRating");
      if (rating > maxRating) {
        this._rating = rating = maxRating;
      }
      this.get$Dom().empty().rating({
        initialRating: rating,
        maxRating: maxRating,
        onRate: (function(_this) {
          return function(value) {
            if (value !== _this._rating) {
              _this.set("rating", value);
              return cola.util.delay(_this, "_fireRate", 50, _this._fireRate);
            }
          };
        })(this)
      }).rating(this._disabled ? "disable" : "enable");
    };

    Rating.prototype._initDom = function(dom) {
      return this._doRefreshRating();
    };

    Rating.prototype._doRefreshDom = function() {
      var $dom;
      if (!this._dom) {
        return;
      }
      Rating.__super__._doRefreshDom.call(this);
      if (this._refreshRating) {
        this._doRefreshRating();
      } else {
        $dom = this.get$Dom();
        $dom.rating(this._disabled ? "disable" : "enable");
        if ($dom.rating("get rating") !== this._rating) {
          $dom.rating("set rating", this._rating);
        }
      }
    };

    Rating.prototype.clear = function() {
      this.set("rating", 0);
      return this;
    };

    return Rating;

  })(cola.Widget);

  cola.Element.mixin(cola.Rating, cola.DataWidgetMixin);

  cola.Select = (function(superClass) {
    extend(Select, superClass);

    function Select() {
      return Select.__super__.constructor.apply(this, arguments);
    }

    Select.CLASS_NAME = "input";

    Select.ATTRIBUTES = {
      options: {
        setter: function(options) {
          var ref, select;
          if (!(options instanceof Array || options instanceof cola.EntityList)) {
            return;
          }
          this._options = options;
          select = (ref = this._doms) != null ? ref.input : void 0;
          if (select) {
            this._refreshSelectOptions(select);
          }
        }
      }
    };

    Select.prototype._createEditorDom = function() {
      return $.xCreate({
        tagName: "select",
        "class": "editor"
      });
    };

    Select.prototype._isEditorDom = function(node) {
      return node.nodeName === "SELECT";
    };

    Select.prototype._parseDom = function(dom) {
      var child, skipSetIcon;
      Select.__super__._parseDom.call(this, dom);
      if (!this._icon) {
        child = this._doms.input.nextSibling;
        while (child) {
          if (child.nodeType === 1 && child.nodeName !== "TEMPLATE") {
            skipSetIcon = true;
            break;
          }
          child = child.nextSibling;
        }
        if (!skipSetIcon) {
          this.set("icon", "dropdown");
        }
      }
    };

    Select.prototype._initDom = function(dom) {
      if (this._options) {
        this._refreshSelectOptions(this._doms.input);
      }
    };

    Select.prototype._refreshSelectOptions = function(select) {
      var options;
      options = select.options;
      if (this._options instanceof cola.EntityList) {
        options.length = this._options.entityCount;
      } else {
        options.length = this._options.length;
      }
      cola.each(this._options, function(optionValue, i) {
        var option;
        option = options[i];
        if (cola.util.isSimpleValue(optionValue)) {
          $fly(option).removeAttr("value").text(optionValue);
        } else if (optionValue instanceof cola.Entity) {
          $fly(option).attr("value", optionValue.get("value") || optionValue.get("key")).text(optionValue.get("text") || optionValue.get("name"));
        } else {
          $fly(option).attr("value", optionValue.value || optionValue.key).text(optionValue.text || optionValue.name);
        }
      });
    };

    return Select;

  })(cola.AbstractInput);

  dropdownDialogMargin = 0;

  cola.findDropDown = function(target) {
    var dropContainer;
    if (target instanceof cola.Widget) {
      target = target.getDom();
    }
    while (target) {
      if ($fly(target).hasClass("drop-container")) {
        dropContainer = cola.widget(target);
        return dropContainer != null ? dropContainer._dropdown : void 0;
      }
      target = target.parentNode;
    }
  };

  cola.AbstractDropdown = (function(superClass) {
    extend(AbstractDropdown, superClass);

    function AbstractDropdown() {
      return AbstractDropdown.__super__.constructor.apply(this, arguments);
    }

    AbstractDropdown.CLASS_NAME = "input drop";

    AbstractDropdown.ATTRIBUTES = {
      items: {
        expressionType: "repeat",
        setter: function(items) {
          this._items = items;
          if (this._itemsTimestamp !== (items != null ? items.timestamp : void 0)) {
            if (items) {
              this._itemsTimestamp = items.timestamp;
            }
            delete this._itemsIndex;
          }
        }
      },
      currentItem: {
        readOnly: true
      },
      value: {
        refreshDom: true,
        setter: function(value) {
          var currentItem, index, valueProperty;
          cola.AbstractInput.ATTRIBUTES.value.setter.apply(this, arguments);
          if (this._skipFindCurrentItem) {
            return;
          }
          if (!this._itemsIndex) {
            if (this._items && value && this._valueProperty) {
              this._itemsIndex = index = {};
              valueProperty = this._valueProperty;
              cola.each(this._items, function(item) {
                var key;
                if (item instanceof cola.Entity) {
                  key = item.get(valueProperty);
                } else {
                  key = item[valueProperty];
                }
                index[key + ""] = item;
              });
              currentItem = index[value + ""];
            }
          } else {
            currentItem = this._itemsIndex[value + ""];
          }
          this._currentItem = currentItem;
        }
      },
      valueProperty: null,
      textProperty: null,
      openOnActive: {
        type: "boolean",
        defaultValue: true
      },
      openMode: {
        "enum": ["auto", "drop", "dialog", "layer", "half-layer"],
        defaultValue: "auto"
      },
      opened: {
        readOnly: true
      },
      dropdownWidth: null,
      dropdownHeight: null
    };

    AbstractDropdown.EVENTS = {
      beforeOpen: null,
      open: null,
      close: null
    };

    AbstractDropdown.prototype._initDom = function(dom) {
      var valueContent;
      $fly(this._doms.input).xInsertAfter({
        tagName: "div",
        "class": "value-content",
        contextKey: "valueContent"
      }, this._doms);
      $fly(dom).delegate(">.icon", "click", (function(_this) {
        return function() {
          if (_this._opened) {
            _this.close();
          } else {
            _this.open();
          }
        };
      })(this));
      valueContent = this._doms.valueContent;
      $(this._doms.input).on("focus", function() {
        $fly(valueContent).addClass("placeholder");
      }).on("blur", function() {
        $fly(valueContent).removeClass("placeholder");
      });
    };

    AbstractDropdown.prototype._parseDom = function(dom) {
      var child, skipSetIcon;
      if (!dom) {
        return;
      }
      AbstractDropdown.__super__._parseDom.call(this, dom);
      this._parseTemplates();
      if (!this._icon) {
        child = this._doms.input.nextSibling;
        while (child) {
          if (child.nodeType === 1 && child.nodeName !== "TEMPLATE") {
            skipSetIcon = true;
            break;
          }
          child = child.nextSibling;
        }
        if (!skipSetIcon) {
          this.set("icon", "dropdown");
        }
      }
    };

    AbstractDropdown.prototype._createEditorDom = function() {
      return $.xCreate({
        tagName: "input",
        type: "text",
        click: (function(_this) {
          return function(evt) {
            var input;
            if (_this._openOnActive) {
              if (_this._opened) {
                input = evt.target;
                if (input.readOnly) {
                  _this.close();
                }
              } else {
                _this.open();
              }
            }
          };
        })(this),
        input: (function(_this) {
          return function(evt) {
            var $valueContent;
            $valueContent = $fly(_this._doms.valueContent);
            if (evt.target.value) {
              $valueContent.hide();
            } else {
              $valueContent.show();
            }
          };
        })(this)
      });
    };

    AbstractDropdown.prototype._isEditorDom = function(node) {
      return node.nodeName === "INPUT";
    };

    AbstractDropdown.prototype._isEditorReadOnly = function() {
      return cola.device.mobile;
    };

    AbstractDropdown.prototype._refreshInput = function() {
      var $inputDom, ref;
      $inputDom = $fly(this._doms.input);
      $inputDom.attr("placeholder", this.get("placeholder"));
      $inputDom.prop("readOnly", this._finalReadOnly || this._isEditorReadOnly());
      if ((ref = this.get("actionButton")) != null) {
        ref.set("disabled", this._finalReadOnly);
      }
      this._setValueContent(this._currentItem);
    };

    AbstractDropdown.prototype._setValueContent = function(item) {
      var alias, ctx, currentItemScope, elementAttrBinding, input, ref, valueContent;
      input = this._doms.input;
      input.value = "";
      if (item) {
        input.placeholder = "";
        elementAttrBinding = (ref = this._elementAttrBindings) != null ? ref["items"] : void 0;
        alias = (elementAttrBinding != null ? elementAttrBinding.expression.alias : void 0) || "item";
        currentItemScope = this._currentItemScope;
        if (currentItemScope && currentItemScope.data.alias !== alias) {
          currentItemScope = null;
        }
        if (!currentItemScope) {
          this._currentItemScope = currentItemScope = new cola.ItemScope(this._scope, alias);
        }
        currentItemScope.data.setTargetData(item);
        valueContent = this._doms.valueContent;
        if (!valueContent._inited) {
          valueContent._inited = true;
          ctx = {
            defaultPath: alias
          };
          this._initValueContent(valueContent, ctx);
          cola.xRender(valueContent, currentItemScope, ctx);
        }
        $fly(valueContent).show();
      } else {
        input.placeholder = this._placeholder || "";
      }
    };

    AbstractDropdown.prototype._initValueContent = function(valueContent, context) {
      var l, len1, property, t, template;
      property = this._textProperty || this._valueProperty;
      if (property) {
        context.defaultPath += "." + property;
      }
      template = this._getTemplate("value-content");
      if (template) {
        if (template instanceof Array) {
          for (l = 0, len1 = template.length; l < len1; l++) {
            t = template[l];
            valueContent.appendChild(t);
          }
        } else {
          valueContent.appendChild(template);
        }
      }
    };

    AbstractDropdown.prototype._getFinalOpenMode = function() {
      var openMode;
      openMode = this._openMode;
      if (!openMode || openMode === "auto") {
        if (cola.device.desktop) {
          openMode = "drop";
        } else if (cola.device.phone) {
          openMode = "layer";
        } else {
          openMode = "dialog";
        }
      }
      return openMode;
    };

    AbstractDropdown.prototype._getContainer = function() {
      var config, container, ctx, openMode, titleContent;
      if (this._container) {
        return this._container;
      }
      this._finalOpenMode = openMode = this._getFinalOpenMode();
      config = {
        "class": "drop-container",
        dom: $.xCreate({
          tagName: "div",
          content: this._getDropdownContent()
        }),
        beforeHide: (function(_this) {
          return function() {
            $fly(_this._dom).removeClass("opened");
          };
        })(this),
        hide: (function(_this) {
          return function() {
            _this._opened = false;
          };
        })(this)
      };
      if (this._dropdownWidth) {
        config.width = this._dropdownWidth;
      }
      if (this._dropdownHeight) {
        config.height = this._dropdownHeight;
      }
      if (openMode === "drop") {
        config.duration = 200;
        config.dropdown = this;
        config.ui = config.ui + " " + this._ui;
        container = new DropBox(config);
      } else if (openMode === "layer") {
        ctx = {};
        titleContent = cola.xRender({
          tagName: "div",
          "class": "box",
          content: {
            tagName: "div",
            "c-widget": {
              $type: "titleBar",
              items: [
                {
                  icon: "chevron left",
                  click: (function(_this) {
                    return function() {
                      return _this.close();
                    };
                  })(this)
                }
              ]
            }
          }
        }, this._scope, ctx);
        $fly(config.dom.firstChild.firstChild).before(titleContent);
        container = new cola.Layer(config);
      } else if (openMode === "dialog") {
        config.modalOpacity = 0.05;
        config.closeable = false;
        config.dimmerClose = true;
        container = new cola.Dialog(config);
      }
      this._container = container;
      container.appendTo(document.body);
      return container;
    };

    AbstractDropdown.prototype.open = function(callback) {
      var $containerDom, $flexContent, clientHeight, container, containerHeight, doCallback, height;
      if (this.fire("beforeOpen", this) === false) {
        return;
      }
      doCallback = (function(_this) {
        return function() {
          _this.fire("open", _this);
          if (typeof callback === "function") {
            callback();
          }
        };
      })(this);
      container = this._getContainer();
      if (container) {
        container._dropdown = this;
        container.on("hide", function(self) {
          delete self._dropdown;
        });
        if (container instanceof DropBox) {
          container.show(this, doCallback);
        } else if (container instanceof cola.Layer) {
          container.show(doCallback);
        } else if (container instanceof cola.Dialog) {
          $flexContent = $(this._doms.flexContent);
          $flexContent.height("");
          $containerDom = container.get$Dom();
          $containerDom.show();
          containerHeight = $containerDom.height();
          clientHeight = document.body.clientHeight;
          if (containerHeight > (clientHeight - dropdownDialogMargin * 2)) {
            height = $flexContent.height() - (containerHeight - (clientHeight - dropdownDialogMargin * 2));
            $containerDom.hide();
            $flexContent.height(height);
          } else {
            $containerDom.hide();
          }
          container.show(doCallback);
        }
        this._opened = true;
        $fly(this._dom).addClass("opened");
      }
    };

    AbstractDropdown.prototype.close = function(selectedData, callback) {
      var container;
      if (selectedData !== void 0) {
        this._selectData(selectedData);
      }
      container = this._getContainer();
      if (container) {
        container.hide(callback);
      }
    };

    AbstractDropdown.prototype._selectData = function(item) {
      var value;
      if (this._valueProperty && item) {
        if (item instanceof cola.Entity) {
          value = item.get(this._valueProperty);
        } else {
          value = item[this._valueProperty];
        }
      } else {
        value = item;
      }
      this._currentItem = item;
      this._skipFindCurrentItem = true;
      this.set("value", value);
      this._skipFindCurrentItem = false;
      this.refresh();
    };

    return AbstractDropdown;

  })(cola.AbstractInput);

  cola.Element.mixin(cola.AbstractDropdown, cola.TemplateSupport);

  DropBox = (function(superClass) {
    extend(DropBox, superClass);

    function DropBox() {
      return DropBox.__super__.constructor.apply(this, arguments);
    }

    DropBox.CLASS_NAME = "drop-box";

    DropBox.ATTRIBUTES = {
      dropdown: null
    };

    DropBox.prototype.show = function(options, callback) {
      var $dom, bottomSpace, boxHeight, boxWidth, clientHeight, clientWidth, direction, dropdownDom, height, left, rect, top, topSpace;
      $dom = this.get$Dom();
      dropdownDom = this._dropdown._doms.input;
      $dom.css("height", "").show();
      boxWidth = $dom.width();
      boxHeight = $dom.height();
      $dom.hide();
      rect = dropdownDom.getBoundingClientRect();
      clientWidth = document.body.clientWidth;
      clientHeight = document.body.clientHeight;
      bottomSpace = clientHeight - rect.top - dropdownDom.clientHeight;
      if (bottomSpace >= boxHeight) {
        direction = "down";
      } else {
        topSpace = rect.top;
        if (topSpace > bottomSpace) {
          direction = "up";
          height = topSpace;
        } else {
          direction = "down";
          height = bottomSpace;
        }
      }
      if (direction === "down") {
        top = rect.top + dropdownDom.clientHeight;
      } else {
        top = rect.top - (height || boxHeight);
      }
      left = rect.left;
      if (boxWidth > dropdownDom.offsetWidth) {
        if (boxWidth + rect.left > clientWidth) {
          left = clientWidth - boxWidth;
          if (left < 0) {
            left = 0;
          }
        }
      }
      if (height) {
        $dom.css("height", height);
      }
      $dom.removeClass(direction === "down" ? "direction-up" : "direction-down").addClass("direction-" + direction).toggleClass("x-over", boxWidth > dropdownDom.offsetWidth).css("left", left).css("top", top).css("min-width", dropdownDom.offsetWidth);
      this._animation = "slide " + direction;
      DropBox.__super__.show.call(this, options, callback);
    };

    DropBox.prototype._onShow = function() {
      DropBox.__super__._onShow.call(this);
      this._bodyListener = (function(_this) {
        return function(evt) {
          var dropContainerDom, dropdownDom, inDropdown, target;
          target = evt.target;
          dropdownDom = _this._dropdown._dom;
          dropContainerDom = _this._dom;
          while (target) {
            if (target === dropdownDom || target === dropContainerDom) {
              inDropdown = true;
              break;
            }
            target = target.parentNode;
          }
          if (!inDropdown) {
            _this._dropdown.close();
          }
        };
      })(this);
      $fly(document.body).on("click", this._bodyListener);
    };

    DropBox.prototype.hide = function(options, callback) {
      $fly(document.body).off("click", this._bodyListener);
      DropBox.__super__.hide.call(this, options, callback);
    };

    return DropBox;

  })(cola.Layer);

  cola.Dropdown = (function(superClass) {
    extend(Dropdown, superClass);

    function Dropdown() {
      return Dropdown.__super__.constructor.apply(this, arguments);
    }

    Dropdown.ATTRIBUTES = {
      filterable: {
        readOnlyAfterCreate: true,
        defaultValue: true
      },
      filterValue: {
        readOnly: true
      },
      filterProperty: null,
      filterInterval: {
        defaultValue: 300
      }
    };

    Dropdown.EVENTS = {
      filterItem: null
    };

    Dropdown.TEMPLATES = {
      "default": {
        tagName: "li",
        "c-bind": "$default"
      },
      "list": {
        tagName: "div",
        contextKey: "flexContent",
        content: {
          tagName: "div",
          contextKey: "list",
          "c-widget": "listView",
          style: "height:100%"
        }
      },
      "filterable-list": {
        tagName: "div",
        style: "height:100%",
        content: [
          {
            tagName: "div",
            "class": "filter-container",
            content: {
              tagName: "div",
              contextKey: "filterInput",
              "c-widget": "input;icon:search;width:100%"
            }
          }, {
            tagName: "div",
            contextKey: "flexContent",
            "class": "list-container",
            content: {
              tagName: "div",
              contextKey: "list",
              "c-widget": "listView",
              style: "height:100%"
            }
          }
        ]
      }
    };

    Dropdown.prototype._initValueContent = function(valueContent, context) {
      var template;
      Dropdown.__super__._initValueContent.call(this, valueContent, context);
      if (!valueContent.firstChild) {
        template = this._getTemplate("default");
        if (template) {
          valueContent.appendChild(this._cloneTemplate(template));
        }
      }
    };

    Dropdown.prototype.open = function() {
      var inputDom, list;
      Dropdown.__super__.open.call(this);
      list = this._list;
      if (this._currentItem !== list.get("currentItem")) {
        list.set("currentItem", this._currentItem);
      }
      if (this._opened && this._filterable) {
        inputDom = this._doms.input;
        $fly(inputDom).on("input.filter", (function(_this) {
          return function() {
            return _this._onInput(inputDom.value);
          };
        })(this));
      }
    };

    Dropdown.prototype.close = function(selectedValue) {
      if (this._filterable) {
        $fly(this._doms.input).off("input.filter");
      }
      return Dropdown.__super__.close.call(this, selectedValue);
    };

    Dropdown.prototype._onInput = function(value) {
      cola.util.delay(this, "filterItems", 300, function() {
        this._list.set("filterCriteria", value);
      });
    };

    Dropdown.prototype._getDropdownContent = function() {
      var attrBinding, hasDefaultTemplate, inputDom, list, name, ref, templ, template, templateName;
      if (!this._dropdownContent) {
        if (this._filterable && this._finalOpenMode !== "drop") {
          templateName = "filterable-list";
        } else {
          templateName = "list";
        }
        template = this._getTemplate(templateName);
        this._dropdownContent = template = cola.xRender(template, this._scope);
        this._list = list = cola.widget(this._doms.list);
        if (this._templates) {
          ref = this._templates;
          for (name in ref) {
            templ = ref[name];
            if (["list", "filterable-list", "value-content"].indexOf(name) < 0) {
              if (name === "default") {
                hasDefaultTemplate = true;
              }
              list._regTemplate(name, templ);
            }
          }
        }
        if (!hasDefaultTemplate) {
          list._regTemplate("default", {
            tagName: "li",
            "c-bind": "$default"
          });
        }
        list.on("itemClick", (function(_this) {
          return function() {
            return _this.close(list.get("currentItem"));
          };
        })(this));
        if (this._doms.filterInput) {
          this._filterInput = cola.widget(this._doms.filterInput);
          inputDom = this._filterInput._doms.input;
          $fly(inputDom).on("input", (function(_this) {
            return function() {
              return _this._onInput(inputDom.value);
            };
          })(this));
        }
      }
      attrBinding = this._elementAttrBindings["items"];
      list = this._list;
      list._textProperty = this._textProperty || this._valueProperty;
      if (attrBinding) {
        list.set("bind", attrBinding.expression.raw);
      } else {
        list.set("items", this._items);
      }
      list.refresh();
      return template;
    };

    return Dropdown;

  })(cola.AbstractDropdown);

  cola.CustomDropdown = (function(superClass) {
    extend(CustomDropdown, superClass);

    function CustomDropdown() {
      return CustomDropdown.__super__.constructor.apply(this, arguments);
    }

    CustomDropdown.ATTRIBUTES = {
      content: null
    };

    CustomDropdown.TEMPLATES = {
      "default": {
        tagName: "div",
        content: "<Undefined>"
      },
      "value-content": {
        tagName: "div",
        "c-bind": "$default"
      }
    };

    CustomDropdown.prototype._isEditorReadOnly = function() {
      return true;
    };

    CustomDropdown.prototype._getDropdownContent = function() {
      var dropdownContent;
      if (!this._dropdownContent) {
        if (this._content) {
          dropdownContent = this._content;
        } else {
          dropdownContent = this._getTemplate();
        }
        this._dropdownContent = cola.xRender(dropdownContent, this._scope);
      }
      return this._dropdownContent;
    };

    return CustomDropdown;

  })(cola.AbstractDropdown);

  cola.Form = (function(superClass) {
    extend(Form, superClass);

    Form.CLASS_NAME = "form";

    Form.ATTRIBUTES = {
      bind: {
        setter: function(bindStr) {
          return this._bindSetter(bindStr);
        }
      },
      state: {
        setter: function(state) {
          var STATES, classPool, cls, p;
          if (this._state === state) {
            return;
          }
          this._state = state;
          if (this._dom) {
            STATES = this.constructor.STATES;
            classPool = new cola.ClassNamePool(this._dom.className);
            for (p in STATES) {
              cls = STATES[p];
              classPool.remove(cls);
            }
            if (state) {
              classPool.add(STATES[state]);
            }
            this._dom.className = classPool.join();
          }
        }
      }
    };

    Form.STATES = {
      "error": "error",
      "warning": "warning",
      "info": "success"
    };

    function Form(config) {
      this._messageHolder = new cola.Entity.MessageHolder();
      Form.__super__.constructor.call(this, config);
    }

    Form.prototype._initDom = function(dom) {
      var $dom;
      $dom = $(dom);
      if (this._state) {
        $dom.addClass(this._state);
      }
      this._inline = $dom.find(".ui.message").length === 0;
      cola.ready((function(_this) {
        return function() {
          $dom.form({
            on: "_disabled",
            inline: _this._inline
          });
        };
      })(this));
    };

    Form.prototype._filterDataMessage = function(path, type, arg) {
      return type === cola.constants.MESSAGE_REFRESH || type === cola.constants.MESSAGE_CURRENT_CHANGE || type === cola.constants.MESSAGE_VALIDATION_STATE_CHANGE;
    };

    Form.prototype._processDataMessage = function(path, type, arg) {
      var entity;
      entity = this._bindInfo.expression.evaluate(this._scope, "never");
      if (entity && entity instanceof dorado.Entity) {
        this._resetEntityMessages();
      } else {
        entity = null;
      }
      this._entity = entity;
      this._refreshState();
    };

    Form.prototype._getEntity = function() {
      if (this._entity) {
        return this._entity;
      }
      return this._scope.get();
    };

    Form.prototype._refreshState = function() {
      var errors, keyMessage, l, len1, m, messages, state, type;
      state = null;
      keyMessage = this._messageHolder.getKeyMessage();
      type = keyMessage != null ? keyMessage.type : void 0;
      if (type === "error" && !this._inline) {
        errors = [];
        messages = this._messageHolder.findMessages(null, type);
        if (messages) {
          for (l = 0, len1 = messages.length; l < len1; l++) {
            m = messages[l];
            if (m.text) {
              errors.push(m.text);
            }
          }
        }
        this._$dom.form("add errors", errors);
        if (errors.length > 0) {
          state = type;
        }
      }
      this.set("state", state);
    };

    Form.prototype._resetEntityMessages = function() {
      var entity, l, len1, message, messageHolder, messages;
      messageHolder = this._messageHolder;
      messageHolder.clear("fields");
      entity = this._getEntity();
      if (entity) {
        messages = entity.findMessages();
        if (messages) {
          for (l = 0, len1 = messages.length; l < len1; l++) {
            message = messages[l];
            messageHolder.add("fields", message);
          }
        }
      }
    };

    Form.prototype.setMessages = function(messages) {
      var l, len1, message, messageHolder;
      messageHolder = this._messageHolder;
      messageHolder.clear("$");
      if (messages) {
        for (l = 0, len1 = messages.length; l < len1; l++) {
          message = messages[l];
          messageHolder.add("$", message);
        }
      }
      this._refreshState();
    };

    Form.prototype.setFieldMessages = function(editor, message) {
      var editorDom;
      if (this._inline) {
        editorDom = editor._$dom.find("input, textarea, select")[0];
        if (editorDom) {
          editorDom.id || (editorDom.id = cola.uniqueId());
          if ((message != null ? message.type : void 0) === "error" && message.text) {
            this._$dom.form("add prompt", editorDom.id, message.text);
          } else {
            this._$dom.form("remove prompt", {
              identifier: editorDom.id
            });
          }
        }
      } else {
        this._resetEntityMessages();
        this._refreshState();
      }
    };

    return Form;

  })(cola.Widget);

  cola.Element.mixin(cola.Form, cola.DataWidgetMixin);

  cola.AbstractItemGroup = (function(superClass) {
    extend(AbstractItemGroup, superClass);

    AbstractItemGroup.ATTRIBUTES = {
      items: {
        setter: function(value) {
          var item, l, len1;
          this.clearItems();
          for (l = 0, len1 = value.length; l < len1; l++) {
            item = value[l];
            this.addItem(item);
          }
          return this;
        }
      },
      currentIndex: {
        type: "boolean",
        defaultValue: -1,
        setter: function(value) {
          this.setCurrentIndex(value);
          return this;
        }
      }
    };

    function AbstractItemGroup(config) {
      this._items = [];
      AbstractItemGroup.__super__.constructor.call(this, config);
    }

    AbstractItemGroup.prototype.getContentContainer = function() {
      return this.getDom();
    };

    AbstractItemGroup.prototype.getItems = function() {
      return this._items;
    };

    AbstractItemGroup.prototype.getItemDom = function(item) {
      var itemConfig, itemDom;
      itemConfig = item;
      if (typeof item === "number") {
        itemConfig = this._items[item];
      }
      if (itemConfig instanceof cola.Widget) {
        itemDom = itemConfig.getDom();
      } else if (itemConfig.nodeType === 1) {
        itemDom = itemConfig;
      }
      return itemDom;
    };

    AbstractItemGroup.prototype._addItemToDom = function(item) {
      var container, itemDom;
      container = this.getContentContainer();
      itemDom = this.getItemDom(item);
      if (itemDom.parentNode !== container) {
        container.appendChild(itemDom);
      }
    };

    AbstractItemGroup.prototype._itemsRender = function() {
      var item, l, len1, ref;
      if (!this._items) {
        return;
      }
      ref = this._items;
      for (l = 0, len1 = ref.length; l < len1; l++) {
        item = ref[l];
        this._addItemToDom(item);
      }
    };

    AbstractItemGroup.prototype.setCurrentIndex = function(index) {
      var newItemDom, oldItemDom;
      if (this._currentIndex == null) {
        this._currentIndex = -1;
      }
      if (this._currentIndex === index) {
        return this;
      }
      if (this._currentIndex > -1) {
        oldItemDom = this.getItemDom(this._currentIndex);
        if (oldItemDom) {
          $(oldItemDom).removeClass("active");
        }
      }
      if (index > -1) {
        newItemDom = this.getItemDom(index);
        if (newItemDom) {
          $(newItemDom).addClass("active");
        }
      }
      this._currentIndex = index;
      return this;
    };

    AbstractItemGroup.prototype._doOnItemsChange = function() {
      return cola.util.delay(this, "_refreshItems", 50, this.refreshItems);
    };

    AbstractItemGroup.prototype.refreshItems = function() {
      cola.util.cancelDelay(this, "_refreshItems");
      return this;
    };

    AbstractItemGroup.prototype.addItem = function(config) {
      var active, item;
      item = cola.xRender(config, this._scope);
      if (!item) {
        return this;
      }
      active = cola.util.hasClass(item, "active");
      this._items.push(item);
      this._addItemToDom(item);
      if (active) {
        this.setCurrentIndex(this._items.indexOf(item));
      }
      this._doOnItemsChange();
      return item;
    };

    AbstractItemGroup.prototype.clearItems = function() {
      var item, l, len1, ref;
      if (this._items.length === 0) {
        return this;
      }
      ref = this._items;
      for (l = 0, len1 = ref.length; l < len1; l++) {
        item = ref[l];
        if (item instanceof cola.Widget) {
          item.destroy();
        } else {
          $(item).remove();
        }
      }
      this._items = [];
      this._doOnItemsChange();
      return this;
    };

    AbstractItemGroup.prototype.removeItem = function(item) {
      var index, itemObj;
      if (typeof item === "number") {
        itemObj = this._items[item];
        index = item;
      } else {
        itemObj = item;
        index = this._items.indexOf(item);
      }
      this._items.splice(index, 1);
      if (itemObj instanceof cola.Widget) {
        itemObj.destroy();
      } else {
        $(itemObj).remove();
      }
      this._doOnItemsChange();
      return itemObj;
    };

    AbstractItemGroup.prototype.destroy = function() {
      cola.util.cancelDelay(this, "_refreshItems");
      this.clearItems();
      delete this._items;
      return AbstractItemGroup.__super__.destroy.call(this);
    };

    return AbstractItemGroup;

  })(cola.Widget);

  if (cola.breadcrumb == null) {
    cola.breadcrumb = {};
  }

  cola.breadcrumb.Section = (function(superClass) {
    extend(Section, superClass);

    function Section() {
      return Section.__super__.constructor.apply(this, arguments);
    }

    Section.CLASS_NAME = "section";

    Section.TAG_NAME = "a";

    Section.ATTRIBUTES = {
      text: {
        refreshDom: true
      },
      active: {
        type: "boolean",
        refreshDom: true,
        defaultValue: false
      },
      href: {
        refreshDom: true
      },
      target: {
        refreshDom: true
      }
    };

    Section.prototype._parseDom = function(dom) {
      var href, target, text;
      if (!this._text) {
        text = cola.util.getTextChildData(dom);
        if (text) {
          this._text = text;
        }
      }
      if (!this._href) {
        href = dom.getAttribute("href");
        if (href) {
          this._href = href;
        }
      }
      if (!this._target) {
        target = dom.getAttribute("target");
        if (target) {
          this._target = target;
        }
      }
    };

    Section.prototype._doRefreshDom = function() {
      var $dom, text;
      if (!this._dom) {
        return;
      }
      Section.__super__._doRefreshDom.call(this);
      text = this.get("text");
      this.get$Dom().text(text || "");
      this._classNamePool.toggle("active", this._active);
      $dom = this.get$Dom();
      if (this._href) {
        $dom.attr("href", this._href);
      } else {
        $dom.removeAttr("href");
      }
      $dom.attr("target", this._target || "");
    };

    return Section;

  })(cola.Widget);

  cola.Breadcrumb = (function(superClass) {
    extend(Breadcrumb, superClass);

    function Breadcrumb() {
      return Breadcrumb.__super__.constructor.apply(this, arguments);
    }

    Breadcrumb.CHILDREN_TYPE_NAMESPACE = "breadcrumb";

    Breadcrumb.CLASS_NAME = "breadcrumb";

    Breadcrumb.ATTRIBUTES = {
      divider: {
        "enum": ["chevron", "slash"],
        defaultValue: "chevron"
      },
      size: {
        "enum": ["mini", "tiny", "small", "medium", "large", "big", "huge", "massive"],
        refreshDom: true,
        setter: function(value) {
          var oldValue;
          oldValue = this["_size"];
          if (oldValue && oldValue !== value && this._dom) {
            this.get$Dom().removeClass(oldValue);
          }
          this["_size"] = value;
          return this;
        }
      },
      sections: {
        refreshDom: true,
        setter: function(value) {
          var l, len1, section;
          this.clear();
          for (l = 0, len1 = value.length; l < len1; l++) {
            section = value[l];
            this.addSection(section);
          }
          return this;
        }
      },
      currentIndex: {
        type: "number",
        setter: function(value) {
          this._currentIndex = value;
          return this.setCurrent(value);
        },
        getter: function() {
          if (this._current && this._sections) {
            return this._sections.indexOf(this._current);
          } else {
            return -1;
          }
        }
      }
    };

    Breadcrumb.EVENTS = {
      sectionClick: null,
      change: null
    };

    Breadcrumb.prototype._initDom = function(dom) {
      var active, activeSection, l, len1, ref, ref1, section;
      Breadcrumb.__super__._initDom.call(this, dom);
      if ((ref = this._sections) != null ? ref.length : void 0) {
        ref1 = this._sections;
        for (l = 0, len1 = ref1.length; l < len1; l++) {
          section = ref1[l];
          this._rendSection(section);
          if (section.get("active")) {
            active = section;
          }
        }
        if (active) {
          this._doChange(active);
        }
      }
      activeSection = (function(_this) {
        return function(targetDom) {
          _this.fire("sectionClick", _this, {
            sectionDom: targetDom
          });
          return _this._doChange(targetDom);
        };
      })(this);
      return this.get$Dom().delegate(">.section", "click", function(event) {
        return activeSection(this, event);
      });
    };

    Breadcrumb.prototype._parseDom = function(dom) {
      var child, section, sectionConfig;
      if (!dom) {
        return;
      }
      child = dom.firstChild;
      while (child) {
        if (child.nodeType === 1) {
          section = cola.widget(child);
          if (!section && cola.util.hasClass(child, "section")) {
            sectionConfig = {
              dom: child
            };
            if (cola.util.hasClass(child, "active")) {
              sectionConfig.active = true;
            }
            section = new cola.breadcrumb.Section(sectionConfig);
          }
          if (section instanceof cola.breadcrumb.Section) {
            this.addSection(section);
          }
        }
        child = child.nextSibling;
      }
    };

    Breadcrumb.prototype._doRefreshDom = function() {
      var size;
      if (!this._dom) {
        return;
      }
      Breadcrumb.__super__._doRefreshDom.call(this);
      size = this.get("size");
      if (size) {
        this._classNamePool.add(size);
      }
    };

    Breadcrumb.prototype._makeDivider = function() {
      var divider;
      divider = this.get("divider");
      if (divider === "chevron") {
        return $.xCreate({
          tagName: "i",
          "class": "right chevron icon divider"
        });
      } else {
        return $.xCreate({
          tagName: "div",
          "class": "divider",
          content: "/"
        });
      }
    };

    Breadcrumb.prototype._rendSection = function(section) {
      var divider, index, prev, sectionDom;
      index = this._sections.indexOf(section);
      if (this._dividers == null) {
        this._dividers = [];
      }
      sectionDom = section.getDom();
      if (sectionDom.parentNode !== this._dom) {
        if (this._dividers.length < index) {
          divider = this._makeDivider();
          this._dividers.push(divider);
          this._dom.appendChild(divider);
        }
        this._dom.appendChild(section.getDom());
      } else if (index > 0) {
        prev = sectionDom.previousElementSibling;
        if (prev && !cola.util.hasClass(prev, "divider")) {
          divider = this._makeDivider();
          this._dividers.push(divider);
          section.get$Dom().before(divider);
        }
      }
    };

    Breadcrumb.prototype._doChange = function(section) {
      var l, len1, ref, s, targetDom, targetSection;
      if (section.nodeType === 1) {
        targetDom = section;
      } else if (section instanceof cola.breadcrumb.Section) {
        targetDom = section.getDom();
      } else {
        return;
      }
      $(">.section.active", this._dom).each(function(index, itemDom) {
        if (itemDom !== targetDom) {
          section = cola.widget(itemDom);
          if (section) {
            section.set("active", false);
          } else {
            $fly(itemDom).removeClass("active");
          }
        }
      });
      targetSection = cola.widget(targetDom);
      ref = this._sections;
      for (l = 0, len1 = ref.length; l < len1; l++) {
        s = ref[l];
        if (s !== targetSection) {
          s.set("active", false);
        }
      }
      this._current = targetSection;
      if (targetSection) {
        targetSection.set("active", true);
      } else {
        $fly(targetDom).addClass("active");
      }
      if (this._rendered) {
        this.fire("change", this, {
          currentDom: targetDom
        });
      }
    };

    Breadcrumb.prototype.addSection = function(config) {
      var active, section;
      if (this._destroyed) {
        return this;
      }
      if (this._sections == null) {
        this._sections = [];
      }
      if (config instanceof cola.breadcrumb.Section) {
        section = config;
      } else if (typeof config === "string") {
        section = new cola.breadcrumb.Section({
          text: config
        });
      } else if (config.constructor === Object.prototype.constructor) {
        section = new cola.breadcrumb.Section(config);
      }
      if (section) {
        this._sections.push(section);
        if (this._dom) {
          this._rendSection(section);
        }
        active = section.get("active");
        if (active) {
          this._doChange(section);
        }
      }
      return this;
    };

    Breadcrumb.prototype.removeSection = function(section) {
      if (!this._sections) {
        return this;
      }
      if (typeof section === "number") {
        section = this._sections[section];
      }
      if (section) {
        this._doRemove(section);
      }
      return this;
    };

    Breadcrumb.prototype._doRemove = function(section) {
      var dIndex, divider, index;
      index = this._sections.indexOf(section);
      if (index > -1) {
        this._sections.splice(index, 1);
        step.remove();
        if (index > 0 && this._dividers) {
          dIndex = index - 1;
          divider = this._dividers[dIndex];
          $(divider).remove();
          this._dividers.splice(dIndex, 1);
        }
      }
    };

    Breadcrumb.prototype.clear = function() {
      if (!this._sections) {
        return this;
      }
      if (this._dom) {
        this.get$Dom().empty();
      }
      if (this._sections.length) {
        this._sections = [];
      }
      return this;
    };

    Breadcrumb.prototype.getSection = function(index) {
      var el, l, len1, section, sections;
      sections = this._sections || [];
      if (typeof index === "number") {
        section = sections[index];
      } else if (typeof index === "string") {
        for (l = 0, len1 = sections.length; l < len1; l++) {
          el = sections[l];
          if (index === el.get("text")) {
            section = el;
            break;
          }
        }
      }
      return section;
    };

    Breadcrumb.prototype.setCurrent = function(section) {
      var currentSection;
      if (section instanceof cola.breadcrumb.Section) {
        currentSection = section;
      } else {
        currentSection = this.getSection(section);
      }
      if (currentSection) {
        this._doChange(currentSection);
      }
      return this;
    };

    Breadcrumb.prototype.getCurrent = function() {
      return this._current;
    };

    Breadcrumb.prototype.getCurrentIndex = function() {
      if (this._cuurent) {
        return this._sections.indexOf(this._current);
      }
    };

    Breadcrumb.prototype.destroy = function() {
      if (this._destroyed) {
        return;
      }
      Breadcrumb.__super__.destroy.call(this);
      delete this._current;
      delete this._sections;
      delete this._dividers;
    };

    return Breadcrumb;

  })(cola.Widget);

  cola.registerType("breadcrumb", "_default", cola.breadcrumb.Section);

  cola.registerType("breadcrumb", "section", cola.breadcrumb.Section);

  cola.registerTypeResolver("breadcrumb", function(config) {
    return cola.resolveType("widget", config);
  });

  cola.CardBook = (function(superClass) {
    extend(CardBook, superClass);

    function CardBook() {
      return CardBook.__super__.constructor.apply(this, arguments);
    }

    CardBook.CLASS_NAME = "card-book";

    CardBook.EVENTS = {
      beforeChange: null,
      change: null
    };

    CardBook.prototype._parseDom = function(dom) {
      var child;
      child = dom.firstChild;
      while (child) {
        if (child.nodeType === 1) {
          if (cola.util.hasClass(child, "item")) {
            if (child.nodeType === 1) {
              this.addItem(child);
            }
          }
        }
        child = child.nextSibling;
      }
      return null;
    };

    CardBook.prototype._initDom = function(dom) {
      CardBook.__super__._initDom.call(this, dom);
      if (this._items) {
        this._itemsRender();
      }
    };

    CardBook.prototype.setCurrentIndex = function(index) {
      var arg, newItem, newItemDom, oldItem, oldItemDom;
      if (this._currentIndex == null) {
        this._currentIndex = -1;
      }
      if (this._currentIndex === index) {
        return this;
      }
      arg = {};
      if (this._currentIndex > -1) {
        oldItem = this._items[this._currentIndex];
        oldItemDom = this.getItemDom(this._currentIndex);
      }
      if (index > -1) {
        newItem = this._items[index];
        newItemDom = this.getItemDom(index);
      }
      arg = {
        oldItem: oldItem,
        newItem: newItem
      };
      if (this.fire("beforeChange", this, arg) === false) {
        return this;
      }
      if (oldItemDom) {
        $(oldItemDom).removeClass("active");
      }
      if (newItemDom) {
        $(newItemDom).addClass("active");
      }
      this._currentIndex = index;
      this.fire("change", this, arg);
      return this;
    };

    return CardBook;

  })(cola.AbstractItemGroup);

  cola.Carousel = (function(superClass) {
    extend(Carousel, superClass);

    function Carousel() {
      return Carousel.__super__.constructor.apply(this, arguments);
    }

    Carousel.CLASS_NAME = "carousel";

    Carousel.ATTRIBUTES = {
      bind: {
        readonlyAfterCreate: true,
        setter: function(bindStr) {
          return this._bindSetter(bindStr);
        }
      },
      orientation: {
        defaultValue: "horizontal",
        "enum": ["horizontal", "vertical"]
      },
      controls: {
        defaultValue: true
      },
      pause: {
        defaultValue: 3000
      }
    };

    Carousel.EVENTS = {
      change: null
    };

    Carousel.prototype.getContentContainer = function() {
      if (!this._doms.wrap) {
        this._createItemsWrap(dom);
      }
      return this._doms.wrap;
    };

    Carousel.prototype._parseDom = function(dom) {
      var child, doms, parseItem;
      parseItem = (function(_this) {
        return function(node) {
          var childNode;
          _this._items = [];
          childNode = node.firstChild;
          while (childNode) {
            if (childNode.nodeType === 1) {
              _this.addItem(childNode);
            }
            childNode = childNode.nextSibling;
          }
        };
      })(this);
      doms = this._doms;
      child = dom.firstChild;
      while (child) {
        if (child.nodeType === 1) {
          if (cola.util.hasClass(child, "items-wrap")) {
            doms.wrap = child;
            parseItem(child);
          } else if (!doms.indicators && cola.util.hasClass(child, "indicators")) {
            doms.indicators = child;
          } else if (child.nodeName === "TEMPLATE") {
            this._regTemplate(child);
          }
        }
        child = child.nextSibling;
      }
      if (!doms.indicators) {
        this._createIndicatorContainer(dom);
      }
      if (!doms.wrap) {
        this._createItemsWrap(dom);
      }
    };

    Carousel.prototype._createIndicatorContainer = function(dom) {
      var carousel;
      if (this._doms == null) {
        this._doms = {};
      }
      this._doms.indicators = $.xCreate({
        tagName: "div",
        "class": "indicators indicators-" + this._orientation,
        contextKey: "indicators"
      });
      carousel = this;
      dom.appendChild(this._doms.indicators);
      $(this._doms.indicators).delegate(">span", "click", function() {
        return carousel.goTo($fly(this).index());
      });
      return null;
    };

    Carousel.prototype._createItemsWrap = function(dom) {
      if (this._doms == null) {
        this._doms = {};
      }
      this._doms.wrap = $.xCreate({
        tagName: "div",
        "class": "items-wrap",
        contextKey: "wrap"
      });
      dom.appendChild(this._doms.wrap);
      return null;
    };

    Carousel.prototype._initDom = function(dom) {
      var carousel, template;
      if (!this._doms.indicators) {
        this._createIndicatorContainer(dom);
      }
      if (!this._doms.wrap) {
        this._createItemsWrap(dom);
      }
      template = this._getTemplate();
      if (template) {
        if (this._bindStr) {
          $fly(template).attr("c-repeat", this._bindStr);
        }
        this._doms.wrap.appendChild(template);
        cola.xRender(template, this._scope);
      }
      if (this._items) {
        this._itemsRender();
        this.refreshIndicators();
      }
      this.setCurrentIndex(0);
      carousel = this;
      setTimeout(function() {
        return carousel._scroller = new Swipe(carousel._dom, {
          vertical: carousel._orientation === "vertical",
          disableScroll: false,
          continuous: true,
          callback: function(pos) {
            carousel.setCurrentIndex(pos);
          }
        });
      }, 0);
      if (this._controls) {
        dom.appendChild($.xCreate({
          tagName: "div",
          "class": "controls",
          content: [
            {
              tagName: "A",
              "class": "prev",
              click: (function(_this) {
                return function() {
                  _this.replay();
                  return carousel.previous();
                };
              })(this)
            }, {
              tagName: "A",
              "class": "next",
              click: (function(_this) {
                return function() {
                  _this.replay();
                  return carousel.next();
                };
              })(this)
            }
          ]
        }));
      }
    };

    Carousel.prototype.setCurrentIndex = function(index) {
      var activeSpan, e, pos;
      this.fire("change", this, {
        index: index
      });
      this._currentIndex = index;
      if (this._dom) {
        if (this._doms.indicators) {
          try {
            $(".active", this._doms.indicators).removeClass("active");
            activeSpan = this._doms.indicators.children[index];
            if (activeSpan != null) {
              activeSpan.className = "active";
            }
          } catch (_error) {
            e = _error;
          }
        }
        if (this._scroller) {
          pos = this._scroller.getPos();
          if (pos !== index) {
            this._scroller.setPos(index);
          }
        }
      }
      return this;
    };

    Carousel.prototype.refreshIndicators = function() {
      var currentIndex, i, indicatorCount, itemsCount, ref, span;
      itemsCount = (ref = this._items) != null ? ref.length : void 0;
      if (!this._doms.indicators) {
        return;
      }
      indicatorCount = this._doms.indicators.children.length;
      if (indicatorCount < itemsCount) {
        i = indicatorCount;
        while (i < itemsCount) {
          span = document.createElement("span");
          this._doms.indicators.appendChild(span);
          i++;
        }
      } else if (indicatorCount > itemsCount) {
        i = itemsCount;
        while (i < indicatorCount) {
          $(this._doms.indicators.firstChild).remove();
          i++;
        }
      }
      if (this._currentIndex == null) {
        this._currentIndex = -1;
      }
      currentIndex = this._currentIndex;
      $("span", this._doms.indicators).removeClass("active");
      if (currentIndex !== -1) {
        jQuery("span:nth-child(" + (currentIndex + 1) + ")", this._doms.indicators).addClass("indicator-active");
      }
      return this;
    };

    Carousel.prototype.next = function() {
      var pos;
      if (this._scroller) {
        pos = this._scroller.getPos();
        if (pos === (this._items.length - 1)) {
          this.goTo(0);
        } else {
          this._scroller.next();
        }
      }
      return this;
    };

    Carousel.prototype.previous = function() {
      var pos;
      if (this._scroller) {
        pos = this._scroller.getPos();
        if (pos === 0) {
          this.goTo(this._items.length - 1);
        } else {
          this._scroller.prev();
        }
      }
      return this;
    };

    Carousel.prototype.refreshItems = function() {
      var ref;
      Carousel.__super__.refreshItems.call(this);
      if ((ref = this._scroller) != null) {
        ref.refresh();
      }
      this.refreshIndicators();
      this.setCurrentIndex(0);
      return this;
    };

    Carousel.prototype._doRefreshDom = function() {
      if (!this._dom) {
        return;
      }
      Carousel.__super__._doRefreshDom.call(this);
      this._classNamePool.add("carousel-" + this._orientation);
      this.refreshIndicators();
    };

    Carousel.prototype._onItemsRefresh = function(arg) {
      return this._itemDomsChanged();
    };

    Carousel.prototype._onItemInsert = function(arg) {
      return this._itemDomsChanged();
    };

    Carousel.prototype._onItemRemove = function(arg) {
      return this._itemDomsChanged();
    };

    Carousel.prototype._itemDomsChanged = function() {
      setTimeout((function(_this) {
        return function() {
          _this._parseDom(_this._dom);
        };
      })(this), 0);
    };

    Carousel.prototype.play = function(pause) {
      var carousel;
      if (this._interval) {
        clearInterval(this._interval);
      }
      carousel = this;
      if (pause) {
        this._pause = pause;
      }
      this._interval = setInterval(function() {
        return carousel.next();
      }, this._pause);
      return this;
    };

    Carousel.prototype.replay = function() {
      if (this._interval) {
        return this.play();
      }
    };

    Carousel.prototype.pause = function() {
      if (this._interval) {
        clearInterval(this._interval);
      }
      return this;
    };

    Carousel.prototype.goTo = function(index) {
      if (index == null) {
        index = 0;
      }
      this.replay();
      return this.setCurrentIndex(index);
    };

    return Carousel;

  })(cola.AbstractItemGroup);

  cola.Element.mixin(cola.Carousel, cola.TemplateSupport);

  cola.Element.mixin(cola.Carousel, cola.DataItemsWidgetMixin);

  if (cola.menu == null) {
    cola.menu = {};
  }

  cola.menu.AbstractMenuItem = (function(superClass) {
    extend(AbstractMenuItem, superClass);

    function AbstractMenuItem() {
      return AbstractMenuItem.__super__.constructor.apply(this, arguments);
    }

    AbstractMenuItem.ATTRIBUTES = {
      parent: null,
      active: {
        type: "boolean",
        defaultValue: false,
        setter: function(value) {
          var oldValue;
          oldValue = this._active;
          this._active = value;
          if (oldValue !== value && value) {
            return this.onActive(this);
          }
        },
        getter: function() {
          if (!this._active && this._rendered) {
            this._active = this.get$Dom().hasClass("active");
          }
          return this._active;
        }
      }
    };

    AbstractMenuItem.prototype.onItemClick = function(event, item) {
      var parentMenu;
      parentMenu = this._parent;
      if (parentMenu instanceof cola.Menu) {
        parentMenu.onItemClick(event, item);
      }
    };

    AbstractMenuItem.prototype.onActive = function(item) {
      var parentMenu;
      parentMenu = this._parent;
      if (parentMenu instanceof cola.Menu) {
        return parentMenu.setActiveItem(item);
      }
    };

    AbstractMenuItem.prototype.getParent = function() {
      return this._parent;
    };

    AbstractMenuItem.prototype.hasSubMenu = function() {
      return !!this._subMenu;
    };

    AbstractMenuItem.prototype.destroy = function() {
      if (this._destroyed) {
        return;
      }
      AbstractMenuItem.__super__.destroy.call(this);
      return delete this._parent;
    };

    return AbstractMenuItem;

  })(cola.AbstractContainer);

  cola.menu.MenuItem = (function(superClass) {
    extend(MenuItem, superClass);

    function MenuItem() {
      return MenuItem.__super__.constructor.apply(this, arguments);
    }

    MenuItem.CLASS_NAME = "item";

    MenuItem.TAG_NAME = "a";

    MenuItem.ATTRIBUTES = {
      caption: {
        refreshDom: true
      },
      icon: {
        refreshDom: true
      },
      href: {
        refreshDom: true
      },
      target: {
        refreshDom: true
      },
      items: {
        setter: function(value) {
          return this._resetSubMenu(value);
        },
        getter: function() {
          var ref;
          return (ref = this._subMenu) != null ? ref.get("items") : void 0;
        }
      }
    };

    MenuItem.prototype._parseDom = function(dom) {
      var child, subMenu;
      child = dom.firstChild;
      if (this._doms == null) {
        this._doms = {};
      }
      while (child) {
        if (child.nodeType === 1) {
          subMenu = cola.widget(child);
          if (subMenu instanceof cola.Menu) {
            this._subMenu = subMenu;
            subMenu._isSubMemu = true;
          } else if (child.nodeName === "I") {
            this._doms.iconDom = child;
            if (this._icon == null) {
              this._icon = child.className;
            }
          } else if (cola.util.hasClass(child, "caption")) {
            this._doms.captionDom = child;
          }
        }
        child = child.nextSibling;
      }
      if (!this._doms.captionDom) {
        this._doms.captionDom = $.xCreate({
          tagName: "span",
          content: this._caption || ""
        });
        if (this._doms.iconDom) {
          $fly(this._doms.iconDom).after(this._doms.captionDom);
        } else {
          $fly(dom).prepend(this._doms.captionDom);
        }
      }
    };

    MenuItem.prototype._initDom = function(dom) {
      var subMenuDom;
      MenuItem.__super__._initDom.call(this, dom);
      if (this._$dom == null) {
        this._$dom = $(dom);
      }
      this._$dom.click((function(_this) {
        return function(event) {
          if (_this._subMenu) {
            return;
          }
          return _this.onItemClick(event, _this);
        };
      })(this));
      if (this._subMenu) {
        subMenuDom = this._subMenu.getDom();
        if (subMenuDom.parentNode !== dom) {
          dom.appendChild(subMenuDom);
        }
      }
    };

    MenuItem.prototype._setDom = function(dom, parseChild) {
      var href, target;
      if (parseChild) {
        if (!this._href) {
          href = dom.getAttribute("href");
          if (href) {
            this._href = href;
          }
        }
        if (!this._target) {
          target = dom.getAttribute("target");
          if (target) {
            this._target = target;
          }
        }
      }
      return MenuItem.__super__._setDom.call(this, dom, parseChild);
    };

    MenuItem.prototype._createDom = function() {
      var caption, icon;
      icon = this.get("icon") || "";
      caption = this.get("caption") || "";
      return $.xCreate({
        tagName: "A",
        "class": this.constructor.CLASS_NAME,
        content: [
          {
            tagName: "span",
            content: caption,
            contextKey: "captionDom"
          }
        ]
      }, this._doms);
    };

    MenuItem.prototype._refreshIcon = function() {
      var $dom;
      $dom = this.get$Dom();
      if (this._icon && !this._caption) {
        this._classNamePool.add("icon");
      }
      if (this._icon) {
        if (!this._doms.iconDom) {
          this._doms.iconDom = $.xCreate({
            tagName: "i",
            "class": "icon"
          });
        }
        if (this._doms.iconDom.parentNode !== this._dom) {
          $dom.prepend(this._doms.iconDom);
        }
        return $fly(this._doms.iconDom).addClass(this._icon);
      } else {
        return $fly(this._doms.iconDom).remove();
      }
    };

    MenuItem.prototype._doRefreshDom = function() {
      var $dom, subMenuDom;
      if (!this._dom) {
        return;
      }
      MenuItem.__super__._doRefreshDom.call(this);
      $dom = this.get$Dom();
      $dom.find(">.ui.menu").removeClass("ui");
      this._refreshIcon();
      $fly(this._doms.captionDom).text(this._caption || "");
      if (this._subMenu) {
        subMenuDom = this._subMenu.getDom();
        if (subMenuDom.parentNode !== this._dom) {
          this._dom.appendChild(subMenuDom);
        }
      }
      if (this._href) {
        $dom.attr("href", this._href);
      } else {
        $dom.removeAttr("href");
      }
      $dom.attr("target", this._target || "");
    };

    MenuItem.prototype._resetSubMenu = function(config) {
      var ref;
      if ((ref = this._subMenu) != null) {
        ref.destroy();
      }
      if (config) {
        this._subMenu = new cola.Menu({
          items: config
        });
        this._subMenu._parent = this;
        return this._subMenu._isSubMemu = true;
      } else {
        return delete this._subMenu;
      }
    };

    MenuItem.prototype.destroy = function() {
      var ref;
      if (this._destroyed) {
        return;
      }
      if ((ref = this._subMenu) != null) {
        ref.destroy();
      }
      return MenuItem.__super__.destroy.call(this);
    };

    return MenuItem;

  })(cola.menu.AbstractMenuItem);

  cola.menu.DropdownMenuItem = (function(superClass) {
    extend(DropdownMenuItem, superClass);

    function DropdownMenuItem() {
      return DropdownMenuItem.__super__.constructor.apply(this, arguments);
    }

    DropdownMenuItem.CLASS_NAME = "dropdown item";

    DropdownMenuItem.ATTRIBUTES = {
      icon: {
        refreshDom: true,
        defaultValue: "dropdown"
      }
    };

    DropdownMenuItem.prototype._createDom = function() {
      var caption;
      caption = this.get("caption") || "";
      return $.xCreate({
        tagName: "DIV",
        "class": this.constructor.CLASS_NAME,
        content: [
          {
            tagName: "span",
            content: caption,
            contextKey: "captionDom"
          }, {
            tagName: "i",
            "class": "dropdown icon",
            contextKey: "iconDom"
          }
        ]
      }, this._doms);
    };

    DropdownMenuItem.prototype._refreshIcon = function() {
      if (!this._doms.iconDom) {
        this._doms.iconDom = document.createElement("i");
        this._dom.appendChild(this._doms.iconDom);
      }
      return this._doms.iconDom.className = (this._icon || "dropdown") + " icon";
    };

    return DropdownMenuItem;

  })(cola.menu.MenuItem);

  cola.menu.ControlMenuItem = (function(superClass) {
    extend(ControlMenuItem, superClass);

    function ControlMenuItem() {
      return ControlMenuItem.__super__.constructor.apply(this, arguments);
    }

    ControlMenuItem.CLASS_NAME = "item";

    ControlMenuItem.ATTRIBUTES = {
      control: {
        setter: function(value) {
          var control;
          $fly(this._control).remove();
          control = cola.xRender(value);
          this._control = control;
          if (control && this._dom) {
            this._dom.appendChild(control);
          }
          return this;
        }
      }
    };

    ControlMenuItem.prototype._parseDom = function(dom) {
      var child, widget;
      child = dom.firstChild;
      while (child) {
        if (child.nodeType === 1) {
          widget = cola.widget(child);
          if (widget) {
            this._control = widget;
            break;
          }
        }
        child = child.nextSibling;
      }
    };

    ControlMenuItem.prototype._doRefreshDom = function() {
      if (!this._dom) {
        return;
      }
      ControlMenuItem.__super__._doRefreshDom.call(this);
      return this._classNamePool.remove("ui");
    };

    ControlMenuItem.prototype._setDom = function(dom, parseChild) {
      var control;
      ControlMenuItem.__super__._setDom.call(this, dom, parseChild);
      control = this._control;
      if (!control) {
        return;
      }
      if (control instanceof cola.RenderableElement) {
        dom.appendChild(control.getDom());
      } else if (control.nodeType === 1) {
        dom.appendChild(control);
      }
    };

    return ControlMenuItem;

  })(cola.menu.AbstractMenuItem);

  cola.menu.HeaderMenuItem = (function(superClass) {
    extend(HeaderMenuItem, superClass);

    function HeaderMenuItem() {
      return HeaderMenuItem.__super__.constructor.apply(this, arguments);
    }

    HeaderMenuItem.CLASS_NAME = "header item";

    HeaderMenuItem.ATTRIBUTES = {
      text: null
    };

    HeaderMenuItem.prototype._setDom = function(dom, parseChild) {
      HeaderMenuItem.__super__._setDom.call(this, dom, parseChild);
      if (this._text) {
        this.get$Dom(this._text);
      }
    };

    HeaderMenuItem.prototype._doRefreshDom = function() {
      var text;
      if (!this._dom) {
        return;
      }
      HeaderMenuItem.__super__._doRefreshDom.call(this);
      this._classNamePool.remove("ui");
      text = this.get("text") || "";
      this.get$Dom().text(text);
    };

    return HeaderMenuItem;

  })(cola.menu.AbstractMenuItem);

  cola.Menu = (function(superClass) {
    extend(Menu, superClass);

    function Menu() {
      return Menu.__super__.constructor.apply(this, arguments);
    }

    Menu.CLASS_NAME = "ui menu";

    Menu.CHILDREN_TYPE_NAMESPACE = "menu";

    Menu.SEMANTIC_CLASS = ["top fixed", "right fixed", "bottom fixed", "left fixed"];

    Menu.ATTRIBUTES = {
      items: {
        setter: function(value) {
          var item, l, len1, results;
          if (this["_items"]) {
            this.clearItems();
          }
          if (value) {
            results = [];
            for (l = 0, len1 = value.length; l < len1; l++) {
              item = value[l];
              results.push(this.addItem(item));
            }
            return results;
          }
        }
      },
      showActivity: {
        type: "boolean",
        defaultValue: true
      },
      rightItems: {
        setter: function(value) {
          var item, l, len1, results;
          if (this["_rightItems"]) {
            this.clearRightItems();
          }
          if (value) {
            results = [];
            for (l = 0, len1 = value.length; l < len1; l++) {
              item = value[l];
              results.push(this.addRightItem(item));
            }
            return results;
          }
        }
      },
      centered: {
        type: "boolean",
        defaultValue: false
      }
    };

    Menu.EVENTS = {
      itemClick: null
    };

    Menu.prototype._parseDom = function(dom) {
      var container, parseItems, parseRightMenu;
      if (this._items == null) {
        this._items = [];
      }
      parseRightMenu = (function(_this) {
        return function(node) {
          var childNode, menuItem;
          childNode = node.firstChild;
          if (_this._rightItems == null) {
            _this._rightItems = [];
          }
          while (childNode) {
            if (childNode.nodeType === 1) {
              menuItem = cola.widget(childNode);
              if (menuItem) {
                _this.addRightItem(menuItem);
              }
            }
            childNode = childNode.nextSibling;
          }
        };
      })(this);
      parseItems = (function(_this) {
        return function(node) {
          var childNode, menuItem;
          childNode = node.firstChild;
          while (childNode) {
            if (childNode.nodeType === 1) {
              menuItem = cola.widget(childNode);
              if (menuItem) {
                _this.addItem(menuItem);
              } else if (!_this._rightMenuDom && cola.util.hasClass(childNode, "right menu")) {
                _this._rightMenuDom = childNode;
                parseRightMenu(childNode);
              }
            }
            childNode = childNode.nextSibling;
          }
        };
      })(this);
      container = $(dom).find(">.container");
      if (container.length) {
        this._centered = true;
        this._containerDom = container[0];
        parseItems(this._containerDom);
      } else {
        parseItems(dom);
      }
    };

    Menu.prototype._doRefreshDom = function() {
      if (!this._dom) {
        return;
      }
      Menu.__super__._doRefreshDom.call(this);
      $(this._containerDom).toggleClass("ui container", !!this._centered);
      if (this._isSubMemu) {
        this._classNamePool.remove("ui");
      }
    };

    Menu.prototype._initDom = function(dom) {
      var container, item, itemDom, l, len1, len2, menu, menuItems, n, rItemDom, rightMenuItems;
      menuItems = this._items;
      rightMenuItems = this._rightItems;
      menu = this;
      if (menuItems) {
        container = this._getItemsContainer();
        for (l = 0, len1 = menuItems.length; l < len1; l++) {
          item = menuItems[l];
          itemDom = item.getDom();
          if (itemDom.parentNode !== container) {
            container.appendChild(itemDom);
          }
        }
      }
      if (rightMenuItems) {
        if (!this._rightMenuDom) {
          this._rightMenuDom = this._createRightMenu();
          dom.appendChild(this._rightMenuDom);
        }
        for (n = 0, len2 = rightMenuItems.length; n < len2; n++) {
          item = rightMenuItems[n];
          rItemDom = item.getDom();
          if (rItemDom.parentNode !== this._rightMenuDom) {
            this._rightMenuDom.appendChild(rItemDom);
          }
        }
      }
      $(dom).prepend($.xCreate({
        tagName: "div",
        "class": "left-items"
      })).hover(function() {
        return menu._bindToSemantic();
      }).delegate(">.item,.right.menu>.item", "click", function() {
        return menu._setActive(this);
      });
      setTimeout(function() {
        menu._bindToSemantic();
      }, 300);
    };

    Menu.prototype._bindToSemantic = function() {
      var $dom;
      if (this._parent instanceof cola.menu.MenuItem) {
        return;
      }
      $dom = this.get$Dom();
      $dom.find(">.dropdown.item,.right.menu>.dropdown.item").each((function(_this) {
        return function(index, item) {
          var $item;
          $item = $(item);
          if ($item.hasClass("c-dropdown")) {
            return;
          }
          $item.addClass("c-dropdown");
          $item.find(".dropdown.item").addClass("c-dropdown");
          return $item.dropdown({
            on: "hover"
          });
        };
      })(this));
    };

    Menu.prototype._setDom = function(dom, parseChild) {
      Menu.__super__._setDom.call(this, dom, parseChild);
      if (this._activeItem) {
        this._setActive(this._activeItem.getDom());
      }
    };

    Menu.prototype.setActiveItem = function(item) {
      if (!item.get("active")) {
        item.set("active", true);
      }
      this._activeItem = item;
      if (this._rendered) {
        this._setActive(item.getDom());
      }
    };

    Menu.prototype.getActiveItem = function() {
      return this._activeItem;
    };

    Menu.prototype._setActive = function(itemDom) {
      if (this._parent && this._parent instanceof cola.menu.DropdownMenuItem) {
        return;
      }
      if (!this._showActivity) {
        return;
      }
      $(">a.item:not(.dropdown),.right.menu>a.item:not(.dropdown)", this._dom).each(function() {
        if (itemDom === this) {
          $fly(this).addClass("active");
        } else {
          $fly(this).removeClass("active").find(".item").removeClass("active");
        }
      });
      if ($fly(itemDom).hasClass("dropdown")) {
        return;
      }
      if ($(">.menu", itemDom).length && !this._isSubMemu) {
        $fly(itemDom).removeClass("active");
      }
    };

    Menu.prototype._getItemsContainer = function() {
      if (this._centered) {
        if (!this._containerDom) {
          this._containerDom = $.xCreate({
            tagName: "div",
            "class": "container"
          });
          this._dom.appendChild(this._containerDom);
        }
      }
      return this._containerDom || this._dom;
    };

    Menu.prototype.getParent = function() {
      return this._parent;
    };

    Menu.prototype.onItemClick = function(event, item) {
      var arg, parentMenu;
      parentMenu = this.getParent();
      arg = {
        item: item,
        event: event
      };
      this.fire("itemClick", this, arg);
      if (!parentMenu) {
        return;
      }
      if (parentMenu instanceof cola.menu.AbstractMenuItem || parentMenu instanceof cola.Menu) {
        parentMenu.onItemClick(event, item);
      }
    };

    Menu.prototype._createItem = function(config) {
      var menuItem;
      menuItem = null;
      if (config.constructor === Object.prototype.constructor) {
        if (config.$type) {
          if (config.$type === "dropdown") {
            menuItem = new cola.menu.DropdownMenuItem(config);
          } else if (config.$type === "headerItem") {
            menuItem = new cola.menu.HeaderMenuItem(config);
          } else {
            menuItem = new cola.menu.ControlMenuItem({
              control: config
            });
          }
        } else {
          menuItem = new cola.menu.MenuItem(config);
        }
      } else if (config instanceof cola.menu.AbstractMenuItem) {
        menuItem = config;
      }
      return menuItem;
    };

    Menu.prototype.addItem = function(config) {
      var active, container, itemDom, menuItem;
      menuItem = this._createItem(config);
      if (!menuItem) {
        return;
      }
      menuItem._parent = this;
      if (this._items == null) {
        this._items = [];
      }
      this._items.push(menuItem);
      active = menuItem.get("active");
      if (active) {
        this._activeItem = menuItem;
      }
      if (this._dom) {
        container = this._getItemsContainer();
        itemDom = menuItem.getDom();
        if (itemDom.parentNode !== container) {
          if (this._rightMenuDom) {
            $(this._rightMenuDom).before(itemDom);
          } else {
            container.appendChild(itemDom);
          }
        }
      }
      return itemDom;
    };

    Menu.prototype.addRightItem = function(config) {
      var active, container, itemDom, menuItem;
      menuItem = this._createItem(config);
      if (!menuItem) {
        return this;
      }
      menuItem._parent = this;
      if (this._rightItems == null) {
        this._rightItems = [];
      }
      this._rightItems.push(menuItem);
      active = menuItem.get("active");
      if (active) {
        this._activeItem = menuItem;
      }
      if (this._dom) {
        container = this._getItemsContainer();
        itemDom = menuItem.getDom();
        if (!this._rightMenuDom) {
          this._rightMenuDom = this._createRightMenu();
          container.appendChild(this._rightMenuDom);
        }
        if (itemDom.parentNode !== this._rightMenuDom) {
          this._rightMenuDom.appendChild(itemDom);
        }
      }
      return itemDom;
    };

    Menu.prototype.clearItems = function() {
      var item, l, len1, menuItems;
      menuItems = this._items;
      if (menuItems != null ? menuItems.length : void 0) {
        for (l = 0, len1 = menuItems.length; l < len1; l++) {
          item = menuItems[l];
          item.destroy();
        }
        this._items = [];
      }
      return this;
    };

    Menu.prototype.clearRightItems = function() {
      var item, l, len1, menuItems;
      menuItems = this._rightItems;
      if (menuItems != null ? menuItems.length : void 0) {
        for (l = 0, len1 = menuItems.length; l < len1; l++) {
          item = menuItems[l];
          item.destroy();
        }
        this._rightItems = [];
      }
      return this;
    };

    Menu.prototype._doRemove = function(array, item) {
      var index;
      index = array.indexOf(item);
      if (index > -1) {
        array.splice(index, 1);
        item.destroy();
      }
    };

    Menu.prototype.removeItem = function(item) {
      var menuItems;
      menuItems = this._items;
      if (!menuItems) {
        return this;
      }
      if (typeof item === "number") {
        item = menuItems[item];
      }
      if (item) {
        this._doRemove(menuItems, item);
      }
      return this;
    };

    Menu.prototype.removeRightItem = function(item) {
      var menuItems;
      menuItems = this._rightItems;
      if (!menuItems) {
        return this;
      }
      if (typeof item === "number") {
        item = menuItems[item];
      }
      if (item) {
        this._doRemove(menuItems, item);
      }
      return this;
    };

    Menu.prototype.getItem = function(index) {
      var ref;
      return (ref = this._items) != null ? ref[index] : void 0;
    };

    Menu.prototype.getRightItem = function(index) {
      var ref;
      return (ref = this._rightItems) != null ? ref[index] : void 0;
    };

    Menu.prototype._createRightMenu = function() {
      return $.xCreate({
        tagName: "DIV",
        "class": "right menu"
      });
    };

    Menu.prototype.destroy = function() {
      if (this._destroyed) {
        return;
      }
      Menu.__super__.destroy.call(this);
      delete this._activeItem;
      this.clearRightItems();
      this.clearItems();
      delete this._containerDom;
      return this;
    };

    return Menu;

  })(cola.Widget);

  cola.TitleBar = (function(superClass) {
    extend(TitleBar, superClass);

    function TitleBar() {
      return TitleBar.__super__.constructor.apply(this, arguments);
    }

    TitleBar.CLASS_NAME = "menu title-bar";

    TitleBar.CHILDREN_TYPE_NAMESPACE = "menu";

    TitleBar.ATTRIBUTES = {
      title: {
        refreshDom: true
      }
    };

    TitleBar.prototype._parseDom = function(dom) {
      var child, firstChild;
      child = dom.firstChild;
      if (this._doms == null) {
        this._doms = {};
      }
      while (child) {
        if (child.nodeType === 1) {
          if (!this._doms.title && cola.util.hasClass(child, "title")) {
            this._doms.title = child;
            if (this._title == null) {
              this._title = cola.util.getTextChildData(child);
            }
            break;
          }
        }
        child = child.nextSibling;
      }
      TitleBar.__super__._parseDom.call(this, dom);
      firstChild = dom.children[0];
      if (this._doms.title && firstChild !== this._doms.title) {
        $(this._doms.title).remove();
        $(firstChild).before(this._doms.title);
      }
    };

    TitleBar.prototype._doRefreshDom = function() {
      if (!this._dom) {
        return;
      }
      TitleBar.__super__._doRefreshDom.call(this);
      if (this._doms == null) {
        this._doms = {};
      }
      if (this._title) {
        if (!this._doms.title) {
          this._doms.title = $.xCreate({
            tagName: "div",
            "class": "title"
          });
          this.get$Dom().prepend(this._doms.title);
        }
        $(this._doms.title).text(this._title);
      } else {
        $(this._doms.title).empty();
      }
      return null;
    };

    return TitleBar;

  })(cola.Menu);

  cola.registerType("menu", "_default", cola.menu.MenuItem);

  cola.registerType("menu", "item", cola.menu.MenuItem);

  cola.registerType("menu", "dropdownItem", cola.menu.DropdownMenuItem);

  cola.registerType("menu", "controlItem", cola.menu.ControlMenuItem);

  cola.registerType("menu", "headerItem", cola.menu.HeaderMenuItem);

  cola.registerTypeResolver("menu", function(config) {
    return cola.resolveType("widget", config);
  });

  cola.ButtonMenu = (function(superClass) {
    extend(ButtonMenu, superClass);

    function ButtonMenu() {
      return ButtonMenu.__super__.constructor.apply(this, arguments);
    }

    ButtonMenu.prototype.onItemClick = function(event, item) {
      var ref;
      if ((ref = this._parent) != null) {
        ref.onItemClick(event, item);
      }
      return null;
    };

    ButtonMenu.prototype._toDropDown = function(item) {
      if (!(this._parent instanceof cola.MenuButton)) {
        ButtonMenu.__super__._toDropDown.call(this, item);
      }
      return null;
    };

    return ButtonMenu;

  })(cola.Menu);

  cola.MenuButton = (function(superClass) {
    extend(MenuButton, superClass);

    function MenuButton() {
      return MenuButton.__super__.constructor.apply(this, arguments);
    }

    MenuButton.CLASS_NAME = "dropdown button";

    MenuButton.ATTRIBUTES = {
      menuItems: {
        setter: function(value) {
          return this._resetMenu(value);
        },
        getter: function() {
          var ref;
          return (ref = this._menu) != null ? ref.get("items") : void 0;
        }
      }
    };

    MenuButton.EVENTS = {
      menuItemClick: null
    };

    MenuButton.prototype._setDom = function(dom, parseChild) {
      var menuDom;
      MenuButton.__super__._setDom.call(this, dom, parseChild);
      if (this._menu) {
        menuDom = this._menu.getDom();
        if (menuDom.parentNode !== this._dom) {
          this._dom.appendChild(menuDom);
        }
      }
      this.get$Dom().dropdown();
    };

    MenuButton.prototype._parseDom = function(dom) {
      var child, menu;
      child = dom.firstChild;
      while (child) {
        if (child.nodeType === 1) {
          menu = cola.widget(child);
          if (menu && menu instanceof cola.Menu) {
            this._menu = menu;
            break;
          }
        }
        child = child.nextSibling;
      }
    };

    MenuButton.prototype.onItemClick = function(event, item) {
      this.fire("menuItemClick", this, {
        item: item,
        event: event
      });
    };

    MenuButton.prototype._resetMenu = function(menuItems) {
      var ref;
      if ((ref = this._menu) != null) {
        ref.destroy();
      }
      this._menu = new cola.ButtonMenu({
        items: menuItems
      });
      this._menu._parent = this;
      if (this._dom) {
        this.get$Dom().append(this._menu.getDom());
      }
    };

    MenuButton.prototype.destroy = function() {
      var ref;
      if (this._destroyed) {
        return;
      }
      if ((ref = this._menu) != null) {
        ref.destroy();
      }
      delete this._menu;
      MenuButton.__super__.destroy.call(this);
    };

    MenuButton.prototype.addMenuItem = function(config) {
      var ref;
      if ((ref = this._menu) != null) {
        ref.addItem(config);
      }
      return this;
    };

    MenuButton.prototype.clearMenuItems = function() {
      var ref;
      if ((ref = this._menu) != null) {
        ref.clearItems();
      }
      return this;
    };

    MenuButton.prototype.removeMenuItem = function(item) {
      var ref;
      if ((ref = this._menu) != null) {
        ref.removeItem(item);
      }
      return this;
    };

    MenuButton.prototype.getMenuItem = function(index) {
      var ref;
      return (ref = this._menu) != null ? ref.getItem(index) : void 0;
    };

    return MenuButton;

  })(cola.Button);

  if (cola.shape == null) {
    cola.shape = {};
  }

  cola.shape.Side = (function(superClass) {
    extend(Side, superClass);

    function Side() {
      return Side.__super__.constructor.apply(this, arguments);
    }

    Side.ATTRIBUTES = {
      content: {
        refreshDom: true,
        setter: function(value) {
          var ref;
          if ((ref = this["_content"]) != null) {
            if (typeof ref.destroy === "function") {
              ref.destroy();
            }
          }
          this["_content"] = value;
          if (this._dom) {
            this._refreshContent();
          }
        }
      },
      active: {
        type: "boolean",
        defaultValue: false
      }
    };

    Side.prototype._createDom = function() {
      var dom;
      dom = document.createElement("div");
      dom.className = "side";
      return dom;
    };

    Side.prototype._refreshContent = function() {
      var content, dom;
      content = this._content;
      dom = null;
      if (content instanceof cola.Widget) {
        dom = content.getDom();
      } else if (content.constructor === Object.prototype.constructor) {
        if (content.$type) {
          content = this._content = cola.widget(content);
          content.appendTo(this._dom);
        } else {
          this.get$Dom().append($.xCreate(content));
        }
      } else if (content.nodeType === 1) {
        this.get$Dom().append(content);
      }
    };

    Side.prototype.getDom = function() {
      if (this._destroyed) {
        return;
      }
      if (!this._dom) {
        Side.__super__.getDom.call(this);
        if (this._content) {
          this._refreshContent();
        }
      }
      return this._dom;
    };

    Side.prototype.destroy = function() {
      if (!this._destroyed) {
        delete this._dom;
        delete this._$dom;
        delete this._content;
        Side.__super__.destroy.call(this);
      }
      this._destroyed = true;
    };

    return Side;

  })(cola.Widget);

  cola.Shape = (function(superClass) {
    extend(Shape, superClass);

    function Shape() {
      return Shape.__super__.constructor.apply(this, arguments);
    }

    Shape.CLASS_NAME = "ui shape";

    Shape.ATTRIBUTES = {
      sides: {
        setter: function(sides) {
          var config, l, len1;
          this.clear();
          for (l = 0, len1 = sides.length; l < len1; l++) {
            config = sides[l];
            this.addSide(config);
          }
        }
      },
      currentIndex: {
        type: "number",
        setter: function(sides) {
          var config, l, len1;
          this.clear();
          for (l = 0, len1 = sides.length; l < len1; l++) {
            config = sides[l];
            this.addSide(config);
          }
        }
      }
    };

    Shape.EVENTS = {
      beforeChange: null,
      afterChange: null
    };

    Shape.prototype.addSide = function(config) {
      var side;
      if (this._sides == null) {
        this._sides = [];
      }
      side = null;
      if (config instanceof cola.Widget) {
        side = new cola.shape.Side({
          content: config
        });
      } else if (config.constructor === Object.prototype.constructor) {
        if (config.$type || config.tagName) {
          side = new cola.shape.Side({
            content: config
          });
        } else if (config.tagName) {
          side = new cola.shape.Side(config);
        }
      }
      if (side) {
        this._sides.push(side);
      }
      if (this._dom && side) {
        $(this._doms.sides).append(side.getDom());
      }
      return this;
    };

    Shape.prototype.removeSide = function(side) {
      var index;
      index = side;
      if (side instanceof cola.shape.Side) {
        index = this._sides.indexOf(side);
      }
      if (index > -1) {
        this._sides.splice(index, 1);
        side.remove();
      }
    };

    Shape.prototype.clear = function() {
      var l, len1, ref, side;
      if (!this._sides) {
        return;
      }
      ref = this._sides;
      for (l = 0, len1 = ref.length; l < len1; l++) {
        side = ref[l];
        side.destroy();
      }
      this._sides = [];
      $(this._doms.sides).empty();
      return this;
    };

    Shape.prototype._createDom = function() {
      return $.xCreate({
        tagName: "div",
        "class": this.constructor.CLASS_NAME,
        content: [
          {
            tagName: "div",
            "class": "sides",
            contextKey: "sides"
          }
        ]
      }, this._doms);
    };

    Shape.prototype.getDom = function() {
      var $sidesDom, current, l, len1, ref, side;
      if (this._destroyed) {
        return null;
      }
      if (!this._dom) {
        if (this._doms == null) {
          this._doms = {};
        }
        Shape.__super__.getDom.call(this);
        $sidesDom = $(this._doms.sides);
        if (this._sides) {
          current = null;
          ref = this._sides;
          for (l = 0, len1 = ref.length; l < len1; l++) {
            side = ref[l];
            $sidesDom.append(side.getDom());
            if (!!side.get("active")) {
              current = side;
            }
          }
          if (current == null) {
            current = this._sides[0];
          }
          current.get$Dom().addClass("active");
        }
        this.get$Dom().shape({
          beforeChange: (function(_this) {
            return function() {
              _this.fire("beforeChange", _this, {
                current: _this._current
              });
            };
          })(this),
          onChange: (function(_this) {
            return function() {
              var len2, n, ref1;
              _this._current = null;
              ref1 = _this._sides;
              for (n = 0, len2 = ref1.length; n < len2; n++) {
                side = ref1[n];
                side.get$Dom().hasClass("active");
                _this._current = side;
                break;
              }
              _this.fire("afterChange", _this, {
                current: _this._current
              });
            };
          })(this)
        });
      }
      return this._dom;
    };

    Shape.prototype.getSide = function(index) {
      var ref;
      return (ref = this._sides) != null ? ref[index] : void 0;
    };

    Shape.prototype.getSideDom = function(index) {
      var ref, ref1;
      return (ref = this._sides) != null ? (ref1 = ref[index]) != null ? ref1.getDom() : void 0 : void 0;
    };

    Shape.prototype.flipUp = function() {
      this.get$Dom().shape("flip up");
      return this;
    };

    Shape.prototype.flipDown = function() {
      this.get$Dom().shape("flip down");
      return this;
    };

    Shape.prototype.flipRight = function() {
      this.get$Dom().shape("flip right");
      return this;
    };

    Shape.prototype.flipLeft = function() {
      this.get$Dom().shape("flip left");
      return this;
    };

    Shape.prototype.flipOver = function() {
      this.get$Dom().shape("flip over");
      return this;
    };

    Shape.prototype.flipBack = function() {
      this.get$Dom().shape("flip back");
      return this;
    };

    Shape.prototype.flip = function(flip) {
      this.get$Dom().shape("flip " + flip);
      return this;
    };

    Shape.prototype.setNextSide = function(selector) {
      this.get$Dom().shape("set next side", selector);
      return this;
    };

    return Shape;

  })(cola.Widget);

  if (cola.steps == null) {
    cola.steps = {};
  }

  cola.steps.Step = (function(superClass) {
    extend(Step, superClass);

    function Step() {
      return Step.__super__.constructor.apply(this, arguments);
    }

    Step.CLASS_NAME = "step";

    Step.ATTRIBUTES = {
      icon: {
        refreshDom: true
      },
      content: {
        refreshDom: true
      },
      states: {
        refreshDom: true,
        "enum": ["completed", "active", ""],
        defaultValue: "",
        setter: function(value) {
          var oldValue;
          oldValue = this._states;
          this._states = value;
          if (this._dom && value !== oldValue && oldValue) {
            $fly(this._dom).removeClass(oldValue);
          }
          return this;
        }
      },
      disabled: {
        type: "boolean",
        defaultValue: false
      }
    };

    Step.prototype._parseDom = function(dom) {
      var $cc, $child, cc, child, l, len1, parseContent, parseDescription, parseTitle, ref;
      if (this._doms == null) {
        this._doms = {};
      }
      parseTitle = (function(_this) {
        return function(node) {
          var content, title;
          _this._doms.title = node;
          title = cola.util.getTextChildData(node);
          content = _this._content || {};
          if (!content.title && title) {
            if (_this._content == null) {
              _this._content = {};
            }
            _this._doms.titleDom = node;
            _this._content.title = title;
          }
        };
      })(this);
      parseDescription = (function(_this) {
        return function(node) {
          var content, description;
          _this._doms.description = node;
          description = cola.util.getTextChildData(node);
          content = _this._content || {};
          if (description && !content.description) {
            if (_this._content == null) {
              _this._content = {};
            }
            _this._doms.descriptionDom = node;
            _this._content.description = description;
          }
        };
      })(this);
      parseContent = (function(_this) {
        return function(node) {
          var content;
          content = cola.util.getTextChildData(node);
          if (!_this._content && content) {
            _this._content = content;
          }
        };
      })(this);
      child = dom.firstChild;
      while (child) {
        if (child.nodeType === 1) {
          if (child.nodeName === "I") {
            this._doms.iconDom = child;
            if (!this._icon) {
              this._icon = child.className;
            }
          } else {
            $child = $(child);
            if ($child.hasClass("content")) {
              this._doms.contentDom = child;
              ref = child.childNodes;
              for (l = 0, len1 = ref.length; l < len1; l++) {
                cc = ref[l];
                if (child.nodeType !== 1) {
                  continue;
                }
                $cc = $(cc);
                if ($cc.hasClass("title")) {
                  parseTitle(cc);
                }
                if ($cc.hasClass("description")) {
                  parseDescription(cc);
                }
              }
              if (!this._content) {
                parseContent(child);
              }
            } else if ($child.hasClass("title")) {
              parseTitle(child);
            } else if ($child.hasClass("description")) {
              parseDescription(child);
            }
          }
        }
        child = child.nextSibling;
      }
      parseContent(dom);
    };

    Step.prototype._doRefreshDom = function() {
      var $contentDom, $dom, base, base1, base2, base3, classNamePool, content, icon;
      if (!this._dom) {
        return;
      }
      Step.__super__._doRefreshDom.call(this);
      if (this._doms == null) {
        this._doms = {};
      }
      content = this.get("content");
      $dom = this.get$Dom();
      $dom.empty();
      icon = this.get("icon");
      if (icon) {
        if ((base = this._doms).iconDom == null) {
          base.iconDom = document.createElement("i");
        }
        this._doms.iconDom.className = icon + " icon";
        $dom.append(this._doms.iconDom);
      } else {
        $fly(this._doms.iconDom).remove();
      }
      if (content) {
        if ((base1 = this._doms).contentDom == null) {
          base1.contentDom = document.createElement("div");
        }
        $contentDom = $(this._doms.contentDom);
        $contentDom.addClass("content").empty();
        if (typeof content === "string") {
          $contentDom.text(content);
        } else {
          if (content.title) {
            if ((base2 = this._doms).titleDom == null) {
              base2.titleDom = document.createElement("div");
            }
            $fly(this._doms.titleDom).addClass("title").text(content.title);
            $contentDom.append(this._doms.titleDom);
          }
          if (content.description) {
            if ((base3 = this._doms).descriptionDom == null) {
              base3.descriptionDom = document.createElement("div");
            }
            $fly(this._doms.descriptionDom).addClass("description").text(content.description);
            $contentDom.append(this._doms.descriptionDom);
          }
        }
        $dom.append($contentDom);
      }
      classNamePool = this._classNamePool;
      if (this._states) {
        classNamePool.add(this._states);
      }
      return classNamePool.toggle("disabled", this._disabled);
    };

    Step.prototype.destroy = function() {
      if (this._destroyed) {
        return;
      }
      Step.__super__.destroy.call(this);
      return delete this._doms;
    };

    return Step;

  })(cola.Widget);

  cola.Steps = (function(superClass) {
    extend(Steps, superClass);

    function Steps() {
      return Steps.__super__.constructor.apply(this, arguments);
    }

    Steps.CHILDREN_TYPE_NAMESPACE = "steps";

    Steps.CLASS_NAME = "steps";

    Steps.SEMANTIC_CLASS = ["tablet stackable", "left floated", "right floated"];

    Steps.ATTRIBUTES = {
      size: {
        "enum": ["mini", "tiny", "small", "medium", "large", "big", "huge", "massive"],
        refreshDom: true,
        setter: function(value) {
          var oldValue;
          oldValue = this["_size"];
          if (oldValue && oldValue !== value && this._dom) {
            this.get$Dom().removeClass(oldValue);
          }
          this["_size"] = value;
        }
      },
      steps: {
        refreshDom: true,
        setter: function(value) {
          var l, len1, step;
          this.clear();
          for (l = 0, len1 = value.length; l < len1; l++) {
            step = value[l];
            if (step instanceof cola.steps.Step) {
              this.addStep(step);
            } else if (step.constructor === Object.prototype.constructor) {
              this.addStep(new cola.steps.Step(step));
            }
          }
        }
      },
      currentIndex: {
        type: "number",
        setter: function(value) {
          this["_currentIndex"] = value;
          return this.setCurrent(value);
        },
        getter: function() {
          if (this._current && this._steps) {
            return this._steps.indexOf(this._current);
          } else {
            return -1;
          }
        }
      },
      autoComplete: {
        type: "boolean",
        defaultValue: true
      }
    };

    Steps.EVENTS = {
      beforeChange: null,
      change: null,
      complete: null
    };

    Steps.prototype._doRefreshDom = function() {
      var size;
      if (!this._dom) {
        return;
      }
      Steps.__super__._doRefreshDom.call(this);
      size = this.get("size");
      if (size) {
        return this._classNamePool.add(size);
      }
    };

    Steps.prototype._doRemove = function(step) {
      var index;
      index = this._steps.indexOf(step);
      if (index > -1) {
        this._steps.splice(index, 1);
        step.remove();
      }
    };

    Steps.prototype._setDom = function(dom, parseChild) {
      var l, len1, ref, ref1, step, stepDom;
      Steps.__super__._setDom.call(this, dom, parseChild);
      if (!((ref = this._steps) != null ? ref.length : void 0)) {
        return;
      }
      ref1 = this._steps;
      for (l = 0, len1 = ref1.length; l < len1; l++) {
        step = ref1[l];
        stepDom = step.getDom();
        if (stepDom.parentNode !== this._dom) {
          step.appendTo(this._dom);
        }
      }
    };

    Steps.prototype._parseDom = function(dom) {
      var child, step;
      if (!dom) {
        return;
      }
      if (this._steps == null) {
        this._steps = [];
      }
      child = dom.firstChild;
      while (child) {
        if (child.nodeType === 1) {
          step = cola.widget(child);
          if (step && step instanceof cola.steps.Step) {
            this.addStep(step);
          }
        }
        child = child.nextSibling;
      }
    };

    Steps.prototype._doChange = function(index) {
      var arg, newCurrent, oldCurrent;
      oldCurrent = this._current;
      if (index > -1 && index < this._steps.length) {
        newCurrent = this._steps[index];
      }
      if (oldCurrent === newCurrent) {
        return;
      }
      arg = {
        oldCurrent: oldCurrent,
        newCurrent: newCurrent
      };
      if (this.fire("beforeChange", this, arg) === false) {
        if (newCurrent) {
          newCurrent.set("states", "");
        }
        return;
      }
      this._current = newCurrent;
      if (oldCurrent) {
        oldCurrent.set("states", "");
      }
      if (newCurrent) {
        newCurrent.set("states", "active");
      }
      if (index >= this._steps.length) {
        this.fire("complete", this, {});
      }
      this.fire("change", this, arg);
      this._doComplete(index);
    };

    Steps.prototype.getStep = function(index) {
      var ref;
      return (ref = this._steps) != null ? ref[index] : void 0;
    };

    Steps.prototype.setCurrent = function(step) {
      var currentIndex, el, index, l, len1, ref;
      currentIndex = step;
      if (typeof step === "string") {
        ref = this._steps;
        for (index = l = 0, len1 = ref.length; l < len1; index = ++l) {
          el = ref[index];
          if (step === el.get("content")) {
            currentIndex = index;
            break;
          }
        }
      } else if (step instanceof cola.steps.Step) {
        currentIndex = this._steps.indexOf(step);
      }
      this._doChange(currentIndex);
      return this;
    };

    Steps.prototype._doComplete = function(index) {
      var completeIndex, dIndex, results;
      if (this._autoComplete) {
        completeIndex = index - 1;
        while (completeIndex > -1) {
          this._steps[completeIndex].set("states", "completed");
          completeIndex--;
        }
        dIndex = index + 1;
        results = [];
        while (dIndex < this._steps.length) {
          this._steps[dIndex].set("states", "");
          results.push(dIndex++);
        }
        return results;
      }
    };

    Steps.prototype.getCurrent = function() {
      return this._current;
    };

    Steps.prototype.add = function() {
      var arg, l, len1, step;
      for (l = 0, len1 = arguments.length; l < len1; l++) {
        arg = arguments[l];
        step = arg;
        if (step instanceof cola.steps.Step) {
          this.addStep(step);
        } else if (step.constructor === Object.prototype.constructor) {
          this.addStep(new cola.steps.Step(step));
        }
      }
      return this;
    };

    Steps.prototype.addStep = function(step) {
      var states, stepDom;
      if (this._destroyed) {
        return this;
      }
      if (this._steps == null) {
        this._steps = [];
      }
      if (step.constructor === Object.prototype.constructor) {
        step = new cola.steps.Step(step);
      }
      if (!(step instanceof cola.steps.Step)) {
        return this;
      }
      if (this._steps.indexOf(step) > -1) {
        return this;
      }
      this._steps.push(step);
      if (this._dom) {
        stepDom = step.getDom();
        if (stepDom.parentNode !== this._dom) {
          step.appendTo(this._dom);
        }
      }
      states = step.get("states");
      if (states === "active") {
        this._doChange(this._steps.length - 1);
      }
      return this;
    };

    Steps.prototype.removeStep = function(step) {
      if (!this._steps) {
        return this;
      }
      if (typeof step === "number") {
        step = this._steps[step];
      }
      if (step) {
        this._doRemove(step);
      }
      return this;
    };

    Steps.prototype.clear = function() {
      if (!this._steps) {
        return this;
      }
      if (this._dom) {
        this.get$Dom().empty();
      }
      if (this._steps.length) {
        this._steps = [];
      }
      return this;
    };

    Steps.prototype.next = function() {
      var currentIndex;
      currentIndex = this.get("currentIndex");
      this.setCurrent(++currentIndex);
      return this;
    };

    Steps.prototype.complete = function() {
      return this.setCurrent(this._steps.length);
    };

    Steps.prototype.previous = function() {
      var currentIndex;
      currentIndex = this.get("currentIndex");
      this.setCurrent(--currentIndex);
      return this;
    };

    Steps.prototype.goTo = function(index) {
      this.setCurrent(index);
      return this;
    };

    Steps.prototype.getStepIndex = function(step) {
      var ref;
      return (ref = this._steps) != null ? ref.indexOf(step) : void 0;
    };

    return Steps;

  })(cola.Widget);

  cola.registerType("steps", "_default", cola.steps.Step);

  cola.registerType("steps", "Step", cola.steps.Step);

  cola.registerTypeResolver("steps", function(config) {
    return cola.resolveType("widget", config);
  });

  cola.Stack = (function(superClass) {
    extend(Stack, superClass);

    function Stack() {
      return Stack.__super__.constructor.apply(this, arguments);
    }

    Stack.CLASS_NAME = "stack";

    Stack.EVENTS = {
      change: null
    };

    Stack.duration = 200;

    Stack.prototype._createDom = function() {
      var dom;
      if (this._doms == null) {
        this._doms = {};
      }
      dom = $.xCreate({
        content: [
          {
            tagName: "div",
            "class": "items-wrap",
            contextKey: "itemsWrap",
            content: [
              {
                tagName: "div",
                "class": "item black prev",
                contextKey: "prevItem"
              }, {
                tagName: "div",
                "class": "item blue current",
                contextKey: "currentItem",
                style: {
                  display: "block"
                }
              }, {
                tagName: "div",
                "class": "item green next",
                contextKey: "nextItem"
              }
            ]
          }
        ]
      }, this._doms);
      this._prevItem = this._doms.prevItem;
      this._currentItem = this._doms.currentItem;
      this._nextItem = this._doms.nextItem;
      return dom;
    };

    Stack.prototype._setDom = function(dom, parseChild) {
      var stack;
      Stack.__super__._setDom.call(this, dom, parseChild);
      stack = this;
      return $(dom).on("touchstart", function(evt) {
        return stack._onTouchStart(evt);
      }).on("touchmove", function(evt) {
        return stack._onTouchMove(evt);
      }).on("touchend", function(evt) {
        return stack._onTouchEnd(evt);
      });
    };

    Stack.prototype._getTouchPoint = function(evt) {
      var touches;
      touches = evt.originalEvent.touches;
      if (!touches.length) {
        touches = evt.originalEvent.changedTouches;
      }
      return touches[0];
    };

    Stack.prototype._onTouchStart = function(evt) {
      var touch;
      this._touchStart = true;
      touch = evt.originalEvent.touches[0];
      this._touchStartX = touch.pageX;
      this._touchStartY = touch.pageY;
      this._moveTotal = 0;
      this._touchTimestamp = new Date();
      evt.stopImmediatePropagation();
      return this;
    };

    Stack.prototype._onTouchMove = function(evt) {
      var direction, distanceX, distanceY, factor, timestamp, touchPoint, width;
      if (!this._touchStart) {
        return;
      }
      touchPoint = this._getTouchPoint(evt);
      this._touchLastX = touchPoint.pageX;
      this._touchLastY = touchPoint.pageY;
      distanceX = this._touchLastX - this._touchStartX;
      distanceY = this._touchLastY - this._touchStartY;
      timestamp = new Date();
      this._touchMoveSpeed = distanceX / (timestamp - this._touchLastTimstamp);
      this._touchLastTimstamp = timestamp;
      if (distanceX < 0) {
        direction = "left";
        factor = 1;
      } else {
        direction = "right";
        factor = -1;
      }
      this._touchDirection = direction;
      this._factor = factor;
      width = this._currentItem.clientWidth;
      this._distanceX = Math.abs(distanceX);
      this._moveTotal = (this._moveTotal || 0) + Math.abs(distanceX);
      if (this._moveTotal < 8) {
        return;
      }
      $fly(this._currentItem).css("transform", "translate(" + distanceX + "px,0)");
      if (direction === "left") {
        $fly(this._prevItem).css("display", "none");
        $fly(this._nextItem).css({
          transform: "translate(" + (width + distanceX) + "px,0)",
          display: "block"
        });
      } else {
        $fly(this._nextItem).css("display", "none");
        $fly(this._prevItem).css({
          transform: "translate(" + (factor * width + distanceX) + "px,0)",
          display: "block"
        });
      }
      evt.stopImmediatePropagation();
      return false;
    };

    Stack.prototype._onTouchEnd = function(evt) {
      var duration, width;
      if (!this._touchStart) {
        return;
      }
      duration = this.constructor.duration;
      width = this._currentItem.clientWidth;
      if (this._moveTotal < 8) {
        return;
      }
      if (this._distanceX > width / 3) {
        if (this._touchDirection === "left") {
          $(this._currentItem).transit({
            x: -1 * width,
            duration: duration
          });
          $(this._nextItem).transit({
            x: 0,
            duration: duration
          });
          this._doNext();
        } else {
          $(this._currentItem).transit({
            x: width,
            duration: duration
          });
          $(this._prevItem).transit({
            x: 0,
            duration: duration
          });
          this._doPrev();
        }
      } else {
        $(this._currentItem).transit({
          x: 0,
          duration: duration
        });
        if (this._touchDirection === "left") {
          $(this._nextItem).transit({
            x: width,
            duration: duration
          });
        } else {
          $(this._prevItem).transit({
            x: -1 * width,
            duration: duration
          });
        }
      }
      this._touchStart = false;
    };

    Stack.prototype.next = function() {
      var duration, stack, width;
      if (this._animating) {
        return;
      }
      this._animating = true;
      width = this._currentItem.clientWidth;
      stack = this;
      duration = this.constructor.duration;
      $fly(this._nextItem).css({
        transform: "translate(" + width + "px,0)",
        display: "block"
      });
      $(this._currentItem).transit({
        x: -1 * width,
        duration: duration * 2,
        complete: function() {
          stack._animating = false;
          $(stack._currentItem).css("display", "none");
          return stack._doNext();
        }
      });
      $(this._nextItem).transit({
        x: 0,
        duration: duration * 2
      });
      return this;
    };

    Stack.prototype.prev = function() {
      var duration, stack, width;
      if (this._animating) {
        return;
      }
      this._animating = true;
      width = this._currentItem.clientWidth;
      stack = this;
      duration = this.constructor.duration;
      $fly(this._prevItem).css({
        transform: "translate(-" + width + "px,0)",
        display: "block"
      });
      $(this._currentItem).transit({
        x: width,
        duration: duration * 2,
        complete: function() {
          $(stack._currentItem).css("display", "none");
          stack._animating = false;
          return stack._doPrev();
        }
      });
      $(this._prevItem).transit({
        x: 0,
        duration: duration * 2
      });
      return this;
    };

    Stack.prototype._doNext = function() {
      var currentItem, nextItem, prevItem;
      prevItem = this._prevItem;
      currentItem = this._currentItem;
      nextItem = this._nextItem;
      this._prevItem = currentItem;
      this._nextItem = prevItem;
      this._currentItem = nextItem;
      this.fire("change", this, {
        current: this._currentItem,
        prev: this._prevItem,
        next: this._nextItem
      });
      return null;
    };

    Stack.prototype._doPrev = function() {
      var currentItem, nextItem, prevItem;
      prevItem = this._prevItem;
      currentItem = this._currentItem;
      nextItem = this._nextItem;
      this._prevItem = nextItem;
      this._nextItem = currentItem;
      this._currentItem = prevItem;
      this.fire("change", this, {
        current: this._currentItem,
        prev: this._prevItem,
        next: this._nextItem
      });
      return null;
    };

    return Stack;

  })(cola.Widget);

  _getEntityId = cola.Entity._getEntityId;

  cola.ItemsView = (function(superClass) {
    extend(ItemsView, superClass);

    function ItemsView() {
      return ItemsView.__super__.constructor.apply(this, arguments);
    }

    ItemsView.ATTRIBUTES = {
      allowNoCurrent: {
        type: "boolean",
        defaultValue: true
      },
      currentItem: {
        getter: function() {
          var item;
          if (this._currentItemDom) {
            item = cola.util.userData(this._currentItemDom, "item");
          }
          return item;
        },
        setter: function(currentItem) {
          var currentItemDom;
          if (currentItem) {
            currentItemDom = this._itemDomMap[_getEntityId(currentItem)];
          }
          this._setCurrentItemDom(currentItemDom);
        }
      },
      highlightCurrentItem: {
        type: "boolean",
        defaultValue: true
      },
      autoLoadPage: {
        type: "boolean",
        defaultValue: true
      },
      changeCurrentitem: null,
      pullDown: {
        readOnlyAfterCreate: true
      },
      pullUp: {
        readOnlyAfterCreate: true
      },
      filterCriteria: {
        refreshItems: true
      }
    };

    ItemsView.EVENTS = {
      renderItem: null,
      itemClick: null,
      itemDoubleClick: null,
      itemPress: null,
      pullStart: null,
      pullStep: null,
      pullComplete: null,
      pullCancel: null,
      filterItem: {
        singleListener: true
      }
    };

    ItemsView.prototype._doSet = function(attr, attrConfig, value) {
      if (attrConfig != null ? attrConfig.refreshItems : void 0) {
        attrConfig.refreshDom = true;
        this._refreshItemsScheduled = true;
      }
      return ItemsView.__super__._doSet.call(this, attr, attrConfig, value);
    };

    ItemsView.prototype._createDom = function() {
      var dom;
      if (this._doms == null) {
        this._doms = {};
      }
      dom = $.xCreate({
        tagName: "div",
        content: {
          tagName: "ul",
          contextKey: "itemsWrapper"
        }
      }, this._doms);
      return dom;
    };

    ItemsView.prototype._parseDom = function(dom) {
      var child, itemsWrapper, next, nodeName;
      if (!dom) {
        return;
      }
      if (this._doms == null) {
        this._doms = {};
      }
      child = dom.firstChild;
      while (child) {
        next = child.nextSibling;
        nodeName = child.nodeName;
        if (!itemsWrapper && nodeName === "UL") {
          itemsWrapper = child;
        } else if (nodeName === "TEMPLATE") {
          this._regTemplate(child);
        } else {
          dom.removeChild(child);
        }
        child = next;
      }
      if (!itemsWrapper) {
        itemsWrapper = document.createElement("ul");
        dom.appendChild(itemsWrapper);
      }
      this._doms.itemsWrapper = itemsWrapper;
    };

    ItemsView.prototype._initDom = function(dom) {
      var $itemsWrapper;
      this._regDefaultTempaltes();
      if (this._templateContext == null) {
        this._templateContext = {};
      }
      $itemsWrapper = $fly(this._doms.itemsWrapper);
      $itemsWrapper.addClass("items").delegate(".item", "click", (function(_this) {
        return function(evt) {
          return _this._onItemClick(evt);
        };
      })(this)).delegate(".item", "dblclick", (function(_this) {
        return function(evt) {
          return _this._onItemDoubleClick(evt);
        };
      })(this));
      if (this._onItemsWrapperScroll) {
        $itemsWrapper.on("scroll", (function(_this) {
          return function(evt) {
            _this._onItemsWrapperScroll(evt);
            return true;
          };
        })(this));
      }
      this._$dom = $(dom);
    };

    ItemsView.prototype._onItemsWrapperScroll = function() {
      var itemsWrapper, realItems;
      realItems = this._realItems;
      if (this._autoLoadPage && !this._loadingNextPage && (realItems === this._realOriginItems || !this._realOriginItems)) {
        if (realItems instanceof cola.EntityList && (realItems.pageNo < realItems.pageCount || !realItems.pageCountDetermined)) {
          itemsWrapper = this._doms.itemsWrapper;
          if (itemsWrapper.scrollTop + itemsWrapper.clientHeight === itemsWrapper.scrollHeight) {
            this._loadingNextPage = true;
            realItems.loadPage(realItems.pageNo + 1, (function(_this) {
              return function() {
                _this._loadingNextPage = false;
              };
            })(this));
          }
        }
      }
    };

    ItemsView.prototype.getItems = function() {
      return this._realItems;
    };

    ItemsView.prototype._doRefreshDom = function() {
      if (!this._dom) {
        return;
      }
      ItemsView.__super__._doRefreshDom.call(this);
      if (this._refreshItemsScheduled) {
        delete this._refreshItemsScheduled;
        this._refreshItems();
      }
    };

    ItemsView.prototype._createNewItem = function(itemType, item) {
      var itemDom, template;
      template = this._getTemplate(itemType);
      if (template) {
        itemDom = this._cloneTemplate(template);
      } else {
        itemDom = document.createElement("li");
        itemDom.setAttribute("c-bind", "$default");
      }
      $fly(itemDom).addClass("item " + itemType);
      itemDom._itemType = itemType;
      return itemDom;
    };

    ItemsView.prototype._getItemType = function(item) {
      var ref;
      if (item != null ? item.isDataWrapper : void 0) {
        return ((ref = item._data) != null ? ref._itemType : void 0) || "default";
      } else {
        return item._itemType || "default";
      }
    };

    ItemsView.prototype._onItemsRefresh = function() {
      return this._refreshItems();
    };

    ItemsView.prototype._onItemInsert = function(arg) {
      var insertMode, item, itemDom, itemType, itemsWrapper, refDom, refEntityId;
      if (this._realItems === this._realOriginItems) {
        item = arg.entity;
        itemType = this._getItemType(item);
        itemsWrapper = this._doms.itemsWrapper;
        insertMode = arg.insertMode;
        if (!insertMode || insertMode === "end") {
          itemDom = this._createNewItem(itemType, item);
          this._refreshItemDom(itemDom, item);
          $fly(itemsWrapper).append(itemDom);
        } else if (insertMode === "begin") {
          itemDom = this._createNewItem(itemType, item);
          this._refreshItemDom(itemDom, item);
          $fly(itemsWrapper.firstChild).before(itemDom);
        } else if (this._itemDomMap) {
          refEntityId = _getEntityId(arg.refEntity);
          if (refEntityId) {
            refDom = this._itemDomMap[refEntityId] != null;
            if (refDom) {
              itemDom = this._createNewItem(itemType, item);
              this._refreshItemDom(itemDom, item);
              if (insertMode === "before") {
                $fly(refDom).before(itemDom);
              } else {
                $fly(refDom).after(itemDom);
              }
            }
          }
        }
      } else {
        this._refreshItems();
      }
    };

    ItemsView.prototype._onItemRemove = function(arg) {
      var itemDom, itemId;
      itemId = _getEntityId(arg.entity);
      if (itemId) {
        arg.itemsScope.unregItemScope(itemId);
        itemDom = this._itemDomMap[itemId];
        delete this._itemDomMap[itemId];
        if (itemDom) {
          $fly(itemDom).remove();
          if (itemDom === this._currentItemDom) {
            this._currentItemDom = null;
          }
        }
      }
    };

    ItemsView.prototype._setCurrentItemDom = function(currentItemDom) {
      if (this._currentItemDom) {
        $fly(this._currentItemDom).removeClass(cola.constants.COLLECTION_CURRENT_CLASS);
      }
      this._currentItemDom = currentItemDom;
      if (currentItemDom && this._highlightCurrentItem) {
        $fly(currentItemDom).addClass(cola.constants.COLLECTION_CURRENT_CLASS);
      }
    };

    ItemsView.prototype._onCurrentItemChange = function(arg) {
      var currentItemDom, itemId;
      if (arg.current && this._itemDomMap) {
        itemId = _getEntityId(arg.current);
        if (itemId) {
          currentItemDom = this._itemDomMap[itemId];
          if (!currentItemDom) {
            this._refreshItems();
            return;
          }
        }
      }
      this._setCurrentItemDom(currentItemDom);
    };

    ItemsView.prototype._convertItems = function(items) {
      var arg;
      if (this._filterCriteria) {
        if (this.getListeners("filterItem")) {
          arg = {
            filterCriteria: this._filterCriteria
          };
          items = cola.convertor.filter(items, (function(_this) {
            return function(item) {
              arg.item = item;
              return _this.fire("filterItem", _this, arg);
            };
          })(this));
        } else {
          items = cola.convertor.filter(items, this._filterCriteria);
        }
      }
      return items;
    };

    ItemsView.prototype._refreshItems = function() {
      if (!this._dom) {
        this._refreshItemsScheduled = true;
        return;
      }
      return this._doRefreshItems(this._doms.itemsWrapper);
    };

    ItemsView.prototype._doRefreshItems = function(itemsWrapper) {
      var counter, currentItem, currentPageNo, documentFragment, hasPullAction, itemDom, items, lastItem, limit, nextItemDom, pullDownPane, pullUpPane, ref, ret;
      if (this._itemDomMap == null) {
        this._itemDomMap = {};
      }
      ret = this._getItems();
      items = ret.items;
      this._realOriginItems = ret.originItems;
      if (this._convertItems && items) {
        items = this._convertItems(items);
      }
      this._realItems = items;
      if (items) {
        documentFragment = null;
        nextItemDom = itemsWrapper.firstChild;
        currentItem = items.current;
        if (this._currentItemDom) {
          if (!currentItem) {
            currentItem = cola.util.userData(this._currentItemDom, "item");
          }
          $fly(this._currentItemDom).removeClass(cola.constants.COLLECTION_CURRENT_CLASS);
          delete this._currentItemDom;
        }
        this._currentItem = currentItem;
        this._itemsScope.resetItemScopeMap();
        counter = 0;
        limit = 0;
        if (this._autoLoadPage && !this._realOriginItems && items instanceof cola.EntityList) {
          limit = items.pageNo;
        }
        lastItem = null;
        cola.each(items, (function(_this) {
          return function(item) {
            var _nextItemDom, itemDom, itemType, ref;
            if (limit) {
              if (items instanceof cola.EntityList) {
                if (((ref = item._page) != null ? ref.pageNo : void 0) > limit) {
                  return false;
                }
              } else {
                counter++;
                if (counter > limit) {
                  return false;
                }
              }
            }
            lastItem = item;
            itemType = _this._getItemType(item);
            if (nextItemDom) {
              while (nextItemDom) {
                if (nextItemDom._itemType === itemType) {
                  break;
                } else {
                  _nextItemDom = nextItemDom.nextSibling;
                  itemsWrapper.removeChild(nextItemDom);
                  nextItemDom = _nextItemDom;
                }
              }
              itemDom = nextItemDom;
              if (nextItemDom) {
                nextItemDom = nextItemDom.nextSibling;
              }
            } else {
              itemDom = null;
            }
            if (itemDom) {
              _this._refreshItemDom(itemDom, item);
            } else {
              itemDom = _this._createNewItem(itemType, item);
              _this._refreshItemDom(itemDom, item);
              if (documentFragment == null) {
                documentFragment = document.createDocumentFragment();
              }
              documentFragment.appendChild(itemDom);
            }
          };
        })(this));
        if (nextItemDom) {
          itemDom = nextItemDom;
          while (itemDom) {
            nextItemDom = itemDom.nextSibling;
            if ($fly(itemDom).hasClass("item")) {
              itemsWrapper.removeChild(itemDom);
              if (itemDom._itemId) {
                delete this._itemDomMap[itemDom._itemId];
              }
            }
            itemDom = nextItemDom;
          }
        }
        delete this._currentItem;
        if (this._currentItemDom && this._highlightCurrentItem) {
          $fly(this._currentItemDom).addClass(cola.constants.COLLECTION_CURRENT_CLASS);
        }
        if (documentFragment) {
          itemsWrapper.appendChild(documentFragment);
        }
        if (this._autoLoadPage && !this._loadingNextPage && (items === this._realOriginItems || !this._realOriginItems) && items instanceof cola.EntityList) {
          currentPageNo = lastItem != null ? (ref = lastItem._page) != null ? ref.pageNo : void 0 : void 0;
          if (currentPageNo && (currentPageNo < items.pageCount || !items.pageCountDetermined)) {
            if (itemsWrapper.scrollHeight && (itemsWrapper.scrollTop + itemsWrapper.clientHeight) < itemsWrapper.scrollHeight) {
              setTimeout(function() {
                items.loadPage(currentPageNo + 1, cola._EMPTY_FUNC);
              }, 0);
            }
          }
        }
      }
      if (this._pullAction === void 0) {
        this._pullAction = null;
        if (this._pullDown) {
          hasPullAction = true;
          pullDownPane = this._getTemplate("pull-down-pane");
          if (pullDownPane == null) {
            pullDownPane = $.xCreate({
              tagName: "div"
            });
          }
          this._doms.pullDownPane = pullDownPane;
        }
        if (this._pullUp) {
          hasPullAction = true;
          pullUpPane = this._getTemplate("pull-up-pane");
          if (pullUpPane == null) {
            pullUpPane = $.xCreate({
              tagName: "div"
            });
          }
          this._doms.pullUpPane = pullUpPane;
        }
        if (hasPullAction) {
          cola.util.delay(this, "createPullAction", 200, this._createPullAction);
        }
      }
    };

    ItemsView.prototype._refreshItemDom = function(itemDom, item, parentScope) {
      var alias, itemId, itemScope, oldScope, originItem;
      if (parentScope == null) {
        parentScope = this._itemsScope;
      }
      if (item === this._currentItem) {
        this._currentItemDom = itemDom;
      } else if (!this._currentItemDom && !this._allowNoCurrent) {
        this._currentItemDom = itemDom;
      }
      if (item != null ? item.isDataWrapper : void 0) {
        originItem = item;
        item = item._data;
      } else {
        originItem = item;
      }
      if (typeof item === "object") {
        itemId = _getEntityId(item);
      }
      alias = item._alias;
      if (!alias) {
        alias = originItem != null ? originItem._alias : void 0;
        if (alias == null) {
          alias = this._alias;
        }
      }
      this._templateContext.defaultPath = (typeof this._getDefaultBindPath === "function" ? this._getDefaultBindPath(originItem) : void 0) || alias;
      itemScope = cola.util.userData(itemDom, "scope");
      oldScope = cola.currentScope;
      try {
        if (!itemScope) {
          itemScope = new cola.ItemScope(parentScope, alias);
          cola.currentScope = itemScope;
          itemScope.data.setTargetData(item, true);
          cola.util.userData(itemDom, "scope", itemScope);
          cola.util.userData(itemDom, "item", originItem);
          if (typeof this._doRefreshItemDom === "function") {
            this._doRefreshItemDom(itemDom, item, itemScope);
          }
          cola.xRender(itemDom, itemScope, this._templateContext);
        } else {
          cola.currentScope = itemScope;
          if (itemScope.data.getTargetData() !== item) {
            if (itemDom._itemId) {
              delete this._itemDomMap[itemDom._itemId];
            }
            if (itemScope.data.alias !== alias) {
              throw new cola.Exception("Repeat alias mismatch. Expect \"" + itemScope.alias + "\" but \"" + alias + "\".");
            }
            cola.util.userData(itemDom, "item", originItem);
            itemScope.data.setTargetData(item);
          }
          if (typeof this._doRefreshItemDom === "function") {
            this._doRefreshItemDom(itemDom, item, itemScope);
          }
        }
        if (itemId) {
          parentScope.regItemScope(itemId, itemScope);
        }
        if (this.getListeners("renderItem")) {
          this.fire("renderItem", this, {
            item: originItem,
            dom: itemDom,
            scope: itemScope
          });
        }
      } finally {
        cola.currentScope = oldScope;
      }
      if (itemId) {
        itemDom._itemId = itemId;
        this._itemDomMap[itemId] = itemDom;
      }
      return itemScope;
    };

    ItemsView.prototype.refreshItem = function(item) {
      var itemDom, itemId;
      itemId = _getEntityId(item);
      itemDom = this._itemDomMap[itemId];
      if (itemDom) {
        if (typeof this._doRefreshItemDom === "function") {
          this._doRefreshItemDom(itemDom, item, this._itemsScope);
        }
      }
    };

    ItemsView.prototype._onItemRefresh = function(arg) {
      var item;
      item = arg.entity;
      if (typeof item === "object") {
        this.refreshItem(item);
      }
    };

    ItemsView.prototype._findItemDom = function(target) {
      var itemDom;
      while (target) {
        if (target._itemType) {
          itemDom = target;
          break;
        }
        target = target.parentNode;
      }
      return itemDom;
    };

    ItemsView.prototype._onItemClick = function(evt) {
      var item, itemDom;
      itemDom = evt.currentTarget;
      if (!itemDom) {
        return;
      }
      item = cola.util.userData(itemDom, "item");
      if (itemDom._itemType === "default") {
        if (item) {
          if (this._changeCurrentitem && item._parent instanceof cola.EntityList) {
            item._parent.setCurrent(item);
          } else {
            this._setCurrentItemDom(itemDom);
          }
        }
      }
      this.fire("itemClick", this, {
        event: evt,
        item: item,
        dom: itemDom
      });
    };

    ItemsView.prototype._onItemDoubleClick = function(evt) {
      var item, itemDom;
      itemDom = evt.currentTarget;
      if (!itemDom) {
        return;
      }
      item = cola.util.userData(itemDom, "item");
      this.fire("itemDoubleClick", this, {
        event: evt,
        item: item,
        dom: itemDom
      });
    };

    ItemsView.prototype._bindEvent = function(eventName) {
      if (eventName === "itemPress") {
        this._on("press", (function(_this) {
          return function(self, arg) {
            var itemDom;
            itemDom = _this._findItemDom(arg.event.target);
            if (itemDom) {
              arg.itemDom = itemDom;
              arg.item = cola.util.userData(itemDom, "item");
              _this.fire("itemPress", list, arg);
            }
          };
        })(this));
      } else {
        return ItemsView.__super__._bindEvent.call(this, eventName);
      }
    };

    ItemsView.prototype._createPullAction = function() {
      this._pullAction = new cola.PullAction(this._doms.itemsWrapper, {
        pullDownPane: this._doms.pullDownPane,
        pullUpPane: this._doms.pullUpPane,
        pullStart: (function(_this) {
          return function(evt, pullPane, pullState) {
            var collection;
            if (_this.getListeners("pullStart")) {
              return _this.fire("pullStart", _this, {
                event: evt,
                pullPane: pullPane,
                direction: pullState
              });
            } else if (pullState === "up" && !_this.getListeners("pullComplete")) {
              collection = _this._realItems;
              if (collection instanceof cola.EntityList) {
                return collection.pageNo < collection.pageCount;
              }
            }
          };
        })(this),
        pullStep: (function(_this) {
          return function(evt, pullPane, pullState, distance, theshold) {
            return _this.fire("pullStep", _this, {
              event: evt,
              pullPane: pullPane,
              direction: pullState,
              distance: distance,
              theshold: theshold
            });
          };
        })(this),
        pullComplete: (function(_this) {
          return function(evt, pullPane, pullState, done) {
            var collection;
            if (_this.getListeners("pullComplete")) {
              return _this.fire("pullComplete", _this, {
                event: evt,
                pullPane: pullPane,
                direction: pullState,
                done: done
              });
            } else {
              if (pullState === "down") {
                collection = _this._realOriginItems || _this._realItems;
                if (collection instanceof cola.EntityList) {
                  collection.flush(done);
                } else {
                  done();
                }
              } else if (pullState === "up") {
                collection = _this._realItems;
                if (collection instanceof cola.EntityList) {
                  collection.nextPage(done);
                } else {
                  done();
                }
              }
            }
          };
        })(this),
        pullCancel: (function(_this) {
          return function(evt, pullPane, pullState) {
            return _this.fire("pullCancel", _this, {
              event: evt,
              pullPane: pullPane,
              direction: pullState
            });
          };
        })(this)
      });
    };

    return ItemsView;

  })(cola.Widget);

  cola.Element.mixin(cola.ItemsView, cola.TemplateSupport);

  cola.Element.mixin(cola.ItemsView, cola.DataItemsWidgetMixin);

  SAFE_PULL_EFFECT = cola.os.android && !cola.browser.chrome;

  cola.PullAction = (function() {
    function PullAction(content1, options) {
      var k, pullDownPane, pullUpPane, v;
      this.content = content1;
      this.contentWrapper = this.content.parentNode;
      this.options = {
        resistance: 2.5,
        startTheshold: 10,
        pullTheshold: 0.4
      };
      for (k in options) {
        v = options[k];
        this.options[k] = v;
      }
      pullDownPane = this.options.pullDownPane;
      if (pullDownPane && typeof pullDownPane === "string") {
        pullDownPane = document.body.querySelector(pullDownPane);
      }
      if (pullDownPane) {
        this.pullDownPane = pullDownPane;
        if (this.content.previousSibling !== pullDownPane) {
          $fly(this.content).before(pullDownPane);
        }
        $fly(pullDownPane).addClass("pull-down-pane");
        this.pullDownDistance = pullDownPane.offsetHeight;
        this.contentWrapper.scrollTop = this.pullDownDistance;
      }
      pullUpPane = this.options.pullUpPane;
      if (pullUpPane && typeof pullUpPane === "string") {
        pullUpPane = document.body.querySelector(pullUpPane);
      }
      if (pullUpPane) {
        this.pullUpPane = pullUpPane;
        if (this.content.nextSibling !== pullUpPane) {
          $fly(this.content).after(pullUpPane);
        }
        $fly(pullUpPane).addClass("pull-up-pane");
        this.pullUpDistance = pullUpPane.offsetHeight;
      }
      $(this.content).on("touchstart", (function(_this) {
        return function(evt) {
          return _this._onTouchStart(evt);
        };
      })(this)).on("touchmove", (function(_this) {
        return function(evt) {
          return _this._onTouchMove(evt);
        };
      })(this)).on("touchend", (function(_this) {
        return function(evt) {
          return _this._onTouchEnd(evt);
        };
      })(this));
    }

    PullAction.prototype._getTouchPoint = function(evt) {
      var touches;
      touches = evt.originalEvent.touches;
      if (!touches.length) {
        touches = evt.originalEvent.changedTouches;
      }
      return touches[0];
    };

    PullAction.prototype._onTouchStart = function(evt) {
      var touchPoint;
      if (this._disabled) {
        this.pullState = null;
        this._watchingTouchMove = false;
      } else {
        this._scrollTop = this.content.scrollTop;
        if (this.options.pullDownPane && this._scrollTop <= 0) {
          this.pullState = "pre-down";
          this._watchingTouchMove = true;
        } else if (this.options.pullUpPane && (this._scrollTop + this.content.clientHeight) >= this.content.scrollHeight) {
          this.pullState = "pre-up";
          this._watchingTouchMove = true;
        } else {
          this.pullState = null;
          this._watchingTouchMove = false;
        }
      }
      this.pullReached = false;
      this._panStarted = 0;
      if (this._watchingTouchMove) {
        touchPoint = this._getTouchPoint(evt);
        this._touchStartX = touchPoint.pageX;
        this._touchStartY = touchPoint.pageY;
        if (cola.os.ios) {
          if (this._scrollTop < 0 || (this._scrollTop + this.content.clientHeight) > this.content.scrollHeight) {
            return false;
          }
        }
      }
    };

    PullAction.prototype._onTouchMove = function(evt) {
      var base, distanceX, distanceY, pullPane, retValue, startTheshold, touchPoint;
      if (!this._watchingTouchMove) {
        return;
      }
      touchPoint = this._getTouchPoint(evt);
      distanceX = touchPoint.pageX - this._touchStartX;
      distanceY = touchPoint.pageY - this._touchStartY;
      if (!this._panStarted) {
        if (Math.abs(distanceX) < 20 && (distanceY > 0 && this.pullState === "pre-down" || distanceY < 0 && this.pullState === "pre-up")) {
          startTheshold = this.options.startTheshold;
          if (distanceY > startTheshold && this.pullState === "pre-down") {
            this.pullState = "down";
          } else {
            distanceY < -startTheshold && (this.pullState === "pre-up" ? this.pullState = "up" : void 0);
          }
          if (this.pullState === "down" || this.pullState === "up") {
            this._panStarted = new Date();
            pullPane = this.pullState === "down" ? this.options.pullDownPane : this.options.pullUpPane;
            if ((typeof (base = this.options).pullStart === "function" ? base.pullStart(evt, pullPane, this.pullState) : void 0) === false) {
              this.pullState = null;
              this._watchingTouchMove = false;
              return;
            }
          }
          retValue = false;
        }
      }
      if (this._panStarted) {
        this._onPanMove(evt, Math.abs(distanceY));
      }
      if (retValue === false || this._panStarted) {
        evt.stopImmediatePropagation();
        return false;
      } else {

      }
    };

    PullAction.prototype._onPanMove = function(evt, distance) {
      var base, maxDistance, pullPane, pullTheshold, reached;
      distance = distance / this.options.resistance;
      this._distance = distance;
      if (this.pullState === "down") {
        maxDistance = this.pullDownDistance;
        pullTheshold = maxDistance * this.options.pullTheshold;
        reached = distance > pullTheshold;
        if (distance > maxDistance) {
          distance = maxDistance;
        }
        pullPane = this.options.pullDownPane;
        this.contentWrapper.scrollTop = maxDistance - distance;
      } else if (this.pullState === "up") {
        maxDistance = this.pullUpDistance;
        pullTheshold = maxDistance * this.options.pullTheshold;
        reached = distance > pullTheshold;
        if (distance > maxDistance) {
          distance = maxDistance;
        }
        pullPane = this.options.pullUpPane;
        this.contentWrapper.scrollTop = this.options.pullUpPane.offsetTop - this.contentWrapper.clientHeight + distance;
      }
      if (pullPane) {
        this.pullReached = reached;
        $fly(pullPane).toggleClass("reached", reached);
        if (typeof (base = this.options).pullStep === "function") {
          base.pullStep(evt, pullPane, this.pullState, distance, pullTheshold);
        }
      }
    };

    PullAction.prototype._onTouchEnd = function(evt) {
      var base, pullAction, pullPane, pullState, scrollTop;
      if (!this._panStarted) {
        return;
      }
      pullState = this.pullState;
      if (pullState === "down") {
        pullPane = this.options.pullDownPane;
      } else if (pullState === "up") {
        pullPane = this.options.pullUpPane;
      }
      if (!pullPane) {
        return;
      }
      this._disabled = true;
      $fly(pullPane).removeClass("reached");
      if (this.pullReached) {
        if (this.pullState === "down") {
          scrollTop = this.pullDownDistance * (1 - this.options.pullTheshold);
        } else {
          scrollTop = (this.options.pullUpPane.offsetTop - this.contentWrapper.clientHeight) + this.pullUpDistance * (1 - this.options.pullTheshold);
        }
        if (SAFE_PULL_EFFECT) {
          this.contentWrapper.scrollTop = scrollTop;
        } else {
          $fly(this.contentWrapper).animate({
            scrollTop: scrollTop
          }, {
            duration: 200
          });
        }
        $fly(pullPane).addClass("executing");
        pullAction = this;
        this._executePullAction(evt, pullState, function() {
          pullAction._hidePullPane(pullState);
        });
      } else {
        if (typeof (base = this.options).pullCancel === "function") {
          base.pullCancel(evt, pullPane, pullState);
        }
        this._hidePullPane(pullState);
      }
    };

    PullAction.prototype._executePullAction = function(evt, pullState, done) {
      var pullPane;
      if (this.options.pullComplete) {
        pullPane = this.pullState === "down" ? this.options.pullDownPane : this.options.pullUpPane;
        this.options.pullComplete(evt, pullPane, pullState, done);
      } else {
        done();
      }
    };

    PullAction.prototype._hidePullPane = function(pullState) {
      var contentWrapperStyle, pullAction, pullPane;
      if (pullState === "down") {
        pullPane = this.options.pullDownPane;
      } else if (pullState === "up") {
        pullPane = this.options.pullUpPane;
      }
      if (SAFE_PULL_EFFECT) {
        this.contentWrapper.scrollTop = this.pullDownDistance;
        this._disabled = false;
        $fly(pullPane).removeClass("executing");
      } else {
        pullAction = this;
        $(this.contentWrapper).animate({
          scrollTop: this.pullDownDistance
        }, {
          duration: 200,
          complete: function() {
            pullAction._disabled = false;
            $fly(pullPane).removeClass("executing");
          }
        });
      }
      if (cola.os.android && cola.browser.qqbrowser) {
        contentWrapperStyle = this.contentWrapper.style;
        if (contentWrapperStyle.marginTop) {
          contentWrapperStyle.marginTop = "";
        } else {
          contentWrapperStyle.marginTop = "0.001px";
        }
      }
    };

    return PullAction;

  })();

  SAFE_SLIDE_EFFECT = cola.os.android && !cola.browser.chrome;

  SLIDE_ANIMATION_SPEED = 200;

  LIST_SIZE_PREFIXS = ["small", "medium", "large", "xlarge", "xxlarge"];

  _createGroupArray = function() {
    var groups;
    groups = [];
    groups._grouped = true;
    return groups;
  };

  cola.ListView = (function(superClass) {
    extend(ListView, superClass);

    function ListView() {
      return ListView.__super__.constructor.apply(this, arguments);
    }

    ListView.CLASS_NAME = "items-view list-view";

    ListView.prototype._columnsChanged = true;

    ListView.ATTRIBUTES = {
      items: {
        expressionType: "repeat",
        refreshItems: true,
        setter: function(items) {
          if (this._items === items) {
            return;
          }
          this._set("bind", void 0);
          this._items = items;
        }
      },
      bind: {
        refreshItems: true,
        setter: function(bindStr) {
          this._set("items", void 0);
          return this._bindSetter(bindStr);
        }
      },
      textProperty: {
        refreshItems: true
      },
      columns: {
        refreshItems: true,
        defaultValue: "row",
        setter: function(columns) {
          this._columns = columns;
          this._columnsChanged = true;
        }
      },
      itemWidth: null,
      itemHeight: null,
      group: {
        refreshItems: true
      },
      groupCollapsible: {
        type: "boolean",
        defaultValue: true
      },
      indexBar: {
        refreshItems: true
      },
      itemSlide: {
        "enum": ["none", "left", "right", "both"],
        defaultValue: "none",
        setter: function(value) {
          var left, right;
          this._itemSlide = value;
          if (value) {
            if (value === "left") {
              left = true;
            } else if (value === "right") {
              right = true;
            } else {
              left = true;
              right = true;
            }
            this._leftItemSlide = left;
            return this._rightItemSlide = right;
          }
        }
      }
    };

    ListView.EVENTS = {
      getGroupString: null,
      itemSlideStart: null,
      itemSlideStep: null,
      itemSlideComplete: null,
      itemSlideCancel: null,
      itemSlidePaneInit: null,
      itemSlidePaneShow: null,
      itemSlidePaneHide: null
    };

    ListView.TEMPLATES = {
      "default": {
        tagName: "li",
        "c-bind": "$default"
      },
      "group": {
        tagName: "ul",
        content: {
          tagName: "ul"
        }
      },
      "group-header": {
        tagName: "li",
        "c-bind": "group.name"
      }
    };

    ListView.prototype.destroy = function() {
      ListView.__super__.destroy.call(this);
      delete this._topGroupDom;
      if (this._indexBarRelocateTimer) {
        clearInterval(this._indexBarRelocateTimer);
      }
      delete this._itemSlidePane;
      delete this._slideItemDom;
    };

    ListView.prototype._initDom = function(dom) {
      ListView.__super__._initDom.call(this, dom);
      $fly(this._doms.itemsWrapper).delegate(".group-header", "click", (function(_this) {
        return function(evt) {
          return _this._onGroupHeaderClick(evt);
        };
      })(this));
      cola.util.delay(this, "initItemSlide", 200, this._initItemSlide);
    };

    ListView.prototype._getItems = function() {
      if (this._items) {
        return this._items;
      } else {
        return ListView.__super__._getItems.call(this);
      }
    };

    ListView.prototype._groupItems = function(items) {
      var currentGroup, groups, hasGetGroupStringEvent, list;
      groups = _createGroupArray();
      currentGroup = null;
      hasGetGroupStringEvent = this.getListeners("getGroupString");
      list = this;
      cola.each(items, function(item) {
        var eventArg, groupProp, groupString;
        if (hasGetGroupStringEvent) {
          eventArg = {
            item: item,
            result: null
          };
          list.fire("getGroupString", list, eventArg);
          groupString = eventArg.result;
        } else {
          groupString = null;
          groupProp = list.group;
          if (groupProp && typeof groupProp === "string") {
            if (item instanceof cola.Entity) {
              groupString = item.get(groupProp);
            } else if (typeof item === "object") {
              groupString = item != null ? item[groupProp] : void 0;
            } else if (item) {
              groupString = item + "";
            }
          }
        }
        if (groupString === (currentGroup != null ? currentGroup.name : void 0)) {
          currentGroup.items.push(item);
        } else {
          if (currentGroup) {
            groups.push(currentGroup);
          }
          currentGroup = {
            _itemType: "group",
            _alias: "group",
            name: groupString || "#",
            items: [item]
          };
        }
      });
      if (currentGroup) {
        groups.push(currentGroup);
      }
      return groups;
    };

    ListView.prototype._convertItems = function(items) {
      items = ListView.__super__._convertItems.call(this, items);
      if (this._group && items) {
        items = this._groupItems(items);
      }
      return items;
    };

    ListView.prototype._doRefreshDom = function(dom) {
      var classNames, column, columns, i, itemsWrapper, l, len1;
      if (!this._dom) {
        return;
      }
      if (this._columnsChanged) {
        delete this._columnsChanged;
        classNames = ["items"];
        columns = this._columns || "row";
        columns = columns.split(" ");
        i = 0;
        for (l = 0, len1 = columns.length; l < len1; l++) {
          column = columns[l];
          if (column === "") {
            continue;
          }
          if (column === "row") {
            classNames.push(LIST_SIZE_PREFIXS[i] + "-row-list");
          } else {
            classNames.push(LIST_SIZE_PREFIXS[i] + "-block-grid-" + column);
          }
          i++;
          if (i >= LIST_SIZE_PREFIXS.length) {
            break;
          }
        }
        itemsWrapper = this._doms.itemsWrapper;
        if (this._group) {
          this._columnsClassNames = classNames;
          itemsWrapper.className = "items";
        } else {
          itemsWrapper.className = classNames.join(" ");
        }
      }
      ListView.__super__._doRefreshDom.call(this, dom);
      this._classNamePool.toggle("has-index-bar", !!this._indexBar);
    };

    ListView.prototype._refreshItems = function() {
      var dom, itemsWrapper, ref;
      ListView.__super__._refreshItems.call(this);
      if (this._dom) {
        if (!this._group) {
          if ((ref = this._doms.floatGroupHeaderWrapper) != null) {
            ref.style.display = "none";
          }
        }
        if (this._indexBar && this._group && this._realItems) {
          this._refreshIndexBar();
        } else if (this._doms.indexBar) {
          $fly(this._doms.indexBar).hide();
        }
        if (!cola.os.mobile && !this._indexBarRelocateTimer) {
          itemsWrapper = this._doms.itemsWrapper;
          dom = this._dom;
          this._indexBarRelocateTimer = setInterval(function() {
            $fly(dom).toggleClass("v-scroll", itemsWrapper.scrollHeight > itemsWrapper.clientHeight);
          }, 500);
        }
      }
    };

    ListView.prototype._getDefaultBindPath = function(item) {
      if (this._textProperty) {
        return (item._alias || this._alias) + "." + this._textProperty;
      }
    };

    ListView.prototype._createNewItem = function(itemType, item) {
      var $itemDom, itemDom, klass, template;
      template = this._getTemplate(itemType);
      if (template) {
        itemDom = this._cloneTemplate(template);
      } else {
        itemDom = document.createElement("li");
        itemDom.setAttribute("c-bind", "$default");
      }
      if (itemType === "group") {
        klass = "group";
      } else if (itemType === "group-header") {
        klass = "group-header";
        if (this._groupCollapsible) {
          klass += " collapsible";
        }
      } else {
        klass = "item " + itemType;
      }
      itemDom._itemType = itemType;
      $itemDom = $fly(itemDom);
      $itemDom.addClass(klass);
      if (this._itemWidth) {
        $itemDom.width(this._itemWidth);
      }
      if (this._itemHeight) {
        $itemDom.height(this._itemHeight);
      }
      return itemDom;
    };

    ListView.prototype._refreshItemDom = function(itemDom, item, parentScope) {
      if (itemDom._itemType === "group") {
        return this._refreshGroupDom(itemDom, item, parentScope);
      } else {
        return ListView.__super__._refreshItemDom.call(this, itemDom, item, parentScope);
      }
    };

    ListView.prototype._refreshGroupDom = function(groupDom, group, parentScope) {
      var currentItemDom, documentFragment, groupHeaderDom, groupId, groupScope, item, itemDom, itemType, itemsWrapper, l, len1, nextItemDom, oldGroup, ref;
      if (parentScope == null) {
        parentScope = this._itemsScope;
      }
      groupId = cola.Entity._getEntityId(group);
      groupScope = cola.util.userData(groupDom, "scope");
      if (!groupScope) {
        groupDom._itemScope = groupScope = new cola.ItemScope(parentScope, group._alias);
        parentScope.regItemScope(groupId, groupScope);
        groupScope.data.setTargetData(group, true);
        cola.util.userData(groupDom, "scope", groupScope);
        cola.util.userData(groupDom, "item", group);
      } else {
        oldGroup = cola.util.userData(groupDom, "item");
        if (oldGroup !== groupScope.data.getTargetData()) {
          if (groupDom._itemId) {
            delete groupDom._itemId;
          }
          groupScope.data.setTargetData(group);
          cola.util.userData(groupDom, "item", group);
        }
      }
      if (groupId) {
        groupDom._itemId = groupId;
        this._itemDomMap[groupId] = groupDom;
      } else {
        delete groupDom._itemId;
      }
      if (!groupDom._headerCreated) {
        groupDom._headerCreated = true;
        itemsWrapper = groupDom.firstChild;
        groupHeaderDom = this._createNewItem("group-header", group);
        this._templateContext.defaultPath = group._alias;
        cola.xRender(groupHeaderDom, groupScope, this._templateContext);
        groupDom.insertBefore(groupHeaderDom, itemsWrapper);
        cola.util.userData(groupHeaderDom, "item", group);
      } else {
        itemsWrapper = groupDom.lastChild;
      }
      documentFragment = null;
      currentItemDom = itemsWrapper.firstChild;
      ref = group.items;
      for (l = 0, len1 = ref.length; l < len1; l++) {
        item = ref[l];
        itemType = this._getItemType(item);
        itemDom = null;
        if (currentItemDom) {
          while (currentItemDom) {
            if (currentItemDom._itemType === itemType) {
              break;
            } else {
              nextItemDom = currentItemDom.nextSibling;
              groupDom.removeChild(currentItemDom);
              currentItemDom = nextItemDom;
            }
          }
          if (currentItemDom) {
            itemDom = currentItemDom;
            currentItemDom = currentItemDom.nextSibling;
          }
        }
        if (itemDom) {
          this._refreshItemDom(itemDom, item);
        } else {
          itemDom = this._createNewItem(itemType, item);
          this._refreshItemDom(itemDom, item);
          if (documentFragment == null) {
            documentFragment = document.createDocumentFragment();
          }
          documentFragment.appendChild(itemDom);
        }
      }
      if (currentItemDom) {
        itemDom = currentItemDom;
        while (itemDom) {
          nextItemDom = itemDom.nextSibling;
          itemsWrapper.removeChild(itemDom);
          if (itemDom._itemId) {
            delete this._itemDomMap[itemDom._itemId];
          }
          itemDom = nextItemDom;
        }
      }
      if (this._columnsClassNames) {
        itemsWrapper.className = this._columnsClassNames.join(" ");
      } else {
        itemsWrapper.className = "items";
      }
      if (documentFragment) {
        itemsWrapper.appendChild(documentFragment);
      }
    };

    ListView.prototype._onItemInsert = function(arg) {
      if (this._group) {
        this._refreshItems();
      } else {
        ListView.__super__._onItemInsert.call(this, arg);
      }
    };

    ListView.prototype._onItemRemove = function(arg) {
      if (this._group) {
        this._refreshItems();
      } else {
        ListView.__super__._onItemRemove.call(this, arg);
      }
    };

    ListView.prototype._onItemsWrapperScroll = function() {
      var floatGroupHeader, gap, group, nextOffsetTop, offset, ref, ref1, ref2, scrollTop, topGroupDom;
      ListView.__super__._onItemsWrapperScroll.call(this);
      if (!this._group) {
        return;
      }
      scrollTop = this._doms.itemsWrapper.scrollTop;
      if (scrollTop <= 0) {
        if ((ref = this._doms.floatGroupHeaderWrapper) != null) {
          ref.style.display = "none";
        }
        return;
      }
      topGroupDom = this._findTopGroupDom(scrollTop);
      if (topGroupDom) {
        if (topGroupDom.offsetTop === scrollTop) {
          if ((ref1 = this._doms.floatGroupHeaderWrapper) != null) {
            ref1.style.display = "none";
          }
          return;
        }
        group = cola.util.userData(topGroupDom, "item");
        floatGroupHeader = this._getFloatGroupHeader(group);
        gap = 1;
        nextOffsetTop = (ref2 = topGroupDom.nextSibling) != null ? ref2.offsetTop : void 0;
        if (nextOffsetTop > 0 && nextOffsetTop - scrollTop - gap < this._floatGroupHeaderHeight) {
          offset = this._floatGroupHeaderHeight - (nextOffsetTop - scrollTop - gap);
          floatGroupHeader.style.top = (this._floatGroupHeaderDefaultTop - offset) + "px";
          this._floatGroupHeaderMoved = true;
        } else if (this._floatGroupHeaderMoved) {
          floatGroupHeader.style.top = this._floatGroupHeaderDefaultTop + "px";
          delete this._floatGroupHeaderMoved;
        }
      }
    };

    ListView.prototype._getFloatGroupHeader = function(group) {
      var floatGroupHeader, floatGroupHeaderWrapper, groupScope, ref;
      floatGroupHeaderWrapper = this._doms.floatGroupHeaderWrapper;
      if (!floatGroupHeaderWrapper) {
        groupScope = new cola.ItemScope(this._itemsScope, group._alias);
        groupScope.data.setTargetData(group, true);
        floatGroupHeader = this._createNewItem("group-header", group);
        cola.util.userData(floatGroupHeader, "scope", groupScope);
        this._templateContext.defaultPath = group._alias;
        cola.xRender(floatGroupHeader, groupScope);
        floatGroupHeaderWrapper = $.xCreate({
          tagName: "ul",
          "class": "items float-group-header",
          content: floatGroupHeader
        });
        this._dom.appendChild(floatGroupHeaderWrapper);
        this._doms.floatGroupHeaderWrapper = floatGroupHeaderWrapper;
        this._floatGroupHeaderDefaultTop = ((ref = this._doms.pullDownPane) != null ? ref.offsetHeight : void 0) || 0;
        this._floatGroupHeaderHeight = floatGroupHeaderWrapper.offsetHeight;
        floatGroupHeaderWrapper.style.top = this._floatGroupHeaderDefaultTop + "px";
      } else {
        floatGroupHeader = floatGroupHeaderWrapper.firstChild;
        groupScope = cola.util.userData(floatGroupHeader, "scope");
        groupScope.data.setTargetData(group);
        if (floatGroupHeaderWrapper.style.display === "none") {
          floatGroupHeaderWrapper.style.display = "";
        }
      }
      return floatGroupHeaderWrapper;
    };

    ListView.prototype._findTopGroupDom = function(scrollTop) {
      var currentGroupDom, currentGroupDomTop, groupDom, groupDomOffsetTop, groups;
      groups = this._realItems;
      if (!(groups != null ? groups.length : void 0)) {
        return;
      }
      currentGroupDom = this._topGroupDom || this._doms.itemsWrapper.firstChild;
      currentGroupDomTop = currentGroupDom.offsetTop;
      if (currentGroupDomTop <= scrollTop) {
        groupDom = currentGroupDom.nextSibling;
        while (groupDom) {
          groupDomOffsetTop = groupDom.offsetTop;
          if (groupDomOffsetTop > scrollTop) {
            groupDom = groupDom.previousSibling;
            if (this._topGroupDom !== groupDom) {
              this._topGroupDom = groupDom;
            }
            break;
          }
          groupDom = groupDom.nextSibling;
        }
      } else {
        groupDom = currentGroupDom.previousSibling;
        while (groupDom) {
          groupDomOffsetTop = groupDom.offsetTop;
          if (groupDomOffsetTop <= scrollTop) {
            this._topGroupDom = groupDom;
            break;
          }
          groupDom = groupDom.previousSibling;
        }
      }
      return groupDom;
    };

    ListView.prototype._onGroupHeaderClick = function(evt) {
      var groupDom, item, itemDom;
      itemDom = evt.currentTarget;
      item = cola.util.userData(itemDom, "item");
      groupDom = itemDom.parentNode;
      if (!item._collapsed) {
        item._collapsed = true;
        $fly(itemDom).addClass("collapsed");
        $fly(groupDom).css("overflow", "hidden").animate({
          height: itemDom.offsetHeight
        }, {
          duration: 150,
          easing: "swing"
        });
      } else {
        item._collapsed = false;
        $fly(itemDom).removeClass("collapsed");
        $fly(groupDom).animate({
          height: groupDom.scrollHeight
        }, {
          duration: 150,
          easing: "swing",
          complete: function() {
            groupDom.style.height = "";
            groupDom.style.overflow = "";
          }
        });
      }
      return false;
    };

    ListView.prototype._createPullAction = function() {
      var indexBar;
      ListView.__super__._createPullAction.call(this);
      if (this._doms.indexBar) {
        indexBar = this._doms.indexBar;
        if (this._pullAction.pullDownDistance && $fly(indexBar).css("position") === "absolute") {
          indexBar.style.marginTop = this._pullAction.pullDownDistance + "px";
          indexBar.style.marginBottom = -this._pullAction.pullDownDistance + "px";
        }
      }
    };

    ListView.prototype._refreshIndexBar = function() {
      var clearCurrent, currentItemDom, documentFragment, goIndex, group, groups, i, indexBar, itemDom, l, len1, list, nextDom;
      list = this;
      indexBar = this._doms.indexBar;
      if (!indexBar) {
        goIndex = function(target, animate) {
          var currentIndexDom, group, groupDom, groupId, indexDom, itemsWrapper, timestamp;
          indexDom = target;
          while (indexDom && indexDom !== indexBar) {
            if (indexDom._groupIndex >= 0) {
              break;
            }
            indexDom = indexDom.parentNode;
          }
          if ((indexDom != null ? indexDom._groupIndex : void 0) >= 0) {
            timestamp = new Date();
            if (!list._currentIndex || list._currentIndex !== indexDom._groupIndex && timestamp - list._currentIndexTimestamp > 100) {
              list._currentIndex = indexDom._groupIndex;
              list._currentIndexTimestamp = timestamp;
              currentIndexDom = indexBar.querySelector(".current");
              if (currentIndexDom) {
                $fly(currentIndexDom).removeClass("current");
              }
              $fly(indexDom).addClass("current");
              group = list._realItems[indexDom._groupIndex];
              groupId = cola.Entity._getEntityId(group);
              if (groupId) {
                groupDom = list._itemDomMap[groupId];
                if (groupDom) {
                  itemsWrapper = list._doms.itemsWrapper;
                  if (animate) {
                    $(itemsWrapper).animate({
                      scrollTop: groupDom.offsetTop
                    }, {
                      duration: 150,
                      easing: "swing",
                      queue: true
                    });
                  } else {
                    itemsWrapper.scrollTop = groupDom.offsetTop;
                  }
                }
              }
            }
          }
        };
        clearCurrent = function() {
          setTimeout(function() {
            var currentIndexDom;
            currentIndexDom = indexBar.querySelector(".current");
            if (currentIndexDom) {
              $fly(currentIndexDom).removeClass("current");
            }
          }, 300);
        };
        this._doms.indexBar = indexBar = $.xCreate({
          tagName: "div",
          "class": "index-bar",
          mousedown: function(evt) {
            return goIndex(evt.target, true);
          },
          mouseup: clearCurrent,
          touchmove: function(evt) {
            var target, touch;
            touch = evt.originalEvent.touches[0];
            target = document.elementFromPoint(touch.pageX, touch.pageY);
            goIndex(target, true);
            return false;
          },
          touchend: clearCurrent
        });
        this._dom.appendChild(indexBar);
      } else {
        $fly(indexBar).show();
      }
      documentFragment = null;
      currentItemDom = indexBar.firstChild;
      groups = this._realItems;
      for (i = l = 0, len1 = groups.length; l < len1; i = ++l) {
        group = groups[i];
        if (currentItemDom) {
          itemDom = currentItemDom;
          currentItemDom = currentItemDom.nextSibling;
        } else {
          itemDom = $.xCreate({
            tagName: "div",
            "class": "index",
            content: "^span"
          });
          if (documentFragment == null) {
            documentFragment = document.createDocumentFragment();
          }
          documentFragment.appendChild(itemDom);
        }
        $fly(itemDom.firstChild).text(group.name);
        itemDom._groupIndex = i;
      }
      if (documentFragment) {
        indexBar.appendChild(documentFragment);
      } else {
        while (currentItemDom) {
          nextDom = currentItemDom.nextSibling;
          indexBar.removeChild(currentItemDom);
          currentItemDom = nextDom;
        }
      }
    };

    ListView.prototype._initItemSlide = function() {
      var itemScope, itemsWrapper, leftSlidePaneTemplate, list, rightSlidePaneTemplate;
      if (!(this._itemSlide && this._itemSlide !== "none")) {
        return;
      }
      itemsWrapper = this._doms.itemsWrapper;
      list = this;
      $fly(itemsWrapper).on("touchstart", function(evt) {
        return list._onItemsWrapperTouchStart(evt);
      }).on("touchmove", function(evt) {
        return list._onItemsWrapperTouchMove(evt);
      }).on("touchend", function(evt) {
        return list._onItemsWrapperTouchEnd(evt);
      });
      leftSlidePaneTemplate = this._getTemplate("slide-left-pane");
      rightSlidePaneTemplate = this._getTemplate("slide-right-pane");
      if (!(leftSlidePaneTemplate || rightSlidePaneTemplate)) {
        return;
      }
      itemScope = new cola.ItemScope(this._itemsScope, this._alias);
      this._templateContext.defaultPath = this._alias;
      if (this._leftItemSlide && leftSlidePaneTemplate) {
        $fly(leftSlidePaneTemplate).addClass("item-slide-pane").css("left", "100%");
        cola.xRender(leftSlidePaneTemplate, itemScope, this._templateContext);
        cola.util.userData(leftSlidePaneTemplate, "scope", itemScope);
        cola._ignoreNodeRemoved = true;
        itemsWrapper.appendChild(leftSlidePaneTemplate);
        cola._ignoreNodeRemoved = false;
      }
      if (this._rightItemSlide && rightSlidePaneTemplate) {
        $fly(rightSlidePaneTemplate).addClass("item-slide-pane").css("right", "100%");
        cola.xRender(rightSlidePaneTemplate, itemScope, this._templateContext);
        cola.util.userData(rightSlidePaneTemplate, "scope", itemScope);
        cola._ignoreNodeRemoved = true;
        itemsWrapper.appendChild(rightSlidePaneTemplate);
        cola._ignoreNodeRemoved = false;
      }
    };

    ListView.prototype._getTouchPoint = function(evt) {
      var touches;
      touches = evt.originalEvent.touches;
      if (!touches.length) {
        touches = evt.originalEvent.changedTouches;
      }
      return touches[0];
    };

    ListView.prototype._onTouchStart = function(evt) {
      var dom, inSlidPane, list, slidePane;
      if (!this._itemSlidePane) {
        return;
      }
      slidePane = this._itemSlidePane;
      dom = evt.target;
      while (dom) {
        if (dom === slidePane) {
          inSlidPane = true;
          break;
        }
        dom = dom.parentNode;
      }
      this._itemSlideState = "prevent";
      if (inSlidPane) {
        list = this;
        $fly(slidePane).one("touchend", function() {
          setTimeout(function() {
            list._hideItemSlidePane(true);
          }, 50);
        });
      } else {
        this._hideItemSlidePane(true);
        evt.stopImmediatePropagation();
        return false;
      }
    };

    ListView.prototype._onItemsWrapperTouchStart = function(evt) {
      var arg, item, itemDom, touch;
      this._start = new Date;
      if (!(this._itemSlide && (!this._itemSlideState || this._itemSlideState === "closed" || this._itemSlideState === "ignore"))) {
        return;
      }
      itemDom = this._findItemDom(evt.target);
      if (itemDom) {
        if (itemDom.offsetWidth < this._doms.itemsWrapper.clientWidth * 0.6) {
          return;
        }
        item = cola.util.userData(itemDom, "item");
      }
      if (!item) {
        return;
      }
      if (this.getListeners("itemSlideStart")) {
        arg = {
          event: evt,
          item: item
        };
        if (this.fire("itemSlideStart", this, arg) === false) {
          return;
        }
      } else {
        if (this._getItemType(item) === "group") {
          return;
        }
      }
      this._slideItemDom = itemDom;
      this._itemSlideState = null;
      touch = evt.originalEvent.touches[0];
      this._touchStartX = touch.pageX;
      this._touchStartY = touch.pageY;
      this._touchTimestamp = new Date();
    };

    ListView.prototype._onItemsWrapperTouchMove = function(evt) {
      var direction, distanceX, distanceY, factor, indexBar, item, itemDom, itemScope, oldSlidePane, slideDom, slidePane, timestamp, touchPoint, translate;
      if (!this._itemSlide) {
        return;
      }
      if (this._itemSlideState === "prevent") {
        evt.stopImmediatePropagation();
        return false;
      }
      if (!(!this._itemSlideState || this._itemSlideState === "slide")) {
        return;
      }
      touchPoint = this._getTouchPoint(evt);
      this._touchLastX = touchPoint.pageX;
      this._touchLastY = touchPoint.pageY;
      distanceX = this._touchLastX - this._touchStartX;
      distanceY = this._touchLastY - this._touchStartY;
      timestamp = new Date();
      itemDom = this._slideItemDom;
      if (!this._itemSlideState) {
        if (Math.abs(distanceX) > 5 && Math.abs(distanceX) > Math.abs(distanceY)) {
          this._itemSlideState = "slide";
          this._itemSlideDirection = null;
          if (cola.browser.chrome) {
            itemDom.style.opacity = 0.9999;
          }
        } else {
          this._itemSlideState = "ignore";
          return;
        }
      }
      this._touchMoveSpeed = distanceX / (timestamp - this._touchLastTimstamp);
      this._touchLastTimstamp = timestamp;
      if (distanceX < 0) {
        direction = "left";
        factor = -1;
      } else {
        direction = "right";
        factor = 1;
      }
      item = cola.util.userData(itemDom, "item");
      if (itemDom.firstChild && itemDom.firstChild === itemDom.lastChild) {
        slideDom = itemDom.firstChild;
      } else {
        slideDom = itemDom;
      }
      if (direction !== this._itemSlideDirection) {
        oldSlidePane = this._itemSlidePane;
        if (oldSlidePane) {
          $fly(oldSlidePane).hide();
          if (!SAFE_SLIDE_EFFECT) {
            $fly(oldSlidePane).css("transform", "");
          }
        }
        this._itemSlideDirection = direction;
        this._itemSlidePane = slidePane = this._getTemplate("slide-" + direction + "-pane");
        if (slidePane) {
          itemScope = cola.util.userData(slidePane, "scope");
          itemScope.data.setTargetData(item);
          if (this.getListeners("itemSlidePaneInit")) {
            this.fire("itemSlidePaneInit", this, {
              item: item,
              direction: direction,
              slidePane: slidePane
            });
          }
          if (direction === "left" && this._maxDistanceAdjust === void 0 && this._indexBar) {
            indexBar = this._doms.indexBar;
            if (indexBar) {
              this._maxDistanceAdjust = indexBar.offsetWidth + parseInt($fly(indexBar).css("right"));
            } else {
              this._maxDistanceAdjust = 0;
            }
          }
          $fly(slidePane).css({
            height: itemDom.offsetHeight,
            top: itemDom.offsetTop,
            "pointer-events": "none"
          }).show();
          this._maxSlideDistance = slidePane.offsetWidth;
          if (direction === "left") {
            this._maxSlideDistance += this._maxDistanceAdjust || 0;
          }
        } else {
          this._maxSlideDistance = itemDom.offsetWidth;
        }
      } else {
        slidePane = this._itemSlidePane;
      }
      if (slidePane) {
        if (Math.abs(distanceX) <= this._maxSlideDistance) {
          this._currentSlideDistance = distanceX;
        } else {
          this._currentSlideDistance = this._maxSlideDistance * factor;
        }
        if (!SAFE_SLIDE_EFFECT) {
          translate = "translate(" + this._currentSlideDistance + "px,0)";
          $fly(slideDom).css("transform", translate);
          $fly(slidePane).css("transform", translate);
        }
      }
      if (this.getListeners("itemSlideStep")) {
        this.fire("itemSlideStep", this, {
          event: evt,
          item: item,
          distance: distanceX,
          speed: this._touchMoveSpeed
        });
      }
      evt.stopImmediatePropagation();
      return false;
    };

    ListView.prototype._onItemsWrapperTouchEnd = function(evt) {
      var $slidePane, currentDistance, direction, factor, itemDom, maxDistance, openAnimate, opened, slideDom, slidePane;
      if (this._itemSlideState !== "slide") {
        return;
      }
      currentDistance = this._currentSlideDistance;
      if (currentDistance === 0) {
        return;
      }
      itemDom = this._slideItemDom;
      maxDistance = this._maxSlideDistance;
      opened = false;
      if (Math.abs(currentDistance) === maxDistance) {
        opened = true;
      } else if (Math.abs(currentDistance) / maxDistance > 0.5) {
        opened = true;
        openAnimate = true;
      } else if (Math.abs(this._touchMoveSpeed) > 5) {
        opened = true;
        openAnimate = true;
      }
      if (cola.browser.chrome) {
        itemDom.style.opacity = "";
      }
      if (opened) {
        this.fire("itemSlideComplete", this, {
          event: evt,
          item: cola.util.userData(itemDom, "item"),
          distance: this._currentSlideDistance,
          speed: this._touchMoveSpeed
        });
      } else {
        this.fire("itemSlideCancel", this, {
          event: evt,
          item: cola.util.userData(itemDom, "item")
        });
      }
      direction = this._itemSlideDirection;
      factor = direction === "left" ? -1 : 1;
      if (itemDom.firstChild && itemDom.firstChild === itemDom.lastChild) {
        slideDom = itemDom.firstChild;
      } else {
        slideDom = itemDom;
      }
      if (direction === "left") {
        if (!SAFE_SLIDE_EFFECT) {
          $(slideDom).transit({
            x: 0,
            duration: SLIDE_ANIMATION_SPEED * 2
          });
        }
      } else {
        $(slideDom).transit({
          x: maxDistance,
          duration: SLIDE_ANIMATION_SPEED
        });
      }
      if (opened) {
        slidePane = this._itemSlidePane;
        if (slidePane) {
          this.get$Dom().on("touchstart", (function(_this) {
            return function(evt) {
              return _this._onTouchStart(evt);
            };
          })(this));
          $slidePane = $(slidePane);
          this._currentSlideDistance = maxDistance * factor;
          if (openAnimate || SAFE_SLIDE_EFFECT) {
            $slidePane.show().transit({
              x: maxDistance * factor,
              duration: SLIDE_ANIMATION_SPEED,
              complete: (function(_this) {
                return function() {
                  $slidePane.css("pointer-events", "");
                  _this._onItemSlidePaneShow(direction, slidePane, itemDom);
                };
              })(this)
            });
          } else {
            this._onItemSlidePaneShow(direction, slidePane, itemDom);
          }
        } else {
          this._itemSlideState = "closed";
        }
      } else {
        this._hideItemSlidePane(false);
      }
    };

    ListView.prototype._hideItemSlidePane = function(opened) {
      var direction, itemDom, slideDom, slidePane;
      this._itemSlideState = "closing";
      itemDom = this._slideItemDom;
      slidePane = this._itemSlidePane;
      direction = this._itemSlideDirection;
      if (direction === "right") {
        if (itemDom.firstChild && itemDom.firstChild === itemDom.lastChild) {
          slideDom = itemDom.firstChild;
        } else {
          slideDom = itemDom;
        }
        $(slideDom).transit({
          x: 0,
          duration: SLIDE_ANIMATION_SPEED
        });
      }
      if (slidePane) {
        $(slidePane).transit({
          x: 0,
          duration: SLIDE_ANIMATION_SPEED,
          complete: (function(_this) {
            return function() {
              $fly(slidePane).hide();
              delete _this._itemSlidePane;
              _this._onItemSlidePaneHide(opened, direction, slidePane, itemDom);
            };
          })(this)
        });
      } else {
        this._onItemSlidePaneHide(opened, direction, slidePane, itemDom);
      }
    };

    ListView.prototype._onItemSlidePaneShow = function(direction, slidePane, itemDom) {
      this._itemSlideState = "waiting";
      this.fire("itemSlidePaneShow", this, {
        item: cola.util.userData(itemDom, "item"),
        direction: direction,
        slidePane: slidePane
      });
    };

    ListView.prototype._onItemSlidePaneHide = function(opened, direction, slidePane, itemDom) {
      this._itemSlideState = "closed";
      this._slideItemDom = null;
      $fly(this._dom).off("touchstart");
      if (opened) {
        this.fire("itemSlidePaneHide", this, {
          item: cola.util.userData(itemDom, "item"),
          direction: direction,
          slidePane: slidePane
        });
      }
    };

    return ListView;

  })(cola.ItemsView);

  _getEntityId = cola.Entity._getEntityId;

  cola.CascadeBind = (function(superClass) {
    extend(CascadeBind, superClass);

    CascadeBind.ATTRIBUTES = {
      name: null,
      expression: {
        setter: function(expression) {
          expression = cola._compileExpression(expression, "repeat");
          if (expression) {
            if (!expression.repeat) {
              throw new cola.Exception("\"" + bindStr + "\" is not a repeat expression.");
            }
          } else {
            delete this._alias;
          }
          this._expression = expression;
        }
      },
      recursive: null,
      child: {
        setter: function(child) {
          if (child && !(child instanceof cola.CascadeBind)) {
            child = new this.constructor(this._widget, child);
          }
          this._child = child;
        }
      },
      hasChildProperty: null
    };

    function CascadeBind(widget, config) {
      this._widget = widget;
      CascadeBind.__super__.constructor.call(this, config);
    }

    CascadeBind.prototype._wrapChildItems = function(parentNode, recursiveItems, originRecursiveItems, childItems, originChildItems) {
      var args, id, itemsScope, node, nodeCache, nodeMap, nodeType, nodes;
      nodes = [];
      nodeType = this.constructor.NODE_TYPE;
      nodeCache = parentNode._nodeMap;
      nodeMap = {};
      if (recursiveItems) {
        cola.each(recursiveItems, (function(_this) {
          return function(item) {
            var id, node;
            if (nodeCache) {
              id = _getEntityId(item);
              if (id) {
                node = nodeCache[id];
                if ((node != null ? node._bind : void 0) === _this) {
                  delete nodeCache[id];
                } else {
                  node = null;
                }
              }
            }
            if (node == null) {
              node = new nodeType(_this, item);
            }
            node._parent = parentNode;
            nodeMap[node._id] = node;
            nodes.push(node);
          };
        })(this));
      }
      if (childItems) {
        cola.each(childItems, (function(_this) {
          return function(item) {
            var id, node;
            if (nodeCache) {
              id = _getEntityId(item);
              if (id) {
                node = nodeCache[id];
                if ((node != null ? node._bind : void 0) === _this) {
                  delete nodeCache[id];
                } else {
                  node = null;
                }
              }
            }
            if (node == null) {
              node = new nodeType(_this._child, item);
            }
            node._parent = parentNode;
            node._scope = parentNode._scope;
            nodes.push(node);
          };
        })(this));
      }
      for (id in nodeCache) {
        node = nodeCache[id];
        node.destroy();
      }
      parentNode._nodeMap = nodeMap;
      parentNode._children = nodes;
      delete parentNode._hasChild;
      itemsScope = parentNode._itemsScope;
      if (itemsScope) {
        args = [nodes];
        if (recursiveItems) {
          args.push(originRecursiveItems || recursiveItems);
        }
        if (childItems) {
          args.push(originChildItems || childItems);
        }
        itemsScope._setItems.apply(itemsScope, args);
      }
    };

    CascadeBind.prototype.retrieveChildNodes = function(parentNode, callback, dataCtx) {
      var base, childItems, childLoader, funcs, hasChild, isRoot, items, originChildItems, originRecursiveItems, recursiveItems, recursiveLoader, ref, ref1;
      isRoot = !parentNode._parent;
      hasChild = false;
      funcs = [];
      if (this._recursive || isRoot) {
        if (dataCtx == null) {
          dataCtx = {};
        }
        items = this._expression.evaluate(parentNode._scope, "async", dataCtx);
        if (items === void 0 && dataCtx.unloaded) {
          recursiveLoader = (ref = dataCtx.providerInvokers) != null ? ref[0] : void 0;
          if (recursiveLoader) {
            funcs.push(function(callback) {
              return recursiveLoader.invokeAsync(callback);
            });
          }
        } else {
          recursiveItems = items;
          originRecursiveItems = dataCtx.originData;
          if (recursiveItems) {
            if (recursiveItems instanceof cola.EntityList) {
              hasChild = recursiveItems.entityCount > 0;
            } else {
              hasChild = recursiveItems.length > 0;
            }
          }
        }
      }
      if (this._child && !isRoot) {
        if (dataCtx == null) {
          dataCtx = {};
        }
        items = this._child._expression.evaluate(parentNode._scope, "async", dataCtx);
        if (items === void 0 && dataCtx.unloaded) {
          childLoader = (ref1 = dataCtx.providerInvokers) != null ? ref1[0] : void 0;
          if (childLoader) {
            funcs.push(function(callback) {
              return childLoader.invokeAsync(callback);
            });
          }
        } else {
          childItems = items;
          originChildItems = dataCtx.originData;
          hasChild = true;
        }
      }
      if (funcs.length && callback) {
        cola.util.waitForAll(funcs, {
          scope: this,
          complete: function(success, result) {
            var base;
            if (success) {
              hasChild = false;
              if (this._recursive || isRoot) {
                dataCtx = {};
                recursiveItems = this._expression.evaluate(parentNode._scope, "never", dataCtx);
                originRecursiveItems = dataCtx.originData;
                if (recursiveItems) {
                  if (recursiveItems instanceof cola.EntityList) {
                    hasChild = recursiveItems.entityCount > 0;
                  } else {
                    hasChild = recursiveItems.length > 0;
                  }
                }
              }
              if (this._child && !isRoot) {
                hasChild = true;
                dataCtx = {};
                childItems = this._child._expression.evaluate(parentNode._scope, "never", dataCtx);
                originChildItems = dataCtx.originData;
              }
              if (hasChild) {
                this._wrapChildItems(parentNode, recursiveItems, originRecursiveItems, childItems, originChildItems);
              } else {
                parentNode._hasChild = false;
              }
              if (typeof (base = parentNode._itemsScope).onItemsRefresh === "function") {
                base.onItemsRefresh();
              }
              cola.callback(callback, true);
            } else {
              cola.callback(callback, false, result);
            }
          }
        });
      } else {
        if (hasChild) {
          this._wrapChildItems(parentNode, recursiveItems, originRecursiveItems, childItems, originChildItems);
        } else {
          parentNode._hasChild = false;
        }
        if (typeof (base = parentNode._itemsScope).onItemsRefresh === "function") {
          base.onItemsRefresh();
        }
        if (callback) {
          cola.callback(callback, true);
        }
      }
    };

    CascadeBind.prototype.hasChildItems = function(parentScope) {
      var dataCtx, hasChild, items;
      if (this._recursive) {
        dataCtx = {};
        items = this._expression.evaluate(parentScope, "never", dataCtx);
        if (!dataCtx.unloaded) {
          if (items) {
            if (items instanceof cola.EntityList) {
              hasChild = items.entityCount > 0;
            } else {
              hasChild = items.length > 0;
            }
            if (hasChild) {
              return true;
            }
          }
        } else {
          return true;
        }
      }
      if (this._child) {
        dataCtx = {};
        items = this._child._expression.evaluate(parentScope, "never", dataCtx);
        if (!dataCtx.unloaded) {
          if (items) {
            if (items instanceof cola.EntityList) {
              hasChild = items.entityCount > 0;
            } else {
              hasChild = items.length > 0;
            }
            if (hasChild) {
              return true;
            }
          }
        } else {
          return true;
        }
      }
      return false;
    };

    return CascadeBind;

  })(cola.Element);

  cola.Node = (function(superClass) {
    extend(Node, superClass);

    Node.prototype.isDataWrapper = true;

    Node.ATTRIBUTES = {
      bind: {
        readOnly: true
      },
      alias: null,
      data: null,
      hasChild: {
        getter: function() {
          var bind, dataCtx, items, prop, ref;
          if (((ref = this._children) != null ? ref.length : void 0) > 0) {
            return true;
          }
          if (this._hasChild != null) {
            return this._hasChild;
          }
          bind = this._bind;
          prop = bind._hasChildProperty;
          if (prop && this._data) {
            if (this._data instanceof cola.Entity) {
              return this._data.get(prop, "never");
            } else {
              return this._data[prop];
            }
          }
          if (this._scope) {
            if (bind._recursive) {
              dataCtx = {};
              items = bind._expression.evaluate(this._scope, "never", dataCtx);
              if (dataCtx.unloaded) {
                return;
              }
              if (!items) {
                return false;
              }
            }
            if (bind._child) {
              dataCtx = {};
              items = bind._child._expression.evaluate(this._scope, "never", dataCtx);
              if (dataCtx.unloaded) {
                return;
              }
              if (!items) {
                return false;
              }
            }
          }
        }
      },
      parent: {
        readOnly: true
      },
      children: {
        readOnly: true
      }
    };

    function Node(bind, data) {
      var ref, ref1;
      Node.__super__.constructor.call(this);
      this._bind = bind;
      this._alias = (ref = bind._expression) != null ? ref.alias : void 0;
      this._widget = bind._widget;
      this._data = data;
      if (typeof data === "object") {
        this._id = cola.Entity._getEntityId(data);
      } else {
        this._id = cola.uniqueId();
      }
      if ((ref1 = this._widget) != null) {
        if (typeof ref1._onNodeAttach === "function") {
          ref1._onNodeAttach(this);
        }
      }
    }

    Node.prototype.destroy = function() {
      var child, l, len1, ref, ref1;
      if (this._children) {
        ref = this._children;
        for (l = 0, len1 = ref.length; l < len1; l++) {
          child = ref[l];
          child.destroy();
        }
      }
      if ((ref1 = this._widget) != null) {
        if (typeof ref1._onNodeDetach === "function") {
          ref1._onNodeDetach(this);
        }
      }
    };

    Node.prototype.remove = function() {
      var i, parent;
      if (this._parent) {
        parent = this._parent;
        i = parent._children.indexOf(this);
        if (i > -1) {
          parent._children.splice(i, 1);
        }
        delete parent._nodeMap[this._id];
      }
      this.destroy();
    };

    return Node;

  })(cola.Element);

  cola.TreeSupportMixin = {
    constructor: function() {
      return this._nodeMap = {};
    },
    _onNodeAttach: function(node) {
      this._nodeMap[node._id] = node;
    },
    _onNodeDetach: function(node) {
      delete this._nodeMap[node._id];
    }
  };

  NestedListNode = (function(superClass) {
    extend(NestedListNode, superClass);

    function NestedListNode() {
      return NestedListNode.__super__.constructor.apply(this, arguments);
    }

    NestedListNode.ATTRIBUTES = {
      title: {
        readOnly: true,
        getter: function() {
          var prop, title;
          prop = this._bind._titleProperty;
          if (prop) {
            if (this._data instanceof cola.Entity) {
              title = this._data.get(prop);
            } else {
              title = this._data[prop];
            }
          }
          return title || "#Unknown";
        }
      }
    };

    return NestedListNode;

  })(cola.Node);

  NestedListBind = (function(superClass) {
    extend(NestedListBind, superClass);

    function NestedListBind() {
      return NestedListBind.__super__.constructor.apply(this, arguments);
    }

    NestedListBind.NODE_TYPE = NestedListNode;

    NestedListBind.ATTRIBUTES = {
      titleProperty: null
    };

    return NestedListBind;

  })(cola.CascadeBind);

  cola.NestedList = (function(superClass) {
    extend(NestedList, superClass);

    function NestedList() {
      return NestedList.__super__.constructor.apply(this, arguments);
    }

    NestedList.CLASS_NAME = "nested-list";

    NestedList.ATTRIBUTES = {
      bind: {
        setter: function(bind) {
          if (bind && !(bind instanceof NestedListBind)) {
            bind = new NestedListBind(this, bind);
          }
          this._bind = bind;
          if (this._rootNode) {
            this._rootNode.set("bind", bind);
          }
        }
      },
      autoSplit: {
        type: "boolean",
        defaultValue: true
      },
      navBarWidth: {
        defaultValue: 280
      },
      showTitleBar: {
        type: "boolean",
        defaultValue: true
      },
      title: null,
      layerIndex: {
        readOnly: true,
        getter: function() {
          return this._layerIndex;
        }
      },
      splited: {
        readOnly: true,
        getter: function() {
          return this._autoSplit && this._largeScreen;
        }
      }
    };

    NestedList.EVENTS = {
      itemClick: null,
      renderItem: null,
      initLayer: null,
      topLayerChange: null
    };

    NestedList.prototype._initDom = function(dom) {
      var itemsScope, layer, nestedList;
      if (this._autoSplit) {
        if (cola.device.pad) {
          this._largeScreen = true;
        } else if (cola.device.desktop) {
          this._largeScreen = document.body.clientWidth > 480;
        }
      }
      if (this._doms == null) {
        this._doms = {};
      }
      layer = this._createLayer(0);
      this._layers = [layer];
      this._layerIndex = 0;
      this._initLayer(layer, null, 0);
      if (this._autoSplit && this._largeScreen) {
        $fly(dom).xAppend([
          {
            tagName: "div",
            "class": "nav",
            style: "width:" + this._navBarWidth + "px;float:left;height:100%;overflow:hidden",
            content: layer.container
          }, {
            tagName: "div",
            "class": "detail",
            style: "margin-left:" + this._navBarWidth + "px;height:100%;position:relative;overflow:hidden",
            contextKey: "detailContainer"
          }
        ], this._doms);
      } else {
        this._doms.detailContainer = dom;
        layer.container.appendTo(dom);
      }
      itemsScope = layer.list._itemsScope;
      this._rootNode = new NestedListNode(this._bind);
      this._rootNode._scope = this._scope;
      this._rootNode._itemsScope = itemsScope;
      if (this._bind) {
        this._itemsRetrieved = true;
        nestedList = this;
        this._bind.retrieveChildNodes(nestedList._rootNode, function() {
          var children, firstNode;
          if (nestedList._autoSplit && nestedList._largeScreen) {
            children = nestedList._rootNode._children;
            firstNode = children != null ? children[0] : void 0;
            if (firstNode != null ? firstNode._scope : void 0) {
              nestedList._showLayer(1, children != null ? children[0] : void 0);
            }
          }
        });
        itemsScope._retrieveItems = function(dataCtx) {
          return nestedList._bind.retrieveChildNodes(nestedList._rootNode, null, dataCtx);
        };
      }
      this.fire("topLayerChange", this, {
        index: 0,
        list: layer
      });
    };

    NestedList.prototype._parseDom = function(dom) {
      var child;
      if (!dom) {
        return;
      }
      child = dom.firstChild;
      while (child) {
        if (child.nodeName === "TEMPLATE") {
          this._regTemplate(child);
        }
        child = child.nextSibling;
      }
    };

    NestedList.prototype._createLayer = function(index) {
      var container, ctx, highlightCurrentItem, hjson, layer, list, listConfig, menuItemsConfig, name, oldRefreshItemDom, ref, template, useLayer;
      highlightCurrentItem = this._autoSplit && this._largeScreen && index === 0;
      useLayer = index > (this._autoSplit && this._largeScreen ? 1 : 0);
      hjson = {
        tagName: "div",
        style: {
          height: "100%"
        },
        contextKey: "container",
        "c-widget": useLayer ? "layer" : "widget",
        content: {
          tagName: "div",
          "class": "v-box",
          style: {
            height: "100%"
          }
        }
      };
      listConfig = {
        $type: "listView",
        "class": this._ui,
        highlightCurrentitem: true,
        allowNoCurrent: !highlightCurrentItem,
        highlightCurrentItem: highlightCurrentItem,
        width: "100%",
        height: "100%",
        userData: index,
        renderItem: (function(_this) {
          return function(self, arg) {
            return _this._onRenderItem(self, arg);
          };
        })(this),
        itemClick: (function(_this) {
          return function(self, arg) {
            return _this._onItemClick(self, arg);
          };
        })(this)
      };
      if (this._showTitleBar) {
        if (useLayer) {
          menuItemsConfig = [
            {
              icon: "chevron left",
              click: (function(_this) {
                return function() {
                  return _this.back();
                };
              })(this)
            }
          ];
        } else {
          menuItemsConfig = void 0;
        }
        hjson.content.content = [
          {
            tagName: "div",
            "class": "box",
            content: {
              tagName: "div",
              contextKey: "titleBar",
              "c-widget": {
                $type: "titleBar",
                "class": this._ui,
                items: menuItemsConfig
              }
            }
          }, {
            tagName: "div",
            "class": "flex-box",
            content: {
              tagName: "div",
              contextKey: "list",
              "c-widget": listConfig
            }
          }
        ];
      } else {
        hjson.content.content = {
          tagName: "div",
          contextKey: "list",
          "c-widget": listConfig
        };
      }
      ctx = {};
      new cola.xRender(hjson, this._scope, ctx);
      list = cola.widget(ctx.list);
      oldRefreshItemDom = list._refreshItemDom;
      list._refreshItemDom = function(itemDom, node, parentScope) {
        var itemScope;
        itemScope = oldRefreshItemDom.apply(this, arguments);
        node._scope = itemScope;
        return itemScope;
      };
      if (ctx.container) {
        container = cola.widget(ctx.container);
      } else {
        container = list;
      }
      if (this._templates) {
        ref = this._templates;
        for (name in ref) {
          template = ref[name];
          list._templates[name] = template;
        }
      }
      layer = {
        itemsScope: list._itemsScope,
        titleBar: cola.widget(ctx.titleBar),
        list: list,
        container: container
      };
      return layer;
    };

    NestedList.prototype._initLayer = function(layer, parentNode, index) {
      var ref;
      if ((ref = layer.titleBar) != null) {
        ref.set("title", parentNode ? parentNode.get("title") : this._title);
      }
      this.fire("initLayer", this, {
        parentNode: parentNode,
        parentItem: parentNode != null ? parentNode._data : void 0,
        index: index,
        list: layer.list,
        titleBar: layer.titleBar
      });
    };

    NestedList.prototype._showLayer = function(index, parentNode, callback) {
      var i, itemsScope, layer, list;
      if (index <= this._layerIndex) {
        i = index;
        while (i <= this._layerIndex) {
          this._hideLayer(i === this._layerIndex);
        }
        this._layerIndex = index - 1;
      }
      if (index >= this._layers.length) {
        layer = this._createLayer(index);
        this._layers.push(layer);
        layer.container.appendTo(this._doms.detailContainer);
      } else {
        layer = this._layers[index];
      }
      list = layer.list;
      itemsScope = list._itemsScope;
      itemsScope.setParent(parentNode._scope);
      parentNode._itemsScope = itemsScope;
      parentNode._bind.retrieveChildNodes(parentNode, (function(_this) {
        return function() {
          if (parentNode._children) {
            _this._initLayer(layer, parentNode, index);
            if (layer.container instanceof cola.Layer) {
              layer.container.show();
            }
            _this._layerIndex = index;
            layer.parentNode = parentNode;
            _this.fire("topLayerChange", _this, {
              parentNode: parentNode,
              parentItem: parentNode != null ? parentNode._data : void 0,
              index: index,
              list: layer.list
            });
          }
          if (typeof callback === "function") {
            callback(typeof wrapper !== "undefined" && wrapper !== null);
          }
        };
      })(this));
      itemsScope._retrieveItems = function(dataCtx) {
        return parentNode._bind.retrieveChildNodes(parentNode, null, dataCtx);
      };
    };

    NestedList.prototype._hideLayer = function(animation) {
      var layer, options, parentNode, previousLayer, ref;
      layer = this._layers[this._layerIndex];
      delete layer.list._itemsScope._retrieveItems;
      options = {};
      if (!animation) {
        options.animation = "none";
      }
      if (layer.container instanceof cola.Layer) {
        layer.container.hide(options, function() {
          var ref;
          if ((ref = layer.titleBar) != null) {
            ref.set("rightItems", null);
          }
        });
      } else {
        if ((ref = layer.titleBar) != null) {
          ref.set("rightItems", null);
        }
      }
      delete layer.parentNode;
      this._layerIndex--;
      previousLayer = this._layers[this._layerIndex];
      parentNode = previousLayer.parentNode;
      this.fire("topLayerChange", this, {
        parentNode: parentNode,
        parentItem: parentNode != null ? parentNode._data : void 0,
        index: previousLayer,
        list: previousLayer.list
      });
    };

    NestedList.prototype.back = function() {
      if (this._layerIndex > (this._autoSplit && this._largeScreen ? 1 : 0)) {
        this._hideLayer(true);
        return true;
      } else {
        return false;
      }
    };

    NestedList.prototype._onItemClick = function(self, arg) {
      var node, retValue;
      node = arg.item;
      retValue = this.fire("itemClick", this, {
        node: node,
        item: node._data,
        bind: node._bind
      });
      if (retValue !== false) {
        this._showLayer(self.get("userData") + 1, arg.item, (function(_this) {
          return function(hasChild) {
            if (!hasChild) {
              _this.fire("leafItemClick", _this, {
                node: node,
                item: node._data
              });
            }
          };
        })(this));
      }
    };

    NestedList.prototype._onRenderItem = function(self, arg) {
      var hasChild, node;
      node = arg.item;
      hasChild = node.get("hasChild");
      if ((hasChild == null) && node._scope) {
        hasChild = node._bind.hasChildItems(node._scope);
      }
      $fly(arg.dom).toggleClass("has-child", !!hasChild);
      if (this.getListeners("renderItem")) {
        this.fire("renderItem", this, {
          node: node,
          item: node._data,
          dom: arg.dom
        });
      }
    };

    return NestedList;

  })(cola.Widget);

  cola.Element.mixin(cola.NestedList, cola.TemplateSupport);

  TreeNode = (function(superClass) {
    extend(TreeNode, superClass);

    function TreeNode() {
      return TreeNode.__super__.constructor.apply(this, arguments);
    }

    TreeNode.ATTRIBUTES = {
      expanded: {
        getter: function() {
          var prop;
          if (this._expanded != null) {
            return this._expanded;
          }
          prop = this._bind._expandedProperty;
          if (prop && this._data) {
            if (this._data instanceof cola.Entity) {
              return this._data.get(prop, "never");
            } else {
              return this._data[prop];
            }
          }
        },
        setter: function(expanded) {
          this._expanded = expanded;
          if (expanded) {
            this._widget.expand(this);
          } else {
            this._widget.collapse(this);
          }
        }
      },
      hasExpanded: null,
      checked: {
        getter: function() {
          var prop;
          prop = this._bind._checkedProperty;
          if (prop && this._data) {
            if (this._data instanceof cola.Entity) {
              return this._data.get(prop, "never");
            } else {
              return this._data[prop];
            }
          }
        },
        setter: function(checked) {
          var prop;
          prop = this._bind._checkedProperty;
          if (prop && this._data) {
            if (this._data instanceof cola.Entity) {
              this._data.set(prop, checked);
            } else {
              this._data[prop] = checked;
            }
          }
        }
      }
    };

    return TreeNode;

  })(cola.Node);

  TreeNodeBind = (function(superClass) {
    extend(TreeNodeBind, superClass);

    function TreeNodeBind() {
      return TreeNodeBind.__super__.constructor.apply(this, arguments);
    }

    TreeNodeBind.NODE_TYPE = TreeNode;

    TreeNodeBind.ATTRIBUTES = {
      textProperty: null,
      expandedProperty: null,
      checkedProperty: null,
      autoCheckChildren: {
        defaultValue: true
      }
    };

    return TreeNodeBind;

  })(cola.CascadeBind);

  cola.Tree = (function(superClass) {
    extend(Tree, superClass);

    function Tree() {
      return Tree.__super__.constructor.apply(this, arguments);
    }

    Tree.CLASS_NAME = "items-view tree";

    Tree.ATTRIBUTES = {
      bind: {
        refreshItems: true,
        setter: function(bind) {
          if (bind && !(bind instanceof TreeNodeBind)) {
            bind = new TreeNodeBind(this, bind);
          }
          this._bind = bind;
          if (bind) {
            this._itemsScope.setExpression(bind._expression);
          }
        }
      },
      currentNode: {
        readOnly: true
      },
      currentItemAlias: {
        setter: function(alias) {
          var ref;
          if (this._currentItemAlias) {
            this._scope.set(this._currentItemAlias, null);
          }
          this._currentItemAlias = alias;
          if (alias) {
            this._scope.set(alias, (ref = this._currentNode) != null ? ref._data : void 0);
          }
        }
      }
    };

    Tree.EVENTS = {
      beforeCurrentNodeChange: null,
      currentNodeChange: null
    };

    Tree.TEMPLATES = {
      "default": {
        tagName: "ul",
        content: {
          tagName: "div",
          "class": "node",
          content: [
            {
              tagName: "div",
              "class": "expand-button"
            }
          ]
        }
      },
      "checkable": {
        tagName: "ul",
        content: {
          tagName: "div",
          "class": "node",
          content: [
            {
              tagName: "div",
              "class": "expand-button"
            }, {
              tagName: "div",
              "c-widget": {
                $type: "checkbox",
                "class": "node-checkbox",
                triState: true
              }
            }
          ]
        }
      },
      "node-normal": {
        tagName: "span",
        "c-bind": "$default"
      }
    };

    Tree.prototype._initDom = function(dom) {
      var itemsScope;
      Tree.__super__._initDom.call(this, dom);
      $fly(this._doms.itemsWrapper).delegate(".expand-button", "click", (function(_this) {
        return function(evt) {
          return _this._expandButtonClick(evt);
        };
      })(this));
      itemsScope = this._itemsScope;
      this._rootNode = new TreeNode(this._bind);
      this._rootNode._scope = this._scope;
      this._rootNode._itemsScope = itemsScope;
      if (this._bind) {
        this._itemsRetrieved = true;
        this._bind.retrieveChildNodes(this._rootNode);
        itemsScope._retrieveItems = (function(_this) {
          return function(dataCtx) {
            return _this._bind.retrieveChildNodes(_this._rootNode, null, dataCtx);
          };
        })(this);
      }
    };

    Tree.prototype._setCurrentNode = function(node) {
      var eventArg, itemDom;
      if (this._currentNode === node) {
        return;
      }
      eventArg = {
        oldCurrent: this._currentNode,
        newCurrent: node
      };
      if (this.fire("beforeCurrentNodeChange", this, eventArg) === false) {
        return;
      }
      if (this._currentNode) {
        itemDom = this._itemDomMap[this._currentNode._id];
        if (itemDom) {
          $fly(itemDom).removeClass("current");
        }
      }
      this._currentNode = node;
      if (node) {
        itemDom = this._itemDomMap[node._id];
        if (itemDom) {
          $fly(itemDom).addClass("current");
        }
      }
      this.fire("currentNodeChange", this, eventArg);
    };

    Tree.prototype._getItemType = function(node) {
      var itemType, ref;
      if (node != null ? node.isDataWrapper : void 0) {
        itemType = (ref = node._data) != null ? ref._itemType : void 0;
      } else {
        itemType = node._itemType;
      }
      if (!itemType && node._bind._checkedProperty) {
        itemType = "checkable";
      }
      return itemType || "default";
    };

    Tree.prototype._createNewItem = function(itemType, node) {
      var contentDom, itemDom, l, len1, nodeDom, span, templ, template;
      itemDom = Tree.__super__._createNewItem.call(this, itemType, node);
      nodeDom = itemDom.firstChild;
      if ((nodeDom != null ? nodeDom.className : void 0) === "node") {
        template = this._getTemplate("node-" + itemType, "node-normal");
        if (template) {
          if (template instanceof Array) {
            span = document.createElement("span");
            for (l = 0, len1 = template.length; l < len1; l++) {
              templ = template[l];
              span.appendChild(templ);
            }
            template = span;
            this._regTemplate("node-" + itemType, template);
          }
          contentDom = this._cloneTemplate(template);
          $fly(contentDom).addClass("node-content");
          nodeDom.appendChild(contentDom);
        }
      }
      if (!this._currentNode) {
        this._setCurrentNode(node);
      }
      return itemDom;
    };

    Tree.prototype._getDefaultBindPath = function(node) {
      var textProperty;
      textProperty = node._bind._textProperty;
      if (textProperty) {
        return node._alias + "." + textProperty;
      }
    };

    Tree.prototype._refreshItemDom = function(itemDom, node, parentScope) {
      var checkbox, checkboxDom, nodeDom, nodeScope, tree;
      nodeScope = Tree.__super__._refreshItemDom.call(this, itemDom, node, parentScope);
      node._scope = nodeScope;
      if (!itemDom._binded) {
        itemDom._binded = true;
        if (itemDom._itemType === "checkable") {
          checkboxDom = itemDom.querySelector(".node-checkbox");
          if (checkboxDom) {
            tree = this;
            checkbox = cola.widget(checkboxDom);
            checkbox.set({
              bind: nodeScope.data.alias + "." + node._bind._checkedProperty,
              click: function() {
                return tree._onCheckboxClick(node);
              }
            });
          }
        }
      }
      if (node.get("expanded")) {
        if (node._hasExpanded) {
          this._refreshChildNodes(itemDom, node);
        } else {
          this.expand(node);
        }
      } else {
        nodeDom = itemDom.firstChild;
        $fly(nodeDom).toggleClass("leaf", node.get("hasChild") === false);
      }
      if (node === this._currentNode) {
        $fly(itemDom).addClass("current");
      }
      return nodeScope;
    };

    Tree.prototype._refreshChildNodes = function(parentItemDom, parentNode, hidden) {
      var currentItemDom, documentFragment, itemDom, itemType, itemsScope, l, len1, nextItemDom, node, nodesWrapper, ref;
      nodesWrapper = parentItemDom.lastChild;
      if (!$fly(nodesWrapper).hasClass("child-nodes")) {
        nodesWrapper = $.xCreate({
          tagName: "ul",
          "class": "child-nodes",
          style: {
            display: hidden ? "hidden" : "",
            padding: 0,
            margin: 0,
            overflow: "hidden"
          }
        });
        parentItemDom.appendChild(nodesWrapper);
      }
      itemsScope = parentNode._itemsScope;
      itemsScope.resetItemScopeMap();
      documentFragment = null;
      currentItemDom = nodesWrapper.firstChild;
      if (parentNode._children) {
        ref = parentNode._children;
        for (l = 0, len1 = ref.length; l < len1; l++) {
          node = ref[l];
          itemType = this._getItemType(node);
          if (currentItemDom) {
            while (currentItemDom) {
              if (currentItemDom._itemType === itemType) {
                break;
              } else {
                nextItemDom = currentItemDom.nextSibling;
                nodesWrapper.removeChild(currentItemDom);
                currentItemDom = nextItemDom;
              }
            }
            itemDom = currentItemDom;
            if (currentItemDom) {
              currentItemDom = currentItemDom.nextSibling;
            }
          } else {
            itemDom = null;
          }
          if (itemDom) {
            this._refreshItemDom(itemDom, node, itemsScope);
          } else {
            itemDom = this._createNewItem(itemType, node);
            this._refreshItemDom(itemDom, node, itemsScope);
            if (documentFragment == null) {
              documentFragment = document.createDocumentFragment();
            }
            documentFragment.appendChild(itemDom);
          }
        }
      }
      if (currentItemDom) {
        itemDom = currentItemDom;
        while (itemDom) {
          nextItemDom = itemDom.nextSibling;
          if ($fly(itemDom).hasClass("item")) {
            nodesWrapper.removeChild(itemDom);
          }
          itemDom = nextItemDom;
        }
      }
      if (documentFragment) {
        nodesWrapper.appendChild(documentFragment);
      }
    };

    Tree.prototype._onItemClick = function(evt) {
      var itemDom, node;
      itemDom = evt.currentTarget;
      if (!itemDom) {
        return;
      }
      node = cola.util.userData(itemDom, "item");
      this._setCurrentNode(node);
      return Tree.__super__._onItemClick.call(this, evt);
    };

    Tree.prototype._expandButtonClick = function(evt) {
      var buttonDom, itemDom, node;
      buttonDom = evt.currentTarget;
      if (!buttonDom) {
        return;
      }
      itemDom = this._findItemDom(buttonDom);
      if (!itemDom) {
        return;
      }
      node = cola.util.userData(itemDom, "item");
      if (!node) {
        return;
      }
      node.set("expanded", !node.get("expanded"));
      evt.stopPropagation();
      return false;
    };

    Tree.prototype.expand = function(node) {
      var itemDom, itemsScope, nodeDom, tree;
      itemDom = this._itemDomMap[node._id];
      if (!itemDom) {
        return;
      }
      tree = this;
      itemsScope = node._itemsScope;
      if (!itemsScope) {
        node._itemsScope = itemsScope = new cola.ItemsScope(node._scope);
        itemsScope.alias = node._alias;
        itemsScope._retrieveItems = function(dataCtx) {
          return node._bind.retrieveChildNodes(node, null, dataCtx);
        };
        itemsScope.onItemsRefresh = function() {
          itemDom = tree._itemDomMap[node._id];
          if (itemDom) {
            tree._refreshChildNodes(itemDom, node);
          }
        };
        itemsScope.onItemInsert = function() {
          return this.onItemsRefresh();
        };
        itemsScope.onItemRemove = function(arg) {
          return tree._onItemRemove(arg);
        };
      }
      nodeDom = itemDom.firstChild;
      $fly(nodeDom).addClass("expanding");
      node._bind.retrieveChildNodes(node, function() {
        var $nodesWrapper;
        $fly(nodeDom).removeClass("expanding");
        if (node._children) {
          tree._refreshChildNodes(itemDom, node, true);
          $fly(nodeDom).addClass("expanded");
          $nodesWrapper = $fly(itemDom.lastChild);
          if ($nodesWrapper.hasClass("child-nodes")) {
            $nodesWrapper.slideDown(150);
          }
        } else {
          $fly(nodeDom).addClass("leaf");
        }
        node._hasExpanded = true;
      });
    };

    Tree.prototype.collapse = function(node) {
      var $nodesWrapper, itemDom, parent;
      itemDom = this._itemDomMap[node._id];
      if (!itemDom) {
        return;
      }
      if (this._currentNode) {
        parent = this._currentNode._parent;
        while (parent) {
          if (parent === node) {
            this._setCurrentNode(node);
            break;
          }
          parent = parent._parent;
        }
      }
      $fly(itemDom.firstChild).removeClass("expanded");
      $nodesWrapper = $fly(itemDom.lastChild);
      if ($nodesWrapper.hasClass("child-nodes")) {
        $nodesWrapper.slideUp(150);
      }
    };

    Tree.prototype._onItemRemove = function(arg) {
      var children, i, newCurrentNode, node, nodeId;
      nodeId = _getEntityId(arg.entity);
      node = this._nodeMap[nodeId];
      if (node) {
        if (this._currentNode === node) {
          children = node._parent._children;
          i = children.indexOf(node);
          if (i < children.length - 1) {
            newCurrentNode = children[i + 1];
          } else if (i > 0) {
            newCurrentNode = children[i - 1];
          } else if (node._parent !== this._rootNode) {
            newCurrentNode = node._parent;
          }
          if (newCurrentNode) {
            this._setCurrentNode(newCurrentNode);
          }
        }
        node.remove();
      }
      Tree.__super__._onItemRemove.call(this, arg);
    };

    Tree.prototype._onItemInsert = function() {
      this._refreshItems();
    };

    Tree.prototype._onCurrentItemChange = null;

    Tree.prototype._resetNodeAutoCheckedState = function(node) {
      var c, checkableCount, checkedCount, child, halfCheck, l, len1, ref;
      if (node._bind._checkedProperty && node._bind._autoCheckChildren) {
        if (!this._autoChecking) {
          this._autoCheckingParent = true;
        }
        if (this._autoCheckingParent) {
          this._autoCheckingChildren = false;
          checkedCount = 0;
          checkableCount = 0;
          halfCheck = false;
          ref = node._children;
          for (l = 0, len1 = ref.length; l < len1; l++) {
            child = ref[l];
            if (child._bind._checkedProperty) {
              checkableCount++;
              c = child.get("checked");
              if (c === true) {
                checkedCount++;
              } else if (c === null) {
                halfCheck = true;
              }
            }
          }
          if (checkableCount) {
            this._autoChecking = true;
            c = void 0;
            if (!halfCheck) {
              if (checkedCount === 0) {
                c = false;
              } else if (checkedCount === checkableCount) {
                c = true;
              }
            }
            node.set("checked", c);
            this._nodeCheckedChanged(node, false, true);
            this._autoChecking = false;
          }
        }
      }
    };

    Tree.prototype._nodeCheckedChanged = function(node, processChildren, processParent) {
      var checked, child, l, len1, oldChecked, ref;
      if (processChildren && node._children && node._bind._autoCheckChildren) {
        if (!this._autoChecking) {
          this._autoCheckingChildren = true;
        }
        if (this._autoCheckingChildren) {
          this._autoCheckingParent = false;
          this._autoChecking = true;
          checked = node.get("checked");
          ref = node._children;
          for (l = 0, len1 = ref.length; l < len1; l++) {
            child = ref[l];
            if (child._bind._checkedProperty) {
              oldChecked = child.get("checked");
              if (oldChecked !== checked) {
                child.set("checked", checked);
                this._nodeCheckedChanged(child, true, false);
              }
            }
          }
          this._autoChecking = false;
        }
      }
      if (processParent && node._parent) {
        this._resetNodeAutoCheckedState(node._parent);
      }
    };

    Tree.prototype._onCheckboxClick = function(node) {
      this._nodeCheckedChanged(node, true, true);
    };

    Tree.prototype.getCheckedNodes = function() {
      var child, l, len1, nodes, ref;
      nodes = [];
      ({
        collectCheckNodes: function(node) {
          var child, l, len1, ref;
          if (node._bind._checkedProperty && node.get("checked")) {
            nodes.push(node);
          }
          if (node._children) {
            ref = node._children;
            for (l = 0, len1 = ref.length; l < len1; l++) {
              child = ref[l];
              collectCheckNodes(child);
            }
          }
        }
      });
      if (this._rootNode) {
        ref = this._rootNode._children;
        for (l = 0, len1 = ref.length; l < len1; l++) {
          child = ref[l];
          collectCheckNodes(child);
        }
      }
      return nodes;
    };

    return Tree;

  })(cola.ItemsView);

  cola.Element.mixin(cola.Tree, cola.TreeSupportMixin);

  cola.registerTypeResolver("table.column", function(config) {
    var type;
    if (!(config && config.$type)) {
      return;
    }
    type = config.$type.toLowerCase();
    if (type === "select") {
      return SelectColumn;
    }
  });

  cola.registerTypeResolver("table.column", function(config) {
    var ref;
    if ((ref = config.columns) != null ? ref.length : void 0) {
      return GroupColumn;
    }
    return DataColumn;
  });

  Column = (function(superClass) {
    extend(Column, superClass);

    Column.ATTRIBUTES = {
      name: {
        reaonlyAfterCreate: true
      },
      caption: null,
      visible: {
        type: "boolean",
        defaultValue: true
      },
      headerTemplate: null
    };

    Column.EVENTS = {
      renderHeader: null
    };

    function Column(config) {
      Column.__super__.constructor.call(this, config);
      if (!this._name) {
        this._name = cola.uniqueId();
      }
    }

    Column.prototype._setTable = function(table) {
      if (this._table) {
        this._table._unregColumn(this);
      }
      this._table = table;
      if (table) {
        table._regColumn(this);
      }
    };

    return Column;

  })(cola.Element);

  GroupColumn = (function(superClass) {
    extend(GroupColumn, superClass);

    function GroupColumn() {
      return GroupColumn.__super__.constructor.apply(this, arguments);
    }

    GroupColumn.ATTRIBUTES = {
      columns: {
        setter: function(columnConfigs) {
          _columnsSetter.call(this, this._table, columnConfigs);
        }
      }
    };

    GroupColumn.prototype._setTable = function(table) {
      var column, l, len1, ref;
      GroupColumn.__super__._setTable.call(this, table);
      if (this._columns) {
        ref = this._columns;
        for (l = 0, len1 = ref.length; l < len1; l++) {
          column = ref[l];
          column._setTable(table);
        }
      }
    };

    return GroupColumn;

  })(Column);

  ContentColumn = (function(superClass) {
    extend(ContentColumn, superClass);

    function ContentColumn() {
      return ContentColumn.__super__.constructor.apply(this, arguments);
    }

    ContentColumn.ATTRIBUTES = {
      width: {
        defaultValue: 80
      },
      align: {
        "enum": ["left", "center", "right"]
      },
      valign: {
        "enum": ["top", "center", "bottom"]
      },
      footerTemplate: null
    };

    ContentColumn.EVENTS = {
      renderCell: null,
      renderFooter: null
    };

    return ContentColumn;

  })(Column);

  DataColumn = (function(superClass) {
    extend(DataColumn, superClass);

    function DataColumn() {
      return DataColumn.__super__.constructor.apply(this, arguments);
    }

    DataColumn.ATTRIBUTES = {
      dataType: {
        readOnlyAfterCreate: true,
        setter: cola.DataType.dataTypeSetter
      },
      bind: null,
      template: null
    };

    return DataColumn;

  })(ContentColumn);

  SelectColumn = (function(superClass) {
    extend(SelectColumn, superClass);

    function SelectColumn() {
      return SelectColumn.__super__.constructor.apply(this, arguments);
    }

    SelectColumn.ATTRIBUTES = {
      width: {
        defaultValue: "34px"
      },
      align: {
        defaultValue: "center"
      }
    };

    SelectColumn.prototype.renderHeader = function(dom, item) {
      var checkbox;
      if (!dom.firstChild) {
        this._headerCheckbox = checkbox = new cola.Checkbox({
          "class": "in-cell",
          triState: true,
          click: (function(_this) {
            return function(self) {
              _this.selectAll(self.get("checked"));
            };
          })(this)
        });
        checkbox.appendTo(dom);
      }
    };

    SelectColumn.prototype.renderCell = function(dom, item) {
      var checkbox;
      if (!dom.firstChild) {
        checkbox = new cola.Checkbox({
          "class": "in-cell",
          bind: this._table._alias + "." + this._table._selectedProperty,
          change: (function(_this) {
            return function() {
              if (!_this._ignoreCheckedChange) {
                _this.refreshHeaderCheckbox();
              }
            };
          })(this)
        });
        checkbox.appendTo(dom);
      }
    };

    SelectColumn.prototype.refreshHeaderCheckbox = function() {
      if (!this._headerCheckbox) {
        return;
      }
      cola.util.delay(this, "refreshHeaderCheckbox", 50, function() {
        var i, selected, selectedProperty, table;
        table = this._table;
        selectedProperty = table._selectedProperty;
        if (table._realItems) {
          i = 0;
          selected = void 0;
          cola.each(this._table._realItems, function(item) {
            var itemType, s;
            itemType = table._getItemType(item);
            if (itemType === "default") {
              i++;
              if (item instanceof cola.Entity) {
                s = item.get(selectedProperty);
              } else {
                s = item[selectedProperty];
              }
              if (i === 1) {
                selected = s;
              } else if (selected !== s) {
                selected = void 0;
                return false;
              }
            }
          });
          this._headerCheckbox.set("value", selected);
        }
      });
    };

    SelectColumn.prototype.selectAll = function(selected) {
      var selectedProperty, table;
      table = this._table;
      selectedProperty = table._selectedProperty;
      if (table._realItems) {
        this._ignoreCheckedChange = true;
        cola.each(this._table._realItems, function(item) {
          var itemType;
          itemType = table._getItemType(item);
          if (itemType === "default") {
            if (item instanceof cola.Entity) {
              item.set(selectedProperty, selected);
            } else {
              item[selectedProperty];
              table.refreshItem(item);
            }
          }
        });
        setTimeout((function(_this) {
          return function() {
            _this._ignoreCheckedChange = false;
          };
        })(this), 100);
      }
    };

    return SelectColumn;

  })(ContentColumn);

  _columnsSetter = function(table, columnConfigs) {
    var column, columnConfig, columns, l, len1, len2, n, ref;
    if (table != null ? table._columns : void 0) {
      ref = table._columns;
      for (l = 0, len1 = ref.length; l < len1; l++) {
        column = ref[l];
        column._setTable(null);
      }
    }
    columns = [];
    if (columnConfigs) {
      for (n = 0, len2 = columnConfigs.length; n < len2; n++) {
        columnConfig = columnConfigs[n];
        if (!columnConfig) {
          continue;
        }
        if (columnConfig instanceof Column) {
          column = columnConfig;
        } else {
          column = cola.create("table.column", columnConfig, Column);
        }
        column._setTable(table);
        columns.push(column);
      }
    }
    this._columns = columns;
  };

  cola.AbstractTable = (function(superClass) {
    extend(AbstractTable, superClass);

    AbstractTable.ATTRIBUTES = {
      items: {
        refreshItems: true,
        setter: function(items) {
          if (this._items === items) {
            return;
          }
          this._set("bind", void 0);
          this._items = items;
        }
      },
      bind: {
        setter: function(bindStr) {
          this._set("items", void 0);
          this._bindSetter(bindStr);
        }
      },
      columns: {
        setter: function(columnConfigs) {
          _columnsSetter.call(this, this, columnConfigs);
          this._collectionColumnsInfo();
        }
      },
      dataType: {
        setter: cola.DataType.dataTypeSetter
      },
      showHeader: {
        type: "boolean",
        defaultValue: true
      },
      showFooter: {
        type: "boolean"
      },
      columnStrecthable: {
        type: "boolean",
        defaultValue: true
      },
      selectedProperty: {
        defaultValue: "selected"
      }
    };

    AbstractTable.EVENTS = {
      renderRow: null,
      renderCell: null,
      renderHeader: null,
      renderFooter: null
    };

    AbstractTable.TEMPLATES = {
      "default": {
        tagName: "tr"
      },
      "checkbox-column": {
        tagName: "div",
        "c-widget": "checkbox;class:in-cell;bind:$default"
      },
      "input-column": {
        tagName: "div",
        "c-widget": "input;class:in-cell;bind:$default",
        style: {
          width: "100%"
        }
      },
      "group-header": {
        tagName: "tr",
        content: {
          tagName: "td",
          colSpan: 100
        }
      }
    };

    function AbstractTable(config) {
      this._columnMap = {};
      AbstractTable.__super__.constructor.call(this, config);
    }

    AbstractTable.prototype._regColumn = function(column) {
      if (column._name) {
        this._columnMap[column._name] = column;
      }
    };

    AbstractTable.prototype._unregColumn = function(column) {
      if (column._name) {
        delete this._columnMap[column._name];
      }
    };

    AbstractTable.prototype.getColumn = function(name) {
      return this._columnMap[name];
    };

    AbstractTable.prototype._collectionColumnsInfo = function() {
      var col, collectColumnInfo, columnsInfo, expression, l, len1, ref;
      collectColumnInfo = function(column, context, deepth) {
        var bind, col, cols, convertorIndex, info, l, len1, path, ref, ref1, width, widthType;
        info = {
          level: deepth,
          column: column
        };
        if (column instanceof GroupColumn) {
          if (column._columns) {
            info.columns = cols = [];
            ref = column._columns;
            for (l = 0, len1 = ref.length; l < len1; l++) {
              col = ref[l];
              if (!col._visible) {
                continue;
              }
              if (context.rows.length === deepth) {
                context.rows[deepth] = [];
              }
              cols.push(collectColumnInfo(col, context, deepth + 1));
            }
            if (cols.length) {
              if (context.rows.length === deepth) {
                context.rows[deepth] = [];
              }
              context.rows[deepth].push(info);
            }
          }
        } else {
          if (column._bind) {
            bind = column._bind;
            if (bind.charCodeAt(0) === 46) {
              convertorIndex = bind.indexOf("|");
              if (convertorIndex < 0) {
                info.property = bind.substring(1);
              } else {
                info.property = bind.substring(1, convertorIndex);
                info.expression = cola._compileExpression(context.alias + bind);
              }
            } else {
              info.expression = cola._compileExpression(bind);
              path = (ref1 = info.expression) != null ? ref1.path : void 0;
              if (path instanceof Array) {
                path = path[0];
              }
              if (path && path.indexOf("*") < 0) {
                info.property = path;
              }
            }
          }
          if (column._width) {
            width = column._width;
            if (typeof width === "string") {
              if (width.indexOf("px") > 0) {
                widthType = "px";
              } else if (width.indexOf("%") > 0) {
                widthType = "percent";
              }
            }
            info.widthType = widthType;
            info.width = parseInt(width, 10);
            if (!widthType && info.width) {
              context.totalWidth += info.width;
            }
          }
          info.index = context.dataColumns.length;
          context.dataColumns.push(info);
          if (column instanceof SelectColumn) {
            if (context.selectColumns == null) {
              context.selectColumns = [];
            }
            context.selectColumns.push(info);
          }
          if (context.rows.length === deepth) {
            context.rows[deepth] = [];
          }
          context.rows[deepth].push(info);
        }
        return info;
      };
      this._columnsInfo = columnsInfo = {
        totalWidth: 0,
        rows: [[]],
        dataColumns: [],
        alias: "item"
      };
      if (this._columns) {
        expression = this._itemsScope.expression;
        if (expression) {
          columnsInfo.alias = expression.alias;
        }
        ref = this._columns;
        for (l = 0, len1 = ref.length; l < len1; l++) {
          col = ref[l];
          if (!col._visible) {
            continue;
          }
          collectColumnInfo(col, columnsInfo, 0);
        }
      }
    };

    AbstractTable.prototype._getBindDataType = function() {
      var dataType, item, items;
      if (this._dataType) {
        return this._dataType;
      }
      items = this._getItems().originItems;
      if (items) {
        if (items instanceof cola.EntityList) {
          dataType = items.dataType;
        } else if (items instanceof Array && items.length) {
          item = items[0];
          if (item && item instanceof cola.Entity) {
            dataType = item.dataType;
          }
        }
      }
      return this._dataType = dataType;
    };

    AbstractTable.prototype._createDom = function() {
      var dom;
      dom = document.createElement("div");
      if (this._doms == null) {
        this._doms = {};
      }
      this._createInnerDom(dom);
      return dom;
    };

    AbstractTable.prototype._createInnerDom = function(dom) {
      $fly(dom).xAppend({
        tagName: "div",
        "class": "table-wrapper",
        contextKey: "itemsWrapper",
        content: {
          tagName: "table",
          contextKey: "table",
          content: [
            {
              tagName: "colgroup",
              contextKey: "colgroup",
              span: 100
            }, {
              tagName: "tbody",
              "class": "items",
              contextKey: "tbody"
            }
          ]
        }
      }, this._doms);
    };

    AbstractTable.prototype._parseDom = function(dom) {
      var child, next, nodeName;
      if (!dom) {
        return;
      }
      if (this._doms == null) {
        this._doms = {};
      }
      child = dom.firstChild;
      while (child) {
        next = child.nextSibling;
        nodeName = child.nodeName.toLowerCase();
        if (nodeName === "template") {
          this._regTemplate(child);
        } else {
          dom.removeChild(child);
        }
        child = next;
      }
      this._createInnerDom(dom);
    };

    return AbstractTable;

  })(cola.ItemsView);

  cola.Table = (function(superClass) {
    extend(Table, superClass);

    function Table() {
      return Table.__super__.constructor.apply(this, arguments);
    }

    Table.CLASS_NAME = "items-view widget-table";

    Table.prototype._initDom = function(dom) {
      Table.__super__._initDom.call(this, dom);
      $fly(window).resize((function(_this) {
        return function() {
          var fixedFooter, fixedHeader;
          if (_this._fixedHeaderVisible) {
            fixedHeader = _this._getFixedHeader();
            $fly(fixedHeader).width(_this._doms.itemsWrapper.clientWidth);
          }
          if (_this._fixedFooterVisible) {
            fixedFooter = _this._getFixedFooter();
            $fly(fixedFooter).width(_this._doms.itemsWrapper.clientWidth);
          }
        };
      })(this));
    };

    Table.prototype._doRefreshItems = function() {
      var col, colInfo, colgroup, column, i, l, len1, nextCol, ref, tbody, tfoot, thead;
      colgroup = this._doms.colgroup;
      nextCol = colgroup.firstChild;
      ref = this._columnsInfo.dataColumns;
      for (i = l = 0, len1 = ref.length; l < len1; i = ++l) {
        colInfo = ref[i];
        col = nextCol;
        if (!col) {
          col = document.createElement("col");
          colgroup.appendChild(col);
        } else {
          nextCol = col.nextSibling;
        }
        if (colInfo.widthType === "precent") {
          col.width = colInfo.width + "%";
        } else if (colInfo.widthType) {
          col.width = colInfo.width + colInfo.widthType;
        } else if (colInfo.width) {
          col.width = (colInfo.width * 100 / this._columnsInfo.totalWidth) + "%";
        } else {
          col.width = "";
        }
        column = colInfo.column;
        col.valign = column._valign || "";
      }
      col = nextCol;
      while (col) {
        nextCol = col.nextSibling;
        colgroup.removeChild(col);
        col = nextCol;
      }
      tbody = this._doms.tbody;
      if (this._showHeader) {
        thead = this._doms.thead;
        if (!thead) {
          $fly(tbody).xInsertBefore({
            tagName: "thead",
            contextKey: "thead"
          }, this._doms);
          thead = this._doms.thead;
        }
        this._refreshHeader(thead);
      }
      Table.__super__._doRefreshItems.call(this, tbody);
      if (this._showFooter) {
        tfoot = this._doms.tfoot;
        if (!tfoot) {
          $fly(tbody).xInsertAfter({
            tagName: "tfoot",
            contextKey: "tfoot"
          }, this._doms);
          tfoot = this._doms.tfoot;
        }
        this._refreshFooter(tfoot);
        if (!this._fixedFooterVisible) {
          this._showFooterTimer = setInterval((function(_this) {
            return function() {
              var itemsWrapper;
              itemsWrapper = _this._doms.itemsWrapper;
              if (itemsWrapper.scrollHeight) {
                _this._refreshFixedFooter(300);
              }
            };
          })(this), 300);
        }
      }
    };

    Table.prototype._onItemInsert = function(arg) {
      Table.__super__._onItemInsert.call(this, arg);
      if (this._columnsInfo.selectColumns) {
        cola.util.delay(this, "refreshHeaderCheckbox", 100, (function(_this) {
          return function() {
            var colInfo, l, len1, ref;
            ref = _this._columnsInfo.selectColumns;
            for (l = 0, len1 = ref.length; l < len1; l++) {
              colInfo = ref[l];
              colInfo.column.refreshHeaderCheckbox();
            }
          };
        })(this));
      }
    };

    Table.prototype._onItemRemove = function(arg) {
      Table.__super__._onItemRemove.call(this, arg);
      if (this._showFooter) {
        this._refreshFixedFooter();
      }
      if (this._columnsInfo.selectColumns) {
        cola.util.delay(this, "refreshHeaderCheckbox", 100, (function(_this) {
          return function() {
            var colInfo, l, len1, ref;
            ref = _this._columnsInfo.selectColumns;
            for (l = 0, len1 = ref.length; l < len1; l++) {
              colInfo = ref[l];
              colInfo.column.refreshHeaderCheckbox();
            }
          };
        })(this));
      }
    };

    Table.prototype._refreshHeader = function(thead) {
      var cell, colInfo, column, contentWrapper, fragment, i, isNew, j, l, len, len1, row, rowInfo, rowInfos;
      fragment = null;
      rowInfos = this._columnsInfo.rows;
      i = 0;
      len = rowInfos.length;
      while (i < len) {
        row = thead.rows[i];
        if (!row) {
          row = $.xCreate({
            tagName: "tr"
          });
          if (fragment == null) {
            fragment = document.createDocumentFragment();
          }
          fragment.appendChild(row);
        }
        rowInfo = rowInfos[i];
        for (j = l = 0, len1 = rowInfo.length; l < len1; j = ++l) {
          colInfo = rowInfo[j];
          column = colInfo.column;
          cell = row.cells[j];
          while (cell && cell._name !== column._name) {
            row.removeChild(cell);
            cell = row.cells[j];
          }
          if (!cell) {
            isNew = true;
            cell = $.xCreate({
              tagName: "th",
              content: {
                tagName: "div"
              }
            });
            cell._name = column._name;
            row.appendChild(cell);
          }
          cell._index = colInfo.index;
          if (colInfo.columns) {
            cell.rowSpan = 1;
            cell.colSpan = colInfo.columns.length;
          } else {
            cell.rowSpan = len - i;
            cell.colSpan = 1;
          }
          contentWrapper = cell.firstChild;
          this._refreshHeaderCell(contentWrapper, colInfo, isNew);
        }
        while (row.lastChild !== cell) {
          row.removeChild(row.lastChild);
        }
        i++;
      }
      while (row.lastChild !== cell) {
        row.removeChild(row.lastChild);
      }
      cola.xRender(row, this._scope);
      if (fragment) {
        thead.appendChild(fragment);
      }
      while (thead.lastChild !== row) {
        thead.removeChild(thead.lastChild);
      }
    };

    Table.prototype._refreshHeaderCell = function(dom, columnInfo, isNew) {
      var caption, column, dataType, propertyDef, template, templateName;
      column = columnInfo.column;
      if (column.renderHeader) {
        if (column.renderHeader(dom) !== true) {
          return;
        }
      }
      if (column.getListeners("renderHeader")) {
        if (column.fire("renderHeader", column, {
          dom: dom
        }) === false) {
          return;
        }
      }
      if (this.getListeners("renderHeader")) {
        if (this.fire("renderHeader", this, {
          column: column,
          dom: dom
        }) === false) {
          return;
        }
      }
      if (isNew) {
        template = column._realHeaderTemplate;
        if (template === void 0) {
          templateName = column._headerTemplate;
          if (templateName) {
            template = this._getTemplate(templateName);
          }
          column._realHeaderTemplate = template || null;
        }
        if (template) {
          template = this._cloneTemplate(template);
          dom.appendChild(template);
        }
      }
      if (column._realHeaderTemplate) {
        return;
      }
      dataType = this._getBindDataType();
      if (dataType && columnInfo.property) {
        propertyDef = dataType.getProperty(columnInfo.property);
      }
      caption = column._caption || (propertyDef != null ? propertyDef._caption : void 0);
      if (!caption) {
        caption = column._name;
        if ((caption != null ? caption.charCodeAt(0) : void 0) === 95) {
          caption = column._bind;
        }
      }
      dom.innerText = caption || "";
    };

    Table.prototype._refreshFooter = function(tfoot) {
      var cell, colInfo, colInfos, column, contentWrapper, i, isNew, l, len1, row;
      colInfos = this._columnsInfo.dataColumns;
      row = tfoot.rows[0];
      if (!row) {
        row = document.createElement("tr");
      }
      for (i = l = 0, len1 = colInfos.length; l < len1; i = ++l) {
        colInfo = colInfos[i];
        column = colInfo.column;
        cell = row.cells[i];
        while (cell && cell._name !== column._name) {
          row.removeChild(cell);
          cell = row.cells[i];
        }
        if (!cell) {
          isNew = true;
          cell = $.xCreate({
            tagName: "td",
            content: {
              tagName: "div"
            }
          });
          cell._name = column._name;
          row.appendChild(cell);
        }
        contentWrapper = cell.firstChild;
        this._refreshFooterCell(contentWrapper, colInfo, isNew);
      }
      while (row.lastChild !== cell) {
        row.removeChild(row.lastChild);
      }
      cola.xRender(row, this._scope);
      if (tfoot.rows.length < 1) {
        tfoot.appendChild(row);
      }
    };

    Table.prototype._refreshFooterCell = function(dom, columnInfo, isNew) {
      var column, template, templateName;
      column = columnInfo.column;
      if (column.renderFooter) {
        if (column.renderFooter(dom) !== true) {
          return;
        }
      }
      if (column.getListeners("renderFooter")) {
        if (column.fire("renderFooter", column, {
          dom: dom
        }) === false) {
          return;
        }
      }
      if (this.getListeners("renderFooter")) {
        if (this.fire("renderFooter", this, {
          column: column,
          dom: dom
        }) === false) {
          return;
        }
      }
      if (isNew) {
        template = column._realFooterTemplate;
        if (template === void 0) {
          templateName = column._footerTemplate;
          if (templateName) {
            template = this._getTemplate(templateName);
          }
          column._realFooterTemplate = template || null;
        }
        if (template) {
          template = this._cloneTemplate(template);
          dom.appendChild(template);
        }
      }
      if (column._realFooterTemplate) {
        return;
      }
      dom.innerHTML = "&nbsp;";
    };

    Table.prototype._doRefreshItemDom = function(itemDom, item, itemScope) {
      var cell, colInfo, colInfos, column, contentWrapper, i, isNew, itemType, l, len1;
      itemType = itemDom._itemType;
      if (this.getListeners("renderRow")) {
        if (this.fire("renderRow", this, {
          item: item,
          dom: itemDom
        }) === false) {
          return;
        }
      }
      if (itemType === "default") {
        colInfos = this._columnsInfo.dataColumns;
        for (i = l = 0, len1 = colInfos.length; l < len1; i = ++l) {
          colInfo = colInfos[i];
          column = colInfo.column;
          cell = itemDom.cells[i];
          while (cell && cell._name !== column._name) {
            itemDom.removeChild(cell);
            cell = itemDom.cells[i];
          }
          if (!cell) {
            isNew = true;
            cell = $.xCreate({
              tagName: "td",
              content: {
                tagName: "div"
              }
            });
            cell._name = column._name;
            itemDom.appendChild(cell);
          }
          contentWrapper = cell.firstChild;
          this._refreshCell(contentWrapper, item, colInfo, itemScope, isNew);
        }
        while (itemDom.lastChild !== cell) {
          itemDom.removeChild(itemDom.lastChild);
        }
      }
    };

    Table.prototype._refreshCell = function(dom, item, columnInfo, itemScope, isNew) {
      var $dom, column, context, template, templateName;
      column = columnInfo.column;
      dom.style.textAlign = column._align || "";
      if (column.renderCell) {
        if (column.renderCell(dom, item, itemScope) !== true) {
          return;
        }
      }
      if (column.getListeners("renderCell")) {
        if (column.fire("renderCell", column, {
          item: item,
          dom: dom,
          scope: itemScope
        }) === false) {
          return;
        }
      }
      if (this.getListeners("renderCell")) {
        if (this.fire("renderCell", this, {
          item: item,
          column: colInfo.column,
          dom: dom,
          scope: itemScope
        }) === false) {
          return;
        }
      }
      if (isNew) {
        template = column._realTemplate;
        if (template === void 0) {
          templateName = column._template;
          if (templateName) {
            template = this._getTemplate(templateName);
          }
          column._realTemplate = template || null;
        }
        if (template) {
          template = this._cloneTemplate(template);
          dom.appendChild(template);
          if (columnInfo.property) {
            context = {
              defaultPath: this._alias + "." + columnInfo.property
            };
          }
          cola.xRender(dom, itemScope, context);
        }
      }
      if (column._realTemplate) {
        return;
      }
      $dom = $fly(dom);
      if (columnInfo.expression) {
        $dom.attr("c-bind", columnInfo.expression.raw);
      } else {
        $dom.text(columnInfo.property ? item.get(columnInfo.property) : "");
      }
    };

    Table.prototype._refreshFakeRow = function(row) {
      var cell, colInfo, i, l, len1, nextCell, ref;
      nextCell = row.firstChild;
      ref = this._columnsInfo.dataColumns;
      for (i = l = 0, len1 = ref.length; l < len1; i = ++l) {
        colInfo = ref[i];
        cell = nextCell;
        if (!cell) {
          cell = $.xCreate({
            tagName: "td"
          });
          row.appendChild(cell);
        } else {
          nextCell = nextCell.nextSibling;
        }
      }
      while (nextCell) {
        cell = nextCell;
        nextCell = nextCell.nextSibling;
        row.removeChild(cell);
      }
    };

    Table.prototype._getFixedHeader = function(create) {
      var fakeThead, fixedHeaderWrapper;
      fixedHeaderWrapper = this._doms.fixedHeaderWrapper;
      if (!fixedHeaderWrapper && create) {
        fixedHeaderWrapper = $.xCreate({
          tagName: "div",
          contextKey: "fixedHeaderWrapper",
          "class": "fixed-header table-wrapper",
          content: {
            tagName: "table",
            contextKey: "fixedHeaderTable"
          }
        }, this._doms);
        this._dom.appendChild(fixedHeaderWrapper);
        this._doms.fakeThead = fakeThead = $.xCreate({
          tagName: "thead",
          content: {
            tagName: "tr"
          }
        });
        this._refreshFakeRow(fakeThead.firstChild);
        $fly(this._doms.tbody).before(fakeThead);
      }
      return fixedHeaderWrapper;
    };

    Table.prototype._getFixedFooter = function(create) {
      var fakeTfoot, fixedFooterWrapper;
      fixedFooterWrapper = this._doms.fixedFooterWrapper;
      if (!fixedFooterWrapper && create) {
        fixedFooterWrapper = $.xCreate({
          tagName: "div",
          contextKey: "fixedFooterWrapper",
          "class": "fixed-footer table-wrapper",
          content: {
            tagName: "table",
            contextKey: "fixedFooterTable"
          }
        }, this._doms);
        this._dom.appendChild(fixedFooterWrapper, this._doms);
        this._doms.fakeTfoot = fakeTfoot = $.xCreate({
          tagName: "tfoot",
          content: {
            tagName: "tr"
          }
        });
        this._refreshFakeRow(fakeTfoot.firstChild);
        $fly(this._doms.tbody).after(fakeTfoot);
      }
      return fixedFooterWrapper;
    };

    Table.prototype._refreshFixedColgroup = function(colgroup, fixedColgroup) {
      var col, fixedCol, nextCol, nextFixedCol;
      nextCol = colgroup.firstChild;
      nextFixedCol = fixedColgroup.firstChild;
      while (nextCol) {
        col = nextCol;
        nextCol = nextCol.nextSibling;
        fixedCol = nextFixedCol;
        if (!fixedCol) {
          fixedCol = document.createElement("col");
        } else {
          nextFixedCol = nextFixedCol.nextSibling;
        }
        fixedCol.width = col.width;
        fixedCol.valign = col.valign;
      }
      while (nextFixedCol) {
        fixedCol = nextFixedCol;
        nextFixedCol = nextFixedCol.nextSibling;
        fixedColgroup.removeChild(fixedCol);
      }
    };

    Table.prototype._setFixedHeaderSize = function() {
      var colgroup, fixedHeaderColgroup;
      colgroup = this._doms.colgroup;
      fixedHeaderColgroup = this._doms.fixedHeaderColgroup;
      if (!fixedHeaderColgroup) {
        this._doms.fixedHeaderColgroup = fixedHeaderColgroup = colgroup.cloneNode(true);
        this._doms.fixedHeaderTable.appendChild(fixedHeaderColgroup);
      } else {
        this._refreshFixedColgroup(colgroup, fixedHeaderColgroup);
      }
      $fly(this._doms.fakeThead.firstChild).height(this._doms.thead.offsetHeight);
    };

    Table.prototype._setFixedFooterSize = function() {
      var colgroup, fixedFooterColgroup;
      colgroup = this._doms.colgroup;
      fixedFooterColgroup = this._doms.fixedFooterColgroup;
      if (!fixedFooterColgroup) {
        this._doms.fixedFooterColgroup = fixedFooterColgroup = colgroup.cloneNode(true);
        this._doms.fixedFooterTable.appendChild(fixedFooterColgroup);
      } else {
        this._refreshFixedColgroup(colgroup, fixedFooterColgroup);
      }
      $fly(this._doms.fakeTfoot.firstChild).height(this._doms.tfoot.offsetHeight);
    };

    Table.prototype._refreshFixedHeader = function() {
      var fixedHeader, itemsWrapper, scrollTop, showFixedHeader;
      itemsWrapper = this._doms.itemsWrapper;
      scrollTop = itemsWrapper.scrollTop;
      showFixedHeader = scrollTop > 0;
      if (showFixedHeader === this._fixedHeaderVisible) {
        return;
      }
      this._fixedHeaderVisible = showFixedHeader;
      if (showFixedHeader) {
        fixedHeader = this._getFixedHeader(true);
        this._setFixedHeaderSize();
        $fly(this._doms.tbody).before(this._doms.fakeThead);
        this._doms.fixedHeaderTable.appendChild(this._doms.thead);
        $fly(fixedHeader).width(itemsWrapper.clientWidth).show();
      } else {
        fixedHeader = this._getFixedHeader();
        if (fixedHeader) {
          $fly(fixedHeader).hide();
          this._doms.fixedHeaderTable.appendChild(this._doms.fakeThead);
          $fly(this._doms.tbody).before(this._doms.thead);
        }
      }
    };

    Table.prototype._refreshFixedFooter = function(duration) {
      var $fixedFooter, fixedFooter, itemsWrapper, maxScrollTop, scrollTop, showFixedFooter;
      if (this._showFooterTimer) {
        clearInterval(this._showFooterTimer);
        delete this._showFooterTimer;
      }
      itemsWrapper = this._doms.itemsWrapper;
      scrollTop = itemsWrapper.scrollTop;
      maxScrollTop = itemsWrapper.scrollHeight - itemsWrapper.clientHeight;
      showFixedFooter = scrollTop < maxScrollTop;
      if (showFixedFooter === this._fixedFooterVisible) {
        return;
      }
      this._fixedFooterVisible = showFixedFooter;
      if (showFixedFooter) {
        fixedFooter = this._getFixedFooter(true);
        this._setFixedFooterSize();
        $fly(this._doms.tbody).after(this._doms.fakeTfoot);
        this._doms.fixedFooterTable.appendChild(this._doms.tfoot);
        $fixedFooter = $fly(fixedFooter).width(itemsWrapper.clientWidth);
        if (duration) {
          $fixedFooter.fadeIn(duration);
        } else {
          $fixedFooter.show();
        }
      } else {
        fixedFooter = this._getFixedFooter();
        if (fixedFooter) {
          $fly(fixedFooter).hide();
          this._doms.fixedFooterTable.appendChild(this._doms.fakeTfoot);
          $fly(this._doms.tbody).after(this._doms.tfoot);
        }
      }
    };

    Table.prototype._onItemsWrapperScroll = function() {
      if (this._showHeader) {
        this._refreshFixedHeader();
      }
      if (this._showFooter) {
        this._refreshFixedFooter();
      }
    };

    return Table;

  })(cola.AbstractTable);

}).call(this);

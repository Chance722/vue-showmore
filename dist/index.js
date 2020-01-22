'use strict';

//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
var script = {
  name: 'VueShowMore',
  props: {
    text: {
      type: String,
      default: ''
    },
    lines: {
      type: Number,
      default: 3
    },
    maxLines: {
      type: Number,
      default: 5
    },
    type: {
      type: String,
      default: 'expand'
    },
    animate: {
      type: Boolean,
      default: false
    },
    btns: {
      type: Array,
      default: function _default() {
        return ['...展开', '收起'];
      }
    },
    btnColor: {
      type: String,
      default: '#808080'
    }
  },
  data: function data() {
    return {
      isFold: false,
      htmlText: '',
      totalLines: 0,
      finalLines: 0,
      lineHeight: 0,
      totalHeight: 0
    };
  },
  computed: {
    isShowMore: function isShowMore() {
      if (this.totalLines <= this.lines || this.finalLines === this.totalLines) return false;
      return this.isFold || !this.isFold && this.type === 'toggle';
    }
  },
  watch: {
    text: function text() {
      this.init();
    }
  },
  mounted: function mounted() {
    this.init();
  },
  methods: {
    init: function init() {
      var _this = this;

      this.clearStatus();
      this.initText();
      this.$nextTick(function () {
        _this.computeLines();

        _this.setMaxHeight();
      });
    },
    clearStatus: function clearStatus() {
      this.$refs.vueShowMore.removeAttribute('style');
    },
    initText: function initText() {
      var htmlText = this.text.replace(/\r\n/g, '<br>').replace(/\n/g, '<br>');
      this.htmlText = this.replaceUselessBr(htmlText);
    },
    replaceUselessBr: function replaceUselessBr(str) {
      if (str.indexOf('<br>') === 0) {
        return this.replaceUselessBr(str.replace('<br>', ''));
      }

      return str;
    },
    computeLines: function computeLines() {
      var styles = window.getComputedStyle(this.$refs.vueShowMore, null);
      this.lineHeight = parseInt(styles.lineHeight, 10);
      this.totalHeight = parseInt(styles.height, 10);
      this.totalLines = Math.round(this.totalHeight / this.lineHeight);
    },
    setMaxHeight: function setMaxHeight() {
      if (this.totalLines < this.lines) return;
      var htmlArray = this.htmlText.split('<br>');
      this.finalLines = this.lines;

      if (htmlArray.length > 1) {
        var contentLines = 0;

        for (var i = 0; i < htmlArray.length; i++) {
          if (contentLines === this.lines) break;
          htmlArray[i] ? contentLines++ : this.finalLines++;
        }
      } // 控制最多行数


      var finalLines = this.finalLines <= this.maxLines ? this.finalLines : this.maxLines;
      this.$refs.vueShowMore.setAttribute('style', "max-height: ".concat(this.lineHeight * finalLines, "px"));
      this.isFold = true;
    },
    showHandler: function showHandler() {
      if (this.isFold) {
        this.$refs.vueShowMore.setAttribute('style', "max-height: ".concat(this.totalHeight, "px"));
        this.isFold = false;
      } else {
        this.$refs.vueShowMore.setAttribute('style', "max-height: ".concat(this.lineHeight * this.finalLines, "px"));
        this.isFold = true;
      }
    }
  }
};

function normalizeComponent(template, style, script, scopeId, isFunctionalTemplate, moduleIdentifier
/* server only */
, shadowMode, createInjector, createInjectorSSR, createInjectorShadow) {
  if (typeof shadowMode !== 'boolean') {
    createInjectorSSR = createInjector;
    createInjector = shadowMode;
    shadowMode = false;
  } // Vue.extend constructor export interop.


  var options = typeof script === 'function' ? script.options : script; // render functions

  if (template && template.render) {
    options.render = template.render;
    options.staticRenderFns = template.staticRenderFns;
    options._compiled = true; // functional template

    if (isFunctionalTemplate) {
      options.functional = true;
    }
  } // scopedId


  if (scopeId) {
    options._scopeId = scopeId;
  }

  var hook;

  if (moduleIdentifier) {
    // server build
    hook = function hook(context) {
      // 2.3 injection
      context = context || // cached call
      this.$vnode && this.$vnode.ssrContext || // stateful
      this.parent && this.parent.$vnode && this.parent.$vnode.ssrContext; // functional
      // 2.2 with runInNewContext: true

      if (!context && typeof __VUE_SSR_CONTEXT__ !== 'undefined') {
        context = __VUE_SSR_CONTEXT__;
      } // inject component styles


      if (style) {
        style.call(this, createInjectorSSR(context));
      } // register component module identifier for async chunk inference


      if (context && context._registeredComponents) {
        context._registeredComponents.add(moduleIdentifier);
      }
    }; // used by ssr in case component is cached and beforeCreate
    // never gets called


    options._ssrRegister = hook;
  } else if (style) {
    hook = shadowMode ? function () {
      style.call(this, createInjectorShadow(this.$root.$options.shadowRoot));
    } : function (context) {
      style.call(this, createInjector(context));
    };
  }

  if (hook) {
    if (options.functional) {
      // register for functional component in vue file
      var originalRender = options.render;

      options.render = function renderWithStyleInjection(h, context) {
        hook.call(context);
        return originalRender(h, context);
      };
    } else {
      // inject component registration as beforeCreate hook
      var existing = options.beforeCreate;
      options.beforeCreate = existing ? [].concat(existing, hook) : [hook];
    }
  }

  return script;
}

var normalizeComponent_1 = normalizeComponent;

var isOldIE = typeof navigator !== 'undefined' && /msie [6-9]\\b/.test(navigator.userAgent.toLowerCase());
function createInjector(context) {
  return function (id, style) {
    return addStyle(id, style);
  };
}
var HEAD;
var styles = {};

function addStyle(id, css) {
  var group = isOldIE ? css.media || 'default' : id;
  var style = styles[group] || (styles[group] = {
    ids: new Set(),
    styles: []
  });

  if (!style.ids.has(id)) {
    style.ids.add(id);
    var code = css.source;

    if (css.map) {
      // https://developer.chrome.com/devtools/docs/javascript-debugging
      // this makes source maps inside style tags work properly in Chrome
      code += '\n/*# sourceURL=' + css.map.sources[0] + ' */'; // http://stackoverflow.com/a/26603875

      code += '\n/*# sourceMappingURL=data:application/json;base64,' + btoa(unescape(encodeURIComponent(JSON.stringify(css.map)))) + ' */';
    }

    if (!style.element) {
      style.element = document.createElement('style');
      style.element.type = 'text/css';
      if (css.media) style.element.setAttribute('media', css.media);

      if (HEAD === undefined) {
        HEAD = document.head || document.getElementsByTagName('head')[0];
      }

      HEAD.appendChild(style.element);
    }

    if ('styleSheet' in style.element) {
      style.styles.push(code);
      style.element.styleSheet.cssText = style.styles.filter(Boolean).join('\n');
    } else {
      var index = style.ids.size - 1;
      var textNode = document.createTextNode(code);
      var nodes = style.element.childNodes;
      if (nodes[index]) style.element.removeChild(nodes[index]);
      if (nodes.length) style.element.insertBefore(textNode, nodes[index]);else style.element.appendChild(textNode);
    }
  }
}

var browser = createInjector;

/* script */
var __vue_script__ = script;
/* template */

var __vue_render__ = function __vue_render__() {
  var _vm = this;

  var _h = _vm.$createElement;

  var _c = _vm._self._c || _h;

  return _c("div", {
    ref: "vueShowMore",
    staticClass: "vue-showmore",
    class: {
      fold: _vm.isFold,
      animate: _vm.animate
    }
  }, [_vm._t("before"), _vm._v(" "), _c("span", {
    domProps: {
      innerHTML: _vm._s(_vm.htmlText)
    }
  }), _vm._v(" "), _vm.isShowMore ? _c("span", {
    staticClass: "showmore",
    style: {
      color: _vm.btnColor
    },
    on: {
      click: _vm.showHandler
    }
  }, [_vm._v(_vm._s(_vm.isFold ? _vm.btns[0] : _vm.btns[1]))]) : _vm._e()], 2);
};

var __vue_staticRenderFns__ = [];
__vue_render__._withStripped = true;
/* style */

var __vue_inject_styles__ = function __vue_inject_styles__(inject) {
  if (!inject) return;
  inject("data-v-c0afd650_0", {
    source: ".vue-showmore[data-v-c0afd650] {\n  position: relative;\n}\n.vue-showmore.animate[data-v-c0afd650] {\n  transition: all ease 0.3s;\n}\n.vue-showmore.fold[data-v-c0afd650] {\n  overflow: hidden;\n}\n.vue-showmore .showmore[data-v-c0afd650] {\n  position: absolute;\n  right: 0;\n  bottom: 0;\n  cursor: pointer;\n  background: #fff;\n  background: linear-gradient(to right, rgba(255, 255, 255, 0), #fff, 1em);\n}\n\n/*# sourceMappingURL=VueShowMore.vue.map */",
    map: {
      "version": 3,
      "sources": ["F:\\myWorkSpace\\github_projects\\vue-showmore\\src\\lib\\components\\VueShowMore.vue", "VueShowMore.vue"],
      "names": [],
      "mappings": "AAkIA;EACA,kBAAA;ACjIA;ADmIA;EACA,yBAAA;ACjIA;ADoIA;EACA,gBAAA;AClIA;ADqIA;EACA,kBAAA;EACA,QAAA;EACA,SAAA;EACA,eAAA;EACA,gBAAA;EACA,wEAAA;ACnIA;;AAEA,0CAA0C",
      "file": "VueShowMore.vue",
      "sourcesContent": ["<template>\r\n  <div\r\n    ref=\"vueShowMore\"\r\n    class=\"vue-showmore\"\r\n    :class=\"{'fold': isFold, 'animate': animate}\">\r\n    <slot name=\"before\" />\r\n    <span v-html=\"htmlText\" />\r\n    <span\r\n      v-if=\"isShowMore\"\r\n      class=\"showmore\"\r\n      :style=\"{'color': btnColor}\"\r\n      @click=\"showHandler\">{{ isFold ? btns[0] : btns[1] }}</span>\r\n  </div>\r\n</template>\r\n\r\n<script>\r\nexport default {\r\n  name: 'VueShowMore',\r\n  props: {\r\n    text: {\r\n      type: String,\r\n      default: '',\r\n    },\r\n    lines: {\r\n      type: Number,\r\n      default: 3,\r\n    },\r\n    maxLines: {\r\n      type: Number,\r\n      default: 5,\r\n    },\r\n    type: {\r\n      type: String,\r\n      default: 'expand',\r\n    },\r\n    animate: {\r\n      type: Boolean,\r\n      default: false,\r\n    },\r\n    btns: {\r\n      type: Array,\r\n      default: () => ['...展开', '收起'],\r\n    },\r\n    btnColor: {\r\n      type: String,\r\n      default: '#808080',\r\n    },\r\n  },\r\n  data () {\r\n    return {\r\n      isFold: false,\r\n      htmlText: '',\r\n      totalLines: 0,\r\n      finalLines: 0,\r\n      lineHeight: 0,\r\n      totalHeight: 0,\r\n    }\r\n  },\r\n  computed: {\r\n    isShowMore () {\r\n      if (this.totalLines <= this.lines || this.finalLines === this.totalLines) return false\r\n      return this.isFold || (!this.isFold && this.type === 'toggle')\r\n    },\r\n  },\r\n  watch: {\r\n    text () {\r\n      this.init()\r\n    },\r\n  },\r\n  mounted () {\r\n    this.init()\r\n  },\r\n  methods: {\r\n    init () {\r\n      this.clearStatus()\r\n      this.initText()\r\n      this.$nextTick(() => {\r\n        this.computeLines()\r\n        this.setMaxHeight()\r\n      })\r\n    },\r\n    clearStatus () {\r\n      this.$refs.vueShowMore.removeAttribute('style')\r\n    },\r\n    initText () {\r\n      let htmlText = this.text.replace(/\\r\\n/g, '<br>').replace(/\\n/g, '<br>')\r\n      this.htmlText = this.replaceUselessBr(htmlText)\r\n    },\r\n    replaceUselessBr (str) {\r\n      if (str.indexOf('<br>') === 0) {\r\n        return this.replaceUselessBr(str.replace('<br>', ''))\r\n      }\r\n      return str\r\n    },\r\n    computeLines () {\r\n      const styles = window.getComputedStyle(this.$refs.vueShowMore, null)\r\n      this.lineHeight = parseInt(styles.lineHeight, 10)\r\n      this.totalHeight = parseInt(styles.height, 10)\r\n      this.totalLines = Math.round(this.totalHeight / this.lineHeight)\r\n    },\r\n    setMaxHeight () {\r\n      if (this.totalLines < this.lines) return\r\n      const htmlArray = this.htmlText.split('<br>')\r\n      this.finalLines = this.lines\r\n      if (htmlArray.length > 1) {\r\n        let contentLines = 0\r\n        for (let i = 0; i < htmlArray.length; i++) {\r\n          if (contentLines === this.lines) break\r\n          htmlArray[i] ? contentLines++ : this.finalLines++\r\n        }\r\n      }\r\n      // 控制最多行数\r\n      let finalLines = this.finalLines <= this.maxLines ? this.finalLines : this.maxLines\r\n      this.$refs.vueShowMore.setAttribute('style', `max-height: ${this.lineHeight * finalLines}px`)\r\n      this.isFold = true\r\n    },\r\n    showHandler () {\r\n      if (this.isFold) {\r\n        this.$refs.vueShowMore.setAttribute('style', `max-height: ${this.totalHeight}px`)\r\n        this.isFold = false\r\n      } else {\r\n        this.$refs.vueShowMore.setAttribute('style', `max-height: ${this.lineHeight * this.finalLines}px`)\r\n        this.isFold = true\r\n      }\r\n    },\r\n  },\r\n}\r\n</script>\r\n\r\n<style lang=\"scss\" scoped>\r\n.vue-showmore {\r\n  position: relative;\r\n\r\n  &.animate {\r\n    transition: all ease .3s;\r\n  }\r\n\r\n  &.fold {\r\n    overflow: hidden;\r\n  }\r\n\r\n  .showmore {\r\n    position: absolute;\r\n    right: 0;\r\n    bottom: 0;\r\n    cursor: pointer;\r\n    background: #fff;\r\n    background: linear-gradient(to right,rgba(255,255,255,0),#fff, 1em);\r\n  }\r\n}\r\n</style>\r\n", ".vue-showmore {\n  position: relative;\n}\n.vue-showmore.animate {\n  transition: all ease 0.3s;\n}\n.vue-showmore.fold {\n  overflow: hidden;\n}\n.vue-showmore .showmore {\n  position: absolute;\n  right: 0;\n  bottom: 0;\n  cursor: pointer;\n  background: #fff;\n  background: linear-gradient(to right, rgba(255, 255, 255, 0), #fff, 1em);\n}\n\n/*# sourceMappingURL=VueShowMore.vue.map */"]
    },
    media: undefined
  });
};
/* scoped */


var __vue_scope_id__ = "data-v-c0afd650";
/* module identifier */

var __vue_module_identifier__ = undefined;
/* functional template */

var __vue_is_functional_template__ = false;
/* style inject SSR */

var VueShowMore = normalizeComponent_1({
  render: __vue_render__,
  staticRenderFns: __vue_staticRenderFns__
}, __vue_inject_styles__, __vue_script__, __vue_scope_id__, __vue_is_functional_template__, __vue_module_identifier__, browser, undefined);

var install = function install(Vue) {
  Vue.component(VueShowMore.name, VueShowMore);
};

var src = install;

module.exports = src;

(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
  typeof define === 'function' && define.amd ? define(factory) :
  (global = typeof globalThis !== 'undefined' ? globalThis : global || self, global.Vue = factory());
})(this, (function () { 'use strict';

  function _typeof(obj) {
    "@babel/helpers - typeof";

    return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (obj) {
      return typeof obj;
    } : function (obj) {
      return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
    }, _typeof(obj);
  }
  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }
  function _defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];
      descriptor.enumerable = descriptor.enumerable || false;
      descriptor.configurable = true;
      if ("value" in descriptor) descriptor.writable = true;
      Object.defineProperty(target, _toPropertyKey(descriptor.key), descriptor);
    }
  }
  function _createClass(Constructor, protoProps, staticProps) {
    if (protoProps) _defineProperties(Constructor.prototype, protoProps);
    if (staticProps) _defineProperties(Constructor, staticProps);
    Object.defineProperty(Constructor, "prototype", {
      writable: false
    });
    return Constructor;
  }
  function _toPrimitive(input, hint) {
    if (typeof input !== "object" || input === null) return input;
    var prim = input[Symbol.toPrimitive];
    if (prim !== undefined) {
      var res = prim.call(input, hint || "default");
      if (typeof res !== "object") return res;
      throw new TypeError("@@toPrimitive must return a primitive value.");
    }
    return (hint === "string" ? String : Number)(input);
  }
  function _toPropertyKey(arg) {
    var key = _toPrimitive(arg, "string");
    return typeof key === "symbol" ? key : String(key);
  }

  var Observer = /*#__PURE__*/function () {
    function Observer(data) {
      _classCallCheck(this, Observer);
      this.walk(data);
    }
    _createClass(Observer, [{
      key: "walk",
      value: function walk(data) {
        //重新定义属性
        Object.keys(data).forEach(function (key) {
          return defineReactive(data, key, data[key]);
        });
      }
    }]);
    return Observer;
  }();
  function defineReactive(target, key, value) {
    //递归，如果value里面还有对象时，需要继续遍历在做劫持
    observe(value);
    //将data里的属性都做劫持，对象属性值更新，原来的值也要更新
    Object.defineProperty(target, key, {
      get: function get() {
        return value;
      },
      set: function set(newValue) {
        if (newValue == value) {
          return;
        }
        value = newValue;
      }
    });
  }
  function observe(data) {
    //只能对对象和已存在的对象进行观测
    if (_typeof(data) !== 'object' || data == null) {
      return;
    }
    return new Observer(data); //更方便写出多种情况的观测数据
  }

  function initState(vm) {
    var opts = vm.$options;
    //opts 选项里面可能还有props,watch,data .... 等选项
    if (opts.data) {
      initData(vm);
    }
  }
  //将vm实例上的_data属性再次代理，可以达到直接用vm来访问data里面的属性的效果
  function proxy(vm, target, key) {
    Object.defineProperty(vm, key, {
      get: function get() {
        return vm[target][key]; //vm._data.name
      },
      set: function set(newValue) {
        vm[target][key] = newValue;
      }
    });
  }
  //对options里的data数据进行初始化
  function initData(vm) {
    var data = vm.$options.data;
    //data 的数据可能是data：{} 也可能是函数data(){return {}}
    data = typeof data === 'function' ? data.call(vm) : data;
    console.log(data);
    vm._data = data; //将这个data数据也放在实例上，要不你就的用vm.$options.data.xxx这种方式去访问属性，
    //观测数据，对这个数据进行响应式封装
    observe(data);
    //要将vm.name => vm._data.name 代理成这样
    for (var key in data) {
      proxy(vm, '_data', key);
    }
  }

  function initMixin(Vue) {
    Vue.prototype._init = function (options) {
      var vm = this; //保存实例，this指向的是实例
      vm.$options = options; //获取Vue构造函数中的选项参数
      //初始化状态
      initState(vm);
    };
  }

  /**
   * 创建Vue构造函数，在构造函数上创建一个初始化函数，
   * 将每个函数都单独封装成一个文件，互相不会影响
   */
  function Vue(options) {
    this._init(options);
  }
  initMixin(Vue);

  return Vue;

}));
//# sourceMappingURL=vue.js.map

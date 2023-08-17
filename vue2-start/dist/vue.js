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

  //保存Array构造函数的原型
  var oldArrayProto = Array.prototype;
  //Object.create() 创建一个新的对象，并将指定的对象上的原型继承给新对象
  var newArrayProto = Object.create(oldArrayProto);
  var methods = ['push', 'unshift', 'pop', 'shift', 'reverse', 'sort', 'splice']; //改变数组的方法
  methods.forEach(function (item) {
    //在新对象的原型上调用数组上本身原型上的方法 （这种思想叫做代码切片）
    newArrayProto[item] = function () {
      var _oldArrayProto$item;
      for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
        args[_key] = arguments[_key];
      }
      var result = (_oldArrayProto$item = oldArrayProto[item]).call.apply(_oldArrayProto$item, [this].concat(args));
      var insertd;
      //当前的this指向的是 arr.push 谁调用的push this指向的是谁,为了让这里调用Observer类上的observeArray函数
      var ob = this._ob_;
      switch (item) {
        case 'push':
        case 'unshift':
          insertd = args;
          break;
        case 'splice':
          //args.splice(0,1,{a:2}) {a:2} 就是新增的数据 args=(0,1,{a:2})
          insertd = args.slice(2);
      }
      if (insertd) {
        ob.observeArray(insertd);
      }
      return result;
    };
  });

  var Observer = /*#__PURE__*/function () {
    function Observer(data) {
      _classCallCheck(this, Observer);
      //将类实例赋值给_ob_属性,如果给_ob_可执行枚举，那样会让他爆栈，递归死循环
      Object.defineProperty(data, '_ob_', {
        enumerable: false,
        value: this
      });

      //如果data是数组的时候就不应该在用观测对象的方式来对数组做响应式
      if (Array.isArray(data)) {
        //重写data中数组的七个方法,保留原来的数组的特性，但是可以在新的对象原型添加想添加的方法
        data._proto_ = newArrayProto;
        this.observeArray(data); //如果数组中的是对象值就可以继续监听到对象里面的变化 ['a','s',{name:'ss'}]
        //如果data是数组，但是数组值发生了变化，
      } else {
        this.walk(data);
      }
    }
    _createClass(Observer, [{
      key: "walk",
      value: function walk(data) {
        //重新定义属性
        Object.keys(data).forEach(function (key) {
          return defineReactive(data, key, data[key]);
        });
      }
    }, {
      key: "observeArray",
      value: function observeArray(data) {
        data.forEach(function (item) {
          return observe(item);
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
        //如果 vm.name={a:1} 是通过这个的方式来设置值，他也要监听到设置值中的对象
        observe(newValue);
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

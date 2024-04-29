import { compilerToFunction } from './compiler/index'
import { initState } from './state'
export function initMixin(Vue) {
  Vue.prototype._init = function (options) {
    const vm = this //保存实例，this指向的是实例
    vm.$options = options //获取Vue构造函数中的选项参数
    //初始化状态
    initState(vm)

    if (options.el) {
      vm.$mount(options.el) //实现数据的挂载
    }
  }
  Vue.prototype.$mount = function (el) {
    const vm = this //保存实例

    el = document.querySelector(el) //获取挂载元素
    let ops = vm.$options
    if (!ops.render) {
      //先进行查找有没有render函数，
      let template //没有render看一下是否写了template,没写template 采用外部的template
      if (!ops.template && el) {
        //没有写模板，但是有el
        template = el.outerHTML
      } else {
        if (el) {
          template = ops.template //如果有el 则采用模板的内容
        }
      }
      //写了template就用 写了的template
      if (template) {
        const render = compilerToFunction(template)
        ops.render = render //jsx 最终会被编译成h('xxx')
      }
      ops.render //最终会获取render方法

      //script 标签引用的vue.global.js 这个编译过程是在浏览器运行的
      //runtime 是不包含模板编译的，整个编译时在打包的时候通过loader来转译.vue文件的，用runtime的时候不能使用template
      console.log(template)
    }
  }
}

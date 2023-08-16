import { initState } from "./state"
export function initMixin(Vue) {
  Vue.prototype._init = function (options) {
    const vm = this //保存实例，this指向的是实例
    vm.$options = options //获取Vue构造函数中的选项参数
    //初始化状态
    initState(vm)
  }
}

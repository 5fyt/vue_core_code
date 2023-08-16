import { initMixin } from './init'
/**
 * 创建Vue构造函数，在构造函数上创建一个初始化函数，
 * 将每个函数都单独封装成一个文件，互相不会影响
 */
function Vue(options) {
  this._init(options)
}
initMixin(Vue)
export default Vue

import { observe } from './observe/index'
export function initState(vm) {
  const opts = vm.$options
  //opts 选项里面可能还有props,watch,data .... 等选项
  if (opts.data) {
    initData(vm)
  }
}
//将vm实例上的_data属性再次代理，可以达到直接用vm来访问data里面的属性的效果
function proxy(vm, target, key) {
  Object.defineProperty(vm, key, {
    get() {
      return vm[target][key] //vm._data.name
    },
    set(newValue) {
      vm[target][key] = newValue
    },
  })
}
//对options里的data数据进行初始化
function initData(vm) {
  let data = vm.$options.data
  //data 的数据可能是data：{} 也可能是函数data(){return {}}
  data = typeof data === 'function' ? data.call(vm) : data
  console.log(data)
  vm._data = data //将这个data数据也放在实例上，要不你就的用vm.$options.data.xxx这种方式去访问属性，
  //观测数据，对这个数据进行响应式封装
  observe(data)
  //要将vm.name => vm._data.name 代理成这样
  for (let key in data) {
    proxy(vm, '_data', key)
  }
}

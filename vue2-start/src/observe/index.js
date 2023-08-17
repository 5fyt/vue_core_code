import { newArrayProto } from './array'

class Observer {
  constructor(data) {
    //将类实例赋值给_ob_属性,如果给_ob_可执行枚举，那样会让他爆栈，递归死循环
    Object.defineProperty(data,'_ob_',{
      enumerable:false,
      value:this
    })
   
    //如果data是数组的时候就不应该在用观测对象的方式来对数组做响应式
    if (Array.isArray(data)) {
      //重写data中数组的七个方法,保留原来的数组的特性，但是可以在新的对象原型添加想添加的方法
      data._proto_ = newArrayProto
      this.observeArray(data) //如果数组中的是对象值就可以继续监听到对象里面的变化 ['a','s',{name:'ss'}]
      //如果data是数组，但是数组值发生了变化，
    } else {
      this.walk(data)
    }
  }
  walk(data) {
    //重新定义属性
    Object.keys(data).forEach((key) => defineReactive(data, key, data[key]))
  }
  observeArray(data) {
    data.forEach((item) => observe(item))
  }
}
function defineReactive(target, key, value) {
  //递归，如果value里面还有对象时，需要继续遍历在做劫持
  observe(value)
  //将data里的属性都做劫持，对象属性值更新，原来的值也要更新
  Object.defineProperty(target, key, {
    get() {
      return value
    },
    set(newValue) {
      if (newValue == value) {
        return
      }
      //如果 vm.name={a:1} 是通过这个的方式来设置值，他也要监听到设置值中的对象
      observe(newValue)
      value = newValue
    },
  })
}
export function observe(data) {
  //只能对对象和已存在的对象进行观测
  if (typeof data !== 'object' || data == null) {
    return
  }

  return new Observer(data) //更方便写出多种情况的观测数据
}

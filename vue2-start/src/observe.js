class Observer {
  constructor(data) {
    this.walk(data)
  }
  walk(data) {
    //重新定义属性
    Object.keys(data).forEach((key) => defineReactive(data, key, data[key]))
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

//保存Array构造函数的原型
let oldArrayProto = Array.prototype
//Object.create() 创建一个新的对象，并将指定的对象上的原型继承给新对象
export let newArrayProto = Object.create(oldArrayProto)
let methods = ['push', 'unshift', 'pop', 'shift', 'reverse', 'sort', 'splice'] //改变数组的方法
methods.forEach((item) => {
  //在新对象的原型上调用数组上本身原型上的方法 （这种思想叫做代码切片）
  newArrayProto[item] = function (...args) {
    const result = oldArrayProto[item].call(this, ...args)
    let insertd
     //当前的this指向的是 arr.push 谁调用的push this指向的是谁,为了让这里调用Observer类上的observeArray函数
    let ob = this._ob_ 
    switch (item) {
      case 'push':
      case 'unshift':
        insertd = args
        break
      case 'splice': //args.splice(0,1,{a:2}) {a:2} 就是新增的数据 args=(0,1,{a:2})
        insertd = args.slice(2)
      default:
        break
    }
    if (insertd) {
      ob.observeArray(insertd) 
    }

    return result
  }
})

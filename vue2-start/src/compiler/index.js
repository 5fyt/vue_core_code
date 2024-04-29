const ncname = `[a-zA-Z_][\\-\\.0-9_a-zA-Z]*`
const qnameCapture = `((?:${ncname}\\:)?${ncname})`
const startTagOpen = new RegExp(`^<${qnameCapture}`) // 它匹配到的分组是一个 标签名 <xxx 匹配到的是开始标签的名字
const endTag = new RegExp(`^<\\/${qnameCapture}[^>]*>`) // 匹配的是</xxx> 最终匹配到的分组就是结束标签的名字
const attribute =
  /^\s*([^\s"'<>\/=]+)(?:\s*(=)\s*(?:"([^"]*)"+|'([^']*)'+|([^\s"'=<>`]+)))?/ //匹配属性
// 第一个分组是属性的key value 就是分组3/分组4/分组5
const startTagClose = /^\s*(\/?)>/ // <div> <br/>
const defaultTagRE = /\{\{((?:.|\r|\n)+?)\}\}/g //{{assd}} 匹配到的内容就是我们表达式的变量

//对模板进行编译处理
function parseHTML(html) {
  const ELEMENT_TYPE = 1
  const TEXT_TYPE = 3
  const stack = [] //用于存放元素的
  let currentParent = null //指向栈中的最后一个
  let root
  //最终需要转化成一颗抽象语法树
  function createASTElement(tag, attrs) {
    return {
      tag: tag,
      type: ELEMENT_TYPE,
      children: [],
      attrs,
      parent: null,
    }
  }
  function advance(n) {
    html = html.substring(n) //删除已经匹配到的内容
  }
  function start(tag, attrs) {
    let node = createASTElement(tag, attrs) //创造一个ast节点
    if (!root) {
      //看一下是否为空树
      root = node //如果为空则当前是数的根节点
    }
    if (currentParent) {
      node.parent = currentParent
      currentParent.children.push(node)
    }
    stack.push(node)
    currentParent = node //currentParent 为栈中的最后一个
    console.log(tag, attrs, '开始')
  }
  function chars(text) {
    text = text.replace(/\s/g, '') //删除空格

    //文本直接放在当前指向的节点中
    text &&
      currentParent.children.push({
        type: TEXT_TYPE,
        text,
        parent: currentParent,
      })
  }
  function end(tag) {
    stack.pop() //删除最后一个
    currentParent = stack[stack.length - 1] //更新当前指向的节点
    console.log(tag, '结束')
  }
  function parseStartTag() {
    const start = html.match(startTagOpen)
    if (start) {
      const match = {
        tagName: start[1], //标签名
        attrs: [],
      }
      advance(start[0].length) //匹配后就进行删除
      //如果匹配的不是开始标签的结束 就一直匹配下去
      let attr, end
      while (
        !(end = html.match(startTagClose)) &&
        (attr = html.match(attribute))
      ) {
        //删除匹配到的属性
        advance(attr[0].length)
        match.attrs.push({
          name: attr[1],
          value: attr[3] || attr[4] || attr[5],
        })
      }
      if (end) {
        advance(end[0].length) //把开始标签的结束符删除
      }
      return match
    }

    return false
  }
  while (html) {
    //如果textEnd 为0 说明是一个开始标签或者结束标签
    //如果textEnd 不为0 说明是一个结束标签
    let textEnd = html.indexOf('<') //如果indexof中的索引是0 说明是个标签
    if (textEnd == 0) {
      const startTagMatch = parseStartTag() //开始标签的匹配结果

      if (startTagMatch) {
        //解析到开始标签
        start(startTagMatch.tagName, startTagMatch.attrs)
        continue
      }

      //解析到结束标签
      let endTagMatch = html.match(endTag)
      if (endTagMatch) {
        advance(endTagMatch[0].length)
        end(endTagMatch.tagName, endTagMatch.attrs)
        continue
      }
    }
    //
    if (textEnd > 0) {
      let text = html.substring(0, textEnd) //文本内容
      if (text) {
        chars(text)
        advance(text.length) //解析到文本
        console.log(html)
      }
    }
  }
  console.log('root', root)
}

//对模板进行编译处理
export function compilerToFunction(template) {
  //  1.就是将template转换成ast语法树
  //  2.生成的render方法（render方法执行后的返回的结果就是虚拟DOM)

  let ast = parseHTML(template)
}

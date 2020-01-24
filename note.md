# 数据驱动模型
1.获取编写好的页面模板，模板中{{}}的为需要替换的内容

2.利用VUE的构造函数中所提供的数据，将页面模板中的{{}}内的内容替换成数据，得到可以在页面中展示的HTML文本

3.将生成的HTML标签板替换页面中原来的{{}}

# 模板渲染


# 虚拟DOM

虚拟DOM的处理都在内存上，比真实的DOM查找要快

目标：

1.将真正的DOM转换成虚拟DOM \
2.将虚拟DOM转换成真实DOM \
思路与深拷贝类似

# 函数柯里化

《函数式编程》

概念：

1、函数柯里化，一个函数原本有多个函数，只传入一个参数，生成新函数，由新函数接收剩下的参数

使用函数柯里化可以缓存一部分能力，提升性能

Vue中应用举例：

1、判断元素：
vue 本质是用HTML的字符串作为模板，将字符串模板转换为AST(抽象语法树),再转为虚拟dom
字符串模板->AST , AST->Vnode, Vnode->DOM, 这三个过程中

字符串->AST最消耗性能

exp： let s = '1 + 2 * ( 3 + 4 * ( 5 - 6 / 2))'
解析这个表达式并得到结果(一般化),一般会将这个表达式转换为**波兰式**表达式，然后使用栈结构来运算

在VUE中如何区分HTML内置标签和自定义组件？
首先将HTML标签存储，后进行比对，
```js
let tags = 'div,p,a,img,i,ul,li'.split(',');
function isHtmlTag(tagName) {
    tagName = tagName.toLowerCase();
    if (tags.indexOf(tagName)) return true;
    return false;
}
```
indexOf内部也是由循环实现的，若有多个标签需要判断，则要循环多次，时间复杂度为O(n)；VUE中利用函数柯里化实现了时间复杂度为O(1)的方法

2、在代码运行时模板不变，只是数据变更，则将解析后的AST储存在内存中，生成一个函数，函数只需传入数据，则每当数据变更时，不需要再次去解析模板，提升性能

2、偏函数，一个函数原本有多个函数，只传入一部分参数，生成新函数，由新函数接收剩下的参数
3、高阶函数

# 响应式原理

- 我们在使用Vue的时候，赋值属性和取得属性都是直接使用的VUE实例，
- 在设置属性值的时候，页面的数据也随之更新

使用的是**Objec.defineProperty**
``` js
Object.defineProperty( 对象, '设置属性名', {
    writeable, 可赋值
    configable, 可配置
    enumberable, 控制是否可枚举
    set() {}, 赋值时触发
    get() {}, 取值时触发
})
```
```js

 var o = {
      name: 'jim',
      age: 19,
      gender: '男'
    } ;


// 简化后的版本
function defineReactive( target, key, value, enumerable ) {
    // 函数内部就是一个局部作用域, 这个 value 就只在函数内使用的变量 ( 闭包 )
    Object.defineProperty( target, key, {
      configurable: true,
      enumerable: !!enumerable,

      get () {
        console.log( `读取 o 的 ${key} 属性` ); // 额外
        return value;
      },
      set ( newVal ) {
        console.log( `设置 o 的 ${key} 属性为: ${newVal}` ); // 额外
        value = newVal;
      }
    } )
}

// 将对象转换为响应式的
let keys = Object.keys( o );
for ( let i = 0; i < keys.length; i++ ) {
    defineReactive( o, keys[ i ], o[ keys[ i ] ], true );
}

```

对数组中对对象进行响应式处理

- push
- pop
- shift
- unshift
- reverse
- sort
- splice


1. 在改变数组的数据的时候, 要发出通知
   - Vue 2 中的缺陷, 数组发生变化, 设置 length 没法通知 ( Vue 3 中使用 Proxy 语法 ES6 的语法解决了这个问题 )
2. 加入的元素应该变成响应式的

技巧: 如果一个函数已经定义了, 但是我们需要扩展其功能, 我们一般的处理办法:

1. 使用一个临时的函数名存储函数
2. 重新定义原来的函数
3. 定义扩展的功能
4. 调用临时的那个函数

- 修改要进行响应式化的数组的原型 ( __proto__ )

已经将对象改成响应式的了. 但是如果直接给对象赋值, 赋值另一个对象, 那么就不是响应式的了, 怎么办? ( 作业 )

```
// 继承关系: arr -> Array.prototype -> Object.prototype -> ...
// 继承关系: arr -> 改写的方法 -> Array.prototype -> Object.prototype -> ...
```
## proxy

代理方法, 就是将 app._data 中的成员 映射到 app 上 

由于需要在更新数据的时候, 更新页面的内容
所以 app._data 访问的成员 与 app 访问的成员应该时同一个成员

由于 app._data 已经是响应式的对象了, 所以只需要让 app 访问的成员去访问 app._data 的对应成员就可以了.

```js
app._data.name
// vue 设计, 不希望访问 _ 开头的数据
// vue 中命名规则:
//  - _ 开头的数据是私有数据
//  - $ 开头的是只读数据
app.name
// 将 对 _data.xxx 的访问 交给了 实例

// 重点: 访问 app 的 xxx 就是在访问 app._data.xxx
```


# 发布订阅模式

目标: 解耦, 让各个模块之间没有紧密的联系

现在的处理办法是 属性在更新的 时候 调用 mountComponent 方法. 

在 Vue 中, 整个的更新是按照组件为单位进行 **判断**, 已节点为单位进行更新.

- 如果代码中没有自定义组件, 那么在比较算法的时候, 我们会将全部的模板 对应的 虚拟 DOM 进行比较.
- 如果代码中含有自定义组件, 那么在比较算法的时候, 就会判断更新的是哪一些组件中的属性, 只会判断更新数据的组件, 其他组件不会更新.

**目标, 如果修改了什么属性, 就尽可能只更新这些属性对应的页面 DOM**

# 引入Watcher

实现局部刷新，并且解决了this对上下文

在 Vue 中提供一个构造函数 Watcher
Watcher 会有一些方法: 

- get() 用来进行**计算**或**执行**处理函数
- update() 公共的外部方法, 该方法会触发内部的 run 方法
- run() 运行, 用来判断内部是使用异步运行还是同步运行等, 这个方法最终会调用内部的 get 方法
- cleanupDep() 简单理解为清除队列


# 引入 Dep 对象

该对象提供 依赖收集 ( depend ) 的功能, 和 派发更新 ( notify ) 的功能

在 notify 中去调用 watcher 的 update 方法

# watcher 与 dep
vue 中包含很多组件，各个组件是**自治**的
- watcher会有多个
- 每一个watcher 用于描述一个 **渲染行为** 或 **计算行为**
  - 自组件更新，需要**局部**渲染页面
  - computed 计算属性是依赖其使用的属性变化而变化的
    - sub: () => this.a + this.b
    - sub 依赖于 a 和 b ，只要依赖的属性变化，就会重新计算，这也是一个 watcher 

## 依赖收集与派发更新
Observer中进行响应式的绑定，在数据被读的时候，触发get方法，执行Dep来收集依赖，也就是收集Watcher。
在数据被改的时候，触发set方法，通过对应的所有依赖(Watcher)，去执行更新。比如watch和computed就执行开发者自定义的回调方法。
- a,b,c 三个属性
- 读取 a,b,c => 收集 a,b,c 三个依赖 => 变更a => 执行 a 的更新 => 重新渲染读取 a => 此时仅收集 a 的依赖 => 若此时 b 改变呢？
- 是不是各自都有一个Dep?
---
id: dom
title: DOM对象
description: DOM对象
sidebar_label: DOM对象
hide_title: true
last_update:
  date: 2022-12-28
  author: Chason
---

## 一、API和web API

### 1.1、API概念

API ( Application Programming Interface,应用程序编程接口）

- API是一些预先定义的函数，目的是提供应用程序与开发人员基于某软件或硬件得以访问一组例程的能力，而又无需访问源码，或理解内部工作机制的细节。
- 简单理解:API是给程序员提供的一种工具，以便能更轻松的实现想要完成的功能。

### 1.2、Web API

Web API是浏览器提供的一套操作浏览器功能和页面元素的 API(BOM和DOM)。

## 二、DOM对象

### 2.1、DOM是什么？

1. 文档对象模型（Document Object Model，简称DOM )，是W3C组织推荐的处理可扩展标记语言(HTML或者XML)的标准编程接口。
2. w3C已经定义了一系列的DOM接口，通过这些DOM接口可以改变网页的内容、结构和样式.

### 2.2、DOM树

![](https://gitee.com/caigh1012/assets/raw/main/learn/javascript/dom/2023-05-29-1685365608-5a81a2.png)

## 三、DOM操作

### 3.1、获取元素

#### 3.1.1、getElementById获得带有id元素对象

语法：

```js
document.getElementById('a');
```

- id是大小写敏感的字符串，代表了所要查找的元素的唯一ID

- 返回一个匹配的ID的DOM元素对象，若没有找到，则返回null

👋注意：<u>id()里面是字符串，且只要写id名不需要“#”</u>

#### 3.1.2、getElementsByClassName获取带有类名的元素(H5新增获取元素方法）

语法

```js
document.getElementsByClassName('b');
```

- 因为页面中可能有多个元素的 class 名称一样，所以获取到的是一组元素

- 哪怕你获取的 class 只有一个，那也是获取一组元素，只不过这一组中只有一个 DOM 元素而已

- 得到的数组是一个伪数组

👋注意：<u>ClassName()括号是字符串，且只要写类名不需要写 “.”</u>

#### 3.1.3、getElementsByTagName使用标签名称来获取标签

语法：

```js
document.getElementsByTagName('li');
```

- 因为页面中可能有多个元素的 标签 名称一样，所以获取到的是一组元素
- 哪怕真的只有一个这个标签名，那么也是获取一组元素，只不过这一组中只有一个 DOM 元素而已
- 得到的数组是一个伪数组，

👋注意：<u>TagName()括号里为字符串</u>

#### 3.1.4、querySelector（H5新增获取元素方法）

语法：**(同时支持css选择器)**

```js
document.querySelector('div');
document.querySelector('css选择器');
```

- querySelector 返回指定选择器的第一个元素对象

👋切记注意：<u>括号里面的**选择器需要加符号 .box #nav**</u>

#### 3.1.5、querySelectorAll（H5新增获取元素方法）

语法：**(同时支持css选择器)**

```js
docuemnt.querySelectorAll('.box');
docuemnt.querySelectorAll('css选择器');
```

- 能获取到所有满足条件的元素，以一个**伪数组的形式**返回

👋切记注意：<u>括号里面的**选择器需要加符号 .box #nav**</u>

#### 3.1.6、查看元素对象的属性和方法

利用console.dir（）打印我们返回的元素对象,更好的查看里面的属性和方法

### 3.2、修改元素内容，样式属性

#### 3.2.1、element.innerText和element.innerHTML都可以修改元素内容

两者之间的区别：

- innerText **不识别html标签** ----非标准化ie浏览器提供

* **从开始到终止位置的内容，去除空格和换行**

- innerHTML **识别html标签**----W3C标准
- **从开始到终止位置的内容，去除空格和换行**
- 同时这两个属性是可读写的，可以获取元素内容也可以设置元素内容 -例如：

```js
div.innerHTML = '我是设置内容；';
console.log(div.innerHTML); //获取元素内容
```

#### 3.2.2、修改元素属性

修改元素属性---这里的属性可以理解为类似于自定义属性

一般修改 src，href，id，alt，title等或者自定义属性

```js
img.src = 'img/02.jpg'; //正确
img.style.src = 'img/02.jpg'; //错误  不需要style
```

#### 3.2.3、修改表单属性-----属性可以理解为类似于自定义属性

一般 type，value,checked，selected

```js
input.innerHTML = '点击了'; //错误 --innerHTML适用一般标签
botton.value = '被点击了'; //正确
```

修改表单里的值通过value来修改，而不是innerHTML来修改

```js
botton.disabled = true; //正确
botton.style.disabled = true; //错误  不需要style
```

#### 3.2.4、修改样式属性----这里的属性可以理解为css的样式属性

1.style

- 专门用来给元素添加 css 样式的

* 添加的都是**行内样式**
* css带”-“的属性要使用**驼峰命名法**：如下

👋注意：

```js
div.style.backgroundColor = 'pink';
```

- 获取时，只能获取元素已经设置的行内样式，获取未设置的行内样式输出空字符串（” “），无法获取内嵌样式和外联样式

- 如果要获取非行内样式

  - getComputedStyle(非IE).要获取的属性----返回值:获取的样式，是字符串

  - currentStyle(IE).要获取的属性----返回值:获取的样式，是字符串

  - 兼容性封装函数

    ```js
    function getStyle(dom, attr) {
      if (window.getComputedStyle) {
        // 说明有getComputedStyle方法
        return window.getComputedStyle(dom, null)[attr];
      } else {
        return dom.currentStyle[attr];
      }
    }
    ```

    2.className修改样式属性

- 我们可以通过修改元素的className更改元素的样式 适合于样式较多或者功能复杂的情况
- className会直接更改元素的类名，会覆盖原先的类名
- 如果想要保留原先的类名，我们可以这么做---多类名选择器-----如下：

👋注意：

```css
div.className='first change';//注意空格
```

### 3.3、操作DOM节点

#### 3.3.1、包含以下几种节点

- 标签节点
- 属性节点
- 注释节点
- 文本节点

#### 3.3.2、操作获取节点

1.parentNode

获取的是直接父元素 输出父元素对象

2.childNodes

- childNodes 所有的子节点包含-元素节点-文本节点等等
- 如果只要元素节点，则需要专门处理，所以不提倡使用

```js
for (var i = 0; i < ul.childNodes.length; i++) {
  if (ul.childNodes[i].nodeType == 1) {
    //ul.childNodes[i]是元素节点
    console.log(ul.childNodes[i]);
  }
}
```

3.children

获得只是元素节点--以为**伪数组的形式**输出

4.firstchild，lastchild

获取第一个节点和最后一个节点，不管是文本节点还是元素节点

5.firstElementchild，lastElementchild

获取的是元素节点，ie9以上才支持

6.nextSibling,previousSibling

下一个或上一个兄弟节点，包含元素节点 或者 文本节点等等

7.nextElementSibling-previousElementSibling

获取下一个或上一个元素节点，IE9以上才能兼容

### 3.4、获取属性节点

#### 3.4.1、获取元素属性节点的几个注意：

- name属性只有表单存在，在其他元素不存在会被当做自定义属性看待
- 通常获取元素对象的属性可以通过 元素对象.xxx的方式获取，但同时与getattribute，setattribute，removeAttribute()有几点区别

#### 3.4.2、getAttribute

获取元素的class属性

```html
<div
  id="div1"
  title="hello"
  name="div"
  class="box"
  index="1">
  1561561
</div>
<input
  type="text"
  id="inp" />
<script>
  var div = document.querySelector('div');
  var inp = document.querySelector('#inp');
  console.log(div.class); //输出undefined 因为class是关键字，获取class属性只能通过className
  console.log(div.className); //输出box
  console.log(div.getAttribute('class')); //getAttribute可以通过class获取属性
</script>
```

获取行内的自定义属性

```html
<div
  id="div1"
  title="hello"
  name="div"
  class="box"
  index="1">
  1561561
</div>
<input
  type="text"
  id="inp" />
<script>
  var div = document.querySelector('div');
  var inp = document.querySelector('#inp');
  console.log(div.index); //输出undefined 无法获取在行内样式的自定义属性
  console.log(div.getAttribute('index')); //输出1,  getAttribute可以获取在行内的自定义属性
</script>
```

#### 3.4.3、setAttribute

一般设置属性值时

```html
<div
  id="div1"
  title="hello"
  name="div"
  class="box"
  index="1">
  1561561
</div>
<input
  type="text"
  id="inp" />
<script>
  var div = document.querySelector('div');
  var inp = document.querySelector('#inp');
  div.className = 'box1'; //div的class属性值更改为box1
  div.setAttribute('class', 'box2');
</script>
```

当添加一个自定义属性时

```html
<div
  id="div1"
  title="hello"
  name="div"
  class="box"
  index="1">
  1561561
</div>
<input
  type="text"
  id="inp" />
<script>
  var div = document.querySelector('div');
  var inp = document.querySelector('#inp');
  inp.className = 'a'; //自动在行内中显示
  div.aaa = 111; //在div的行内样式中并不显示，不是不存在，只是不在行内样式中不显示，可以进行输出：如下
  console.log(div.aaa);
  //但是通过setAttribute设置自定义属性时,直接在行内样式中显示
  div.setAttribute('bbb', 222);
  //虽然bbb属性setAttribute设置的，但div.bbb依旧获取不到
  console.log(div.getAttribute('bbb'));
</script>
```

👋切记注意：

- 元素对象.xxx方式进行自定义属性，不在元素行内样式中显示（除id属性和class属性等外），存在于元素对象属性内部，可以通过console.dir()查看
- _setAttribute设置自定义属性与手动给元素行内样式中添加自定义属性，直接在行内样式中显示_，但通过console.dir()查看时，不存在自定义属性。通过元素对象.xxx方式进行访问时访问不到

#### 3.4.3、removeAttribute()

```html
<div
  id="div1"
  title="hello"
  name="div"
  class="box"
  index="1">
  1561561
</div>
<input
  type="text"
  id="inp" />
<script>
  var div = document.querySelector('div');
  var inp = document.querySelector('#inp');
  div.setAttribute('bbb', 222);
  div.removeAttribute('aaa'); //未删除，元素对象还存在aaa的属性和属性值
  console.log(div.aaa); //依然可以访问
  div.removeAttribute('bbb'); //删除了行内的样式
  div.title = ''; //  只是将title的属性进行一个空字符串替换，并不是真正意义上的移除
  div.removeAttribute('title'); //行内样式真正意义上的移除
  console.dir(div); //元素对象还存在title属性为空字符串
</script>
```

- removeAttribute()无法删除---->元素对象.xxx方式设置的属性和元素本身自带的属性
- removeAttribute()删除行内中自定义的属性,--如果是元素自身的属性（如id，class，title）时，只是将属性值进行清空，本身不会移除这些属性

#### 3.4.5、attributes

- 获取某个一元素节点的所有属性节点

- 可以通过索引获取单个属性节点以及可以通过属性名获取单个属性节点

```js
<a href="javascript:;" id="bb" index="34" target="_self" class="aa">百度</a>

<script>
        // attributes:获取某个一元素节点的所有属性节点
        var aDom = document.getElementById('bb');
        console.log(aDom.attributes);// 属性节点的集合
        // 可以通过索引获取单个属性节点
        console.log(aDom.attributes[0])
        console.log(aDom.attributes[1])
        console.log(aDom.attributes[2])
        console.log(aDom.attributes[3])
        console.log(aDom.attributes[4])
        // 可以通过属性名获取单个属性节点
        console.dir(aDom.attributes.href)
        console.dir(aDom.attributes.id)
        console.dir(aDom.attributes.index)
        console.dir(aDom.attributes.target)
        console.dir(aDom.attributes.class)
    </script>
```

### 3.5、节点属性

|              node               | nodeType |    nodeName    | nodeValue（可读写） |
| :-----------------------------: | :------: | :------------: | :-----------------: |
|            元素节点             |    1     | 标签名（大写） |        null         |
|            属性节点             |    2     |     属性名     |       属性值        |
|            文本节点             |    3     |     #text      |      文本内容       |
| 文档类型节点(document.doctype） |    10    |      html      |        null         |
|            注释节点             |    8     |    #comment    |      注释内容       |
|      文档节点（document）       |    9     |   #document    |        null         |

👋补充：

1.innerText/innerHTML/value

- 元素一般用来获取或设置元素标签里面的内容**（元素的nodeValue为null）**

* 只有元素节点能使用

  2.tagname

* 表示标签名，全大写，类似nodeName
* 但是:tagName这个属性是元素节点独有的，其他节点没有这个属性

### 3.6、增删改DOM节点（查--获取元素）

#### 3.6.1、创建节点

- 元素节点：document.createElement("标签名称")
- 文本节点：document.createNode('文本节点内容')
- 文档碎片节点：document.createDocumentFragment()

#### 3.6.2、插入节点

- 父节点:appendChild()----将节点插入到指定父节点的子节点末尾--并且**添加时不是字符串形式**
- 父节点.insertBefore(newNode, referenceNode)
  - 在referenceNode节点之前插入一个newNode
  - 如果 referenceNode为null, 则newNode将被插入到末尾

#### 3.6.3、克隆节点

- 节点.cloneNode(deep)
- 参数:deep表示是否克隆后代节点，默认false
- 返回:节点的一个副本

#### 3.6.4、删除节点

- 清除节点里面的内容：节点.innerHTML=" "

- 父节点.removeChild(要删除的子节点)
- 元素节点.remove()

#### 3.6.5、修改（替换）节点

- 父节点.replaceChild(newNode,oldNode)---用newNode节点替换oldNode节点

## 四、DOM事件

> 事件可以分为浏览器事件，Dom元素事件。此部分记录DOM事件

### 4.1、常见的事件

#### 4.1.1、鼠标事件

- click---在元素上按下并释放任意鼠标按键。
- contextmenu---右键点击（在右键菜单显示前触发）
- dblclick---在元素上双击鼠标按钮
- mousedown---在元素上按下任意鼠标按钮
- mouseenter 鼠标移到有事件监听的元素内
- mouseleave---鼠标移出元素范围外
- mousemove---鼠标在元素内移动时持续触发
- mouseover---鼠标移到有事件监听的元素或者它的子元素内
- mouseout---鼠标移出元素，或者移到它的子元素上
- mouseup---在元素上释放任意鼠标按键

#### 4.1.2、键盘事件

- keyup 键盘抬起事件

- keydown 键盘按下事件

#### 4.1.3、表单事件

- change 表单内容改变事件

- input 表单内容输入事件

- submit 表单提交事件

- blur 失去焦点事件

- focus 获取焦点事件

#### 4.1.4、触发事件(移动端)

- touchstart 触摸开始事件

- touchmove 触摸移动事件

- touchend 触摸结束事件

### 4.2、注册事件

1.传统注册事件的方式---特点：唯一性，

同一个元素同一个事件只能处理设置一个处理函数，最后注册的处理函数将会覆盖前面注册的处理函数

```js
元素节点.onclick = function () {};
```

2.事件侦听注册事件（存在兼容问题，非IE7，8使用）

- addEventListener 里面的事件类型是--字符串-必定带引号--而且**不带on**

- 同一个元素 同一个事件可以添加多个侦听器（事件处理程序）

```js
元素节点.addEventlistener('事件类型', 事件处理函数, 是否捕获);
```

3.attachEvent：IE7,8使用

```js
元素节点.attachEvent('onclick',function(){
  //    alert("我是Ie9 attachEvent 以前的版本")
  // })
```

### 4.3、事件对象

- event就是一个事件对象，写到我们侦听函数的小括号里面当形参来看

- 事件对象只要有了事件才会存在，它是系统给我们自动创建的，不需要我们传递参数

- 事件对象 是我们事件的一系列相关数据的集合，跟事件相关的，比如鼠标点击里面就包含了鼠标的相关信息鼠标坐标，如果是键盘事件里面就包含的键盘事件的信息，比如判断用户按下了那个键

- 这个事件对象我们可以自己命名，比如event， e

- 存在兼容：

```js
e = window.event || e; //兼容写法
```

- 事件对象属性和方法

![](https://gitee.com/caigh1012/assets/raw/main/learn/javascript/dom/2023-05-29-1685365617-171074.png)

- 鼠标坐标，如果是键盘事件里面就包含的键盘事件的信息，比如判断用户按下了那个键

### 4.4、事件冒泡原理

#### 4.4.1、事件流

![](https://gitee.com/caigh1012/assets/raw/main/learn/javascript/dom/2023-05-29-1685365623-2b0da3.png)

👋切记注意：

![](https://gitee.com/caigh1012/assets/raw/main/learn/javascript/dom/2023-05-29-1685365627-66e66d.png)

#### 4.4.2、事件冒泡

1. 当元素触发一个事件的时候，其父元素也会触发相同的事件，父元素的父元素也会触发相同的事件

2. 不管父元素是否绑定事件，直到window为止

👋注意：

- 只会传播同类型事件
- 只会从点击元素开始按照html的结构逐层向上的元素的事件都会被触发（子元素无论在不在父元素内部，只要html的结构上构成父子关系就会触发冒泡）
- **中间内部元素**不管有没有该事件，只要上层元素有该事件，那么上层元素的事件就会被触发

#### 4.4.3、事件侦听函数

函数addEventlistener 第三个参数为true时 事件过程为捕获阶段--默认值为false

```js
元素.addEventListener('事件类型', '事件处理函数', '是否捕获，默认false');
```

捕获阶段快于冒泡阶段

#### 4.4.4、新事件

- mouseenter,也是鼠标移入事件,不会冒泡

- mouseleave,也是鼠标移出事件,不会冒泡

- mouseover,也是鼠标移入事件，会冒泡

- mouseout,也是鼠标移出事件，会冒泡

#### 4.5、阻止事件冒泡

1. 其中一个环节不冒泡，后面的同类事件也就不会触发了
2. 利用事件对象的stopPropagation()方法阻止冒泡
3. 存在兼容问题

```js
e.stopPropagation ? e.stopPropagation() : (e.cancelBubble = true); //兼容写法
```

### 4.5、事件委托

#### 4.5.1、事件对象的target属性

是事件对象e的属性，返回的是触发事件的对象（元素）----(触发事件的对象不一定是this返回的对象)---谁触发返回谁

#### 4.5.2、target于this的区别

this返回的是绑定事件的对象（元素）--谁绑定返回谁，e.target返回的是触发事件的对象（元素）

#### 4.5.3、事件委托的原理

- 把子元素要绑定的事件绑定给上级元素
- 因为我们的冒泡机制，点击子元素的时候，上级元素的同类事件也会触发（子元素不存在事件，也同样触发父元素）
- 所以我们就可以把子元素的事件委托给上级元素
- 并且可以通过事件对象.target知道真正点击的目标是什么
- 事件对象.target有兼容性，兼容写法:e.target||e.srcElement

**案例分析：**

```html
<ul>
  <li>1</li>
  <li>2</li>
  <li>3</li>
  <li>4</li>
  <li>5</li>
  <li>6</li>
</ul>
<script>
  // var lis=document.querySelectorAll('li');
  // lis.forEach(function(dom){
  //     dom.onclick=function(){
  //         console.log(this.innerHTML);
  //     }
  // });
  ul = document.querySelector('ul');
  ul.onclick = function (e) {
    // console.log(this.innerHTML);
    console.dir(this);
    console.log(e);
    console.log(e.target);
    if (e.target.nodeName == 'LI') {
      console.log(e.target.innerHTML);
    }
  };
</script>
```

### 4.6、阻止默认行为(事件)

#### 4.6.1、一般的需要阻止默认行为的有

- 给a标签绑定了一个点击事件，点击跳转页面 ---a的href属性为空时，点击会刷新页面
- submit按钮，button按钮点击会触发form的submit事件，导致跳转页面
- 点击鼠标右键，弹出系统快捷菜单

#### 4.6.2、对于addEventListener注册的事件

- 阻止默认行为--只能使用e.preventDefault();

#### 4.6.3、对于传统事件注册的方式----onxxx的方式

- 普通浏览器---e.preventDefault()
- 低版本浏览器---e.returnValue=false;
- 也可以利用 return false 也可以阻止默认行为，没有兼容问题，特点：return后面的代码无法执行，而且只限于传统注册事件

🛠兼容写法：

```js
e.preventDefault ? e.preventDefault() : (e.returnValue = false);
```

## 五、写法兼容总结

### 5.1、事件对象写法

```js
e = window.event || e; //兼容写法
```

### 5.2、事件侦听函数

- addEventListener (非IE7,8)使用
- attachEvent：IE7,8使用

### 5.3、事件对象的target

- e.target 标准使用
- e.srcElement 非标准 IE6-8使用

### 5.4、阻止冒泡

- e.stopPropgatation() 标准使用
- e.cancelBubble

### 5.5、阻止默认行为

- e.preventDefault() 标准使用
- e.returnValue 非标准 IE6-8使用

---
title: JQuery
description: JQuery快速入门
sidebar_label: JQuery快速入门
hide_title: true
---

## 一、jQuery基础部分

### 1.1、jQuery的介绍

jQuery是js的库，库就是说将很多js的方法封装在了一个文件中；jQuery是前端编程中使用最多的库，曾经风靡前端。

jQuery的好处：

1. 强大的选择器机制
2. 优质的隐式迭代
3. 无所不能的链式编程
4. jquery完全不需要考虑兼容性，因为jquery库将js的兼容都封装好了

### 1.2、jQuery的简单使用

1. 先下载一个jQuery，然后再引入
2. 检测是否检验成功，就是输出$或者就jQuery。这是jQuery暴露在全局的唯一的两个函数。
3. 美元符号($) 是暴露在全局的中的一个函数名称， 在jquery中 $ 代表jQuery; $ 只是为了将jQuery简写

jQuery的引入

![1568085194931](https://gitee.com/caigh1012/assets/raw/main/fe/jquery/2023-05-29-1685365974-a72dcf.png)

jQuery最终的返回和暴露

![1604992075237](https://gitee.com/caigh1012/assets/raw/main/fe/jquery/2023-05-29-1685365980-f9ca39.png)

### 1.3、jQuery伪数组与DOM元素

```js
$div = $('div');
//或者
$div = jQuery('div');
console.log($div);
```

jQuery获取元素的结果:

![1604992278901](https://gitee.com/caigh1012/assets/raw/main/fe/jquery/2023-05-29-1685365984-fd184d.png)

从结果中可以看出来，jQuery获取到的是伪数组，不能使用操作DOM元素的方式来操作jQuery获取到的伪数组，jQuery提供了一套专门用来操作jQuery伪数组的方法来操作，而这套方法是不能被DOM元素使用的。

从伪数组中取下标可以获取到DOM元素

```js
var oDiv = $('div')[0]; // 取下标
var oDiv = $('div').get(下标); // 下标
console.log(oDiv);
```

jQuery伪数组中获取到DOM元素结果如下：

![1604992861410](https://gitee.com/caigh1012/assets/raw/main/fe/jquery/2023-05-29-1685365989-bbc54a.png)

经过这样获取后得到的DOM元素才能使用

原生js的dom元素也不能使用jQuery提供的方法操作，但可以将DOM元素转为jQuery伪数组

```js
var oDiv = document.querySelector('div');
var $div = $(div);
console.log($div);
```

DOM元素转jQuery伪数组结果如下：

![1604995288992](https://gitee.com/caigh1012/assets/raw/main/fe/jquery/2023-05-29-1685365994-78e0e2.png)

🔔注意：原生js中的window，在jQuery中是$(window)，原生js中的document，在jQuery中是$(document)，原生js中的this，在jQuery中是$(this)

### 1.4、jQuery选择器及表单选择器

jQuery选择元素可以使用css的选择器

#### 1.4.1、jQuery选择器

id选择器

```js
$('#id名');
```

类名选择器

```js
$('.类名');
```

标签选择器

```js
$('标签名');
```

属性选择器

```js
$("[name='username']");
```

伪类选择器

```js
$('li:first-child');
$('li:last-child');
$('li:nth-child(数字)'); // 第一个元素对应数字是1
$('li:empty'); // 空标签
```

类似css的组合选择

```js
$('#div .a'); //表示获取id为div下类名为a的元素
```

#### 1.4.2、表单选择器

```js
//表单选择器---基本
$(':input'); // 匹配所有的表单元素 包括：文本框（input）下拉列表(select)、文本域(textarea)
$(':text'); // 	匹配单行文本框type="text"  $("input:text")  $("input[type=text]")
$(':password'); // 匹配单行密码框
$(':radio'); //	  匹配单选按钮
$(':checkbox'); // 匹配多选按钮
$(':submit'); //	匹配提交按钮
$(':reset'); // 匹配重置按钮
$(':image'); //  匹配图片按钮
$(':button'); // 匹配普通按钮
$(':file'); //   匹配文件上传
$(':hidden'); // 匹配隐藏域
//表单选择器---重点
$('input:enabled'); // 所有可用表单元素
$('input:disbaled'); // 所有禁用表单元素
$('input：checked'); // 所有选中的表单元素 -- 重点
$('option:selected'); // 被选中的下拉框元素 -- 重点
```

🔔注意：jQuery获取元素不会获取单个元素，页面中只要满足选择器的，都会获取到，也就是jQuery获取到的永远是集合（伪数组）。

### 1.5、jQuery筛选器及筛选器方法

#### 1.5.1、jQuery筛选器

```js
$('li:first');
$('li:last');
$('li:event');
$('li:odd');
$('li:eq(数字)'); // 选择下标是指定数字的元素
$('li:lt(数字)'); // 下标小于指定数字的元素
$('li:gt(数字)'); // 下标大于指定数字的元素
```

#### 1.5.2、筛选器方法

```js
$('li').first(); // 元素集合中的第一个
$('li').last(); // 元素集合中的最后一个
$('div').next(); // div的下一个兄弟元素
$('div').prev(); // div的上一个兄弟元素
$('div').nextAll(); // div后面的所有兄弟元素
$('div').prevAll(); // div前面的所有兄弟元素
$('div').parent(); // div的父元素
$('div').parents(); // div的所有直系祖宗元素
$('div').eq(数字); // 指定下标的div元素
$('div').find(选择器); // div后代中的的指定元素
$('div').siblings(); // div的所有兄弟元素
$('div').children(); // div下的所有子元素
```

### 1.6、jQuery属性操作

设置属性：

```js
$('div').prop(属性名, 属性值);
```

获取属性：

```js
$('div').prop(属性名);
```

设置自定义属性：

```js
$('div').attr(属性名, 属性值);
```

获取自定义属性：

```js
$('div').attr(属性名);
```

删除属性：

```js
$('div').removeProp(属性名);
$('div').removeAttr(属性名); // 删除自定义属性
```

### 1.7、jQuery样式操作

设置样式：

```js
$('div').css(css属性名, 值); // 设置一个样式
$('div').css({
  // 设置多个样式
  css属性名: 值,
  css属性名: 值,
});
```

获取样式：

```js
$('div').css(css属性名);
```

### 1.8、jQuery类名操作

```js
$('div').addClass(类名); // 添加类名
$('div').removeClass(类名); // 删除类名
$('div').toggleClass(类名); // 在添加和删除之间切换
$('div').hasClass(类名); // 判断元素是否有这个类名，有是true，没有是false
```

### 1.9、jQuery元素内容操作

```js
$('div').text(); // 获取元素内容 === 相当于 div.innerText
$('div').text('盒子'); // 设置元素内容 === 相当于 div.innerText = "盒子"
$('div').html(); // 获取元素代标签的内容 === 相当于 div.innerHTML
$('div').html('<b>文字</b>'); // 设置元素带标签的内容 === 相当于 div.innerHTML = "<b>文字</b>"
$('input').val(); // 获取表单元素的值 === 相当于 input.value
$('input').val('请输入用户名'); // 设置表单元素的内容 === 相当于 input.value = "请输入用户名"
```

补充知识点：

```js
$(this).index(); // index方法是获取元素的下标
$('li').index(3); // 将li标签的index下标设置为3  很方便
```

### 1.10、jQuery事件

jquery中的事件是将事件名作为方法名，传入回调函数即可。

```js
$('div').click(function () {});
$('div').mouseover(function () {});
```

页面加载事件，在原生js中的页面加载事件是window.onload

在jquery中有两种写法：

```js
$(function () {});
$(document).ready(function () {});
```

推荐使用jquery的页面加载事件，jquery的页面加载要比js原生的写法效率高，因为js元素的页面加载事件需要等到页面中的所有资源加载完毕才执行，而jquery的页面加载事件只需要等到页面的标签加载完毕就执行，而不会等待外部文件加载。标准的事件处理：

on方法用于绑定事件、委托事件、传入参数

```shell
$(元素).on(事件类型[,委托的子元素][,传入的参数],处理的函数)
```

使用说明：

1. 事件类型不用加on
2. 委托元素必须是子元素
3. 传入的参数会传到处理函数中，且在事件对象的data属性中

例：

```html
<body>
  <ul>
    <li>1</li>
    <li>2</li>
    <li>3</li>
    <li>4</li>
  </ul>
</body>
<script src="./jquery-3.4.1.js"></script>
<script type="text/javascript">
  $('ul').on('click', 'li', [11, 22], function (e) {
    console.log(e);
  });
</script>
```

jquery中on绑定事件执行结果：

![1573559528459](https://gitee.com/caigh1012/assets/raw/main/fe/jquery/2023-05-29-1685366001-d66728.png)

off方法用于解绑事件

```shell
$(元素).off(事件类型,处理函数)
```

trigger方法用于手动触发事件：

```shell
$(元素).trigger(事件类型,处理函数)
```

只能触发一次的事件：

```shell
$(元素).one(事件类型,处理函数);
```

特殊事件：

hover事件，包含鼠标放上去和鼠标离开

```shell
$("元素").hover(鼠标放上去的处理函数,鼠标离开的处理函数)
```

## 二、jQuery的操作DOM部分

### 2.1、元素节点操作

#### 2.1.1、创建元素

```js
$('标签和内容'); // 创建一个标签并给里面放内容
//例如：
var box = $("<div class='box'>div盒子</box>");
console.log(box);
```

给父元素追加子元素结果：

![](https://gitee.com/caigh1012/assets/raw/main/fe/jquery/2023-05-29-1685366006-231a30.png)

#### 2.1.2、添加元素

在父元素下添加子元素

```js
父元素.append(子元素); //在父元素的末尾添加
```

例：

```html
<div>
    <span>span标签</span>
</div>
</body>
<script src="jquery.js"></script>
<script type="text/javascript">
var box = $("div");
var b = $("<b>加粗文字</b>")
box.prepend(b);
</script>
```

给父元素追加子元素结果：

![1567970288795](https://gitee.com/caigh1012/assets/raw/main/fe/jquery/2023-05-29-1685366010-dacd5d.png)

给父元素最前面添加子元素：

```js
父元素.prepend(子元素);
```

例：

```html
<div>
    <span>span标签</span>
</div>
</body>
<script src="jquery.js"></script>
<script type="text/javascript">
var box = $("div");
var b = $("<b>加粗文字</b>")
box.prepend(b);
</script>
```

父元素最前面添加子元素结果：

![1567970395029](https://gitee.com/caigh1012/assets/raw/main/fe/jquery/2023-05-29-1685366017-dfb279.png)

将子元素添加到父元素中：

```js
// 将子元素追加到父元素中
子元素.appendTo(父元素);
// 将子元素添加到父元素最前面
子元素.prependTo(父元素);
```

添加兄弟元素：

添加下一个兄弟元素

```js
// 添加下一个兄弟元素
元素.after(下一个兄弟元素);
```

例：

```html
<div>
    <span>span标签</span>
</div>
</body>
<script src="../js/jquery.js"></script>
<script type="text/javascript">
var span = $("span");
var b = $("<b>加粗文字</b>")
span.after(b);
</script>

```

添加下一个兄弟元素结果：

![1567970288795](https://gitee.com/caigh1012/assets/raw/main/fe/jquery/2023-05-29-1685366022-67e35e.png)

添加上一个兄弟元素：

```shell
元素.before(上一个兄弟元素);
```

例：

```html
<div>
    <span>span标签</span>
</div>
</body>
<script src="../js/jquery.js"></script>
<script type="text/javascript">
var span = $("span");
var b = $("<b>加粗文字</b>")
span.before(b);
</script>

```

添加上一个兄弟元素结果：

![1567970395029](https://gitee.com/caigh1012/assets/raw/main/fe/jquery/2023-05-29-1685366026-a141bb.png)

将元素添加到某个元素的前面或后面：

```js
// 将元素添加到某个元素前面
要添加的元素.insertBefore(元素);
// 将元素添加到某个元素后面
要添加的元素.insertAfter(元素);
```

#### 2.1.3、替换元素

使用新元素替换某个元素

```js
某个元素.replaceWith(新元素);
```

例：

```html
<div>
    <span>span标签</span>
</div>
</body>
<script src="../js/jquery.js"></script>
<script type="text/javascript">
var span = $("span");
var b = $("<b>加粗文字</b>")
span.replaceWith(b);
</script>

```

将 span 替换成 b 结果：

![1567971137680](https://gitee.com/caigh1012/assets/raw/main/fe/jquery/2023-05-29-1685366032-830379.png)

用新元素替换掉某个元素：

```js
新元素.replaceAll(某个元素);
```

#### 2.1.4、删除元素

删除元素内部所有标签和内容，让自己变成一个空标签

```js
元素.empty();
```

例：

```html
<div>
    <span>span标签</span>
</div>
</body>
<script src="../js/jquery.js"></script>
<script type="text/javascript">
var box = $("div");
box.empty();
</script>

```

删除元素内部所有标签和内容结果：

![1567971351886](https://gitee.com/caigh1012/assets/raw/main/fe/jquery/2023-05-29-1685366036-c7ec3b.png)

将当前标签从页面中删除

```js
元素.remove(); // 删除自己和自己内部所有内容
```

例：

```html
<div>
    <span>span标签</span>
</div>
</body>
<script src="../js/jquery.js"></script>
<script type="text/javascript">
var box = $("div");
box.remove();
</script>
```

删除当前标签结果：

![1567971478903](https://gitee.com/caigh1012/assets/raw/main/fe/jquery/2023-05-29-1685366040-98c2e9.png)

#### 2.1.5、复制元素

```js
元素.clone([是否复制自身的事件][,是否复制子元素的事件])
```

使用说明：

1. jqueyr中的复制元素是深复制，复制标签结构和内容
2. 这个方法接收两个参数，参数1代表是否把元素的事件也克隆出来，默认为false；参数2代表是否把元素的子元素的事件克隆出来，默认跟随第一个参数的值。
3. 如果不复制父元素的事件，子元素的事件也不能复制

### 2.2、元素尺寸

元素内容区域尺寸操作：

```js
元素.height(); // 获取元素内容区域高度
元素.height(高度); // 设置元素内容区域高度
元素.width(); // 获取元素内容区域宽度
元素.width(宽度); // 设置元素内容区域宽度
```

获取元素内部区域尺寸：

```js
元素.innerHeight(); // 获取元素内部的高度，包含padding，但不包含border
元素.innerWidth(); // 获取元素内部的宽度，包含padding，但不包含border
```

获取元素占据页面的尺寸：

```js
元素.outHeight(); // 获取元素占据的高度，包含padding和border，不包含margin
元素.outHeight(true); // 获取元素占据的高度，包含padding和border，包含margin
元素.outWidth(); // 获取元素占据的宽度，包含padding和border，不包含margin
元素.outWidth(true); // 获取元素占据的宽度，包含padding和border，包含margin
```

### 2.3、元素位置

元素相对页面的位置操作：

```js
元素.offset(); // 获取到元素在页面中的位置，包含left值和top值，返回一个对象
元素.offset({ left: 值, top: 值 }); // 将元素设定到指定的位置，使用relative
```

元素相对父元素的值：

```js
元素.position(); // 获取元素相对于定位的父元素的偏移值，不管设置的是什么，获取到的永远是left和top
```

获取元素滚动过的距离：

```js
$(window).scrollTop(); // 获取元素滚动过的高度
$(window).scrollLeft(); // 获取元素滚动过的宽度
$(window).scrollTop(值); // 设置元素滚动过的高度
$(window).scrollLeft(值); // 设置元素滚动过的宽度
```

### 2.4、动画

##### 2.4.1、基本动画

显示：

```js
元素.show(); // 让元素从隐藏状态变为显示状态（从display:none;变为 display:block;）
可选参数1：时间，毫秒数 == 让元素在规定的时间内显示（操作的属性有很多）
可选参数2：速度方式，匀速或加速或减速
可选参数3：动画结束后执行的回调函数
```

隐藏：

```js
元素.hide()； // 让元素从显示状态切换到显示状态
可选参数和show一样
```

切换显示隐藏：

```js
元素.toggle(); // 让元素在隐藏和显示状态切换
可选参数和show一样;
```

元素上下拉动隐藏显示：

```js
元素.slideDown(); // 让元素向下拉动显示
元素.slideUp(); // 让元素向上拉动隐藏
元素.slideToggle(); // 让元素切换上下拉动显示隐藏
参数和show一样;
```

元素透明度显示隐藏：

```js
元素.fadeIn(); // 让元素从透明度0变为1的显示
元素.fadeOut(); // 让元素从透明度1变为0的隐藏
元素.slideToggle(); // 让元素切换透明度显示隐藏
参数和show一样;
```

让元素切换到指定的透明度：

```js
元素.fadeTo(毫秒数, 透明度, 速度方式, 结束的回调函数); // 让元素在指定的时间内切换到指定的透明度
```

##### 2.4.2、自定义动画

开启动画：

```js
元素.animate({
    css属性名:属性值,
    css属性名:属性值,
    ...
}[,毫秒数][,速度方式][,执行结束的回调函数]);
```

停止动画：

```js
元素.stop(); // 将动画停止在当前状态
元素.finish(); // 将动画停止在结束状态
```

stop有两个参数，值都是布尔值：

参数1表示是否停止后续的动画，true表示停止，false表示不停止，默认是false

参数2表示是否停止在当前动画的结束位置，true表示停止的当前动画的结束位置，false表示停止在当前位置，默认为false

动画的链式操作：

通常在一个动画中的所有css属性是同时进行的，想要将所有动画按顺序执行的话，可以将多个动画嵌套在动画结束的回调函数中，但是这样容易造成回调地狱，所以jquery提供了一个动画的链式操作，让所有动画组成一个队列，按顺序执行，例：

```html
<style>
  div {
    width: 100px;
    height: 100px;
    background-color: red;
    position: absolute;
  }
</style>
<body>
  <button class="start">按钮</button>
  <div></div>
</body>
<script src="./js/jquery.js"></script>
<script type="text/javascript">
  $('.start').click(function () {
    $('div')
      .animate({
        left: '300px',
      })
      .animate({
        top: '300px',
      })
      .animate({
        width: '300px',
      })
      .animate({
        height: '50px',
      });
  });
</script>
```

动画队列 - 动画链式操作效果图：

![](https://gitee.com/caigh1012/assets/raw/main/fe/jquery/2023-05-29-1685366046-7eadd6.gif)

## 三、jQuery的ajax请求和插件部分

### 3.1、jQuery的ajax封装

#### 3.1.1、get请求

语法：

```js
$.get('请求地址', 参数, 成功的回调函数, 'json');
参数1：请求地址
参数2：请求携带的数据，可以是拼接的字符串形式，也可以是对象形式
参数3：成功的回调函数，参数为响应回来的的数据
参数4：希望返回的数据格式
```

例如：

```js
$.get(
  'get.php',
  { id: 1 },
  function (res) {
    console.log(res);
  },
  'json',
);
```

#### 3.1.2、post请求

语法：

```js
$.post('请求地址', 参数, 成功的回调函数, 'json');
参数1：请求地址
参数2：请求携带的数据，可以是拼接的字符串形式，也可以是对象形式
参数3：成功的回调函数，参数为响应回来的的数据
参数4：希望返回的数据格式
```

例：

```js
$.post(
  'post.php',
  { id: 1 },
  function (res) {
    console.log(res);
  },
  'json',
);
```

#### 3.1.3、ajax请求

语法：

```js
$.ajax({
  url: 请求地址, // 必填，请求的地址
  type: 请求方式, // 选填，请求方式，默认是 GET（忽略大小写）
  data: {}, // 选填，发送请求是携带的参数
  dataType: 'json', // 选填，期望返回值的数据类型，默认是 string
  async: true, // 选填，是否异步，默认是 true
  success() {}, // 选填，成功的回调函数
  error() {}, // 选填，失败的回调函数，参数有xhr，是ajax对象，status状态，err错误信息
  cache: true, // 选填，是否缓存，默认是 true
  timeout: 1000, // 选填，超时时间，单位毫秒
  context: div, // 选填，回调函数中的 this 指向，默认是 ajax 对象
});
```

例：

```js
$.ajax({
  type: 'post',
  url: 'ajax.php',
  dataType: 'json',
  success: function (res) {
    console.log(res);
  },
});
```

#### 3.1.4、jsonp请求

语法：

```js
$.ajax({
  url: 请求地址,
  dataType: 'jsonp',
  data: { name: 'Jack', age: 18 },
  success(res) {
    console.log(res);
  },
  jsonp: 'cb', // jsonp 请求的时候回调函数的 key
  jsonpCallback: 'fn', // jsonp 请求的时候回调函数的名称
});
```

### 3.2、jQuery的标识符

jquery的开头都是 $ 获取时 jQuery。如果在页面引入别人的插件，别人的插件写的也是要用 $ 或 jQuery 开头的，那么会和引入的 jquery产生冲突。jquery 早已预料到了这种情况，所以 jquery 可以将 $ 或 jQuery 的使用权交出，或换成其他的操作符。

```js
jQuery.noConflict()； // 交出了$使用权，$符号不能使用了，只能使用jQuery
jQuery.noConflict(true)； // 交出了$和jQuery的使用权，$符号和jQuery都不能使用了
var 变量 = jQuery.noConflict(true); // 使用自定义的变量代替$和jQuery
```

### 3.3、jQuery扩展

jquery总共提供了两类方法，一类是元素集合调用，一类是自己调用：

```js
$('div').css();
$.get();
```

jquery提供的方法在情况下，会写的很复杂，所以提供了一个插件机制，可以向jquery中扩展自己的方法。

向元素集合扩展方法：

```js
jQuery.fn.extend({
  fn: function () {
    console.log(123);
  },
});
// 参数是一个对象，对象中的方法是对每个元素集合扩展的方法
```

这样写好以后，就可以使用元素集合调用这个方法了：

```js
$('div').fn(); // 123
```

向jquery自身扩展方法：

```js
jQuery.extend({
  fn: function () {
    console.log(456);
  },
});
// 参数是一个对象，对象中的方法是对自身扩展的方法

//调用
$.fn();
```

### 3.4、jQuery的插件

推荐的插件网址：

jquery之家：http://www.htmleaf.com/jQuery

jq22: www.jq22.com

#### 3.4.1、表单验证插件

下载地址：http://static.runoob.com/download/jquery-validation-1.14.0.zip

jquery-validation使用：

1. 引入jquery

2. 引入jquery.validate.js

3. 引入语言包

4. form标签调用validate方法

```js
$("form").validate({
    rules:{ // 定义规则
        // 键是表单元素name属性值，值是规则项 -- 单一规则
        uname:"required",
        // 键是表单元素name属性值，值是对象
        pass:{
			// 键是规则名称，值是规则的值
            maxlength:12,
            minlength:6
            required:true
        }
    },
    message:{ // 自定义提示内容，要和上面的规则对应
        uname:"用户名必填",
        pass:{
			maxlength:"不能大于12位",
            minlength:"不能小于6位",
            required:"密码必填", // 如果要使用插件默认的提示信息则可以省略
        }
    },
    submitHandler:function(form){ // 处理表单提交
         // jQuery序列化表单数据
        var data = $(form).serialize();
        /*
        	手动提交表单或发送ajax
        	form.submit()
        	ajax

        */
    }
});
```

5. 自定义验证方法：

```js
jQuery.validator.addMethod(
  'checkTel',
  function (v) {
    var reg = /^[1][345789]\d{9}$/;
    if (!reg.test(v)) {
      return false;
    } else {
      return true;
    }
  },
  '手机号不正确',
);
// 验证规则是checkTel，提示信息是固定的
```

#### 3.4.2、颜色动画插件

下载网址：https://github.com/jquery/jquery-color

jquery.color.js，引入插件即可，写颜色动画就好了

#### 3.4.3、图片懒加载

下载网址：https://github.com/pedromenezes/jQuery-lazyload

jquery.lazyload使用：

1. 引入jquery
2. 引入插件名
3. 将图片的src属性换成data-original属性，给图片标签加宽高
4. 给图片加类名，用于控制
5. js代码中调用方法：`$("img.类名").lazyload();`

自定义占位图片：

```javascript
$("img.lazy").lazyload(function(){
    placeholder:"image/1.gif",
});
```

#### 3.4.4、laydate时间插件

官网：http://www.layui.com/laydate/

下载插件，引入核心的js文件

```html
<body>
  <input
    type="text"
    id="time" />
</body>
<script src="laydate.js"></script>
<script>
  // 初始化时间，执行一个laydate实例
  laydate.render({
    elem: '#time',
    type: 'datetime', // 可以指定类型：month,year,datetime,time
    mark: {
      // 标记
      '0-6-2': '儿童节',
      '0-0-5': '发工资',
      '2019-6-30': '离职',
      '2019-6-28': '',
    },
  });
</script>
```

时间插件效果：

![](https://gitee.com/caigh1012/assets/raw/main/fe/jquery/2023-05-29-1685366056-618703.png)

#### 3.4.5、layer弹出层插件

弹出层网址：http://layer.layui.com/

加载层

```html
<body>
  <button id="loading">加载</button>
</body>
<script src="jquery.js"></script>
<script src="layer.js"></script>
<script>
  // loading层
  $('#loading').click(function () {
    var index1 = layer.load(1, {
      shade: [0.1, '#666'], // 0.1表示透明度，#666表示背景颜色
      shadeClose: true, // 表示点击遮罩关闭弹出层，默认为false
    });
    // 关闭指定的弹出层:layer.close(弹出层id);
    setTimeout(function () {
      layer.close(index1);
    }, 3000);
  });
</script>
```

效果图：

![](https://gitee.com/caigh1012/assets/raw/main/fe/jquery/2023-05-29-1685366063-83e9ce.gif)

提示层：

```html
<body>
  <button id="tip">提示</button>
</body>
<script src="jquery.js"></script>
<script src="layer.js"></script>
<script>
  // 提示层
  $('#tip').click(function () {
    layer.msg('提交失败！！！', { time: 2000 }); // 设置2秒钟之后自动关闭
  });
</script>
```

效果图：

![](https://gitee.com/caigh1012/assets/raw/main/fe/jquery/2023-05-29-1685366068-61b210.gif)

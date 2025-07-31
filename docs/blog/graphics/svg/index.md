---
outline: deep
---

# SVG文档入门

## 一、SVG介绍

[SVG](https://developer.mozilla.org/zh-CN/docs/Web/SVG) 是一种 [XML](https://developer.mozilla.org/zh-CN/docs/Web/XML) 语言，类似 [XHTML](https://developer.mozilla.org/zh-CN/docs/Glossary/XHTML)，可以用来绘制矢量图形。SVG 可以通过定义必要的线和形状来创建一个图形，也可以修改已有的位图，或者将这两种方式结合起来创建图形。图形和其组成部分可以形变、合成、或者通过滤镜完全改变外观。

SVG 诞生于 1999 年，主流浏览器均支持 SVG。加载慢是 SVG 的一个缺点。但是 SVG 也有自身的优点，比如它实现了 DOM 接口（比 Canvas 方便），不需要安装第三方扩展。当然，是否使用 SVG 还要取决于你要实现什么。

HTML 提供了定义标题、段落、表格等等内容的元素。与此类似，SVG 也提供了一些元素，用于定义圆形、矩形、简单或复杂的曲线。一个简单的 SVG 文档由 [\<svg\>](https://developer.mozilla.org/zh-CN/docs/Web/SVG/Reference/Element/svg) 根元素和基本的形状元素构成。另外还有一个 `g` 元素，它用来把若干个基本形状编成一个组。

从这些开始，SVG 可以变得更加复杂。SVG 支持渐变、旋转、动画、滤镜效果、与 JavaScript 交互等等功能，但是所有这些额外的语言特性，都需要在一个定义好的图形区域内实现。

更加详细的使用指南参考 [MDN文档](https://developer.mozilla.org/zh-CN/docs/Web/SVG/Tutorials/SVG_from_scratch/Getting_started)

## 二、SVG入门使用

定义一个 svg 标签

```html
<svg width="100%" height="250" version="1.1" xmlns="http://www.w3.org/2000/svg"></svg>
```

其中 width、height 表示宽度和高度。version 为版本声明，有效值仅接受 1.0 或 1.1。作为 XML 的一种方言，SVG 必须正确的绑定命名空间（在 xmlns 属性中绑定）。

## 三、坐标定位

对于所有元素，SVG 使用的坐标系统或者说网格系统。这种坐标系统是以页面的左上角为 (0,0) 坐标点，坐标以像素为单位，x 轴正方向是向右，y 轴正方向是向下。

![image-20250714193847137](images/svg_default_grid.png)

注意：这和你小时候所教的绘图方式是相反的。但是在 HTML 文档中，元素都是用这种方式定位的。

## 四、基本形状

### 4.1、矩形

```html
<rect x="10" y="10" width="30" height="30" stroke="black" fill="transparent" stroke-width="5"/>
```

x、y 表示矩形左上角的 x、y 位置，width、height 表示矩形的宽度、高度，rx、ry 表示圆角的 x、y 方位的半径。

### 4.2、圆形

```html
<circle cx="25" cy="75" r="20" stroke="red" fill="transparent" stroke-width="5"/>
```

r 表示圆的半径，cx、cy 表示圆心的 x、y 位置。

### 4.3、椭圆

```html
<ellipse cx="75" cy="75" rx="20" ry="10"/>
```

cx、cy 表示椭圆中心的 x 位置，rx、ry 表示椭圆的 x、y 半径。

### 4.4、线

```html
<line x1="10" x2="50" y1="110" y2="150" stroke="black" />
```

两点成一线，x1、y1 表示起点的 x、y 的位置，x2、y2 表示终点的 x、y 的位置。

### 4.5、折线

```html
<polyline points="60, 110 65, 120 70, 115 75, 130 80, 125 85, 140 90, 135 95, 150 100, 145"/>
```

points 表示点集数列，每个数字用空白、逗号、终止命令符或者换行符分隔开。每个点必须包含 2 个数字，一个是 x 坐标，一个是 y 坐标。

### 4.6、多边形

```html
<polygon points="50, 160 55, 180 70, 180 60, 190 65, 205 50, 195 35, 205 40, 190 30, 180 45, 180"/>
```

points 表示点集数列，每个数字用空白符、逗号、终止命令或者换行符分隔开。每个点必须包含 2 个数字，一个是 x 坐标，一个是 y 坐标。路径绘制完后闭合图形。

## 五、path路径

\<path\> 可能是 SVG 中最常见的形状。你可以用 path 元素绘制矩形（直角矩形或者圆角矩形）、圆形、椭圆、折线形、多边形，以及一些其他的形状，例如贝塞尔曲线、2 次曲线等曲线，因为 path 很强大也很复杂。

### 5.1、直线命令

path 元素里面有 5 个画直线的命令

首先是 “Move to” 命令，在使用 M 命令移动画笔后，只会移动画笔，但不会在两点之间画线。因为 M 命令仅仅是移动画笔，但不画线。所以 M 命令经常出现在路径的开始处，用来指明从何处开始画。

真正能画出线的命令有三个（M 命令是移动画笔位置，但是不画线），最常用的是 “Line to” 命令，`L` 需要两个参数，分别是一个点的 x 轴和 y 轴坐标，L 命令将会在当前位置和新位置（L 前面画笔所在的点）之间画一条线段。

另外还有两个简写命令，用来绘制水平线和垂直线。`H`，绘制水平线，`V`，绘制垂直线。这两个命令都只带一个参数，标明在 x 轴或 y 轴移动到的位置，因为它们都只在坐标轴的一个方向上移动。

编写示例如下：

```html
<path d="M10 10 H 90 V 90 H 10 L 10 10" />
```

使用 z 命令简化，`Z` 命令会从当前点画一条直线到路径的起点，尽管我们不总是需要闭合路径，但是它还是经常被放到路径的最后。

```html
<path d="M10 10 H 90 V 90 H 10 z" />
```

### 5.2、曲线命令

绘制平滑曲线的命令有三个，其中两个用来绘制贝塞尔曲线，另外一个用来绘制弧形或者说是圆的一部分。欲了解贝塞尔曲线的完整数学讲解，请阅读这份 [Wikipedia 的文档](https://zh.wikipedia.org/wiki/貝茲曲線)。贝塞尔曲线的类型有很多，但是在 path 元素里，只存在两种贝塞尔曲线：三次贝塞尔曲线 C，和二次贝塞尔曲线 Q。

#### 5.2.1、三次贝塞尔曲线 C

从稍微复杂一点的三次贝塞尔曲线 C 入手，三次贝塞尔曲线需要定义一个点和两个控制点，所以用 C 命令创建三次贝塞尔曲线。

```text
C x1 y1, x2 y2, x y
```

这里的最后一个坐标 (x,y) 表示的是曲线的终点，另外两个坐标是控制点，(x1,y1) 是起点的控制点，(x2,y2) 是终点的控制点。

```html
<path
  d="M 70 10 C 70 20, 110 20, 110 10"
  stroke="black"
  fill="transparent" />
```

#### 5.2.2、二次贝塞尔曲线 Q

二次贝塞尔曲线比三次贝塞尔曲线简单，只需要一个控制点，用来确定起点和终点的曲线斜率。因此它需要两组参数，控制点和终点坐标。

```text
Q x1 y1, x y
```

Q x1 y1 表示控制点

```html
<path d="M 10 80 Q 95 10 180 80" stroke="black" fill="transparent"/>
```

二次贝塞尔曲线有一个 T 命令，可以通过更简短的参数，延长二次贝塞尔曲线。

```html
<path
  d="M 10 80 Q 52.5 10, 95 80 T 180 80"
  stroke="black"
  fill="transparent" />
```

## 六、填充和边框

### 6.1、fill、stroke属性

在 svg 中可以使用 `fill` 和 `stroke` 两个属性进行涂色，`fill` 属性填充内部的颜色，`stroke` 属性设置绘制边框线条。

```html
<rect x="10" y="10" width="100" height="100" stroke="blue" fill="purple"
       fill-opacity="0.5" stroke-opacity="0.8"/>
```

属性 `fill-opacity` 控制填充色的不透明度，属性 `stroke-opacity` 控制描边的不透明度。

描边还有一些属性用来绘制描边方式，像 `stroke-width` 属性定义了描边的宽度，`stroke-linecap` 属性控制边框终点的形状，有三种可能值：

+ `butt` 用直边结束线段，它是常规做法，线段边界 90 度垂直于描边的方向、贯穿它的终点。
+ `square` 的效果差不多，但是会稍微超出`实际路径`的范围，超出的大小由 `stroke-width` 控制。
+ `round` 表示边框的终点是圆角，圆角的半径也是由 `stroke-width` 控制的。

还有一个 `stroke-linejoin` 属性，用来控制两条描边线段之间，用什么方式连接。

![image-20250714193847137](images/svg_stroke_linejoin_example.png)

每条折线都是由两个线段连接起来的，连接处的样式由 `stroke-linejoin` 属性控制，有三种可能值：

+ `miter` 是默认值，表示用方形画笔在连接处形成尖角
+ `round` 表示用圆角连接，实现平滑效果。
+ `bevel` 表示连接处会形成一个斜接。

最后还可以通过 `stroke-dasharray` 属性，将虚线应用在描边上

```html
<svg
  width="100%"
  height="500"
  version="1.1"
  xmlns="http://www.w3.org/2000/svg">
  <path
    d="M 10 75 Q 50 10 100 75 T 190 75"
    stroke="black"
    stroke-dasharray="3,15,10"
    fill="none" />
</svg>
```

### 6.2、css设置填充和边框

除了定义对象的属性外，你也可以通过 CSS 来样式化 `填充` 和 `描边`。语法和在 HTML 里使用 CSS 一样，只不过你要把 `background-color`、`border` 改成 `fill` 和 `stroke` 。注意，不是所有的属性都能用 CSS 来设置。上色和填充的部分一般是可以用 CSS 来设置的，比如 `fill`，`stroke`，`stroke-dasharray` 等，但是不包括下面会提到的 `渐变` 和 `图案` 等功能。另外，`width`、`height`，以及路径的命令等等，都不能用 CSS 设置。判断它们能不能用 CSS 设置还是比较容易的。

CSS 可以利用 style 属性插入元素的行间，或者可以移动到特殊的样式部分塞进 \<head\> 部分。在 svg 可以把样式包含在一个叫做 \<defs\> 的区域， \<defs\> 表示定义，里面可以定义一些不会在 SVG 图形中出现，但是可以被其他元素使用的元素。

```html
<svg
  width="100%"
  height="500"
  version="1.1"
  xmlns="http://www.w3.org/2000/svg">
  <defs>
    <style>
      <![CDATA[
             #MyRect {
               stroke: black;
               fill: red;
             }
          ]]>
    </style>
  </defs>
  <rect
    x="10"
    height="180"
    y="10"
    width="180"
    id="MyRect" />
</svg>
```

## 七、渐变

### 7.1、线形渐变

```html
<svg
  width="100%"
  height="500"
  version="1.1"
  xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="Gradient1">
      <stop
        stop-color="red"
        offset="0%" />
      <stop
        stop-color="black"
        stop-opacity="0.5"
        offset="40%" />
      <stop
        stop-color="blue"
        offset="100%" />
    </linearGradient>
  </defs>

  <rect
    x="10"
    y="10"
    rx="15"
    ry="15"
    width="100"
    height="100"
    fill="url(#Gradient1)" />
</svg>
```

### 7.2、径向渐变

```html
<svg
  width="100%"
  height="500"
  version="1.1"
  xmlns="http://www.w3.org/2000/svg">
  <defs>
    <radialGradient id="RadialGradient1">
      <stop
        offset="0%"
        stop-color="red" />
      <stop
        offset="100%"
        stop-color="blue" />
    </radialGradient>
    <radialGradient
      id="RadialGradient2"
      cx="0.25"
      cy="0.25"
      r="0.25">
      <stop
        offset="0%"
        stop-color="red" />
      <stop
        offset="100%"
        stop-color="blue" />
    </radialGradient>
  </defs>

  <rect
    x="10"
    y="10"
    rx="15"
    ry="15"
    width="100"
    height="100"
    fill="url(#RadialGradient1)" />
</svg>
```

## 八、图案

和渐变一样，\<pattern\> 需要放在 SVG 文档的 \<defs\> 内部。

```html
<svg
  width="100%"
  height="500"
  version="1.1"
  xmlns="http://www.w3.org/2000/svg">
  <pattern
    id="Pattern"
    x="0"
    y="0"
    width=".25"
    height=".25">
    <rect
      x="0"
      y="0"
      width="50"
      height="50"
      fill="skyblue" />
    <rect
      x="0"
      y="0"
      width="25"
      height="25"
      fill="red" />
    <circle
      cx="25"
      cy="25"
      r="20"
      fill="yellow"
      fill-opacity="0.5" />
  </pattern>

  <rect
    fill="url(#Pattern)"
    stroke="black"
    x="10"
    y="10"
    width="200"
    height="200" />
</svg>
```

## 九、文本

在 SVG 中有两种截然不同的文本模式。一种是写在图像中的文本，另一种是 SVG 字体。

### 9.1、设置文本和文本属性

```html
<text x="10" y="10">Hello World!</text>
```

属性 x 和属性 y 性决定了文本在视口中显示的位置。`text-anchor` 属性有这些值：start、middle、end 或 inherit，允许决定从这一点开始的文本流的方向。

属性 `fill` 可以给文本填充颜色，属性 `stroke` 可以给文本描边，形状元素和文本元素都可以引用渐变或图案。

还有其他属性 `font-family`、`font-style`、`font-weight`、`font-variant`、`font-stretch`、`font-size`、`font-size-adjust`、`kerning`、`letter-spacing`、`word-spacing`和`text-decoration`。

### 9.2、其他文本相关元素

`tspan` 元素用来标记大块文本的子部分，它必须是一个 `text` 元素或别的 `tspan` 元素的子元素。

```html
<text>
  <tspan font-weight="bold" fill="red">This is bold and red</tspan>
</text>
```

`textPath ` 元素利用它的 `xlink:href` 属性取得一个任意路径，把字符对齐到路径，于是字体会环绕路径、顺着路径走

```html
<path
  id="my_path"
  d="M 120,120 C 240,240 200,40 100,20"
  fill="transparent" />
<text>
  <textPath
    xmlns:xlink="http://www.w3.org/1999/xlink"
    xlink:href="#my_path">
    This text follows a curve.
  </textPath>
</text>
```

### 9.3、在SVG使用字体

```html
<font id="Super_Sans">
  <!-- and so on -->
</font>

<style>
  @font-face {
    font-family: "Super Sans";
    src: url(#Super_Sans);
  }
</style>

<text font-family="Super Sans">My text uses Super Sans</text>
```

使用远程字体

```html
<svg
  viewBox="0 0 400 50"
  width="350"
  height="50"
  xmlns="http://www.w3.org/2000/svg">
  <style>
    /* 使用 Web 字体定义字体家族 */
    @font-face {
      font-family: "FiraSans";
      src:
        url("https://mdn.github.io/shared-assets/fonts/FiraSans-Italic.woff2")
          format("woff2"),
        url("https://mdn.github.io/shared-assets/fonts/FiraSans-Bold.woff2")
          format("woff2");
    }

    /* 装饰文本 */
    text {
      /* 指定使用的系统字体或自定义字体 */
      font-family: "FiraSans", sans-serif;

      /* 添加其他样式 */
      font-size: 24px;
      font-weight: bold;
      font-style: italic;
    }
  </style>
  <text x="10" y="20">使用自定义字体装饰的文本</text>
</svg>
```

## 十、基础变形

\<g\> 标签是SVG（可缩放矢量图形）中的一个元素，用于对多个SVG元素进行分组。也可以把属性赋给一整个元素集合。

```html
<svg
  width="100%"
  height="250"
  version="1.1"
  xmlns="http://www.w3.org/2000/svg">
  <g fill="red">
    <rect
      x="0"
      y="0"
      width="10"
      height="10" />
    <rect
      x="20"
      y="0"
      width="10"
      height="10" />
  </g>
</svg>
```

在 \<g\> 元素设置 width、height 属性会不起效果、\<g\> 元素的高度和宽度由子元素进行撑开的。

### 10.1、平移

```html
<rect x="0" y="0" width="10" height="10" transform="translate(30,40)" />
```

### 10.2、旋转

```html
<rect x="20" y="20" width="20" height="20" transform="rotate(45)" />
```

### 10.3、斜切

斜切可以通过 skewX 和 skewY 进行变形

```html
<rect
  x="0"
  y="0"
  width="50"
  height="50"
  transform="skewX(15)" />
```

### 10.4、缩放

缩放通过 scale() 进行变形

```html
<rect
  x="0"
  y="0"
  width="50"
  height="50"
  transform="scale(1.5)" />
```

## 十一、SVG工具

这里主要推荐一些工具制作或呈现 SVG 文件，详细见 [MDN](https://developer.mozilla.org/zh-CN/docs/Web/SVG/Tutorials/SVG_from_scratch/Tools_for_SVG)

| 工具名            | 地址                                                         |
| ----------------- | ------------------------------------------------------------ |
| Inkscape          | [www.inkscape.org](https://inkscape.org/)                    |
| Adobe Illustrator | [www.adobe.com/products/illustrator](https://www.adobe.com/products/illustrator.html) |
| Apache Batik      | [xmlgraphics.apache.org/batik/](https://xmlgraphics.apache.org/batik/) |
| Snap.svg          | [snapsvg.io](http://snapsvg.io/)                             |



### 




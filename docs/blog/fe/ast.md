---
title: AST
description: AST抽象语法树
sidebar_label: AST抽象语法树
hide_title: true
---

## 一、AST是什么和如何生成？

### 1.1、AST理论概念

> AST 是一种源代码的抽象语法结构的树形表示。树中的每个节点都表示源代码中出现的一个构造。

在计算机科学中，抽象语法树（Abstract Syntax Tree，AST），或简称[语法树](https://baike.baidu.com/item/语法树/7031301?fromModule=lemma_inlink)（Syntax tree），是[源代码](https://baike.baidu.com/item/源代码?fromModule=lemma_inlink)[语法](https://baike.baidu.com/item/语法?fromModule=lemma_inlink)结构的一种抽象表示。它以树状的形式表现[编程语言](https://baike.baidu.com/item/编程语言?fromModule=lemma_inlink)的语法结构，树上的每个节点都表示源代码中的一种结构。 (来源：百度解释)

**"源代码语法结构的一种抽象表示"**，注意这句话，它是我们理解 AST 的关键。这句话大概的意思就是，按照某种约定的规范，以树形的数据结构，把我们的代码描述出来

### 1.2、AST（@babel/parser）的生成过程

> 推荐一个常用的 [AST](https://astexplorer.net/) 在线转换网站

编译图解:

![](https://gitee.com/caigh1012/assets/raw/main/blog/fe/ast/babel.png)

简单实现使用var定义变量改成let，具体代码实现过程：

```js
const { parse } = require('@babel/parser');
const { default: generate } = require('@babel/generator');
const fs = require('fs');

// 源代码
const code = `var name='jack'`;

// 将源代码解析成ast
const ast = parse(code);
// ast写入json文件中
fs.writeFileSync('./babel.json', JSON.stringify(ast, null, '\t'));

// 修改ast
const { program } = ast;
const newBody = program.body?.map((node) => {
  if (node.type === 'VariableDeclaration' && node.kind === 'var') {
    node.kind = 'let';
    return node;
  }
  return node;
});

// 重新生成代码
const targetCode = generate({ ...ast, program: { ...program, newBody } });
console.log(targetCode.code);
```

结果：

![1677487532483](https://gitee.com/caigh1012/assets/raw/main/blog/fe/ast/1677487532483.png)

## 二、AST遍历流程

代码如下:

```js
const esprima = require('esprima');
const estraverse = require('estraverse');
const code = `function getUser() {}`;
// 生成 AST
const ast = esprima.parseScript(code);
// 转换 AST，只会遍历 type 属性
// traverse 方法中有进入和离开两个钩子函数
estraverse.traverse(ast, {
  enter(node) {
    console.log('enter -> node.type', node.type);
  },
  leave(node) {
    console.log('leave -> node.type', node.type);
  },
});
```

输出结果如下:

![1677489224740](https://gitee.com/caigh1012/assets/raw/main/blog/fe/ast/1677489224740.png)

由此可以得到 AST 遍历的流程是深度优先，遍历过程如下：

![](https://gitee.com/caigh1012/assets/raw/main/blog/fe/ast/ast-traverse.jpg)

## 三、V8的AST与acorn实现的AST的异同点

### 3.1、V8形成的抽象语法树

V8是Google开源的JavaScript引擎，被广泛应用各种JavaScrpit执行环境， 但很多前端开发人员对 V8 的理解还停留在表面，只是单纯地使用 JavaScript 和调用 Web API，并不了解 V8 这个“黑盒”内部是如何工作的。

只有搞清楚这个问题，你才能写出性能更好、更优雅的 JavaScript代码。同时，了解 JavaScript的执行原理，也能让你能更轻松理解 Babel 的词法分析和语法分析原理、ESLint 的语法检查机制、React.js 和 Vue 前端框架的底层实现，以后再面对新的技术和框架，也能以不变应万变。

![1677488430721](https://gitee.com/caigh1012/assets/raw/main/blog/fe/ast/1677488430721.png)

js编译原理分析过程：

1. 词法分析(Lexical Analysis)
2. 语法解析(Syntax Analysis)
3. ...
4. 代码生成(Code Generation)

![](https://gitee.com/caigh1012/assets/raw/main/blog/fe/ast/ast_parser.png)

词法分析阶段

> 其中词法分析阶段扫描输入的源代码字符串，生成一系列的词法单元 (tokens)，这些词法单元包括数字，标点符号，运算符等。词法单元之间都是独立的，也即在该阶段我们并不关心每一行代码是通过什么方式组合在一起的。

![](https://gitee.com/caigh1012/assets/raw/main/blog/fe/ast/code-token.png)

<span className="highlight">通俗解释：</span>词法分析阶段——仿佛最初学英语时，将一个句子拆分成很多独立的单词，我们首先记住每一个单词的类型和含义，但并不关心单词之间的具体联系。

语法解析阶段

> 语法分析阶段就会将上一阶段生成的 token 列表转换为如下图右侧所示的 AST，根据这个数据结构大致可以看出转换之前源代码的基本构造。

![](https://gitee.com/caigh1012/assets/raw/main/blog/fe/ast/parsing.png)

<span className="highlight">通俗解释：</span>语法分析阶段——老师教会我们每个单词在整个句子上下文中的具体角色和含义。

代码生成阶段

该阶段是一个非常自由的环节，可由多个步骤共同组成。在这个阶段我们可以遍历初始的 AST，对其结构进行改造，再将改造后的结构生成对应的代码字符串。

![](https://gitee.com/caigh1012/assets/raw/main/blog/fe/ast/transtion.png)

<span className="highlight">通俗解释：</span>我们已经弄清楚每一条句子的语法结构并知道如何写出语法正确的英文句子，通过这个基本结构我们可以把英文句子完美地转换成一个中文句子或是文言文（如果你会的话）。

V8具体生成的AST抽象语法树

![1677489661801](https://gitee.com/caigh1012/assets/raw/main/blog/fe/ast/1677489661801.png)

### 3.2、acorn生成的抽象语法树

js代码：

```js
const acorn = require('acorn');
const fs = require('fs');
const code = `var num = 10;`; // 源代码

// 形成ast对象写入json
fs.writeFileSync(
  './ast.json',
  JSON.stringify(acorn.parse(code, { ecmaVersion: 2020 }), null, '\t'),
);
```

形成的AST对象：

```json
{
  "type": "Program",
  "start": 0,
  "end": 13,
  "body": [
    {
      "type": "VariableDeclaration",
      "start": 0,
      "end": 13,
      "declarations": [
        {
          "type": "VariableDeclarator",
          "start": 4,
          "end": 12,
          "id": {
            "type": "Identifier",
            "start": 4,
            "end": 7,
            "name": "num"
          },
          "init": {
            "type": "Literal",
            "start": 10,
            "end": 12,
            "value": 10,
            "raw": "10"
          }
        }
      ],
      "kind": "var"
    }
  ],
  "sourceType": "script"
}
```

### 3.3、两者的异同点(个人总结和个人观点)

异：@babel/parser、acorn等形成AST语法树对象结构不相同，生成目的和ast生成的时机不同。V8内由C++实现，@babel/parser、acorn则是通过js解析js

同：思想形式是差不多

## 四、AST的具体实现和用途

### 1、目前前端实现的AST

- acorn(webpack)
- @babel/parser(babel)
- @typescript-eslint/parser(typescript)
- espree(Eslint)

同时还有postcss-css的形成css的AST语法树

### 2、AST的具体实现用途

以前端为例：

- 代码高亮、格式化、错误提示、自动补全等；ESLint、Prettier等
- 代码压缩混淆：uglifyJS等
- 代码转译：webpack、babel、TypeScript等。
- css抽象语法树实现的px-to-rem、属性添加前缀等

---
outline: deep
---

# 正则表达式

## 一、创建正则表达式的方式

### 1.1、使用字面量创建正则表达式

```javascript
var reg = /abcdefg/; // 正则表达式里面不需要加引号，不管是数字型还是字符串型, 控制台输出的是字体颜色为红色
```

### 1.2、使用RegExp构造函数创建正则表达式

RegExp构造函数有两个参数

+ 第一个参数为字符串型，生成正则表达式时会去除引号自动加上  /   / 
+ 第二个参数为修饰符，是一个可选项，一般为 g：全局匹配，i:不分大小写，传参时不分顺序，也可以同时传也可以单独传

```javascript
var reg = new RegExp('^abcde$');
console.log(reg2); // 输出的是 /^abcde$/ 且为字体颜色为红色
```

### 1.3、也可以省略new关键字来创建

```javascript
var reg = RegExp('^abcde$');
console.log(reg2); //输出的是 /^abcde$/ 且为字体颜色为红色
```

### 1.4、变量形式构建正则表达式

```javascript
let url = 'www.baidu.com'
let str = '.com'
console.log(/str/.test(url)) // 输出： false
```

这里的 str 变量被作为一个字符串进行正则匹配，如果需要正则表达式传入一个变量，可以有以下操作：

eval函数（大部分不会使用）

```javascript
let url = 'www.baidu.com'
let str = '.com'
console.log(eval(`/${str}/`).test(url)) // 输出：true
```

构造函数

```javascript
let url = 'www.baidu.com'
let str = '.com'
const reg = new RegExp(str)
console.log(reg.test(url)) // 输出：true
```

## 二、正则标识符

i：表示忽略大小写，写在正则的最后面

g：表示全局匹配，写在正则的最后面

```javascript
let str = 'dahbwWJwdWajbDWBA'
console.log(str.match(/w/)) // 输出: [ 'w', index: 4, input: 'dahbwWJwdWajbDWBA', groups: undefined ]
console.log(str.match(/w/g)) // 输出: ['w', 'w']
console.log(str.match(/w/gi)) // 输出: ['w', 'W', 'w', 'W', 'W']
```

> [!WARNING]
> g，i 标识符都是写在正则的最后面，不做顺序的区分

## 三、正则表达式字符

### 3.1、元字符

在正则表达式有特殊含义的字符

| 元字符 | 含义                         |
| :----- | :--------------------------- |
| .      | 匹配单个的任意字符           |
| \w     | 匹配单个的数字，字母，下划线 |
| \W     | 匹配单个非数字，字母，下划线 |
| \d     | 匹配单个数字                 |
| \D     | 匹配单个非数字               |
| \s     | 匹配空白字符                 |
| \S     | 匹配非空白字符               |

### 3.2、限定符

一般限定符配合元字符使用

| 限定符  | 含义                                                         |
| ------- | :----------------------------------------------------------- |
| *       | 表示前一个内容（任意的单个字符）重复至少 0 次，也就是可以出现 0 ～ 正无穷次 |
| +       | 前一个内容（任意的单个字符）重复至少 1 次，也就是可以出现 1 ～ 正无穷次 |
| ?       | 前一个内容（任意的单个字符）重复 0 或者 1 次，也就是可以出现 0 ～ 1 次 |
| \{n\}   | 前一个内容（任意的单个字符）重复 n 次，也就是必须只能出现 n 次 |
| \{n,\}  | 前一个内容（任意的单个字符）至少出现 n 次，也就是出现 n ～ 正无穷次 |
| \{n,m\} | 前一个内容（任意的单个字符）至少出现 n 次至多出现 m 次，也就是出现 n ～ m 次 |

```javascript
var str = '11';
var str1 = '151';
var str2 = '1560051';
// 检测 ?
console.log('-------???--------');
var reg2 = /1\d?1/; //前一个内容重复 0 或者 1 次，也就是可以出现 0 ～ 1 次
console.log(reg2.test(str)); //true 出现0次
console.log(reg2.test(str1)); //true 出现1次
console.log(reg2.test(str2)); //false 出现5次  

// 检测{n,m} 
console.log('-----------{n,m} {n,m} {n,m} -----------');
var reg5 = /1\d{2,4}1/;
var nm = '1525561';
var nm1 = '156541';
var nm2 = '14861';
var nm3 = '1481';
var nm4 = '151';
console.log(reg5.test(nm));//false 出现了5次
console.log(reg5.test(nm1)); //true 出现了4次
console.log(reg5.test(nm2));//true 出现了3次
console.log(reg5.test(nm3)); //true 出现了2次
console.log(reg5.test(nm4)); //false  出现了1次
```

> [!WARNING]
> 单纯使用限定符配合元字符使用（ /\d+/ ）对于一些验证可能不太准确，可以使用类似（/1\d?1/）加以限定开始和结尾

### 3.3、转义字符

#### 3.3.1、字面量的转义

错误示例：

```javascript
let price = '115.55'
// . 除换行外任何字符，.普通点
console.log(/\d+.\d+/.test(price)) // 输出：true

// 将 price 改为 '115@55'
let price = '115@55'
console.log(/\d+.\d+/.test(price)) // 输出：true
```

原因是正则表达式的 `.` 并不是普通点，而是表示 `元字符 .` ，所以前面需要加 `\` 来进行转义

正确示例：

```javascript
let price = '115.55'
// . 除换行外任何字符，.普通点
console.log(/\d+\.\d+/.test(price)) // 输出：true

let price = '115@55'
console.log(/\d+\.\d+/.test(price)) // 输出：false
```

#### 3.3.2、构造函数传入字符串时的转义

错误示例：

```javascript
let price = '115.55'
console.log(/\d+\.\d+/.test(price)) // 输出：true

let reg = new RegExp("\d+\.\d+")
console.log(reg.test(price)) // 输出：false
```

可以看到上面的为 true，下面的为 false，原因是在字符串里面 `\d == d`，所以这里的 \ 需要在加一个 \ 进行转义

正确示例：

```javascript
let price = '115.55'
// . 除换行外任何字符，.普通点
console.log(/\d+\.\d+/.test(price)) // 输出：true

let reg = new RegExp("\\d+\\.\\d+")
console.log(reg.test(price)) // 输出：false
```

### 3.4、边界符

主要有两个 ^，$

| 边界符       | 含义                                    |
| ------------ | --------------------------------------- |
| ^            | 表示匹配行首的文本（以谁开始)           |
| $            | 表示匹配行首的文本（以谁结束)           |
| 如果^和$一起 | 表示以同一个开始同一个结尾 --- 精确匹配 |

```javascript
var reg1 = /^abc/;
// /^abc/ 以 abc 开头的返回 true
console.log(reg1.test('abc')); // true
console.log(reg1.test('abcd')); // true
console.log(reg1.test('aabcd')); // false
console.log('======================');
var reg2 = /^abc$/; // 精确匹配 要求必须是 abc 字符串才符合
console.log(reg2.test('abc')); //true
console.log(reg2.test('abcd')); //false
console.log(reg2.test('aabcd')); //false
console.log(reg2.test('abcabc')); //false
```

### 3.5、字符类

| 字符 | 含义                                                       |
| ---- | ---------------------------------------------------------- |
| []   | 匹配单个范围内的字符                                       |
| [-]  | 方括号内部范围符                                           |
| [^]  | 如果中括号里面有 ^ 表示取反的意思，千万和我们边界 ^ 别混淆 |

### 3.6、括号总结

| 括号 | 含义                           |
| ---- | ------------------------------ |
| []   | 字符集合，匹配括号中任意的字符 |
| {}   | 量词符，里面表示重复的次数     |
| ()   | 表示优先级                     |

```javascript
//小括号 表示优先级
var reg2 = /^(abc){3}$/; // 它只是表示让 abc 重复三遍
console.log(reg2.test('abccc')); // false
console.log(reg2.test('abcabcabc')); // true
```

## 四、正则表达式方法

### 4.1、正则表达式对象只有两个方法

#### 4.1.1、test

格式：正则.test(字符串)

功能：在字符串中匹配这个正则是否存在

返回值：如果匹配成功返回 true，匹配失败则返回 false

```javascript
let price = '115.55'
console.log(/\d+\.\d+/.test(price)) // 输出：true

let price = '115@55'
console.log(/\d+\.\d+/.test(price)) // 输出：false
```

#### 4.1.2、exec

格式：正则.exec(字符串)

功能：在字符串中匹配这个正则是否存在

返回值：匹配成功，只返回一个装有字符串的数组，匹配失败返回 null

```javascript
let str = 'abgswbdhabw'
console.log((/a/gi).exec(str1)) // 输出： ['a', index: 0, input: 'abgswbdhabw', groups: undefined]
```

### 4.2、字符串方法里的正则表达式(属于字符串方法)

#### 4.2.1、match

格式：字符串.match(正则)

功能：在字符串匹配是否符合正则表达式

返回值：匹配成功，返回装有匹配的字符串的数组匹配失败，返回 null

```javascript
let str = 'dahbwWJwdWajbDWBA'
console.log(str.match(/w/)) // 输出: [ 'w', index: 4, input: 'dahbwWJwdWajbDWBA', groups: undefined ]
console.log(str.match(/w/g)) // 输出: ['w', 'w']
console.log(str.match(/w/gi)) // 输出: ['w', 'W', 'w', 'W', 'W']
```

#### 4.2.2、replace

格式：字符串.replace(oldStr/正则, newStr)

功能：用newStr将oldStr替换

返回值：替换成功的新字符串

```javascript
let str = 'abgswbdhabw'
console.log(str.replace(/a/, '-')) // 输出：-bgswbdhabw
console.log(str.replace(/a/g, '-')) // 输出：-bgswbdh-bw
```

#### 4.2.3、split

格式：字符串.split(分割符/正则)

功能：用分割符将原字符串进行分割

返回值：分割剩下的字符串数组

```javascript
let str = 'abgswbdhabw'
console.log(str.split(/b/)) // 输出：['a', 'gsw', 'dha', 'w']
```

#### 4.2.4、search

格式：字符串.search(字符串/正则)

语法：找到符号条件的字符串第一次出现的位置

返回值：有的话返回索引，没有返回 -1，全局匹配标识符 (g) 此处没有作用

```javascript
let str = 'abgswbdhabw'
console.log(str.search(/bd/)) // 输出：5
console.log(str.search(/o/)) // 输出：-1
```

## 五、正则高级使用

### 5.1、$符在正则替换中的使用

```javascript
// $符
const phone = '(010)95668845' // 目的替换成(010)-95668845
const newPhone = phone.replace(/(\(\d{3}\))(\d{7,8})/,"$1-$2")
console.log(newPhone); // 打印结果：(010)-95668845
```

### 5.2、$&使用

```javascript
// $&
const chats = '我是一个大帅哥'
const newChats = chats.replace(/大帅哥/, '<a herf="blog.chason.website">$&</a>')
console.log(newChats); // 打印结果：我是一个<a herf="blog.chason.website">大帅哥</a>
```

### 5.3、模式匹配

```javascript
let str01 = "Oh！,Oh！,Oh！,it's impossible"
let regStr = /(Oh！,)\1\1/
console.log(regStr.test(str01)) // 输出：true
console.log(str01.match(regStr)[0]) // 输出：Oh！,Oh！,Oh！,

let str02 = 'wow! wow! '
let regStr02 = /(?:wow! ){1,2}/g
console.log(regStr02.test(str02)) // 输出：true
console.log(str02.match(regStr02)) // 输出：[ 'wow! wow! ' ]
```

### 5.4、断言匹配

?= 先行断言

```javascript
// ?=先行断言
const regExp = /喜欢(?=你)/
console.log(regExp.test('喜欢你')) // 输出：true
console.log(regExp.test('喜欢我')) // 输出：false
console.log(('喜欢你').match(regExp)) // 输出：[ '喜欢', index: 0, input: '喜欢你', groups: undefined ] 这个?=后面的条件不会返回，匹配成功只会返回 喜欢
console.log(('喜欢我').match(regExp)) // 输出：null
```

?<= 后行断言

```javascript
// ?<=后行断言
const regExp01 = /(?<=英雄)联盟/
console.log(regExp01.test('英雄联盟')) // 输出：true
console.log(regExp01.test('狗熊联盟')) // 输出：false
console.log(('英雄联盟').match(regExp01)) // 输出：[ '联盟', index: 2, input: '英雄联盟', groups: undefined ]
console.log(('狗熊联盟').match(regExp01)) // 输出：null
```

?! 正向否定断言

```javascript
// ?!正向否定查找
const regExp03 = /喜欢(?!你)/
console.log(regExp03.test('喜欢你')) // 输出：false
console.log(regExp03.test('喜欢我')) // 输出：true
console.log(('喜欢你').match(regExp03)) // 输出：null
console.log(('喜欢我').match(regExp03)) // 输出：[ '喜欢', index: 0, input: '喜欢你', groups: undefined ] 这个?!后面的条件不会返回，匹配成功只会返回 喜欢
```

?<! 反向否定断言

```javascript
// 反向否定查找
const regExp04 = /(?<!英雄)联盟/
console.log(regExp04.test('英雄联盟')) // 输出：false
console.log(regExp04.test('狗熊联盟')) // 输出：true
console.log(('英雄联盟').match(regExp04)) // 输出：null
console.log(('狗熊联盟').match(regExp04)) // 输出：[ '联盟', index: 2, input: '英雄联盟', groups: undefined ]
```

## 六、正则表达式实践

### 6.1、实现一个千分位

```javascript
function parseToMoney(num) {
  num = parseFloat(num.toFixed(3));
  let [integer, decimal] = String.prototype.split.call(num, '.');
  integer = integer.replace(/\d(?=(\d{3})+$)/g, '$&,');
  console.log(integer, "<___integer")
  return integer + '.' + (decimal ? decimal : '');
}

parseToMoney(1556697.8875) // 输出：1,556,697
```

### 6.2、去除字符串html标签

```javascript
const html = `sa11<div>55555</div>ada, <span>4545</span>dsa1`
console.log(html.replace(/<[^>]+>/g, ""))
```

### 6.3、实现一个保留小数点后两位

```javascript
// 实现保留两位小数
function toSlice(num) {
  let [integer, decimal] = String.prototype.split.call(num, '.');
  if(decimal.length < 2) {
    return integer + '.' + decimal + 0
  }
  decimal = decimal.replace(/(\d{2})(\d+)/,'$1')
  return integer + '.' + decimal
}

console.log(toSlice(1556697.8875)) // 输出: 1556697.88
console.log(toSlice(15663.2)) // 输出： 15663.20
```

### 6.4、是否包含中文

```javascript
function hasCn(str) {
  return /[\u4e00-\u9fa5]/.test(str)
}

console.log(hasCn('汉字')) // 输出：true
console.log(hasCn('554ww')) // 输出：true
```

### 6.5、解析url参数

```javascript
// 解析url参数，使用正则表达式来匹配URL中的查询字符串（query string），例如 ?key=value
function getQueryParams(url) {
  // 使用正则表达式匹配查询字符串
  const regex = /[?&]([^=&#]+)=([^&#]*)/g;
  const params = {};
  let match;
  while ((match = regex.exec(url))) {
    params[decodeURIComponent(match[1])] = decodeURIComponent(match[2]);
  }
  return params;
}

const url = 'https://example.com/page?name=John&age=30&city=New%20York';
const params = getQueryParams(url);
console.log(params);
```


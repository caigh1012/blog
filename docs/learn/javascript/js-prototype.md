---
id: prototype
title: JavaScript原型(链)及继承
description: JavaScript原型(链)及继承
sidebar_label: JavaScript原型(链)及继承
hide_title: true
last_update:
  date: 2023-03-05
  author: Chason
---

## 一、常见创建对象的几种方式

### 1.1、字面量创建

```js
/*
 * 字面量创建对象
 */
let person = { name: '张三', age: '18' };
console.log(person);
```

### 1.2、new Object()创建

```js
/*
 * new Object创建
 */
let person02 = new Object({ name: '李四', age: 5 });
console.log(person02);
```

### 1.3、构造函数

```js
/*
 * 构造函数
 */
// 创建一个Car类型，属性有车子类型，轮胎数量，行驶多少公里等属性
function Car(carType, tireNum, travelledDistance) {
  this.carType = carType;
  this.tireNum = tireNum;
  this.travelledDistance = travelledDistance;
  this.print = function () {
    console.log(this.carType, this.tireNum, this.travelledDistance);
  };
}

const sedan = new Car('小汽车', 4, 2000);
sedan.print();
const bus = new Car('大巴', 8, 25500);
bus.print();
```

## 二、构造函数

### 2.1、构造函数定义

专门用来创建一个指定的对象的 构造函数就是普通的函数,创建方式和普通函数没有区别，用new关键字来进行调用的函数称为构造函数，一般首字母要大写。

### 2.2、构造函数意义

使用对象字面量创建一系列同一类型的对象时，这些对象可能具有一些相似的特征(属性)和行为(方法)，此时会产生很多重复的代码，把这些重复性的特征和属性抽象出来，做成构造函数，可以实现代码复用。举个浅显的例子，比如要生产10000个不同的纸盒子，如果按照常规的方法，就需要手动裁10000次纸，画10000次图案，这样太费时费工，而且如果数量进一步扩大，会造成更大的麻烦。但是如果造一个机器，机器中有盒子的模型，在造盒子之前只需要将盒子的尺寸和图案当做参数输入进去，那么生产盒子的效率就会大幅提高，盒子生产出来之后里边装什么东西，再进行差异化处理就行，需要汉堡的时候放汉堡，需要放披萨的时候放披萨，各自使用就好。这里边这个机器就相当于构造函数，可以反复使用生产一些自带属性和特征的初始对象。

```js
function Person(name, age) {
  // Person是一个构造函数
  /*构造函数中，实例成员就是构造函数内部通过this添加的成员，name、age、say就是实例成员（个人理解就是构造函数在实例化以后可以访问的成员）*/
  this.name = name;
  this.age = age;
  this.say = function () {
    console.log('我是人');
  };
}
Person.height = '165'; // 在构造函数上添加的成员就成为静态成员

var p1 = new Person('张三', 25); // 实例化对象

/* 通过prototype添加的成员不是静态成员，是实例成员，也就是只要是实例化的对象都可以访问到 */
Person.prototype.weight = '70kg';
console.log(p1.weight); // 70kg
console.log(Person.weight); // undefined

/*静态成员只能通过构造函数进行访问*/
console.log(Person.height); // 输出165
console.log(p1.height); // 输出undefined

/* 实例成员只能通过实例对象进行访问 */
console.log(p1.name); // 输出张三
p1.say(); // 输出我是人
console.log(Person.age); // 输出undefined
Person.say(); // 报错，Person.say is not a function
```

## 三、原型和原型链

### 3.1、原型

定义：在JavaScript中，每定义一个对象（函数也是对象），对象中都会包含一些预设的属性。所有的函数对象都有一个prototype属性，这个属性指向一个对象，该对象称为函数的原型对象。

原型对象的定义很简单，就是在函数对象中添加一个属性，这个属性的值是另一个对象。这似乎没什么值得讨论的，普通对象也可以这样做。之所以原型对象值得单独讨论，是因为原型对象的特别之处在于原型对象中的方法和属性都可以被这个函数的实例对象所访问。原型对象就像一个公共区域，一个函数的原型对象可以被该函数创建的所有实例对象访问。

```js
function Fun() {}
let f = new Fun();
Fun.prototype.test = function () {};
console.log(f.test); //f可以访问test这个方法
```

上面的代码中，利用函数 Fun 创建一个实例对象 f，接着给函数的原型对象 Fun.prototype 添加了一个方法 test。正常的思维来讲，test 是定义给 Fun.prototype 这个对象的方法，f 这个对象并不能访问到 test 方法。但是最后运行代码时，浏览器并未报错，反而访问到了test方法，这就是因为 f 是函数 Fun 的实例对象，所以对于f来说，Fun 的原型对象 Fun.prototype 中所有的属性和方法都是可以访问的。

上面提到了函数的原型对象，一般我们将函数的 prototype 属性指向的对象称为函数的显示原型，这是函数对象所独有的，其他类型的对象不具有这个属性。有了显示原型，自然也就存在隐式原型，它的名称是 _ proto _，这个属性是所有的对象都有的，它指向也是一个对象。**一个对象的隐式原型指向的是它的构造函数的显示原型**代码简单验证一下。

```js
function Fn() {}
console.log(Fn.prototype);

let fn = new Fn();
console.log(fn.__proto__);

console.log(Fn.prototype === fn.__proto__); //true
```

### 3.2、原型链

原型链的定义就是由原型对象组成的链式结构。前文中提到函数的显示原型和它的实例对象的隐式原型指向的是同一个对象，而所有的对象都是具有隐式原型的，则原型对象也不例外，他也有自己的构造函数和原型对象。这样就构成了一个由原型对象组成的链式结构，称为原型链。

为了防止原型链陷入死循环，设置了一个原型链的终点 Object.prototype 对象。因为所有的对象都可以视为是由 Objcet 创建的，同时该对象的隐式原型为 null。

```js
console.log(Object.prototype.__proto__); //null
```

粗略来看，原型和原型链就是一个可供某类对象访问的公共区域，似乎不如我们直接把属性和方法定义在特定对象中方便。但是当数据量相当庞大的时候，原型链的作用就越发凸显了，只要在原型中定义一个方法，所有的对象都能通过原型链来访问这个方法，而不用为每一个对象定义一个方法，这样的作法既可以节约代码量，又能提高性能节约内存资源。
关于原型链有几个常用的概念：

- 访问一个对象的属性时，首先在对象中自身寻找，未找到则沿着原型链网上寻找，原型链中不存在对应方法则返回undefined。
- 定义对象属性的时候不会访问原型链，而是直接定义在对象中。
- 方法一般定义在原型对象中，属性一般通过构造函数定义在对象中。

案例：

```js
function Fn() {}
Fn.prototype.a = 'xxx';
let fn = new Fn();
let fn2 = new Fn();
console.log(fn.a); //xxx
fn2.a = 'yyy';
console.log(fn2.a); //yyy
console.log(fn, fn2);

function Person(name, age) {
  this.name = name;
  this.age = age;
}

Person.prototype.setName = function (name) {
  this.name = name;
};

let p1 = new Person('Tom', 12);
p1.setName('Bob');
console.log(p1);
let p2 = new Person('Kite', 18);
p2.setName('Rose');
console.log(p2);
```

### 3.3、原型链结构图

![](https://gitee.com/caigh1012/assets/raw/main/learn/javascript/extends/2023-05-29-1685365671-840b08.jpg)

## 四、继承

### 4.1、原型链继承

```js
// 父类型
function Person(name, age) {
  this.name = name;
  this.age = age;
  this.play = [1, 2, 3];
  this.setName = function () {}; // 父类私有方法
}

Person.prototype.setAge = function () {}; // 父类公有方法

// 子类型
function Student(price) {
  this.price = price;
  this.setScore = function () {}; // 子类私有方法
}

// Student.prototype.sayHello = function () { console.log(this.price, '<----price'); }  //在这里写子类的原型方法和属性是无效的，
//因为会改变原型的指向，所以应该放到重新指定之后
Student.prototype = new Person();
Student.prototype.sayHello = function () {
  console.log(this.price, '<----price');
};
var s1 = new Student(1400);
var s2 = new Student(1500);
console.log(s1, '<----s1');
console.log(s2, '<----s2');
s1.play.push(4);
console.log(s1.play, '<----s1'); // 输出：[ 1, 2, 3, 4 ]
console.log(s2.play, '<----s2'); // 输出：[ 1, 2, 3, 4 ]
```

<span >缺点：</span>

1. 当父类私有属性为引用类型时，不同对象均可实现修改，无法实现多继承
1. 来自原型对象的所有属性均被共享
1. 想要给子类添加属性和方法，必须在 Student.prototype = new Person() 之后执行，不能放到构造器中

### 4.2、借用构造函数继承

```js
function Person(name, age) {
  this.name = name;
  this.age = age;
  this.setName = function () {};
}
Person.prototype.setAge = function () {
  console.log(this.age, '<---age');
};
function Student(name, age, price) {
  Person.call(this, name, age); // 相当于: this.Person(name, age)
  /* this.name = name
    this.age = age */
  this.price = price;
}
let s1 = new Student('Tom', 25, 300000);
// s1.setAge()  // Uncaught TypeError: s1.setAge is not a function
console.log(s1, '<----s1');
```

<span >缺点：</span>

1. 只能继承父类的实例属性和方法，不能继承原型属性和方法
1. 无法实现函数复用，每个子类都有父类实例函数的副本，影响性能
1. 实例并不是父类的实例，只是子类的实例

### 4.3、原型链和构造函数继承

```js
function Person(name, age) {
  this.name = name;
  this.age = age;
  this.setAge = function () {};
}
Person.prototype.setAge = function () {
  console.log('11111');
};
let p1 = new Person();
function Student(name, age, price) {
  Person.call(this, name, age);
  this.price = price;
  this.setScore = function () {};
}
Student.prototype = new Person();
Student.prototype.constructor = Student; // 组合继承也是需要修复构造函数指向的
let s1 = new Student('Tom', 20, 15000);
let s2 = new Student('Jack', 22, 14000);
console.log(s1);
console.log(s1.constructor); //Student
console.log(p1.constructor); //Person
```

<span >缺点：</span>
调用了两次父类构造函数，生成了两份实例

### 4.4、组合继承优化1

```js
function Person(name, age) {
  this.name = name;
  this.age = age;
  this.setAge = function () {};
}
Person.prototype.setAge = function () {
  console.log('111');
};
function Student(name, age, price) {
  Person.call(this, name, age);
  this.price = price;
  this.setScore = function () {};
}
Student.prototype = Person.prototype;
Student.prototype.sayHello = function () {};
let s1 = new Student('Tom', 20, 15000);
console.log(s1);

// 但这种方式没办法辨别是对象是子类还是父类实例化
console.log(s1 instanceof Student, s1 instanceof Person); // 输出：true true
console.log(s1.constructor); // Person
```

<span >优点：</span>
不会初始化两次实例方法/属性，避免的组合继承的缺点

<span >缺点：</span>
没办法辨别是实例是子类还是父类创造的，子类和父类的构造函数指向是同一个。

### 4.5、组合继承优化2

```js
// 借助原型可以基于已有的对象来创建对象，var B = Object.create(A)以A对象为原型，生成了B对象。B继承了A的所有属性和方法。
function Person(name, age) {
  this.name = name;
  this.age = age;
}
Person.prototype.setAge = function () {
  console.log('111');
};
function Student(name, age, price) {
  Person.call(this, name, age);
  this.price = price;
  this.setScore = function () {};
}
console.log(Object.create(Person.prototype), '<-----Object.create');
Student.prototype = Object.create(Person.prototype); // 核心代码
Student.prototype.constructor = Student; // 核心代码
let s1 = new Student('Tom', 20, 15000);
console.log(s1 instanceof Student, s1 instanceof Person); // 输出：true true
console.log(s1.constructor); //Student
console.log(s1);
```

### 4.6、class继承

```js
class Person {
  // 调用类的构造方法
  constructor(name, age) {
    this.name = name;
    this.age = age;
  }

  //定义一般的方法 最终显示在prototype上
  showName() {
    console.log('调用父类的方法');
    console.log(this.name, this.age);
  }
}
let p1 = new Person('kobe', 39);
console.log(p1, '<-----p1');

//定义一个子类
class Student extends Person {
  constructor(name, age, salary) {
    super(name, age); // 通过super调用父类的构造方法
    this.salary = salary;
  }
  showName() {
    //在子类自身定义方法
    console.log('调用子类的方法');
    console.log(this.name, this.age, this.salary);
  }
}
let s1 = new Student('wade', 38, 1000000000);
console.log(s1, '<----s1');
s1.showName();
```

---
outline: deep
---

# 类与继承

## 一、常见创建对象的几种方式

### 1.1、字面量创建

```javascript
/**
 * 字面量创建对象
 */

let user = { name: '张三', age: '18' };
console.log(user);
```

### 1.2、new Object 创建

```javascript
/**
 * new Object 创建
 */
let user = new Object({ name: '李四', age: 5 });
console.log(user);
```

### 1.3、构造函数

```javascript
/**
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

const c1 = new Car('小汽车', 4, 2000);
c1.print();
const c2 = new Car('大巴', 8, 25500);
c2.print();
```

## 二、构造函数

### 2.1、构造函数定义

专门用来创建一个指定的对象的 构造函数就是普通的函数,创建方式和普通函数没有区别，用new关键字来进行调用的函数称为构造函数，一般首字母要大写。

### 2.2、构造函数意义

使用对象字面量创建一系列同一类型的对象时，这些对象可能具有一些相似的特征(属性)和行为(方法)，此时会产生很多重复的代码，把这些重复性的特征和属性抽象出来，做成构造函数，可以实现代码复用。举个浅显的例子，比如要生产 10000 个不同的纸盒子，如果按照常规的方法，就需要手动裁 10000 次纸，画 10000 次图案，这样太费时费工，而且如果数量进一步扩大，会造成更大的麻烦。但是如果造一个机器，机器中有盒子的模型，在造盒子之前只需要将盒子的尺寸和图案当做参数输入进去，那么生产盒子的效率就会大幅提高，盒子生产出来之后里边装什么东西，再进行差异化处理就行，需要汉堡的时候放汉堡，需要放披萨的时候放披萨，各自使用就好。这里边这个机器就相当于构造函数，可以反复使用生产一些自带属性和特征的初始对象。

### 2.3、实例成员和静态成员

```javascript
/**
 * 实例成员和静态成员
 */
// Person是一个构造函数，首字母大写
function Person(name, age) {
  // 构造函数中，实例成员就是构造函数内部通过 this 添加的成员，name、age、say就是实例成员（个人理解就是构造函数在实例化以后可以访问的成员）
  this.name = name;
  this.age = age;

  this.intro = function () {
    console.log('我是' + this.name);
  };
}

Person.grade = '高中'; // 在构造函数上添加的成员就会成为静态成员

let p1 = new Person('张三', 25); // 实例化对象

// 通过 prototype 添加的成员不是静态成员，是实例成员，也就是只要是实例化的对象都可以访问到
Person.prototype.average = '16';

console.log(p1.average); // 输出: 70kg
console.log(Person.average); // 输出: undefined

// 静态成员只能通过构造函数进行访问
console.log(Person.grade); // 输出: 高中
console.log(p1.grade); // 输出: undefined

// 实例成员只能通过实例对象进行访问
console.log(p1.name); // 输出: 张三
p1.intro();

console.log(Person.age); // 输出: undefined
Person.intro(); // 报错，Person.say is not a function
```

## 三、原型链继承

### 3.1、原型链继承

```javascript
/**
 * 原型链继承
 */
// 父类
function Person(name, age) {
  this.name = name;
  this.age = age;
  this.hobby = ['吃饭', '睡觉', '游戏'];

  this.getHobby = function () {
    console.log(this.hobby);
  };
}

Person.prototype.getName = function () {};

let p1 = new Person('张三', 25);
console.log(p1);

// 子类
function Student(salary) {
  this.salary = salary;
  this.getSalary = function () {
    console.log(this.salary);
  };
}

//  在这里写子类的原型方法和属性是无效的，因为会改变原型的指向，所以应该放到重新指定之后
Student.prototype.sayHello = function () {}; // [!code error]

// 通过原型链继承
Student.prototype = new Person();

Student.prototype.sayHello = function () {};

var s1 = new Student(8600);
var s2 = new Student(8400);

s1.getHobby();

console.log(s1, '<----s1');
console.log(s2, '<----s2');

s1.hobby.push('唱歌');

s1.getHobby();
```

原型链继承缺点：

1. 当父类私有属性为引用类型时，不同对象均可实现修改，无法实现多继承
2. 来自原型对象的所有属性均被共享
3. 想要给子类添加属性和方法，必须在 Student.prototype = new Person() 之后执行，不能放到构造器中

### 3.2、借用构造函数

```javascript
/**
 * 借用构造函数继承
 */
function Person(name, age) {
  this.name = name;
  this.age = age;

  this.intro = function () {};
}

Person.prototype.sayHello = function () {
  console.log('Hello' + this.name);
};

function Student(name, age, salary) {
  Person.call(this, name, age); // 相当于: this.Person(name, age)

  this.salary = salary;
}

let s1 = new Student('Tom', 25, 8700);

// s1.sayHello(); // Uncaught TypeError: s1.sayHello is not a function

console.log(s1, '<----s1');
```

借用构造函数继承缺点：

1. 只能继承父类的实例属性和方法，不能继承原型属性和方法
2. 无法实现函数复用，每个子类都有父类实例函数的副本，影响性能
3. 实例并不是父类的实例，只是子类的实例

### 3.3、原型链和构造函数继承

```javascript
/**
 * 原型链和构造函数继承
 */
function Person(name, age) {
  this.name = name;
  this.age = age;
  this.getName = function () {};
}

Person.prototype.sayHello = function () {};

let p1 = new Person();

console.log(p1);

function Student(name, age, salary) {
  Person.call(this, name, age);
  this.salary = salary;
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

原型链和构造函数继承缺点：

调用了两次父类构造函数，生成了两份实例

### 3.4、组合继承优化1

```javascript
/**
 * 组合继承优化1
 */
function Person(name, age) {
  this.name = name;
  this.age = age;
  this.getName = function () {};
}

Person.prototype.sayHello = function () {};

function Student(name, age, salary) {
  Person.call(this, name, age);
  this.salary = salary;
  this.setScore = function () {};
}

Student.prototype = Person.prototype;

Student.prototype.getScore = function () {};

let s1 = new Student('Tom', 20, 15000);

console.log(s1);

// 但这种方式没办法辨别是对象是子类还是父类实例化
console.log(s1 instanceof Student, s1 instanceof Person); // 输出：true true
console.log(s1.constructor); // Person
```

优点：

不会初始化两次实例方法/属性，避免的组合继承的缺点

缺点：

没办法辨别是实例是子类还是父类创造的，子类和父类的构造函数指向是同一个。

### 3.5、组合继承优化2

```javascript
/**
 * 组合继承优化2
 */
// 借助原型可以基于已有的对象来创建对象，var B = Object.create(A)以A对象为原型，生成了B对象。B继承了A的所有属性和方法。
function Person(name, age) {
  this.name = name;
  this.age = age;
}

Person.prototype.sayHello = function () {};

function Student(name, age, salary) {
  Person.call(this, name, age);
  this.salary = salary;
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

## 四、class继承

详细说明参考：https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Classes

```javascript
/**
 * class继承
 */
class Person {
  // 从 ECMAScript 2021 开始，JavaScript原生支持通过#前缀定义私有属性。这些属性只能在类内部访问，外部无法直接引用。
  #salary;

  static depart; // 静态属性不能通过实例化对象调用，必须通过 类名.静态属性 调用

  constructor(name, age, salary, depart) {
    this.name = name;
    this.age = age;
    this.#salary = salary;
    Person.depart = depart;
  }

  // 定义一般的方法 最终显示在 prototype 上
  intro() {
    console.log(this.name, this.age, this.#salary);
  }

  // 静态方法不能通过实例化对象调用，必须通过 类名.静态属性 调用
  // 静态方法无法访问 this
  static showDepart() {
    console.log(Person.depart);
  }
}

let p1 = new Person('John', 39, 10000, '部门A');

p1.intro();

Person.showDepart();
```

```javascript
class Student extends Person {
  constructor(name, age, salary, depart) {
    super(name, age, salary, depart); // 通过 super 调用父类的构造方法
  }

  // 跟父类的方法名相同时，实例优先调用自己
  intro() {
    //在子类自身定义方法
    console.log('调用子类的方法');
    console.log(this.name, this.age);
    // console.log(this.#salary); // 属性 "#salary" 在类 "Person" 外部不可访问，因为它具有专用标识符。// [!code error]
  }
}

let s = new Student('Jack', 19, 8500, '部门B');

s.intro();
```


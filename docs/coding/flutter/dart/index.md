---
outline: deep
---

# Dart快速入门

## 一、Dart编程初体验

### 1.1、开发环境搭建

编译 dart 需要对应 dart 语言解析执行器 `Dart SDK`，[Dart 官方](https://dart.cn/)有自带的 Dart SDK 安装、这里使用 Flutter SDK 缘由Flutter SDK自带 Dart  SDK 以及为后续 Flutter 开发铺垫。

详细搭建过程参考：[Window10搭建Flutter项目开发环境](../flutter-window-dev/index.md)

### 1.2、使用VSCode进行Dart编程

> vscode首先需要安装 Flutter、Dart、Code Runer 插件，同时 Flutter 插件需要配置Flutter SDK安装路径地址

创建 index.dart 文件，main 函数主要作用是作为主程序的入口函数

```dart
/**
* main函数主要作用是作为主程序的入口函数
*/
void main() {
  print('Hello,World!');
}
```

点击右键选择 Run Code 运行，终端打印 Hello, Dart! 运行成功

## 二、变量定义

### 2.1、变量定义

在Dart中变量的声明有三个关键字：var 、dynamic 和 Object ，像 js，dart 中的变量可以不预先定义变量类型，也可以在变量前加类型来声明变量

```dart
/**
 * 变量定义
 */
void main() {
  /**
   * 常规变量定义：数据类型 变量名 = 值
   */
  /// int 型
  int num = 10;

  /// double型
  double d = 105.5456;

  /// String型
  String str = '字符串';

  /// Boolean型
  bool b = false;

  /// print 方法表示在终端打印内容，如果需要变量拼接需要借助 $ ，$变量 或 ${变量}
  print("int:${num},double:${d},String:$str,Bool:${b}");

  /// Object：Dart是一种面向对象的编程语言，Object是所有类的基类，包括基本数据类型，Function和Null。所以任何类型的数据都可以赋值给Object声明的对象
  Object obj;
  obj = '赋予字符串';
  print('obj:${obj}');
  obj = 100;
  print('obj:${obj}');
  obj = 6.66;
  print('obj:${obj}');
  obj = true;
  print('obj:${obj}');
}
```

使用 var 声明变量表示自动推导类型，后续不能够改变变量类型

```dart
/**
 * 变量定义
 */
void main() {
  /**
   * 常规变量定义：数据类型 变量名 = 值
   */
  /// 使用 var 声明变量表示自动推导类型，后续不能够改变变量类型
  var v1 = 10; // 会自动推导为int型
  // v = '555'; // 报错：A value of type 'String' can't be assigned to a variable of type 'int'.

  var v2; // 当不进行初始化值时，后续重新赋值时可以赋值任意类型
  v2 = 10;
  v2 = '字符串: 10';

  print("var:${v1},${v2}");
}
```

使用 dynamic 声明变量可以使得编译阶段不检查类型

```dart
/**
 * 变量定义
 */
void main() {
  /**
   * 常规变量定义：数据类型 变量名 = 值
   */
  /// 使用dynamic定义变量: 在dart中为动态类型
  dynamic dyname = 41;

  dyname = '1000';

  print('${dyname}');
}
```

### 2.2、常量

常量提供了 const 和 final 定义

```dart
/**
 * 常量定义
 */
void main() {
  /// const 定义常量
  // const c; // 报错: The constant 'c' must be initialized.
  const c = 40;
  // c = 20; // 报错：Constant variables can't be assigned a value.

  print("c: $c");

  /// final 定义常量
  final f; // final 可以不用初始化，但是一旦赋值后后续就不需要更改。
  f = 10;
  // f = 20; // 报错：The final variable 'f' can only be set once.（只能初始化一次）
  print("f: ${f}");

  /// 差异：const 必须直接赋值常量，final 可以通过运行时赋值
  int getNum() {
    return 10;
  }

  // const num$ = getNum(); // 报错: 需要直接赋值
  final num$ = getNum();

  print("num: ${num$}");
}
```

### 2.3、可空变量

```dart
/**
 * 可空变量
 */
void main() {
  /// 有时需要定义具备类型的变量，但是想初始化为 null
  // int num = null; // 报错：A value of type 'Null' can't be assigned to a variable of type 'int'.
  String? str = null;
  int? n;

  print("str: $str，n: $n");

  /// 由于变量有可能为 null，对应变量对应方法使用可以参考如下
  int? len =
      str?.length; // 由于 str 变量有可能为 null 调用 length 属性时，需要加 ?. 并且接收的变量需要用 ? 承接
  print("len: $len");
}
```

### 2.4、延迟变量

```dart
/**
 * 延迟变量
 */
void main() {
  /// 延迟变量表示可以延迟进行赋值
  late String desc;

  desc = "这是延迟变量";

  /// 在对延迟变量引用时，如果延迟变量未进行赋值，程序会进行报错
  print("desc: $desc");
}
```

在对延迟变量引用时，如果延迟变量未进行赋值，程序会进行报错

```dart
void main() {
  /// 延迟变量表示可以延迟进行赋值
  late String desc;

  // desc = "这是延迟变量"; // [!code --]

  print(
    "desc: $desc",
  ); // The late local variable 'desc' is definitely unassigned at this point.
}
```

## 三、常见的数据类型

### 3.1、Number类型

```dart
void main(List<String> args) {
  /// Number 型
  int num = 10;
  double d = 10.88;
  double z = 1; // 打印 1.0
  double exponents = 1.42e5;

  print('num: $num, d: $d, z:$z,exponents:${exponents}');
}
```

### 3.2、String类型

```dart
void main(List<String> args) {
  /**
   * String 类型
   */
  String str = "My name"; // 单引号和双引号都可以
  var str1 = '''
    You can create multi-line strings like this one.
  '''; // 三个连续的字符可以换行

  print("$str.length"); // 如果$后面接变量可以省略{}，若为一个表达式则必须带{}
  print("${str.length},${str1}");
}
```

字符串和 Number 之间的转换

```dart
void main(List<String> args) {
  /**
   * 字符串和Number之间的转换
   */

  /// String 转 Number
  var one = int.parse('1');
  var onePointOne = double.parse('1.1');

  print("one:${one} onePointOne:${onePointOne}");

  // Number 转 String
  String oneAsString = 1.toString();
  String piAsString = 3.1459.toStringAsFixed(2);

  print('oneAsString:${oneAsString} piAsString:${piAsString}'); // 打印 3.14
}
```

### 3.3、布尔类型

```dart
void main(List<String> args) {
  /**
   * 布尔类型
   */
  bool b = true;
  print("bool:${b}");

  /// 空字符串判断
  var fullName = '';
  print("bool:${fullName.isEmpty}");

  /// 操作符判断
  var hitPoints = 0;
  print("hitPoints:${hitPoints <= 0}");

  /// null 值判断
  var unicorn = null;
  print("unicorn:${unicorn == null}");

  /// 非 Number 判断
  var iMeantToDoThis = 0 / 0;
  print("iMeantToDoThis:${iMeantToDoThis.isNaN}");
}
```

### 3.4、记录

Records类型是一种匿名的、不可变的聚合类型，支持多值返回并通过模式匹配进行解构。

基本概念和特性

匿名和不可变性：Records是一种匿名的、不可变的聚合类型。一旦创建，其内容不能被修改

固定大小和异构：Records是固定大小的，意味着一旦定义了包含的元素数量和类型，就不能添加或删除元素。此外，Records可以包含不同类型的数据，如整数、字符串和布尔值等

```dart
/**
 * Records 类型
 * Records类型是一种匿名的、不可变的聚合类型，支持多值返回并通过模式匹配进行解构
 * 基本概念和特性
 * 匿名和不可变性：Records是一种匿名的、不可变的聚合类型。一旦创建，其内容不能被修改
 * 固定大小和异构：Records是固定大小的，意味着一旦定义了包含的元素数量和类型，就不能添加或删除元素。此外，Records可以包含不同类型的数据，如整数、字符串和布尔值等
 */
void main(List<String> args) {
  /**
   * 记录(Records)
   */

  var userInfo = (name: "张三", 18, hobby: '篮球', false); // name 和 hobby 为命名字段名称

  // 对于存在 命名字段名称 的只能通过字段名称进行访问，未命名的通过$1,$2,... 进行访问
  print("name: ${userInfo.name}");
  print("age: ${userInfo.$1}"); // 打印 18
  print("hobby: ${userInfo.hobby}");
  print("bool: ${userInfo.$2}"); // 打印 false

  /// 给 Records 指定类型
  Student s = (name: "李四", age: 19, classes: "高一一班");

  print("s: ${s}");

  /// 解构
  // 数据
  final json = <String, dynamic>{'name': 'Dash', 'age': 10, 'color': 'blue'};
  var (name, age) = HandleJson(json);
  print("name: ${name}, age:${age}");
}

(String name, int age) HandleJson(Map<String, dynamic> json) {
  return (json['name'] as String, json['age'] as int);
}

typedef Student = ({String name, int age, String classes});
```

### 3.5、集合

dart 的集合分 List、Set、Map三个

```dart
void main(List<String> args) {
  /**
   * 集合
   * dart 的集合分 List、Set、Map三个
   */

  /// List 可以传递一个泛型，默认dynamic， 即List<dynamic>
  List list = [1, 2.1, 3.8, '4', '5', '6', false];

  print("list.length: ${list.length}");
  list.add(888);
  print(list.length);
  list.forEach((item) => print('item:${item}'));
  print(list);

  /// Set 可以传递一个泛型，默认Set<dynamic>

  Set halogens = {'fluorine', 'chlorine', 'bromine', 'iodine', 'astatine'};
  Set setData = {1, '10', true, halogens};
  print(setData);
  print(halogens);
  print(halogens.toList());

  /// Map 可以传递一个泛型，默认dynamic， 即List<dynamic>
  Map gifts = {
    // Key:    Value
    'first': 'partridge',
    'second': 'turtledoves',
    'fifth': 'golden rings',
  };
  print(gifts);
  print(gifts.keys.toList());
  print(gifts.values.toList());

  gifts.addAll({'baz': 'pear'});
  gifts.remove("fifth");

  print(gifts.containsValue("partridge")); // true
}
```

### 3.6、枚举

```dart
/// 定义枚举，不需要进行赋值
enum Color { red, green, blue }

void main(List<String> args) {
  /**
   * 枚举
   */
  final favoriteColor = Color.blue;
  if (favoriteColor == Color.blue) {
    print('Your favorite color is blue!');
  }

  var color = Color.blue;
  switch (color) {
    case Color.red:
      print('Red as roses!');
    case Color.green:
      print('Green as grass!');
    default: // Without this, you see a WARNING.
      print(color); // 'Color.blue'
  }
}
```

### 3.7、别名

```dart
/// 定义类型别名，等同于 TS 的 type 定义
typedef IntList = List<int>;

void main(List<String> args) {
  /**
   * 别名
   */
  IntList list = [1, 25, 5, 878, 5];
  print(list);
}
```

### 3.8、获取变量类型

```dart
void main(List<String> args) {
  /**
   * 获取变量类型
   */
  int n = 10;
  print("${n.runtimeType}");
}
```

## 四、流程控制和操作符

### 4.1、流程控制

```dart
void main(List<String> args) {
  /**
   * 控制流
   */

  /// for循环
  var message = StringBuffer('Dart is fun');
  // 在 for 循环中当 i 使用 final 定义时报错：The final variable 'i' can only be set once. 因为 i 会被重新叠加赋值
  for (var i = 0; i < 5; i++) {
    message.write('!');
  }

  List<int> list = [154, 54878, 8787, 55, 87];
  for (final item in list) {
    print("item:${item}");
  }

  /// while/do-while
  int i = 0;
  while (i < 5) {
    print("i:${i}");
    i++;
  }

  int j = 0;
  do {
    j++;
    print("j:${j}");
  } while (j < 3);

  /// break 停止循环
  int num = 1;
  while (true) {
    if (num > 100) break;
    num = (num + 1) * 2;
    print('num:$num}');
  }

  /// continue 停止当前循环迭代，进入下一次
  List<int> li = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 20, 30, 40, 50];
  for (var i = 0; i < li.length; i++) {
    if (5 < li[i] || li[i] > 30) {
      print("IIII:${li[i]}");
      continue;
    }
    print("${li[i]}");
  }
}
```

### 4.2、常见操作符

```dart
void main(List<String> args) {
  /**
   * 常规运算符
   */

  /// ==(等于)、!=(不等于)、>(大于)、<(小于)、<=(小于等于)、>=(大于等于)
  print("==:${3 + 2 == 5}、!=:${3 + 2 != 5}、");
  print('>:${3 + 5 > 4}、<:${3 + 5 < 4}');
  print('=>:${3 + 5 >= 6}、<=:${3 + 5 <= 8}');

  /// 三元运算符
  var bool = null;
  print("${bool == null ? '1' : '0'}");

  /// 展开符
  Person p =
      Person()
        ..name = "张三"
        ..age = 20; //使用展开符完成赋值
  print('${p}');

  /**
   * 避开运算符
   */
  int? a;
  a ??= 3; // a为null时赋值3
  print(a); // print 3
  print(null ?? 12); // print 12

  var p1 = null; // 此时我们将p0设置为null
  print(p1?.name); // 打印null
}

class Person {
  String? name;
  int? age;

  //复写toString方法，方便打印
  String toString() {
    return "name : $name ; age :$age";
  }
}
```

### 4.3、错误处理

Dart 应用程序中可能会遇到的几种错误类型：

编译时错误：这类错误在代码编译阶段就出现，直接阻止了代码执行。

运行时错误：这些错误是在程序运行时才冒出来的。比如，空指针异常、除零错误以及越界异常都是运行时错误的常客。

异常：Dart 使用异常来处理运行时错误和程序异常情况。异常可以通过 throw 关键字明确地抛出，也可以通过内置函数和方法暗地里抛出。

```dart
/**
 * 错误处理
 */
void main(List<String> args) {
  List<int> list = [1, 2, 3];
  print(list[3]); // 访问一个数组不存在的数组索引

  print("该行代码不会被执行打印");
}
```

捕获错误处理之后代码继续执行

```dart
void main(List<String> args) {
  /**
   * 捕获异常
   */
  try {
    List<int> list = [1, 2, 3];
    print(list[3]);
  } catch (e) {
    print("error: ${e}");
  } finally {
    /// 无论是否出现异常都会执行 finally 模块
    print("finally");
  }

  print("通过捕获异常之后后续的代码继续执行");
}
```

捕获特定异常

```dart
void main(List<String> args) {
  /**
   * on 关键字捕获特定异常
   */
  try {
    // throw "error";
    // or
    // throw Exception("Exception错误");
  } on Exception catch (e) {
    /// 捕获 Exception
    print("Exception: ${e}");
  } catch (e) {
    /// 捕获其他错误
    print("error: ${e}");
  }
}
```

`throw` 关键字用来明确地抛出异常。这让开发人员可以处理异常情况，并在代码中发出错误信号。

```dart
void main(List<String> args) {
  /**
   * 手动抛出异常（throw）
   */
  int n = 5;
  try {
    if (n < 10) {
      throw Exception("n不能小于10");
    }
    throw "其他错误";
  } on Exception catch (e) {
    print("error: ${e}");
  } catch (e) {
    print("other error: ${e}");
  }
}
```

在Dart中，自定义异常类是一种常见的做法，特别是在你需要根据不同的错误情况抛出不同类型的异常时。自定义异常类可以让你的代码更加清晰、易于理解和维护。在Dart中，所有的异常类都继承自 Exception 或 Error 类。你可以选择继承Exception，它提供了基本的异常功能，或者继承 Error。

```dart
void main(List<String> args) {
  throw CustomException("自定义Exception");
}

class CustomException implements Exception {
  final String message;

  CustomException(this.message);

  @override
  String toString() {
    return 'MyCustomException: $message';
  }
}
```

```dart
void main(List<String> args) {
  throw CustomError("error", 500);
}

class CustomError extends Error {
  final String message;
  final int code;

  CustomError(this.message, this.code);

  @override
  String toString() {
    return 'CustomError: $message (Code: $code)';
  }
}
```

## 五、函数

### 5.1、主函数

main 函数是每个 Dart 程序必须有的顶级函数，是程序的入口，main 函数返回值是void ，并且有一个 `List<String>` 类型的可选参数。当使用 dart 命令执行 dart 程序并且携带参数，所带参数值通过 args 进行接收

```bash
dart hello-world.dart 1 test
```

```dart
void main(List<String> args) {
  print(args); // ['1', 'test']
}
```

### 5.2、函数定义

```dart
void main(List<String> args) {
  String getStr = getName();
  print(getStr);
}

/**
 * 定义函数，并且返回值
 */
String getName() {
  return "返回一个String类型";
}

/// 当返回值为 void ，可以缺省不写
printMsg(String msg) {
  print("msg: ${msg}");
}
```

### 5.3、函数入参

```dart
void main(List<String> args) {
  var amount = toAmount(16.2484);
  print(amount);

  printMsg("msg");

  printUserInfo(name: "张三", age: 19);
}

/**
 * 定义一个必要参数
 */
String toAmount(double amount) {
  return amount.toStringAsFixed(2) + '元';
}

/**
 * 定义可选参数和默认参数
 * 可选参数和默认参数需要用 [] 包裹，
 */
void printMsg(String msg, [int? code, String data = ""]) {}

/**
 * 命名参数，命名参数默认都为可选参数，如果是必要参数，则需要用 required 
 */
void printUserInfo({required String name, int? age}) {
  print('Name: $name, Age: $age');
}
```

### 5.4、匿名函数

```dart
void main(List<String> args) {
  /**
   * 匿名函数
   */
  const list = ['apples', 'bananas', 'oranges'];
  list.forEach((element) {
    print(element);
  });

  /**
   * 使用匿名箭头函数当作参数使用
   */
  list.forEach((item) => print('${list.indexOf(item)}: $item'));
}
```

## 六、类

### 6.1、类的使用

```dart
void main(List<String> args) {
  // const u = new User(); // Error: Const variables must be initialized with a constant value.

  final u = new User();

  u.setHeight(1.78);

  u.say();
}

class User {
  // 定义 String 必须进行初始化
  String name = "张三";
  // 定义可选属性可以不用初始化，默认值为 null
  String? hobby;

  // 使用 var 关键字进行定义属性，也可以不用初始化属性，会自动推导类型
  var classes;

  // 使用 final 定义属性必须进行初始化定义，并且是不可变属性，同时也会自动推导数据类型
  final score = 89;

  // 使用 final 定义属性
  final int age = 19;

  // late 关键字表示延迟定义属性，可以不用进行初始化
  late double weight;

  late final double height;

  // 定义静态变量
  static String id = "1001";

  setHeight(double height) {
    this.height = height;
    this.height =
        1.585; // [!code error] late final 定义的属性只能初始化一次，初始化两次在运行时会报 LateInitializationError ，但编译器不会提示错误
  }

  getHeight() {
    print("${this.height}");
  }

  setScore(int score) {
    // this.score = score; // Error: 'score' can't be used as a setter because it's final.
  }

  say() {
    print("Hello, Dart!");
  }
}
```

> [!WARNING]
> 需要注意以下几点：
>
> 1. const 不能接口 new 出来的实例对象，原因 const 只能接收常量
> 2. final 定义的属性必须要进行初始化
> 3. late final 定义属性时，该属性只能初始化一次，进行两次赋值时在程序运行过程中会报 LateInitializationError ，但编译器不会提示错误

### 6.2、构造函数

```dart
void main(List<String> args) {
  final u = new User("张三", 19);

  u.printUser();
}

class User {
  late String name;
  late int age;

  // 构造函数：构造函数的命名必须和类名一致
  // User(String name, int age) {
  //   this.name = name;
  //   this.age = age;
  // }

  // 如果只是简单赋值构造函数可以用以下方式简写
  User(this.name, this.age);

  // 定义多个参数
  User.withName(this.name, this.age);

  printUser() {
    print("name: ${this.name}, age: ${this.age}");
  }
}
```

### 6.3、类的继承

```dart
void main(List<String> args) {
  final s = new Student("张三", 19, "高一一班");

  s.printInfo();
}

class User {
  late String name;
  late int age;

  User(this.name, this.age);

  skill() {
    print("会唱歌");
  }

  printInfo() {
    print("名字：$name, 年龄：$age");
  }
}

class Student extends User {
  late String classes;

  // 构造函数并调用父类 super
  Student(String name, int age, String classes) : super(name, age) {
    this.classes = classes;
  }

  @override
  printInfo() {
    print("名字：$name, 年龄：$age, 班级：$classes");
  }
}
```

### 6.4、公有成员、私有成员

在 dart 中没有 public，protected 和 private 这些成员访问修饰符，也就是说，成员默认都是 public 的。

```dart
/// user.dart
class User {
  // 以下划线(_)开头命名的成员是私有的
  String _name;

  User(this._name);

  String get name {
    return this._name;
  }

  set setName(String name) {
    this._name = name;
  }

  printInfo() {
    print("name: ${this._name}");
  }
}

```

```dart
import 'user.dart';

void main(List<String> args) {
  final u = new User("张三");

  print(u.name);

  u.setName = '李四';

  u.printInfo();
}

class Student extends User {
  Student(String name) : super(name) {}

  pay() {
    print("name: ${this._name}"); // 私有属性不可以访问
  }
}
```
> [!WARNING]
> 带有私有属性的class，必须放在一个独立的.dart文件中，被引入其他的dart文件中使用时，才有私有属性的效果。否则，如果在同一个文件中编写，即使加了_，也是共有属性。

### 6.5、getter和setter

```dart
void main(List<String> args) {
  final u = new User("张三");

  print(u.getName);

  u.setName = '李四';

  u.printInfo();
}

class User {
  String name;

  User(this.name);

  String get getName {
    return this.name;
  }

  set setName(String name) {
    this.name = name;
  }

  printInfo() {
    print("name: ${name}");
  }
}
```

### 6.6、抽象类和抽象方法

```dart
void main(List<String> args) {
  final c = Cat("狸花猫", "猫科类");

  c.makeSound();
  c.eat();
}

abstract class Animal {
  // 静态属性
  static late String species;

  String name;

  Animal(this.name, String species) {
    Animal.species = species;
  }

  // 抽象方法
  makeSound();

  // 实体方法
  eat() {
    print("${name}在吃饭");
  }
}

class Cat extends Animal {
  Cat(String name, String species) : super(name, species);

  // 继承抽象类时，必须要实现
  @override
  makeSound() {
    print("喵喵");
  }
}
```

### 6.7、Mixin

Mixin是Dart中一种代码复用的机制，它允许在不使用继承的情况下，将一个类的代码复用到多个类层次结构中

1.  使用 on 关键字来限制mixin的使用范围
2. 多个Mixin的使用顺序，Mixin的应用顺序从左到右，方法冲突时，最右边的Mixin优先级最高

```dart
/**
 * Mixin是Dart中一种代码复用的机制，它允许在不使用继承的情况下，将一个类的代码复用到多个类层次结构中
 */
void main(List<String> args) {
  final user = UserService();
  user.createUser();
}

class UserService with LoggingMixin {
  void createUser() {
    log('Creating new user...'); // 使用mixin中的方法
  }
}

mixin LoggingMixin {
  void log(String message) => print('Log: $message');
}

/// 使用 on 关键字来限制mixin的使用范围
mixin AdminMixin on UserService {} // 只能在UserService类及其子类中使用AdminMixin，如果尝试在其他类中使用AdminMixin，将会导致编译错误

/// 多个Mixin的使用顺序
class MyService with LoggingMixin, ValidationMixin, CacheMixin {
  // Mixin的应用顺序从左到右
  // 方法冲突时，最右边的Mixin优先级最高
}

mixin ValidationMixin {
  void validate(String input) => print('Validating: $input');
}

mixin CacheMixin {
  void cache(String data) => print('Caching: $data');
}
```

## 七、泛型

```dart
void main(List<String> args) {
  // map 泛型
  var o = <String, String>{'name': 'da'};

  print(o.runtimeType);

  // List 泛型
  List<String> list = ["1", '2'];

  print(list);

  print(getGenerics<int, String>(1126));

  final u = new User<String>("张三");
  u.printUser();
}

/// 函数泛型
D getGenerics<T, D>(T data) {
  return data.toString() as D;
}

/// 类泛型
class User<T> {
  T name;

  User(this.name);

  printUser() {
    print("name: ${this.name}");
  }
}
```

## 八、异步编程

### 8.1、Future使用

```dart
import 'dart:async';

void main(List<String> args) {
  getData();

  /// .then 嵌套
  getString()
      .then((value) {
        print(value);
        return Future.value('2');
      })
      .then((value) {
        print(value);
        return Future.value('3');
      })
      .then((value) {
        print(value);
      });
}

/// 定义一个异步函数：一般使用 async 定义，返回的是一个 Future 类型
Future<void> getData() async {
  print("这是定义的一个异步函数");
}

Future<String> getString() async {
  return '1';
}
```

### 82、Future.delayed

```dart
void main(List<String> args) {
  getInt().then((value) {
    print(value);
  });
}

// Future.delayed 表示延迟执行
Future<int> getInt() async {
  return Future.delayed(Duration(seconds: 3), () {
    print("Future.delayed 3 seconds.");
    return 3;
  });
}
```

### 8.3、catchError和onError

```dart
import 'dart:async';

void main(List<String> args) {
  testCatchError();

  testOnError();
}

/// catchError
testCatchError() {
  final future = Future.delayed(Duration(seconds: 3), () {
    print("Future.delayed 3 seconds.");
    return Future.error("抛出 Future.error 错误");
  });

  /// catchError 来捕捉 Future.error 抛出的错误
  future.then((value) => print('value:${value}')).catchError((error) {
    print("error:${error}");
  });
}

/// onError
testOnError() {
  Future.error('Futrue 错误！')
      .then((value) {
        throw 'Futrue 类错误'; // 注意：这里抛出的错误无法处理，onError 只能处理当前 Future 的错误
      })
      .catchError((error) {
        print("error:${error}");
        throw "onError 错误";
      })
      .then(print, onError: (error) => {print("onError: $error")});
}
```

1. catchError 来捕获 Future.error
2. Future.catchError 回调只处理原始 Future 抛出的错误，不能处理回调函数抛出的错误，onError 只能处理当前 Future的错误

### 8.4、Future.whenComplete

Future.whenComplete 在 Future 完成之后总是会调用，不管是错误导致的完成还是正常执行完毕。

```dart
import 'dart:math';

void main(List<String> args) {
  testWhenComplete();
}

testWhenComplete() {
  var random = new Random();
  new Future.delayed(new Duration(seconds: 1), () {
    if (random.nextBool()) {
      return 'Future 正常';
    } else {
      throw 'Future 发生错误啦!';
    }
  }).then(print).catchError(print).whenComplete(() {
    print('Future whenComplete！');
  });
}
```

### 8.5、Future高级用法

#### 8.5.1、Future.timeout

本来 Future 会在2s后完成，但是 timeout 声明的是1s后超时，所以1s后 Future 会抛出 TimeoutException 错误

```dart
import 'dart:async';

void main(List<String> args) {
  testTimeOut();
}

/// Future.timeout
testTimeOut() {
  new Future.delayed(new Duration(seconds: 2), () {
    return 1;
  }).timeout(new Duration(seconds: 1)).then(print).catchError(print);
}
```

#### 8.5.2、Future.foreach

根据某个集合对象，创建一系列的 Future。并且会按顺序执行这些 Future

```dart
import 'dart:async';

void main(List<String> args) {
  testForeach(); // 依次打印 1秒后打印第1秒执行  再重新计时2秒后第2秒执行   再重新计时3秒后第3秒执行
}

/// Future.foreach
testForeach() {
  Future.forEach({1, 2, 3}, (num) {
    return Future.delayed(Duration(seconds: num), () {
      print("第$num秒执行");
    });
  });
}
```

#### 8.5.3、Future.wait

等待多个 Future 完成，并收集它们的结果。有两种情况：

1. 所有 Future 都有正常结果返回，则 Future 的返回结果是所有指定 Future 的结果的集合
2. 其中一个或者几个 Future 发生错误，产生了 error。则 Future 的返回结果是第一个发生错误的 Future 的值：

```dart
import 'dart:async';

void main(List<String> args) {
  testWait();
}

/// Future.wait
testWait() {
  var future1 = new Future.delayed(new Duration(seconds: 1), () => 1);

  var future2 = new Future.delayed(new Duration(seconds: 2), () => 2);

  var future3 = new Future.delayed(new Duration(seconds: 3), () => 3);

  Future.wait({future1, future2, future3}).then(print).catchError(print);
}
```

模拟 Future.wait 部分错误

```dart
import 'dart:async';

void main(List<String> args) {
  testWaitError(); // 打印 Future 发生错误啦!
}

/// 模拟 Future.wait 部分报错
testWaitError() {
  var future1 = new Future.delayed(new Duration(seconds: 1), () => 1);

  var future2 = new Future.delayed(new Duration(seconds: 2), () {
    throw 'Future 发生错误啦!';
  });

  var future3 = new Future.delayed(new Duration(seconds: 3), () => 3);

  Future.wait({future1, future2, future3}).then(print).catchError(print);
}
```

#### 8.5.4、Future.any

返回的是第一个执行完成的 Future 的结果，不会管这个结果是正确的还是 error

```dart
import 'dart:async';

void main(List<String> args) {
  testAny();
}

/// Future.any
testAny() {
  Future.any(
    [1, 2, 5].map((delay) => new Future.delayed(new Duration(seconds: delay), () => delay)),
  ).then(print).catchError(print);
}
```

#### 8.5.5、Future.doWhile

Future.doWhile方法就是重复性地执行某一个动作，直到返回false或者Future，退出循环

```dart
import 'dart:async';
import 'dart:math';

void main(List<String> args) {
  testDoWhile();
}

testDoWhile() {
  var random = new Random();
  var totalDelay = 0;
  Future.doWhile(() {
    if (totalDelay > 10) {
      print('total delay: $totalDelay seconds');
      return false;
    }
    var delay = random.nextInt(5) + 1;
    print(totalDelay);
    print(delay);
    totalDelay += delay;
    return new Future.delayed(new Duration(seconds: delay), () {
      print('waited $delay seconds');
      return true;
    });
  }).then(print).catchError(print);
}
```

#### 8.5.6、Future.microtask

创建一个在 microtask queue 运行的 Future。我们知道 microtask queue 的优先级是比 event queue 高的。而一般 Future 是在 event queue 执行的。所以 Future.microtask 创建的 Future 会优先于其他 Future 执行

```dart
import 'dart:async';

void main(List<String> args) {
  tesMicrotask(); // microtask event 优先被打印
}

tesMicrotask() {
  Future(() {
    print("Future event 1");
  });
  Future(() {
    print("Future event 2");
  });

  /// 创建  Future.microtask
  Future.microtask(() {
    print("microtask event");
  });
}
```

## 九、Dart 核心库

Dart 拥有丰富的核心库，为许多日常编程任务提供必需的功能，例如：dart:collection、dart:math、dart:async

以下介绍 Dart 核心库的主要功能，仅仅只是概述，如果需要详细了解某个库过或某个成员可以参阅 [Dart API 参考](https://api.dart.cn/index.html)

| 核心库          | 用途                                                         |
| :-------------- | ------------------------------------------------------------ |
| dart:core       | 内置类型、集合和其他核心功能。此库会自动导入到每个 Dart 程序中 |
| dart:async      | 支持异步编程，有Future、Stream等类                           |
| dart:math       | 数学常数和函数，加上随机数生成器                             |
| dart:convert    | 用于在不同数据表示之间进行转换的编码器和解码器，包括 JSON 和 UTF-8 |
| dart:js_interop | 与 JavaScript 和浏览器 API 互操作                            |
| dart:collection | 补充集合支持的类和实用程序。为处理集合提供了进一步的集合实现和功能 |
| dart:developer  | 与调试器和检查器等开发工具进行交互                           |
| dart:io         | 文件、套接字、HTTP 和其他非 Web 应用程序的 I/O 支持。提供包括对 ANSI 颜色、文件复制和标准退出代码的支持在内的功能 |
| dart:isolate    | 使用隔离的并发编程：类似于线程的独立工作者                   |

## 十、库和包

### 10.1、库

在 Dart 中，`library` 指令用于定义一个库。`每个 Dart 文件都可以被视为一个库`，即使没有显式使用 `library` 指令，文件中的代码也会被组织在一个默认的库中。例如

```dart
library my_library;

void greet() {
  print('Hello from my library');
}
```

在 Dart 中，库是模块化代码的基本单元。库内的成员（如函数、变量等）默认只能在库内部访问，如果想要在其他库中使用这些成员，需要通过 `import` 语句来引入。例如

```dart
import 'lib/my_library.dart';

void main(List<String> args) {
  greet();
}
```

当同时引入多个库时，如果存在同名成员，可以使用`as`关键字为引入的库指定一个别名，以避免冲突

```dart
import 'package:lib1/lib1.dart' as lib1;
import 'package:lib2/lib2.dart' as lib2;
```

库不仅提供 API，而且是一个隐私单元：以下划线 （`_`） 开头的标识符仅在库内可见。 

```dart
// lib/my_library.dart
library my_library;

void greet() {
  print('Hello from my library');
}

void _hello() {
  print("hello dart!");
}

void helloDart() {
  _hello();
}
```

在进行 import 调用时

```dart
import 'lib/my_library.dart';

void main(List<String> args) {
  greet();

  _hello(); //  _ 开头的标识符仅在库内可见，这里会提示错误  [!code error]

  helloDart();
}
```

如果只想使用库的一部分，则可以选择性地导入库。例如

```dart
// Import only foo.
import 'package:lib1/lib1.dart' show foo;

// Import all names EXCEPT foo.
import 'package:lib2/lib2.dart' hide foo;
```

### 10.2、包

包是一种组织和共享库的方式。一个包可以包含一个或多个库，以及一些配置文件和其他资源。包通常用来封装和发布可复用的代码，供其他开发者使用。

若要为 package 创建一个初始化的目录和结构，使用 `dart create` 命令，并加入 `package` 作为命令参数来创建：

```dart
dart create -t package <PACKAGE_NAME>
```

下图展示了最简单的 Package 的结构：

![image-20250626230859312](images/image-20250626230859312.png)

Package 的最基本要求包括：

1. pubspec 文件

Package 的 `pubspec.yaml` 文件与 应用程序的 `pubspec.yaml` 文件 相同 — `pubspec.yaml` 文件中并没有特别的指出这个 Package 是一个库

2. lib 目录

如你所料，库的代码位于 `lib ` 目录下，且对于其他 Package 是公开的。你可以根据需要在 lib 下任意创建组织文件结构。按照惯例，实现代码会放在 `lib/src` 目录下。 `lib/src` 目录下的代码被认为是私有的。其他 Package 应该永远不需要导入 `src/...` 目录下代码。通过导出 lib/src 目录的文件到一个 lib 目录的文件，实现对 lib/src 目录中 API 的公开

直接在 lib 目录下创建主 Library 文件，lib/\<package-name\>.dart，该文件导出所有的公开的 API 。这样就可以允许使用者导入单个文件就能够获得 Library 的所有功能。

```dart
export 'src/xxxx.dart' show xxx // 使用 export 导出，show 指定那些内容需要导出
```

包创建完成可以自由决定是否发布的 [pub.dev](https://pub-web.flutter-io.cn/) ，详细发包过程参考 [官网发包说明](https://dart.cn/tools/pub/publishing/)




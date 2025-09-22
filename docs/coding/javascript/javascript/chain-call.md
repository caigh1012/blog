---
outline: deep
---

# 链式调用

在 JavaScript 中，链式调用（Method Chaining）是一种编程风格，它允许我们在一个对象上连续调用多个方法，而不需要重复写出对象的名称。这种风格通常用于简化代码，使其更加流畅和易读。

链式调用的基础是每个方法在执行完毕后返回其所属的对象（通常是 this ），这样下一个方法就可以在同一个对象上继续调用。

链式调用的优势：
+ 代码简洁：减少了重复的对象引用，使代码更加简洁。
+ 可读性强：方法调用的顺序可以清晰地表达出操作流程。
+ 易于维护：修改或添加新的方法时，不会影响到其他方法的调用。

应用的场景：

1. JQuery：JQuery 的选择器和操作方法
2. Lodash：Lodash 的链式数据处理
3. Promise：Promise的 then 和 catch 的链式调用

链式调用的实现：

利用类实现一个计算类的链式调用

```javascript
class Calculator {
  constructor(result) {
    this.result = result;
  }

  add(value) {
    this.result += value;
    return this;
  }

  subtract(value) {
    this.result -= value;
    return this;
  }

  multiply(value) {
    this.result *= value;
    return this;
  }

  divide(value) {
    if (value !== 0) {
      this.result /= value;
    } else {
      throw new Error('Division by zero is not allowed.');
    }
    return this;
  }
}

const c = new Calculator(10);

try {
  const result = c.add(5).multiply(7).subtract(20).divide(3).result;
  console.log(result);
} catch (error) {
  console.error(error.message); // 输出: Division by zero is not allowed.
}
```




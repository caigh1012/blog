---
outline: deep
---

# Angular@16的快速入门

## 一、创建Angular项目

### 1、使用官方脚手架创建项目

安装官方脚手架

```bash
npm install -g @angular/cli
```

创建项目

```bash
ng new my-app
```

运行项目

```bash
cd my-app
ng serve --open
```

### 2、项目架构分析

#### 2.1、主要项目文件架构分析

![image-20230612203358179](images/image-20230612203358179.png)

#### 2.2、angular.json文件的主要配置分析

![image-20230612204141442](images/image-20230612204141442.png)

#### 2.3、浏览器端项目挂载流程

![image-20230625194614317](images/image-20230625194614317.png)

在根模块中会通过 `@angular/platform-browser` 引入 `BrowserModule` ，相关代码如下

```typescript
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule, // 定义为浏览器模块渲染
    AppRoutingModule,
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
```

## 二、Angular模板语法

### 1、模板语句

模板表达式会产生一个值，它出现在双花括号 `{  }` 中。 Angular 解析该表达式并将其赋值给绑定目标的某个属性。目标可以是 HTML 元素、组件或指令。

对应组件 HTML 代码

```html
<div>
  <h4>1、模板语句</h4>
  <div>文本插值：{{text}}</div>
  <div>标签属性插入变量：<a href="{{url}}" target="_blank">百度一下</a></div>
  <div>模板表达式：The sum of 1 + 1 is {{1 + 1}}</div>
  <div>表达式上下文</div>
  <ul>
    <li *ngFor="let customer of customers">{{customer}}</li>
  </ul>
</div>
```

对应组件 TS 代码

```typescript
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.less'],
})
export class AppComponent implements OnInit {
  text = '这是一个文本插值变量插入';
  url = 'https://www.baidu.com/';

  customers = ['张三', '李四'];

  ngOnInit(): void {
    console.log('', '我的');
  }
}
```

实现效果图

![image-20230613202901065](images/image-20230613202901065.png)

### 2、绑定

#### 2.1、属性绑定

要绑定到元素的属性，请将其括在方括号 `[]` 内，该括号会将属性标为目标属性，目标属性就是你要对其进行赋值的 DOM 属性。

1. 普通属性绑定

使用 `【属性名称】` 绑定DOM对象属性

```html
<div>属性绑定：<img [src]="imgUrl" alt=""></div>
```

使用 `【attr.属性名称】` 为元素绑定HTML标记属性

```html
<td [attr.colspan]="'1'">td</td>
```

2. class属性绑定

使用 `【class.类名】` 进行绑定

```html
<div class="col" [class.isActive]="true">这是class属性绑定</div>
```

使用 `ngClass` 进行绑定（可以多个控制绑定）

```html
<div [ngClass]="{'active': active, 'error': true}">ngClass进行的绑定</div>
```

3. style属性绑定

使用 `【style.样式属性】` 进行绑定

```html
<div [style.backgroundColor] = "active ? 'red' : 'blue'">style进行样式绑定</div>
```

使用 `ngStyle` 进行绑定

```html
<div [ngStyle]="{'backgroundColor': 'blue'}">使用ngStyle进行绑定</div>
```

#### 2.2、事件绑定

要绑定到事件，请使用 Angular 的事件绑定语法，此语法由等号左侧括号内的目标事件名和右侧引号内的模板语句组成。

例如：button 的点击事件

```html
<div>事件绑定：<button (click)="clickHandler()">点击</button></div>
```

获取事件对象，通过 `$event` 获取

```html
<div>事件绑定：<button (click)="clickHandler($event)">点击</button></div>
```

#### 2.3、双向绑定

1. 模拟类似一个 vue 的 v-model 原理

对应组件 HTML 代码

```html
<div>
  <h5>4、双向数据绑定</h5>
  <p>输入的值：<input type="text" [value]="inpVal" (input)="getVModelVal($event.target)" ></p>
  <p>对应的值：{{inpVal}}</p>
</div>
```

对应组件的 TS 代码

```typescript
inpVal = '';

getVModelVal(e: any) {
  this.inpVal = e?.value;
}
```

### 3、基础指令

#### 3.1、判断指令和循环指令

```html
<h4>3、基础指令</h4>
<div><p *ngIf="bool">ngIf指令：为true时显示</p></div>
<div>
  <p>ngFor指令：</p>
  <ul>
    <li *ngFor="let item of courseArr">{{item}}</li>
  </ul>
</div>
```

#### 3.2、ngStyle和ngClass指令

对应组件 HTML 代码

```html
<div>
  <p [class]="className" ngClass="text-error">ngClass指令与ngStyle指令：
    <span [ngStyle]="styles">测试ngStyle和ngClass指令</span></p>
</div>
```

对应组件 TS 代码

```typescript
className = 'ooo';
styles = {
    fontSize: '20px',
 };

courseArr = ['html', 'css', 'javascript'];
```

### 4、管道

要应用管道，请如下所示在模板表达式中使用管道操作符（ `|` ），紧接着是该管道的名字。

#### 4.1、内置管道

```html
<div>内置管道：{{ 'Angular' | uppercase }}</div> // 直接调用即可
```

#### 4.2、管道参数

```html
<div>管道参数：{{ 'Angular' | slice:0:5 }}</div>
```

#### 4.3、管道链

```html
<div>管道链：{{ 'Angular' | slice:0:5 | uppercase }}</div>
```

#### 4.4、自定义管道

使用 Angular 创建自定义管道

```typescript
import { Pipe, PipeTransform } from '@angular/core';
import dayjs from 'dayjs';

@Pipe({ name: 'formatTime' }) // formatTime 为管道名称
export class FormatTimePipe implements PipeTransform {
  constructor() {}

  transform(value: Date, format: string) {
    console.log(value, format, '<____value,format');
    return dayjs(value).format(format);
  }
}
```

对应组件 HTML 代码

```html
<div>自定义管道：{{ nowTime | formatTime:'DD/MM/YYYY' }}</div>
```

对应组件 TS 代码

```typescript
export class AppComponent {
  nowTime = new Date();
}
```

### 5、模板引用变量

在模板中，要使用井号 `#` 来声明一个模板变量。下列模板变量 `#phone` 语法在 `<input>` 元素上声明了一个名为 `phone ` 的变量

1. 定义一个模板引用变量在模板中获取

对应组件 HTML 代码

```html
<h3>模板引用变量</h3>
<div>
  <input type="text" (input)="getInpVal(text)" #text>
</div>
```

对应组件 TS 代码

```typescript
getInpVal(text: any) {
   console.log(text, '<___text'); // 获取到的是Dom对象
}
```

实现效果图

![image-20230628220536961](images/image-20230628220536961.png)

2. 定义模板变量在组件类使用

对应组件 HTML 代码

```html
<p #hello>helle Angular！</p>
```

对应组件 TS 代码

```typescript
export class AppComponent implements AfterViewInit {
  @ViewChild('hello') helloDom: any
  
  ngAfterViewInit(): void { // 生命周期函数
    console.log(this.helloDom?.nativeElement, '<___获取到的dom对象');
  }
}
```

实现效果图

![image-20230628221149706](images/image-20230628221149706.png)

## 三、Angular表单

Angular 中有两种表单 API，分别是模板式表单和响应式表单。模板式表单是通过 Angular 提供的指令在模板中对表单进行操作的，由于受限于 HTML 的语法功能，模板式表单只适合一些简单的表单使用场景。而响应式表单是通过组件中自定义数据模型实现对表单的操控。所以更适合复杂表单功能。

模板式表单存在于 `FormModule` 模块中，响应式表单存在于 `ReactiveFormModule` 模块中，在使用的时候一定要将对应的模块 import 到 `app.module.ts` 根模块中。

![image-20230620202910897](images/image-20230620202910897.png)

### 1、响应式表单

#### 1.1、FormControl、FormGroup、FormArray

定义表单的数据模型需要用到 Angular 提供的三个类型 `FormControl`、`FormGroup`、`FormArray`

1. FormControl

`FormControl` 是表单模型的最小单位，也就相当于数据模型对象中的一个属性，`FormControl` 的构造函数可以传入一个参数，表示默认值，例如绑定在 `input` 元素上时，就是该元素的默认输入

```typescript
account: new FormControl('账户'),
```

2. FormGroup

`FormGroup` 从语义上看就是代表整个表单，但是也可以保存表单的一部分，它里面可以包含多个 `FormControl`，可以包含多个 `FormGroup`

```typescript
form: FormGroup = new FormGroup({
  account: new FormControl('账户'),
  password: new FormGroup({
    pwd: new FormControl('data', [Validators.required]),
    repwd: new FormControl(),
  }),
});
```

3. FormArray

`FormArray` 本质上和 `FormGroup` 是一样的，只不过 `FormGroup` 中的 `FormControl` 数量是固定的，初始化多少个就是多少个；`FormArray` 中的 `FormControl` 的数量是可变的，可以动态增减

```typescript
address: new FormArray([
  new FormControl('北京'),
  new FormControl('上海'),
  new FormControl(),
]),
```

4. 响应式表单用到的指令

| 类          | 指令        | 指令            |
| ----------- | ----------- | --------------- |
| FormGroup   | formGroup   | formGroupName   |
| FormControl | formControl | formControlName |
| FormArray   |             | formArrayName   |

#### 1.2、基于FormGroup创建表单

对应组件 TS 代码

```typescript
form: FormGroup = new FormGroup({
  account: new FormControl('账户'),
  password: new FormGroup({
    pwd: new FormControl('data', [Validators.required]),
    repwd: new FormControl(),
  }),
});
```

对应组件 HTML 代码

```html
<div>
  <h4>响应式表单</h4>
  <form [formGroup]="form" (submit)="onSubmit()">
    账号：<input formControlName="account" nzRequired>
    <div formGroupName="password">
        密码：<input formControlName="pwd">
        <br/>
        重复密码：<input formControlName="repwd">
    </div>
    <input type="submit" value="确定">
  </form>
  <h4>模板式表单</h4>
</div>
```

实现效果图

![image-20230620205529953](images/image-20230620205529953.png)

#### 1.3、基于FormArray创建动态表单

对应组件 TS 代码

```typescript
export class AppComponent {
  title = 'my-app';
  form: FormGroup = new FormGroup({
    account: new FormControl('账户'),
    password: new FormGroup({
      pwd: new FormControl('data', [Validators.required]),
      repwd: new FormControl(),
    }),
    address: new FormArray([
      new FormControl('北京'),
      new FormControl('上海'),
      new FormControl(),
    ]),
  });
  constructor() {}

  get addressFormArray() {
    return this.form.controls['address'] as FormArray;
  }

  onSubmit() {
    console.log('提交');
    console.log(this.form.value);
  }

  addAddress() {
    const address = this.form.get('address') as FormArray;
    address.push(new FormControl());
  }
}
```

对应组件 HTML 代码

```html
<div>
  <h4>响应式表单</h4>
  <form [formGroup]="form" (submit)="onSubmit()">
    账号：<input formControlName="account" nzRequired>
    <div formGroupName="password">
        密码：<input formControlName="pwd">
        <br/>
        重复密码：<input formControlName="repwd">
    </div>
    <div formArrayName="address">
      <p *ngFor="let item of addressFormArray.controls; let i=index;" >
        收货地址{{i+1}}：<input type="text" [formControlName]="i">
      </p>
      <button type="button" (click)="addAddress()">增加地址栏</button>
    </div>
    <input type="submit" value="确定">
  </form>
  <h4>模板式表单</h4>
</div>
```

实现效果图

![image-20230620211331005](images/image-20230620211331005.png)

#### 1.4、FormBuilder创建表单

`FormBuilder` 对象来简化数据模型的创建

对应组件 TS 代码

```typescript
import { Component } from '@angular/core';
import {
  FormArray,
  FormBuilder,
  FormControl,
  Validators,
} from '@angular/forms';
import { mobileValidator } from 'src/validators/mobile';

@Component({
  selector: 'app-fb-reactive-form',
  templateUrl: './fb-reactive-form.component.html',
  styleUrls: ['./fb-reactive-form.component.less'],
})
export class FbReactiveFormComponent {
  formbuild = this.fb.group({
    name: ['', [Validators.required, Validators.pattern(/\s/)]], // Validators.required 校验器
    age: [null, Validators.required],
    mobile: [null, [Validators.required, mobileValidator]],
    skills: this.fb.group({
      code: [null, Validators.required],
      score: [null, Validators.required],
    }),
    email: this.fb.array(
      [null, null],
      [Validators.required, Validators.pattern(/\s/)]
    ),
  });

  constructor(private fb: FormBuilder) {}

  get emailFormArray() {
    return this.formbuild.controls['email'] as FormArray;
  }

  onSubmit() {
    console.log(this.formbuild.value);
  }

  addEmail() {
    const email = this.formbuild.get('email') as FormArray;
    email.push(new FormControl(null, Validators.required));
  }
}
```

对应组件 HTML 代码

```html
<div>
  <h4>FormBuilder创建响应式表单</h4>
  <form (ngSubmit)="onSubmit()" [formGroup]="formbuild">
    <p>姓名：<input formControlName="name">
    <br/>
    </p>
    <p>年龄：<input formControlName="age"></p>
    <p>手机号: <input formControlName="mobile" type="text">
      <br/>
    </p>
    <div formGroupName="skills">
      <p>编程技能：<input formControlName="code"></p>
      <p>评分：<input formControlName="score"></p>
    </div>
    <div formArrayName="email">
      <p *ngFor="let item of emailFormArray.controls; let i=index;" >
        邮箱地址{{i+1}}：<input type="text" [formControlName]="i">
      </p>
      <button type="button" (click)="addEmail()">增加邮箱</button>
    </div>
    <input type="submit" value="确定">
  </form>
</div>
```

实现效果图

![image-20230620214526545](images/image-20230620214526545.png)

### 2、模板式表单

#### 2.1、模板式表单概述

模板式表单不需要在组件定义数据模型，Angular 会隐式的帮助我们创建底层数据模型，其实对应的就是 `FormControl` 和 `FormGroup`

| 模板表单指令 | 表单模型对象 |
| ------------ | ------------ |
| NgForm       | FormGroup    |
| NgModel      | FormControl  |
| NgModelGroup | FormGroup    |

#### 3.2、模板式表单对元素的处理

如果一个 Angular 模板中出现了 `<form>` 标签，那么就会自动被Angular管理，其所有的原生属性和事件都会失去作用，完全交由Angular掌管。

还有一种显示的标注 form 表单的方式，就是给任意一个标签加上 `ngForm` 属性，使其变成一个 Angular 表单

```html
<div ngForm>
    ...
</div>
```

如果不想一个 form 元素被 Angular 接管，那么需要在元素上标注 `ngNoForm` 表示该表达不需要 Angular 管理

```html
<form ngNoForm>
    ...
</form>
```

#### 3.3、模板式表单案例

对应组件 HTML 代码

```html
<h4>模板式表单</h4>
<form #myForm="ngForm" (ngSubmit)="onSubmitMyForm(myForm.value)">
  账号：<input type="text"><br>
  密码：<input type="text"><br>
  重复密码：<input type="text"><br>
  <button type="submit">确定</button>
</form>
```

对应组件 TS 代码

```typescript
onSubmitMyForm(obj: Record<string, any>) {
   console.log(obj, '🚀');
}
```

实现效果图

![image-20230620225251412](images/image-20230620225251412.png)

🔔注意：可以看到虽然我们输入了内容，但是 value 属性中没有获取到数据，这是因为我们还没有为表单中的模型标签绑定属性。

#### 3.4、模板式表单绑定ngModel

对应组件 HTML 代码

```html
<h4>模板式表单</h4>
<form #myForm="ngForm" (ngSubmit)="onSubmitMyForm(myForm.value)">
  账号：<input type="text" ngModel name="account"><br>
  <div ngModelGroup="password">
    密码：<input ngModel name="pwd" type="text"><br>
    重复密码：<input ngModel name="repwd" type="text"><br>
  </div>
  <button type="submit">确定</button>
</form>
```

实现效果图

![image-20230624135729447](images/image-20230624135729447.png)

### 3、响应式表单校验器

#### 3.1、校验器的使用

```typescript
formbuild = this.fb.group({
  name: ['', Validators.required], // Validators.required 校验器
  age: [null, Validators.required],
  skills: this.fb.group({
    code: [null, Validators.required],
    score: [null, Validators.required],
  }),
  email: this.fb.array([['123456789@163.com', Validators.required]]),
});
```

#### 3.2、校验器信息获取

```typescript
const isVaild = this.formbuild.get('name')?.valid;
const err: any = this.formbuild.get('name')?.errors;
console.log(isVaild, err);
```

#### 3.3、定义自定义的校验器

定义自定义校验器

```typescript
import { FormArray, FormControl } from '@angular/forms';

/**
 * 验证地址都不能为空
 * @param array FormArray
 */
export function addressValidator(array: FormArray): any {
  for (let i = 0; i < array.controls.length; i++) {
    const val = array.controls[i] as FormControl;
    if (!val.value) {
      return { address: '地址不能为空' };
    }
  }
  return null;
}

import { FormControl } from '@angular/forms';

/**
 * mobile手机号式验证
 * @param control FormControl
 */
export function mobileValidator(control: FormControl): any {
  const reg = /^[1][3,4,5,6,7,8,9][0-9]{9}$/;
  const valid = reg.test(control.value);
  return control.value ? { mobile: !valid } : null;
}


import { FormControl, FormGroup } from '@angular/forms';

/**
 * 两次密码输入对比验证
 * @param group FormGroup
 */
export function passwordEqualValidator(group: FormGroup): any {
  const pwd: FormControl = group.get('pwd') as FormControl;
  const repwd: FormControl = group.get('repwd') as FormControl;
  // 返回密码对比的结果
  const valid: boolean = pwd.value === repwd.value;
  return valid ? null : { equal: '两次输入的密码不一致' 
};
```

自定义校验器的使用

```typescript
formbuild = this.fb.group({
  name: ['', [Validators.required, Validators.pattern(/\s/)]], // Validators.required 校验器
  age: [null, Validators.required],
  mobile: [null, [Validators.required, mobileValidator]],
  skills: this.fb.group({
    code: [null, Validators.required],
    score: [null, Validators.required],
  }),
  email: this.fb.array(
    [null, null],
    [Validators.required, Validators.pattern(/\s/)]
  ),
});
```

实现效果图

![image-20230624205614123](images/image-20230624205614123.png)

🔔注意： 多个校验器时，返回的 `errors` 对象属性合并

#### 3.4、在模板中显示校验信息

> 模板中显示校验信息通过 `hasError` 函数获取，该函数有两个参数：
>
> 第一个参数：填的是校验器返回的 `errors` 对象的属性
>
> 第二个参数：填的是表单的属性

对应组件 HTML 代码

```html
<div>
  <h4>FormBuilder创建响应式表单</h4>
  <form (ngSubmit)="onSubmit()" [formGroup]="formbuild">
    <p>姓名：<input formControlName="name">
    <br/>
    </p>
    <p>年龄：<input formControlName="age"></p>
    <p>手机号: <input formControlName="mobileNo" type="text">
      <span [hidden]="!formbuild.hasError('mobile','mobileNo')">请输入合格手机号</span>
      <br/>
    </p>
    <div formGroupName="skills">
      <p>编程技能：<input formControlName="code"></p>
      <p>评分：<input formControlName="score"></p>
    </div>
    <div formArrayName="email">
      <p *ngFor="let item of emailFormArray.controls; let i=index;" >
        邮箱地址{{i+1}}：<input type="text" [formControlName]="i">
      </p>
      <button type="button" (click)="addEmail()">增加邮箱</button>
    </div>
    <input type="submit" value="确定">
  </form>
</div>

```

#### 3.5、将校验失败的信息编写在校验器中

将校验器进行修改

```typescript
/**
 * mobile手机号式验证
 * @param control FormControl
 */
export function mobileValidator(control: FormControl): any {
  const reg = /^[1][3,4,5,6,7,8,9][0-9]{9}$/;
  const vaild = reg.test(control.value);
  return control.value
    ? { mobile: !vaild, errorMessage: '手机格式不正确' }
    : null;
}
```

文件 HTML 的修改

```html
<div>
  <h4>FormBuilder创建响应式表单</h4>
  <form (ngSubmit)="onSubmit()" [formGroup]="formbuild">
    <p>姓名：<input formControlName="name">
    <br/>
    </p>
    <p>年龄：<input formControlName="age"></p>
    <p>手机号: <input formControlName="mobileNo" type="text">
      <span [hidden]="!formbuild.hasError('mobile','mobileNo')">{{ formbuild.getError('errorMessage', 'mobileNo') }}</span>
      <br/>
    </p>
    <div formGroupName="skills">
      <p>编程技能：<input formControlName="code"></p>
      <p>评分：<input formControlName="score"></p>
    </div>
    <div formArrayName="email">
      <p *ngFor="let item of emailFormArray.controls; let i=index;" >
        邮箱地址{{i+1}}：<input type="text" [formControlName]="i">
      </p>
      <button type="button" (click)="addEmail()">增加邮箱</button>
    </div>
    <input type="submit" value="确定">
  </form>
</div>
```

## 四、Angular组件

### 1、创建组件

> 推荐使用官方脚手架命令进行创建组件

```bash
ng generate component <component-name> //创建一个组件
ng g c <component-name> //缩写
```

执行该命令后会默认创建以下文件：

+ 一个以该组件命名的文件夹
+ 一个组件文件 `<component-name>.component.ts`
+ 一个模板文件 `<component-name>.component.html`
+ 一个 CSS 文件，`<component-name>.component.css`
+ 测试文件 `<component-name>.component.spec.ts`

### 2、组件通信

#### 2.1、父传子

> 子组件接受父组件的参数时，通过 `@Input` 来获取参数

对应子组件 TS 代码

```typescript
import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-second',
  templateUrl: './second.component.html',
  styleUrls: ['./second.component.less'],
})
export class SecondComponent {
  @Input() num: number = 0;

  @Input() brr: string[] = [];
}
```

对应父组件 HTML 代码

```html
<div>
  组件通信：
  <p><button (click)="changeNum()">改变组件内的值类型</button>  <button (click)="changeArr()">改变组件内的引用类型</button></p>
  <app-second [num]="num" [brr]="arr"></app-second>
</div>
```

#### 2.2、子传父

> 子组件给父组件传递数据时调用 Output 装饰器

原理：

1. 子组件new一个事件
2. 子组件通过 `emit` 触发该事件，通过事件来传递参数
3. 父组件订阅事件接收参数

使用案例，对应子组件 HTML 代码

```html
<div>
  <p>second works!</p>
  <p>子组件：{{num}}</p>
  <div>
    输入内容：<input type="text" (input)="getInputVal(inputText)" #inputText> -- <button (click)="addToParent()">点击传递参数给父组件</button>
  </div>
</div>
```

对应子组件 TS 代码

```typescript
import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-second',
  templateUrl: './second.component.html',
  styleUrls: ['./second.component.less'],
})
export class SecondComponent {
  @Input() num: number = 0;

  @Input() brr: string[] = [];

  @Output() childEvent = new EventEmitter<string>(); // 创建一个事件

  str: string = '';

  getInputVal(text: any) {
    this.str = text.value;
  }

  addToParent() {
    this.childEvent.emit(this.str); // emit触发事件
  }
}
```

对应父组件 HTML 代码

```html
<div>
  组件通信：
  <p><button (click)="changeNum()">改变组件内的值类型</button>  <button (click)="changeArr()">改变组件内的引用类型</button></p>
  <app-second [num]="num" [brr]="arr" (childEvent)="getChildEvent($event)"></app-second>
</div>
```

对应父组件 TS 代码

```typescript
import {
  Component,
  OnInit,
  AfterViewInit,
  AfterViewChecked,
  OnDestroy,
  AfterContentInit,
  AfterContentChecked,
} from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.less'],
})
export class AppComponent {
  title = 'my-app';

  childStatus = true;

  num = 0;

  arr: string[] = [];

  obj: object = {};

  changeChildStatus() {
    this.childStatus = !this.changeChildStatus;
  }

  changeNum() {
    this.num += 1; // 改变值类型时，ngDoCheck会被触发
  }

  changeArr() {
    // this.arr = [...this.arr, `${new Date()}`]; // 改变引用类型地址时，ngDoCheck会被触发
    this.arr.push(`${new Date()}`); // 改变引用类型, 但是地址不变时，ngDoCheck会被触发
  }

  getChildEvent(val: string) {
    alert(val);
  }
}

```

#### 2.3、不相关组件之间的信息传递方式

+ 通过service进行传递

+ 通过路由进行传递参数

+ LocalStorage方式

+ 服务端通信方式

### 3、angular的双向绑定原理

> Angular 的双向绑定语法是方括号和圆括号的组合 `[()]`。`[]` 进行属性绑定，`()` 进行事件绑定

```html
<app-sizer [(size)]="fontSizePx"></app-sizer>
```

为了使双向数据绑定有效，`@Output()` 属性的名字必须遵循 `inputChange` 模式，其中 `input` 是相应 `@Input()` 属性的名字。例如，如果 `@Input()` 属性为 `size`，则 `@Output()` 属性必须为 `sizeChange`。

后面的 `sizerComponent` 具有值属性 `size` 和事件属性 `sizeChange`。 `size` 属性是 `@Input()`，因此数据可以流入 `sizerComponent `。 `sizeChange` 事件是一个 `@Output()` ，它允许数据从 `sizerComponent` 流出到父组件。

接下来，有两个方法， `dec()` 用于减小字体大小， `inc()` 用于增大字体大小。这两种方法使用 `resize()` 在最小/最大值的约束内更改 `size `属性的值，并发出带有新 `size `值的事件。

详细代码如下：

对应 sizer 组件 TS 代码

```typescript
import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-sizer',
  templateUrl: './sizer.component.html',
  styleUrls: ['./sizer.component.less']
})
export class SizerComponent {
  @Input() size!: number | string
  @Output() sizeChange = new EventEmitter()

  dec() { this.resize(-1); }
  inc() { this.resize(+1); }

  resize(delta :number) {
    this.size = Math.min(40, Math.max(8, +this.size + delta));
    this.sizeChange.emit(this.size)
  }
}
```

对应 sizer 组件 HTML 代码

```html
<div>
  <p>sizer works!</p>
  <div>
    <button (click)="dec()" title="smaller">-</button>
    <label [style.font-size.px]="size">FontSize: {{size}}px</label>
    <button (click)="inc()" title="bigger">+</button>
  </div>
</div>
```

对应父组件 HTML 代码

```html
<div>
  <app-sizer [(size)]="fontSizePx"></app-sizer>
</div>
```

对应父组件 TS 代码

```typescript
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.less'],
})
export class AppComponent {
  title = 'my-app';
  fontSizePx = 12;
}

```

### 4、组件的生命周期

#### 4.1、组件钩子函数简单介绍

| 钩子函数              |                                                              |
| --------------------- | ------------------------------------------------------------ |
| constructor           | 构造函数，初始化只调用一次，在ngOnInit之前调用               |
| ngOnInit              | ngOnInit()的执行是在组件/指令类的构造函数执行之后才会执行的，它只会**执行一次**。通常情况下，我们会把一些初始化逻辑放进ngOnInit()里面，如初始界面的数据的获取等。 |
| ngDoCheck             | 当组件内的值发生改变时，触发                                 |
| ngOnChanges           | 这个钩子的**第一次调用**肯定会在ngOnInit()执行前触发，一般是用来检测组件/指令的输入属性发生的变化用的，一旦该组件的输入属性（@Input）发生变化，就会触发该函数 |
| ngAfterContentInit    | 当 Angular 把外部内容投影进组件视图或指令所在的视图之后调用，并且只调用一次 |
| ngAfterContentChecked | 每当 Angular 检查完被投影到组件或指令中的内容之后调用。      |
| ngAfterViewInit       | 当 Angular 初始化完组件视图及其子视图或包含该指令的视图之后调，并且只调用一次 |
| ngAfterViewChecked    | 每当 Angular 做完组件视图和子视图或包含该指令的视图的变更检测之后调用。 |
| ngOnDestory           | 组件销毁时调用，一般用来清理缓存                             |

#### 4.2、单个组件生命周期执行顺序

对应组件 TS 代码

```typescript
import {
  Component,
  OnInit,
  AfterViewInit,
  AfterViewChecked,
  OnDestroy,
  AfterContentInit,
  AfterContentChecked,
} from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.less'],
})
export class AppComponent
  implements
    OnInit,
    AfterViewInit,
    AfterViewChecked,
    OnDestroy,
    AfterContentInit,
    AfterContentChecked
{
  title = 'my-app';

  num = 0;

  arr: string[] = [];

  obj: object = {};

  changeNum() {
    this.num += 1; // 改变值类型时，ngDoCheck会被触发
  }

  changeArr() {
    // this.arr = [...this.arr, `${new Date()}`]; // 改变引用类型地址时，ngDoCheck会被触发
    this.arr.push(`${new Date()}`); // 改变引用类型, 但是地址不变时，ngDoCheck会被触发
  }

  constructor() {
    console.log('1', 'constructor');
  }

  ngOnInit(): void {
    console.log('2', 'ngOnInit');
  }

  ngOnChanges() {
    console.log('3', 'ngOnChanges');
  }

  ngDoCheck() {
    console.log(4, 'ngDoCheck');
  }

  ngAfterContentInit(): void {
    console.log(5, 'ngAfterContentInit');
  }

  ngAfterContentChecked(): void {
    console.log(6, 'ngAfterContentChecked');
  }

  ngAfterViewInit(): void {
    console.log(7, 'ngAfterViewInit');
  }

  ngAfterViewChecked(): void {
    console.log(8, 'ngAfterViewChecked');
  }

  ngOnDestroy() {
    console.log(9, 'ngOnDestroy');
  }
}
```

对应组件 HTML 代码

```html
<div>
  <p><button (click)="changeNum()">改变组件内的值类型</button>  <button (click)="changeArr()">改变组件内的引用类型</button></p>
  <p>num: {{num}}</p>
  <p>arr: <li *ngFor="let item of arr">{{item}}</li></p>
</div>

```

实现效果图

![image-20230618184502519](images/image-20230618184502519.png)

同时也得出一些问题：

问题1： ngOnChanges 和 ngOnDestroy 函数为什么没有被执行，ngOnDestroy 在组件销毁时被执行，而 ngOnChanges 则是在 input 值有变化时执行。

问题2：部分函数为什么会被执行两次

问题3：ngDoCheck函数无论组件内的值类型还是引用类型，发生改变时就会触发ngDoCheck函数，无论引用类型地址是否改变

#### 4.3、ngOnChanges 和 ngOnDestroy钩子函数的执行时期

1. ngOnDestroy触发时期

父组件 TS 代码配置

```typescript
import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.less'],
})
export class AppComponent {
  childStatus = true;
  
  changeChildStatus() {
    this.childStatus = !this.changeChildStatus;
  }
}
```

父组件对应 HTML 代码

```html
<div>
    <p><button (click)="changeChildStatus()">点击触发</button></p>
    子组件：
    <app-child *ngIf="childStatus"></app-child>
 </div>
```

子组件对应 TS 代码

```typescript
import { Component, OnDestroy } from '@angular/core';

@Component({
  selector: 'app-child',
  templateUrl: './child.component.html',
  styleUrls: ['./child.component.less'],
})
export class ChildComponent implements OnDestroy {
  ngOnDestroy(): void {
    console.log('child ngOnDestroy');
  }
}
```
实际效果图
                                                                                                                                                                                 
![image-20230618192005068](images/image-20230618192005068.png)

2. ngOnChanges触发时期

对应子组件 TS 代码

```typescript
import { Component, OnDestroy, Input } from '@angular/core';

@Component({
  selector: 'app-child',
  templateUrl: './child.component.html',
  styleUrls: ['./child.component.less'],
})
export class ChildComponent implements OnDestroy {
  @Input() num: number = 0;

  @Input() brr: string[] = [];

  ngOnChanges() {
    console.log('child', 'ngOnChanges');
  }

  ngOnDestroy(): void {
    console.log('child ngOnDestroy');
  }
}
```

对应父组件 HTML 代码

```html
<div>
  <p><button (click)="changeNum()">改变组件内的值类型</button>  <button (click)="changeArr()">改变组件内的引用类型</button></p>
  <div>
    <p><button (click)="changeChildStatus()">点击触发</button></p>
    子组件：
    <app-child *ngIf="childStatus" [num]="num" [brr]="arr"></app-child>
  </div>
  <p>num: {{num}}</p>
  <p>arr: <li *ngFor="let item of arr">{{item}}</li></p>
</div>

```

父组件给子组件传递 num 和 brr 属性，子组件通过 `@Input` 进行接收。当父组件改变值类型时，也就是例中的num变量，子组件的 `ngOnChanges函数` 会被触发。

实际效果图

![image-20230618211936321](images/image-20230618211936321.png)

当改变父组件的引用类型时，如果引用类型的地址发生改变时，`ngOnChanges函数` 就会触发，当引用类型地址不发生变化时，`ngOnChanges函数` 就不会被触发

```typescript
// 当父组件通过以下形式改变时，子组件的ngOnChanges会触发
this.arr = [...this.arr, `${new Date()}`];

// 当父组件通过以下形式改变时，子组件的ngOnChanges不会触发
this.arr.push(`${new Date()}`);
```

数组通过 push、unshift 等不产生一个新数组时，数组地址不会发生变化以及对象通过 `obj['属性']` 改变时也不会改变。

### 5、父子组件生命周期执行顺序

![image-20230709170444798](images/image-20230709170444798.png)

Angular 父子组件生命周期钩子过程分析：

1. 子组件渲染在父组件 `ngAfterContentChecked` 钩子函数执行完毕之后，在调用子组件的生命周期，一直等子组件的 `ngAfterViewChecked` 钩子函数执行完成之后，再回到父组件调用 `ngAfterViewInit` 等后续钩子函数。
2. 当发生变更检测时，父组件先触发 ngDoCheck() => ngAfterContentChecked()，然后子组件触发 ngOnChanges() => ngDoCheck() => ngAfterContentChecked() => ngAfterViewChecked()，最后父组件调用ngAfterViewChecked()。

### 6、独立组件

> 独立组件是 Angular14 的特性，在 Angular 14 中， 开发者可以尝试使用独立组件开发各种组件，但是值得注意的是 Angular 独立组件的 API 仍然没有稳定下，将来可能存在一些破坏性更新，所以不推荐在生产环境中使用。

#### 6.1、创建独立组件

对于已有的组件，我们可以在 `@Component()` 中添加 standalone: true 的，然后我们可以在没有 `@NgModule()` 的情况下直接使用 `imports` 导入其他模块了。 如果是新建组件，可以使用 `ng generate component <name> --standalone` 的命令，直接创建一个独立组件。例如：

```bash
ng g c own --standalone
```

查看 ts 的文件

```typescript
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-own',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './own.component.html',
  styleUrls: ['./own.component.less']
})
export class OwnComponent {

}
```

#### 6.2、独立组件导入已有的模块

```typescript
@Component({
  selector: 'app-own',
  standalone: true,
  imports: [CommonModule], // 独立组件导入模块
  templateUrl: './own.component.html',
  styleUrls: ['./own.component.less'],
})
```

#### 6.3、独立组件作为挂载

```typescript
import { bootstrapApplication } from '@angular/platform-browser';

import { OwnComponent } from './module/component/components/own/own.component'; // 独立组件

bootstrapApplication(OwnComponent).catch((err) => console.error(err)); // 独立组件挂载
```

#### 6.4、独立组件配置依赖注入和路由

```typescript
bootstrapApplication(OwnComponent, {
  providers: [
    {
      provide: BACKEND_URL,
      useValue: 'https://photoapp.looknongmodules.com/api', // 配置依赖注入
    },
    importProvidersFrom(RouterModule.forRoot([])), // 配置路由
  ],
}).catch((err) => console.error(err)); // 独立组件挂载
```

## 五、Angular指令

### 1、内置指令

Angular 自带的内置指令有 `ngIf`、`ngFor`、`ngClass`、`ngStyle` 等，具体使用参考上述的模板语法

#### 1.2、属性型指令

在 Angular 中像 `ngClass`、`ngStyle` 等属于属性型指令

```html
 <div>
    <p [class]="className" ngClass="text-error">ngClass指令与ngStyle指令：<span [ngStyle]="styles">测试ngStyle和ngClass指令</span></p>
 </div>
```

#### 1.3、结构型指令

在 Angular 中像 `ngIf`、`ngFor`、`ngSwitch` 等属于结构型指令

```html
<ul>
   <li *ngFor="let item of courseArr">{{item}}</li>
</ul>
```

### 2、自定义指令

#### 2.1、快速创建自定义指令模板

```bash
ng g directive <directive-name> --skip-import
```

会产生两个文件：

+ 一个测试文件

+ 一个对应的ts文件

![image-20230619215611160](images/image-20230619215611160.png)

#### 2.2、自定义属性型指令

```typescript
import { Directive, ElementRef, Input, HostListener } from '@angular/core';

@Directive({
  selector: '[appHighlight]', // 指令名称
})
export class HighlightDirective {
  // 给这个指令定义一个 highlight 属性
  @Input() appHighlight = 'yellow';

  constructor(private el: ElementRef) {} // el 为指令操作的dom对象

  // 给这个dom定义一个mouseenter的监听器 后面的名字可以自定定义
  @HostListener('mouseenter')
  onMouseEnter() {
    this.highlightFun(this.appHighlight);
  }

  // 添加鼠标移出的监听器 绑定对应的事件逻辑
  @HostListener('mouseleave')
  onMouseLeave() {
    this.highlightFun('');
  }

  private highlightFun(color: string) {
    this.el.nativeElement.style.backgroundColor = color;
  }
}
```

在根模块中的引入

```typescript
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppComponent } from './app.component';
import { HighlightDirective } from '../../shared/directive/highlight.directive';

@NgModule({
  declarations: [AppComponent, HighlightDirective], // HighlightDirective
  imports: [BrowserModule],
  bootstrap: [AppComponent],
})
export class DirectiveModule {}
```

实际效果图

![image-20230619220509856](images/image-20230619220509856.png)

如何接收参数，只有当指令名与 @Input 定义的变量一致可以接受变量，如下所示

```typescript
import { Directive, ElementRef, Input, HostListener } from '@angular/core';

@Directive({
  selector: '[appHighlight]', // 指令名称
})
export class HighlightDirective {
  // 给这个指令定义一个 appHighlight 属性
  @Input() appHighlight = 'yellow';

  constructor(private el: ElementRef) {} // el 为指令操作的dom对象

  // 给这个dom定义一个mouseenter的监听器 后面的名字可以自定定义
  @HostListener('mouseenter')
  onMouseEnter() {
    this.highlightFun(this.appHighlight);
  }

  // 添加鼠标移出的监听器 绑定对应的事件逻辑
  @HostListener('mouseleave')
  onMouseLeave() {
    this.highlightFun('');
  }

  private highlightFun(color: string) {
    this.el.nativeElement.style.backgroundColor = color;
  }
}
```

对应组件 HTML 代码

```html
<div>
  <h4>自定义指令</h4>
  <p [appHighlight] = "'red'">自建的style型指令</p>
</div>
```

实际效果图

![image-20230619221640699](images/image-20230619221640699.png)

#### 2.3、自定义结构指令

> 结构指令，影响当前元素以及后代元素，大多以*开头

模拟自定义的`*ngIf`结构指令:

```typescript
import { Directive, TemplateRef, Input, ViewContainerRef } from '@angular/core';

@Directive({
  selector: '[customNgIf]',
})
export class CustomNgIfDirective {
  constructor(
    private templateRef: TemplateRef<any>,
    private viewContainer: ViewContainerRef
  ) {}

  @Input() set customNgIf(condition: boolean) {
    if (condition) {
      this.viewContainer.createEmbeddedView(this.templateRef);
    } else {
      this.viewContainer.clear();
    }
  }
}
```

在 HTML 的调用

```html
<div>
  <h4>自定义指令</h4>
  <p [appHighlight] = "'red'">自建的style型指令</p>
  <p *customNgIf="false">自定义结构指令</p>
</div>
```

## 六、Angular服务和依赖注入

#### 6.1、Service概念和作用

在 React 和 vue 当中独有各自的状态管理工具，例如 Redux、vuex、react 的 context 等。在 Angular 中通常所有的 Service 服务组件都是通过依赖注入进行管理的，angular 的 service 可以类比 React、vuex 中的数据状态管理库概念。

不同之处：

+ 在angular中，服务分angular自带的 `内置服务` 和 `可以自己创建服务`，然后通过依赖注入对应的 `模块` 和 `组件` 进行引用
+ 在 React 和 vue 中，这统一挂全部在到全局中

在 angular 的 service 的优势和作用：

组件不应该直接获取或保存数据，它们不应该了解是否在展示假数据。 它们应该聚焦于展示数据，而把数据访问的职责委托给某个服务。

🔔最值得注意的是： 服务之间可以进行多级注入，指的是一个服务注入依赖另一个服务

#### 6.2、自定义Service创建

使用官方脚手架命令创建 service (推荐)

```bash
ng generate service <service-name>
or
ng g s <service-name>
```

使用该命令会产生 `xxx.service.spec.ts` 和 `xxx.service.ts` 两个文件

在创建的 user.service.ts 存储自己的数据

```typescript
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  userInfo :Record<string, string> = {
    name: '小明',
    age: '18'
  }

  subscribeBook :string[] = [
    '绿皮书',
    '阿凡达',
    '速度与激情'
  ]

  constructor() { }

  getUerInfo() {
    return this.userInfo
  }
}
```

在组件中使用模块

```typescript
import { Component } from '@angular/core';
import { UserService } from 'src/core/service/user.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.less'],
})

export class AppComponent {
  constructor(public userService: UserService) {}
}
```

在模板中使用

```typescript
<div>service模块</div>
<div>
  <h3>小明的书籍</h3>
  <ol>
    <li *ngFor="let item of userService.subscribeBook">{{item}}</li>
  </ol>
</div>
```

实际效果图

![image-20230702180743113](images/image-20230702180743113.png)

## 七、Angular模块概念

NgModule 模块是 Angular 中一个重要的点，因为 Angular 的基本构造块就是 NgModule。NgModule 会把相关的代码（组件，指令，服务）收集到一些功能集中，形成功能单元。可以说：模块为组件，指令，服务提供了编译的上下文环境。

### 1、创建模块

推荐使用官方脚手架命令进行创建模块

```bash
ng generate module <module-name> // 创建一个模块
ng g m <module-name> // 缩写

例如：
ng g m order // 创建订单模块
ng g m order --routing // 创建带路由订单模块
```

### 2、模块构成

angular 模块就是一个带有 @ngModule() 装饰器的类，装饰器 @ngModule 接受一个元数据对象。该对象的属性用来描述该模块。

+ declarations：声明组件，指令，管道
+ imports：引入依赖项
+ exports：导出模块
+ providers：服务注册
+ bootstrap：指定宿主组件

点进去 @NgModule() 装饰器的类我们可以看到他有如下属性以及官方的对其属性的解释：

```typescript
export declare interface NgModule {
    providers?: Provider[];// 本模块向全局服务中贡献的那些服务的创建器。 这些服务能被本应用中的任何部分使用。（你也可以在组件级别指定服务提供商，这通常是首选方式。）
    declarations?: Array<Type<any> | any[]>;// 那些属于本 NgModule 的组件、指令、管道
    imports?: Array<Type<any> | ModuleWithProviders<{}> | any[]>;// 那些导出了本模块中的组件模板所需的类的其它模块
    exports?: Array<Type<any> | any[]>;//那些能在其它模块的组件模板中使用的可声明对象的子集
    entryComponents?: Array<Type<any> | any[]>;
    bootstrap?: Array<Type<any> | any[]>;
    schemas?: Array<SchemaMetadata | any[]>;
}
```

### 3、常见模块

| **NgModule**        | **导入**                  | 使用                                                         |
| ------------------- | ------------------------- | ------------------------------------------------------------ |
| BrowserModule       | @angular/platform-browser | 想要在浏览器中运行应用时                                     |
| FormsModule         | @angular/forms            | 当要构建模板驱动表单时（它包含 NgModel ）                    |
| ReactiveFormsModule | @angular/forms            | 当要构建响应式表单时                                         |
| RouterModule        | @angular/router           | 要使用路由功能，并且你要用到 RouterLink，forRoot() 和 forChild() 时 |
| HttpClientModule    | @angular/common/http      | 当你要和服务器对话时，创建接口                               |

### 4、根模块

模块是在组件之上的一层抽象，组件以及指令、管道、服务、路由等都能通过模块去组织。

Angular提供了@NgModule装饰器来创建模块，一个应用可以有多个模块，有且只有一个 `根模块（Root Module）`，其他模块叫做 `特性模块(Feature Module)`

根模块是启动应用的入口模块，根模块必须通过 bootstrap 元数据来指定应用的根组件，然后通过 bootstrapModule() 方法来启动应用。 建立一个根模块，命名为 AppModule，并将它保存为 app.module.ts。

app.module.ts 中通过 @NgModule 的 bootstrap 元数据指定 AppComponent 组件

```typescript
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent] // 根组件
})
export class AppModule { } // 导出根模块
```

AppComponent 组件即为根组件。 再创建一个 main.ts，利用 platformBrowserDynamic().bootstrapModule() 方法来启动根模块，并将 AppComponent 组件的内容展示到页面上。

### 5、模块与模块之间的调用

在 `shared` 目录下创建 `shared.module.ts`，具体如下

```typescript
import { NgModule } from '@angular/core';
import { FormatTimePipe } from './pipe/dayjs.pipe';
import { HighlightDirective } from './directive/highlight.directive';
@NgModule({
  declarations: [FormatTimePipe],
  exports: [FormatTimePipe],
})
export class SharedModule {}
```

模块的引入调用

```typescript
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppComponent } from './app.component';
import { SharedModule } from 'src/shared/shared.module';

@NgModule({
  declarations: [AppComponent],
  imports: [BrowserModule, SharedModule],
  bootstrap: [AppComponent],
})
export class TemplateModule {}
```

## 八、Angular路由

### 1、路由的基础创建

```typescript
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { AboutComponent } from './components/about/about.component';
import { NotFoundComponent } from './components/not-found/not-found.component';

const routes: Routes = [ // 一级路由
  {
    path: 'home',
    component: HomeComponent,
  },
  {
    path: 'about',
    component: AboutComponent,
  },
  {
    path: '',
    redirectTo: '/home',
    pathMatch: 'full',
  }, // 路由重定向
  {
    path: '**',
    component: NotFoundComponent,
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class RouteRoutingModule {}
```

路由出口通过 `router-outlet` 组件

```html
<router-outlet></router-outlet>
```

模板中进行跳转时通过 `routerLink` 属性

```html
<div>
  <h4>路由学习</h4>
  <div>
    <p>基础路由跳转：{{title}}</p>
    <p>
      <a routerLink="/home">Home主页面</a> &nbsp; &nbsp;
      <a routerLink="/about">About</a> &nbsp; &nbsp;
      <a routerLink="/personal">个人页面</a>
      <li routerLink="/about">4444</li>
    </p>
  </div>
  <div>
    <router-outlet></router-outlet>
  </div>
</div>
```

### 2、如何设置路由的hash模式和history模式

> Angular的默认路由模式为 history 模式

可以在根模块的 `RouterModule.forRoot()` 的第二个参数中传入一个带有 `useHash: true` 的对象，以回到基于 `HashLocationStrategy` 的传统方式。

```typescript
@NgModule({
  declarations: [
    HomeComponent,
    AboutComponent,
    NotFoundComponent,
  ],
  imports: [RouterModule.forRoot(routes, { useHash: true })], // 设置hash模式
  exports: [
    RouterModule,
    HomeComponent,
    AboutComponent,
    NotFoundComponent
  ]
})
```

### 3、嵌套路由

```typescript
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { AboutComponent } from './components/about/about.component';
import { NotFoundComponent } from './components/not-found/not-found.component';
import { PersonalComponent } from './components/personal/personal.component';
import { PersonInfoComponent } from './components/person-info/person-info.component';
import { PersonRecordComponent } from './components/person-record/person-record.component';

const routes: Routes = [
  {
    path: 'home',
    component: HomeComponent,
  },
  {
    path: 'about',
    component: AboutComponent,
  },
  {
    path: 'personal',
    component: PersonalComponent,
    children: [
      // 嵌套路由
      {
        path: 'info',
        component: PersonInfoComponent,
        data: {
          title: '个人信息',
        },
      },
      {
        path: 'record',
        component: PersonRecordComponent,
        data: {
          title: '个人记录',
        },
      },
      {
        path: '',
        redirectTo: '/personal/info',
        pathMatch: 'full',
      }, // 路由重定向
    ],
  },
  {
    path: '',
    redirectTo: '/home',
    pathMatch: 'full',
  }, // 路由重定向
  {
    path: '**',
    component: NotFoundComponent,
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class RouteRoutingModule {}
```

### 4、路由懒加载

路由的懒加载主要是通过 `loadComponent`，`loadChildren` 来进行懒加载，`loadComponent` 通过加载组件，`loadChildren` 是加载模块。值得注意的是，`loadComponent` 加载懒加载组件时只能加载独立组件，而且在 `路由模块的declarations` 中无需引用

相关代码如下

```typescript
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { AboutComponent } from './components/about/about.component';
import { NotFoundComponent } from './components/not-found/not-found.component';
import { PersonalComponent } from './components/personal/personal.component';
import { PersonInfoComponent } from './components/person-info/person-info.component';
import { PersonRecordComponent } from './components/person-record/person-record.component';

const routes: Routes = [
  {
    path: 'home',
    component: HomeComponent,
  },
  {
    path: 'about',
    component: AboutComponent,
  },
  {
    path: 'login',
    loadComponent: () =>
      import('./components/login/login.component').then(
        (mod) => mod.LoginComponent
      ),
  },
  {
    path: 'user',
    loadChildren: () =>
      import('./ng-module/user.module').then((m) => m.UserModule),
  },
  {
    path: 'personal',
    component: PersonalComponent,
    children: [
      // 嵌套路由
      {
        path: 'info',
        component: PersonInfoComponent,
        data: {
          title: '个人信息',
        },
      },
      {
        path: 'record',
        component: PersonRecordComponent,
        data: {
          title: '个人记录',
        },
      },
      {
        path: '',
        redirectTo: '/personal/info',
        pathMatch: 'full',
      }, // 路由重定向
    ],
  },
  {
    path: '',
    redirectTo: '/login',
    pathMatch: 'full',
  }, // 路由重定向
  {
    path: '**',
    component: NotFoundComponent,
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class RouteRoutingModule {}a
```

当加载路由子模块时使用 `RouterModule.forChild()` 进行加载，父模块加载时使用 `RouterModule.forRoot()` 进行加载

相关代码如下

```typescript
// 子路由模块加载
const routes: Routes = [
  {
    path: 'userinfo',
    component: UserInfoComponent,
    data: {
      title: '个人信息',
    },
  },
  {
    path: 'userlist',
    component: UserListComponent,
    data: {
      title: '个人列表',
    },
  },
  {
    path: '',
    redirectTo: '/user/userinfo',
    pathMatch: 'full',
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class UserRoutingModule {}


// 父路由模块
const routes: Routes = [
  {
    path: 'home',
    canActivate: [AuthGuard],
    component: HomeComponent,
  },
  {
    path: 'about',
    component: AboutComponent,
  },
  {
    path: 'login',
    loadComponent: () =>
      import('./components/login/login.component').then(
        (mod) => mod.LoginComponent
      ),
  },
  {
    path: 'user',
    loadChildren: () =>
      import('./ng-module/user.module').then((m) => m.UserModule),
  },
  {
    path: 'personal',
    component: PersonalComponent,
    children: [
      // 嵌套路由
      {
        path: 'info',
        component: PersonInfoComponent,
        data: {
          title: '个人信息',
        },
      },
      {
        path: 'record',
        component: PersonRecordComponent,
        data: {
          title: '个人记录',
        },
      },
      {
        path: '',
        redirectTo: '/personal/info',
        pathMatch: 'full',
      }, // 路由重定向
    ],
  },
  {
    path: '',
    redirectTo: '/home',
    pathMatch: 'full',
  }, // 路由重定向
  {
    path: '**',
    component: NotFoundComponent,
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class RouteRoutingModule {}
```

### 5、路由守卫

#### 5.1、使用官方脚手架创建守卫

```bash
ng g guard <guard-name>
```

#### 5.2、常用的路由守卫类型

1. canActivate

表示进入该路由时触发，值为一个数组

```typescript
{
  path: 'personal',
  canActivate: [AuthGuard], // 路由守卫
  component: PersonalComponent,
}
```

其中 `AuthGuard` 是一个函数，返回值类型有很多，可以返回一个布尔值，返回 `true` 时表示路由可以访问，返回 `false` 时表示路由不可以访问。<u>最值得注意的是</u>，`当前路由无权限访问时，该路由的子路由都无权访问。`

案例如下

```typescript
// PermissionGuard 守卫

import { CanActivateFn } from '@angular/router';

export const PermissionGuard: CanActivateFn = (route, state) => {
  console.log(route, state.url, 'Permission', '🚀');
  return false;
};
```

相关代码如下

```typescript
  {
    path: 'personal',
    canActivate: [AuthGuard],
    component: PersonalComponent,
    children: [
      {
        path: 'info',
        canActivate: [PermissionGuard],
        component: PersonInfoComponent,
        data: {
          title: '个人信息',
        },
        children: [
          {
            path: 'base',
            component: BaseComponent,
          },
          {
            path: 'trade',
            component: TradeComponent,
          },
          {
            path: '',
            redirectTo: '/personal/info/base',
            pathMatch: 'full',
          },
        ],
      },
      {
        path: 'record',
        component: PersonRecordComponent,
        data: {
          title: '个人记录',
        },
      },
      {
        path: '',
        redirectTo: '/personal/record',
        pathMatch: 'full',
      }, // 路由重定向
    ],
  },
```

当在浏览器的url上输入 `/personal/info` 或者 `/personal/info/base`，不会展示对应内容组件。

嵌套路由时canActivate守卫执行顺序：`父路由执行守卫、在匹配到子路由时执行子路由守卫，先父后子`

实际效果图

![image-20230625182956610](images/image-20230625182956610.png)

2. canActivateChild

当子路由路径发生变化触发，值为一个数组

案例如下

```typescript
  {
    path: 'personal',
    canActivate: [AuthGuard],
    component: PersonalComponent,
    children: [
      {
        path: 'info',
        canActivate: [PermissionGuard],
        canActivateChild: [ChildGuard],
        component: PersonInfoComponent,
        data: {
          title: '个人信息',
        },
        children: [
          {
            path: 'base',
            component: BaseComponent,
          },
          {
            path: 'trade',
            component: TradeComponent,
          },
          {
            path: '',
            redirectTo: '/personal/info/base',
            pathMatch: 'full',
          },
        ],
      },
      {
        path: 'record',
        component: PersonRecordComponent,
        data: {
          title: '个人记录',
        },
      },
      {
        path: '',
        redirectTo: '/personal/info/base',
        pathMatch: 'full',
      }, // 路由重定向
    ],
  },
```

实际效果图

![image-20230625190330590](images/image-20230625190330590.png)

### 6、路由传参

#### 6.1、query形式传递参数

在html进行传递参数

```html
<a routerLink="/dynamicparams" [queryParams]="{name: 'Chason'}">动态参数</a>
```

在ts组件中获取

```typescript
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-dynamic-params',
  templateUrl: './dynamic-params.component.html',
  styleUrls: ['./dynamic-params.component.less'],
})
export class DynamicParamsComponent implements OnInit {
  queryParams: string = '';
  constructor(private activatedRoute: ActivatedRoute, private router: Router) {}
  
  ngOnInit(): void {
    this.queryParams = this.activatedRoute.snapshot.queryParams['name']; // 获取queryParams参数
  }
}
```

可以通过 `this.router.navigateByUrl` 和 `this.router.navigate` 进行跳转和传递参数，两种使用上存在区分：

```typescript
  gotoHome() {
    this.router.navigateByUrl('/home'); // 只能传递Url
  }

  gotoParamsRoute() {
    this.router.navigate(['/dynamicparams'], {
      queryParams: { name: 'Chason' },
    });
  }
```

#### 6.2、动态传参

在Html中传递传参

```html
<a [routerLink]="['/dynamicparams', 5]" [queryParams]="{name: 'Chason'}">动态参数</a> &nbsp; &nbsp;
```

在ts组件中获取参数

```typescript
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-dynamic-params',
  templateUrl: './dynamic-params.component.html',
  styleUrls: ['./dynamic-params.component.less'],
})
export class DynamicParamsComponent implements OnInit {
  idParams: number | string = '';
  queryParams: string = '';
  constructor(private activatedRoute: ActivatedRoute, private router: Router) {}
  ngOnInit(): void {
    this.idParams = this.activatedRoute.snapshot.params['id']; // 获取params参数
    this.queryParams = this.activatedRoute.snapshot.queryParams['name']; // 获取queryParams参数
  }
}
```

通过 `this.router.navigate` 传递参数

```typescript
  gotoParamsRoute() {
    // 以下三种形式都可以
    // this.router.navigate(['/dynamicparams/48'])
    // this.router.navigate(['/dynamicparams', 48])
    this.router.navigate([`/dynamicparams/${99}`]);
  }
```

### 7、resolve动态传参数

创建resolve

```typescript
import { Injectable } from '@angular/core';
import {
  Resolve,
  RouterStateSnapshot,
  ActivatedRouteSnapshot,
} from '@angular/router';
import { Observable, of } from 'rxjs';

interface UserInfo {
  name: string;
  age: number;
}

@Injectable({
  providedIn: 'root',
})
export class UserinfoResolver implements Resolve<any> {
  constructor() {}

  resolve(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<UserInfo> | Promise<UserInfo> | UserInfo {
    return {
      name: 'Chason',
      age: 24,
    };
  }
}

```

在路由的配置

```typescript
  {
    path: 'resolveparams',
    component: ResolveParamsComponent,
    resolve: {
      data: UserinfoResolver,
    },
    data: {
      title: 'Resolve页面',
    },
  },
```

在组件内调用

```typescript
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-resolve-params',
  templateUrl: './resolve-params.component.html',
  styleUrls: ['./resolve-params.component.less'],
})
export class ResolveParamsComponent implements OnInit {
  constructor(private activatedRoute: ActivatedRoute) {}
  ngOnInit(): void {
    this.activatedRoute.data.subscribe({
      next: (rsp) => {
        console.log(rsp);
      },
    });
    console.log();
  }
}
```

实际效果图

![image-20230702171721547](images/image-20230702171721547.png)

## 九、Angular的请求与拦截

### 1、配置请求

Angular 对应请求自带 `HttpClient` 服务，创建 `http.service.ts` 服务进行简单封装集中

```typescript
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class HttpService {
  constructor(private http: HttpClient) {}

  post(url: string, data: Record<string, any>) {
    return this.http.post(url, data);
  }

  get(url: string) {
    return this.http.get(url);
  }
}
```

### 2、配置请求和响应拦截器

先创建 `intercept.service.ts` 创建拦截器，然后在根模块进行配置.

```typescript
// intercept.service.ts
import {
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, filter, tap } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class InterceptService implements HttpInterceptor {
  intercept(
    req: HttpRequest<Record<string, any>>,
    next: HttpHandler
  ): Observable<HttpEvent<Record<string, any>>> {
    let secureReq: HttpRequest<any> = req;

    secureReq = secureReq.clone({
      url: environment.baseUrl + req.url,
    });

    console.log(secureReq, '<___req请求');

    return next.handle(secureReq).pipe(
      tap(
        (rsp: any) => {
          // 处理响应的数据
          console.log(rsp);
        },
        (error: any) => {
          // 处理错误的数据
          console.log(error);
        }
      )
    );
  }
}
```

在根模块的调用

```typescript
import { NgModule } from '@angular/core';
import { AppComponent } from './app.component';
import { BrowserModule } from '@angular/platform-browser';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { InterceptService } from 'src/core/service/intercept.service';

@NgModule({
  declarations: [AppComponent],
  imports: [BrowserModule, HttpClientModule], // 根模块导入 HttpClientModule 模块
  providers: [
    // 配置请求拦截器
    {
      provide: HTTP_INTERCEPTORS,
      useClass: InterceptService,
      multi: true,
    },
  ],
  bootstrap: [AppComponent],
})
export class HttpModule {}
```

相关的 `environments` 目录，在该目录下存在 `environment.prod.ts`、`environment.ts`, 并且在 `angular.json` 文件的相关配置

```typescript
// environment.ts
export const environment = {
  baseUrl: 'http://localhost:4200/api',
  production: false,
};

// environment.prod.ts
export const environment = {
  baseUrl: 'http://localhost:4200/api',
  production: true,
};
```

angular即在 production 模式下把 `environment.ts` 替换成 `environment.prod.ts`

![image-20230709162308260](images/image-20230709162308260.png)

### 3、配置代理

在 src 目录下配置 `proxy.conf.json` 文件

```json
{
  "/api": {
    "target": "http://127.0.0.1:8080",
    "secure": false
  }
}
```

angular.json 的相关配置

```json
 "serve": {
    "builder": "@angular-devkit/build-angular:dev-server",
    "configurations": {
      "production": {
        "browserTarget": "my-app:build:production"
      },
      "development": {
        "browserTarget": "my-app:build:development"
      }
    },
    "options": {
      "proxyConfig": "src/proxy.conf.json" // 代理配置
    },
    "defaultConfiguration": "development"
  },
```

官方文档代理说明，详细参考文档：https://angular.io/guide/build#proxying-to-a-backend-server

### 4、本地创建api接口服务

在项目创建 `express-server` 目录，同时使用 express 框架创建简单 api 服务, 并且通过 `node index.js` 运行服务

```javascript
// index.js
const express = require("express");
const app = express();
const api = require("./api");

// 配置允许跨域
app.all("*", function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "content-type");
  res.header("Access-Control-Allow-Methods", "DELETE,PUT,POST,GET,OPTIONS");
  if (req.method.toLowerCase() === "options") {
    res.send(200);
  } else {
    next();
  }
});

app.use("/api", api);

app.listen(8080, function () {
  console.log("Express server runing at http://127.0.0.1:8080");
});

// api.js
const express = require("express");
const api = express.Router();
const getdata = require("./get-data.json");
const postData = require("./post-data.json");

api.get("/userinfo", (req, res) => {
  let query = req.query;
  res.send(getdata);
});

api.post("/classlist", (req, res) => {
  res.send(postData);
});

module.exports = api;
```

在组件内调用接口：

```typescript
import { Component, OnInit } from '@angular/core';
import { HttpService } from 'src/core/service/http.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.less'],
})
export class AppComponent implements OnInit {
  constructor(private httpService: HttpService) {}
  ngOnInit(): void {
    this.httpService.get('/userinfo').subscribe({
      next: (rsp) => {
        console.log(rsp);
      },
      error: (error) => {
        console.log(error);
      },
    });

    this.httpService.post('/classlist', { id: '2023' }).subscribe({
      next: (rsp) => {
        console.log(rsp);
      },
      error: (error) => {
        console.log(error);
      },
    });
  }
}
```

在这里请求的是本地 `http://localhost:4200/api` 地址，会通过 `proxy.conf.json` 代理转到 `http://127.0.0.1:8080

实际效果图

![image-20230709163941887](images/image-20230709163941887.png)

## 十、配置Angular服务端渲染

> 官方网站已经提供了相关服务端渲染的配置

### 1、使用官方提供命令创建脚手架

运行以下命令

```bash
ng add @nguniversal/express-engine
```

当命令执行完毕之后，会增加某些文件和修改某一些文件

![image-20230625210044296](images/image-20230625210044296.png)

### 2、服务文件创建的文件作用讲解

1. app 文件下的 app.server.module.ts

```typescript
import { NgModule } from '@angular/core';
import { ServerModule } from '@angular/platform-server';

import { AppModule } from './app.module';
import { AppComponent } from './app.component';

@NgModule({
  imports: [
    AppModule, // 根模块
    ServerModule, // 定义为服务端模块渲染
  ],
  bootstrap: [AppComponent],
})
export class AppServerModule {}
```

2. src 下的 main.server.ts

```typescript
export { AppServerModule } from './app/app.server.module'; // main.server.ts 服务端渲染入口
```

3. 根目录下的server.ts

server.ts 主要用于服务端渲染执行的js，主要渲染根模块，同时在 package.json 通过 scripts 脚本进行运行

```json
  "scripts": {
    "ng": "ng",
    "start": "ng serve",
    "build": "ng build",
    "watch": "ng build --watch --configuration development",
    "test": "ng test",
    "dev:ssr": "ng run my-app:serve-ssr",
    "serve:ssr": "node dist/my-app/server/main.js",
    "build:ssr": "ng build && ng run my-app:server",
    "prerender": "ng run my-app:prerender"
  },
```

server.ts 生成的代码

```typescript
import 'zone.js/node';

import { APP_BASE_HREF } from '@angular/common';
import { ngExpressEngine } from '@nguniversal/express-engine';
import * as express from 'express';
import { existsSync } from 'node:fs';
import { join } from 'node:path';
import { AppServerModule } from './src/main.server'; // 服务端渲染的根模块

export function app(): express.Express {
  const server = express();
  const distFolder = join(process.cwd(), 'dist/my-app/browser');
  const indexHtml = existsSync(join(distFolder, 'index.original.html'))
    ? 'index.original.html'
    : 'index';

  server.engine(
    'html',
    ngExpressEngine({
      bootstrap: AppServerModule, // 挂载服务端根模块渲染
    })
  );

  server.set('view engine', 'html');
  server.set('views', distFolder);

  server.get(
    '*.*',
    express.static(distFolder, {
      maxAge: '1y',
    })
  );

  server.get('*', (req, res) => {
    res.render(indexHtml, {
      req,
      providers: [{ provide: APP_BASE_HREF, useValue: req.baseUrl }],
    });
  });

  return server;
}

function run(): void {
  const port = process.env['PORT'] || 4000;

  const server = app();
  server.listen(port, () => {
    console.log(`Node Express server listening on http://localhost:${port}`);
  });
}

declare const __non_webpack_require__: NodeRequire;
const mainModule = __non_webpack_require__.main;
const moduleFilename = (mainModule && mainModule.filename) || '';
if (moduleFilename === __filename || moduleFilename.includes('iisnode')) {
  run();
}

export * from './src/main.server';
```

4. tsconfig.server.json

主要为服务端渲染的 typescript 配置


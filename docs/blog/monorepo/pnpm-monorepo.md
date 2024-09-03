---
title: pnpm monorepo
description: pnpm+workspace构建monorepo工程
sidebar_label: pnpm构建monorepo工程
hide_title: true
---


## 一、为何使用pnpm

### 1.1、什么是monorepo？

monorepo其实是一种思想概念，并不是某一种技术。monorepo 就是把多个工程放到一个 git 仓库中进行管理，因此他们可以共享同一套构建流程、代码规范也可以做到统一，特别是如果存在模块间的相互引用的情况，查看代码、修改bug、调试等会更加方便。

### 1.2、什么是pnpm？

pnpm 是新一代的包管理工具，号称是最先进的包管理器。按照官网说法，可以实现节约磁盘空间并提升安装速度和创建非扁平化的 node_modules 文件夹两大目标。

pnpm官网地址：https://www.pnpm.cn/

pnpm 提出了 workspace 的概念，内置了对 monorepo 的支持，那么为什么要用 pnpm 取代之前的 lerna 呢？

这里我总结了以下几点原因：

+ lerna 已经不再维护，后续有任何问题社区无法及时响应
+ pnpm装包效率更高，并且可以节约更多磁盘空间
+ pnpm本身就预置了对monorepo的支持，不需要再额外第三方包的支持

## 二、pnpm构建monorepo流程

### 2.1、安装pnpm

```bash
npm install -g pnpm
```

🔔注意： v7版本的pnpm安装使用需要node版本至少大于v14.19.0，所以在安装之前首先需要检查下node版本。

### 2.2、工程初始化

先在工程根目录下新建 packages 目录，并且在 packages 目录下创建 app 和 pc 和 web 两个工程，分别进到 app 和 pc 和 web 三个目录下，执行 npm init 命令，初始化两个工程，package.json 中的 name 字段分别叫做 app 和 pc 和 web

为了防止根目录被发布出去，需要设置工程根目录下 package.json配置文件的 private 字段为 true。

要想启动 pnpm 的 workspace 功能，需要工程根目录下存在 pnpm-workspace.yaml 配置文件，并且在 pnpm-workspace.yaml 中指定工作空间的目录。比如这里我们所有的子包都是放在 packages 目录下，因此修改 pnpm-workspace.yaml 内容如下：

```yaml
packages:
  - 'packages/*'
```

### 2.2、安装依赖包

 使用 `pnpm` 安装依赖包一般分以下几种情况：

全局的公共依赖包，比如打包涉及到的typescript、rollup、webpack等

  pnpm 提供了 -w, --workspace-root 参数，可以将依赖包安装到工程的根目录下，作为所有  package 的公共依赖， 例如：

  ```bash
  pnpm install react -w
  ```

  如果是一个开发依赖的话，可以加上 -D 参数，表示这是一个开发依赖，会装到 pacakage.json 中的 devDependencies 中，例如：

  ```bash
  pnpm install rollup -w -D
  ```

给某个packages单独安装指定依赖，pnpm 提供了 --filter 参数，可以用来对特定的package进行某些操作

  ```bash
  pnpm add axios --filter app
  ```

模块之间的相互依赖，在app子项目建立lib文件夹，建立一个index.js文件，利用ESM导出 cut、add函数。

  ![1663053004011](https://gitee.com/caigh1012/assets/raw/main/blog/monorepo/pnpm-monorepo/1663053004011.png)

  在pc子项目中依赖app子项目，执行脚本命令如下：

  ```bash
  pnpm install app -r --filter pc
  ```

  ![1663053105162](https://gitee.com/caigh1012/assets/raw/main/blog/monorepo/pnpm-monorepo/1663053105162.png)

  使用：

  ```js
  import {Add, Cut} from 'app'

  console.log(Add(20,63))
  console.log(Cut(42,96))
  ```

  ![1663053422517](https://gitee.com/caigh1012/assets/raw/main/blog/monorepo/pnpm-monorepo/1663053422517.png)

  🔔注意：在设置依赖版本的时候推荐用 workspace:*，这样就可以保持依赖的版本是工作空间里最新版本，不需要每次手动更新依赖版本。

  当 pnpm publish 的时候，会自动将 package.json 中的 workspace 修正为对应的版本号。

### 2.3、执行脚本scripts

```bash
pnpm --filter <package_selector> <command>
```

例如：

```JSON
{
   "scripts": {
    	"log:web": "pnpm --filter web log"
  	},
}
```

如果web子项目没有log脚本

![1663052240593](https://gitee.com/caigh1012/assets/raw/main/blog/monorepo/pnpm-monorepo/1663052240593.png)

### 2.4、只允许pnpm

当在项目中使用 pnpm 时，如果不希望用户使用 yarn 或者 npm 安装依赖，可以将下面的这个 preinstall 脚本添加到工程根目录下的 package.json中：

```JSON
{
  "scripts": {
    "preinstall": "npx only-allow pnpm"
  }
}
```

preinstall 脚本会在 install 之前执行，现在，只要有人运行 npm install 或 yarn install，就会调用 only-allow 去限制只允许使用 pnpm 安装依赖。

---
title: Rust
description: Rust在window10 环境下的安装
sidebar_label: Rust在window10环境下的安装
hide_title: true
---

## Rust 在 window10 环境下的安装

一、Microsoft C++ 生成工具和 rustup-init.exe 方式下载

通过 rustup-init.exe 安装之前需要先安装 Microsoft C++ 生成工具，安装成功后会有一个 vs_BuildTools.exe 执行文件，然后直接运行。

在安装提示中，单个组件安装两个组件，具体如下图：

![image-20240606224634914](https://gitee.com/caigh1012/assets/raw/main/learn/rust/rust-window-install/image-20240606224634914.png)

语言包选择中文和英语

![image-20240606224740608](https://gitee.com/caigh1012/assets/raw/main/learn/rust/rust-window-install/image-20240606224740608.png)

在这里不做安装位置改变，默认安装路径，可以自行设置

点击安装，安装完成之后，运行 rustup-init.exe 文件

![image-20240606225344195](https://gitee.com/caigh1012/assets/raw/main/learn/rust/rust-window-install/image-20240606225344195.png)

选择 1 默认安装，安装完成之后执行以下命令查看是否安装成功

```bash
rustup --version
```

or

```bash
rustc --version
```

二、使用 x86_64-pc-window-msvc.msi 文件进行安装

地址如下：https://forge.rust-lang.org/infra/other-installation-methods.html

![image-20240606231144616](https://gitee.com/caigh1012/assets/raw/main/learn/rust/rust-window-install/image-20240606231144616.png)

下载文件之后，点击执行一直下一步安装即可。该种安装方式是不会带 rustup 工具，只会安装 rustc 和 cargo。

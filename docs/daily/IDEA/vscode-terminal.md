---
title: VSCode
description: VSCode在Windows中的终端权限问题
sidebar_label: VSCode在Windows中的终端权限
hide_title: true
---

## VSCode在Windows中的终端权限问题

在VSCode中使用终端会出现以下错误

![image-20240521203924453](https://gitee.com/caigh1012/assets/raw/main/daily/vscode-terminal/image-20240521203924453.png)

解决方案如下：

![image-20240521204633216](https://gitee.com/caigh1012/assets/raw/main/daily/vscode-terminal/image-20240521204633216.png)

先输入 get-executionpolicy，回显Restricted时。再次输入 set-executionpolicy remotesigned，输入大写 Y 然后enter即可

![image-20240521204736668](https://gitee.com/caigh1012/assets/raw/main/daily/vscode-terminal/image-20240521204736668.png)

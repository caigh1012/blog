---
outline: deep
---

# VSCode在Windows中的终端权限问题

如在VSCode中使用终端会出现：
::: danger Error
  因为在此系统禁止运行脚本
:::

解决方案过程如下：
1. 右键点击左下图标，选择以管理员运行 PowerShell
2. 先输入 get-executionpolicy 按回车键，显示 Restricted
3. 再次输入 set-executionpolicy remotesigned
4. 输入大写 Y 然后回车
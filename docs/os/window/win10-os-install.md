---
title: Window
sidebar_label: W10系统动态分区转化成基本分区
hide_title: true
---

## Window10系统怎么把动态分区转化成基本分区

基本磁盘转换成动态磁盘是一个不可逆的操作，只有重建分区表才能将磁盘变成基本磁盘。这样一来将会清空磁盘全部数据，删除所有分区，连系统也没了，因此在这之后还要重做系统。

那么这个操作可以在安装win10系统时，利用其 diskpart 工具进行处理，具体操作是：

1、安装系统过程中，在为系统选择系统硬盘界面

按 shift+F10 进入 cmd，输入 diskpart，按回车

2、依次输入以下语句（以下语句是创建GPT磁盘分区表，是用UEFI引导的）

list disk（查看磁盘）

select disk 0 (select disk 0是选择要处理磁盘)

clean（清除硬盘全部数据）

convert gpt (重建GPT磁盘分区表)

exit (退出)

如何点击刷新即可
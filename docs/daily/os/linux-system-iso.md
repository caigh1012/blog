---
title: iso
description: Linux的CentOS和ubuntu镜像
sidebar_label: Linux的CentOS和ubuntu镜像
hide_title: true
---

## Linux的CentOS和ubuntu镜像获取

## 一、CentOS镜像获取

[CentOS官方](https://www.centos.org/) 已全面停止维护 CentOS Linux 项目，公告指出 CentOS 7 在2024年6月30日停止技术服务支持，在此之前 2022年1月1日起CentOS官方已经不再对CentOS 8提供服务支持，目前官方支持下载的版本是 CentOS Stream，详情见CentOS官方公告。

如果要下载之前的版本进行使用，可以在官网该地址下载：https://vault.centos.org/，但是在这里我在阿里云镜像安装CentOS

### 1.1、CentOS不同版本概述

DVD ISO：普通光盘完整安装版镜像，可离线安装到计算机硬盘上，包含大量的常用软件，一般选择这种镜像类型即可。
Everything ISO：包含了完整安装版的内容，并对其进行补充，集成了所 有软件。
Minimal ISO：这个版本为精简版的镜像，可以安装一个基本的CentOS系 统，包含了可启动系统基本所需的最小安装包。

### 1.2、阿里云镜像下载CentOS镜像

进入阿里云镜像地址：https://developer.aliyun.com/mirror/，找到CentOS系统镜像，找到需要对应的下载地址，如下图：

![image-20240714191732219](https://gitee.com/caigh1012/assets/raw/main/os/linux-system-iso/image-20240714191732219.png)

这里选择的是过期源地址，然后找到下载地址：https://mirrors.aliyun.com/centos-vault/

![image-20240714191838643](https://gitee.com/caigh1012/assets/raw/main/os/linux-system-iso/image-20240714191838643.png)

然后找自己需要下载的版本和镜像即可

## 二、ubuntu镜像获取

### 2.1、ubuntu不同版本概述

ubuntu镜像文件有 desktop-amd64 和 live-server-amd64，而这两者又存在区别，desktop版本是Ubuntu的桌面版本，它包含了用于日常使用的所有应用程序，如办公套件、图像处理工具、网络浏览器等，适用于日常计算、娱乐、开发或其他需要图形用户界面的任务。而live-server版本则是Ubuntu的服务器版本，它不包含图形用户界面，主要用于设置和管理服务器，例如设置Web服务器；它仅提供了一个命令行界面，允许用户通过终端进行服务器的配置和管理。

### 2.2、阿里云镜像下载ubuntu镜像

获取方式和获取CentOS方案类似，如下图所示：

![image-20240714193057706](https://gitee.com/caigh1012/assets/raw/main/os/linux-system-iso/image-20240714193057706.png)

找到下载地址：https://mirrors.aliyun.com/oldubuntu-releases

![image-20240714193131032](https://gitee.com/caigh1012/assets/raw/main/os/linux-system-iso/image-20240714193131032.png)

进入之后，选择自己需要安装的版本即可

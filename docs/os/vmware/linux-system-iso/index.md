---
outline: deep
---

# Linux的CentOS和Ubuntu镜像获取

## 一、CentOS镜像获取

[CentOS官方](https://www.centos.org/) 已全面停止维护 CentOS Linux 项目，公告指出 CentOS 7 在2024年6月30日停止技术服务支持，在此之前2022年1月1日起 CentOS 官方已经不再对 CentOS 8 提供服务支持，目前官方支持下载的版本是 CentOS Stream，详情见 CentOS 官方公告。

如果要下载之前的版本进行使用，可以在官网该地址下载：https://vault.centos.org/  但是在这里我在阿里云镜像安装 CentOS

### 1.1、CentOS不同版本概述

DVD ISO：普通光盘完整安装版镜像，可离线安装到计算机硬盘上，包含大量的常用软件，一般选择这种镜像类型即可。

Everything ISO：包含了完整安装版的内容，并对其进行补充，集成了所有软件。

Minimal ISO：这个版本为精简版的镜像，可以安装一个基本的 CentOS 系统，包含了可启动系统基本所需的最小安装包。

### 1.2、阿里云镜像下载CentOS镜像

进入 [阿里云镜像地址](https://developer.aliyun.com/mirror)，找到对应的系统镜像点击进入详情。

在详情的相关仓库介绍会有四个地址：过期源、arm源、Stream源、debuginfo源，这里选择的是 [过期源地址](https://mirrors.aliyun.com/centos-vault/) 

然后找自己需要下载的版本和镜像即可

## 二、Ubuntu镜像获取

### 2.1、Ubuntu不同版本概述

Ubuntu 镜像文件有 desktop-amd64 和 live-server-amd64，而这两者又存在区别: 

desktop 版本是 Ubuntu 的桌面版本，它包含了用于日常使用的所有应用程序，如办公套件、图像处理工具、网络浏览器等，适用于日常计算、娱乐、开发或其他需要图形用户界面的任务。

live-server 版本则是 Ubuntu 的服务器版本，它不包含图形用户界面，主要用于设置和管理服务器，例如设置Web服务器；它仅提供了一个命令行界面，允许用户通过终端进行服务器的配置和管理。

### 2.2、阿里云镜像下载Ubuntu镜像

获取方式和获取CentOS方案一样，具体操作流程如上。
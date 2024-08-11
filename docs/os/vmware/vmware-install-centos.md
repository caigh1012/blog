---
title: VMware
description: VMware安装CentOS系统
sidebar_label: VMware安装CentOS系统
hide_title: true
---

## 一、环境准备阶段

> 以安装Linux系统为CentOS7.x版本为例

1. 准备CentOS的ios镜像文件
2. 安装VMware Workstation软件

## 二、安装步骤

1、运行VMware Workstation，选择创建虚拟机

![1672660287884](https://gitee.com/caigh1012/assets/raw/main/os/vmware-install-centos/1672660287884.png)

2、弹出虚拟机导向提示，选择`典型`

![1672660355776](https://gitee.com/caigh1012/assets/raw/main/os/vmware-install-centos/1672660355776.png)

3、弹出安装操作系统提示，选择 `稍后安装操作系统`

![1672660495915](https://gitee.com/caigh1012/assets/raw/main/os/vmware-install-centos/1672660495915.png)

4、选择系统版本，选择如下图

![1672660540923](https://gitee.com/caigh1012/assets/raw/main/os/vmware-install-centos/1672660540923.png)

5、命名虚拟机，选择安装虚拟机位置

![1672660660610](https://gitee.com/caigh1012/assets/raw/main/os/vmware-install-centos/1672660660610.png)

6、指定磁盘容量

![1672660740427](https://gitee.com/caigh1012/assets/raw/main/os/vmware-install-centos/1672660740427.png)

7、配置自定义硬件

![1672660801284](https://gitee.com/caigh1012/assets/raw/main/os/vmware-install-centos/1672660801284.png)

- 这里内存选择2GB
- 配置镜像文件

相关配置如下：

![1672661014904](https://gitee.com/caigh1012/assets/raw/main/os/vmware-install-centos/1672661014904.png)

点击**完成即可**

## 三、开启虚拟机

1、等待安装系统之后，出现以下提示

![1672661210133](https://gitee.com/caigh1012/assets/raw/main/os/vmware-install-centos/1672661210133.png)

2、选择安装配置，开始进行安装

![1672661501513](https://gitee.com/caigh1012/assets/raw/main/os/vmware-install-centos/1672661501513.png)

3、设置初始用户，点击进入设置

![1672661553958](https://gitee.com/caigh1012/assets/raw/main/os/vmware-install-centos/1672661553958.png)

4、设置初始化root密码，自行设置(记住密码，后续需要使用)

![1672661581644](https://gitee.com/caigh1012/assets/raw/main/os/vmware-install-centos/1672661581644.png)

5、设置完成之后会一直进行安装，安装完成之后如下，点击Reboot重启

![1672661811433](https://gitee.com/caigh1012/assets/raw/main/os/vmware-install-centos/1672661811433.png)

6、登录虚拟机

![1672662029676](https://gitee.com/caigh1012/assets/raw/main/os/vmware-install-centos/1672662029676.png)

🔔注意：选择最小安装，系统中不带有 ifconfig 等命令。同时也是没有连接网络的情况下，ping命令无法使用

![1672662342481](https://gitee.com/caigh1012/assets/raw/main/os/vmware-install-centos/1672662342481.png)

## 四、配置虚拟机网络

1、点击VMware Workstation编辑，选择`虚拟网络编辑器`

![1672666092274](https://gitee.com/caigh1012/assets/raw/main/os/vmware-install-centos/1672666092274.png)

2、设置网卡

![1672666182065](https://gitee.com/caigh1012/assets/raw/main/os/vmware-install-centos/1672666182065.png)

3、点击编辑虚拟机设置，修改虚拟机的网络设置

![1672666298266](https://gitee.com/caigh1012/assets/raw/main/os/vmware-install-centos/1672666298266.png)

4、选择网络适配器，选择桥接模式

![1672666399398](https://gitee.com/caigh1012/assets/raw/main/os/vmware-install-centos/1672666399398.png)

5、获取宿主机的DNS、网关等信息

![1672666685628](https://gitee.com/caigh1012/assets/raw/main/os/vmware-install-centos/1672666685628.png)

6、虚拟机设置静态IP，同时虚拟机和宿主机在同一个网段下

登录liunx, 修改文件

```bash
vi /etc/sysconfig/network-scripts/ifcfg-ens33
```

修改内容如下:

![1672667277364](https://gitee.com/caigh1012/assets/raw/main/os/vmware-install-centos/1672667277364.png)

重启网络

```bash
service network restart
```

7、测试网络

虚拟机访问外网

![1672667359592](https://gitee.com/caigh1012/assets/raw/main/os/vmware-install-centos/1672667359592.png)

宿主机访问虚拟机

![1672667416522](https://gitee.com/caigh1012/assets/raw/main/os/vmware-install-centos/1672667416522.png)

8、liunx安装net-tools

```bash
yum install net-tools -y
```

安装完成之后可以使用ifconfig命令查询ip

![1672667604696](https://gitee.com/caigh1012/assets/raw/main/os/vmware-install-centos/1672667604696.png)

## 五、多台虚拟机网络互通

根据上述, 在配置一台`ip:192.168.1.210`为虚拟机

两台虚拟机相互进行ping

1、ip:192.168.1.210 去ping ip:192.168.1.200

![1672668822727](https://gitee.com/caigh1012/assets/raw/main/os/vmware-install-centos/1672668822727.png)

2、ip:192.168.1.200 去ping ip:192.168.1.210

![1672668767530](https://gitee.com/caigh1012/assets/raw/main/os/vmware-install-centos/1672668767530.png)

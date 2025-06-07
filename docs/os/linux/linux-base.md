---
outline: deep
---

# Linux必备基础常识

## 一、常见Linux操作系统简介

Linux 操作系统的发行版本可以大体分为两类 Redhat（商业公司维护的发行版本） 和 Debian （社区组织维护的发行版本）

### 1.1、Redhat系

Redhat，应该称为 Redhat 系列，包括 RHEL(Redhat Enterprise Linux，也就是所谓的Redhat Advance Server，收费版本)、Fedora Core(由原来的 Redhat 桌面版本发展而来，免费版本)、CentOS(RHEL 的社区克隆版本，免费)。

Redhat 应该说是在国内使用人群最多的 Linux 版本，甚至有人将 Redhat 等同于 Linux，而有些老鸟更是只用这一个版本的Linux。所以这个版本的特点就是使用人群数量大，资料非常多，言下之意就是如果你有什么不明白的地方，很容易找到人来问，而且网上的一般 Linux 教程都是以 Redhat 为例来讲解的。

Redhat 系列的包管理方式采用的是基于 `.rpm` 包的 `yum` 包管理方式，包分发方式是编译好的二进制文件。稳定性方面 RHEL 和 CentOS 的稳定性非常好，适合于服务器使用， 但是 Fedora Core 的稳定性较差，最好只用于桌面应用。

### 1.2、Debian系

Debian，或者称 Debian 系列，包括 Debian、Ubuntu、Linux Mint、Chromium OS、Knoppix 等。

Debian 是社区类 Linux 的典范，是迄今为止最遵循GNU规范的 Linux 系统。Debian最早由 Ian Murdock 于1993年创建，分为三个版本分支（branch）： stable, testing 和 unstable。其中，unstable为最新的测试版本，其中包括最新的软件包，但是也有相对较多的bug，适合桌面用户。testing的版本都经过 unstable 中的测试，相对较为稳定，也支持了不少新技术（比如SMP等）。而 stable 一般只用于服务器，上面的软件包大部分都比较过时，但是稳定和安全性都非常的高。

Debian最具特色的是 `apt-get / dpkg` 包管理方式，其实 Redhat 的 yum 也是在模仿 Debian 的APT方式，但在二进制文件发行方式中，APT应该是最好的了。Debian 的资料也很丰富，有很多支持的社区，有问题求教也有地方可去

## 二、tar.gz和tar.xz的区别

在使用 Linux 操作系统时，经常会见到 `tar.gz` 和 `tar.xz` 的安装包，一个字母之差却很难辨别要安装使用那个包。

两者之间的区别如下：

压缩算法导致的压缩效率有差异，tar.xz 压缩的压缩包小一些。 tar.gz 和 tar.xz 都是常见的压缩文件格式，它们的区别在于 压缩算法和压缩率。 tar.gz 使用的是 `gzip` 压缩算法，而 tar.xz 使用的是 `xz` 压缩算法。 一般来说，xz 算法比 gzip 算法更加高效，可以获得更高的压缩率。 因此，tar.xz 压缩后的文件大小通常比 tar.gz 压缩后的文件大小更小。

## 三、Ubuntu的desktop-amd64与live-server-amd64版本差异

Ubuntu 的操作系统镜像主要有两种：desktop-amd64 和 live-server-amd64，这两者的主要区别在于使用场景和安装方式。

1、Desktop-amd64（桌面版）

这是 Ubuntu 的桌面版本，用于安装具有图形用户界面的 Ubuntu 系统。

它包含了用于日常使用的所有应用程序，如办公套件、图像处理工具、网络浏览器等。

当你选择安装 Ubuntu 时，它会首先安装操作系统，然后你可以选择是否要安装桌面环境。如果你选择安装桌面环境，那么你得到的将会是带有图形用户界面的 Ubuntu。

通常，如果你打算使用 Ubuntu 进行日常计算、娱乐、开发或其他需要图形用户界面的任务，你应该选择这个版本。

2、Live-server-amd64（服务器版）

这是 Ubuntu 的服务器版本，不包含图形用户界面。

它主要用于设置和管理服务器，例如设置Web服务器、数据库服务器或FTP服务器等。

当你启动这个版本的 Ubuntu 时，你会直接进入命令行界面，没有图形用户界面。

你可以通过命令行来管理你的服务器。

通常，如果你打算使用 Ubuntu 来运行服务器，而不需要图形用户界面，你应该选择这个版本。例如，对于Web服务器，你可能只需要一个文本编辑器和一个Web浏览器来管理它。 总之，两者的主要区别在于是否包含图形用户界面以及它们的使用场景。如果你需要一个完整的桌面环境来使用 Ubuntu，那么选择 desktop-amd64 版本；如果你需要一个没有图形用户界面的服务器版本，那么选择 live-server-amd64 版本。

## 四、Linux的源代码包和二进制包区别

一般我们在下载 Linux 系统的软件时，会发现网站提供两种形式的软件包下载。一种是源代码包（source code）,另一种是二进制包（binary code）

二进制包里面包括了已经经过编译，可以马上运行的程 序。你只需要下载和解包（安装）它们以后，就马上可以使用。

源代码包里面包括了程序原始的程序代码，需要在你的计算机上进行编译以后才可以产生可以运行程 序,所以从源代码安装的时间会比较长。

二进制格式的包名字很长，都带有版本号、适应平台、适应的硬件类型等，而源码格式仅仅就是一个版本号的tar包。

例如：

mysql-5.0.45.tar.gz 是源码包

mysql-5.0.45-linux-x86_64-glibc23.tar.gz 是二进制包

## 五、Linux下deb包和rpm包区别

deb 和 rpm 是两种不同的软件包管理系统，分别用于 Debian 和 RedHat 等 Linux 发行版。

deb 是 Debian 系统中使用的软件包格式，以 `.deb` 作为扩展名。Debian 系统使用 `dpkg` 命令管理deb包，可以通过 `apt-get` 等工具来安装、卸载和更新软件包。

而 rpm 是 RedHat 系统中使用的软件包格式，以 `.rpm` 作为扩展名。RedHat 系统使用 `rpm` 命令管理 rpm 包，可以通过 `yum` 、 `dnf` 等工具来安装、卸载和更新软件包。

在使用上，deb 和 rpm 的命令和参数有些许不同，但功能基本一致。区别主要在于对依赖关系的处理方式不同，以及软件包的构建、发布等方面也有一些差异。此外，由于两者依赖的 Linux 发行版不同，因此也会导致软件包兼容性的问题。
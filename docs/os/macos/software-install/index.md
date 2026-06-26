---
outline: deep
---

# MacOS 系统软件安装方式

## 一、Mac 安装软件的常见方式

macOS 安装软件的方式和 Linux、Windows 都有一些不同，日常最常见的方式主要有 `App Store`、官网下载安装包、`Homebrew` 包管理器，以及少量需要源码编译的软件。

通常可以这样理解：

1. 普通图形化软件，优先使用 `App Store` 或者官网下载。

2. 开发工具、命令行工具，优先使用 `Homebrew`。

3. 如果官方只提供压缩包、二进制包或者源码包，再考虑手动安装。

## 二、通过 App Store 安装

`App Store` 是 macOS 官方应用商店，适合安装常见的桌面软件，比如办公、效率、笔记、设计类应用。

安装方式比较简单：

1. 打开系统中的 `App Store`。

2. 搜索目标软件。

3. 点击获取或安装，等待系统自动下载完成。

这种方式的优点是安装过程简单、更新方便、软件来源相对安全，缺点是并不是所有软件都会上架到 `App Store`。

## 三、通过官网安装包安装

很多 mac 软件都会在官网提供安装包，常见格式有 `.dmg`、`.pkg` 和 `.zip`。

### 3.1、dmg 安装

`.dmg` 可以理解为 macOS 下常见的磁盘镜像安装包，很多桌面应用都会使用这种方式分发。

常见步骤如下：

1. 从官网下载 `.dmg` 文件。

2. 双击打开 `.dmg` 文件。

3. 将应用图标拖动到 `Applications` 目录。

4. 打开 `启动台` 或 `应用程序`，找到对应软件运行。

如果首次打开提示“应用来自未知开发者”，可以进入：

`系统设置 -> 隐私与安全性`

在对应位置点击仍要打开。

### 3.2、pkg 安装

`.pkg` 更像安装向导，双击之后一路下一步即可，常用于一些驱动、运行时环境、开发工具。

例如安装某些 `JDK`、数据库客户端或者驱动程序时，经常会使用 `.pkg`。

安装完成后，可以在终端中验证是否安装成功，例如：

```bash
java -version
```

### 3.3、zip 压缩包安装

有些软件提供的是 `.zip` 压缩包，解压之后可能直接得到 `.app` 文件，也可能得到一个二进制目录。

如果解压后是 `.app` 文件，通常直接移动到 `Applications` 目录即可；

如果是命令行工具目录，则需要手动放到合适路径，或者加入环境变量。

## 四、通过 Homebrew 安装

`Homebrew` 是 macOS 上最常用的软件包管理器，尤其适合开发者安装命令行工具、运行时环境，以及部分桌面软件。

先检查系统是否已经安装了 `brew`：

```bash
brew -v
```

如果没有安装，可以执行官方安装命令：

```bash
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
```

安装完成后，常见用法如下。

### 4.1、安装命令行工具

例如安装 `git`：

```bash
brew install git
```

检查是否安装成功：

```bash
git --version
```

### 4.2、安装桌面软件

`Homebrew` 除了安装命令行工具，还可以借助 `cask` 安装图形化软件，例如安装 `Google Chrome`：

```bash
brew install --cask google-chrome
```

再例如安装 `Visual Studio Code`：

```bash
brew install --cask visual-studio-code
```

### 4.3、更新和卸载软件

更新 `Homebrew` 软件源：

```bash
brew update
```

升级已经安装的软件：

```bash
brew upgrade
```

卸载命令行工具：

```bash
brew uninstall git
```

卸载图形化软件：

```bash
brew uninstall --cask google-chrome
```

### 4.4、查看安装信息

查看某个软件的信息：

```bash
brew info git
```

查看已经安装的软件列表：

```bash
brew list
```

## 五、通过源码编译安装

有些软件在 macOS 上没有现成安装包，或者需要自定义编译参数，这时可以通过源码编译安装。

源码安装的一般过程如下：

1. 从官网下载源码包或者从 GitHub 拉取源码。

2. 安装编译环境，例如 `gcc`、`make`、`cmake` 等。

3. 执行编译和安装命令。

例如常见的流程可能是：

```bash
./configure
make
sudo make install
```

或者基于 `cmake` 的项目：

```bash
mkdir build
cd build
cmake ..
make
sudo make install
```

这种方式优点是灵活，缺点是步骤较多，且容易遇到依赖问题，所以一般不作为首选安装方式。

## 六、安装软件时的建议

如果只是日常使用，可以优先按照下面的顺序选择：

1. `App Store`：适合普通用户安装常见桌面软件。

2. 官网 `.dmg` 或 `.pkg`：适合安装官方桌面软件和驱动。

3. `Homebrew`：适合开发工具、命令行工具和批量管理软件。

4. 源码编译：适合特殊版本、定制编译或者没有现成安装包的软件。

对于开发环境来说，`Homebrew` 基本是使用频率最高的一种方式。

---
outline: deep
---

# Maven构建工具

## 一、Maven介绍

Maven 是一款为 Java 项目管理构建、依赖管理的工具(软件)，使用 Maven 可以自动化构建、测试、打包和发布项目，大大提高了开发效率和质量。

对应 Maven 的安装详情可以参考：https://blog.caigh.cn/learn/java/maven-window-install/

## 二、Maven配置文件

每一个 Maven 项目都会有一个 pom.xml 配置文件用于管理项目相关配置，相关具体设置可以参考官网说明：https://maven.apache.org/guides/getting-started/maven-in-five-minutes.html

```xml
<?xml version="1.0" encoding="UTF-8"?>

<project xmlns="http://maven.apache.org/POM/4.0.0" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
  xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 http://maven.apache.org/xsd/maven-4.0.0.xsd">
  <modelVersion>4.0.0</modelVersion>

  <!-- 项目的组名 -->
  <groupId>com.example</groupId>
  <!-- 项目的唯一标识符，通常是项目的名称 -->
  <artifactId>maven</artifactId>
  <!-- 项目版本 -->
  <version>1.0.0</version>

  <!-- 打包方式: 通常是jar、war或pom，如果没有指定packaging，默认值是jar -->
  <packaging>jar</packaging>

  <!-- 指定Maven仓库的名称 -->
  <name>maven</name>
  <!-- 项目主页，可选项，提供项目的网址 -->
  <url>http://www.example.com</url>
  
  <!-- parent 和 modules -->
  <!-- modules 标签用于声明当前 Maven 项目包含的模块子项目，每个子项目都是一个独立的 Maven 项目，具有自己的 pom.xml 文件，可以进行独立构建和测试。 -->
  <!-- parent 标签用于声明当前 Maven 项目的父项目，它可以将若干个 Maven 项目组织成一个整体，指定版本号，插件版本号等，便于管理和维护。 -->
  <!--  <parent></parent>-->
  <!--  <modules></modules>-->

  <!-- 用来定义和管理项目中所需要的属性：统一管理项目中的常用属性，比如版本号、路径、插件版本等，方便统一修改和管理 -->
  <properties>
    <project.build.sourceEncoding>UTF-8</project.build.sourceEncoding>
    <maven.compiler.source>1.7</maven.compiler.source>
    <maven.compiler.target>1.7</maven.compiler.target>
    <junit.version>4.13.1</junit.version>
  </properties>

  <!-- 项目依赖 -->
  <dependencies>
    <dependency>
      <groupId>junit</groupId>
      <artifactId>junit</artifactId>
      <!--   引用properties定义的 junit.version  -->
      <version>${junit.version}</version>
      <scope>test</scope>
    </dependency>
  </dependencies>

  <!-- 项目构建插件 -->
  <build>
    <pluginManagement>
      <plugins>
        <plugin>
          <artifactId>maven-clean-plugin</artifactId>
          <version>3.1.0</version>
        </plugin>
        <plugin>
          <artifactId>maven-resources-plugin</artifactId>
          <version>3.0.2</version>
        </plugin>
        <plugin>
          <artifactId>maven-compiler-plugin</artifactId>
          <version>3.8.0</version>
        </plugin>
        <plugin>
          <artifactId>maven-surefire-plugin</artifactId>
          <version>2.22.1</version>
        </plugin>
        <plugin>
          <artifactId>maven-jar-plugin</artifactId>
          <version>3.0.2</version>
        </plugin>
        <plugin>
          <artifactId>maven-install-plugin</artifactId>
          <version>2.5.2</version>
        </plugin>
        <plugin>
          <artifactId>maven-deploy-plugin</artifactId>
          <version>2.8.2</version>
        </plugin>
        <plugin>
          <artifactId>maven-site-plugin</artifactId>
          <version>3.7.1</version>
        </plugin>
        <plugin>
          <artifactId>maven-project-info-reports-plugin</artifactId>
          <version>3.0.0</version>
        </plugin>
      </plugins>
    </pluginManagement>
  </build>
</project>
```

## 三、Maven构建命令

|     mvn命令      | 作用                                                         |
| :--------------: | ------------------------------------------------------------ |
|   mvn compile    | 编译主程序，主程序编译之后的文件会生成在 target/classes 目录中 |
| mvn test-compile | 编译测试程序，测试程序编译之后的文件会生成在 target/test-classes 目录中 |
|     mvn test     | 会执行测试程序中的所有测试用例，并且将生成的测试报告存放在target/surefire-reports目录下。 |
|   mvn package    | 会对程序进行打包，如果是javase工程会打成jar包，而javaweb工程则会打成war包，打包得到的结果会生成在target目录中 |
|   mvn install    | 会将程序打成的包安装到本地仓库(针对jar包，war包安装到本地仓库意义不大) |
|    mvn clean     | 清除项目的编译内容，具体的效果是删除target目录               |

其中：

+ 在执行 mvn test 命令的过程中，会自动先执行 mvn clean、mvn compile、mvn test-compile，然后再执行 mvn test 进行测试

+ 在执行 mvn package 命令的过程中，会自动先执行 mvn clean、mvn compile、mvn test-compile、mvn test，然后再执行 mvn package 进行打包
+ 在执行 mvn install 命令的过程中，会自动先执行 mvn clean、mvn compile、mvn test-compile、mvn test、mvn package，然后再执行 mvn package 进行打包

## 四、Maven依赖

### 4.1、maven依赖坐标

在 maven 项目中，我们只需要通过 jar 包的 maven 坐标去引入 jar 包就可以了，而不需要像之前一样手动导入jar包。如何查找相关依赖 jar 包的 maven 坐标，只有去 [mvnrepository.com](https://mvnrepository.com/) 查找即可

```xml
<?xml version="1.0" encoding="UTF-8"?>

<!-- 项目依赖 -->
<dependencies>
  <dependency>
    <groupId>junit</groupId>
    <artifactId>junit</artifactId>
    <!--   引用properties定义的 junit.version  -->
    <version>${junit.version}</version>
    <scope>test</scope>
  </dependency>
</dependencies>
```

### 4.2、依赖范围

| 依赖范围 | main目录（空间） | test目录（空间） | 编译阶段（时间） | 运行阶段（时间） |
| :------: | ---------------- | ---------------- | ---------------- | ---------------- |
| compile  | 有效             | 有效             | 有效             | 有效             |
|   test   | 无效             | 有效             | 有效             | 无效             |
| provided | 有效             | 有效             | 有效             | 无效             |
| runtime  | 无效             | 无效             | 无效             | 有效             |

compile：该范围的依赖既可以在 main 目录使用，又可以在 test 目录使用，即在编译阶段使用，又在实际运行阶段使用(会打到 war/jar 包中)，通常使用的第三方框架的jar包这样在项目实际运行时真正要用到的jar包都是以 compile 范围进行依赖的。

test: 该范围的依赖只能在 test 目录中使用，不能在 main 目录中使用，只能在编译阶段使用，无法在项目运行阶段使用(不会打到 war/jar 包中)，引入 junit 单元测试依赖的时候会使用该范围

provided: 该范围的依赖即可在 main 目录使用，又可以在 test 目录使用，但是它只能在编译阶段使用，无法在项目运行阶段使用(不会打到 war/jar 包中)。比如说Tomcat服务器中内置有 servlet-api、jsp-api 等依赖，所以我们在项目中引入这些依赖的时候的目标仅仅是让我们的代码编译通过， 为了避免和服务器上已有的同类 jar 包产生冲突，同时减轻服务器的负担我们不会选择将这些依赖打到 war 包中。

runtime: 该范围的依赖既不可在 main 目录使用，又不可在 test 目录使用，说白了就是它无法在编译阶段使用，只能在项目运行阶段使用(会打到 war/jar 包中)，比如说 MySQL 驱动的依赖。

## 五、Maven父子工程

### 5.1、概念

在 Maven 工程之间，B工程（子工程）继承 A工程（父工程），本质上是B工程的 pom.xml 中的配置继承了A工程中 pom.xml 的配置。

### 5.2、作用

在父工程中统一管理项目中的依赖信息，具体来说是管理依赖信息的版本，各个子工程使用依赖的时候版本就统一了

### 5.3、配置

在子工程的pom.xml文件中通过 \<parent\> 标签指定当前子工程的父工程

```xml
<parent>
    <groupId>org.example</groupId>
    <artifactId>maven-parent</artifactId>
    <version>1.0-SNAPSHOT</version>
</parent>
```

同时在总工程的 pom.xml 添加打包方式为 pom

```xml
<groupId>org.example</groupId>
<artifactId>maven-parent</artifactId>
<version>1.0-SNAPSHOT</version>
<packaging>pom</packaging>
```

在总工程指定分工程

```xml
<modules>
    <module>maven-child-01</module>
    <module>maven-child-02</module>
</modules>
```

在总工程统一管理项目所需的所有依赖的版本

```xml
<!--  使用 dependencyManagement 标签配置对依赖的管理, 被管理的依赖并没有真正被引入到工程  -->
<dependencyManagement>
    <dependencies>
        <dependency>
            <groupId>org.mybatis</groupId>
            <artifactId>mybatis</artifactId>
            <version>3.5.16</version>
        </dependency>
    </dependencies>
</dependencyManagement>
```

子项目添加依赖时就无需设置依赖的版本，直接继承父工程依赖的版本即可

```xml
<dependencies>
    <dependency>
        <groupId>org.mybatis</groupId>
        <artifactId>mybatis</artifactId>
    </dependency>
</dependencies>
```

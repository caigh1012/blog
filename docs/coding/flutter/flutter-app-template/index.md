---
outline: deep
---

# Flutter开发Android和IOS实战

## 一、项目创建成功之后项目运行失败

刚创建的新项目在第一次运行过程中会出现 ` Running Gradle task 'assembleDebug'...` 错误，解决方案步骤如下：

```properties
// 在项目目录 android/gradle/gradle-wrapper.properties 位置修改被配置

# 使用本地已经下载好了的 gradle
#distributionUrl=https\://services.gradle.org/distributions/gradle-8.10.2-all.zip
distributionUrl=file:///E:/Android/gradle/gradle-8.9-all.zip
```

如果还是一直卡在 ` Running Gradle task 'assembleDebug'...`，在修改配置的情况下，cd 进入项目的 android 文件夹下，执行以下命令

```bash
./gradlew clean
./gradlew build （可不执行）
```

`./gradlew clean` 执行该命令可以在控制台输出各个插件的加载情况，方便观察具体卡住在哪一个插件下。

## 二、getx 引入使用

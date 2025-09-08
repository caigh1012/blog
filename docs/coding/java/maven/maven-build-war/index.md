---
outline: deep
---

# Maven构建war包

vscode 创建 maven 项目，选择 maven-archetype-webapp 模板，该项目模板会默认构建出来的包为 war 包

```xml
<packaging>war</packaging>
```

在 pom.xml 中 dependencies 标签中添加 servlet 依赖，用于编写 api 接口

```xml
<!-- https://mvnrepository.com/artifact/javax.servlet/javax.servlet-api -->
<dependency>
    <groupId>javax.servlet</groupId>
    <artifactId>javax.servlet-api</artifactId>
    <version>4.0.1</version>
    <scope>provided</scope>
</dependency>
```

在 App.java 编写接口

```java
package com.example;

import java.io.IOException;
import java.io.PrintWriter;

import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

@WebServlet("/example")
public class App extends HttpServlet {
  protected void doGet(HttpServletRequest req, HttpServletResponse res) throws ServletException, IOException {
    PrintWriter writer = res.getWriter();
    writer.print("Hello Servlet API");
    writer.flush();
    writer.close();
  }
}
```

然后需要在修改 web.xml

```xml
<!DOCTYPE web-app PUBLIC
 "-//Sun Microsystems, Inc.//DTD Web Application 2.3//EN"
 "http://java.sun.com/dtd/web-app_2_3.dtd" >

<web-app>
  <display-name>Archetype Created Web Application</display-name>
</web-app>
```

然后进行编译构建，在 tomcat 部署 war 包，测试 /example 接口路径是否有效
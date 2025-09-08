# SSM的XML方式搭建

安装相关 maven 依赖

```xml
<dependencies>
    <!-- https://mvnrepository.com/artifact/org.springframework/spring-context -->
    <dependency>
        <groupId>org.springframework</groupId>
        <artifactId>spring-context</artifactId>
        <version>6.1.14</version>
    </dependency>

    <!-- https://mvnrepository.com/artifact/org.springframework/spring-webmvc -->
    <dependency>
        <groupId>org.springframework</groupId>
        <artifactId>spring-webmvc</artifactId>
        <version>6.2.1</version>
    </dependency>

    <!-- https://mvnrepository.com/artifact/org.springframework/spring-jdbc -->
    <dependency>
        <groupId>org.springframework</groupId>
        <artifactId>spring-jdbc</artifactId>
        <version>6.1.14</version>
    </dependency>

    <!-- https://mvnrepository.com/artifact/org.springframework/spring-test -->
    <dependency>
        <groupId>org.springframework</groupId>
        <artifactId>spring-test</artifactId>
        <version>6.1.14</version>
        <scope>test</scope>
    </dependency>

    <!-- https://mvnrepository.com/artifact/org.mybatis/mybatis-spring -->
    <dependency>
        <groupId>org.mybatis</groupId>
        <artifactId>mybatis-spring</artifactId>
        <version>3.0.4</version>
    </dependency>

    <!-- https://mvnrepository.com/artifact/org.mybatis/mybatis -->
    <dependency>
        <groupId>org.mybatis</groupId>
        <artifactId>mybatis</artifactId>
        <version>3.5.16</version>
    </dependency>

    <!-- https://mvnrepository.com/artifact/mysql/mysql-connector-java -->
    <dependency>
        <groupId>mysql</groupId>
        <artifactId>mysql-connector-java</artifactId>
        <version>8.0.33</version>
    </dependency>

    <!-- https://mvnrepository.com/artifact/com.alibaba/druid -->
    <dependency>
        <groupId>com.alibaba</groupId>
        <artifactId>druid</artifactId>
        <version>1.2.24</version>
    </dependency>

    <dependency>
        <groupId>com.fasterxml.jackson.core</groupId>
        <artifactId>jackson-databind</artifactId>
        <version>2.18.0</version>
    </dependency>

    <!-- https://mvnrepository.com/artifact/junit/junit -->
    <dependency>
        <groupId>junit</groupId>
        <artifactId>junit</artifactId>
        <version>4.13.1</version>
        <scope>test</scope>
    </dependency>
</dependencies>
```

在 main/WEB-INF/web.xml 文件中配置

```xml
<!DOCTYPE web-app PUBLIC
        "-//Sun Microsystems, Inc.//DTD Web Application 2.3//EN"
        "http://java.sun.com/dtd/web-app_2_3.dtd" >

<web-app>
    <display-name>Archetype Created Web Application</display-name>
    <!-- Spring 配置 ****** 父容器 -->
    <listener>
        <listener-class>org.springframework.web.context.ContextLoaderListener</listener-class>
    </listener>

    <context-param>
        <param-name>contextConfigLocation</param-name>
        <!-- 配置文件地址 -->
        <param-value>classpath:spring-context.xml</param-value>
    </context-param>

    <!--  Spring MVC 配置 ****** 子容器 -->
    <servlet>
        <servlet-name>springmvc</servlet-name>
        <servlet-class>org.springframework.web.servlet.DispatcherServlet</servlet-class>
        <init-param>
            <!--   参数名称必须叫做  contextConfigLocation 。 单词和大小写错误都导致配置文件无法正确运行  -->
            <param-name>contextConfigLocation</param-name>
            <!--   springmvc.xml 名称自定义，只要和我们创建的配置文件名称对应就可以了   -->
            <param-value>classpath:spring-mvc.xml</param-value>
        </init-param>
        <load-on-startup>1</load-on-startup>
    </servlet>
    <servlet-mapping>
        <servlet-name>springmvc</servlet-name>
        <!--  /表示除了.jsp以外的请求都可以访问 DispatcherServlet，但是.jsp的请求不可以访问 -->
        <!--  /表示除了.jsp结尾的url，其他的url都会触发 DispatcherServlet，都会被拦截  -->
        <url-pattern>/</url-pattern>
    </servlet-mapping>
</web-app>
```

其中配置让其加载 spring-context.xml 和 spring-mvc.xml 相关配置，文件需要存放在 main\resources 目录中。

spring-context.xml 配置如下

```xml
<?xml version="1.0" encoding="UTF-8"?>
<beans xmlns="http://www.springframework.org/schema/beans"
       xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
       xmlns:context="http://www.springframework.org/schema/context"
       xmlns:tx="http://www.springframework.org/schema/tx"
       xsi:schemaLocation="http://www.springframework.org/schema/beans
		https://www.springframework.org/schema/beans/spring-beans.xsd
		http://www.springframework.org/schema/context
		https://www.springframework.org/schema/context/spring-context.xsd
		http://www.springframework.org/schema/tx
		https://www.springframework.org/schema/tx/spring-tx.xsd
		">
    <!--  加载db.properties配置文件	-->
    <context:property-placeholder location="classpath:db.properties"></context:property-placeholder>

    <!--  整合Druid数据源连接池  -->
    <bean id="dataSource" class="com.alibaba.druid.pool.DruidDataSource">
        <property name="driverClassName" value="${jdbc.driver}"></property>
        <property name="url" value="${jdbc.url}"></property>
        <property name="username" value="${jdbc.username}"></property>
        <property name="password" value="${jdbc.password}"></property>
        <!--  连接池的属性配置  -->
        <!--  连接池中最大连接数  -->
        <property name="maxActive" value="100"></property>
        <!--  连接池初始化时创建的连接数  -->
        <property name="initialSize" value="10"></property>
        <!--  连接池中最小空闲连接数  -->
        <property name="minIdle" value="5"></property>
        <!--  连接池中最大空闲连接数  -->
        <property name="maxIdle" value="10"></property>
        <!--  获取连接时的最大等待时间（毫秒）-->
        <property name="maxWait" value="60000"></property>
        <!--  是否缓存 poolPreparedStatements 建议时关闭  -->
        <property name="poolPreparedStatements" value="false"></property>
    </bean>
        <!--  配置 SqlSessionFactory 对象 -->
    <bean id="sqlSessionFactory" class="org.mybatis.spring.SqlSessionFactoryBean">
        <!--  工厂依赖数据源, 所以需要注入数据对应的对应  -->
        <property name="dataSource" ref="dataSource"/>
        <property name="typeAliasesPackage" value="com.example.domain"/>
    </bean>

    <!--  扫描 Dao  -->
    <bean class="org.mybatis.spring.mapper.MapperScannerConfigurer">
        <!--  注入工厂对象  -->
        <property name="sqlSessionFactoryBeanName" value="sqlSessionFactory"/>
        <!--  扫描的文件  -->
        <property name="basePackage" value="com.example.dao"/>
    </bean>

    <!--  配置事务  -->
    <bean id="transactionManager" class="org.springframework.jdbc.datasource.DataSourceTransactionManager">
        <property name="dataSource" ref="dataSource"/>
    </bean>

    <!--  配置事务注解  -->
    <tx:annotation-driven transaction-manager="transactionManager"/>
    
    <context:component-scan base-package="com.example">
        <!--  排除掉 controller 的 bean  -->
        <context:exclude-filter type="annotation" expression="com.example.controller"/>
    </context:component-scan>

</beans>
```

spring-mvc.xml 配置如下

```xml
<?xml version="1.0" encoding="UTF-8"?>
<beans xmlns="http://www.springframework.org/schema/beans"
       xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
       xmlns:context="http://www.springframework.org/schema/context"
       xmlns:mvc="http://www.springframework.org/schema/mvc"
       xsi:schemaLocation="http://www.springframework.org/schema/beans
		https://www.springframework.org/schema/beans/spring-beans.xsd
        http://www.springframework.org/schema/context
         http://www.springframework.org/schema/context/spring-context.xsd
           http://www.springframework.org/schema/mvc
         http://www.springframework.org/schema/mvc/spring-mvc.xsd
">
    <!--  只创建 controller 的 bean  -->
    <context:component-scan base-package="com.example.controller"></context:component-scan>
    <!--  开启SpringMvc 的注解支持  -->
    <mvc:annotation-driven></mvc:annotation-driven>

</beans>
```


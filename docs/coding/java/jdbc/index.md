---
outline: deep
---

# JDBC连接数据库

```java
package com.example.base;

import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.ResultSet;
import java.sql.Statement;

public class App {
    public static void main(String[] args) throws Exception {
        // 1.注册驱动
        Class.forName("com.mysql.cj.jdbc.Driver");

        // 2.获取连接对象
        // jdbc:mysql 为固定写法
        String url = "jdbc:mysql://localhost:3306/employ_db";
        String username = "root";
        String password = "root123";

        // 数据库连接
        Connection connection = DriverManager.getConnection(url, username, password);

        // 3.获取执行SQL语句的对象
        Statement statement = connection.createStatement();

        // 4.编写SQL语句，并执行，并返回结果集
        String sql = "SELECT * FROM t_emp";
        ResultSet resultSet = statement.executeQuery(sql);

        // resultSet 结果可以是一个或多个结果
        // 增删改：受影响行数单个结果
        // 查询：单行单列，多行多列，单行多列等结果

        while (resultSet.next()) {
            int empId = resultSet.getInt("emp_id");
            String empName = resultSet.getString("emp_name");
            Double empSalary = resultSet.getDouble("emp_salary");
            int empAge = resultSet.getInt("emp_age");
            System.out.println(empId + "\t" + empName + "\t" + empSalary + "\t" + empAge);
        }

        // 关闭原则：先是 resultSet、再是statement、最后是connection
        resultSet.close();
        statement.close();
        connection.close();

    }
}

```

指定SQL参数查询

```java
package com.example.base;

import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.ResultSet;
import java.sql.Statement;
import java.util.Scanner;

public class JDBCInjection {
  public static void main(String[] args) throws Exception {
    // 1.注册驱动
    Class.forName("com.mysql.cj.jdbc.Driver");

    // 2.获取连接对象
    // jdbc:mysql 为固定写法
    String url = "jdbc:mysql://localhost:3306/employ_db";
    String username = "root";
    String password = "root123";

    // 数据库连接
    Connection connection = DriverManager.getConnection(url, username, password);

    // 3.获取执行SQL语句的对象
    Statement statement = connection.createStatement();

    System.out.println("请输入员工姓名"); // 当输入 adb' or '1'='1 时嵌入sql语句也会触发 sql 查询
    Scanner scanner = new Scanner(System.in);
    String name = scanner.nextLine();

    String sql = "SELECT * FROM t_emp WHERE emp_name='" + name + "'";

    ResultSet resultSet = statement.executeQuery(sql);
    while (resultSet.next()) {
      int empId = resultSet.getInt("emp_id");
      String empName = resultSet.getString("emp_name");
      Double empSalary = resultSet.getDouble("emp_salary");
      int empAge = resultSet.getInt("emp_age");
      System.out.println(empId + "\t" + empName + "\t" + empSalary + "\t" + empAge);
    }

    // 关闭原则：先是 resultSet、再是statement、最后是connection
    resultSet.close();
    statement.close();
    connection.close();
  }
}
```

像上述的 `'" + name + "'"` 会带人 sql 注入安全风险，所以这里用 PreparedStatement 替代 statement 

```java
package com.example.base;

import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.util.Scanner;

public class JDBCPrepared {
  public static void main(String[] args) throws Exception {
    // 1.注册驱动
    Class.forName("com.mysql.cj.jdbc.Driver");

    // 2.获取连接对象
    // jdbc:mysql 为固定写法
    String url = "jdbc:mysql://localhost:3306/employ_db";
    String username = "root";
    String password = "root123";

    // 3.数据库连接
    Connection connection = DriverManager.getConnection(url, username, password);

    // 预编译SQL 传入的 name 使用 ? 替代
    // PreparedStatement 比 statement 更安全，效率更高
    PreparedStatement preparedStatement = connection.prepareStatement("SELECT * FROM t_emp WHERE emp_name= ? ");

    System.out.println("请输入员工姓名"); // 当输入 adb' or '1'='1 时嵌入sql语句也会触发 sql 查询
    Scanner scanner = new Scanner(System.in);
    String name = scanner.nextLine();

    preparedStatement.setString(0, name);
    ResultSet resultSet = preparedStatement.executeQuery();

    while (resultSet.next()) {
      int empId = resultSet.getInt("emp_id");
      String empName = resultSet.getString("emp_name");
      Double empSalary = resultSet.getDouble("emp_salary");
      int empAge = resultSet.getInt("emp_age");
      System.out.println(empId + "\t" + empName + "\t" + empSalary + "\t" + empAge);
    }

    // 关闭原则：先是 resultSet、再是statement、最后是connection
    resultSet.close();
    preparedStatement.close();
    connection.close();
  }
}
```


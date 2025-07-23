---
outline: deep
---

## 一、调整原因

之前的设计，每次构建时都会执行docker.sh脚本，首先会停止上一个版本容器，并且删除之前运行的容器。然后就会根据当前生成的build资源和Dockerfile文件制作新的镜像，运行新的镜像。

带来的不足之处：

1. 每一次发版都需要删除之前镜像，以及制作新的镜像运行，导致构建时间过长。
2. 每次运行新的镜像，Nginx的热更新作用失效，运行新镜像后访问网址会变慢。

## 二、改进方案

云服务器 `/home` 下有以下目录：

![20231224214248378](./images/20231224214248378.png)

在docker_jenkins目录下存在docker-compose.yml文件用于运行 jenkins 镜像，我将镜像内 jenkins 构建打包后 build 目录资源文件复制到 /home/html 目录下，以下是执行 docker.sh 配置

```shell
echo "copy project files to /home/html"
echo "------ copy start ----------"
cp -r ./dist/* /home/html/
echo "------ copy end ------------"
```

然而 jenkins 容器内的 /home/html 目录映射到了服务器的 /home/docker_nginx/html 目录下，docker-compose.yml 配置如下

```yaml
version: '3'
services:
  docker_jenkins:
    image: jenkins/jenkins:lts-jdk11
    restart: always
    container_name: docker_jenkins
    ports:
      - 9527:8080
      - 50000:50000
    volumes:
      - ./jenkins_home:/var/jenkins_home
      - /home/docker_nginx/html:/home/html // 构建后的资源映射
      - /var/run/docker.sock:/var/run/docker.sock
      - /usr/bin/docker:/usr/bin/docker
      - /etc/docker/daemon.json:/etc/docker/daemon.json
```

然后在 nginx 容器的 docker-compose.yml 中配置

```yaml
version: '3'
services:
  docker_jenkins:
    image: nginx:latest
    restart: always
    container_name: docker_nginx
    ports:
      - 80:80
      - 443:443
    volumes:
      - /home/ssl:/home/ssl
      - ./html:/usr/share/nginx/html
      - ./nginx.conf:/etc/nginx/nginx.conf
```

主要将 jenkins 容器构建的资源文件通过 docker 数据卷原理映射到本机(服务器) /home/docker_nginx/html 目录下，然后在将 /home/docker_nginx/html 目录和 Nginx 的 /usr/share/nginx/html 目录进行关联映射，这样每次构建会自动使用最新的资源文件。

## 三、不足

如果需要每一次的构建形成版本留存，可以通过docker构建镜像但是不运行镜像，只做留档保存版本

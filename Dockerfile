FROM daocloud.io/library/ubuntu
MAINTAINER xialeistudio<xialeistudio@gmail.com>
ENV HOST 0.0.0.0
ENV PATH $PATH:/opt/node/bin
# prepare
ADD sources.list /etc/apt/sources.list
RUN apt update
RUN apt install wget gcc python git -y
# nodejs
RUN wget https://npm.taobao.org/mirrors/node/latest-v8.x/node-v8.6.0-linux-x64.tar.gz
RUN tar xf node-v8.6.0-linux-x64.tar.gz
RUN mv node-v8.6.0-linux-x64 /opt/node
# app
RUN mkdir app
ADD . /root/app
WORKDIR /root/app
RUN /opt/node/bin/npm install --registry=https://registry.npm.taobao.org
EXPOSE 8080
# start app
ENTRYPOINT ["npm","start"]
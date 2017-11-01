FROM node:8
WORKDIR /usr/src/app
ADD . /home/app
RUN npm install --registry=https://registry.npm.taobao.org
USER node
EXPOSE 80
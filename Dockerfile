FROM node:8
WORKDIR /usr/src/app
ADD . /usr/src/app
RUN npm install --registry=https://registry.npm.taobao.org
USER node
EXPOSE 8080
CMD ["npm","start"]

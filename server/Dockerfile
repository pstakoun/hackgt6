FROM node:12

WORKDIR /usr/src/server

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 80
CMD [ "npm", "run", "start" ]

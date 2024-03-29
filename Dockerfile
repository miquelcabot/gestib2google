FROM node:12.13.0

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install

EXPOSE 8080

CMD ["npm", "run", "dev"]
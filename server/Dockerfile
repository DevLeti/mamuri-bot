FROM node:17.9.0-alpine

WORKDIR /src
COPY . /src

RUN npm install

EXPOSE 8080
CMD ["node", "app.js"]
FROM node:22

WORKDIR /usr/src/app

COPY package*.json ./
RUN npm install

COPY . .

EXPOSE 8080
ENV NODE_ENV=production

CMD ["node", "server.js"]

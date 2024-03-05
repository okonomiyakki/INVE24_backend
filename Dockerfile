FROM node:18
RUN mkdir -p /var/app
WORKDIR /var/app
COPY . .
RUN npm install && npm install -g pm2
RUN npm run build
EXPOSE 5500

CMD [ "npm", "run", "start:prod"]
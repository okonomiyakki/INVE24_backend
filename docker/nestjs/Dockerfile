FROM node:18-alpine

RUN mkdir -p /var/app

WORKDIR /var/app

# COPY </inve24_backend/ 하위 복사> <도커 이미지 /var/app 에다가 붙여넣기>
COPY . .

RUN npm install && npm install -g pm2

RUN npm run build

EXPOSE 5500

CMD [ "npm", "run", "start:prod"]
FROM node:14-bullseye

WORKDIR /app

COPY package*.json ./

RUN npm ci

COPY . .

EXPOSE 3000

CMD ["npx", "serverless", "offline", "--host", "0.0.0.0"]
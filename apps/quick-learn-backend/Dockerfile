FROM node:alpine AS builder

WORKDIR /usr/src/app
COPY package*.json ./

RUN apk add --update python3 make g++ && rm -rf /var/cache/apk/*

RUN npm install --only=development --silent

COPY . .
RUN npx nx build quick-learn-backend --prod

FROM node:alpine
WORKDIR /usr/src/app

COPY package*.json ./
RUN apk add --update python3 make g++ && rm -rf /var/cache/apk/*

RUN npm install -g pm2@latest
RUN npm install --only=production --silent
RUN npm install express
COPY --from=builder /usr/src/app/dist/apps/api ./build
ENTRYPOINT ["pm2-runtime","build/main.js"]

#### HOW FIRST LOCAL START
- Download Postgres
- download pgAdmin4
- git clone https://gitlab.d.secwhapi.net/whoer/whox-blog-backend.git
- yarn install
- npx prisma (для просмотра команд)
- npx prisma init
- npx prisma generate
- yarn start:dev 

#### Dockerfile
- FROM node:latest
- WORKDIR /app
- COPY package*.json ./
- RUN npm install
- COPY . .
- RUN npx prisma generate
- ENV NODE_ENV=production
- RUN npm run build
- EXPOSE 3002
- CMD [ "npm", "run", "start:prod" ]

#### docker-compose.yml
- version: "3"
- services:
- backend:
- build:
- context: .
- dockerfile: Dockerfile
- ports:
- - 3002:3002
- volumes:
- - .:/app

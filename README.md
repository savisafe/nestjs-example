#### Project Description
This EXAMPLE project is a full-stack application built with NestJS, Prisma, and PostgreSQL for managing a backend service. It
uses Prisma as an ORM for handling database operations and is designed for efficient development and deployment in both
local and Dockerized environments.

#### HOW FIRST START

- git clone
- Download Postgres (for local db)
- download pgAdmin4 (for view status db)
- yarn install
- npx prisma (for view command)
- npx prisma init
- npx prisma generate
- yarn start:dev
- local response by - http://localhost:3002/api/

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
-
    - 3002:3002
- volumes:
-
    - .:/app

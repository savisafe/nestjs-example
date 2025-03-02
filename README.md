#### Description
This is a demonstration project built with NestJS, showcasing how to develop a backend application using Prisma for
database management with PostgreSQL. It serves as an example of creating a scalable and maintainable API for managing
blog content, including articles and users.

#### HOW FIRST START

- git clone <URL>
- Download and install Postgres (for setting up a local database).
- Download pgAdmin4 (for monitoring the database status).
- yarn install
- npx prisma ()
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
- 3002:3002
- volumes:
- .:/app

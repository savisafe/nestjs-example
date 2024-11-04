+Postgres
+pgAdmin4
+Обязательно добавить .env
1.yarn
2.npx prisma init
3.npx prisma 
4.npx prisma generate
5.yarn start:dev 
Посмотреть как работает npx prisma
# Для обычного пользователя:
Получить все статьи
GET: /api/articles
Result:
[
{
"id": "ac220632-3964-4e3e-ac81-0be5c0cdcc7a",
"title": «test»,
"description": «test»,
"date": "2024-11-01T11:54:10.718Z",
"author": "author_1»,
"category": "test_1»
},
…
]

Получить статью по категории
GET: /api/articles/:category
Result:
[
{
"id": "ac220632-3964-4e3e-ac81-0be5c0cdcc7a",
"title": «test»,
"description": «test»,
"date": "2024-11-01T11:54:10.718Z",
"author": "author_1»,
"category": "test_1»
},
…
]

Получить статью по id
GET: /api/articles/:id
Result:
{
"id": "ac220632-3964-4e3e-ac81-0be5c0cdcc7a",
"title": «test»,
"description": «test»,
"date": "2024-11-01T11:54:10.718Z",
"author": "author_1»,
"category": "test_1»
}
# Для администратора:
Получить все статьи
GET: /api/articles/admin
Result:
[
{
"id": "c9b8d218-c253-4f97-b4c7-62b2ddc024b3",
"title": "test",
"description": "test",
"date": "2024-11-01T11:54:03.441Z",
"author": "author_2",
"category": "test_2",
"draft": true,
"userId": "c0d9dad1-ed4e-4bca-af46-ea19ba22b9fb"
},
…
]
Редактировать статью (title, description, author, category, draft вводить не обязательно, достаточно одного)
PUT: /api/articles/admin
BODY: {
"id": "ac220632-3964-4e3e-ac81-0be5c0cdcc7a",
"title": "ac220632-3964-4e3e-ac81-0be5c0cdcc7a",
"description": "test",
"author": "author_2",
"category": "test_2",
"draft": true/false,
}
Выложить статью (вначале отправяется в черновик, потом с помощью запросы PUT можно выложить обычным пользователям)
POST: /api/articles/admin
BODY: {
"title": "text",
"description": "text",
"author": "author_2",
"category": "test_2"
}
Удаление статьи
DELETE: /api/articles/admin
BODY: {
"id": "ac220632-3964-4e3e-ac81-0be5c0cdcc7a",
}
# Вход администратора и выход администратора
POST: /api/admin/login
BODY: {
"login": "test123",
"password": "test123"
}
GET: /api/admin/exit -> с проверкой TOKEN администратора


ТАБЛИЦЫ БАЗЫ ДАННЫХ

Admin {
id             String    
login          String
password       String
name           String
admin_articles связан с таблицей Article
}
Article {
id          String
title       String
description String
date        DateTime
author      Author
category    Category
draft       Boolean
admin_id    связан с админом, который написал статью и таблицей Admin    
}


Какие бывают категории: ['test_1', 'test_2', 'test_3']
Какие бывают авторы статьи: ['author_1', 'author_2', 'author_3']
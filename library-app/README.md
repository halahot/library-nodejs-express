# library-nodejs-express

Тестовый проект библиотека по курсу NodeJs

## Вставка двух объектов в коллекцию books

db.books.insertMany([
{
title: "Node.js в действии",
description: "Практическое руководство по созданию серверных приложений.",
authors: "Майк Кантелон"
},
{
title: "Изучаем MongoDB",
description: "Введение в документно-ориентированные базы данных.",
authors: "Кайл Бэнкер"
}
])

## Поиск документов по полю title

db.books.find({ title: "Node.js в действии" })

## Поиск по подстроке

db.books.find({ title: { $regex: "mongo", $options: "i" } })

## Запрос для редактирования полей: description и authors коллекции books по \_id записи

db.books.updateOne(
{ \_id: ObjectId("1") },
{
$set: {
description: "Обновлённое описание",
authors: "Обновлённый автор"
}
}
)

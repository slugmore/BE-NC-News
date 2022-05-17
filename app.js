const express = require('express');
const getArticleById = require('./controllers/articles.controllers');
const app = express()
const getTopics = require('./controllers/topics.controllers')

app.get("/api/topics", getTopics);

app.get("/api/articles/:article_id", getArticleById)

app.all("/*", (req, res) => {
    res.status(404).send({ msg: "Route not found" });
});

app.use((err, req, res, next) => {
    if (err.code === '22P02') {
        res.status(400).send({msg : "Bad Request"})
    } else next(err)
})

app.use((err, req, res, next) => {
    if (err.status) {
        res.status(err.status).send({msg: err.msg})
    }
})

app.use((err, req, res, next) => {
    res.status(500).send({msg: "Internal Server Error!"})
})

module.exports = app;
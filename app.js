const express = require('express');
const {getArticleById, patchVotes, getArticles} = require('./controllers/articles.controllers');
const getTopics = require('./controllers/topics.controllers')
const getUsers = require('./controllers/users.controllers')
const app = express()

app.use(express.json())

app.get("/api/topics", getTopics);

app.get("/api/articles", getArticles)

app.get("/api/articles/:article_id", getArticleById)

app.get("/api/users", getUsers)

app.patch("/api/articles/:article_id", patchVotes)




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
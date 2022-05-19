const {fetchArticleById, updateVotes, fetchArticles} = require('../models/articles.models')

getArticleById = (req, res, next) => {
    const { article_id } = req.params
    fetchArticleById(article_id).then((article) => {
        res.status(200).send({article})
    })
    .catch((err) => {
        next(err)
    })
}

patchVotes = (req, res, next) => {
    const votes = req.body
    const { article_id } = req.params
    updateVotes(votes, article_id).then((article) => {
        res.status(200).send({article})
    })
    .catch((err) => {
        next(err)
    })
}

getArticles = (req, res, next) => {
    fetchArticles().then((articles) => {
        res.status(200).send({articles})
    })
    .catch((err) => {
        next(err)
    })
}



module.exports = {getArticleById, patchVotes, getArticles}
const {fetchArticleById, updateVotes, fetchArticles, fetchCommentsById, insertComment, checkArticleIdExists, checkUserExists} = require('../models/articles.models')

getArticleById = (req, res, next) => {
    const { article_id } = req.params
    fetchArticleById(article_id).then((article) => {
        res.status(200).send({article})
    })
    .catch((err) => {
        next(err)
    })
}

getCommentsById = (req, res, next) => {
    const { article_id } = req.params
    fetchCommentsById(article_id).then((comments) => {
        res.status(200).send({comments})
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

addComment = (req, res, next) => {
    const ID = req.params.article_id
    const comment = req.body
    const username = req.body.username
    Promise.all([checkArticleIdExists(ID), checkUserExists(username), insertComment(comment, ID)])
    .then(([, , comment]) => {
        res.status(201).send(comment)
    })
    .catch((err) => {
        console.log(err);
        next(err)
    })
}



module.exports = {getArticleById, patchVotes, getArticles, getCommentsById, addComment}
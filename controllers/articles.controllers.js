const { fetchArticleById, updateVotes, fetchArticles, fetchCommentsById, insertComment, checkArticleIdExists, checkUserExists, fetchArticlesByTopic } = require('../models/articles.models')

const getArticleById = (req, res, next) => {
    const { article_id } = req.params
    fetchArticleById(article_id).then((article) => {
        res.status(200).send({article})
    })
    .catch((err) => {
        next(err)
    })
}

const getCommentsById = (req, res, next) => {
    const { article_id } = req.params
    fetchCommentsById(article_id).then((comments) => {
        res.status(200).send({comments})
    })
    .catch((err) => {
        next(err)
    })
}

const patchVotes = (req, res, next) => {
    const votes = req.body
    const { article_id } = req.params
    updateVotes(votes, article_id).then((article) => {
        res.status(200).send({article})
    })
    .catch((err) => {
        next(err)
    })
}

const getArticles = (req, res, next) => {
    const sortByQuery = req.query.sort_by;
    const sortOrder = req.query.order;
    const topic = req.query.topic
    fetchArticles(sortByQuery, sortOrder, topic).then((articles) => {
        res.status(200).send({articles})
    })
    .catch((err) => {
        next(err)
    })
}

const addComment = (req, res, next) => {
    const ID = req.params.article_id
    const comment = req.body
    const username = req.body.username
    Promise.all([checkArticleIdExists(ID), checkUserExists(username), insertComment(comment, ID)])
    .then(([, , comment]) => {
        res.status(201).send(comment)
    })
    .catch((err) => {
        next(err)
    })
}



module.exports = {getArticleById, patchVotes, getArticles, getCommentsById, addComment}
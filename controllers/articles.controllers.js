const fetchArticleById = require('../models/articles.models')

getArticleById = (req, res) => {
    const { article_id } = req.params
    fetchArticleById(article_id).then((article) => {
        res.status(200).send({article: article})
    })
    .catch((err) => {
        console.log(err);
    })
}

module.exports = getArticleById;
const db = require("../db/connection")

fetchArticleById = (article_id) => {
    return db

    .query(`
    SELECT articles.*, COUNT(comments.article_id)::int AS comment_count
    FROM articles
    LEFT JOIN comments ON comments.article_id = articles.article_id
    WHERE articles.article_id = $1
    GROUP BY articles.article_id
    `, [article_id])

    .then(( result ) => {
        if (!result.rows.length) {
            return Promise.reject({status: 404, msg: 'Route not found'})
        }
        return result.rows[0]
    })
}

fetchCommentsById = (article_id) => {
    return db

    .query(`SELECT * FROM comments WHERE article_id = $1`, [article_id])
    .then((result) => {
        return result.rows
    })
}

updateVotes = (votes, article_id) => {

   const newVote = votes.inc_votes
   if (newVote === undefined) {
       return Promise.reject({status: 400, msg: 'Bad Request'})
   } 
   return db
   .query(`UPDATE articles SET votes = votes + $1 WHERE article_id = $2 RETURNING *;`, [newVote, article_id])
   .then(( result ) => {
    if (!result.rows.length) {
        return Promise.reject({status: 404, msg: 'Route not found'})
    }
       return result.rows[0]
   })
}

fetchArticles = () => {
    return db

    .query(`
    SELECT articles.*, COUNT(comments.article_id)::int AS comment_count
    FROM articles
    LEFT JOIN comments ON comments.article_id = articles.article_id
    GROUP BY articles.article_id
    `)
    
    .then((result) => {
        return result.rows
    })
}

module.exports = {fetchArticleById, updateVotes, fetchArticles, fetchCommentsById};
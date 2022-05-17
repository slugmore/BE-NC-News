const db = require("../db/connection")

fetchArticleById = (article_id) => {
    return db
    .query(`SELECT * FROM articles WHERE article_id = $1;`, [article_id])
    .then(( result ) => {
        if (!result.rows.length) {
            return Promise.reject({status: 404, msg: 'Route not found'})
        }
        return result.rows[0]
    })
}

updateVotes = (votes, article_id) => {
   const newVote = votes.inc_votes
   return db
   .query(`UPDATE articles SET votes = votes + $1 WHERE article_id = $2 RETURNING *;`, [newVote, article_id])
   .then(( result ) => {
       return result.rows[0]
   })
}

module.exports = {fetchArticleById, updateVotes};
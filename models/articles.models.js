const db = require("../db/connection");

const fetchArticleById = (article_id) => {
  return db

    .query(
      `
    SELECT articles.*, COUNT(comments.article_id)::int AS comment_count
    FROM articles
    LEFT JOIN comments ON comments.article_id = articles.article_id
    WHERE articles.article_id = $1
    GROUP BY articles.article_id
    `,
      [article_id]
    )

    .then((result) => {
      if (!result.rows.length) {
        return Promise.reject({ status: 404, msg: "Route not found" });
      }
      return result.rows[0];
    });
};

const fetchCommentsById = (article_id) => {
  return db

    .query(`SELECT * FROM comments WHERE article_id = $1`, [article_id])
    .then((result) => {
      return result.rows;
    });
};

const updateVotes = (votes, article_id) => {
  const newVote = votes.inc_votes;
  if (newVote === undefined) {
    return Promise.reject({ status: 400, msg: "Bad Request" });
  }
  return db
    .query(
      `UPDATE articles SET votes = votes + $1 WHERE article_id = $2 RETURNING *;`,
      [newVote, article_id]
    )
    .then((result) => {
      if (!result.rows.length) {
        return Promise.reject({ status: 404, msg: "Route not found" });
      }
      return result.rows[0];
    });
};

const fetchArticles = (sortByQuery, sortOrder, topic) => {

  
  if (!sortByQuery || sortByQuery === undefined) {
      sortByQuery = "created_at";
    }
    if (!sortOrder || sortOrder === undefined) {
        sortOrder = "desc";
      }
      const queryParams = []
      
      let queryString = `SELECT articles.*, COUNT(comments.article_id)::int AS comment_count
      FROM articles 
      LEFT JOIN comments ON comments.article_id = articles.article_id`
      if(topic) {
    queryString += ` WHERE articles.topic = $1`
    queryParams.push(topic)
  }
  queryString += ` GROUP BY articles.article_id
  ORDER BY ${sortByQuery} ${sortOrder}`
 

  return db

    .query(queryString, queryParams)

    .then((result) => {
      return result.rows;
    })
    .catch(console.log)
};

const checkArticleIdExists = (ID) => {
  return db
    .query(`SELECT * FROM articles WHERE article_id = $1`, [ID])
    .then((result) => {
      if (!result.rows.length) {
        return Promise.reject({ status: 404, msg: "Article not found" });
      }
    });
};

const checkUserExists = (username) => {
  return db
    .query(`SELECT * FROM articles WHERE author = $1`, [username])
    .then((result) => {
      if (!result.rows.length) {
        return Promise.reject({ status: 404, msg: "User not found" });
      }
    });
};

const insertComment = (comment, ID) => {
  const { body, username } = comment;
  return db
    .query(
      `INSERT INTO comments (body, author, article_id) VALUES ($1, $2, $3) RETURNING *`,
      [body, username, ID]
    )
    .then((result) => {
      return result.rows[0];
    });
};

module.exports = {
  fetchArticleById,
  updateVotes,
  fetchArticles,
  fetchCommentsById,
  insertComment,
  checkArticleIdExists,
  checkUserExists,
};

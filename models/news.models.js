const db = require("../db/connection")

fetchTopics = () => {
  return db
  .query('SELECT * FROM topics').then((result) => {
    return result.rows;
  })
  .catch((err) => {
    console.log(err);
  });
};

module.exports = fetchTopics;
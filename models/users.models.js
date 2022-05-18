const db = require("../db/connection")

fetchUsers = () => {
    return db
    .query('SELECT username FROM users')
    .then((result) => {
        return result.rows
    })
}

module.exports = fetchUsers;
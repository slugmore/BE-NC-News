const db = require("../db/connection")

fetchUsers = () => {
    return db
    .query('SELECT * FROM users')
    .then((result) => {
        let usernames = result.rows.filter((el) => {
            return delete el.name && delete el.avatar_url
        })
        return usernames
    })
}

module.exports = fetchUsers;
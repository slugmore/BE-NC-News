const fetchTopics = require('../models/news.models')


getTopics = (req, res) => {
    fetchTopics().then((topics) => {
        res.status(200).send(topics)
    })
   
}

module.exports = getTopics
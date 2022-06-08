const request = require('supertest')
const testData = require('../db/data/test-data')
const app = require('../app')
const seed = require('../db/seeds/seed')
const db = require('../db/connection')

beforeEach(() => seed(testData));
afterAll(() => db.end())

describe('GET api/topics', () => {
    it('should return an array of objects containing description and slug properties', () => {
        return request(app).get('/api/topics')
        .expect(200)
        .then(({body}) => {
            const { topics } = body
            expect(topics).toBeInstanceOf(Array)
            expect(topics.length).toBe(3)
            expect(topics.forEach((topic) => {
                expect(topic).toEqual(
                    expect.objectContaining({
                        slug : expect.any(String),
                        description : expect.any(String),
                    })
                )
            }))
        })
    });
});

describe('GET api/articles/:article_id', () => {
    it('should return an article object containing the correct properties', () => {
        const ID = 3
        return request(app).get(`/api/articles/${ID}`)
        .expect(200)
        .then(({body}) => {
            expect(body.article).toMatchObject({
                article_id: 3,
                title: "Eight pug gifs that remind me of mitch",
                topic: "mitch",
                author: "icellusedkars",
                body: "some gifs",
                created_at: expect.any(String),
                votes: 0,
              })
        })
    });
    it('should add a comment count to the article object with the correct amount of comments', () => {
        const ID = 3
        return request(app).get(`/api/articles/${ID}`)
        .expect(200)
        .then(({body}) => {
            expect(body.article).toMatchObject({
                comment_count: 2
              })
        })
    });
    it('should return a 400 with a bad request if wrong data type is sent', () => {
        const ID = 'bad'
        return request(app).get(`/api/articles/${ID}`)
        .expect(400)
        .then(({body}) => {
            expect(body).toEqual({msg : "Bad Request"})
        })

    });
    it('should return 404 not found when passed a valid ID that does not exist', () => {
        const ID = 9999
        return request(app).get(`/api/articles/${ID}`)
        .expect(404)
        .then(({body}) => {
            expect(body).toEqual({msg: 'Route not found'})
        })
    });
});

describe('PATCH /api/articles/:article_id', () => {
    it('should update the vote count by the amount specified', () => {
        const newVote = { inc_votes: 100 }
        return request(app).patch('/api/articles/3')
        .send(newVote)
        .expect(200)
        .then(({body}) => {
            expect(body.article).toEqual({
                article_id: 3,
                title: "Eight pug gifs that remind me of mitch",
                topic: "mitch",
                author: "icellusedkars",
                body: "some gifs",
                created_at: expect.any(String),
                votes: 100,
            })
        })
    });
    it('should return a 400 with a bad request if invalid ID is sent', () => {
        const ID = 'bad'
        return request(app).patch(`/api/articles/${ID}`)
        .expect(400)
        .then(({body}) => {
            expect(body).toEqual({msg : "Bad Request"})
        })
    });
    it('should return a 400 with a bad request if votes is not a number', () => {
        const newVote = { inc_votes: 'yes' }
        return request(app).patch(`/api/articles/3`)
        .send(newVote)
        .expect(400)
        .then(({body}) => {
            expect(body).toEqual({msg : "Bad Request"})
        })
    });
    it('should return a 400 with a bad request if votes is empty or invalid', () => {
        const newVote = {}
        return request(app).patch(`/api/articles/3`)
        .send(newVote)
        .expect(400)
        .then(({body}) => {
            expect(body).toEqual({msg : "Bad Request"})
        })
    });
    it('should return a 404 with Not Found message if no endpoint is given', () => {
        return request(app).patch(`/api/articles/`)
        .expect(404)
        .then(({body}) => {
            expect(body).toEqual({msg : "Route not found"})
        })
    });
    it('should return a 404 error with /route not found/ when end point is valid type but does not not exist', () => {
       const newVote = { inc_votes: 100 }
       return request(app).patch('/api/articles/9898989')
       .send(newVote)
       .expect(404)
       .then(({body}) => {
           expect(body).toEqual({msg: "Route not found"})
       })
    });
});

describe('GET /api/users', () => {
    it('should return an array of objects with the username property', () => {
        return request(app).get('/api/users')
        .expect(200)
        .then(({body}) => {
            const { users } = body
            expect(users).toBeInstanceOf(Array)
            expect(users.length).toBe(4)
            expect(users.forEach((user) => {
                expect(user).toEqual(
                    expect.objectContaining({
                        username : expect.any(String),
                    })
                )
            }))
        })
    });
    it('should respond with a 404 error when given invalid endpoint', () => {
        return request(app).get('/api/uusers')
        .expect(404)
        .then(({body}) => {
            expect(body).toEqual({msg: "Route not found"})
        })
    });
});

describe('GET api/articles', () => {
    it('should return an array of article objects', () => {
        return request(app).get('/api/articles')
        .expect(200)
        .then(({body}) => {
            const { articles } = body
            expect(articles).toBeInstanceOf(Array)
            expect(articles.length).toBe(12)
            expect(articles.forEach((article) => {
                expect(article).toEqual(
                    expect.objectContaining({
                        article_id: expect.any(Number),
                        title: expect.any(String),
                        topic: expect.any(String),
                        author: expect.any(String),
                        body: expect.any(String),
                        created_at: expect.any(String),
                        votes: expect.any(Number),
                        comment_count: expect.any(Number),
                    })
                )
            }))
        })
    });
    it('should respond with a 404 error when given invalid endpoint', () => {
        return request(app).get('/api/aartiklez')
        .expect(404)
        .then(({body}) => {
            expect(body).toEqual({msg: "Route not found"})
        })
    });
    it('should sort the articles by date in descending order', () => {
        return request(app).get('/api/articles')
        .expect(200)
        .then(({body}) => {
            const { articles } = body
            expect(articles).toBeSorted({descending: true})
            expect(articles).toBeSortedBy('created_at')
        })
    });
});

describe('GET api/articles/:article_id/comments', () => {
    it('should return an array of article objects', () => {
        const ID = 1
        return request(app).get(`/api/articles/${ID}/comments`)
        .expect(200)
        .then(({body}) => {
            const { comments } = body
            expect(comments).toBeInstanceOf(Array)
            expect(comments.length).toBe(11)
            expect(comments.forEach((comment) => {
                expect(comment).toEqual(
                    expect.objectContaining({
                        comment_id: expect.any(Number),
                        votes: expect.any(Number),
                        author: expect.any(String),
                        created_at: expect.any(String),
                        body: expect.any(String),
                    })
                )
            }))
        })
    });
    it('should return an empty array when article(ID) has no comments', () => {
        const ID = 2
        return request(app).get(`/api/articles/${ID}/comments`)
        .expect(200)
        .then(({body}) => {
            const { comments } = body
            expect(comments).toEqual([])
        })
    });
    it('should return a 400 with a bad request if wrong data type is sent', () => {
        const ID = 'bad'
        return request(app).get(`/api/articles/${ID}/comments`)
        .expect(400)
        .then(({body}) => {
            expect(body).toEqual({msg : "Bad Request"})
        })

    });
    it('should return 404 not found when passed a valid ID that does not exist', () => {
        const ID = 7775763
        return request(app).get(`/api/articles/${ID}`)
        .expect(404)
        .then(({body}) => {
            expect(body).toEqual({msg: 'Route not found'})
        })
    });
});

describe('POST api/articles/:article_id/comments', () => {
    it('should respond with an object containing username and body properties', () => {
        const ID = 3
        const newComment = {
            username: "icellusedkars",
            body: "test review"
        }
        return request(app)
        .post(`/api/articles/${ID}/comments`)
        .send(newComment)
        .expect(201)
        .then(({body}) => {
            expect(body).toMatchObject({
                author: "icellusedkars",
                body: "test review",
                article_id: 3
            })

        })
    });
    it('should respond with error 404 if given an non existent ID', () => {
        const ID = 400000
        const newComment = {
            username: "icellusedkars",
            body: "test review"
        }
        return request(app)
        .post(`/api/articles/${ID}/comments`)
        .send(newComment)
        .expect(404)
        .then(({body}) => {
            expect(body).toEqual({msg: 'Article not found'})   
        })
    });
    it('should respond with 400 bad request if request body is invalid', () => {
        const ID = 3
        const newComment = {
            username: "icellusedkars",
        }
        return request(app)
        .post(`/api/articles/${ID}/comments`)
        .send(newComment)
        .expect(400)
        .then(({body}) => {
            expect(body).toEqual({msg : "Bad Request"})

        })
    });
    it('should respond with 400 bad request when given an invalid ID', () => {
        const ID = 'not an ID'
        const newComment = {
            username: "icellusedkars",
            body: "test review"
        }
        return request(app)
        .post(`/api/articles/${ID}/comments`)
        .send(newComment)
        .expect(400)
        .then(({body}) => {
            expect(body).toEqual({msg: 'Bad Request'})   
        })
    });
    it('should respond with 404: user not found when username does not exist', () => {
        const ID = 5
        const newComment = {
            username: "AlanSugar",
            body: "test review"
        }
        return request(app)
        .post(`/api/articles/${ID}/comments`)
        .send(newComment)
        .expect(404)
        .then(({body}) => {
            expect(body).toEqual({msg: 'User not found'})   
        })
    });
});

describe('GET api/articles/:queries', () => {
    it('should return array or articles sorted by comment_count', () => {
        const query = '?sort_by=comment_count'
        return request(app).get(`/api/articles/${query}`)
        .expect(200)
        .send(query)
        .then(({body}) => {
            const { articles } = body
            expect(articles).toBeSorted({descending: true})
            expect(articles).toBeSortedBy('comment_count')
        })
    });
    it('should return array of articles sorted by article_id', () => {
        const query = '?sort_by=article_id'
        return request(app).get(`/api/articles/${query}`)
        .expect(200)
        .send(query)
        .then(({body}) => {
            const { articles } = body
            expect(articles).toBeSorted({descending: true})
            expect(articles).toBeSortedBy('article_id')
        })
    });
    it('should return an array of articles ordered by by ascending order', () => {
        const query = '?order=asc'
        return request(app).get(`/api/articles/${query}`)
        .expect(200)
        .send(query)
        .then(({body}) => {
            const { articles } = body
            expect(articles).toBeSorted({descending: false})
        })
    });
    it('should return an array of articles ordered by by descending order', () => {
        const query = '?order=desc'
        return request(app).get(`/api/articles/${query}`)
        .expect(200)
        .send(query)
        .then(({body}) => {
            const { articles } = body
            expect(articles).toBeSorted({descending: true})
        })
    });
});

// greenlist sort_by, topics, order
// possible tests

// ?sort_by=comment_count expect 200 toBeSortedBy(comment count) desc = true
// ?order=asc expect 200 toBeSortedBy created_at desc false
// ?author=validauthor expect 200 for each review.owner to be author
// ?topic=validtopic 200 foreach article.topic expt to be topic
// 400 sort by equals not valid sort by
// 404 author = not valid author
// 404 topic = not a valid topic
// 200 ?author=validauthor with no articles return 200 and empty array
// topic valid but has no articles exp 200 and empty array 
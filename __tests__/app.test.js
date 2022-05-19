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
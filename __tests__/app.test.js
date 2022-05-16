const request = require('supertest')
const testData = require('../db/data/test-data')
const app = require('../app')
const seed = require('../db/seeds/seed')
const db = require('../db/connection')

beforeEach(() => seed(testData));
afterAll(() => db.end())

describe.only('GET api/topics', () => {
    it('should return an array of objects containing description and slug properties', () => {
        return request(app).get('/api/topics')
        .expect(200)
        .then(({body}) => {
            const topics = body
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
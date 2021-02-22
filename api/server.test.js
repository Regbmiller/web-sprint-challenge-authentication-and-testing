const request = require("supertest");
const db = require("../data/dbConfig.js")
const server = require("./server")

beforeAll(async () => {
  await db.migrate.rollback();
  await db.migrate.latest();
});

beforeEach(async () => {
  await db("users").truncate();
});

afterAll(async () => {
  await db.destroy();
})

const user1 = {
  username: "Reggie",
  password: "password"
};


describe("Testing for endpoints", () => {
    describe("Test for register feature", () => {
      test("Should return 200", async () => {
        const res = await request(server)
          .post('/api/auth/register')
          .send(user1);
        expect(res.status).toBe(200);
      })
      test("Should return a 401 error code", async () => {
        const res = await request(server).post('/api/auth/register');
        expect(res.body).toContain(401);
      })
    })

  describe("Test for login feature", () => {
    beforeEach(async () => {
      await request(server).post('/api/auth/login').send(user1)
    })
    test("Registration returns correct token", async () => {
     const res = await (await request(server).post('./api/auth/login')).send(user1);
     expect(res.body.token).toBeTruthy();
    })
  })

  describe("Test for jokes router", () => {
    it('Returns jokes', async () => {
      const res = await request(server).get('/api/jokes');
      expect(res.body).toBe(200);
      })
    })
  })


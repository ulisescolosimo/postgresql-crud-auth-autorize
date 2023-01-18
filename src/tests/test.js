const chai = require("chai");
const assert = chai.assert;
const expect = chai.expect;
const { Pool } = require("pg");
const { getUsers, createUsers, updateUser, deleteUser } = require("../controllers/index.controller.js");

describe("Users controllers", () => {
  let pool;

  before(async () => {
    pool = new Pool({
      host: "localhost",
      user: "postgres",
      password: "behind",
      database: "firstapi",
      port: "5432",
    });
    await pool.query("DELETE FROM users");
  });

  after(async () => {
    await pool.end();
  });

  describe("GET /users", () => {
    it("should return all users", async () => {
      // insert some users in the 'users' table
      await pool.query("INSERT INTO users (name, email) VALUES ($1, $2)", [
        "John",
        "john@example.com",
      ]);
      await pool.query("INSERT INTO users (name, email) VALUES ($1, $2)", [
        "Jane",
        "jane@example.com",
      ]);

      // call the function
      const req = {};
      const res = {
        status: (status) => {
          res.status = status;
          return res;
        },
        json: (body) => {
          res.body = body;
          return res;
        },
      };
      await getUsers(req, res);

      // check the response
      assert.equal(res.status, 200);
      expect(res.body).to.deep.equal([
        { name: "John", email: "john@example.com" },
        { name: "Jane", email: "jane@example.com" },
      ]);
    });
  });

  describe("POST /users", () => {
    it("should create a new user", async () => {
      // call the function
      const req = {
        body: { name: "John", email: "john@example.com" },
      };
      const res = {
        status: (status) => {
          res.status = status;
          return res;
        },
        json: (body) => {
          res.body = body;
          return res;
        },
      };
      await createUsers(req, res);

      // check the response
      assert.equal(res.status, 200);

      // check the user was inserted correctly in the 'users' table
      const result = await pool.query("SELECT * FROM users");
      expect(result.rows).to.deep.equal([
        { name: "John", email: "john@example.com" },
      ]);
    });
  });

  describe("PUT /users/:id", () => {
    it("should update an existing user", async () => {
      // insert a user
      await pool.query("INSERT INTO users (name, email) VALUES ($1, $2)", [
        "John",
        "john@example.com",
      ]);

      // create the request object with the updated user data
      const req = {
        params: { id: 1 },
        body: { name: "Jane", email: "jane@example.com" },
      };

      // create a mock response object
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      // call the updateUser function
      await updateUser(req, res);

      // assert the response status code
      expect(res.status).toBeCalledWith(200);

      // assert the user was updated in the database
      const users = await pool.query("SELECT * FROM users");
      expect(users.rows).toEqual([{ name: "Jane", email: "jane@example.com" }]);
    });
  });

  it("should delete an existing user", async () => {
    // insert a user
    await pool.query("INSERT INTO users (name, email) VALUES ($1, $2)", [
      "John",
      "john@example.com",
    ]);

    // create the request object with the user id
    const req = {
      params: { id: 1 },
    };

    // create a mock response object
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    // call the deleteUser function
    await deleteUser(req, res);

    // assert the response status code
    expect(res.status).toBeCalledWith(200);

    // assert the user was deleted from the database
    const users = await pool.query("SELECT * FROM users");
    expect(users.rows).toEqual([]);
  });
});

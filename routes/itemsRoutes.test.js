process.env.NODE_ENV = "test";

const request = require("supertest");
const app = require("../app");
const items = require("../fakeDb");

const snickers = {
  name: "snickers",
  price: 1.25
}

beforeEach(() => {
  items.push(snickers)
});

afterEach(() => {
  items.length = 0;
})

describe("GET items", () => {
  test("Get list of items", async () => {
    const resp = await request(app).get("/items");
    expect(resp.statusCode).toBe(200);

    expect(resp.body).toEqual({items: [snickers]});
  });
});

describe("GET item", () => {
  test("Get item by name parameter", async () => {
    const resp = await request(app).get("/items/snickers");
    expect(resp.statusCode).toBe(200);

    expect(resp.body).toEqual(snickers);
  });
});

describe("POST item", () => {
  test("Create new item", async () => {
    const resp = await request(app).post("/items").send({name: "popsicle", price: 0.99})

    expect(resp.statusCode).toBe(201);

    expect(resp.body).toEqual({added: {name: "popsicle", price: 0.99}});
  });
});

describe("PATCH /items/:name", function() {
  test("Updates a single item name", async function() {
    const resp = await request(app)
      .patch(`/items/${snickers.name}`)
      .send({
        name: "krunch"
      });
    expect(resp.statusCode).toBe(200);
    expect(resp.body).toEqual({
      updated: { name: "krunch", price: 1.25 }
    });
  });

  test("Responds with 400 if invalid name", async function() {
    const resp = await request(app).patch(`/items/test`);
    expect(resp.statusCode).toBe(400);
  });
});

describe("DELETE /item/:name", function() {
  test("Deletes a single item", async function() {
    const resp = await request(app).delete(`/items/${snickers.name}`);
    expect(resp.statusCode).toBe(200);
    expect(resp.body).toEqual({ message: "Deleted" });
  });
});

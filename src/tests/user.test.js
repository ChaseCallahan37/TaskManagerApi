const request = require("supertest");
const app = require("../app");
const User = require("../models/user-model");
const { setUpDatabase, user1, user1Id } = require("./fixtures/db");

beforeEach(setUpDatabase);

test("Creating a new user", async () => {
  await request(app)
    .post("/users")
    .send({
      name: "Chase",
      email: "chaz@email.com",
      password: "sophie123",
    })
    .expect(201);
});

test("Should login a user", async () => {
  const res = await request(app)
    .post("/users/login")
    .send({
      email: user1.email,
      password: user1.password,
    })
    .expect(200);

  const user = await User.findById(user1Id);
  expect(res.body.token).toBe(user.tokens[1].token);
});

test("Should not login a user with invalid credentials", async () => {
  await request(app)
    .post("/users/login")
    .send({
      email: "tt",
      password: "l",
    })
    .expect(400);
});

test("Should retrieve a users profile", async () => {
  await request(app)
    .get("/users/me")
    .set("Authorization", `Bearer ${user1.tokens[0].token}`)
    .send()
    .expect(200);
});

test("Should not retrieve data for an unauthorized user", async () => {
  await request(app).get("/users/me").send().expect(401);
});

test("Should delete account for a user", async () => {
  const res = await request(app)
    .delete("/users/me")
    .set("Authorization", `Bearer ${user1.tokens[0].token}`)
    .send()
    .expect(200);

  const user = await User.findById(user1Id);
  expect(user).toBeNull();
});

test("Should not delete a user who is not signed in", async () => {
  await request(app).delete("/users/me").send().expect(401);
});

test("should upload an avatoar pic", async () => {
  await request(app)
    .post("/users/me/avatar")
    .set("Authorization", `Bearer ${user1.tokens[0].token}`)
    .attach("avatar", "./src/tests/fixtures/BreakdownofAdminMockUp.jpg")
    .expect(200);

  const user = await User.findById(user1Id);
  expect(user.avatar).toEqual(expect.any(Buffer));
});

test("Should update valid user fields", async () => {
  const updates = {
    name: "chazzy",
  };
  await request(app)
    .patch("/users/me")
    .set("Authorization", `Bearer ${user1.tokens[0].token}`)
    .send(updates)
    .expect(200);

  const user = await User.findById(user1Id);
  expect(user.name).toEqual(updates.name);
});

test("Should not update invalid user fields", async () => {
  const updates = { favColor: "RED" };
  await request(app)
    .patch("/users/me")
    .set("Authorization", `Bearer ${user1.tokens[0].token}`)
    .send({ updates })
    .expect(400);

  const user = await User.findById(user1Id);
  expect(user.favColor).toBeUndefined();
});

test("Should not sign up user with invalid name", async () => {
  const newUser = {
    email: "sophie@email.com",
    password: "passs123",
  };
  const res = await request(app).post("/users").send(newUser).expect(400);

  expect(res.body.user).toBeUndefined();
});

test("Should not sign up user with invalid email", async () => {
  const newUser = {
    name: "Chase",
    password: "passs123",
  };
  const res = await request(app).post("/users").send(newUser).expect(400);

  expect(res.body.user).toBeUndefined();
});

test("Should not sign up user with invalid password", async () => {
  const newUser = {
    name: "Chase",
    email: "chase@email.com",
  };
  const res = await request(app).post("/users").send(newUser).expect(400);

  expect(res.body.user).toBeUndefined();
});

test("Should not update user if unauthenticated", async () => {
  const updates = { name: "CharChaz" };
  await request(app).patch("/users/me").send(updates).expect(401);
});

test("Should not update user with invalid email", async () => {
  const update = { email: null };
  await request(app)
    .patch("/users/me")
    .send("Authorization", `Bearer ${user1.tokens[0].token}`)
    .send(update)
    .expect(401);
});

test("Should not update user with invalid name", async () => {
  const update = { name: null };
  await request(app)
    .patch("/users/me")
    .send("Authorization", `Bearer ${user1.tokens[0].token}`)
    .send(update)
    .expect(401);
});

test("Should not update user with invalid password", async () => {
  const update = { password: null };
  await request(app)
    .patch("/users/me")
    .send("Authorization", `Bearer ${user1.tokens[0].token}`)
    .send(update)
    .expect(401);
});

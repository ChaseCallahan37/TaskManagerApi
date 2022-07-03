const request = require("supertest");
const app = require("../app");
const Task = require("../models/tasks-model");
const User = require("../models/user-model");
const {
  setUpDatabase,
  user1,
  user2,
  user1Id,
  tasks,
} = require("./fixtures/db");

beforeEach(setUpDatabase);

test("Should create a task", async () => {
  const newTask = {
    description: "Hi there",
    completed: true,
  };
  const res = await request(app)
    .post("/tasks")
    .set("Authorization", `Bearer ${user1.tokens[0].token}`)
    .send(newTask)
    .expect(201);

  const task = await Task.findById(res.body._id);
  expect(task.description).toEqual(newTask.description);
});

test("Should retrieve all the tasks for a user", async () => {
  const res = await request(app)
    .get("/tasks")
    .set("Authorization", `Bearer ${user1.tokens[0].token}`)
    .send()
    .expect(200);
  expect(res.body.length).toEqual(2);
});

test("A user who does not own a task should not be able to delete it", async () => {
  const res = request(app)
    .delete(`/tasks/${tasks.task2._id}`)
    .set("Authorization", `Bearer ${user2.tokens[0].token}`)
    .send()
    .expect(404);

  const task = Task.findById(tasks.task2._id);
  expect(task).not.toBeNull();
});

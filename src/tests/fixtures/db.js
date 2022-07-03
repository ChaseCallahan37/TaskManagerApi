const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const User = require("../../models/user-model");
const Task = require("../../models/tasks-model");

const user1Id = new mongoose.Types.ObjectId();
const user1 = {
  _id: user1Id,
  name: "Mike",
  email: "Mike@email.com",
  password: "pass1234",
  tokens: [
    {
      token: jwt.sign({ _id: user1Id }, process.env.JWT_SECRET),
    },
  ],
};

const user2Id = new mongoose.Types.ObjectId();
const user2 = {
  _id: user2Id,
  name: "Chaz",
  email: "Chazzyboi@email.com",
  password: "pass1234!!!!!",
  tokens: [
    {
      token: jwt.sign({ _id: user1Id }, process.env.JWT_SECRET),
    },
  ],
};

const tasks = {
  task1: {
    description: "Task 1",
    completed: false,
    owner: user1._id,
  },

  task2: {
    description: "Task 2",
    completed: true,
    owner: user1._id,
  },

  task3: {
    description: "Task 3",
    completed: true,
    owner: user2._id,
  },
};

const setUpDatabase = async () => {
  const { task1, task2, task3 } = tasks;
  await User.deleteMany();
  await Task.deleteMany();
  await new User(user1).save();
  await new User(user2).save();
  await new Task(task1).save();
  await new Task(task2).save();
  await new Task(task3).save();
};

module.exports = {
  user1Id,
  user1,
  user2,
  user2Id,
  tasks,
  setUpDatabase,
};

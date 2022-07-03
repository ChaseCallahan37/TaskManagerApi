const express = require("express");
require("./db/mongoose");
const userRouter = require("./routers/user-route");
const taskRouter = require("./routers/tasks-route");

const app = express();

app.use(express.json());
app.use(userRouter);
app.use(taskRouter);

module.exports = app;

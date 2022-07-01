const express = require("express");
require("./db/mongoose");
const User = require("./models/user-model");
const Task = require("./models/tasks-model");
const userRouter = require("./routers/user-route");
const taskRouter = require("./routers/tasks-route");

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());
app.use(userRouter);
app.use(taskRouter);
app.listen(port, () => {
  console.log(`Server is up on port ${port}`);
});

// const multer = require("multer");

// const upload = multer({
//   dest: "images",
//   limits: {
//     fileSize: 1000000,
//   },
//   fileFilter(req, file, cb) {
//     if (!file.originalname.match(/\.(doc|docx)$/)) {
//       return cb(new Error("Please upload a Word Document"));
//     }
//     cb(undefined, true);
//   },
// });

// const errorMiddle = (req, res, next) => {
//   throw new Error("from middle ware");
// };

// app.post(
//   "/upload",
//   upload.single("upload"),
//   (req, res) => {
//     res.send();
//   },
//   (error, req, res, next) => {
//     res.status(400).send({ error: error.message });
//   }
// );

// app.use((req, res, next) => {
//   if (req.method === "GET") {
//     return res.send("Get requests are disabled");
//   }
//   next();
// });

// app.use((req, res, next) => {
//   res.status(503).send("Site down for maintenance");
// });

// const bcrypt = require("bcryptjs");

// const getPass = async () => {
//   const password = "LaLaLuna37";
//   const hashedPassword = await bcrypt.hash(password, 8);

//   console.log(password);
//   console.log(hashedPassword);

//   const isMathced = await bcrypt.compare("John", hashedPassword);
//   console.log(isMathced);
// };
// getPass();

// const jwt = require("jsonwebtoken");

// const myFunction = async () => {
//   const token = jwt.sign({ _id: "123abc" }, "thisisatoken");
//   console.log(token);

//   const data = jwt.verify(token, "thisisatoken");
//   console.log(data);
// };

// myFunction();

// const main = async () => {
//   // const task = await Task.findById("62b90437b9576445bc29e522");
//   // await task.populate("owner");
//   // console.log(task.owner);

//   const user = await User.findById("62b90427b9576445bc29e520");
//   await user.populate("tasks");
//   console.log(user.tasks);
// };

// main();

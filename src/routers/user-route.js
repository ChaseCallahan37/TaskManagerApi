const express = require("express");
const multer = require("multer");
const sharp = require("sharp");
const router = express.Router();
const User = require("../models/user-model");
const auth = require("../middleware/auth");
const {
  sendWelcomeEmail,
  sendCancellationEmail,
} = require("../emails/account");

router.get("/users/me", auth, async (req, res) => {
  res.send(req.user);
});

router.post("/users", async (req, res) => {
  const user = new User(req.body);
  try {
    await user.save();
    sendWelcomeEmail({ email: user.email, name: user.name });
    const token = await user.generateAuthToken();
    res.status(201).send({ user, token });
  } catch (er) {
    res.status(400).send(er);
  }
});

router.post("/users/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findByCredentials(email, password);
    const token = await user.generateAuthToken();
    res.send({ user, token });
  } catch (er) {
    res.status(400).send(er);
  }
});

router.post("/users/logout", auth, async (req, res) => {
  try {
    req.user.tokens = req.user.tokens.filter((t) => req.token !== t.token);
    await req.user.save();
    res.send();
  } catch (er) {
    res.status(500).send("Could not logout", er);
  }
});

router.post("/users/logoutALL", auth, async (req, res) => {
  try {
    req.user.tokens = [];
    await req.user.save();
    res.send();
  } catch (er) {
    res.status(500).send(er);
  }
});

const upload = multer({
  limits: {
    fileSize: 1000000,
  },
  fileFilter(req, file, cb) {
    if (!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
      return cb(new Error("Please upload either a jpg, jpeg, or png file"));
    }
    cb(null, true);
  },
});

const avatarErrorHandler = (error, req, res, next) => {
  res.status(400).send({ error: error.message });
};

router.post(
  "/users/me/avatar",
  auth,
  upload.single("avatar"),
  async (req, res) => {
    const buffer = await sharp(req.file.buffer)
      .resize({ width: 250, height: 250 })
      .png()
      .toBuffer();
    req.user.avatar = buffer;

    await req.user.save();
    res.send();
  },
  avatarErrorHandler
);

router.get("/users/:id/avatar", async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user || !user.avatar) {
      return res.status(404).send(new Error("No avatar exists"));
    }
    res.set("Content-Type", "image/png");
    res.send(user.avatar);
  } catch (er) {
    res.status(404).send(er);
  }
});

router.patch("/users/me", auth, async (req, res) => {
  const updates = Object.keys(req.body);
  const allowedUpdates = ["name", "email", "password", "age"];
  const isValid = updates.every((update) => allowedUpdates.includes(update));
  if (!isValid) {
    return res.status(400).send({ error: "Must update a valid field" });
  }
  try {
    updates.forEach((update) => (req.user[update] = req.body[update]));
    await req.user.save();
    res.send(req.user);
  } catch (er) {
    res.status(400).send(er);
  }
});

router.delete("/users/me", auth, async (req, res) => {
  try {
    await req.user.remove();
    sendCancellationEmail({
      name: req.user.name,
      email: req.user.email,
    });
    res.send(req.user);
  } catch (er) {
    res.status(500).send(er);
  }
});

router.delete("/users/me/avatar", auth, async (req, res) => {
  if (req.user.avatar === null)
    return res.status(400).send({ error: "User has no avatar" });
  try {
    req.user.avatar = null;
    await req.user.save();
    res.send();
  } catch (er) {
    res.status(400).send({ error: er });
  }
});

module.exports = router;

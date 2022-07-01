const mongoose = require("mongoose");

//Provide database url along with a '/' then name of database
mongoose.connect(process.env.MONGODB_URL, {
  useNewUrlParser: true,
  // useCreateIndex: true,
  // useFindAndModify: false,
});

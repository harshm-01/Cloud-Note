const mongoose = require("mongoose");

const mongoURI = "";

const connectToMongo = async () => {
  await mongoose
    .connect(mongoURI)
    .then(() => {
      console.log("Database Connected!");
    })
    .catch((err) => {
      console.error(err);
    });
};

module.exports = connectToMongo;

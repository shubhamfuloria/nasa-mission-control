const mongoose = require("mongoose");

const MONGO_URL =
  "mongodb+srv://nasa-api:BGCYHdiLvWJWaiq7@cluster1.37xwy1m.mongodb.net/?retryWrites=true&w=majority";

mongoose.connection.once("open", () => {
  console.log("Mongo DB connection is Ready !");
});

mongoose.connection.on("error", (err) => {
  console.error(err);
});

async function mongoConnect() {
  await mongoose.connect(MONGO_URL);
}

async function mongoDisconnect() {
  await mongoose.disconnect();
}

module.exports = { mongoConnect, mongoDisconnect };

const connectToMongo = require("./db");
const express = require("express");
const cors = require("cors");

connectToMongo();


const app = express();
const port = 5000;

app.use(cors());
app.use(express.json()); // a middleware --- used for sending and getting the request

// Available Routes

app.use("/api/auth", require("./routes/auth"));
app.use("/api/notes", require("./routes/notes"));

app.listen(port, () => {
  console.log(`iNoteBook listening on port ${port}`);
});

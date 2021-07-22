const express = require("express");
const bodyParser = require("body-parser");
const db = require("./database");
const userRouter = require("./routes/userRouter");

const app = express();
const apiPort = process.env.PORT || 3001;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use("/api", userRouter);

db.on("error", (error) =>
    console.error("MongoDB connection error: " + error.message)
);
db.once("open", () => console.log("Connected to database"));

app.listen(apiPort, () => console.log(`Server running on port ${apiPort}`));

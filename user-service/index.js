const express = require("express");
const bodyParser = require("body-parser");
const connectToDatabase = require("../config/db");
const mongoose = require("mongoose");

const app = express();
const PORT = 3001;

const cors = require("cors");
app.use(cors());

connectToDatabase();
app.use(bodyParser.json());

app.get("/users", async (req, res) => {
  try {
    const db = mongoose.connection.db;
    const users = await db.collection("users").find().toArray();
    res.json(users);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error fetching users", error: err.message });
  }
});

app.get("/users/:id", async (req, res) => {
  try {
    const db = mongoose.connection.db;
    const usersCollection = db.collection("users");

    const { ObjectId } = require("mongodb");
    const userId = new ObjectId(req.params.id);

    const user = await usersCollection.findOne({ _id: userId });

    if (user) {
      res.json(user);
    } else {
      res.status(404).json({ message: "User not found" });
    }
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error fetching user", error: err.message });
  }
});

app.listen(PORT, () => {
  console.log(`User Service running on port ${PORT}`);
});

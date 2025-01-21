const express = require("express");
const bodyParser = require("body-parser");
const axios = require("axios");
const connectToDatabase = require("../config/db");
const mongoose = require("mongoose");

const app = express();
const PORT = 3002;

const cors = require("cors");
app.use(cors());

connectToDatabase();
app.use(bodyParser.json());

app.get("/orders", (req, res) => {
  res.json(orders);
});

app.get("/orders/:userId", async (req, res) => {
  try {
    const userId = req.params.userId;
    const response = await axios.get(`http://localhost:3001/users/${userId}`);
    const user = response.data;

    const db = mongoose.connection.db;
    const productsCollection = db.collection("products");

    const product_data = await Promise.all(
      user.cart.items.map(async (item) => {
        const { ObjectId } = require("mongodb");
        const productId = new ObjectId(item.productId);
        const quantity = item.quantity;

        const product = await productsCollection.findOne({ _id: productId });

        return {
          product,
          quantity,
        };
      })
    );
    res.json({
      product_data,
    });
  } catch (err) {
    console.error(err);
    res
      .status(500)
      .json({ message: "Error fetching products", error: err.message });
  }
});

app.listen(PORT, () => {
  console.log(`Order Service running on port ${PORT}`);
});

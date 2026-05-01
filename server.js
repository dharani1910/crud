const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const app = express();
app.use(cors());
app.use(express.json());

mongoose.connect("mongodb://127.0.0.1:27017/crudDB")
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.error("MongoDB Connection Error:", err));

// Schema
const UserSchema = new mongoose.Schema({
  name: String,
  age: Number, 
});
const User = mongoose.model("User", UserSchema);

//creat
app.post("/users", async (req, res) => {
  try {
    const { name, age } = req.body; 
    const user = new User({ name, age });
    const saved = await user.save();
    res.json(saved);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server Error" });
  }
});

// READ (all)
app.get("/users", async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server Error" });
  }
});

// READ (single)
app.get("/users/:id", async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    res.json(user);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server Error" });
  }
});

// UPDATE
app.put("/users/:id", async (req, res) => {
  try {
    const { name, age } = req.body;
    const updated = await User.findByIdAndUpdate(
      req.params.id,
      { name, age },
      { new: true }
    );
    res.json(updated);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server Error" });
  }
});

//delete
app.delete("/users/:id", async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.json({ message: "Deleted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server Error" });
  }
});

// Server start
app.listen(5000, () => {
  console.log("Server running on port 5000");
});
import express from "express";
import cors from "cors";
import { connectDB } from "../lib/db.js";
import mongoose from "mongoose";

const app = express();
app.use(express.json());
app.use(cors());

const taskSchema = new mongoose.Schema({
  title: String,
  description: String,
  completed: {
    type: Boolean,
    default: false,
  },
});

const Tasks = mongoose.models.Tasks || mongoose.model("Tasks", taskSchema);

app.get("/todo", async (req, res) => {
  try {
    await connectDB();
    const data = await Tasks.find();
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch todos" });
  }
});

app.post("/todo", async (req, res) => {
  try {
    await connectDB();
    const task = new Tasks(req.body);
    await task.save();
    res.status(201).json(task);
  } catch (err) {
    res.status(500).json({ error: "Failed to create todo" });
  }
});

app.put("/todo/:id", async (req, res) => {
  try {
    await connectDB();
    const updated = await Tasks.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: "Failed to update todo" });
  }
});

app.delete("/todo/:id", async (req, res) => {
  try {
    await connectDB();
    await Tasks.findByIdAndDelete(req.params.id);
    res.json({ message: "Deleted" });
  } catch (err) {
    res.status(500).json({ error: "Failed to delete todo" });
  }
});

export default app;

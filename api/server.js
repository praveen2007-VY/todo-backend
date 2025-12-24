import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';

const app = express();
app.use(express.json());
app.use(cors());

// ✅ use Atlas via environment variable
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error(err));

const userSchema = new mongoose.Schema({
  title: String,
  description: String,
  completed: {
    type: Boolean,
    default: false
  }
});

const Tasks = mongoose.model('Tasks', userSchema);

// CREATE
app.post('/todo', async (req, res) => {
  const data = new Tasks(req.body);
  await data.save();
  res.status(201).json(data);
});

// READ
app.get('/todo', async (req, res) => {
  const data = await Tasks.find();
  res.json(data);
});

// UPDATE
app.put('/todo/:id', async (req, res) => {
  const updated = await Tasks.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true }
  );
  res.json(updated);
});

// DELETE
app.delete('/todo/:id', async (req, res) => {
  await Tasks.findByIdAndDelete(req.params.id);
  res.json({ message: "Deleted" });
});

// ✅ IMPORTANT: export app (NO app.listen)
export default app;

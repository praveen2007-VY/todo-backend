import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';

// Express import 
// mongoose import
// cors import
// Create express app
// use express.json() middleware
// use cors() middleware
// establish database connection mongodb
// create a Schema and Model
// derive the model using the schema
// start the server on a specific port


const app = express();
app.use(express.json());
app.use(cors());

mongoose.connect('mongodb://localhost:27017/TodoDB')
.then(() => {
    console.log('Connected to MongoDB');
})
.catch((e) => {
    console.error('Error connecting to MongoDB:', e);
});

const userSchema = new mongoose.Schema({
    title: String,
    description : String,
    completed: {
        type : Boolean,
        default : false
    }
});

const Tasks = mongoose.model('Tasks', userSchema);

app.post('/todo', async(req,res)=>{
   if(!req.body){
    req.status(400).send("Give the Proper Details")
   }
   

    const data= new  Tasks(req.body);
    await data.save();

    res.status(201).send("Data Saved Successfully");

})

app.get('/todo', async(req,res)=>{
    let data = await Tasks.find();
    res.json(data);
    res.status(200).send("Data Fetched Successfully");
})

app.put('/todo/:id', async(req,res)=>{
    const id=  req.params.id;
    const data=req.body;
    console.log(data);
    await Tasks.findByIdAndUpdate(id, data,{new:true});
    res.send("Data Updated Successfully");
})

app.delete('/todo/:id',async (req,res)=>{
    const id = req.params.id;
    await Tasks.findByIdAndDelete(id);
    res.send("Data Deleted Successfully");
})



app.listen(5000, () => {
  console.log(`Server is running on port 5000`);
});
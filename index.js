const express = require('express')
const cors = require('cors')
const dotenv = require('dotenv')
dotenv.config()
const mongoose = require('mongoose')
const User = require('./Models/UserModel')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const Task = require('./Models/TaskModel')

const app = express()
app.use(cors())
app.use(express.json())

mongoose.connect(process.env.MONGODB_URI)
.then(()=>{
    console.log(`connected to Mongo DataBase`)
}).catch(()=>{
    console.log(`Mongo connection failed`)
})

app.post('/auth/register', async (req, res) => {
    try {
        const { name, email, password } = req.body;

        //validating
        if (!name || !email || !password) {
            return res.status(400).json({ message: 'insufficient details' });
        }

        const existingUser = await User.findOne({ email });

        if (existingUser) {
            return res.status(400).json({ error: 'Email already in use' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = new User({
            name,
            email,
            password: hashedPassword,
        });

        const savedUser = await newUser.save();

        res.status(201).json({ id: savedUser._id, name: savedUser.name, email: savedUser.email });
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
});

app.post('/auth/login' , async(req,res)=>{
    try{
        const {email , password} = req.body

        //validating
        if (!email || !password) {
            return res.status(400).json({ message: 'insufficient details' });
        }

        const existingUser = await User.findOne({email})

        if(!existingUser){
            res.status(401).json({error:`No User exists with given email`})
        }

        const isPasswordValid = await bcrypt.compare(password, existingUser.password);

        if (!isPasswordValid) {
            return res.status(409).json({error:`Incorrect password`});
        }

        const token = jwt.sign({id: existingUser._id} , process.env.JWT_SECRET , {expiresIn:'24h'})

        res.status(200).json({
            status:"Success",
            token
        })
    }catch(error){
        res.status(400).json({error:'Internal Server error'});
    }
})


const authenticateToken = (req, res, next) => {
  const token = req.header('Authorization')?.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'Access denied. No token provided.' });

  try {
    const verified = jwt.verify(token, process.env.JWT_SECRET);
    req.user = verified;
    next();
  } catch (error) {
    res.status(400).json({ error: 'Invalid token.' });
  }
};

app.post('/tasks', authenticateToken, async (req, res) => {
  try {
    const { title, description, status, priority, dueDate } = req.body;

    const task = new Task({
      title,
      description,
      status,
      priority,
      dueDate,
      userId: req.user.id 
    });

    const savedTask = await task.save();
    res.status(201).json(savedTask);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.get('/tasks', authenticateToken, async (req, res) => {
    try {
        const tasks = await Task.find({userId: req.user.id});
        res.status(200).json(tasks);
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
});

app.get('/tasks/:id', authenticateToken, async (req, res) => {
    const { id } = req.params;

    try {
        const task = await Task.findOne({ userId: req.user.id, _id: id });

        if (!task) {
            return res.status(404).json({ error: 'No task found' });
        }

        res.status(200).json(task);
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
});

// app.get('/tasks/search', authenticateToken, async (req, res) => {
//     const { name } = req.query;

//     try {
//         const task = await Task.findOne({ userId: req.user.id, title: name });

//         if (!task) {
//             return res.status(404).json({ error: 'No task found' });
//         }

//         res.status(200).json(task);
//     } catch (error) {
//         res.status(500).json({ error: 'Internal server error' });
//     }
// });

app.put('/tasks/:id', authenticateToken, async (req, res) => {
    const { id } = req.params;
    const { title, description, status, priority, dueDate } = req.body;

    try {
        const updatedTask = await Task.findOneAndUpdate(
            { userId: req.user.id, _id: id },
            { title, description, status, priority, dueDate },
            { new: true }
        );

        if (!updatedTask) {
            return res.status(404).json({ error: 'No task found' });
        }

        res.status(200).json(updatedTask);
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
});

app.delete('/tasks/:id', authenticateToken, async (req, res) => {
    const { id } = req.params;

    try {
        const deletedTask = await Task.findOneAndDelete({ userId: req.user.id, _id: id });

        if (!deletedTask) {
            return res.status(404).json({ error: 'No task found' });
        }

        res.status(200).json({ message: 'Task deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
});

app.listen(process.env.PORT,()=>{
    console.log(`server is running on port ${process.env.PORT}`)
})
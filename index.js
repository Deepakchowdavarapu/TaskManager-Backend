const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const mongoose = require('mongoose');

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGODB_URI)
    .then(() => {
        console.log(`connected to Mongo DataBase`);
    }).catch(() => {
        console.log(`Mongo connection failed`);
    });

// Routes
const authRoutes = require('./routes/auth');
const taskRoutes = require('./routes/tasks');

app.use('/auth', authRoutes);
app.use('/tasks', taskRoutes);

app.get('/health', async (req, res) => {
    res.json({ message: `health of server is fine` });
});

app.listen(process.env.PORT, () => {
    console.log(`server is running on port ${process.env.PORT}`);
});
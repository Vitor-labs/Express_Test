console.log("Starting project demo");

const express = require('express');
const app = express();
const mongoose = require('mongoose');
const dotenv = require('dotenv');

const userRoutes = require('./routes/User');
const authRoutes = require('./routes/auth');

dotenv.config();

mongoose.connect(process.env.MONGO_URL).then(() => {
    console.log('Connected to MongoDB');
}).catch(err => {
    console.log('Error connecting to MongoDB:', err.message);
});

app.get('/api/test', () => {
    console.log('Test request received');
    return {
        message: 'Hello World'
    };
});

app.use(express.json());

app.use('/api/users', userRoutes);
app.use('/api/auth', authRoutes);

app.listen(process.env.port || 3000, () => {
    console.log("Server is running on port 3000");
});


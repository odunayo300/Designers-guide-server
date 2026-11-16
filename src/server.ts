import 'dotenv/config';
const dns = require('dns')
dns.setServers(["1.1.1.1"])
import express from 'express';
const app = express();
const PORT= process.env.PORT || 5000
const mongoose = require('mongoose');
const connectDB = require('./config/dbconnect')

// mongoDB connected
connectDB();

// built in middleware to handle urlencoded data
// in other word form data
// content Type : application/ x-www-form-urlenoded

app.use(express.urlencoded({extended:false}))

app.use(express.json());

// Routes
app.use('/register', require('./routes/register'));

app.use('/verifyEmail', require('./routes/verifyEmail'));

app.use('/resendOtp', require('./routes/resendOtp'));




app.get('/', (_req, res) => {
    res.json({ message: 'Welcome to the Designers Guide API' });
});

mongoose.connection.once('open', ()=>{
    console.log('Connected to MongoDB');
    app.listen(PORT, () => {
     console.log(`server running from port ${PORT}`);
    });
})

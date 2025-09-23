const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');
const authRoutes = require('./routes/authRoutes');
const reportRoutes = require('./routes/reportRoutes');
const cloudinaryConnect = require('./config/cloudinary');
const adminRoutes = require('./routes/adminRoutes');

const app = express();
dotenv.config();
app.use(express.json()); 
app.use(cors());

// For user side frontend
app.use('/api/auth', authRoutes);
app.use('/api/reports', reportRoutes);


app.use('/api/admin', adminRoutes); // For admin side frontend

//Define a Simple Root Route for Testing ---
app.get('/', (req, res) => {
    res.send("Backend server is running successfully!");
});


// Connect to Database and Start Server ---
const PORT = process.env.PORT ;
const DATABASE_URL = process.env.DATABASE_URL; // Make sure this matches your .env file

const startServer = () => {
    try {
        // Connect to the database
        mongoose.connect(DATABASE_URL);
        console.log("DB connected successfully");

        // Connect to Cloudinary
        cloudinaryConnect();

        // If the connection is successful, then start the server
        app.listen(PORT, () => {
            console.log(`Server started on port ${PORT}`);
        });

    } catch (error) {
        console.error("Failed to connect to the database", error);
        process.exit(1); // Exit the process with an error code
    }
};

startServer();






const mongoose = require('mongoose');

const connectDB = async () => {
    // If the database connection pool is already active, return the existing link instance
    if (mongoose.connection.readyState >= 1) {
        return;
    }

    try {
        if (!process.env.MONGODB_URI) {
            throw new Error("MONGODB_URI environment secret variable is completely missing!");
        }

        await mongoose.connect(process.env.MONGODB_URI);
        console.log("MERN Cloud cluster connected cleanly.");
    } catch (error) {
        console.error(`Database connection dropped: ${error.message}`);
        // DO NOT call process.exit(1) on serverless environments! It triggers function crashes.
        throw error;
    }
};

module.exports = connectDB;

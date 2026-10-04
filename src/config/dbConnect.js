const mongoose = require('mongoose');


async function dbConnect() {
    try {
        if (!process.env.MONGO_URI) {
            throw new Error('MONGO_URI is not defined. Please add it to your .env file.');
        }

        await mongoose.connect(process.env.MONGO_URI);
        console.log('MongoDB connected successfully');
    } catch (error) {
        console.error('Error connecting to MongoDB:', error.message || error);
        process.exit(1);
    }
}

module.exports = dbConnect;

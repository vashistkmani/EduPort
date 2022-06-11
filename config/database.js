const mongoose = require('mongoose');

serverDB = 'mongodb://localhost:27017/eduport';
const connectDB = async () => {
    try {
        await mongoose.connect(serverDB);
        console.log('database connnectd on successfully...')
    } catch (error) {
        console.log('database not connnected...');
    }
};

module.exports = connectDB;
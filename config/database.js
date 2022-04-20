const mongoose = require('mongoose');

serverDB = 'mongodb://localhost:27017/eduport';

mongoose.connect(serverDB,(req,res)=>{
    // mongoose.set('debug', true);
    console.log("DB connected Successfully");
})
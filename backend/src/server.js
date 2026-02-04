require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const app = require('./app');

const PORT =process.env.PORT||5000;
mongoose.connect(process.env.MONGO_URI)
.then(()=>{
    console.log("MOngoDb Connected");
    app.listen(PORT ,()=>{
        console.log(`Server is running on ${PORT}`);
    });
}).catch(err =>{
    console.error('DBconnection Failed ', err);
    process.exit(1);
});
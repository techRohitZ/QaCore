const express = require('express');
// import express from 'express'
const cors = require('cors');
const morgan = require('morgan');
const path = require('path');
const app =express();

app.use(cors());
app.use(express.json());

app.use(morgan('dev'));
app.use(express.static('public'))
// app.use(express.static(path.join(__dirname, 'public')));

app.use('/api' ,require('./routes'));
app.get('/health' ,(req,res)=>{
    res.status(200).json({status:'ok' ,service: 'AI-QA-BACKED'})
});

module.exports =app;
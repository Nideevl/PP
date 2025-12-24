import express from 'express';

const app = express(); 

app.use(express.json()); // adds the middleware function into the request pipleline
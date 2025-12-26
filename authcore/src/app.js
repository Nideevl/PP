import express from 'express';
import authRoutes from "./routes/auth.routes.js"
import userRoutes from "./routes/user.routes.js"

const app = express(); 

app.use(express.json()); // adds the middleware function into the request pipleline
app.use('/auth', authRoutes);
app.use('/userProfile',userRoutes)

export default app;
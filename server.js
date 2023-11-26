import express from 'express';
import dotenv from 'dotenv';
import connectDB from './db/index.js';
import { identifyController } from './controller/contact.controller.js';

dotenv.config();

const PORT = process.env.PORT;

const app = express();
app.use(express.json());

connectDB()
.then(() => {
    app.post('/identify', identifyController);
    app.listen(PORT, () => {
        console.log(`Server running on PORT: ${PORT}`)
    })
})
.catch(() => {
    console.log("Server error")
})



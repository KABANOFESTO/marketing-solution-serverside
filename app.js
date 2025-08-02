import express from "express";
import cors from 'cors'
import routes from "./src/routers";
import { dbConnect } from './src/config/db'
const app = express();
import { json } from 'express'
import fileUploader from 'express-fileupload'
import dotenv from 'dotenv';
dotenv.config();
const PORT = process.env.PORT || 4000;



dbConnect()

app.use(cors());
app.use(json())
app.use(fileUploader({ useTempFiles: true }))



app.use("/api", routes);
// app.use('/api/docs', docsRouter)


if (process.env.NODE_ENV !== 'test') {
    app.listen(PORT);
}


module.exports = app

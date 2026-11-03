import express from "express";
import { connectDB } from "./config/db.js";
import { createdefaultAdmin } from "./utils/defaultadmin.js";
import cookieParser from "cookie-parser";
import router from "./route/auth.route.js";
import userouter from "./route/user.route.js";
import cors from 'cors';
import { errormiddleware } from "./middleware/error.middleware.js";

const app=express()

app.use(express.json())
app.use(cors({
  origin: 'http://localhost:4200',
  origin:'http://localhost:50936',
  credentials: true
}));app.use(cookieParser())
await connectDB()

await createdefaultAdmin()
app.get('/' ,(req,res)=>{
    console.log('First call is running');
})

app.use('/auth',router)
app.use('/users',userouter)

app.use(errormiddleware)
app.listen(3000,()=>{
    console.log('3000 Port is running')
})
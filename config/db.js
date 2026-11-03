
import mongoose from "mongoose"

export const connectDB=async()=>{
    try{
        const mongodb='mongodb+srv://prasanthkumar7105_db_user:jPLRtnFUmUkA4Y6P@cluster0.k8231ve.mongodb.net/?appName=Cluster0'
        await mongoose.connect(mongodb).then(()=>{
            console.log('Database connected');
        })
    }catch(error){
        console.log(error.message);
    }
}
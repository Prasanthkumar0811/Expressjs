import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
    name:{type:String,required:true},
    username:{type:String,required:true,unique:true},
    email:{type:String,required:true,unique:true},
    age:{type:Number,required:true},
    phone:{type:Number,required:true,unique:true},
    password:{type:String,required:true},
    role:{
        type:String,
        enum:['admin','manager','user'],
        required:true
    }
},{timestamps:true})

const User = mongoose.model("User", UserSchema);

export default User;
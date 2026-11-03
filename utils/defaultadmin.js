import User from "../model/user.model.js";
import userModel from "../model/user.model.js"
import bcrypt from "bcryptjs";

export const createdefaultAdmin=async()=>{

    const admin= await User.findOne({
        role:'admin'
    })

    if(admin){
        console.log(
          "Default Admin Already Exists"
        );

        return
    }
    const hashedpassword=await bcrypt.hash('Admin123',10)

    await User.create({
        name:'Admin',
        username:'admin',
        email:'admin@gmail.com',
        age:'25',
        phone:'9999900000',
        password:hashedpassword,
        role:'admin'
    })

    console.log('default Admin created')
}
import User from "../model/user.model.js"
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export const createuser=async(req,res,next)=>{
    try{
        const {name,email,age,phone,password,role}=req.body

        if(!name || !email || !age || !phone || !password || !role){
            return res.status(400).json({
                message:"All Fields are required"
            })
        }

        const emailexits=await User.findOne({email})
        if(emailexits){
            return res.status(400).json({
                message:"Email already exists"
            })
        }
        const phoneExists=await User.findOne({phone})
        if(phoneExists){
            return res.status(400).json({
                message:"Phone already exists"
            })
        }
        const hashedpassword=await bcrypt.hash(password,10)
        const user=await User.create({
            name,
            email,
            age,
            phone,
            role,
            username:phone,
            password:hashedpassword
        })

        const respsoneuser=await User.findById(user._id).select("-password")
        res.status(201).json({
            message:"User Created",
            data:respsoneuser
        })

    }catch(err){
        return next(err)
    }
}

export const updateuser=async(req,res,next)=>{
    try{
        const {id}=req.params;
        const {name,email,age,phone,role}=req.body
        const emailexists=await User.findOne({email, _id:{$ne:id}})
        if(emailexists){
            return res.status(400).json({
                message:"Email already exists"
            })
        }
        const phoneExists=await User.findOne({phone,_id:{$ne:id}})
        if(phoneExists){
            return res.status(400).json({
                message:"Phone already exists"
            })
        }
        const updateuser= await User.findByIdAndUpdate(
            id,{
                name,
                email,
                phone,
                age,
                role
            },{
                new:true
            }
        ).select("-password")

        res.status(200).json({
            message:"User Updated",
            data:updateuser
        })
    }catch(err){
        return next(err)
    }
}

export const deleteuser=async(req,res,next)=>{
    try{
        const {id}=req.params

        await User.findByIdAndDelete(id)
        return res.status(200).json({
            message:"User Deleted"
        })
    }catch(err){
        return next(err)
    }
}


export const getmyprofile=async(req,res,next)=>{
    try{
        const user=await User.findById(req.user.id).select("-password")
        return res.status(200).json({
            message:user
        })
    }catch(err){
        return next(err)
    }
}


export const getalluser=async(req,res,next)=>{
   try{
    const users=await User.find().select("-password")
    res.status(200).json({
        data:users
    })
   }catch(err){
    return next(err)
   }
}

export const getuserbyid=async(req,res,next)=>{
    try{
        const  {id}=req.params
        const user=await User.findById(id).select("-password")
        if(!user){
           const error=new Error('User not found')
           error.statuscode=404

           return next(error)
        }
        return res.status(200).json({
            data:user
        })
    }catch(err){
        return next(err)
    }
}
import User from "../model/user.model.js"
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import AppError from "../utils/AppError.js";

export const createuser=async(req,res,next)=>{
    try{
        const {name,email,age,phone,password,role}=req.body

       
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
    const page=Number(req.query.page) || 1
    const limit=Number(req.query.limit) || 10
    const skip= (page - 1) * limit;

    const users=await User.find().select("-password").skip(skip).limit(limit)
    const totalusers=await User.countDocuments()
    const totalpages=Math.ceil(totalusers / limit)
    res.status(200).json({
        success:true,
        data:users,
        pagination:{
            totalusers,
            currentpage:page,
            totalpages,
            limit,
            hasNextPage:page < totalpages,
            hasPreviousPage:page > 1
        }
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
           return next(new AppError('user not found',404))
        }
        return res.status(200).json({
            data:user
        })
    }catch(err){
        return next(err)
    }
}
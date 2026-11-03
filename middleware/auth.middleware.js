
import jwt from "jsonwebtoken";
import { ACCESS_SECRET } from "../config/constants.js";


export const authmiddle=async(req,res,next)=>{
    try{
        const accessToken=req.cookies.accessToken
        if(!accessToken){
            return res.status(401).json({
                message:'Refresh Token Required'
            })
        }
        const decoded=jwt.verify(accessToken,ACCESS_SECRET)
        req.user=decoded
        next()
    }catch(err){
        return res.status(401).json({
            message:"Acces Token Expired"
        })
    }
}

export const authorize=(...roles)=>{
    return(req,res,next)=>{
        if(!roles.includes(req.user.role)){
            return res.status(403).json({
                message:"Access Denied"
            })
        }

        next()
    }
}
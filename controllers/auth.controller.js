import User from "../model/user.model.js"
import bcrypt from "bcryptjs";
import jwt, { decode } from "jsonwebtoken";
import { ACCESS_SECRET, REFRESH_SECRET } from "../config/constants.js";


export const login=async(req,res)=>{
    try{
        const {email,password}=req.body

        if(!email || !password){
            return res.status(400).json({
                message:'Email and Password is required'
            })
        }

        const user=await User.findOne({email})

        if(!user){
            return res.status(404).json({
                message:'Email does not exist'
            })
        }
        const match= await bcrypt.compare(password,user.password)

        if(!match){
            return res.status(400).json({
                message:'Invalid Password'
            })
        }

        const accessToken=jwt.sign({
            id:user._id,
            role:user.role
        },
        ACCESS_SECRET,
        {
            expiresIn:"2m"
        }
    )
    const refreshToken=jwt.sign({
        id:user._id,
    },
    REFRESH_SECRET,
    {expiresIn:'10m'}
)
res.cookie("accessToken",accessToken,{
    httpOnly:true,
    sameSite:"lax"
})
res.cookie("refreshToken",refreshToken,{
    httpOnly:true,
    sameSite:"lax"
})

res.status(200).json({
    message:'Login Successful',
    data:{
        id:user._id,
        name:user.name,
        role:user.role
    }
}
)
    }catch(error){
     res.status(500).json({
        message:error.message
     })
    }
}


export const refreshAcessToken=async(req,res)=>{
    try{
        const refreshToken=req.cookies.refreshToken

        if(!refreshToken){
            return res.status(401).json({
                message:'Refresh Token is missing'
            })
        }

        const decoded=jwt.verify(refreshToken,REFRESH_SECRET)
        const user=await User.findById(decoded.id)
        const newAcessToken=jwt.sign({
            id:decoded.id,
            role:user.role
        },
        ACCESS_SECRET,
        {expiresIn:"2m"}
      )
      const newRefreshToken=jwt.sign({
        id:decoded.id
      },
      REFRESH_SECRET,
      {expiresIn:"10m"}
    )

    res.cookie("accessToken",newAcessToken,
        {
            httpOnly:true,
            sameSite:"lax"
        }
    )
    res.cookie("refreshToken",newRefreshToken,
        {
            httpOnly:true,
            sameSite:"lax"
        }
    )
    res.status(200).json({
        message:"Token Attached"
    })
    }catch(err){
        res.status(401).json({
            message:"Refresh Token is expired"
        })
    }
}

export const logout=async(req,res)=>{

    res.clearCookie("accessToken")
    res.clearCookie("refreshToken")

    res.status(200).json({
        message:"Logout Sucessful"
    })
}

export const resetPassword=async(req,res)=>{
    try{
        const {oldPassword,newPassword}=req.body

        if(!oldPassword || !newPassword){
            return res.status(400).json({
                message:'Old password and new password are required'
            })
        }

        const user=await User.findById(req.user.id)

        const match=await bcrypt.compare(oldPassword,user.password)

        if(!match){
            return res.status(400).json({
                message:'Old password is incorrect'
            })
        }

        user.password=await bcrypt.hash(newPassword,10)
        await user.save()

        res.status(200).json({
            message:'Password changed successfully'
        })

    }catch(error){
        res.status(500).json({
            message:error.message
        })
    }
}

export const forgotPassword=async(req,res)=>{
    try{
        const {email,newPassword}=req.body

        if(!email || !newPassword){
            return res.status(400).json({
                message:'Email and new password are required'
            })
        }

        const user=await User.findOne({email})

        if(!user){
            return res.status(404).json({
                message:'No account found with this email'
            })
        }

        user.password = await bcrypt.hash(newPassword, 10)
        await user.save()

        res.status(200).json({
            message:'Password reset successful'
        })

    }catch(error){
        res.status(500).json({
            message:error.message
        })
    }
}
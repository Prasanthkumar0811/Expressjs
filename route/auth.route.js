import express from "express"
import { login, logout, refreshAcessToken, forgotPassword, resetPassword } from "../controllers/auth.controller.js"
import { authmiddle } from "../middleware/auth.middleware.js"

const router=express.Router()

router.post('/login',login)

router.post('/refreshtoken-api',refreshAcessToken)

router.post('/logout',logout)

router.post('/forgot-password',forgotPassword)

router.post('/reset-password',authmiddle,resetPassword)

export default router
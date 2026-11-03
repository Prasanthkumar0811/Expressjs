import express from "express"
import { authmiddle, authorize } from "../middleware/auth.middleware.js"
import { createuser, deleteuser, getalluser, getmyprofile, getuserbyid, updateuser } from "../controllers/user.controller.js"

const userouter=express.Router()
userouter.use(authmiddle)

userouter.get("/", authorize("admin","manager"),getalluser)

userouter.get("/profile",getmyprofile)

userouter.get("/getbyid/:id",authorize("admin","manager"),getuserbyid)

userouter.post("/create",authorize("admin"),createuser)

userouter.put("/update/:id",authorize("admin"),updateuser)

userouter.delete("/delete/:id",authorize("admin"),deleteuser)


export default userouter
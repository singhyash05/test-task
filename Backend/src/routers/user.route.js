import { Router } from "express";
import {verifyTokens} from '../middlewares/auth.middleware.js'
import {registerUser,loginUser} from '../controllers/user.controller.js'
const userRouter = Router()

//login
userRouter.route('/login').post(loginUser)
//register
userRouter.route('/register').post(registerUser)
//logout
userRouter.route("/logout").get(verifyTokens)
//profile
// userRouter.route("/profile").get(verifyTokens)


export default userRouter
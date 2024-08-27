import jwt from 'jsonwebtoken'
import {asyncHandler} from '../utils/asyncHandler.js'
import {User} from '../models/user.model.js'
import ApiError from '../utils/apiError.js'

const options = {
    httpOnly: true,
    secure : true
}

export const verifyTokens = asyncHandler(async(req,res,next)=>{
    const token = req.cookies?.token;
    if (!token) {
        throw new ApiError(401, "Token Not Found, Please Login");
    }
    try {
        const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
        const user = await User.findById(decodedToken._id).select("-password -token");

        if (!user) {
            throw new ApiError(401, "User Not Found, Please Login");
        }
        req.user = user;
        next();
    } catch (err) {
        console.log('error in authorization verify jwt token : ',err )
    }
})

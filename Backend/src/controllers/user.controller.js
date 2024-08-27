import {asyncHandler} from '../utils/asyncHandler.js'
import {User} from "../models/user.model.js"
import ApiResponse from "../utils/apiResponse.js"
import ApiError from "../utils/apiError.js" 
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'

const options = {
    httpOnly: true,
    secure:true,
}

const generateToken = async function(data){

    const email = data.email
    const id = data._id

    try {
        const token = jwt.sign(
            {
                email,
                id
            },
            process.env.TOKEN_SECRET,
            {
                expiresIn:process.env.TOKEN_EXPIRY
            }
        )
        return token
    } catch (error) {
        console.log('error in generating tokens : ',error)
    }
}


const registerUser = asyncHandler(async(req,res)=>{
    
    const {email,password} = req.body

    if(!((email?.trim())||(password?.trim()))){
        throw new ApiError(400,"Fill the Required Details")
    }

    const existedUser = await User.findOne({
            $or:[
                {email}
            ]
    })

    if(existedUser){
        throw new ApiError(404,"User Already Exist")
    }

    const hashedPassword = await bcrypt.hash(password,10)

    const user = await User.create(
        {
            email:email,
            password:hashedPassword
        }
    )
    
    const createdUser = await User.findOne(
        {
            _id:user._id
        }
    ).select('-password -refreshToken')

    if(!createdUser){
        throw new ApiError(500,"Some issue in creating user from Server Side")
    }

    if(createdUser){
        console.log("user created successfully")   
    }

    //clearing any existing cookies 
    res.clearCookie('token', options);

    //Setting cookies in response
    res
    .status(200)
    .json(
        new ApiResponse(200,createdUser,"User Created Successfully")
    )
})

const loginUser = asyncHandler(async(req,res)=>{
    res.clearCookie('token',options)
    
    const {email,password} = req.body

    const user = await User.findOne({email:email})

    if(!user){
        throw new ApiError(400,"User doesn't exist")
    }

    let isPassValid

    isPassValid = await bcrypt.compare(password,user.password)

    if(!isPassValid){
        throw new ApiError(400,"incorrect details")
    }
    
    const token = await generateToken(user)

    user.token = token

    await user.save()    
    
    res
    .cookie("token",token,options)
    .status(200)
    .json(
        new ApiResponse(200,"User Logged In Successfully")
    )

})

const logout = asyncHandler(async(req,res)=>{
    await User.findByIdAndUpdate(req.user._id,{
        $set:{
            refreshToken : undefined
        }
    },{new:true})

    res
    .status(200)
    .clearCookie("token",options)
    .json(
        new ApiResponse(200,"User logged Out Successfully")
    )

    console.log("logged out succesfully")

})

// const getCrittersHeHave = asyncHandler(async (req,res)=>{
//     const userId = req.body._id

//     const crittersHaveByUserId = await Critter.aggregate([
//     {
//         $match: {
//             master:userId //Match all field in Critter Database whose master is userId
//         },
        
//     },
//     {
//         $project:{
//             name: 1,
//             tokenId: 1,
//             nickname: 1
//         }
//     }
//     ])

//     res
//     .status(200)
//     .json(
//          new ApiResponse(200,crittersHaveByUserId,"Critters User Has Successfully Retrieved")
//     )
// }) 

// const userProfile = asyncHandler(async(req,res)=>{
//     try {
//         const user = await User.findById(req.user._id).select("-password -refreshToken")
//         if(!user){
//             throw new ApiError(500,"couldn't find user")
//         }
//         res
//         .status(200)
//         .json(user)
//     } catch (error) {
//         throw new ApiError(500,"couldn't find user")
//     }
// })

// const addEXP = asyncHandler(async(req,res)=>{

//     const {EXP} = req.body

//     if (!EXP || isNaN(EXP)) {
//         throw new ApiError(400, 'Invalid EXP points');
//     }

//     console.log(EXP)

//     const user = req.user._id

//     const player = await User.findById(user)

//     if (!player) {
//         throw new ApiError(404, 'User not found');
//     }

//     player.EXP = player.EXP + EXP

//     await player.save()

//     console.log("new exp added : ",player.username,player.EXP)
    
//     res
//     .status(201)
//     .json(
//          new ApiResponse(201,"Added EXP points to player")
//     )
// })

// const leaderboard = asyncHandler(async(req,res)=>{
//     try {
//         const topPlayers = await User.find().sort({ EXP: -1 }).limit(40).select('-password -refreshToken -walletAddress -gotHisPartner -battlesLost -battlesWon -createdAt -updatedAt -__v');;
//         console.log(topPlayers)
//         res
//         .status(201)
//         .json(
//             topPlayers
//         )
//     } catch (error) {
//         console.log("cant fetch leaderboard data",error)
//     }
// })

export {
    registerUser,
    loginUser,
    logout
}
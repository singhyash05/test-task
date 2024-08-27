import mongoose from 'mongoose'
import bcrypt from 'bcrypt'

const userSchema = new mongoose.Schema({
    email :{
        type:String,
        required : true
    },
    password:{
        type:String,
        required:true,
    },
    token:{
        type : String,
        default : ''
    }
},{timestamps:true})

userSchema.pre("save",async function(next){
    //if password hasnt been modified
    if(!this.isModified("password")) return next();
    this.password = bcrypt.hash(this.password,10)
})



export const User = mongoose.model('user',userSchema)
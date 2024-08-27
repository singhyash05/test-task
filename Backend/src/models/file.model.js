import mongoose from 'mongoose'

const fileSchema = new mongoose.Schema({
    fileLink : {
        type: String,
        required:true
    },
    fileName : {
        type: String
    },
    fileOwner:{
        type: mongoose.Schema.Types.ObjectId,
        ref:"User"
    }
},{timestamps:true})

export const File = mongoose.model('file',fileSchema)
import mongoose from 'mongoose'

const fileSchema = new mongoose.Schema({
    fileLink : {
        type: String,
        required:true
    },
    fileName : {
        type: String
    }
},{timestamps:true})

export const File = mongoose.model('file',fileSchema)
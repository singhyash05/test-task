import mongoose from 'mongoose'

async function connectDB(){
    try {
        await mongoose.connect(`${process.env.MONGODB_URI}/NDAGenerator`)
        console.log(`/n Database Connected!!`)
    } catch (error) {
        console.log(" /n MongoDB connection error" , error)
    }
}

export {connectDB}
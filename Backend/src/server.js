import dotenv from 'dotenv' 
import { connectDB } from './database/connectDB.js'
import { app } from './app.js'

    
dotenv.config({
    path: "../.env"
})

//When server starts first connects Database
//If done then app listens on PORT 

connectDB()
.then(()=>{
    app.listen(process.env.PORT,()=>console.log(`App listening on PORT : ${process.env.PORT}`))
})
.catch((err)=>{
    console.log("Port Connection Failed",err)
})
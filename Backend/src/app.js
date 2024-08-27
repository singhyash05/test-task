import express from 'express'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import htmlPdf from 'html-pdf'
import path from 'path'
import { fileURLToPath } from 'url';

const app = express()

app.use(cors({
    origin: 'http://localhost:5174', 
    credentials: true,
})); 

const __filename = fileURLToPath(import.meta.url);
console.log(import.meta.url); 
console.log( __filename)

const __dirname = path.dirname(__filename);
console.log(__dirname)

app.use(express.json({limit:'16kb'}))
app.use(express.urlencoded({extended:true,limit:'16kb'}))
app.use(express.static('public'))
app.use(cookieParser())

//Routes import
import userRouter from '../src/routers/user.route.js'

// //Routes Declaration
app.use("/api/v1/user",userRouter)
console.log(path.join(__dirname, 'temp', `\NDA_${Date.now()}.pdf`))

app.post('/generate-pdf', (req, res) => {
    const { htmlContent } = req.body;

    console.log("html to pdf")
    
    const pdfOptions = {
        format: 'A4',
        border: {
            top: '10mm',
            right: '10mm',
            bottom: '10mm',
            left: '10mm',
        },
    };

    const filePath = path.join(__dirname, 'temp', `\NDA_${Date.now()}.pdf`);
    

    htmlPdf.create(htmlContent, pdfOptions).toFile(filePath, (err, result) => {
        if (err) {
            return res.status(500).send(err);
        }
        res.send({ filePath: result.filename });
    });
});

export {app}
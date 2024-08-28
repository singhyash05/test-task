import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import htmlPdf from 'html-pdf';
import path from 'path';
import { fileURLToPath } from 'url';
import { uploadOnCloudinary } from './utils/uploadOnCloudinary.js';
import { uploadOnFirebase } from './utils/uploadOnFirebase.js';
import fs from 'fs'
import { sendMessage } from './utils/twilioSendMessage.js';

const app = express();

app.use(cors({
    origin: 'http://localhost:5174',
    credentials: true,
}));

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(express.json({ limit: '16kb' }));
app.use(express.urlencoded({ extended: true, limit: '16kb' }));
app.use(express.static('public'));
app.use(cookieParser());

// Routes import
import userRouter from '../src/routers/user.route.js';

// Routes Declaration
app.use("/api/v1/user", userRouter);

// PDF generation and upload route
// app.post('/generate-pdf', async (req, res) => {
//     const { htmlContent } = req.body;

//     console.log("Generating PDF...");

//     const pdfOptions = {
//         format: 'A4',
//         border: {
//             top: '10mm',
//             right: '10mm',
//             bottom: '10mm',
//             left: '10mm',
//         },
//     };

//     const filePath = path.join(__dirname, 'temp', `NDA_${Date.now()}.pdf`);

//     try {
//         // Create the PDF file
//         const result = await new Promise((resolve, reject) => {
//             htmlPdf.create(htmlContent, pdfOptions).toFile(filePath, (err, result) => {
//                 if (err) return reject(err);
//                 resolve(result);
//             });
//         });

//         const pdfUrl = await uploadOnFirebase(filePath, `NDA_${Date.now()}.pdf`);
//         console.log('PDF uploaded to Firebase:', pdfUrl);

//         res.send({pdfUrl})

//         // Upload the PDF to Cloudinary
//         // const pdfUrl = await uploadOnCloudinary(filePath);
//         // console.log('PDF uploaded to Cloudinary:', pdfUrl);
//         // res.send({ pdfUrl });

//         // fs.unlinkSync(filePath); //delete from temp

//         // Respond with the Cloudinary URL
//         // res.send({ pdfUrl });
//     } catch (error) {
//         res.status(500).send('Error generating PDF or uploading');
//     }
// });


app.post('/generate-pdf', async (req, res) => {
    const { htmlContent } = req.body;

    console.log("Generating PDF...");

    const pdfOptions = {
        format: 'A4',
        border: {
            top: '10mm',
            right: '10mm',
            bottom: '10mm',
            left: '10mm',
        },
    };

    const filePath = path.join(__dirname, 'temp', `NDA_${Date.now()}.pdf`);

    try {
        // Create the PDF file
        await new Promise((resolve, reject) => {
            htmlPdf.create(htmlContent, pdfOptions).toFile(filePath, (err, result) => {
                if (err) return reject(err);
                resolve(result);
            });
        });

        // Upload the PDF to Firebase
        const pdfUrl = await uploadOnFirebase(filePath);
        console.log('PDF uploaded to Firebase:', pdfUrl);

        // Delete the local temporary file
        await fs.promises.unlink(filePath);
        console.log('Temporary file deleted:', filePath);

        // Respond with the Firebase URL
        res.send({ pdfUrl });

    } catch (error) {
        console.error('Error generating PDF or uploading:', error);
        res.status(500).send('Error generating PDF or uploading');
    }
});

app.post('/send-whatsapp', async (req, res) => {
    const { phoneNumber, pdfUrl } = req.body;

    if (!phoneNumber || !pdfUrl) {
        return res.status(400).send('Phone number and PDF URL are required.');
    }

    try {
        // Send the WhatsApp message
        const messageSid = await sendMessage(phoneNumber, `Here is your PDF: ${pdfUrl}`);
        res.send({ messageSid }); // Respond with the message SID

    } catch (error) {
        console.error('Failed to send WhatsApp message:', error);
        res.status(500).send('Error sending WhatsApp message.');
    }
});

export { app };

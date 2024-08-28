// Import necessary functions from the Firebase SDK
import { initializeApp } from "firebase/app";
import { getStorage, ref, uploadBytes,getDownloadURL } from "firebase/storage";
import fs from 'fs'
import path from 'path'

// Firebase configuration object
const firebaseConfig = {
  apiKey: process.env.FIREBASE_API_KEY,
  authDomain: process.env.FIREBASE_authDomain,
  projectId: process.env.FIREBASE_projectId,
  storageBucket: process.env.FIREBASE_storageBucket,
  messagingSenderId: process.env.FIREBASE_messagingSenderId,
  appId: process.env.FIREBASE_appId
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const storage = getStorage(app);

// Function to upload a file to Firebase Storage
export const uploadOnFirebase = async function uploadFile(filePath) {
    try {
        // Read file as a buffer
        const file = await fs.promises.readFile(filePath);
        const fileName = path.basename(filePath); // Extract the file name from filePath
        const storageRef = ref(storage, `${Date.now()}_${fileName}`);

        const metadata = {
            contentType: 'application/pdf'
        };

        // Upload the file
        const snapshot = await uploadBytes(storageRef, file,metadata);
        console.log('Uploaded a file:', snapshot);

        // Get the download URL
        const downloadURL = await getDownloadURL(snapshot.ref);

        return downloadURL; // Return the download URL

    } catch (error) {
        console.error('Upload failed:', error);
        throw error; // Rethrow the error to handle it where the function is called
    }
};



import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Groq from "groq-sdk";
import { knowledgeBase } from './knowledgeBase';
import whatsappQRTwilio from '../src/components/whatsappQRTwilio.png'

const apiKey  = import.meta.env.VITE_API_KEY_GROQ;

const Chatbot = () => {
    const [messages, setMessages] = useState([{ text: 'Hello! How can I assist you today?', sender: 'bot' }]);
    const [input, setInput] = useState('');
    const [finalNDA, setFinalNDA] = useState('');
    const [pdfLink,setPdfLink] = useState(null)
    const [phoneNumber, setPhoneNumber] = useState('');
    const [isButtonDisabled, setIsButtonDisabled] = useState(true);

    const groq = new Groq({ apiKey: `${apiKey}`, dangerouslyAllowBrowser: true });

    const handleSend = async () => {
        const newMessage = { text: input, sender: 'user' };
        setMessages([...messages, newMessage]);
        setInput('');

        const chatCompletion = await simulateGROQResponse(input);
        const response = chatCompletion.choices[0]?.message?.content || "";
        console.log('Bot Response:', response);

        const ndaStartIndex = response.indexOf('NON-DISCLOSURE AGREEMENT');
        if (ndaStartIndex !== -1) {
            const ndaContent = response.substring(ndaStartIndex);
            setFinalNDA(ndaContent);
        }

        setMessages([...messages, newMessage, { text: response, sender: 'bot' }]);
    };

    useEffect(() => {
        if (finalNDA !== '') {
            console.log('final nda:', finalNDA);
        }   
    }, [finalNDA]);

    const simulateGROQResponse = async (input) => {
        return groq.chat.completions.create({
            messages: [
                {
                    role: 'system',
                    content: `You are an AI assistant designed to help users create Non-Disclosure Agreements (NDAs). Follow these instructions:`
                },
                ...knowledgeBase,
                ...messages.map(msg => ({
                    role: msg.sender === 'user' ? 'user' : 'assistant',
                    content: msg.text
                })),
                {
                    role: "user",
                    content: `${input}`,
                },
            ],
            model: "llama3-8b-8192",
        });
    };

    const handleGeneratePDF = async () => {
        try {
            // console.log(1)
            const pdfURL = await axios.post('http://localhost:5000/generate-pdf', {
                htmlContent: finalNDA,
            });
            // console.log(2)
            console.log('pdf url: ',pdfURL.data.pdfUrl)            
            setPdfLink(pdfURL.data.pdfUrl)
        } catch (error) {
            console.error('Error generating PDF:', error);
        }
    };

    const handleSendWhatsApp = async () => {
        if (phoneNumber.length === 10) {
            try {
                await axios.post('http://localhost:5000/send-whatsapp', {
                    phoneNumber: `${phoneNumber}`, 
                    pdfUrl: pdfLink,
                });
                alert('PDF link sent via WhatsApp!');
            } catch (error) {
                console.error('Error sending WhatsApp message:', error);
            }
        } else {
            alert('Please enter a valid 10-digit phone number.');
        }
    };
    

    return (
        <div className="flex flex-col items-center justify-center min-h-screen p-6 bg-gray-100">
            <h1 className="text-2xl font-bold mb-6">NDA Generator</h1>
            <div className="max-w-7xl w-11/12 bg-white rounded-lg shadow-lg p-6">
                <div className="chat-messages overflow-y-scroll h-64 mb-4">
                    {messages.map((msg, index) => (
                        <div key={index} className={`mb-4 text-${msg.sender === 'bot' ? 'left' : 'right'}`}>
                            <span 
                                className={`block p-2 rounded-lg ${msg.sender === 'bot' ? 'text-black' : 'text-gray-800'}`}
                                dangerouslySetInnerHTML={{ __html: msg.text }} 
                            />
                        </div>
                    ))}
                </div>

                <div className="flex">
                    <input
                        type="text"
                        className="flex-grow p-2 border border-gray-300 rounded-l-lg"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        placeholder="Type your message..."
                        onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                                handleSend();
                            }
                        }}
                    />
                    <button
                        className="p-2 bg-blue-500 text-white rounded-r-lg"
                        onClick={handleSend}
                    >
                        Send
                    </button>
                </div>

                {finalNDA && (
                    <div className="mt-4">
                        <button
                            className="p-2 bg-green-500 text-white rounded-lg"
                            onClick={handleGeneratePDF}
                        >
                            Generate PDF
                        </button>

                        <h2> Before Clicking on Generate PDF , when you review your NDA enter : 'in HTML' then generate</h2>
                    </div>
                )}
            </div>
            {pdfLink && (
                <div className="mt-4">
                    <img 
                src={whatsappQRTwilio} 
                alt="WhatsApp QR Code for Twilio"
                style={{ width: '200px', height: '200px' }} // Optional styling
                />
                    <br></br>
                    <h2>To send through whatsapp scan this qr</h2>
                    <div></div>
                    <input
                        type="text"
                        className="flex-grow p-2 border border-gray-300 rounded-l-lg"
                        value={phoneNumber}
                        onChange={(e) => {
                            const value = e.target.value;
                            setPhoneNumber(value);
                            setIsButtonDisabled(value.length !== 10);
                        }}
                        placeholder="Enter 10-digit phone number..."
                        maxLength="10" // Limits input to 10 digits
                    />
                    <button
                        className={`p-2 mt-2 ${isButtonDisabled ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-500'} text-white rounded-lg`}
                        onClick={handleSendWhatsApp}
                        disabled={isButtonDisabled}
                    >
                        Send PDF via WhatsApp
                    </button>
                </div>
            )}
    </div>
    );
};

export default Chatbot;

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Document, Page, Text, View } from '@react-pdf/renderer';
import Groq from "groq-sdk";
import { knowledgeBase } from './knowledgeBase';
import parse from 'html-react-parser'; 

const apiKey  = import.meta.env.VITE_API_KEY_GROQ;

const Chatbot = () => {
    const [messages, setMessages] = useState([{ text: 'Hello! How can I assist you today?', sender: 'bot' }]);
    const [input, setInput] = useState('');
    const [finalNDA, setFinalNDA] = useState('');

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
            const response = await axios.post('http://localhost:5000/generate-pdf', {
                htmlContent: finalNDA,
            });

            console.log('PDF saved at:', response.data.filePath);
        } catch (error) {
            console.error('Error generating PDF:', error);
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
                    </div>
                )}
            </div>
        </div>
    );
};

export default Chatbot;

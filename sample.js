const mongoose = require('mongoose');
const Chat = require('./models/chat.js');

// Function to connect to the database
async function connectToDatabase(DB_URI) {
    try {
        await mongoose.connect(DB_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log('Connected to MongoDB');
    } catch (error) {
        console.error('Error connecting to MongoDB:', error);
    }
}

// Function to save chat to the database
async function saveChat(chat) {
    try {
        await chat.save();
        console.log('Chat saved successfully');
    } catch (error) {
        console.error('Error saving chat:', error);
    }
}

// Sample data
const sampleData = [
    { from: "user1", to: "user2", msg: "hi", created_at: new Date() },
    { from: "user3", to: "user4", msg: "How are you?", created_at: new Date() },
    { from: "user5", to: "user6", msg: "Nice to meet you!", created_at: new Date() },
    // Add more sample data here
];

// Connect to the database
const DB_URI = process.env.DB_URI || 'mongodb://127.0.0.1:27017/chat-app';
connectToDatabase(DB_URI)
    .then(async () => {
        // Save each chat object from the sample data
        for (let chatData of sampleData) {
            const chat = new Chat(chatData);
            await saveChat(chat);
        }
        mongoose.disconnect(); // Disconnect from the database after adding sample data
    })
    .catch(error => {
        console.error('Error adding sample data:', error);
    });

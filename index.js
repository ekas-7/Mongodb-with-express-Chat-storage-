require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const app = express();
const PORT = process.env.PORT || 8080;
const DB_URI = process.env.DB_URI || 'mongodb://127.0.0.1:27017/chat-app';
const path = require("path");
const Chat=require("./models/chat.js");

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(express.static(path.join(__dirname,"public")));

// Function to connect to the database
async function connectToDatabase() {
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
async function saveChat(chat) {
    try {
      await chat.save();
      console.log('Chat saved successfully');
    } catch (error) {
      console.error('Error saving chat:', error);
    }
  }
  
  
let chat1= new Chat({
    from: "bho",
    to : "AM",
    msg:"hello",
    created_at: new Date(),
})

// Save chat1 to the database
// saveChat(chat1);
// Middleware to parse JSON
app.use(express.json());

// Connect to the database
connectToDatabase();

app.get("/chats",async (req,res)=>{
    let chats =await Chat.find();
    console.log(chats);
    res.render("index.ejs",{chats});
})

// Define a simple route
app.get('/', (req, res) => {
  res.send('Welcome to my website');
});

// 404 handler
app.use((req, res, next) => {
  res.status(404).send('Sorry, we could not find that!');
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

// Start the server
app.listen(PORT, () => {
  console.log(`App is listening on port http://localhost:${PORT}/`);
});

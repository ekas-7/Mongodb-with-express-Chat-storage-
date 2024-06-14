require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const methodOverride = require('method-override');
const Chat = require('./models/chat.js');

const app = express();
const PORT = process.env.PORT || 8080;
const DB_URI = process.env.DB_URI || 'mongodb://127.0.0.1:27017/chat-app';

// Set up view engine and static files
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(methodOverride('_method'));

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

// Function to save a chat to the database
async function saveChat(chat) {
  try {
    await chat.save();
    console.log('Chat saved successfully');
  } catch (error) {
    console.error('Error saving chat:', error);
  }
}

// Connect to the database
connectToDatabase();

// Route to display chats
app.get('/chats', async (req, res) => {
  try {
    let chats = await Chat.find();
    res.render('index', { chats });
  } catch (error) {
    console.error('Error fetching chats:', error);
    res.status(500).send('Internal Server Error');
  }
});

// Route to display the form for a new chat
app.get('/chats/new', (req, res) => {
  res.render('new');
});

// Route to handle form submissions for new chats
app.post('/chats', async (req, res) => {
  try {
    const { from, to, msg } = req.body;
    if (!from || !to || !msg) {
      throw new Error('All fields are required');
    }

    const newChat = new Chat({
      from: from,
      to: to,
      created_at: new Date(),
      msg: msg
    });

    await saveChat(newChat);
    res.redirect('/chats');
  } catch (error) {
    console.error('Error saving chat:', error);
    res.status(500).send('Internal Server Error');
  }
});

// Route to display the form for editing a chat
app.get('/chats/:id/edit', async (req, res) => {
  try {
    const { id } = req.params;
    const chat = await Chat.findById(id);

    if (!chat) {
      return res.status(404).send('Chat not found');
    }

    res.render('edit', { chat });
  } catch (error) {
    console.error('Error fetching chat for edit:', error);
    res.status(500).send('Internal Server Error');
  }
});

// Route to handle form submissions for editing a chat
app.post('/chats/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { from, to, msg } = req.body;

    if (!from || !to || !msg) {
      throw new Error('All fields are required');
    }

    await Chat.findByIdAndUpdate(id, {
      from: from,
      to: to,
      msg: msg,
      created_at: new Date(),
    });

    res.redirect('/chats');
  } catch (error) {
    console.error('Error updating chat:', error);
    res.status(500).send('Internal Server Error');
  }
});

// Route to handle deleting a chat
app.delete('/chats/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await Chat.findByIdAndDelete(id);
    res.redirect('/chats');
  } catch (error) {
    console.error('Error deleting chat:', error);
    res.status(500).send('Internal Server Error');
  }
});

// Simple welcome route
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

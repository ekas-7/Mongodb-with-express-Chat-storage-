const mongoose = require('mongoose');
const { Schema } = mongoose;

const chatSchema = new Schema({
    from: {
        type: String,
        required: true,
    },
    to: {
        type: String,
        required: true,
    },
    msg: {
        type: String,
        maxLength: 50
    },
    created_at: {
        type: Date,
        required: true,
        default: Date.now
    }
});

const Chat = mongoose.model('Chat', chatSchema);

module.exports = Chat;

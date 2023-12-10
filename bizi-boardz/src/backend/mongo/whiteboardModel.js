const mongoose = require('mongoose');

const whiteboardSchema = new mongoose.Schema({
    id: String,
    type: String,
    x1: Number,
    y1: Number,
    x2: Number,
    y2: Number,
    text: { type: String, default: "" }, // Optional field with default value
    roughElement: mongoose.Schema.Types.Mixed // Can be anything
}, { strict: false }); // 'strict: false' allows the schema to accept fields not defined in the schema

const WhiteboardModel = mongoose.model('Whiteboard', whiteboardSchema, 'BiziBoardz');

module.exports = WhiteboardModel;
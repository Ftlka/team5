const mongoose = require('../../libs/mongoose');
const Schema = mongoose.Schema;
const MetadataSchema = require('../schemas/metadata').schema;

const MessageSchema = new Schema({
    conversationId: { type: Schema.Types.ObjectId },
    type: { type: String, required: true },
    author: { type: String, required: true, ref: 'User' },
    date: { type: Date, default: Date.now },
    text: { type: String },
    imageUrl: { type: String },
    metadata: { type: MetadataSchema, ref: 'Metadata' },
    reactions: [{
        username: String,
        emoji: String
    }]
});

mongoose.model('Message', MessageSchema);
module.exports = mongoose.model('Message');

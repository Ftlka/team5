const TextMessage = require('../TextMessage');
const ImageMessage = require('../ImageMessage');
const metadataExtractor = require('../../../libs/urlMetadataExtractor');

const MessageTypes = require('./MessageTypes');

const SUPPORTED_TYPES = Object.keys(MessageTypes);

module.exports = class MessageFactory {
    static async create({ _id, conversationId, type, author, date, text = null, imageUrl = null }) {
        if (!SUPPORTED_TYPES.includes(type)) {
            throw new TypeError(`Supported types: ${SUPPORTED_TYPES.join(', ')}`);
        }

        if (type === MessageTypes.text) {
            const metadata = await metadataExtractor.extractFromText(text);

            return new TextMessage({ _id, conversationId, type, author, date, text, metadata });
        }

        if (type === MessageTypes.image) {
            return new ImageMessage({ _id, conversationId, type, author, date, imageUrl });
        }
    }
};

const MessageFactory = require('../models/Message/MessageFactory/MessageFactory');
const { sendMessageNotification,
    sendNewConversationNotification, sendNewUserNotification } = require('../libs/Notifications');
const Conversation = require('../models/schemas/conversation');

module.exports.configureIo = (io) => {
    io.on('connection', socket => {
        socket.on('message', async (data) => {
            const message = await MessageFactory.create(data);
            io.emit(`message_${data.conversationId}`, message);

            const conversation = await Conversation.findById(data.conversationId);
            sendMessageNotification(conversation, message);
        });

        socket.on('conversationNewUser', async (data) => {
            io.emit(`conversationNewUser_${data.conversation._id}`, data.conversation);
            socket.broadcast.emit(`conversationNewUser_${data.addedUser}`, data.conversation);

            const conversation = await Conversation.findById(data.conversation._id);
            sendNewUserNotification(conversation, data.addedUser);
        });

        socket.on('newConversation', (conversation) => {
            for (const user of conversation.users) {
                socket.broadcast.emit(`conversationNewUser_${user}`, conversation);
            }

            sendNewConversationNotification(conversation);
        });

        socket.on('updateMessage', (data) => {
            console.info('==========');
            console.info(data);
            // io.emit(`updateMessage_${data.conversationId}`, data);
            console.info(`updateMessage_${data._id}`);
            io.emit(`updateMessage_${data._id}`, data);
            console.info('==========');
        });
    });
};

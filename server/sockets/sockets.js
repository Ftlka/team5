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

        socket.on('conversationNewUser', (data) => {
            const conversation = data.conversation;
            io.emit(`conversationNewUser_${conversation._id}`, conversation);
            socket.broadcast.emit(`conversationNewUser_${data.addedUser}`, conversation);


            sendNewUserNotification(conversation, data.addedUser);
        });

        socket.on('newConversation', (conversation) => {
            for (const user of conversation.users) {
                socket.broadcast.emit(`conversationNewUser_${user}`, conversation);
            }

            sendNewConversationNotification(conversation);
        });
    });
};

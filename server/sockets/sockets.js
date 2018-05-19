const MessageFactory = require('../models/Message/MessageFactory/MessageFactory');
const MessageTypes = require('../models/Message/MessageFactory/MessageTypes');
const { sendNotifications, sendNotificationsToUsers } = require('../libs/Notifications');

module.exports.configureIo = (io) => {
    io.on('connection', socket => {
        socket.on('message', async (data) => {
            const message = await MessageFactory.create(data);
            io.emit(`message_${data.conversationId}`, message);

            if (message.type === MessageTypes.text) {
                sendNotifications(data.conversationId,
                    { title: 'Новое сообщение', body: `${message.author}: ${message.text}` });
            }

            if (message.type === MessageTypes.image) {
                sendNotifications(data.conversationId,
                    { title: 'Новое сообщение', body: `${message.author}: Отправил изображение` });
            }
        });

        socket.on('conversationNewUser', (data) => {
            const conversation = data.conversation;
            io.emit(`conversationNewUser_${conversation._id}`, conversation);
            socket.broadcast.emit(`conversationNewUser_${data.addedUser}`, conversation);

            console.info(data.conversation);

            if (conversation.isPrivate) {
                sendNotificationsToUsers([data.addedUser],
                    {
                        title: 'Новый приватный диалог',
                        body: `Участники: ${conversation.users.join(', ')}`
                    });
            } else {
                sendNotificationsToUsers([data.addedUser],
                    { title: 'Новый диалог', body: `Вас добавили в диалог ${conversation.title}` });
            }

            sendNotificationsToUsers(conversation.users.filter(user => user !== data.addedUser),
                {
                    title: 'Новый участник',
                    body: `Добавлен новый участник ${data.addedUser} в диалог ${conversation.title}`
                });
        });

        socket.on('newConversation', (conversation) => {
            for (const user of conversation.users) {
                socket.broadcast.emit(`conversationNewUser_${user}`, conversation);
            }

            if (conversation.isPrivate) {
                sendNotificationsToUsers(conversation.users,
                    {
                        title: 'Новый приватный диалог',
                        body: `Участники: ${conversation.users.join(', ')}`
                    });
            }
        });
    });
};



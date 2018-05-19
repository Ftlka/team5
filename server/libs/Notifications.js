const webpush = require('web-push');
const config = require('config');

const Subscription = require('../models/schemas/subscription');
const MessageTypes = require('../models/Message/MessageFactory/MessageTypes');

const { publicVapidKey, privateVapidKey } = config.get('GCM');

webpush.setVapidDetails(
    'mailto:test@test.com',
    publicVapidKey,
    privateVapidKey
);

module.exports.sendMessageNotification = async (conversation, message) => {
    if (conversation.isPrivate) {
        if (message.type === MessageTypes.text) {
            sendNotificationsToUsers(conversation.users,
                { title: message.author, body: message.text });
        }

        if (message.type === MessageTypes.image) {
            sendNotificationsToUsers(conversation.users,
                { title: message.author, body: 'Отправил изображение' });
        }

        return;
    }

    if (message.type === MessageTypes.text) {
        sendNotificationsToUsers(conversation.users,
            { title: conversation.title, body: `${message.author}: ${message.text}` });
    }

    if (message.type === MessageTypes.image) {
        sendNotificationsToUsers(conversation.users,
            { title: conversation.title, body: `${message.author}: отправил изображение` });
    }
};

module.exports.sendNewUserNotification = async (conversation, addedUser) => {
    if (conversation.isPrivate) {
        sendNotificationsToUsers([addedUser],
            {
                title: 'Новый приватный диалог',
                body: `Участники: ${conversation.users.join(', ')}`
            });
    } else {
        sendNotificationsToUsers([addedUser],
            { title: 'Новый диалог', body: `Вас добавили в диалог ${conversation.title}` });
    }

    sendNotificationsToUsers(conversation.users.filter(user => user !== addedUser),
        {
            title: 'Новый участник',
            body: `Добавлен новый участник ${addedUser} в диалог ${conversation.title}`
        });
};

module.exports.sendNewConversationNotification = async (conversation) => {
    if (conversation.isPrivate) {
        sendNotificationsToUsers(conversation.users,
            {
                title: 'Новый приватный диалог',
                body: `Участники: ${conversation.users.join(', ')}`
            });
    }
};

async function sendNotificationsToUsers(users, { title, body }) {
    const subscriptions = await Subscription.find({ username: users });

    subscriptions.forEach(subscription => {
        webpush.sendNotification(JSON.parse(subscription.subscription),
            JSON.stringify({ title, body }));
    });
}


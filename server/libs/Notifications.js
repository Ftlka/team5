const webpush = require('web-push');
const config = require('config');

const Conversation = require('../models/schemas/conversation');
const Subscription = require('../models/schemas/subscription');

const { publicVapidKey, privateVapidKey } = config.get('GCM');

webpush.setVapidDetails(
    'mailto:test@test.com',
    publicVapidKey,
    privateVapidKey
);

module.exports.sendNotifications = async (conversationId, { title, body }) => {
    const { users } = await Conversation.findById(conversationId);
    await module.exports.sendNotificationsToUsers(users, { title, body });
};

module.exports.sendNotificationsToUsers = async (users, { title, body }) => {
    const subscriptions = await Subscription.find({ username: users });

    subscriptions.forEach(subscription => {
        webpush.sendNotification(JSON.parse(subscription.subscription),
            JSON.stringify({ title, body }));
    });
};


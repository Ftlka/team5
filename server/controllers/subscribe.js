const Subscription = require('../models/schemas/subscription');

module.exports.subscribe = async (req, res) => {
    const subscription = JSON.stringify(req.body);
    const { username } = req.user;

    await Subscription.remove({ username });
    await Subscription.create({ username, subscription });

    res.sendStatus(201);
};

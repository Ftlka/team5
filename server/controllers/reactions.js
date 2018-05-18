const Message = require('../models/schemas/message');

module.exports.updateReactions = async (req, res) => {
    const { messageId, emoji } = req.body;
    const message = await Message.findOne({ _id: messageId });
    const username = req.user.username;
    let index = -1;
    if (message.reactions) {
        index = message.reactions
            .findIndex(r => r.username === username && r.emoji === emoji);
    } else {
        message.reactions = [];
    }

    if (index === -1) {
        message.reactions.push({ username, emoji });
    } else {
        message.reactions.splice(index, 1);
    }

    await message.save();
    res.sendStatus(200);
};

const Message = require('../models/schemas/message');

module.exports.updateReactions = async (req, res) => {
    try {
        const { messageId, emoji } = req.body;
        const message = await Message.findById(messageId);

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
    } catch (e) {
        console.error(e);
        res.sendStatus(500);
    }


};

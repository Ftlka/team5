const ErrorInfo = require('../models/errorInfo');
const Conversation = require('../models/schemas/conversation');
const User = require('../models/schemas/user');

module.exports.conversations = async (req, res) => {
    const conversations = await getAllConversations(req.user.username);
    res.json(conversations);
};

module.exports.getInfo = async (req, res) => {
    const conversation = await Conversation.findById(req.params.conversationId);
    res.json(conversation);
};

module.exports.create = async (req, res) => {
    const conversation = {
        title: req.params.title,
        users: req.body.users,
        isPrivate: req.body.isPrivate
    };

    const creationResult = await tryCreateConversation(conversation);
    if (creationResult.error) {
        return res.status(creationResult.error.status).json({ error: creationResult.error });
    }

    res.status(201).json(creationResult.conversation);
};

module.exports.tryCreateConversation = tryCreateConversation;

async function tryCreateConversation(conversation) {
    const users = await Promise.all(
        conversation.users.map(username => User.ensureExists(username)));
    if (users.some(user => user === null)) {
        return {
            conversation: null,
            error: new ErrorInfo(400, 'Пользователь не существует')
        };
    }
    const nonUniqueUser = getNonUniqueUser(conversation.users);
    if (nonUniqueUser) {
        return {
            conversation: null,
            error: new ErrorInfo(400,
                `Пользователь ${nonUniqueUser} встречается больше одного раза`)
        };
    }

    if (conversation.isPrivate) {
        const existingChat = await getPrivateChat(conversation.users);
        if (existingChat) {
            return {
                conversation: existingChat,
                error: new ErrorInfo(400, 'Такой диалог уже существует')
            };
        }
    }

    try {
        conversation = await Conversation.create(conversation);
    } catch (ex) {
        return {
            conversation: null,
            error: new ErrorInfo(500, 'Не удалось создать беседу')
        };
    }

    return { error: null, conversation };
}

function getNonUniqueUser(users) {
    const counting = users.reduce((a, b) =>
        Object.assign(a, { [b]: (a[b] || 0) + 1 }), {});
    for (let name in counting) {
        if (counting[name] > 1) {
            return name;
        }
    }
}

module.exports.addUser = async (req, res) => {
    const conversationId = req.params.conversationId;
    const { username } = req.body;
    const additionResult = await tryAddUserToConversation(username, conversationId);
    if (additionResult.error) {
        return res.status(additionResult.error.status).json({ error: additionResult.error });
    }
    res.status(201).json(additionResult.conversation);
};

module.exports.tryAddUserToConversation = tryAddUserToConversation;

async function tryAddUserToConversation(username, conversationId) {
    const user = await User.ensureExists(username);
    if (!user) {
        return {
            error: new ErrorInfo(404, `Пользователь ${username} не найден`)
        };
    }

    const conversation = await Conversation.findOne({ _id: conversationId });

    if (!conversation) {
        return {
            error: new ErrorInfo(404, `Диалог ${conversationId} не найден`)
        };
    }

    if (conversation.isPrivate) {
        return {
            error: new ErrorInfo(400, 'Невозможно добавить пользователя в приватный чат')
        };
    }

    if (conversation.users.includes(username)) {
        return {
            conversation,
            error: new ErrorInfo(400, `Пользователь ${username} уже существует в беседе`)
        };
    }

    conversation.users.push(username);
    try {
        await conversation.save();
    } catch (ex) {
        return {
            error: new Error(500, 'Не удалось обновить список пользователей в беседе')
        };
    }

    return { error: null, conversation, addedUser: username };
}

async function getAllConversations(username) {
    const conversations = await Conversation.find({ users: username });

    return conversations;
}

async function getPrivateChat(users) {
    return await Conversation.findOne({ isPrivate: true })
        .where('users').all(users);
}


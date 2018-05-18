var multer = require('multer');
var upload = multer();

const { contacts, add } = require('../controllers/contacts');
const { messages, save } = require('../controllers/messages');
const { conversations, create, addUser, getInfo } = require('../controllers/conversations');
const { user } = require('../controllers/users');
const { getRecentEmoji, updateRecentEmoji } = require('../controllers/emoji');
const { getImage, uploadImage } = require('../controllers/images');
const avatar = require('../controllers/avatar');
const { registerCall, getCalls, cancelCall } = require('../controllers/calls');
const { subscribe } = require('../controllers/subscribe');
const { updateReactions } = require('../controllers/reactions');
const hasNotSignedIn = require('../middlewares/has-not-signed-in');

module.exports = (server) => {
    server.use('/api/', hasNotSignedIn((req, res) => res.sendStatus(401)));

    server.route('/api/contacts').get(contacts);
    server.route('/api/contacts/:username').post(add);

    server.route('/api/conversations').get(conversations);
    server.route('/api/conversations/:title').post(create);
    server.route('/api/conversations/:conversationId')
        .patch(addUser)
        .get(getInfo);

    server.route('/api/messages/:conversationId')
        .get(messages)
        .post(save);

    server
        .get('/api/avatar/:id?', avatar);

    server.route('/api/users/:username').get(user);

    server.route('/api/images')
        .post(upload.single('image'), uploadImage);

    server.route('/api/images/:id').get(getImage);

    server.route('/api/emoji')
        .get(getRecentEmoji)
        .patch(updateRecentEmoji);

    server.route('/api/reactions')
        .patch(updateReactions);

    server.route('/api/calls')
        .post(registerCall)
        .get(getCalls)
        .patch(cancelCall);

    server.route('/api/subscribe')
        .post(subscribe);
};

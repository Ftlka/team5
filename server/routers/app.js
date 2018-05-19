const hasNotSignedIn = require('../middlewares/has-not-signed-in');
const { moveToPrivateChat, moveToGroupChat } = require('../controllers/invite');
const { getWorker } = require('../controllers/worker');

module.exports = (server, app) => {
    const render = pageName => (req, res) => app.render(req, res, `/${pageName}`);

    server
        .route('/')
        .get(
            hasNotSignedIn(render('signIn')),
            render('main')
        );

    server
        .route('/@:username')
        .get(
            hasNotSignedIn(render('signIn')),
            moveToPrivateChat,
            render('main')
        );

    server
        .route('/join/:conversationId')
        .get(
            hasNotSignedIn(render('signIn')),
            moveToGroupChat,
            render('main')
        );

    server
        .route('/worker.js')
        .get(
            hasNotSignedIn(render('signIn')),
            getWorker
        );

    server.get('*', app.getRequestHandler());

    server.all('*', (req, res) => res.sendStatus(404));
};

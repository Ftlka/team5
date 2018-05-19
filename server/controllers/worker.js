const path = require('path');

module.exports.getWorker = async (req, res) => {
    res.setHeader('content-type', 'text/javascript');
    res.sendFile('worker.js', { root: path.join(__dirname, '../../') });
};

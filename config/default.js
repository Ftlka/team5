require('dotenv').config();

module.exports = {
    githubCliendId: process.env.GITHUB_CLIENT_ID,
    gitHubClientSecret: process.env.GITHUB_CLIENT_SECRET,
    expressSessionSecret: process.env.EXPRESS_SESSION_SECRET,
    baseUrl: process.env.BASE_URL,
    imageCdnConfig: {
        cloudName: process.env.IMAGE_CDN_CLOUD_NAME,
        apiKey: process.env.IMAGE_CDN_API_KEY,
        apiSecret: process.env.IMAGE_CDN_API_SECRET
    },
    mongoDb: {
        uri: 'mongodb+srv://LOGIN:PASSWORD@messengerproductioncluster-ej5fo.mongodb.net/messenger',
        login: process.env.MONGODB_LOGIN,
        password: process.env.MONGODB_PASSWORD
    },
    caller: {
        accountSid: process.env.CALLER_ACCOUNT_SID,
        authToken: process.env.CALLER_AUTH_TOKEN,
        callerNumber: process.env.CALLER_NUMBER,
        twiml: process.env.CALLER_TWIML
    },
    GCM: {
        publicVapidKey: process.env.PUBLIC_VAPID_KEY,
        privateVapidKey: process.env.PRIVATE_VAPID_KEY
    }
};

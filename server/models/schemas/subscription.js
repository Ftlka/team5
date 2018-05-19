const mongoose = require('../../libs/mongoose');
const Schema = mongoose.Schema;

const SubscriptionSchema = new Schema({
    username: { type: String, required: true, unique: true },
    subscription: { type: String, required: true }
});

mongoose.model('Subscription', SubscriptionSchema);
module.exports = mongoose.model('Subscription');

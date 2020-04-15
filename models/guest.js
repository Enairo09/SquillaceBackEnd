const mongoose = require('mongoose');

const guestSchema = mongoose.Schema({
    firstname: String,
    lastname: String,
    address: String,
    optional: String,
    zipcode: Number,
    city: String,
    state: String,
    phone: String,
    newsletter: Boolean,
    email: String,
});

var guestModel = mongoose.model('guest', guestSchema);

module.exports = guestModel;
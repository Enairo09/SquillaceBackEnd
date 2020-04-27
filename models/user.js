const mongoose = require('mongoose');

const orderSchema = mongoose.Schema({
    orderID: { type: mongoose.Schema.Types.ObjectId, ref: 'orders' },
    status: Boolean
})

const userSchema = mongoose.Schema({
    firstname: String,
    lastname: String,
    address: String,
    optional: String,
    zipcode: Number,
    city: String,
    state: String,
    phone: Number,
    compagnyname: String,
    billingaddress: String,
    billingoptional: String,
    billingzipcode: Number,
    billingcity: String,
    billingstate: String,
    billingfirstname: String,
    billinglastname: String,
    newsletter: Boolean,
    email: String,
    password: String,
    token: String,
    salt: String,
    statut: String,
    gender: String,
    inscription: Date,
    birthday: Date,
    orders: [orderSchema],
    resetpasswordToken: String,
    resetpasswordExpires: Date,
});

var userModel = mongoose.model('users', userSchema);

module.exports = userModel;
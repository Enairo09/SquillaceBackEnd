const mongoose = require('mongoose');

const productSchema = mongoose.Schema({
    productID: { type: mongoose.Schema.Types.ObjectId, ref: 'products' },
    name: String,
    price: Number,
    type: String,
    img: String,
    quantity: Number,
    size: String
})

const orderSchema = mongoose.Schema({
    userID: { type: mongoose.Schema.Types.ObjectId, ref: 'users' },
    createdate: Date,
    validationdate: Date,
    productList: [productSchema],
    firstname: String,
    lastname: String,
    address: String,
    optional: String,
    zipcode: Number,
    city: String,
    state: String,
    contactphone: Number,
    compagnyname: String,
    billingaddress: String,
    billingoptional: String,
    billingzipcode: Number,
    billingcity: String,
    billingstate: String,
    billingfirstname: String,
    billinglastname: String,
    paymentvalid: Boolean,
    totalorder: Number
});

var orderModel = mongoose.model('orders', orderSchema);

module.exports = orderModel;
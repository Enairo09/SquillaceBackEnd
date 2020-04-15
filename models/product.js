const mongoose = require('mongoose');

const productSchema = mongoose.Schema({
    name: String,
    price: Number,
    type: String,
    img: String,
    enabled: Boolean
});

var productModel = mongoose.model('produits', productSchema);

module.exports = productModel;
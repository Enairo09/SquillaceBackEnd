const mongoose = require('mongoose');
const imgSchema = mongoose.Schema({
    ref: String
})
const productSchema = mongoose.Schema({
    name: String,
    price: Number,
    type: String,
    description: String,
    img: String,
    img: [imgSchema],
    enabled: Boolean
});

var productModel = mongoose.model('produits', productSchema);

module.exports = productModel;
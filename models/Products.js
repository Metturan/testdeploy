const mongoose = require('mongoose');
const {Schema} = mongoose;

const productSchema = new Schema({
  productId: {}
})

mongoose.model('products', productSchema)
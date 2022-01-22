const mongoose = require('mongoose');
const {Schema} = mongoose;

const cardProductSchema = new Schema({
  productId: {}
})

mongoose.model('cardProducts', cardProductSchema)
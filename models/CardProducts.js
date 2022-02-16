const mongoose = require('mongoose');
const {Schema} = mongoose;

const cardProductSchema = new Schema({
  productId: {},
  collectionTitle: {}
})

mongoose.model('cardProducts', cardProductSchema)
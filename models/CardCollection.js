const mongoose = require('mongoose');
const {Schema} = mongoose;

const cardCollectionSchema = new Schema({
  cardCollectionId: {},
  cardCollectionTitle: {}
})

mongoose.model('cardCollection', cardCollectionSchema)
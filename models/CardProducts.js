const mongoose = require('mongoose');
const {Schema} = mongoose;

const cardProductSchema = new Schema({
  cardList: {
    cardsId: {},
    collectionTitle: {}
  }
})

mongoose.model('cardProducts', cardProductSchema)
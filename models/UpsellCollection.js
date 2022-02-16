const mongoose = require('mongoose');
const {Schema} = mongoose;

const upsellCollectionSchema = new Schema({
  upsellCollectionId: {},
  upsellCollectionTitle: {}
})

mongoose.model('upsellCollection', upsellCollectionSchema)
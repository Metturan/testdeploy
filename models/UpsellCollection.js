const mongoose = require('mongoose');
const {Schema} = mongoose;

const upsellCollectionSchema = new Schema({
  upsellCollectionId: {}
})

mongoose.model('upsellCollection', upsellCollectionSchema)
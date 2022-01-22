const mongoose = require('mongoose');
const {Schema} = mongoose;

const postcodeSchema = new Schema({
  postcode: {},
  status: String
})

mongoose.model('postalcode', postcodeSchema)
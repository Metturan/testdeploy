const mongoose = require('mongoose');
const {Schema} = mongoose;

const deliveryOptionsSchema = new Schema({
  deliveryOptionsId: {}
})

mongoose.model('deliveryOptions', deliveryOptionsSchema)
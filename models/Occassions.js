const mongoose = require('mongoose');
const {Schema} = mongoose;

const occasionsSchema = new Schema({
  occasionsOptionsId: {}
})

mongoose.model('occasionOptions', occasionsSchema)
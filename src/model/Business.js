var mongoose = require('mongoose');

var businessSchema = mongoose.Schema({
  name: String,
  password: String,
  stripeAccount: String,
  phone: String,
  appFee: {type: Number, default: 0.135}
});

businessSchema.set('toJSON', {
  transform: function(doc, ret) {
    delete ret.password;
    return ret;
  }
});

module.exports = mongoose.model('Business', businessSchema);
const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  image: Buffer,
  name: {
    type: String,
    required: true,
    trim: true,
  },
  price: {
    type: Number,
    required: true,
  },
  discount: {
    type: Number,
    default: 0,
    min: 0,
    max: 100,
  },
  bgcolor: String,
  panelcolor: String,
  textcolor: String,
}, { timestamps: true });

module.exports = mongoose.model("Product", productSchema);

const mongoose = require('mongoose');

const ownerSchema = new mongoose.Schema({
  fullname: {
    type: String,
    minlength: 3,
    trim: true,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
    match: [/^\S+@\S+\.\S+$/, "Please enter a valid email address"],
  },
  password: {
    type: String,
    required: true,
  },
  products: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
    },
  ],
  picture: {
    type: String,
    default: "",
  },
  gstin: {
    type: String,
    default: "",
  },
}, { timestamps: true });

ownerSchema.methods.toJSON = function () {
  const owner = this.toObject();
  delete owner.password;
  return owner;
};

module.exports = mongoose.model("Owner", ownerSchema);

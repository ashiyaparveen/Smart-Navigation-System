const mongoose = require("mongoose");

const locationSchema = new mongoose.Schema({
  name: { type: String, required: true },
  lat: { type: Number, required: true },
  lng: { type: Number, required: true },
  category: { type: String },
  description: { type: String }
}, { timestamps: true });

module.exports = mongoose.model("Location", locationSchema);
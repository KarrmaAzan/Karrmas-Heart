const mongoose = require('mongoose');

const artistSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  bio: { type: String, required: true },
  image: { type: String, default: "/uploads/default-artist.jpg" }, // Artist Image
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Artist', artistSchema);

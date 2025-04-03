const mongoose = require('mongoose');

const musicSchema = new mongoose.Schema({
  title: { type: String, required: true },
  fileUrl: { type: String, required: true },
  duration: { type: Number, default: 0 },
  releaseDate: { type: Date, default: Date.now },
  playCount: { type: Number, default: 0 }, // Track play count
  artist: { type: mongoose.Schema.Types.ObjectId, ref: 'Artist', required: true } // Link to artist
});

// Add text index on title and description for full-text search
musicSchema.index({ title: 'text', description: 'text' });

module.exports = mongoose.model('Music', musicSchema);

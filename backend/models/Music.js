import mongoose from 'mongoose';

const musicSchema = new mongoose.Schema({
  title: { type: String, required: true },
  fileUrl: { type: String, required: true },
  duration: { type: Number, default: 0 },
  releaseDate: { type: Date, default: Date.now },
  playCount: { type: Number, default: 0 },
  artist: { type: mongoose.Schema.Types.ObjectId, ref: 'Artist', required: true },
  album: { type: mongoose.Schema.Types.ObjectId, ref: 'Album', default: null }
});

// Add text index on title and description for full-text search
musicSchema.index({ title: 'text', description: 'text' });

const Music = mongoose.model('Music', musicSchema);
export default Music;

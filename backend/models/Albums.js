import mongoose from 'mongoose';

const albumSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String },
  coverImage: { type: String, required: true }, // Will store Cloudinary URL or /uploads path
  releaseDate: { type: Date, default: Date.now },
  songs: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Music' }]
}, { timestamps: true });

const Album = mongoose.model('Album', albumSchema);
export default Album;

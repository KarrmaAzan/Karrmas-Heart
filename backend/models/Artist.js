import mongoose from 'mongoose';

const artistSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  bio: { type: String, required: true },
  image: { type: String, default: "/uploads/default-artist.jpg" },
  createdAt: { type: Date, default: Date.now }
});

const Artist = mongoose.model('Artist', artistSchema);
export default Artist;

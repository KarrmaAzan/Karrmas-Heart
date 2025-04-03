// controllers/playlistController.js
const Playlist = require('../models/Playlist');

exports.createPlaylist = async (req, res, next) => {
  const { name, description } = req.body;
  try {
    const playlist = await Playlist.create({
      name,
      description,
      user: req.user._id,
      tracks: []
    });
    res.status(201).json(playlist);
  } catch (error) {
    next(error);
  }
};

exports.addTrackToPlaylist = async (req, res, next) => {
  const { playlistId, trackId } = req.body;
  try {
    const playlist = await Playlist.findById(playlistId);
    if (!playlist) {
      res.status(404);
      throw new Error('Playlist not found');
    }
    // Optionally, check that the playlist belongs to req.user
    playlist.tracks.push(trackId);
    await playlist.save();
    res.json(playlist);
  } catch (error) {
    next(error);
  }
};

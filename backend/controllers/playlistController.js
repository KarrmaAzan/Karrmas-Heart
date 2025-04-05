import Playlist from '../models/Playlist.js';

export const createPlaylist = async (req, res, next) => {
  const { name, description } = req.body;
  try {
    const playlist = await Playlist.create({
      name,
      description,
      user: req.user._id,
      tracks: [],
    });
    res.status(201).json(playlist);
  } catch (error) {
    next(error);
  }
};

export const addTrackToPlaylist = async (req, res, next) => {
  const { playlistId, trackId } = req.body;
  try {
    const playlist = await Playlist.findById(playlistId);
    if (!playlist) {
      return res.status(404).json({ message: 'Playlist not found' });
    }
    playlist.tracks.push(trackId);
    await playlist.save();
    res.json(playlist);
  } catch (error) {
    next(error);
  }
};

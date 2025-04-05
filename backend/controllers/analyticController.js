import Music from '../models/Music.js';

export const trackPlayback = async (req, res, next) => {
  const { id } = req.params;
  try {
    const music = await Music.findByIdAndUpdate(id, { $inc: { playCount: 1 } }, { new: true });
    res.json({ playCount: music.playCount });
  } catch (error) {
    next(error);
  }
};

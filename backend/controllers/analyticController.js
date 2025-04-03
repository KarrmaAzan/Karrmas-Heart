// controllers/analyticsController.js
const Music = require('../models/Music');

exports.trackPlayback = async (req, res, next) => {
  const { id } = req.params;
  try {
    // Assumes you have a playCount field in your Music model
    const music = await Music.findByIdAndUpdate(id, { $inc: { playCount: 1 } }, { new: true });
    res.json({ playCount: music.playCount });
  } catch (error) {
    next(error);
  }
};

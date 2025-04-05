import Music from '../models/Music.js';

export const searchMusic = async (req, res, next) => {
  const { query } = req.query; // Using 'query' parameter as in the axios call
  try {
    const results = await Music.find({ $text: { $search: query } }).populate('artist', 'name');
    res.json(results);
  } catch (error) {
    next(error);
  }
};

const Music = require('../models/Music');

exports.searchMusic = async (req, res, next) => {
  const { query } = req.query;  // Using 'query' parameter as in the axios call
  try {
    const results = await Music.find({ $text: { $search: query } })
      .populate('artist', 'name');  // Populate the artist field to get the name
    res.json(results);
  } catch (error) {
    next(error);
  }
};

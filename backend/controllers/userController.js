// controllers/userController.js
const User = require('../models/User');

exports.getProfile = async (req, res, next) => {
  try {
    // req.user is set by the auth middleware after verifying the JWT
    const user = await User.findById(req.user.id).select('-password');
    if (!user) {
      res.status(404);
      throw new Error('User not found');
    }
    res.json(user);
  } catch (error) {
    next(error);
  }
};

exports.updatePushToken = async (req, res, next) => {
  const { pushToken } = req.body;
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      res.status(404);
      throw new Error('User not found');
    }
    user.pushToken = pushToken;
    await user.save();
    res.json({ message: 'Push token updated successfully' });
  } catch (error) {
    next(error);
  }
};

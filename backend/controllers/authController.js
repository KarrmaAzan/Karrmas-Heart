import User from '../models/User.js';
import jwt from 'jsonwebtoken';

const generateToken = (id) => jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '30d' });

export const register = async (req, res, next) => {
  const { name, email, password, role, adminSecret } = req.body;
  try {
    let user = await User.findOne({ email });
    if (user) {
      res.status(400);
      throw new Error('User already exists');
    }

    let newRole = 'user';
    if (role === 'admin') {
      if (!adminSecret || adminSecret !== process.env.ADMIN_SECRET) {
        res.status(403);
        throw new Error('Invalid admin secret');
      }
      newRole = 'admin';
    }

    user = await User.create({ name, email, password, role: newRole });
    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      token: generateToken(user._id),
    });
  } catch (error) {
    next(error);
  }
};

export const login = async (req, res, next) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (user && (await user.matchPassword(password))) {
      res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        token: generateToken(user._id),
      });
    } else {
      res.status(401);
      throw new Error('Invalid email or password');
    }
  } catch (error) {
    next(error);
  }
};

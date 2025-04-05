import Music from '../models/Music.js';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import mime from 'mime-types';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

// 📦 Fix __dirname for ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// 🔧 Multer storage config
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  }
});

// 🔍 File type filtering
const fileFilter = (req, file, cb) => {
  const allowedTypes = ['audio/mpeg', 'audio/mp4', 'audio/x-m4a'];
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Unsupported file type. Only MP3 and M4A are allowed.'), false);
  }
};

// 📤 Export multer middleware for routes
export const uploadMiddleware = multer({ storage, fileFilter }).single('music');

// 🔊 Upload a new song (linked to artist)
export const uploadSongWithArtist = async (req, res) => {
  try {
    const { title, duration, description } = req.body;
    let fileUrl = req.file
      ? `/uploads/${req.file.filename}`
      : req.body.fileUrl;

    if (!fileUrl) {
      return res.status(400).json({ message: 'No file uploaded or fileUrl provided' });
    }

    const { default: Artist } = await import('../models/Artist.js');
    const artist = await Artist.findOne();
    if (!artist) return res.status(404).json({ message: 'Artist not found. Register an artist first.' });

    const newSong = new Music({
      title,
      fileUrl,
      duration,
      description,
      artist: artist._id
    });

    await newSong.save();
    res.status(201).json({ message: 'Song uploaded successfully.', song: newSong });
  } catch (error) {
    console.error('Error uploading song:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

// 🎶 Get all songs
export const getAllMusic = async (req, res, next) => {
  try {
    const musics = await Music.find()
      .populate('artist', 'name')
      .sort({ releaseDate: -1 });
    res.json(musics);
  } catch (error) {
    next(error);
  }
};

// 📡 Stream music with range support
export const streamMusic = async (req, res, next) => {
  try {
    const id = req.params.id.trim();
    const music = await Music.findById(id).populate('artist', 'name');
    if (!music) return res.status(404).json({ message: 'Music not found' });

    const relativeFilePath = music.fileUrl.replace(/^\/+/, '');
    const filePath = path.join(__dirname, '..', relativeFilePath);

    if (!fs.existsSync(filePath)) return res.status(404).json({ message: 'File not found on server' });

    const stat = fs.statSync(filePath);
    const fileSize = stat.size;
    const range = req.headers.range;
    const contentType = mime.lookup(filePath) || 'application/octet-stream';

    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000');
    res.setHeader('Cross-Origin-Resource-Policy', 'cross-origin');

    if (range) {
      const parts = range.replace(/bytes=/, '').split('-');
      const start = parseInt(parts[0], 10);
      const end = parts[1] ? parseInt(parts[1], 10) : fileSize - 1;
      const chunkSize = (end - start) + 1;
      const fileStream = fs.createReadStream(filePath, { start, end });

      res.writeHead(206, {
        'Content-Range': `bytes ${start}-${end}/${fileSize}`,
        'Accept-Ranges': 'bytes',
        'Content-Length': chunkSize,
        'Content-Type': contentType
      });

      fileStream.pipe(res);
    } else {
      res.writeHead(200, {
        'Content-Length': fileSize,
        'Content-Type': contentType
      });
      fs.createReadStream(filePath).pipe(res);
    }
  } catch (error) {
    console.error("Streaming error:", error);
    next(error);
  }
};

// 🔁 Increment play count
export const incrementPlayCount = async (req, res, next) => {
  try {
    const { id } = req.params;
    const updated = await Music.findByIdAndUpdate(
      id.trim(),
      { $inc: { playCount: 1 } },
      { new: true }
    );
    if (!updated) return res.status(404).json({ message: "Music not found" });
    res.status(200).json({ message: "Play count incremented", playCount: updated.playCount });
  } catch (error) {
    console.error("Error incrementing play count:", error);
    next(error);
  }
};

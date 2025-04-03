const Music = require('../models/Music');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const mime = require('mime-types'); // npm install mime-types if not already installed

// Configure Multer storage for music uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  }
});

// Accept only MP3 and M4A file types
const fileFilter = (req, file, cb) => {
  const allowedTypes = ['audio/mpeg', 'audio/mp4', 'audio/x-m4a'];
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Unsupported file type. Only MP3 and M4A are allowed.'), false);
  }
};

exports.uploadMiddleware = multer({ storage, fileFilter }).single('music');

exports.addMusic = async (req, res, next) => {
  const { title, duration, description } = req.body;
  const file = req.file;
  if (!file) {
    res.status(400);
    return next(new Error('No file uploaded'));
  }
  try {
    // When creating the document, we store the fileUrl as usual.
    const music = await Music.create({
      title,
      fileUrl: `/uploads/${file.filename}`,
      duration,
      description
    });
    res.status(201).json(music);
  } catch (error) {
    next(error);
  }
};

exports.getAllMusic = async (req, res, next) => {
  try {
    // Populate the artist field with the artist's name
    const musics = await Music.find()
      .populate('artist', 'name')
      .sort({ releaseDate: -1 });
    res.json(musics);
  } catch (error) {
    next(error);
  }
};

exports.streamMusic = async (req, res, next) => {
  try {
    const id = req.params.id.trim(); // Remove any extra whitespace/newlines
    // Populate the artist field here as well
    const music = await Music.findById(id).populate('artist', 'name');
    if (!music) {
      res.status(404).json({ message: 'Music not found' });
      return;
    }

    // Remove any leading slash from fileUrl so that path.join works correctly
    const relativeFilePath = music.fileUrl.replace(/^\/+/, '');
    const filePath = path.join(__dirname, '..', relativeFilePath);
    console.log("Streaming file from:", filePath);

    // Check that the file exists
    if (!fs.existsSync(filePath)) {
      res.status(404).json({ message: 'File not found on server' });
      return;
    }

    const stat = fs.statSync(filePath);
    const fileSize = stat.size;
    const range = req.headers.range;

    // Dynamically determine the content type using mime-types
    const contentType = mime.lookup(filePath) || 'application/octet-stream';
    console.log("Using Content-Type:", contentType);

    // Set required CORS headers
    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000');
    res.setHeader('Cross-Origin-Resource-Policy', 'cross-origin');

    if (range) {
      const parts = range.replace(/bytes=/, "").split("-");
      const start = parseInt(parts[0], 10);
      const end = parts[1] ? parseInt(parts[1], 10) : fileSize - 1;
      const chunkSize = (end - start) + 1;
      const fileStream = fs.createReadStream(filePath, { start, end });
      const head = {
        'Content-Range': `bytes ${start}-${end}/${fileSize}`,
        'Accept-Ranges': 'bytes',
        'Content-Length': chunkSize,
        'Content-Type': contentType
      };
      res.writeHead(206, head);
      fileStream.pipe(res);
    } else {
      const head = {
        'Content-Length': fileSize,
        'Content-Type': contentType
      };
      res.writeHead(200, head);
      fs.createReadStream(filePath).pipe(res);
    }
  } catch (error) {
    console.error("Streaming error:", error);
    next(error);
  }
};

exports.incrementPlayCount = async (req, res, next) => {
  try {
    const { id } = req.params;
    const updated = await Music.findByIdAndUpdate(
      id.trim(),
      { $inc: { playCount: 1 } },
      { new: true }
    );
    if (!updated) {
      return res.status(404).json({ message: "Music not found" });
    }
    res.status(200).json({ message: "Play count incremented", playCount: updated.playCount });
  } catch (error) {
    console.error("Error incrementing play count:", error);
    next(error);
  }
};

import Album from '../models/Album.js';
import Music from '../models/Music.js';
import Artist from '../models/Artist.js';
import { v2 as cloudinary } from 'cloudinary';
import fs from 'fs';

// 🔊 Create Album and upload everything to Cloudinary
export const createAlbum = async (req, res) => {
  try {
    const { title, description, releaseDate, artistId } = req.body;

    const coverFile = req.files?.['coverImage']?.[0];
    const trackFiles = req.files?.['tracks'] || [];

    if (!coverFile || trackFiles.length === 0) {
      return res.status(400).json({ message: "Cover image and tracks are required." });
    }

    const artist = await Artist.findById(artistId);
    if (!artist) return res.status(404).json({ message: "Artist not found." });

    // Upload album cover to Cloudinary
    const coverUpload = await cloudinary.uploader.upload(coverFile.path, {
      folder: 'album_covers',
    });
    fs.unlinkSync(coverFile.path);

    const trackIds = [];

    for (const file of trackFiles) {
      const upload = await cloudinary.uploader.upload(file.path, {
        resource_type: 'video',
        folder: `music/albums/${title}`,
      });
      fs.unlinkSync(file.path);

      const track = new Music({
        title: file.originalname.split('.')[0],
        fileUrl: upload.secure_url,
        releaseDate: releaseDate || Date.now(),
        artist: artistId,
      });

      await track.save();
      trackIds.push(track._id);
    }

    const album = new Album({
      title,
      description,
      releaseDate: releaseDate || Date.now(),
      coverImage: coverUpload.secure_url,
      songs: trackIds,
    });

    await album.save();
    res.status(201).json({ message: "Album uploaded successfully.", album });

  } catch (error) {
    console.error("Album upload failed:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const getAlbums = async (req, res) => {
  try {
    const albums = await Album.find().populate('songs').sort({ releaseDate: -1 });
    res.status(200).json(albums);
  } catch (error) {
    console.error("Error fetching albums:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const getAlbumById = async (req, res) => {
  try {
    const album = await Album.findById(req.params.id)
      .populate({ path: 'songs', populate: { path: 'artist', select: 'name' } });

    if (!album) return res.status(404).json({ message: 'Album not found' });
    res.json(album);
  } catch (err) {
    console.error('Album fetch error:', err.message);
    res.status(500).json({ message: 'Server error' });
  }
};

import Album from '../models/Albums.js';
import Music from '../models/Music.js';

export const createAlbum = async (req, res) => {
  try {
    const { title, description, releaseDate } = req.body;

    const coverFile = req.files?.['coverImage']?.[0];
    const trackFiles = req.files?.['tracks'] || [];

    if (!coverFile || trackFiles.length === 0) {
      return res.status(400).json({ message: "Cover image and tracks are required." });
    }

    // Save each uploaded track to the Music model
    const trackIds = await Promise.all(
      trackFiles.map(async (file) => {
        const music = new Music({
          title: file.originalname.split('.')[0], // Title from filename
          fileUrl: `/uploads/${file.filename}`,
          releaseDate: releaseDate || Date.now()
        });
        await music.save();
        return music._id;
      })
    );

    // Create the album document
    const album = new Album({
      title,
      description,
      coverImage: `/uploads/${coverFile.filename}`,
      releaseDate: releaseDate || Date.now(),
      songs: trackIds
    });

    await album.save();

    res.status(201).json({ message: "Album created successfully.", album });
  } catch (error) {
    console.error("Error creating album:", error);
    res.status(500).json({ message: "Internal Server Error", error: error.message });
  }
};

export const getAlbums = async (req, res) => {
  try {
    const albums = await Album.find()
      .populate('songs')
      .sort({ releaseDate: -1 });

    res.status(200).json(albums);
  } catch (error) {
    console.error("Error fetching albums:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

import Album from '../models/Album.js';
import Music from '../models/Music.js';
import Artist from '../models/Artist.js'; // ✅ Required to validate artist

// ✅ Create Album
export const createAlbum = async (req, res) => {
  try {
    const { title, description, releaseDate, artistId } = req.body;

    const coverFile = req.files?.['coverImage']?.[0];
    const trackFiles = req.files?.['tracks'] || [];

    if (!coverFile || trackFiles.length === 0) {
      return res.status(400).json({ message: "Cover image and tracks are required." });
    }

    // ✅ Validate artist
    const artist = await Artist.findById(artistId);
    if (!artist) {
      return res.status(404).json({ message: "Artist not found." });
    }

    // ✅ Save each uploaded track to Music
    const trackIds = await Promise.all(
      trackFiles.map(async (file) => {
        const music = new Music({
          title: file.originalname.split('.')[0],
          fileUrl: `/uploads/${file.filename}`,
          releaseDate: releaseDate || Date.now(),
          artist: artistId
        });
        await music.save();
        return music._id;
      })
    );

    // ✅ Create album
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

// ✅ Add this missing export!
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

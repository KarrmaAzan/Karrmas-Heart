import { useRouter } from "next/router";
import { useEffect, useState, useContext } from "react";
import api from "../../utils/api";
import { PlayerContext } from "../../context/PlayerContext";
import {
  Box,
  Typography,
  List,
  ListItem,
  ListItemText,
  CircularProgress,
} from "@mui/material";
import Image from "next/image";

export default function AlbumDetailsPage() {
  const router = useRouter();
  const { id } = router.query;
  const { setCurrentTrack } = useContext(PlayerContext);

  const [album, setAlbum] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;

    const fetchAlbum = async () => {
      try {
        const res = await api.get(`/albums/${id}`);
        setAlbum(res.data);
      } catch (err) {
        console.error("Error loading album:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchAlbum();
  }, [id]);

  if (loading) {
    return (
      <Box p={4} display="flex" justifyContent="center">
        <CircularProgress />
      </Box>
    );
  }

  if (!album) {
    return (
      <Box p={4}>
        <Typography variant="h5" color="white">
          Album not found.
        </Typography>
      </Box>
    );
  }

  return (
    <Box p={4}>
      <Box display="flex" flexDirection="column" alignItems="center">
        <Image
          src={album.coverImage || "/iam.jpeg"}
          alt={album.title}
          width={200}
          height={200}
          style={{ borderRadius: 12, objectFit: "cover" }}
          onError={(e) => {
            e.target.src = "/iam.jpeg";
          }} // Fallback
          priority
        />

        <Typography variant="h4" color="white" mt={2}>
          {album.title}
        </Typography>
        <Typography variant="body1" color="gray" mt={1}>
          Released: {new Date(album.releaseDate).toLocaleDateString()}
        </Typography>
      </Box>

      <Box mt={4}>
        <Typography variant="h6" color="gold">
          Tracklist
        </Typography>
        <List>
          {album.songs.map((song) => (
            <ListItem
              key={song._id}
              button
              onClick={() => setCurrentTrack(song)}
              sx={{ "&:hover": { backgroundColor: "#333" } }}
            >
              <ListItemText
                primary={song.title}
                secondary={song.duration}
                primaryTypographyProps={{ color: "white" }}
                secondaryTypographyProps={{ color: "gray" }}
              />
            </ListItem>
          ))}
        </List>
      </Box>
    </Box>
  );
}

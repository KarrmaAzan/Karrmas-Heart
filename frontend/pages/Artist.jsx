import {
  Box,
  Container,
  Typography,
  Button,
  List,
  ListItem,
  ListItemText,
  useMediaQuery
} from "@mui/material";
import { useEffect, useState, useContext } from "react";
import api from "../utils/api";
import styled from "styled-components";
import Image from "next/image";
import { PlayerContext } from "../context/PlayerContext";
import { AuthContext } from "../context/AuthContext"; // ✅ AuthContext added

// 🎨 Styled Components for Artist Page

const ArtistHeader = styled(Box)`
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  margin-bottom: 30px;
`;

const ArtistProfileContainer = styled(Box)`
  position: relative;
  width: 100vw;
  height: 180px;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-left: ${(props) =>
    props.$isMobile ? "calc(65% - 50vw)" : "calc(91% - 50vw)"};
`;

const ArtistBanner = styled(Box)`
  position: absolute;
  bottom: 7px;
  left: 0;
  width: 100%;
  height: 100%;
  background-image: url(${(props) => props.$banner});
  background-size: cover;
  background-position: center;
  z-index: 0;
`;

const ArtistImageWrapper = styled(Box)`
  position: relative;
  z-index: 1;
`;

const ArtistImageStyled = styled(Image).attrs({
  priority: true,
})`
  border-radius: 50%;
  width: 180px;
  height: 180px;
  object-fit: cover;
  box-shadow: 0px 0px 15px rgba(255, 215, 0, 0.5);
`;

const SectionTitle = styled(Typography)`
  font-size: 22px;
  font-weight: bold;
  margin: 20px 0;
  color: gold;
  text-transform: uppercase;
`;

const ExpandButton = styled(Button)`
  margin-top: 10px;
  color: white;
  border-color: gold;
  &:hover {
    background-color: rgba(255, 215, 0, 0.1);
  }
`;

export default function ArtistPage() {
  const { setCurrentTrack, setAllSongs } = useContext(PlayerContext);
  const { user } = useContext(AuthContext); // ✅ Grab current user if needed

  const [artist, setArtist] = useState(null);
  const [topSongs, setTopSongs] = useState([]);
  const [allSongsLocal, setLocalAllSongs] = useState([]);
  const [showFullDiscography, setShowFullDiscography] = useState(false);

  const bannerImage = "/Soul-Dweller.JPG";
  const isMobile = useMediaQuery("(max-width:768px)");

  useEffect(() => {
    const fetchArtistData = async () => {
      try {
        const response = await api.get('/artist'); // ✅ only this!
        const updatedArtist = {
          ...response.data.artist,
          image: response.data.artist.image?.trim()
            ? `${response.data.artist.image}?timestamp=${new Date().getTime()}`
            : null,
        };
        setArtist(updatedArtist);
        setTopSongs(response.data.topSongs);
        setLocalAllSongs(response.data.allSongs);
        setAllSongs(response.data.allSongs);
      } catch (err) {
        console.error("Error fetching artist data:", err);
      }
    };

    fetchArtistData();
  }, [setAllSongs]);

  return (
    <Container sx={{ paddingBottom: "150px" }}>
      {artist && (
        <ArtistHeader>
          <ArtistProfileContainer $isMobile={isMobile}>
            <ArtistBanner
              $banner={bannerImage}
              $border="2px solid gold"
              $boxShadow="0 4px 6px rgba(0, 0, 0, 0.1)"
            />
            <ArtistImageWrapper>
              {artist.image ? (
                <ArtistImageStyled src={artist.image} alt={artist.name} width={180} height={180} />
              ) : (
                <Typography sx={{ color: "gray", textAlign: "center" }}>
                  No image available
                </Typography>
              )}
            </ArtistImageWrapper>
          </ArtistProfileContainer>
          <Typography variant="h3" color="white">
            {artist.name}
          </Typography>
        </ArtistHeader>
      )}

      <SectionTitle>Top 5 Most Popular Songs</SectionTitle>
      <List>
        {topSongs.map((song) => (
          <ListItem
            key={song._id}
            button
            onClick={() => setCurrentTrack(song)}
            sx={{ transition: "0.3s", "&:hover": { backgroundColor: "#333" } }}
          >
            <ListItemText primary={song.title} secondary={`${song.playCount} plays`} />
          </ListItem>
        ))}
      </List>

      <SectionTitle>Discography</SectionTitle>
      <List>
        {(showFullDiscography ? allSongsLocal : allSongsLocal.slice(0, 5)).map((track) => (
          <ListItem
            key={track._id}
            button
            onClick={() => setCurrentTrack(track)}
            sx={{ transition: "0.3s", "&:hover": { backgroundColor: "#333" } }}
          >
            <ListItemText primary={track.title} secondary={track.releaseDate} />
          </ListItem>
        ))}
      </List>

      {allSongsLocal.length > 5 && (
        <ExpandButton variant="outlined" onClick={() => setShowFullDiscography(!showFullDiscography)}>
          {showFullDiscography ? "Show Less" : "View All"}
        </ExpandButton>
      )}

<SectionTitle>Albums</SectionTitle>
<Box display="flex" flexWrap="wrap" gap={2}>
  {albums.map((album) => (
    <Box
      key={album._id}
      sx={{
        width: 180,
        cursor: 'pointer',
        backgroundColor: '#222',
        borderRadius: 2,
        overflow: 'hidden',
        boxShadow: '0px 0px 10px rgba(0,0,0,0.4)'
      }}
      onClick={() => router.push(`/albums/${album._id}`)}
    >
      <img src={album.coverImage} alt={album.title} style={{ width: '100%', height: 180, objectFit: 'cover' }} />
      <Box p={1}>
        <Typography variant="body1" color="white" fontWeight="bold">{album.title}</Typography>
        <Typography variant="body2" color="gray">{new Date(album.releaseDate).toLocaleDateString()}</Typography>
      </Box>
    </Box>
  ))}
</Box>


      <SectionTitle>About</SectionTitle>
      <Typography color="gray">{artist?.bio || "No bio available."}</Typography>
    </Container>
  );
}

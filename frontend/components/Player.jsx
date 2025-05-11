import { useState, useRef, useEffect, useContext } from "react";
import {
  Box,
  IconButton,
  Slider,
  Typography,
  useMediaQuery,
} from "@mui/material";
import {
  PlayArrow,
  Pause,
  SkipNext,
  SkipPrevious,
  Shuffle,
  Repeat,
  RepeatOne,
} from "@mui/icons-material";
import VolumeUpIcon from "@mui/icons-material/VolumeUp";
import styled from "styled-components";
import { PlayerContext } from "../context/PlayerContext";
import api from "../utils/api";

const PlayerContainer = styled(Box)`
  position: fixed;
  bottom: ${(props) => (props.$isMobile ? "80px" : "0")};
  left: 0;
  width: 100vw;
  height: ${(props) => (props.$isMobile ? "60px" : "100px")};
  background-color: #1e1e1e;
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: ${(props) => (props.$isMobile ? "10px 15px" : "10px 20px")};
  box-sizing: border-box;
  overflow: hidden;
  position: fixed;
  margin-bottom: -20px;
`;

const TopSection = styled(Box)`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  flex: 1;
  position: relative;
`;

const LeftSection = styled(Box)`
  display: flex;
  align-items: center;
  flex: 1;
  overflow: hidden;
`;

const CenterSection = styled(Box)`
  display: flex;
  align-items: center;
  justify-content: center;
  flex: 1;
`;

const RightSection = styled(Box)`
  display: flex;
  align-items: center;
  justify-content: flex-end;
  flex: 1;
`;

const SongDetails = styled(Box)`
  display: flex;
  align-items: center;
  gap: 25px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const AlbumCover = styled.img`
  width: 50px;
  height: 50px;
  border-radius: 8px;
  object-fit: cover;
  flex-shrink: 0;
`;

const Controls = styled(Box)`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 20px;
`;

const PlayButton = styled(IconButton)`
  color: white;
`;

const DurationBar = styled(Slider)`
  ${(props) =>
    props.$isMobile
      ? `
    position: absolute;
    top: 2.2rem;
    left: 0;
    right: 0;
    margin: 0;
    & .MuiSlider-thumb {
      display: none;
    }
  `
      : `
    width: 70%;
    margin: 5px auto;
    bottom: 8px;
  `}
`;

export default function Player() {
  const { currentTrack, setCurrentTrack, allSongs } = useContext(PlayerContext);

  const [playing, setPlaying] = useState(false);
  const [volume, setVolume] = useState(50);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [repeatMode, setRepeatMode] = useState(0);
  const [shuffling, setShuffling] = useState(false);
  const [hasCounted, setHasCounted] = useState(false);
  const audioRef = useRef(null);
  const isMobile = useMediaQuery("(max-width: 768px)");

  const streamBaseUrl =
    typeof window !== "undefined" && window.location.hostname.includes("localhost")
      ? "http://localhost:5000"
      : "https://karrmas-heart.onrender.com";

      useEffect(() => {
        if (currentTrack && audioRef.current) {
          const isCloudinary = currentTrack.fileUrl?.includes("res.cloudinary.com");
          const src = isCloudinary
            ? currentTrack.fileUrl // ✅ Direct Cloudinary link
            : `${streamBaseUrl}/api/v1/music/stream/${currentTrack._id}`; // ✅ fallback to your backend
      
          audioRef.current.src = src;
          audioRef.current.load();
          audioRef.current
            .play()
            .catch((err) => console.error("Playback failed:", err));
      
          setPlaying(true);
          setHasCounted(false);
        }
      }, [currentTrack]);
      

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume / 100;
    }
  }, [volume]);

  useEffect(() => {
    const audioEl = audioRef.current;
    if (!audioEl) return;
    const updateProgress = () => {
      setCurrentTime(audioEl.currentTime);
      setDuration(audioEl.duration);
      if (audioEl.currentTime >= 10 && !hasCounted) {
        incrementPlayCount();
        setHasCounted(true);
      }
    };
    audioEl.addEventListener("timeupdate", updateProgress);
    audioEl.addEventListener("loadedmetadata", updateProgress);
    return () => {
      audioEl.removeEventListener("timeupdate", updateProgress);
      audioEl.removeEventListener("loadedmetadata", updateProgress);
    };
  }, [currentTrack, hasCounted]);

  const incrementPlayCount = async () => {
    try {
      if (!currentTrack?._id) return;
      await api.patch(`/music/increment-playcount/${currentTrack._id}`);
      console.log("Play count incremented for track:", currentTrack._id);
    } catch (error) {
      if (error.response) {
        console.error("Error incrementing play count:", error.response.data);
      } else {
        console.error("Error incrementing play count:", error.message);
      }
    }
  };

  const formatTime = (time) => {
    if (isNaN(time) || time < 0) return "0:00";
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
  };

  const togglePlay = () => {
    if (!currentTrack) return;
    if (playing) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
    setPlaying(!playing);
  };

  const playNext = () => {
    if (!allSongs || allSongs.length === 0) return;
    const currentIndex = allSongs.findIndex(
      (track) => track._id === currentTrack._id
    );
    const nextIndex = (currentIndex + 1) % allSongs.length;
    setCurrentTrack(allSongs[nextIndex]);
  };

  const playPrevious = () => {
    if (!allSongs || allSongs.length === 0) return;
    const currentIndex = allSongs.findIndex(
      (track) => track._id === currentTrack._id
    );
    const prevIndex = (currentIndex - 1 + allSongs.length) % allSongs.length;
    setCurrentTrack(allSongs[prevIndex]);
  };

  const toggleRepeat = () => {
    setRepeatMode((prev) => (prev + 1) % 3);
  };

  const toggleShuffle = () => {
    setShuffling(!shuffling);
  };

  return (
    <PlayerContainer $isMobile={isMobile}>
      <audio ref={audioRef} loop={repeatMode === 1} />

      {isMobile ? (
        <>
          <Box
            display="flex"
            alignItems="center"
            justifyContent="space-between"
            width="100%"
          >
            <Box>
              {currentTrack && (
                <AlbumCover src={currentTrack.albumCover} alt="Album" />
              )}
            </Box>
            <Box flex={1} display="flex" justifyContent="center">
              <Typography variant="body1" color="white">
                {currentTrack ? currentTrack.title : "No Song Playing"}
              </Typography>
            </Box>
            <Box>
              <IconButton onClick={togglePlay} color="secondary">
                {playing ? (
                  <Pause fontSize="large" />
                ) : (
                  <PlayArrow fontSize="large" />
                )}
              </IconButton>
            </Box>
          </Box>
          <DurationBar
            $isMobile={isMobile}
            value={currentTime}
            min={0}
            max={duration || 1}
            onChange={(e, v) => {
              audioRef.current.currentTime = v;
            }}
          />
        </>
      ) : (
        <>
          <TopSection>
            <LeftSection>
              <SongDetails>
                {currentTrack && (
                  <AlbumCover src={currentTrack.albumCover} alt="Album" />
                )}
                <Box>
                  <Typography variant="body1" color="white">
                    {currentTrack ? currentTrack.title : "No Song Playing"}
                  </Typography>
                  <Typography variant="body2" color="gray">
                    {currentTrack?.artist?.name || "Artist Unknown"}
                  </Typography>
                </Box>
              </SongDetails>
            </LeftSection>

            <CenterSection>
              <Controls>
                <IconButton
                  onClick={toggleShuffle}
                  color={shuffling ? "secondary" : "default"}
                >
                  <Shuffle fontSize="large" />
                </IconButton>
                <IconButton onClick={playPrevious}>
                  <SkipPrevious fontSize="large" />
                </IconButton>
                <IconButton onClick={togglePlay} color="secondary">
                  {playing ? (
                    <Pause fontSize="large" />
                  ) : (
                    <PlayArrow fontSize="large" />
                  )}
                </IconButton>
                <IconButton onClick={playNext}>
                  <SkipNext fontSize="large" />
                </IconButton>
                <IconButton
                  onClick={toggleRepeat}
                  color={repeatMode !== 0 ? "secondary" : "default"}
                >
                  {repeatMode === 1 ? (
                    <RepeatOne fontSize="large" />
                  ) : (
                    <Repeat fontSize="large" />
                  )}
                </IconButton>
              </Controls>
            </CenterSection>

            <RightSection>
              <Box display="flex" alignItems="center">
                <VolumeUpIcon color="secondary" sx={{ marginRight: "8px" }} />
                <Slider
                  value={volume}
                  onChange={(e, v) => setVolume(v)}
                  sx={{ width: 100, color: "secondary.main", right: 5 }}
                />
              </Box>
            </RightSection>
          </TopSection>

          <Box width="100%" display="flex" alignItems="center">
            <Typography
              variant="body2"
              color="gray"
              sx={{ marginLeft: 2, position: "relative", bottom: "6px" }}
            >
              {formatTime(currentTime)}
            </Typography>
            <DurationBar
              value={currentTime}
              min={0}
              max={duration || 1}
              onChange={(e, v) => {
                audioRef.current.currentTime = v;
              }}
            />
            <Typography
              variant="body2"
              color="gray"
              sx={{ marginRight: 2, position: "relative", bottom: "6px" }}
            >
              {formatTime(duration)}
            </Typography>
          </Box>
        </>
      )}
    </PlayerContainer>
  );
}

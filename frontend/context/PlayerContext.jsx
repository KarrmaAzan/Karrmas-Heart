// contexts/PlayerContext.js
import React, { createContext, useState } from 'react';

export const PlayerContext = createContext();

export const PlayerProvider = ({ children }) => {
  const [currentTrack, setCurrentTrack] = useState(null);
  const [allSongs, setAllSongs] = useState([]);

  return (
    <PlayerContext.Provider value={{ currentTrack, setCurrentTrack, allSongs, setAllSongs }}>
      {children}
    </PlayerContext.Provider>
  );
};

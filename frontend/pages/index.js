import { useEffect, useState } from "react";
import { Container, Box } from "@mui/material";
import Artist from "./Artist";
import LandingAuthModal from "../components/LandingAuthModal";

export default function Home() {
  const [isClient, setIsClient] = useState(false);
  const [authenticated, setAuthenticated] = useState(false);

  useEffect(() => {
    setIsClient(true); // 🚀 Only set true after mount
    const token = localStorage.getItem("token");
    if (token) {
      setAuthenticated(true);
    }
  }, []);

  if (!isClient) return null; // 🧠 Don't render until we're on client

  return (
    <>
      <Container>
        <Artist />
      </Container>

      {!authenticated && (
        <Box
          sx={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100vw",
            height: "100vh",
            bgcolor: "black",
            zIndex: 1300,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <LandingAuthModal />
        </Box>
      )}
    </>
  );
}

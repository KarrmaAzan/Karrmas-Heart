import { useEffect, useState } from "react";
import { Container, Box } from "@mui/material";
import Artist from "./Artist"; // ✅ updated path
import LandingAuthModal from "../components/LandingAuthModal";

export default function Home() {
  const [authenticated, setAuthenticated] = useState(false);

  // Run useEffect always (on mount)
  useEffect(() => {
    if (typeof window !== "undefined") { // Check that we're on the client side
      const token = localStorage.getItem("token");
      if (token) {
        setAuthenticated(true);
      }
    }
  }, []); // Empty dependency means it runs only once after the first render

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

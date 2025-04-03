import { useEffect, useState } from "react";
import { Container, Box } from "@mui/material";
import Artist from "./Artist"; // ✅ updated path
import LandingAuthModal from "../components/LandingAuthModal";

export default function Home() {
  const [authenticated, setAuthenticated] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      setAuthenticated(true);
    }
  }, []);

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

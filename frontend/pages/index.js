import { useEffect, useState, useContext } from "react";
import { Container, Box } from "@mui/material";
import Artist from "./Artist";
import LandingAuthModal from "../components/LandingAuthModal";
import { AuthContext } from "../context/AuthContext"; // ✅ Add context usage

export default function Home() {
  const { token, loading } = useContext(AuthContext); // ✅ use context values
  const [authenticated, setAuthenticated] = useState(false);

  useEffect(() => {
    if (!loading) {
      setAuthenticated(!!token); // ✅ Set authenticated when loading finishes
    }
  }, [token, loading]);

  if (loading) return null; // ✅ Avoid rendering before checking auth

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

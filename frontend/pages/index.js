import { useEffect, useState, useContext } from "react";
import { Container, Box } from "@mui/material";
import Artist from "./Artist";
import LandingAuthModal from "../components/LandingAuthModal";
import { AuthContext } from "../context/AuthContext"; // ✅

export default function Home() {
  const { token } = useContext(AuthContext); // ✅ Use context state directly

  return (
    <>
      <Container>
        {token && <Artist />}
      </Container>

      {!token && (
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

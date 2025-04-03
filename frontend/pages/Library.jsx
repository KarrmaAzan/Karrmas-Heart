// pages/library.js
import { useState, useEffect } from "react";
import { Box, Container, Typography, IconButton, Avatar, Drawer, List, ListItem, ListItemText } from "@mui/material";
import { useTheme, useMediaQuery } from "@mui/material";
import { useRouter } from "next/router";

export default function Library() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const router = useRouter();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsAuthenticated(!!token);
  }, []);

  const handleAvatarClick = () => {
    setDrawerOpen(true);
  };

  const handleDrawerClose = () => {
    setDrawerOpen(false);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    setDrawerOpen(false);
    router.push("/");
  };

  return (
    <Container sx={{ py: 2 }}>
      {/* Mobile-only avatar header */}
      {isMobile && isAuthenticated && (
        <Box sx={{ display: "flex", justifyContent: "flex-end", mb: 2 }}>
          <IconButton onClick={handleAvatarClick}>
            <Avatar alt="User Avatar" src="/default-avatar.png" sx={{ width: 40, height: 40 }} />
          </IconButton>
        </Box>
      )}

      <Typography variant="h4" sx={{ mb: 2 }}>
        Library
      </Typography>
      <Typography variant="body1">
        This is your library content.
      </Typography>

      {/* Mobile-only Drawer that slides in from the right */}
      {isMobile && (
        <Drawer
          anchor="right"
          open={drawerOpen}
          onClose={handleDrawerClose}
          sx={{
            "& .MuiDrawer-paper": { width: "60%" },
          }}
        >
          <Box sx={{ p: 2 }}>
            <Typography variant="h6" sx={{ mb: 2 }}>
              Account Settings
            </Typography>
            <List>
              <ListItem button onClick={handleLogout}>
                <ListItemText primary="Logout" />
              </ListItem>
              {/* Additional menu items can be added here */}
            </List>
          </Box>
        </Drawer>
      )}
    </Container>
  );
}

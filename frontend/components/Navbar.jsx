import { useState, useEffect } from 'react';
import {
  AppBar,
  Toolbar,
  IconButton,
  InputBase,
  Box,
  Avatar,
  Drawer,
  List,
  ListItem,
  ListItemText,
  Typography,
  Popper,
  Paper,
  List as MUIList,
  ListItem as MUIListItem,
  ListItemText as MUIListItemText,
  Button,
  Menu,
  MenuItem
} from '@mui/material';
import { Home, Search, LibraryMusic, Person } from '@mui/icons-material';
import { useMediaQuery } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import styled from 'styled-components';
import Link from 'next/link';
import { useRouter } from 'next/router';
import axios from 'axios';

const MobileNavbar = styled(AppBar)`
  position: fixed;
  bottom: 0;
  top: auto;
  background-color: #1E1E1E;
`;

const DesktopNavbar = styled(AppBar)`
  background-color: #1E1E1E;
  padding: 10px 20px;
  box-shadow: none;
`;

export default function Navbar() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const router = useRouter();

  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);

  // New states for inline search
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [anchorElSearch, setAnchorElSearch] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      setIsAuthenticated(true);
    }
  }, []);

  const handleAvatarClick = (event) => {
    setDrawerOpen(true);
  };

  const handleDrawerClose = () => {
    setDrawerOpen(false);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    setDrawerOpen(false);
    window.location.reload();
  };

  // Desktop Navbar Content with inline search and Drawer for avatar dropdown
  const desktopContent = (
    <DesktopNavbar position="static">
      <Toolbar
        sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}
      >
        {/* Left Side Spacer */}
        <Box sx={{ flex: 1 }}></Box>
        {/* Right Side */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: '15px', flexShrink: 0, position: 'relative' }}>
          <InputBase
            placeholder="Search music..."
            value={searchQuery}
            onChange={(e) => {
              const val = e.target.value;
              setSearchQuery(val);
              if (val.trim() !== "") {
                axios
                  .get(`http://localhost:5000/api/v1/search?query=${encodeURIComponent(val)}`)
                  .then((res) => setSearchResults(res.data))
                  .catch((err) => console.error(err));
              } else {
                setSearchResults([]);
              }
            }}
            onFocus={(e) => setAnchorElSearch(e.currentTarget)}
            onBlur={() => {
              // Delay hiding the popper to allow click events
              setTimeout(() => setAnchorElSearch(null), 200);
            }}
            sx={{
              backgroundColor: '#333',
              padding: '8px 12px',
              borderRadius: '20px',
              color: '#FFF',
              width: '300px',
              transition: '0.3s',
            }}
          />
          {/* Inline Search Popper */}
          {anchorElSearch && (
  <Popper open={Boolean(anchorElSearch)} anchorEl={anchorElSearch} style={{ zIndex: 1400 }}>
    <Paper sx={{ width: '300px', mt: 1 }}>
      <MUIList>
        {searchResults.map((result, index) => (
          <MUIListItem
            button
            key={index}
            onMouseDown={() => {
              router.push(`/search?query=${encodeURIComponent(result.title)}`);
              setAnchorElSearch(null);
            }}
          >
            <MUIListItemText
              primary={result.title}
              secondary={result.artist && result.artist.name ? result.artist.name : "Unknown Artist"}
            />
          </MUIListItem>
        ))}
      </MUIList>
    </Paper>
  </Popper>
)}

          <Link href="/" passHref>
            <IconButton color="secondary">
              <Home fontSize="large" />
            </IconButton>
          </Link>
          <Link href="/Library" passHref>
            <IconButton color="secondary">
              <LibraryMusic fontSize="large" />
            </IconButton>
          </Link>
          {isAuthenticated ? (
            <IconButton color="secondary" onClick={handleAvatarClick}>
              <Avatar alt="User Avatar" src="/default-avatar.png" />
            </IconButton>
          ) : (
            <IconButton color="secondary">
              <Person fontSize="large" />
            </IconButton>
          )}
          <Menu
            anchorEl={null}
            open={false}
            // Not used since we now use Drawer for account actions.
          />
        </Box>
      </Toolbar>
      {isAuthenticated && (
        <Drawer
          anchor="right"
          open={drawerOpen}
          onClose={handleDrawerClose}
          sx={{
            "& .MuiDrawer-paper": { width: "30%" },
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
              {/* Additional account options can be added here */}
            </List>
          </Box>
        </Drawer>
      )}
    </DesktopNavbar>
  );

  // Mobile Navbar Content remains unchanged.
  const mobileContent = (
    <MobileNavbar>
      <Toolbar sx={{ justifyContent: 'space-around', alignItems: 'center' }}>
        <Link href="/" passHref>
          <IconButton color="secondary">
            <Home fontSize="large" />
          </IconButton>
        </Link>
        <Link href="/search" passHref>
          <IconButton color="secondary">
            <Search fontSize="large" />
          </IconButton>
        </Link>
        <Link href="/Library" passHref>
          <IconButton color="secondary">
            <LibraryMusic fontSize="large" />
          </IconButton>
        </Link>
        {!isAuthenticated && (
          <IconButton color="secondary">
            <Person fontSize="large" />
          </IconButton>
        )}
      </Toolbar>
    </MobileNavbar>
  );

  return isMobile ? mobileContent : desktopContent;
}

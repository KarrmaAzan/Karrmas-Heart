// components/LibraryHeader.jsx
import { useState } from 'react';
import { Box, IconButton, Avatar, Menu, MenuItem, Typography } from '@mui/material';
import { useRouter } from 'next/router';

export default function LibraryHeader() {
  const [anchorEl, setAnchorEl] = useState(null);
  const router = useRouter();

  const handleAvatarClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    handleMenuClose();
    router.push("/");
  };

  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        p: 2,
        bgcolor: '#1E1E1E',
        color: '#FFF',
      }}
    >
      <Typography variant="h6">Library</Typography>
      <IconButton onClick={handleAvatarClick}>
        <Avatar alt="User Avatar" src="/default-avatar.png" sx={{ width: 40, height: 40 }} />
      </IconButton>
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
      >
        <MenuItem onClick={handleLogout}>Logout</MenuItem>
      </Menu>
    </Box>
  );
}

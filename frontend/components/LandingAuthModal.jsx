import { useState, useContext } from "react";
import { Box, Modal, Typography, TextField, Button } from "@mui/material";
import { useRouter } from "next/router";
import api from "../utils/api";
import { AuthContext } from "../context/AuthContext"; // ✅

const modalStyle = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  boxShadow: 24,
  p: 4,
  borderRadius: 2,
};

export default function LandingAuthModal() {
  const router = useRouter();
  const [isLogin, setIsLogin] = useState(true);
  const [name, setName] = useState(""); // Only used during registration
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const { login } = useContext(AuthContext); // ✅ use global login()

  const handleLogin = async (e) => {
    e.preventDefault();
    setErrorMsg("");
    try {
      const { data } = await api.post("/auth/login", { email, password });
      if (data.token) {
        login(data); // ✅ Automatically saves and routes
      } else {
        setErrorMsg("Login failed: No token returned");
      }
    } catch (error) {
      setErrorMsg(error.response?.data?.message || "Login failed");
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setErrorMsg("");
    try {
      const { data } = await api.post("/auth/register", { name, email, password });
      login(data); // ✅ Register and login right away
    } catch (error) {
      setErrorMsg(error.response?.data?.message || "Registration failed");
    }
  };

  return (
    <Modal open={true} aria-labelledby="auth-modal-title">
      <Box sx={modalStyle}>
        <Typography id="auth-modal-title" variant="h5" component="h2" sx={{ mb: 2 }}>
          {isLogin ? "Login" : "Register"}
        </Typography>
        <form onSubmit={isLogin ? handleLogin : handleRegister}>
          {!isLogin && (
            <TextField
              fullWidth
              label="Name"
              variant="outlined"
              margin="normal"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          )}
          <TextField
            fullWidth
            label="Email"
            type="email"
            variant="outlined"
            margin="normal"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <TextField
            fullWidth
            label="Password"
            type="password"
            variant="outlined"
            margin="normal"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          {errorMsg && (
            <Typography variant="body2" color="error" sx={{ mt: 1 }}>
              {errorMsg}
            </Typography>
          )}
          <Button type="submit" variant="contained" color="primary" fullWidth sx={{ mt: 2 }}>
            {isLogin ? "Login" : "Register"}
          </Button>
        </form>
        <Box sx={{ mt: 2 }}>
          <Button variant="outlined" fullWidth sx={{ mt: 1 }}>
            {isLogin ? "Sign in with Google" : "Register with Google"}
          </Button>
        </Box>
        <Button
          onClick={() => {
            setIsLogin(!isLogin);
            setErrorMsg("");
          }}
          fullWidth
          sx={{ mt: 2 }}
        >
          {isLogin ? "Don't have an account? Register" : "Already have an account? Login"}
        </Button>
      </Box>
    </Modal>
  );
}

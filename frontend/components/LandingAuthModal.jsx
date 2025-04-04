import { useState, useContext } from "react";
import { Box, Modal, Typography, TextField, Button, MenuItem } from "@mui/material";
import { useRouter } from "next/router";
import api from "../utils/api";
import { AuthContext } from "../context/AuthContext"; // ✅
import toast from "react-hot-toast";

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
  const [role, setRole] = useState("user"); // ✅ Default to user
  const [adminSecret, setAdminSecret] = useState(""); // ✅ Used only if role is admin
  const [errorMsg, setErrorMsg] = useState("");
  const { login } = useContext(AuthContext); // ✅ use global login()



  const handleLogin = async (e) => {
    e.preventDefault();
    setErrorMsg("");
    try {
      const { data } = await api.post("/auth/login", { email, password });
      
      if (data && data.token) {
        toast.success("Welcome back!");
        login(data); // will trigger redirect
      } else {
        toast.error("Login failed. No token returned.");
      }
    } catch (error) {
      const msg = error.response?.data?.message || "Invalid email or password.";
      setErrorMsg(msg);
      toast.error(msg);
    }
  };
  
  const handleRegister = async (e) => {
    e.preventDefault();
    setErrorMsg("");
    try {
      const { data } = await api.post("/auth/register", {
        name,
        email,
        password,
      });
  
      if (data && data.token) {
        toast.success("Account created!");
        login(data);
      } else {
        toast.error("Registration failed. No token returned.");
      }
    } catch (error) {
      const msg = error.response?.data?.message || "Registration failed";
      setErrorMsg(msg);
      toast.error(msg);
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
            <>
              <TextField
                fullWidth
                label="Name"
                variant="outlined"
                margin="normal"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
              <TextField
                select
                fullWidth
                label="Role"
                variant="outlined"
                margin="normal"
                value={role}
                onChange={(e) => setRole(e.target.value)}
              >
                <MenuItem value="user">User</MenuItem>
                <MenuItem value="admin">Admin</MenuItem>
              </TextField>
              {role === "admin" && (
                <TextField
                  fullWidth
                  label="Admin Secret Key"
                  variant="outlined"
                  margin="normal"
                  value={adminSecret}
                  onChange={(e) => setAdminSecret(e.target.value)}
                  required
                />
              )}
            </>
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

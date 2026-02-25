import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

//MUI - Components ...
import {
  Box, Card, CardContent, TextField, Button,
  Typography, InputAdornment, IconButton, Alert, CircularProgress,
} from "@mui/material";

// ICONS ...
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import PersonOutlineRoundedIcon from "@mui/icons-material/PersonOutlineRounded";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import PeopleRoundedIcon from "@mui/icons-material/PeopleRounded";


export default function LoginPage() {
  const [username, setUsername]         = useState("");
  const [password, setPassword]         = useState("");
  const [showPass, setShowPass]         = useState(false);
  const [loading, setLoading]           = useState(false);
  const [error, setError]               = useState("");
  const { login }                       = useAuth();
  const navigate                        = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await login(username, password);
      navigate("/");
    } catch (err) {
      setError(err.response?.data?.detail || "Invalid credentials. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "linear-gradient(135deg, #EFF6FF 0%, #F0F9FF 50%, #F8FAFC 100%)",
        p: 2,
      }}
    >
      {/* Background decorative circles */}
      <Box sx={{
        position: "fixed", top: -80, right: -80,
        width: 300, height: 300, borderRadius: "50%",
        background: "linear-gradient(135deg, rgba(37,99,235,0.08), rgba(14,165,233,0.06))",
        pointerEvents: "none",
      }} />
      <Box sx={{
        position: "fixed", bottom: -60, left: -60,
        width: 220, height: 220, borderRadius: "50%",
        background: "linear-gradient(135deg, rgba(14,165,233,0.07), rgba(37,99,235,0.05))",
        pointerEvents: "none",
      }} />

      <Card sx={{ width: "100%", maxWidth: 420, borderRadius: 3, p: 1 }}>
        <CardContent sx={{ p: 4 }}>
          {/* Logo */}
          <Box sx={{ textAlign: "center", mb: 4 }}>
            <Box
              sx={{
                width: 56, height: 56, borderRadius: 2.5, mx: "auto", mb: 2,
                background: "linear-gradient(135deg, #2563EB 0%, #0EA5E9 100%)",
                display: "flex", alignItems: "center", justifyContent: "center",
              }}
            >
              <PeopleRoundedIcon sx={{ color: "#fff", fontSize: 28 }} />
            </Box>
            <Typography variant="h5" gutterBottom>Welcome back</Typography>
            <Typography variant="body2" color="text.secondary">
              Sign in to your HR admin account
            </Typography>
          </Box>

          {error && (
            <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }}>
              {error}
            </Alert>
          )}

          <Box component="form" onSubmit={handleSubmit}>
            <TextField
              fullWidth
              label="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              sx={{ mb: 2 }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <PersonOutlineRoundedIcon sx={{ color: "#94A3B8" }} />
                  </InputAdornment>
                ),
              }}
            />
            <TextField
              fullWidth
              label="Password"
              type={showPass ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              sx={{ mb: 3 }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <LockOutlinedIcon sx={{ color: "#94A3B8" }} />
                  </InputAdornment>
                ),
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton onClick={() => setShowPass(!showPass)} edge="end">
                      {showPass ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              size="large"
              disabled={loading}
              sx={{ py: 1.4, fontSize: "1rem" }}
            >
              {loading ? <CircularProgress size={22} color="inherit" /> : "Sign In"}
            </Button>
          </Box>

          <Typography variant="caption" color="text.secondary" sx={{ display: "block", textAlign: "center", mt: 3 }}>
            HR Management System © 2026
          </Typography>
        </CardContent>
      </Card>
    </Box>
  );
}

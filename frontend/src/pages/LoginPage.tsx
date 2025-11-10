// frontend/src/pages/LoginPage.tsx
import React, { useState } from "react";
import { Link as RouterLink, useNavigate } from "react-router-dom";
import {
  Container,
  Paper,
  TextField,
  Button,
  Typography,
  Box,
  InputAdornment,
  Link,
  Stack
} from "@mui/material";
import { Email, Lock } from "@mui/icons-material";
import { useAuth } from "../context/AuthContext";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { login } = useAuth();
  const navigate = useNavigate();

  // NOTE: async is required because we use await inside
  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const profile = await login(email, password);
      if (profile.role === "BROKER" && profile.brokerId) {
        navigate("/broker/dashboard", { replace: true });
      } else if (profile.role === "CUSTOMER" && profile.customerId) {
        navigate("/customer/dashboard", { replace: true });
      } else {
        navigate("/", { replace: true });
      }
    } catch (err: any) {
      // Try to display meaningful error returned from backend
      const msg = err?.response?.data || err?.message || "Login failed";
      setError(typeof msg === "string" ? msg : JSON.stringify(msg));
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
        background: "linear-gradient(135deg, #0d47a1 0%, #42a5f5 45%, #90caf9 100%)",
        py: 6,
        px: 2,
      }}
    >
      <Container maxWidth="sm">
        <Paper
          elevation={6}
          sx={{
            p: { xs: 4, md: 6 },
            borderRadius: 4,
            backdropFilter: "blur(8px)",
          }}
        >
          <Stack spacing={2} sx={{ textAlign: "center", mb: 3 }}>
            <Typography variant="h4" fontWeight="bold">
              Welcome Back
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Sign in to access personalized dashboards and manage your real estate journey.
            </Typography>
          </Stack>

          <Box component="form" onSubmit={onSubmit} sx={{ display: "grid", gap: 2.5 }}>
            <TextField
              label="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              fullWidth
              required
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Email color="primary" />
                  </InputAdornment>
                ),
              }}
            />

            <TextField
              label="Password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              fullWidth
              required
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Lock color="primary" />
                  </InputAdornment>
                ),
              }}
            />

            {error && (
              <Typography color="error" variant="body2">
                {error}
              </Typography>
            )}

            <Button
              type="submit"
              variant="contained"
              size="large"
              disabled={loading}
              sx={{ mt: 1, borderRadius: 2 }}
            >
              {loading ? "Signing in..." : "Login"}
            </Button>

            <Typography variant="body2" color="text.secondary" textAlign="center">
              Don't have an account?{" "}
              <Link component={RouterLink} to="/signup" underline="hover">
                Create an account
              </Link>
            </Typography>
          </Box>

          <Typography variant="caption" color="text.secondary" display="block" sx={{ mt: 4 }}>
            Developer shortcuts: broker <code>broker@gmail.com / 1111</code>, customer <code>cust@gmail.com / 2222</code>
          </Typography>
        </Paper>
      </Container>
    </Box>
  );
}

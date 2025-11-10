import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import {
  Box,
  Button,
  Container,
  Grid,
  Paper,
  Tab,
  Tabs,
  TextField,
  Typography,
  Alert,
  InputAdornment
} from "@mui/material";
import { Person, Business, Email, Lock, LocationOn, Phone } from "@mui/icons-material";
import { useAuth } from "../context/AuthContext";

const roles = [
  { value: "CUSTOMER", label: "Buyer", icon: Person },
  { value: "BROKER", label: "Broker", icon: Business },
] as const;

type RoleValue = typeof roles[number]["value"];

export default function SignupPage() {
  const [role, setRole] = useState<RoleValue>("CUSTOMER");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [city, setCity] = useState("");
  const [mobile, setMobile] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const { register } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  useEffect(() => {
    const qpRole = searchParams.get("role");
    if (qpRole === "BROKER" || qpRole === "CUSTOMER") {
      setRole(qpRole as RoleValue);
    }
  }, [searchParams]);

  const handleSubmit = async (event: React.FormEvent) => {

    event.preventDefault();

    // Password constraints: min 4 chars (backend), can add more if needed
    if (password.length < 4) {
      setError("Password must be at least 4 characters");
      return;
    }
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const profile = await register({
        role,
        name,
        email,
        password,
        city: city || undefined,
        mobile: mobile || undefined,
      });

      if (profile.role === "BROKER" && profile.brokerId) {
        navigate("/broker/dashboard", { replace: true });
      } else {
        navigate("/customer/dashboard", { replace: true });
      }
    } catch (err: any) {
      const message = err?.response?.data || err?.message || "Registration failed";
      setError(typeof message === "string" ? message : JSON.stringify(message));
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
        background: "linear-gradient(135deg, #1a237e 0%, #3949ab 40%, #8e99f3 100%)",
        py: 6,
        px: 2,
      }}
    >
      <Container maxWidth="md">
        <Paper
          elevation={12}
          sx={{
            borderRadius: 4,
            overflow: "hidden",
            backdropFilter: "blur(6px)",
          }}
        >
          <Grid container>
            <Grid
              item
              xs={12}
              md={5}
              sx={{
                background:
                  "linear-gradient(180deg, rgba(21,101,192,0.95) 0%, rgba(25,118,210,0.85) 100%)",
                color: "white",
                p: { xs: 4, md: 5 },
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
              }}
            >
              <Typography variant="h4" fontWeight="bold" gutterBottom>
                Create Your Account
              </Typography>
              <Typography variant="body1" sx={{ opacity: 0.8 }}>
                Join the platform that connects trusted brokers with eager buyers. Track deals, manage listings, and discover your next property with ease.
              </Typography>
              <Box sx={{ mt: 4 }}>
                <Tabs
                  value={role}
                  onChange={(_, value) => setRole(value as RoleValue)}
                  orientation="vertical"
                  sx={{
                    "& .MuiTab-root": {
                      alignItems: "flex-start",
                      color: "rgba(255,255,255,0.7)",
                      textTransform: "none",
                    },
                    "& .Mui-selected": {
                      color: "white",
                    },
                    "& .MuiTabs-indicator": {
                      backgroundColor: "white",
                    },
                  }}
                >
                  {roles.map(({ value, label, icon: Icon }) => (
                    <Tab
                      key={value}
                      value={value}
                      icon={<Icon />}
                      iconPosition="start"
                      label={label}
                    />
                  ))}
                </Tabs>
              </Box>
            </Grid>

            <Grid item xs={12} md={7}>
              <Box component="form" onSubmit={handleSubmit} sx={{ p: { xs: 4, md: 5 }, display: "grid", gap: 2.5 }}>
                <Typography variant="h5" fontWeight="bold">
                  {role === "BROKER" ? "Broker Registration" : "Buyer Registration"}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Fill in your details below to get started.
                </Typography>

                {error && <Alert severity="error">{error}</Alert>}

                <TextField
                  label={role === "BROKER" ? "Broker Name" : "Full Name"}
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        {role === "BROKER" ? <Business color="primary" /> : <Person color="primary" />}
                      </InputAdornment>
                    ),
                  }}
                />

                <TextField
                  label="Email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Email color="primary" />
                      </InputAdornment>
                    ),
                  }}
                />

                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      label="Password"
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <Lock color="primary" />
                          </InputAdornment>
                        ),
                      }}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      label="Confirm Password"
                      type="password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      required
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <Lock color="primary" />
                          </InputAdornment>
                        ),
                      }}
                    />
                  </Grid>
                </Grid>

                <TextField
                  label="City"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <LocationOn color="primary" />
                      </InputAdornment>
                    ),
                  }}
                />

                <TextField
                  label="Mobile"
                  value={mobile}
                  onChange={(e) => setMobile(e.target.value)}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Phone color="primary" />
                      </InputAdornment>
                    ),
                  }}
                />

                <Button
                  type="submit"
                  variant="contained"
                  size="large"
                  disabled={loading}
                  sx={{ mt: 1, borderRadius: 2 }}
                >
                  {loading ? "Creating account..." : "Create Account"}
                </Button>

                <Typography variant="caption" color="text.secondary">
                  By continuing you agree to our terms and acknowledge reading our privacy policy.
                </Typography>
              </Box>
            </Grid>
          </Grid>
        </Paper>
      </Container>
    </Box>
  );
}

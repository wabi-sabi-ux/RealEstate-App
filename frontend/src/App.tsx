import { Routes, Route, Navigate } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ThemeProvider, CssBaseline } from "@mui/material";
import { theme } from "./theme";
import Navbar from "./components/Navbar";
import ProtectedRoute from "./components/ProtectedRoute";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import Properties from "./pages/Properties";
import PropertyDetails from "./pages/PropertyDetails";
import BrokerList from "./pages/BrokerList";
import BrokerDashboard from "./pages/BrokerDashboard";
import CustomerDashboard from "./pages/CustomerDashboard";

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Navbar />
        <main className="py-6">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<SignupPage />} />
            <Route path="/properties" element={<Properties />} />
            <Route path="/properties/:id" element={<PropertyDetails />} />
            <Route path="/brokers" element={<BrokerList />} />
            <Route
              path="/broker/dashboard"
              element={
                <ProtectedRoute requiredRole="BROKER">
                  <BrokerDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/broker/properties"
              element={
                <ProtectedRoute requiredRole="BROKER">
                  <BrokerDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/broker/add-property"
              element={
                <ProtectedRoute requiredRole="BROKER">
                  <BrokerDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/customer/dashboard"
              element={
                <ProtectedRoute requiredRole="CUSTOMER">
                  <CustomerDashboard />
                </ProtectedRoute>
              }
            />
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </main>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;

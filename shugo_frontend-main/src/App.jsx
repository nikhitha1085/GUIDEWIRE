import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useThemeStore } from './store/themeStore';

// Components
import Layout from './components/Layout';
import PublicRoute from './routes/PublicRoute';

// Pages
import Homepage from './pages/Homepage';
import Login from './pages/Auth/Login';
import Register from './pages/Auth/Register';
import Dashboard from './pages/Dashboard';
import Policy from './pages/Policy';
import Premium from './pages/Premium';
import Claims from './pages/Claims';
import ClaimDetail from './pages/ClaimDetail';

const App = () => {
  const { initTheme } = useThemeStore();

  useEffect(() => {
    initTheme();
  }, [initTheme]);

  return (
    <Router>
      <Routes>
        {/* Landing Page */}
        <Route path="/" element={<Homepage />} />

        {/* Public Auth Routes */}
        <Route 
          path="/login" 
          element={
            <PublicRoute>
              <Login />
            </PublicRoute>
          } 
        />
        <Route 
          path="/register" 
          element={
            <PublicRoute>
              <Register />
            </PublicRoute>
          } 
        />

        {/* Dashboard Routes - NOW PUBLIC (Demo Mode handles auth logic inside) */}
        <Route element={<Layout />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/policy" element={<Policy />} />
          <Route path="/premium" element={<Premium />} />
          <Route path="/claims" element={<Claims />} />
          <Route path="/claims/:id" element={<ClaimDetail />} />
        </Route>

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
};

export default App;

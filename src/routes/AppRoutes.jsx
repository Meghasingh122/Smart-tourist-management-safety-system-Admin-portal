import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import DashboardPage from '../pages/Dashboard/DashboardPage';
import LiveTrackingPage from '../pages/Tracking/LiveTrackingPage';
import AlertManagementPage from '../pages/Alerts/AlertManagementPage';
import IncidentManagementPage from '../pages/Incidents/IncidentManagementPage';
import GeoFencePage from '../pages/GeoFence/GeoFencePage';
import TouristManagementPage from '../pages/Tourists/TouristManagementPage';
import ReportsPage from '../pages/Reports/ReportsPage';
import SettingsPage from '../pages/Settings/SettingsPage';
import { useAuth } from '../context/AuthContext';

function ProtectedRoute({ module, children }) {
  const { hasPermission } = useAuth();
  if (!hasPermission(module)) {
    return (
      <div style={{ padding: 40, textAlign: 'center' }}>
        <h2>Access Denied</h2>
        <p>You do not have permission to view this module.</p>
      </div>
    );
  }
  return children;
}

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<ProtectedRoute module="dashboard"><DashboardPage /></ProtectedRoute>} />
      <Route path="/tracking" element={<ProtectedRoute module="tracking"><LiveTrackingPage /></ProtectedRoute>} />
      <Route path="/alerts" element={<ProtectedRoute module="alerts"><AlertManagementPage /></ProtectedRoute>} />
      <Route path="/incidents" element={<ProtectedRoute module="incidents"><IncidentManagementPage /></ProtectedRoute>} />
      <Route path="/geofence" element={<ProtectedRoute module="geofence"><GeoFencePage /></ProtectedRoute>} />
      <Route path="/tourists" element={<ProtectedRoute module="tourists"><TouristManagementPage /></ProtectedRoute>} />
      <Route path="/reports" element={<ProtectedRoute module="reports"><ReportsPage /></ProtectedRoute>} />
      <Route path="/settings" element={<ProtectedRoute module="settings"><SettingsPage /></ProtectedRoute>} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  Box, Drawer, AppBar, Toolbar, Typography, IconButton, List, ListItem,
  ListItemButton, ListItemIcon, ListItemText, Avatar, Badge, Tooltip,
  Divider, useTheme, Menu, MenuItem, Chip,
} from '@mui/material';
import {
  Dashboard as DashboardIcon,
  Map as MapIcon,
  NotificationsActive as AlertIcon,
  ReportProblem as IncidentIcon,
  Fence as GeoIcon,
  People as TouristIcon,
  Assessment as ReportIcon,
  Settings as SettingsIcon,
  Menu as MenuIcon,
  DarkMode,
  LightMode,
  Notifications,
  AccountCircle,
  ChevronLeft,
} from '@mui/icons-material';
import { useThemeMode } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';
import { useSocket } from '../context/SocketContext';

const DRAWER_WIDTH = 270;

const NAV_ITEMS = [
  { label: 'Dashboard', icon: <DashboardIcon />, path: '/', module: 'dashboard' },
  { label: 'Live Tracking', icon: <MapIcon />, path: '/tracking', module: 'tracking' },
  { label: 'Alerts', icon: <AlertIcon />, path: '/alerts', module: 'alerts' },
  { label: 'Incidents', icon: <IncidentIcon />, path: '/incidents', module: 'incidents' },
  { label: 'Geo-Fence', icon: <GeoIcon />, path: '/geofence', module: 'geofence' },
  { label: 'Tourists', icon: <TouristIcon />, path: '/tourists', module: 'tourists' },
  { label: 'Reports', icon: <ReportIcon />, path: '/reports', module: 'reports' },
  { label: 'Settings', icon: <SettingsIcon />, path: '/settings', module: 'settings' },
];

export default function MainLayout({ children }) {
  const theme = useTheme();
  const { mode, toggleTheme } = useThemeMode();
  const { currentUser, hasPermission, switchRole, ROLES } = useAuth();
  const { liveAlerts, connected } = useSocket();
  const navigate = useNavigate();
  const location = useLocation();

  const [drawerOpen, setDrawerOpen] = useState(true);
  const [anchorEl, setAnchorEl] = useState(null);
  const [roleAnchor, setRoleAnchor] = useState(null);

  const visibleNav = NAV_ITEMS.filter((item) => hasPermission(item.module));

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh' }}>
      {/* ────── SIDEBAR ────── */}
      <Drawer
        variant="permanent"
        open={drawerOpen}
        sx={{
          width: drawerOpen ? DRAWER_WIDTH : 72,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: drawerOpen ? DRAWER_WIDTH : 72,
            transition: 'width 0.3s',
            overflowX: 'hidden',
            background: mode === 'light'
              ? 'linear-gradient(195deg, #0D47A1, #1565C0 40%, #1E88E5)'
              : 'linear-gradient(195deg, #0A1929, #132F4C)',
            color: '#fff',
            borderRight: 'none',
          },
        }}
      >
        {/* Logo area */}
        <Toolbar sx={{ justifyContent: drawerOpen ? 'space-between' : 'center', px: 2 }}>
          {drawerOpen && (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Box sx={{
                width: 36, height: 36, borderRadius: '10px',
                background: 'rgba(255,255,255,0.2)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontWeight: 800, fontSize: 14,
              }}>
                ST
              </Box>
              <Box>
                <Typography variant="subtitle2" sx={{ fontWeight: 700, lineHeight: 1.2 }}>
                  STMSS
                </Typography>
                <Typography variant="caption" sx={{ opacity: 0.7, fontSize: '0.65rem' }}>
                  Admin Portal
                </Typography>
              </Box>
            </Box>
          )}
          <IconButton onClick={() => setDrawerOpen(!drawerOpen)} sx={{ color: '#fff' }}>
            {drawerOpen ? <ChevronLeft /> : <MenuIcon />}
          </IconButton>
        </Toolbar>

        <Divider sx={{ borderColor: 'rgba(255,255,255,0.15)' }} />

        {/* Navigation */}
        <List sx={{ px: 1, mt: 1 }}>
          {visibleNav.map((item) => {
            const active = location.pathname === item.path;
            return (
              <ListItem key={item.path} disablePadding sx={{ mb: 0.5 }}>
                <Tooltip title={!drawerOpen ? item.label : ''} placement="right">
                  <ListItemButton
                    onClick={() => navigate(item.path)}
                    sx={{
                      borderRadius: 2,
                      minHeight: 44,
                      px: 2,
                      justifyContent: drawerOpen ? 'initial' : 'center',
                      bgcolor: active ? 'rgba(255,255,255,0.18)' : 'transparent',
                      '&:hover': { bgcolor: 'rgba(255,255,255,0.12)' },
                    }}
                  >
                    <ListItemIcon sx={{ color: '#fff', minWidth: drawerOpen ? 40 : 'auto', justifyContent: 'center' }}>
                      {item.icon}
                    </ListItemIcon>
                    {drawerOpen && (
                      <ListItemText
                        primary={item.label}
                        primaryTypographyProps={{ fontSize: '0.875rem', fontWeight: active ? 600 : 400 }}
                      />
                    )}
                  </ListItemButton>
                </Tooltip>
              </ListItem>
            );
          })}
        </List>

        {/* User card at bottom */}
        {drawerOpen && (
          <Box sx={{ mt: 'auto', p: 2 }}>
            <Box sx={{
              p: 1.5, borderRadius: 2, bgcolor: 'rgba(255,255,255,0.1)',
              display: 'flex', alignItems: 'center', gap: 1.5,
            }}>
              <Avatar sx={{ width: 36, height: 36, bgcolor: 'rgba(255,255,255,0.3)', fontSize: 14, fontWeight: 700 }}>
                {currentUser.name.split(' ').map((n) => n[0]).join('')}
              </Avatar>
              <Box>
                <Typography variant="body2" sx={{ fontWeight: 600, lineHeight: 1.2 }}>{currentUser.name}</Typography>
                <Typography variant="caption" sx={{ opacity: 0.7 }}>{currentUser.role}</Typography>
              </Box>
            </Box>
          </Box>
        )}
      </Drawer>

      {/* ────── MAIN ────── */}
      <Box sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
        {/* Top Bar */}
        <AppBar
          position="sticky"
          elevation={0}
          sx={{
            bgcolor: theme.palette.background.paper,
            color: theme.palette.text.primary,
            borderBottom: `1px solid ${theme.palette.divider}`,
          }}
        >
          <Toolbar sx={{ justifyContent: 'space-between' }}>
            <Typography variant="h6" sx={{ fontWeight: 600 }}>
              {NAV_ITEMS.find((n) => n.path === location.pathname)?.label || 'STMSS'}
            </Typography>

            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              {/* Connection status */}
              <Chip
                size="small"
                label={connected ? 'Live' : 'Offline'}
                color={connected ? 'success' : 'default'}
                variant="outlined"
                sx={{ fontWeight: 600, fontSize: '0.7rem' }}
              />

              {/* Role switcher */}
              <Tooltip title="Switch Role (Demo)">
                <Chip
                  size="small"
                  label={currentUser.role}
                  onClick={(e) => setRoleAnchor(e.currentTarget)}
                  color="primary"
                  variant="outlined"
                />
              </Tooltip>
              <Menu anchorEl={roleAnchor} open={Boolean(roleAnchor)} onClose={() => setRoleAnchor(null)}>
                {Object.values(ROLES).map((role) => (
                  <MenuItem key={role} onClick={() => { switchRole(role); setRoleAnchor(null); }}>
                    {role}
                  </MenuItem>
                ))}
              </Menu>

              {/* Theme toggle */}
              <Tooltip title={`Switch to ${mode === 'light' ? 'dark' : 'light'} mode`}>
                <IconButton onClick={toggleTheme} color="inherit">
                  {mode === 'light' ? <DarkMode /> : <LightMode />}
                </IconButton>
              </Tooltip>

              {/* Notifications */}
              <Tooltip title="Live Alerts">
                <IconButton color="inherit" onClick={(e) => setAnchorEl(e.currentTarget)}>
                  <Badge badgeContent={liveAlerts.length} color="error">
                    <Notifications />
                  </Badge>
                </IconButton>
              </Tooltip>
              <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={() => setAnchorEl(null)}
                PaperProps={{ sx: { width: 360, maxHeight: 400 } }}
              >
                {liveAlerts.length === 0 && <MenuItem disabled>No live alerts</MenuItem>}
                {liveAlerts.slice(0, 8).map((a) => (
                  <MenuItem key={a.id} onClick={() => { setAnchorEl(null); navigate('/alerts'); }}>
                    <Box>
                      <Typography variant="body2" fontWeight={600}>{a.type} – {a.priority}</Typography>
                      <Typography variant="caption" color="text.secondary">{a.message}</Typography>
                    </Box>
                  </MenuItem>
                ))}
              </Menu>

              {/* User avatar */}
              <Avatar sx={{ width: 34, height: 34, bgcolor: theme.palette.primary.main, fontSize: 14, fontWeight: 700 }}>
                {currentUser.name.split(' ').map((n) => n[0]).join('')}
              </Avatar>
            </Box>
          </Toolbar>
        </AppBar>

        {/* Page content */}
        <Box component="main" sx={{ flexGrow: 1, p: 3, bgcolor: theme.palette.background.default }}>
          {children}
        </Box>
      </Box>
    </Box>
  );
}

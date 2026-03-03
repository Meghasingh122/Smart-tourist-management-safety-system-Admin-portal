import React, { useEffect, useState } from 'react';
import {
  Box, Grid, Paper, Tabs, Tab, Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  Typography, Switch, TextField, Button, Avatar, Chip, Divider, useTheme, FormControlLabel,
  List, ListItem, ListItemText, ListItemIcon,
} from '@mui/material';
import {
  People, Security, Notifications as NotifIcon, Storage, Shield,
  Email, Sms, Warning as WarningIcon,
} from '@mui/icons-material';
import { PageHeader, StatusChip, PageCard } from '../../components/common';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';

function TabPanel({ children, value, index }) {
  return value === index ? <Box sx={{ pt: 2 }}>{children}</Box> : null;
}

export default function SettingsPage() {
  const theme = useTheme();
  const { currentUser } = useAuth();
  const [tab, setTab] = useState(0);
  const [adminUsers, setAdminUsers] = useState([]);
  const [systemLogs, setSystemLogs] = useState([]);
  const [notifSettings, setNotifSettings] = useState({
    emailAlerts: true,
    smsAlerts: true,
    sosNotifications: true,
    geoFenceNotifications: true,
    dailyReport: false,
  });

  useEffect(() => {
    Promise.all([api.getAdminUsers(), api.getSystemLogs()]).then(([users, logs]) => {
      setAdminUsers(users);
      setSystemLogs(logs);
    });
  }, []);

  return (
    <Box>
      <PageHeader title="Admin Settings" subtitle="Manage users, roles, notifications, and system configuration" />

      <Paper sx={{ mb: 3 }}>
        <Tabs value={tab} onChange={(_, v) => setTab(v)} variant="scrollable" scrollButtons="auto">
          <Tab icon={<People />} iconPosition="start" label="Admin Users" />
          <Tab icon={<Security />} iconPosition="start" label="Role Access" />
          <Tab icon={<NotifIcon />} iconPosition="start" label="Notifications" />
          <Tab icon={<Storage />} iconPosition="start" label="System Logs" />
        </Tabs>
      </Paper>

      {/* ── Tab 0: Admin Users ── */}
      <TabPanel value={tab} index={0}>
        <Paper>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>ID</TableCell>
                  <TableCell>Name</TableCell>
                  <TableCell>Role</TableCell>
                  <TableCell>Email</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Last Login</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {adminUsers.map((u) => (
                  <TableRow key={u.id} hover>
                    <TableCell sx={{ fontWeight: 600 }}>{u.id}</TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Avatar sx={{ width: 28, height: 28, fontSize: 12, bgcolor: theme.palette.primary.main }}>
                          {u.name.split(' ').map((n) => n[0]).join('')}
                        </Avatar>
                        {u.name}
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={u.role} size="small"
                        color={u.role === 'Super Admin' ? 'error' : u.role === 'Police Officer' ? 'warning' : 'info'}
                        variant="outlined"
                        sx={{ fontWeight: 600 }}
                      />
                    </TableCell>
                    <TableCell>{u.email}</TableCell>
                    <TableCell><StatusChip label={u.status} /></TableCell>
                    <TableCell sx={{ fontSize: '0.75rem' }}>{new Date(u.lastLogin).toLocaleString()}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>
      </TabPanel>

      {/* ── Tab 1: Role-Based Access ── */}
      <TabPanel value={tab} index={1}>
        <Grid container spacing={2.5}>
          {[
            {
              role: 'Super Admin',
              icon: <Shield sx={{ fontSize: 40, color: theme.palette.error.main }} />,
              perms: ['Dashboard', 'Live Tracking', 'Alerts', 'Incidents', 'Geo-Fence', 'Tourists', 'Reports', 'Settings'],
              color: theme.palette.error.light,
            },
            {
              role: 'Police Officer',
              icon: <Security sx={{ fontSize: 40, color: theme.palette.warning.main }} />,
              perms: ['Dashboard', 'Live Tracking', 'Alerts', 'Incidents', 'Tourists', 'Reports'],
              color: theme.palette.warning.light,
            },
            {
              role: 'Tourism Officer',
              icon: <People sx={{ fontSize: 40, color: theme.palette.info.main }} />,
              perms: ['Dashboard', 'Live Tracking', 'Tourists', 'Reports', 'Geo-Fence'],
              color: theme.palette.info.light,
            },
          ].map((r) => (
            <Grid size={{ xs: 12, md: 4 }} key={r.role}>
              <PageCard>
                <Box sx={{ textAlign: 'center', mb: 2 }}>
                  {r.icon}
                  <Typography variant="h6" fontWeight={700} sx={{ mt: 1 }}>{r.role}</Typography>
                </Box>
                <Divider sx={{ mb: 1.5 }} />
                <Typography variant="subtitle2" color="text.secondary" gutterBottom>Accessible Modules</Typography>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                  {r.perms.map((p) => (
                    <Chip key={p} label={p} size="small" sx={{ bgcolor: r.color + '30', fontWeight: 500 }} />
                  ))}
                </Box>
              </PageCard>
            </Grid>
          ))}
        </Grid>
      </TabPanel>

      {/* ── Tab 2: Notifications ── */}
      <TabPanel value={tab} index={2}>
        <Grid container spacing={2.5}>
          <Grid size={{ xs: 12, md: 6 }}>
            <PageCard title="Notification Preferences">
              <List>
                <ListItem>
                  <ListItemIcon><Email color="primary" /></ListItemIcon>
                  <ListItemText primary="Email Alerts" secondary="Receive alert notifications via email" />
                  <Switch
                    checked={notifSettings.emailAlerts}
                    onChange={(e) => setNotifSettings({ ...notifSettings, emailAlerts: e.target.checked })}
                  />
                </ListItem>
                <ListItem>
                  <ListItemIcon><Sms color="primary" /></ListItemIcon>
                  <ListItemText primary="SMS Alerts" secondary="Receive critical alerts via SMS" />
                  <Switch
                    checked={notifSettings.smsAlerts}
                    onChange={(e) => setNotifSettings({ ...notifSettings, smsAlerts: e.target.checked })}
                  />
                </ListItem>
                <ListItem>
                  <ListItemIcon><WarningIcon color="error" /></ListItemIcon>
                  <ListItemText primary="SOS Notifications" secondary="Instant alerts for SOS triggers" />
                  <Switch
                    checked={notifSettings.sosNotifications}
                    onChange={(e) => setNotifSettings({ ...notifSettings, sosNotifications: e.target.checked })}
                  />
                </ListItem>
                <ListItem>
                  <ListItemIcon><Security color="warning" /></ListItemIcon>
                  <ListItemText primary="Geo-fence Notifications" secondary="Alerts when tourists breach geo-fences" />
                  <Switch
                    checked={notifSettings.geoFenceNotifications}
                    onChange={(e) => setNotifSettings({ ...notifSettings, geoFenceNotifications: e.target.checked })}
                  />
                </ListItem>
                <ListItem>
                  <ListItemIcon><NotifIcon color="info" /></ListItemIcon>
                  <ListItemText primary="Daily Summary Report" secondary="Receive a daily digest at 08:00" />
                  <Switch
                    checked={notifSettings.dailyReport}
                    onChange={(e) => setNotifSettings({ ...notifSettings, dailyReport: e.target.checked })}
                  />
                </ListItem>
              </List>
              <Button variant="contained" sx={{ mt: 1 }}>Save Preferences</Button>
            </PageCard>
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <PageCard title="Current User">
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                <Avatar sx={{ width: 56, height: 56, bgcolor: theme.palette.primary.main, fontSize: 20 }}>
                  {currentUser.name.split(' ').map((n) => n[0]).join('')}
                </Avatar>
                <Box>
                  <Typography variant="h6" fontWeight={600}>{currentUser.name}</Typography>
                  <Typography variant="body2" color="text.secondary">{currentUser.email}</Typography>
                  <Chip label={currentUser.role} size="small" color="primary" sx={{ mt: 0.5 }} />
                </Box>
              </Box>
            </PageCard>
          </Grid>
        </Grid>
      </TabPanel>

      {/* ── Tab 3: System Logs ── */}
      <TabPanel value={tab} index={3}>
        <Paper>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>#</TableCell>
                  <TableCell>Timestamp</TableCell>
                  <TableCell>User</TableCell>
                  <TableCell>Action</TableCell>
                  <TableCell>Details</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {systemLogs.map((log) => (
                  <TableRow key={log.id} hover>
                    <TableCell>{log.id}</TableCell>
                    <TableCell sx={{ fontSize: '0.75rem' }}>{new Date(log.timestamp).toLocaleString()}</TableCell>
                    <TableCell>{log.user}</TableCell>
                    <TableCell>
                      <Chip label={log.action} size="small" variant="outlined" />
                    </TableCell>
                    <TableCell sx={{ fontSize: '0.8rem', color: theme.palette.text.secondary }}>{log.details}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>
      </TabPanel>
    </Box>
  );
}

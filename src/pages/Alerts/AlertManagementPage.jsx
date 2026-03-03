import React, { useEffect, useState } from 'react';
import {
  Box, Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  Paper, Button, TextField, MenuItem, IconButton, Drawer, Typography,
  Dialog, DialogTitle, DialogContent, DialogActions, Divider, Chip, Grid, useTheme,
} from '@mui/material';
import {
  Assignment, LocalPolice, Chat, Close, Visibility, FilterList,
} from '@mui/icons-material';
import { PageHeader, StatusChip, PageCard } from '../../components/common';
import { useSocket } from '../../context/SocketContext';
import api from '../../services/api';

export default function AlertManagementPage() {
  const theme = useTheme();
  const { liveAlerts } = useSocket();

  const [alerts, setAlerts] = useState([]);
  const [typeFilter, setTypeFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');
  const [priorityFilter, setPriorityFilter] = useState('All');
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [selectedAlert, setSelectedAlert] = useState(null);
  const [chatOpen, setChatOpen] = useState(false);
  const [chatMsg, setChatMsg] = useState('');
  const [chatHistory, setChatHistory] = useState([]);

  useEffect(() => {
    api.getAlerts().then(setAlerts);
  }, []);

  // Merge live alerts
  const allAlerts = [...liveAlerts, ...alerts];

  const filtered = allAlerts.filter((a) => {
    if (typeFilter !== 'All' && a.type !== typeFilter) return false;
    if (statusFilter !== 'All' && a.status !== statusFilter) return false;
    if (priorityFilter !== 'All' && a.priority !== priorityFilter) return false;
    return true;
  });

  const openDetail = (alert) => { setSelectedAlert(alert); setDrawerOpen(true); };

  const handleAssign = async (id) => {
    const updated = await api.assignAlert(id, 'Team Alpha');
    setAlerts((prev) => prev.map((a) => (a.id === id ? { ...a, ...updated } : a)));
  };

  const handleSendChat = () => {
    if (!chatMsg.trim()) return;
    setChatHistory((prev) => [...prev, { from: 'Admin', text: chatMsg, time: new Date().toLocaleTimeString() }]);
    setChatMsg('');
    // simulate tourist reply
    setTimeout(() => {
      setChatHistory((prev) => [...prev, { from: 'Tourist', text: 'Thank you, help is on the way!', time: new Date().toLocaleTimeString() }]);
    }, 1500);
  };

  return (
    <Box>
      <PageHeader title="Alert Management" subtitle="Monitor, assign, and resolve security alerts in real-time" />

      {/* Filters */}
      <Paper sx={{ p: 2, mb: 2, display: 'flex', gap: 2, flexWrap: 'wrap', alignItems: 'center' }}>
        <FilterList color="action" />
        <TextField size="small" select label="Type" value={typeFilter} onChange={(e) => setTypeFilter(e.target.value)} sx={{ width: 180 }}>
          {['All', 'SOS', 'Geo-fence Breach', 'AI Anomaly'].map((t) => <MenuItem key={t} value={t}>{t}</MenuItem>)}
        </TextField>
        <TextField size="small" select label="Priority" value={priorityFilter} onChange={(e) => setPriorityFilter(e.target.value)} sx={{ width: 150 }}>
          {['All', 'High', 'Medium', 'Low'].map((p) => <MenuItem key={p} value={p}>{p}</MenuItem>)}
        </TextField>
        <TextField size="small" select label="Status" value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} sx={{ width: 150 }}>
          {['All', 'New', 'Assigned', 'Resolved'].map((s) => <MenuItem key={s} value={s}>{s}</MenuItem>)}
        </TextField>
        <Chip label={`${filtered.length} alerts`} color="error" size="small" />
      </Paper>

      {/* Alert Table */}
      <Paper>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>ID</TableCell>
                <TableCell>Type</TableCell>
                <TableCell>Priority</TableCell>
                <TableCell>Tourist</TableCell>
                <TableCell>Zone</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Time</TableCell>
                <TableCell align="center">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filtered.slice(0, 25).map((a) => (
                <TableRow key={a.id} hover sx={{ cursor: 'pointer' }}>
                  <TableCell sx={{ fontWeight: 600 }}>{a.id}</TableCell>
                  <TableCell><StatusChip label={a.type} /></TableCell>
                  <TableCell><StatusChip label={a.priority} /></TableCell>
                  <TableCell>{a.touristName}</TableCell>
                  <TableCell>{a.zone}</TableCell>
                  <TableCell><StatusChip label={a.status} /></TableCell>
                  <TableCell sx={{ fontSize: '0.75rem' }}>{new Date(a.timestamp).toLocaleString()}</TableCell>
                  <TableCell align="center">
                    <IconButton size="small" color="primary" onClick={() => openDetail(a)}><Visibility fontSize="small" /></IconButton>
                    <IconButton size="small" color="warning" onClick={() => handleAssign(a.id)}><Assignment fontSize="small" /></IconButton>
                    <IconButton size="small" color="error" onClick={() => openDetail(a)}><LocalPolice fontSize="small" /></IconButton>
                    <IconButton size="small" color="info" onClick={() => { setSelectedAlert(a); setChatOpen(true); }}><Chat fontSize="small" /></IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>

      {/* ── Alert Detail Drawer ── */}
      <Drawer anchor="right" open={drawerOpen} onClose={() => setDrawerOpen(false)} PaperProps={{ sx: { width: 420, p: 3 } }}>
        {selectedAlert && (
          <Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
              <Typography variant="h6" fontWeight={700}>Alert Detail</Typography>
              <IconButton onClick={() => setDrawerOpen(false)}><Close /></IconButton>
            </Box>
            <Divider sx={{ mb: 2 }} />

            <Typography variant="subtitle2" color="text.secondary">Alert ID</Typography>
            <Typography variant="body1" fontWeight={600} sx={{ mb: 1.5 }}>{selectedAlert.id}</Typography>

            <Grid container spacing={2}>
              <Grid size={{ xs: 6 }}>
                <Typography variant="subtitle2" color="text.secondary">Type</Typography>
                <StatusChip label={selectedAlert.type} />
              </Grid>
              <Grid size={{ xs: 6 }}>
                <Typography variant="subtitle2" color="text.secondary">Priority</Typography>
                <StatusChip label={selectedAlert.priority} />
              </Grid>
              <Grid size={{ xs: 6 }}>
                <Typography variant="subtitle2" color="text.secondary">Status</Typography>
                <StatusChip label={selectedAlert.status} />
              </Grid>
              <Grid size={{ xs: 6 }}>
                <Typography variant="subtitle2" color="text.secondary">Assigned To</Typography>
                <Typography variant="body2">{selectedAlert.assignedTo || 'Unassigned'}</Typography>
              </Grid>
            </Grid>

            <Divider sx={{ my: 2 }} />

            <Typography variant="subtitle2" color="text.secondary">Tourist Information</Typography>
            <Typography variant="body2">Name: {selectedAlert.touristName}</Typography>
            <Typography variant="body2">ID: {selectedAlert.touristId}</Typography>
            <Typography variant="body2">Zone: {selectedAlert.zone}</Typography>
            <Typography variant="body2">Location: {selectedAlert.lat?.toFixed(4)}, {selectedAlert.lng?.toFixed(4)}</Typography>

            <Divider sx={{ my: 2 }} />
            <Typography variant="body2" color="text.secondary">{selectedAlert.message}</Typography>

            <Box sx={{ mt: 3, display: 'flex', gap: 1 }}>
              <Button variant="contained" startIcon={<Assignment />} onClick={() => handleAssign(selectedAlert.id)}>
                Assign Team
              </Button>
              <Button variant="outlined" color="error" startIcon={<LocalPolice />}>
                Notify Police
              </Button>
            </Box>
          </Box>
        )}
      </Drawer>

      {/* ── Chat Modal ── */}
      <Dialog open={chatOpen} onClose={() => setChatOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ fontWeight: 700 }}>
          Chat with Tourist
          {selectedAlert && <Typography variant="caption" display="block">{selectedAlert.touristName} ({selectedAlert.touristId})</Typography>}
        </DialogTitle>
        <DialogContent>
          <Box sx={{ minHeight: 200, maxHeight: 300, overflowY: 'auto', mb: 2, p: 1, bgcolor: theme.palette.background.default, borderRadius: 2 }}>
            {chatHistory.length === 0 && <Typography variant="body2" color="text.secondary">No messages yet</Typography>}
            {chatHistory.map((msg, i) => (
              <Box key={i} sx={{ mb: 1, textAlign: msg.from === 'Admin' ? 'right' : 'left' }}>
                <Chip
                  label={msg.text}
                  color={msg.from === 'Admin' ? 'primary' : 'default'}
                  sx={{ maxWidth: '80%' }}
                />
                <Typography variant="caption" display="block" color="text.secondary">{msg.from} · {msg.time}</Typography>
              </Box>
            ))}
          </Box>
          <TextField
            fullWidth size="small" placeholder="Type a message..."
            value={chatMsg} onChange={(e) => setChatMsg(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSendChat()}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setChatOpen(false)}>Close</Button>
          <Button variant="contained" onClick={handleSendChat}>Send</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

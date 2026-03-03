import React, { useEffect, useState } from 'react';
import {
  Box, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  TextField, InputAdornment, IconButton, Dialog, DialogTitle, DialogContent,
  Typography, Grid, Divider, Avatar, useTheme, Chip, MenuItem,
} from '@mui/material';
import { Search, Visibility, QrCode2, Phone, Email, History } from '@mui/icons-material';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip as RTooltip, ResponsiveContainer } from 'recharts';
import { PageHeader, StatusChip, PageCard } from '../../components/common';
import api from '../../services/api';

export default function TouristManagementPage() {
  const theme = useTheme();
  const [tourists, setTourists] = useState([]);
  const [search, setSearch] = useState('');
  const [zoneFilter, setZoneFilter] = useState('All');
  const [selected, setSelected] = useState(null);
  const [profileOpen, setProfileOpen] = useState(false);

  useEffect(() => {
    api.getTourists().then(setTourists);
  }, []);

  const zones = ['All', 'Zone A – Heritage', 'Zone B – Beach', 'Zone C – Market', 'Zone D – Hill Station', 'Zone E – Wildlife'];

  const filtered = tourists.filter((t) => {
    if (search && !t.name.toLowerCase().includes(search.toLowerCase()) && !t.id.toLowerCase().includes(search.toLowerCase())) return false;
    if (zoneFilter !== 'All' && t.zone !== zoneFilter) return false;
    return true;
  });

  const openProfile = (tourist) => { setSelected(tourist); setProfileOpen(true); };

  return (
    <Box>
      <PageHeader title="Tourist Management" subtitle="View and manage registered tourist profiles" />

      {/* Search/Filter */}
      <Paper sx={{ p: 2, mb: 2, display: 'flex', gap: 2, flexWrap: 'wrap', alignItems: 'center' }}>
        <TextField
          size="small" placeholder="Search by name or ID" value={search}
          onChange={(e) => setSearch(e.target.value)}
          InputProps={{ startAdornment: <InputAdornment position="start"><Search fontSize="small" /></InputAdornment> }}
          sx={{ width: 280 }}
        />
        <TextField size="small" select label="Zone" value={zoneFilter} onChange={(e) => setZoneFilter(e.target.value)} sx={{ width: 220 }}>
          {zones.map((z) => <MenuItem key={z} value={z}>{z}</MenuItem>)}
        </TextField>
        <Chip label={`${filtered.length} tourists`} size="small" color="primary" />
      </Paper>

      {/* Tourist Table */}
      <Paper>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>ID</TableCell>
                <TableCell>Name</TableCell>
                <TableCell>Nationality</TableCell>
                <TableCell>Zone</TableCell>
                <TableCell>Risk Level</TableCell>
                <TableCell>Safety Score</TableCell>
                <TableCell>Status</TableCell>
                <TableCell align="center">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filtered.slice(0, 30).map((t) => (
                <TableRow key={t.id} hover sx={{ cursor: 'pointer' }} onClick={() => openProfile(t)}>
                  <TableCell sx={{ fontWeight: 600 }}>{t.id}</TableCell>
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Avatar sx={{ width: 28, height: 28, fontSize: 12, bgcolor: theme.palette.primary.main }}>
                        {t.firstName[0]}{t.lastName[0]}
                      </Avatar>
                      {t.name}
                    </Box>
                  </TableCell>
                  <TableCell>{t.nationality}</TableCell>
                  <TableCell>{t.zone}</TableCell>
                  <TableCell><StatusChip label={t.riskLevel} /></TableCell>
                  <TableCell>
                    <Chip
                      label={t.safetyScore}
                      size="small"
                      sx={{
                        fontWeight: 700,
                        bgcolor: t.safetyScore >= 70 ? theme.palette.success.light : t.safetyScore >= 50 ? theme.palette.warning.light : theme.palette.error.light,
                        color: '#fff',
                      }}
                    />
                  </TableCell>
                  <TableCell><StatusChip label={t.status} /></TableCell>
                  <TableCell align="center">
                    <IconButton size="small" color="primary"><Visibility fontSize="small" /></IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>

      {/* ── Tourist Profile Dialog ── */}
      <Dialog open={profileOpen} onClose={() => setProfileOpen(false)} maxWidth="md" fullWidth>
        {selected && (
          <>
            <DialogTitle sx={{ fontWeight: 700, pb: 0 }}>
              Tourist Profile
            </DialogTitle>
            <DialogContent>
              <Grid container spacing={3} sx={{ mt: 0 }}>
                {/* Left – Info */}
                <Grid size={{ xs: 12, md: 5 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                    <Avatar sx={{ width: 64, height: 64, bgcolor: theme.palette.primary.main, fontSize: 24 }}>
                      {selected.firstName[0]}{selected.lastName[0]}
                    </Avatar>
                    <Box>
                      <Typography variant="h6" fontWeight={700}>{selected.name}</Typography>
                      <Typography variant="body2" color="text.secondary">{selected.nationality}</Typography>
                      <StatusChip label={selected.status} />
                    </Box>
                  </Box>

                  <Divider sx={{ mb: 2 }} />

                  {/* QR ID */}
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                    <QrCode2 fontSize="small" color="action" />
                    <Typography variant="body2"><strong>QR ID:</strong> {selected.id}</Typography>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                    <Phone fontSize="small" color="action" />
                    <Typography variant="body2"><strong>Phone:</strong> {selected.phone}</Typography>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                    <Email fontSize="small" color="action" />
                    <Typography variant="body2"><strong>Email:</strong> {selected.email}</Typography>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                    <Phone fontSize="small" color="error" />
                    <Typography variant="body2"><strong>Emergency:</strong> {selected.emergencyContact}</Typography>
                  </Box>

                  <Divider sx={{ my: 2 }} />

                  <Typography variant="subtitle2" color="text.secondary" gutterBottom>Current Status</Typography>
                  <Grid container spacing={1}>
                    <Grid size={{ xs: 6 }}><Typography variant="body2"><strong>Zone:</strong> {selected.zone}</Typography></Grid>
                    <Grid size={{ xs: 6 }}><Typography variant="body2"><strong>Risk:</strong></Typography><StatusChip label={selected.riskLevel} /></Grid>
                    <Grid size={{ xs: 6 }}><Typography variant="body2"><strong>Safety Score:</strong> {selected.safetyScore}</Typography></Grid>
                    <Grid size={{ xs: 6 }}><Typography variant="body2"><strong>Registered:</strong> {new Date(selected.registeredAt).toLocaleDateString()}</Typography></Grid>
                  </Grid>

                  <Divider sx={{ my: 2 }} />

                  {/* Trip History */}
                  <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                    <History fontSize="small" sx={{ verticalAlign: 'middle', mr: 0.5 }} />
                    Trip History
                  </Typography>
                  {selected.tripHistory.map((trip, idx) => (
                    <Box key={idx} sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                      <Typography variant="body2">{trip.destination}</Typography>
                      <Typography variant="caption" color="text.secondary">{new Date(trip.date).toLocaleDateString()}</Typography>
                    </Box>
                  ))}
                </Grid>

                {/* Right – Safety Score Chart */}
                <Grid size={{ xs: 12, md: 7 }}>
                  <PageCard title="Safety Score History" subtitle="12-month safety score trend">
                    <ResponsiveContainer width="100%" height={300}>
                      <LineChart data={selected.safetyScoreHistory}>
                        <CartesianGrid strokeDasharray="3 3" stroke={theme.palette.divider} />
                        <XAxis dataKey="month" tick={{ fontSize: 11 }} />
                        <YAxis domain={[0, 100]} tick={{ fontSize: 11 }} />
                        <RTooltip />
                        <Line type="monotone" dataKey="score" stroke={theme.palette.primary.main} strokeWidth={2.5} dot={{ r: 4 }} />
                      </LineChart>
                    </ResponsiveContainer>
                  </PageCard>
                </Grid>
              </Grid>
            </DialogContent>
          </>
        )}
      </Dialog>
    </Box>
  );
}

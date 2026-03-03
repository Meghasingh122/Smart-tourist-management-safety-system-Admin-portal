import React, { useEffect, useState } from 'react';
import {
  Box, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  Button, TextField, MenuItem, Switch, Dialog, DialogTitle, DialogContent,
  DialogActions, Grid, Typography, IconButton, useTheme, Chip,
} from '@mui/material';
import { Add, Edit, Delete, Map as MapIcon } from '@mui/icons-material';
import { GoogleMap, useJsApiLoader, PolygonF } from '@react-google-maps/api';
import { PageHeader, StatusChip } from '../../components/common';
import api from '../../services/api';

const MAP_CENTER = { lat: 15.48, lng: 73.92 };
const RISK_COLORS = { Low: '#4CAF50', Medium: '#FF9800', High: '#F44336', Critical: '#9C27B0' };

export default function GeoFencePage() {
  const theme = useTheme();
  const [zones, setZones] = useState([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editZone, setEditZone] = useState(null);
  const [form, setForm] = useState({ name: '', riskLevel: 'Low', activeTime: '06:00 – 22:00', active: true });

  const { isLoaded } = useJsApiLoader({ googleMapsApiKey: '' });

  useEffect(() => {
    api.getGeoFences().then(setZones);
  }, []);

  const handleToggle = async (id) => {
    await api.toggleGeoFence(id);
    setZones((prev) => prev.map((z) => (z.id === id ? { ...z, active: !z.active } : z)));
  };

  const openCreate = () => {
    setEditZone(null);
    setForm({ name: '', riskLevel: 'Low', activeTime: '06:00 – 22:00', active: true });
    setDialogOpen(true);
  };

  const openEdit = (zone) => {
    setEditZone(zone);
    setForm({ name: zone.name, riskLevel: zone.riskLevel, activeTime: zone.activeTime, active: zone.active });
    setDialogOpen(true);
  };

  const handleSave = async () => {
    if (editZone) {
      setZones((prev) => prev.map((z) => (z.id === editZone.id ? { ...z, ...form } : z)));
    } else {
      const newZone = await api.createGeoFence({
        ...form,
        polygon: [
          { lat: 15.45 + Math.random() * 0.05, lng: 73.85 + Math.random() * 0.05 },
          { lat: 15.46 + Math.random() * 0.05, lng: 73.85 + Math.random() * 0.05 },
          { lat: 15.46 + Math.random() * 0.05, lng: 73.87 + Math.random() * 0.05 },
          { lat: 15.45 + Math.random() * 0.05, lng: 73.87 + Math.random() * 0.05 },
        ],
      });
      setZones((prev) => [...prev, newZone]);
    }
    setDialogOpen(false);
  };

  const handleDelete = (id) => {
    setZones((prev) => prev.filter((z) => z.id !== id));
  };

  const mapContainerStyle = { width: '100%', height: 400, borderRadius: 12 };

  return (
    <Box>
      <PageHeader
        title="Geo-Fence Configuration"
        subtitle="Create, manage, and monitor geographic security zones"
        actions={
          <Button variant="contained" startIcon={<Add />} onClick={openCreate}>
            Create Zone
          </Button>
        }
      />

      {/* Map View */}
      <Paper sx={{ mb: 3, overflow: 'hidden', borderRadius: 3 }}>
        {isLoaded ? (
          <GoogleMap mapContainerStyle={mapContainerStyle} center={MAP_CENTER} zoom={12}>
            {zones.filter((z) => z.active).map((z) => (
              <PolygonF
                key={z.id}
                paths={z.polygon}
                options={{
                  fillColor: RISK_COLORS[z.riskLevel] || '#1565C0',
                  fillOpacity: 0.25,
                  strokeColor: RISK_COLORS[z.riskLevel] || '#1565C0',
                  strokeWeight: 2,
                }}
              />
            ))}
          </GoogleMap>
        ) : (
          <Box sx={{
            ...mapContainerStyle,
            bgcolor: theme.palette.mode === 'light' ? '#e3f2fd' : '#0d2137',
            display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
            border: `2px dashed ${theme.palette.divider}`,
          }}>
            <MapIcon sx={{ fontSize: 56, color: theme.palette.primary.main, mb: 1 }} />
            <Typography variant="h6" color="text.secondary">Geo-Fence Map View</Typography>
            <Typography variant="body2" color="text.secondary">Add Google Maps API key to see polygon zones</Typography>
            <Box sx={{ mt: 2, display: 'flex', flexWrap: 'wrap', gap: 1, justifyContent: 'center' }}>
              {zones.map((z) => (
                <Chip
                  key={z.id}
                  label={`${z.name} (${z.riskLevel})`}
                  size="small"
                  sx={{ bgcolor: z.active ? RISK_COLORS[z.riskLevel] : theme.palette.action.disabledBackground, color: z.active ? '#fff' : undefined }}
                />
              ))}
            </Box>
          </Box>
        )}
      </Paper>

      {/* Zones Table */}
      <Paper>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>ID</TableCell>
                <TableCell>Zone Name</TableCell>
                <TableCell>Risk Level</TableCell>
                <TableCell>Active Time</TableCell>
                <TableCell>Breaches</TableCell>
                <TableCell align="center">Active</TableCell>
                <TableCell align="center">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {zones.map((z) => (
                <TableRow key={z.id} hover>
                  <TableCell sx={{ fontWeight: 600 }}>{z.id}</TableCell>
                  <TableCell>{z.name}</TableCell>
                  <TableCell><StatusChip label={z.riskLevel} /></TableCell>
                  <TableCell>{z.activeTime}</TableCell>
                  <TableCell>{z.breaches}</TableCell>
                  <TableCell align="center">
                    <Switch checked={z.active} onChange={() => handleToggle(z.id)} color="success" />
                  </TableCell>
                  <TableCell align="center">
                    <IconButton size="small" color="primary" onClick={() => openEdit(z)}><Edit fontSize="small" /></IconButton>
                    <IconButton size="small" color="error" onClick={() => handleDelete(z.id)}><Delete fontSize="small" /></IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>

      {/* Create/Edit Dialog */}
      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ fontWeight: 700 }}>{editZone ? 'Edit Zone' : 'Create New Zone'}</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid size={{ xs: 12 }}>
              <TextField fullWidth label="Zone Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
            </Grid>
            <Grid size={{ xs: 6 }}>
              <TextField fullWidth select label="Risk Level" value={form.riskLevel} onChange={(e) => setForm({ ...form, riskLevel: e.target.value })}>
                {['Low', 'Medium', 'High', 'Critical'].map((r) => <MenuItem key={r} value={r}>{r}</MenuItem>)}
              </TextField>
            </Grid>
            <Grid size={{ xs: 6 }}>
              <TextField fullWidth label="Active Time" value={form.activeTime} onChange={(e) => setForm({ ...form, activeTime: e.target.value })} />
            </Grid>
          </Grid>
          <Typography variant="caption" color="text.secondary" sx={{ mt: 2, display: 'block' }}>
            Note: In production, polygon drawing tools would be integrated here for boundary definition.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDialogOpen(false)}>Cancel</Button>
          <Button variant="contained" onClick={handleSave}>
            {editZone ? 'Update' : 'Create'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

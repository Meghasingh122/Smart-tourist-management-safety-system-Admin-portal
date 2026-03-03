import React, { useEffect, useState } from 'react';
import {
  Box, Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  Paper, Button, TextField, MenuItem, IconButton, Typography, Dialog, DialogTitle,
  DialogContent, DialogActions, Grid, ImageList, ImageListItem,
  Stepper, Step, StepLabel, Divider, useTheme, Chip,
} from '@mui/material';
import { Visibility, Download, FilterList, Image as ImageIcon } from '@mui/icons-material';
import { PageHeader, StatusChip } from '../../components/common';
import api from '../../services/api';

export default function IncidentManagementPage() {
  const theme = useTheme();
  const [incidents, setIncidents] = useState([]);
  const [typeFilter, setTypeFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');
  const [selected, setSelected] = useState(null);
  const [detailOpen, setDetailOpen] = useState(false);

  useEffect(() => {
    api.getIncidents().then(setIncidents);
  }, []);

  const types = ['All', 'Theft', 'Harassment', 'Medical Emergency', 'Lost Tourist', 'Wildlife Encounter', 'Traffic Accident'];
  const statuses = ['All', 'Open', 'Under Investigation', 'Resolved', 'Closed'];

  const filtered = incidents.filter((inc) => {
    if (typeFilter !== 'All' && inc.type !== typeFilter) return false;
    if (statusFilter !== 'All' && inc.status !== statusFilter) return false;
    return true;
  });

  const openDetail = (inc) => { setSelected(inc); setDetailOpen(true); };

  const handleStatusChange = async (newStatus) => {
    if (!selected) return;
    await api.updateIncidentStatus(selected.id, newStatus);
    setIncidents((prev) => prev.map((i) => (i.id === selected.id ? { ...i, status: newStatus } : i)));
    setSelected((prev) => ({ ...prev, status: newStatus }));
  };

  const handleDownloadEFIR = () => {
    // Simulate PDF download
    const blob = new Blob([`E-FIR Report\n\nIncident: ${selected?.id}\nType: ${selected?.type}\nDescription: ${selected?.description}\nStatus: ${selected?.status}\nReported: ${selected?.reportedAt}`], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `E-FIR-${selected?.id}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const timelineSteps = selected?.timeline || [];

  return (
    <Box>
      <PageHeader title="Incident Management" subtitle="Track, investigate, and resolve reported incidents" />

      {/* Filters */}
      <Paper sx={{ p: 2, mb: 2, display: 'flex', gap: 2, flexWrap: 'wrap', alignItems: 'center' }}>
        <FilterList color="action" />
        <TextField size="small" select label="Type" value={typeFilter} onChange={(e) => setTypeFilter(e.target.value)} sx={{ width: 200 }}>
          {types.map((t) => <MenuItem key={t} value={t}>{t}</MenuItem>)}
        </TextField>
        <TextField size="small" select label="Status" value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} sx={{ width: 200 }}>
          {statuses.map((s) => <MenuItem key={s} value={s}>{s}</MenuItem>)}
        </TextField>
        <Chip label={`${filtered.length} incidents`} size="small" color="warning" />
      </Paper>

      {/* Table */}
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
                <TableCell>Reported At</TableCell>
                <TableCell align="center">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filtered.map((inc) => (
                <TableRow key={inc.id} hover>
                  <TableCell sx={{ fontWeight: 600 }}>{inc.id}</TableCell>
                  <TableCell>{inc.type}</TableCell>
                  <TableCell><StatusChip label={inc.priority} /></TableCell>
                  <TableCell>{inc.touristName}</TableCell>
                  <TableCell>{inc.zone}</TableCell>
                  <TableCell><StatusChip label={inc.status} /></TableCell>
                  <TableCell sx={{ fontSize: '0.75rem' }}>{new Date(inc.reportedAt).toLocaleString()}</TableCell>
                  <TableCell align="center">
                    <IconButton size="small" color="primary" onClick={() => openDetail(inc)}><Visibility fontSize="small" /></IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>

      {/* ── Incident Detail Dialog ── */}
      <Dialog open={detailOpen} onClose={() => setDetailOpen(false)} maxWidth="md" fullWidth>
        {selected && (
          <>
            <DialogTitle sx={{ fontWeight: 700 }}>
              Incident Detail — {selected.id}
              <Typography variant="caption" display="block" color="text.secondary">{selected.type}</Typography>
            </DialogTitle>
            <DialogContent>
              <Grid container spacing={3}>
                {/* Left – Info */}
                <Grid size={{ xs: 12, md: 7 }}>
                  <Typography variant="subtitle2" color="text.secondary" gutterBottom>Description</Typography>
                  <Typography variant="body2" sx={{ mb: 2 }}>{selected.description}</Typography>

                  <Grid container spacing={2} sx={{ mb: 2 }}>
                    <Grid size={{ xs: 6 }}>
                      <Typography variant="subtitle2" color="text.secondary">Tourist</Typography>
                      <Typography variant="body2">{selected.touristName} ({selected.touristId})</Typography>
                    </Grid>
                    <Grid size={{ xs: 6 }}>
                      <Typography variant="subtitle2" color="text.secondary">Zone</Typography>
                      <Typography variant="body2">{selected.zone}</Typography>
                    </Grid>
                    <Grid size={{ xs: 6 }}>
                      <Typography variant="subtitle2" color="text.secondary">Priority</Typography>
                      <StatusChip label={selected.priority} />
                    </Grid>
                    <Grid size={{ xs: 6 }}>
                      <Typography variant="subtitle2" color="text.secondary">Status</Typography>
                      <StatusChip label={selected.status} />
                    </Grid>
                  </Grid>

                  {/* Status Update */}
                  <TextField
                    size="small" select label="Update Status" value={selected.status}
                    onChange={(e) => handleStatusChange(e.target.value)}
                    sx={{ width: 220, mb: 2 }}
                  >
                    {statuses.filter((s) => s !== 'All').map((s) => <MenuItem key={s} value={s}>{s}</MenuItem>)}
                  </TextField>

                  {/* Evidence Gallery */}
                  <Typography variant="subtitle2" color="text.secondary" sx={{ mt: 1, mb: 1 }}>Evidence Gallery</Typography>
                  <ImageList cols={3} gap={8}>
                    {selected.evidence.map((img, idx) => (
                      <ImageListItem key={idx}>
                        <Box sx={{
                          height: 100, bgcolor: theme.palette.action.hover, borderRadius: 2,
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          border: `1px dashed ${theme.palette.divider}`,
                        }}>
                          <ImageIcon color="action" />
                          <Typography variant="caption" color="text.secondary" sx={{ ml: 0.5 }}>Evidence {idx + 1}</Typography>
                        </Box>
                      </ImageListItem>
                    ))}
                  </ImageList>
                </Grid>

                {/* Right – Timeline */}
                <Grid size={{ xs: 12, md: 5 }}>
                  <Typography variant="subtitle2" color="text.secondary" gutterBottom>Incident Timeline</Typography>
                  <Stepper orientation="vertical" activeStep={timelineSteps.length - 1}>
                    {timelineSteps.map((step, idx) => (
                      <Step key={idx} completed>
                        <StepLabel>
                          <Typography variant="body2" fontWeight={600}>{step.event}</Typography>
                          <Typography variant="caption" color="text.secondary">{step.time}</Typography>
                        </StepLabel>
                      </Step>
                    ))}
                  </Stepper>
                </Grid>
              </Grid>
            </DialogContent>
            <DialogActions>
              <Button startIcon={<Download />} onClick={handleDownloadEFIR} variant="outlined">
                Download E-FIR
              </Button>
              <Button onClick={() => setDetailOpen(false)}>Close</Button>
            </DialogActions>
          </>
        )}
      </Dialog>
    </Box>
  );
}

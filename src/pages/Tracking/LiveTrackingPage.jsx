import React, { useEffect, useState, useMemo, useCallback } from 'react';
import {
  Box, Paper, TextField, MenuItem, Slider, Typography, IconButton, InputAdornment,
  Chip, useTheme, Tooltip, Card, CardContent, Badge,
} from '@mui/material';
import { Search, FilterList, PlayArrow, Pause, MyLocation } from '@mui/icons-material';
import { GoogleMap, useJsApiLoader, MarkerF, InfoWindowF, MarkerClustererF } from '@react-google-maps/api';
import { PageHeader, StatusChip } from '../../components/common';
import { useSocket } from '../../context/SocketContext';
import api from '../../services/api';

const MAP_CENTER = { lat: 15.48, lng: 73.92 };
const RISK_COLORS = { Low: '#4CAF50', Medium: '#FF9800', High: '#F44336', Critical: '#9C27B0' };
const ZONES = ['All', 'Zone A – Heritage', 'Zone B – Beach', 'Zone C – Market', 'Zone D – Hill Station', 'Zone E – Wildlife'];
const RISK_LEVELS = ['All', 'Low', 'Medium', 'High', 'Critical'];

export default function LiveTrackingPage() {
  const theme = useTheme();
  const { locationUpdates } = useSocket();

  const [tourists, setTourists] = useState([]);
  const [searchId, setSearchId] = useState('');
  const [searchName, setSearchName] = useState('');
  const [zoneFilter, setZoneFilter] = useState('All');
  const [riskFilter, setRiskFilter] = useState('All');
  const [selectedTourist, setSelectedTourist] = useState(null);
  const [playbackTime, setPlaybackTime] = useState(0);
  const [playing, setPlaying] = useState(false);

  const { isLoaded } = useJsApiLoader({ googleMapsApiKey: '' });

  useEffect(() => {
    api.getTourists().then(setTourists);
  }, []);

  // Merge live location updates into tourist list
  const mergedTourists = useMemo(() => {
    const map = new Map(tourists.map((t) => [t.id, { ...t }]));
    locationUpdates.forEach((u) => {
      if (map.has(u.id)) {
        const existing = map.get(u.id);
        existing.lat = u.lat;
        existing.lng = u.lng;
        existing.safetyScore = u.safetyScore;
        existing.riskLevel = u.riskLevel;
      }
    });
    return Array.from(map.values());
  }, [tourists, locationUpdates]);

  const filtered = useMemo(() => {
    return mergedTourists.filter((t) => {
      if (searchId && !t.id.toLowerCase().includes(searchId.toLowerCase())) return false;
      if (searchName && !t.name.toLowerCase().includes(searchName.toLowerCase())) return false;
      if (zoneFilter !== 'All' && t.zone !== zoneFilter) return false;
      if (riskFilter !== 'All' && t.riskLevel !== riskFilter) return false;
      return true;
    });
  }, [mergedTourists, searchId, searchName, zoneFilter, riskFilter]);

  // Playback simulation
  useEffect(() => {
    if (!playing) return;
    const iv = setInterval(() => {
      setPlaybackTime((prev) => (prev >= 100 ? 0 : prev + 1));
    }, 500);
    return () => clearInterval(iv);
  }, [playing]);

  const mapContainerStyle = { width: '100%', height: 'calc(100vh - 200px)', borderRadius: 12 };

  return (
    <Box>
      <PageHeader title="Live Tourist Tracking" subtitle="Real-time GPS monitoring with marker clustering and risk indicators" />

      {/* ── Filter Panel ── */}
      <Paper sx={{ p: 2, mb: 2, display: 'flex', gap: 2, flexWrap: 'wrap', alignItems: 'center' }}>
        <TextField
          size="small" placeholder="Search by ID" value={searchId}
          onChange={(e) => setSearchId(e.target.value)}
          InputProps={{ startAdornment: <InputAdornment position="start"><Search fontSize="small" /></InputAdornment> }}
          sx={{ width: 180 }}
        />
        <TextField
          size="small" placeholder="Search by name" value={searchName}
          onChange={(e) => setSearchName(e.target.value)}
          sx={{ width: 200 }}
        />
        <TextField
          size="small" select label="Zone" value={zoneFilter}
          onChange={(e) => setZoneFilter(e.target.value)}
          sx={{ width: 200 }}
        >
          {ZONES.map((z) => <MenuItem key={z} value={z}>{z}</MenuItem>)}
        </TextField>
        <TextField
          size="small" select label="Risk Level" value={riskFilter}
          onChange={(e) => setRiskFilter(e.target.value)}
          sx={{ width: 150 }}
        >
          {RISK_LEVELS.map((r) => <MenuItem key={r} value={r}>{r}</MenuItem>)}
        </TextField>
        <Chip label={`${filtered.length} tourists`} color="primary" size="small" />
      </Paper>

      {/* ── Map Area ── */}
      <Box sx={{ position: 'relative' }}>
        {isLoaded ? (
          <GoogleMap mapContainerStyle={mapContainerStyle} center={MAP_CENTER} zoom={12}>
            <MarkerClustererF>
              {(clusterer) =>
                filtered.map((t) => (
                  <MarkerF
                    key={t.id}
                    position={{ lat: t.lat, lng: t.lng }}
                    clusterer={clusterer}
                    onClick={() => setSelectedTourist(t)}
                    icon={{
                      path: window.google?.maps?.SymbolPath?.CIRCLE || 0,
                      fillColor: RISK_COLORS[t.riskLevel] || '#1565C0',
                      fillOpacity: 0.9,
                      strokeWeight: 2,
                      strokeColor: '#fff',
                      scale: 10,
                    }}
                  />
                ))
              }
            </MarkerClustererF>

            {selectedTourist && (
              <InfoWindowF
                position={{ lat: selectedTourist.lat, lng: selectedTourist.lng }}
                onCloseClick={() => setSelectedTourist(null)}
              >
                <Box sx={{ p: 1, minWidth: 200 }}>
                  <Typography variant="subtitle2" fontWeight={700}>{selectedTourist.name}</Typography>
                  <Typography variant="caption" display="block">ID: {selectedTourist.id}</Typography>
                  <Typography variant="caption" display="block">Zone: {selectedTourist.zone}</Typography>
                  <Typography variant="caption" display="block">Safety Score: {selectedTourist.safetyScore}</Typography>
                  <Chip label={selectedTourist.riskLevel} size="small" sx={{ mt: 0.5, bgcolor: RISK_COLORS[selectedTourist.riskLevel], color: '#fff' }} />
                </Box>
              </InfoWindowF>
            )}
          </GoogleMap>
        ) : (
          /* Fallback map placeholder */
          <Box sx={{
            ...mapContainerStyle,
            bgcolor: theme.palette.mode === 'light' ? '#e8eaf6' : '#1a237e',
            display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
            border: `2px dashed ${theme.palette.divider}`,
          }}>
            <MyLocation sx={{ fontSize: 64, color: theme.palette.primary.main, mb: 2 }} />
            <Typography variant="h6" color="text.secondary">Live Map View</Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              Add a Google Maps API key to enable the interactive map
            </Typography>
            {/* Show tourist position list as fallback */}
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, maxWidth: 600, justifyContent: 'center' }}>
              {filtered.slice(0, 20).map((t) => (
                <Tooltip key={t.id} title={`${t.name} — Score: ${t.safetyScore}`}>
                  <Chip
                    label={t.id}
                    size="small"
                    sx={{ bgcolor: RISK_COLORS[t.riskLevel], color: '#fff', fontWeight: 600 }}
                    onClick={() => setSelectedTourist(t)}
                  />
                </Tooltip>
              ))}
            </Box>
          </Box>
        )}

        {/* Selected tourist overlay card */}
        {selectedTourist && !isLoaded && (
          <Card sx={{ position: 'absolute', top: 16, right: 16, width: 280, zIndex: 10 }}>
            <CardContent>
              <Typography variant="subtitle1" fontWeight={700}>{selectedTourist.name}</Typography>
              <Typography variant="body2">ID: {selectedTourist.id}</Typography>
              <Typography variant="body2">Zone: {selectedTourist.zone}</Typography>
              <Typography variant="body2">Safety Score: {selectedTourist.safetyScore}</Typography>
              <Typography variant="body2">Lat: {selectedTourist.lat.toFixed(4)}, Lng: {selectedTourist.lng.toFixed(4)}</Typography>
              <StatusChip label={selectedTourist.riskLevel} />
            </CardContent>
          </Card>
        )}
      </Box>

      {/* ── Historical Playback Slider ── */}
      <Paper sx={{ p: 2, mt: 2, display: 'flex', alignItems: 'center', gap: 2 }}>
        <IconButton onClick={() => setPlaying(!playing)} color="primary">
          {playing ? <Pause /> : <PlayArrow />}
        </IconButton>
        <Typography variant="caption" sx={{ minWidth: 100 }}>
          Historical Playback
        </Typography>
        <Slider
          value={playbackTime}
          onChange={(_, v) => setPlaybackTime(v)}
          min={0} max={100}
          valueLabelDisplay="auto"
          valueLabelFormat={(v) => `${v}%`}
          sx={{ flexGrow: 1 }}
        />
        <Typography variant="caption" sx={{ minWidth: 60 }}>
          {playbackTime}% complete
        </Typography>
      </Paper>
    </Box>
  );
}

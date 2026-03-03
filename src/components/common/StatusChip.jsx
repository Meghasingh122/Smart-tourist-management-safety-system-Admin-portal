import React from 'react';
import { Chip } from '@mui/material';

const COLOR_MAP = {
  Low: 'success',
  Medium: 'warning',
  High: 'error',
  Critical: 'error',
  New: 'error',
  Assigned: 'warning',
  Resolved: 'success',
  Open: 'error',
  'Under Investigation': 'warning',
  Closed: 'default',
  Online: 'success',
  Offline: 'default',
  Active: 'success',
  Inactive: 'default',
  SOS: 'error',
  'Geo-fence Breach': 'warning',
  'AI Anomaly': 'info',
};

export default function StatusChip({ label, size = 'small', variant = 'filled' }) {
  return (
    <Chip
      label={label}
      size={size}
      variant={variant}
      color={COLOR_MAP[label] || 'default'}
      sx={{ fontWeight: 600, minWidth: 80 }}
    />
  );
}

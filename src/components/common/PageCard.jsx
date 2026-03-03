import React from 'react';
import { Card, CardContent, CardHeader, Typography, Box, IconButton, Tooltip } from '@mui/material';
import { MoreVert } from '@mui/icons-material';

export default function PageCard({ title, subtitle, action, children, sx = {}, noPadding = false }) {
  return (
    <Card sx={{ height: '100%', ...sx }}>
      {title && (
        <CardHeader
          title={<Typography variant="subtitle1" fontWeight={600}>{title}</Typography>}
          subheader={subtitle && <Typography variant="caption" color="text.secondary">{subtitle}</Typography>}
          action={action || (
            <Tooltip title="Options">
              <IconButton size="small"><MoreVert fontSize="small" /></IconButton>
            </Tooltip>
          )}
          sx={{ pb: 0 }}
        />
      )}
      <CardContent sx={{ pt: title ? 1 : 2, ...(noPadding ? { p: '0 !important' } : {}) }}>
        {children}
      </CardContent>
    </Card>
  );
}

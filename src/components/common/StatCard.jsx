import React from 'react';
import { Card, CardContent, Box, Typography, useTheme } from '@mui/material';

export default function StatCard({ title, value, icon, color = 'primary', trend, subtitle }) {
  const theme = useTheme();
  const palette = theme.palette[color] || theme.palette.primary;

  return (
    <Card sx={{
      position: 'relative', overflow: 'visible',
      '&:hover': { transform: 'translateY(-2px)', transition: 'transform 0.2s' },
    }}>
      <CardContent sx={{ p: 2.5 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <Box>
            <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600, textTransform: 'uppercase', letterSpacing: 0.5 }}>
              {title}
            </Typography>
            <Typography variant="h4" sx={{ fontWeight: 700, mt: 0.5, color: palette.main }}>
              {value}
            </Typography>
            {subtitle && (
              <Typography variant="caption" color="text.secondary">{subtitle}</Typography>
            )}
            {trend && (
              <Typography variant="caption" sx={{ color: trend > 0 ? theme.palette.success.main : theme.palette.error.main, fontWeight: 600 }}>
                {trend > 0 ? '▲' : '▼'} {Math.abs(trend)}%
              </Typography>
            )}
          </Box>
          <Box sx={{
            width: 52, height: 52, borderRadius: 3,
            background: `linear-gradient(135deg, ${palette.light}, ${palette.main})`,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: '#fff', boxShadow: `0 4px 14px 0 ${palette.main}40`,
          }}>
            {icon}
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
}

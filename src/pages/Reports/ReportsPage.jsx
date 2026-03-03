import React, { useEffect, useState } from 'react';
import {
  Box, Grid, Paper, Button, TextField, Typography, useTheme,
} from '@mui/material';
import { Download, DateRange, PictureAsPdf, TableChart } from '@mui/icons-material';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RTooltip, ResponsiveContainer,
  LineChart, Line, AreaChart, Area,
} from 'recharts';
import { PageHeader, PageCard } from '../../components/common';
import api from '../../services/api';

export default function ReportsPage() {
  const theme = useTheme();
  const [reportData, setReportData] = useState(null);
  const [startDate, setStartDate] = useState('2026-03-01');
  const [endDate, setEndDate] = useState('2026-03-03');

  useEffect(() => {
    api.getReportData().then(setReportData);
  }, []);

  const handleExport = (type) => {
    const content = type === 'csv'
      ? 'Day,Incidents\n' + (reportData?.dailyIncidents || []).map((d) => `${d.day},${d.incidents}`).join('\n')
      : `STMSS Report (${startDate} to ${endDate})\n\nGenerated on: ${new Date().toLocaleString()}\n\nThis is a simulated report export.`;

    const blob = new Blob([content], { type: type === 'csv' ? 'text/csv' : 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `STMSS-Report-${startDate}.${type === 'csv' ? 'csv' : 'txt'}`;
    a.click();
    URL.revokeObjectURL(url);
  };

  if (!reportData) return null;

  return (
    <Box>
      <PageHeader
        title="Reports & Analytics"
        subtitle="Generate, analyze, and export operational reports"
        actions={
          <>
            <Button variant="outlined" startIcon={<TableChart />} onClick={() => handleExport('csv')}>
              Export CSV
            </Button>
            <Button variant="contained" startIcon={<PictureAsPdf />} onClick={() => handleExport('pdf')}>
              Export PDF
            </Button>
          </>
        }
      />

      {/* Date Range */}
      <Paper sx={{ p: 2, mb: 3, display: 'flex', gap: 2, alignItems: 'center', flexWrap: 'wrap' }}>
        <DateRange color="action" />
        <TextField
          size="small" type="date" label="Start Date" value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
          InputLabelProps={{ shrink: true }}
        />
        <TextField
          size="small" type="date" label="End Date" value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
          InputLabelProps={{ shrink: true }}
        />
        <Button variant="outlined" size="small">Generate Report</Button>
      </Paper>

      <Grid container spacing={2.5}>
        {/* Daily Incidents Trend */}
        <Grid size={{ xs: 12, md: 6 }}>
          <PageCard title="Daily Incidents (30 days)" subtitle="Incident count per day over the reporting period">
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={reportData.dailyIncidents}>
                <CartesianGrid strokeDasharray="3 3" stroke={theme.palette.divider} />
                <XAxis dataKey="day" tick={{ fontSize: 10 }} />
                <YAxis tick={{ fontSize: 11 }} />
                <RTooltip />
                <Area type="monotone" dataKey="incidents" stroke={theme.palette.primary.main} fill={theme.palette.primary.light + '40'} strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </PageCard>
        </Grid>

        {/* Zone-wise Breaches */}
        <Grid size={{ xs: 12, md: 6 }}>
          <PageCard title="Zone-wise Breaches" subtitle="Total geo-fence breaches by zone">
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={reportData.zoneBreaches}>
                <CartesianGrid strokeDasharray="3 3" stroke={theme.palette.divider} />
                <XAxis dataKey="zone" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} />
                <RTooltip />
                <Bar dataKey="breaches" fill={theme.palette.warning.main} radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </PageCard>
        </Grid>

        {/* Tourist Density Heatmap (simulated as bar chart) */}
        <Grid size={{ xs: 12 }}>
          <PageCard title="Tourist Density by Zone" subtitle="Simulated tourist density heatmap – higher values indicate crowded zones">
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={reportData.touristDensity} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke={theme.palette.divider} />
                <XAxis type="number" tick={{ fontSize: 11 }} />
                <YAxis type="category" dataKey="zone" width={80} tick={{ fontSize: 11 }} />
                <RTooltip />
                <Bar
                  dataKey="density"
                  radius={[0, 6, 6, 0]}
                  fill={theme.palette.secondary.main}
                  label={{ position: 'right', fontSize: 11, fill: theme.palette.text.primary }}
                />
              </BarChart>
            </ResponsiveContainer>
          </PageCard>
        </Grid>
      </Grid>
    </Box>
  );
}

import React, { useEffect, useState } from 'react';
import { Grid, Box, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography, useTheme } from '@mui/material';
import {
  People, SignalWifi4Bar, SignalWifiOff, NotificationsActive,
  GpsFixed, Psychology,
} from '@mui/icons-material';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RTooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend,
  LineChart, Line,
} from 'recharts';
import { StatCard, PageCard, StatusChip, PageHeader } from '../../components/common';
import api from '../../services/api';
import { useSocket } from '../../context/SocketContext';

const PIE_COLORS = ['#1565C0', '#2E7D32', '#ED6C02', '#D32F2F', '#5C6BC0'];

export default function DashboardPage() {
  const theme = useTheme();
  const { liveAlerts } = useSocket();

  const [stats, setStats] = useState(null);
  const [barData, setBarData] = useState([]);
  const [pieData, setPieData] = useState([]);
  const [lineData, setLineData] = useState([]);
  const [recentAlerts, setRecentAlerts] = useState([]);
  const [riskZones, setRiskZones] = useState([]);

  useEffect(() => {
    (async () => {
      const [s, b, p, l, ra, rz] = await Promise.all([
        api.getDashboardStats(),
        api.getIncidentsTodayChart(),
        api.getZoneRiskChart(),
        api.getResponseTimeTrend(),
        api.getRecentAlerts(),
        api.getHighRiskZones(),
      ]);
      setStats(s);
      setBarData(b);
      setPieData(p);
      setLineData(l);
      setRecentAlerts(ra);
      setRiskZones(rz);
    })();
  }, []);

  if (!stats) return null;

  const statCards = [
    { title: 'Active Tourists', value: stats.totalActiveTourists, icon: <People />, color: 'primary', trend: 12 },
    { title: 'Online', value: stats.onlineCount, icon: <SignalWifi4Bar />, color: 'success', subtitle: 'Currently connected' },
    { title: 'Offline', value: stats.offlineCount, icon: <SignalWifiOff />, color: 'warning' },
    { title: 'Active Alerts', value: stats.activeAlerts, icon: <NotificationsActive />, color: 'error', trend: -5 },
    { title: 'Geo-fence Breaches', value: stats.geoFenceBreaches, icon: <GpsFixed />, color: 'warning', trend: 8 },
    { title: 'AI Risk Detections', value: stats.aiRiskDetections, icon: <Psychology />, color: 'secondary' },
  ];

  return (
    <Box>
      <PageHeader title="Dashboard" subtitle="Real-time overview of the Smart Tourist Management & Security System" />

      {/* ── KPI Cards ── */}
      <Grid container spacing={2.5} sx={{ mb: 3 }}>
        {statCards.map((c) => (
          <Grid size={{ xs: 12, sm: 6, md: 4, lg: 2 }} key={c.title}>
            <StatCard {...c} />
          </Grid>
        ))}
      </Grid>

      {/* ── Charts Row ── */}
      <Grid container spacing={2.5} sx={{ mb: 3 }}>
        {/* Bar Chart */}
        <Grid size={{ xs: 12, md: 4 }}>
          <PageCard title="Incidents Today">
            <ResponsiveContainer width="100%" height={260}>
              <BarChart data={barData}>
                <CartesianGrid strokeDasharray="3 3" stroke={theme.palette.divider} />
                <XAxis dataKey="name" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} />
                <RTooltip />
                <Bar dataKey="count" fill={theme.palette.primary.main} radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </PageCard>
        </Grid>

        {/* Pie Chart */}
        <Grid size={{ xs: 12, md: 4 }}>
          <PageCard title="Zone Risk Distribution">
            <ResponsiveContainer width="100%" height={260}>
              <PieChart>
                <Pie data={pieData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={90} label>
                  {pieData.map((_, idx) => (
                    <Cell key={idx} fill={PIE_COLORS[idx % PIE_COLORS.length]} />
                  ))}
                </Pie>
                <Legend wrapperStyle={{ fontSize: 12 }} />
                <RTooltip />
              </PieChart>
            </ResponsiveContainer>
          </PageCard>
        </Grid>

        {/* Line Chart */}
        <Grid size={{ xs: 12, md: 4 }}>
          <PageCard title="Avg Response Time (min)">
            <ResponsiveContainer width="100%" height={260}>
              <LineChart data={lineData}>
                <CartesianGrid strokeDasharray="3 3" stroke={theme.palette.divider} />
                <XAxis dataKey="day" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} />
                <RTooltip />
                <Line type="monotone" dataKey="avgMinutes" stroke={theme.palette.secondary.main} strokeWidth={2.5} dot={{ r: 4 }} />
              </LineChart>
            </ResponsiveContainer>
          </PageCard>
        </Grid>
      </Grid>

      {/* ── Bottom Row ── */}
      <Grid container spacing={2.5}>
        {/* Recent Alerts */}
        <Grid size={{ xs: 12, md: 8 }}>
          <PageCard title="Recent Alerts" subtitle="Last 10 alerts from all sources">
            <TableContainer>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell>ID</TableCell>
                    <TableCell>Type</TableCell>
                    <TableCell>Priority</TableCell>
                    <TableCell>Tourist</TableCell>
                    <TableCell>Zone</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell>Time</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {recentAlerts.map((a) => (
                    <TableRow key={a.id} hover>
                      <TableCell sx={{ fontWeight: 600 }}>{a.id}</TableCell>
                      <TableCell><StatusChip label={a.type} /></TableCell>
                      <TableCell><StatusChip label={a.priority} /></TableCell>
                      <TableCell>{a.touristName}</TableCell>
                      <TableCell>{a.zone}</TableCell>
                      <TableCell><StatusChip label={a.status} /></TableCell>
                      <TableCell sx={{ fontSize: '0.75rem' }}>{new Date(a.timestamp).toLocaleTimeString()}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </PageCard>
        </Grid>

        {/* High Risk Zones */}
        <Grid size={{ xs: 12, md: 4 }}>
          <PageCard title="High Risk Zones" subtitle="Zones with elevated threat levels">
            {riskZones.length === 0 && <Typography variant="body2" color="text.secondary">No high-risk zones</Typography>}
            {riskZones.map((z) => (
              <Box
                key={z.id}
                sx={{
                  p: 1.5, mb: 1, borderRadius: 2,
                  bgcolor: theme.palette.mode === 'light' ? '#FFF3E0' : 'rgba(237,108,2,0.12)',
                  border: `1px solid ${theme.palette.warning.light}`,
                }}
              >
                <Typography variant="body2" fontWeight={600}>{z.name}</Typography>
                <Box sx={{ display: 'flex', gap: 1, mt: 0.5 }}>
                  <StatusChip label={z.riskLevel} />
                  <Typography variant="caption" color="text.secondary" sx={{ alignSelf: 'center' }}>
                    {z.breaches} breaches
                  </Typography>
                </Box>
              </Box>
            ))}
          </PageCard>
        </Grid>
      </Grid>
    </Box>
  );
}

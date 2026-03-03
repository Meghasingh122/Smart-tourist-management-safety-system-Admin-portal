// ──────────────────────────────────────────────
// Mock API Service – simulates REST calls
// ──────────────────────────────────────────────
import {
  tourists,
  alerts,
  incidents,
  geoFences,
  adminUsers,
  systemLogs,
  dashboardStats,
  incidentsTodayChart,
  zoneRiskChart,
  responseTimeTrend,
  highRiskZones,
  reportData,
} from '../data/mockData';

const delay = (ms = 400) => new Promise((r) => setTimeout(r, ms));

const api = {
  /* Dashboard */
  getDashboardStats: async () => { await delay(); return dashboardStats; },
  getIncidentsTodayChart: async () => { await delay(); return incidentsTodayChart; },
  getZoneRiskChart: async () => { await delay(); return zoneRiskChart; },
  getResponseTimeTrend: async () => { await delay(); return responseTimeTrend; },
  getHighRiskZones: async () => { await delay(); return highRiskZones; },
  getRecentAlerts: async () => { await delay(); return alerts.slice(0, 10); },

  /* Tourists */
  getTourists: async () => { await delay(); return tourists; },
  getTouristById: async (id) => { await delay(); return tourists.find((t) => t.id === id) || null; },

  /* Alerts */
  getAlerts: async () => { await delay(); return alerts; },
  updateAlertStatus: async (id, status) => {
    await delay();
    const a = alerts.find((x) => x.id === id);
    if (a) a.status = status;
    return a;
  },
  assignAlert: async (id, team) => {
    await delay();
    const a = alerts.find((x) => x.id === id);
    if (a) { a.assignedTo = team; a.status = 'Assigned'; }
    return a;
  },

  /* Incidents */
  getIncidents: async () => { await delay(); return incidents; },
  getIncidentById: async (id) => { await delay(); return incidents.find((x) => x.id === id) || null; },
  updateIncidentStatus: async (id, status) => {
    await delay();
    const inc = incidents.find((x) => x.id === id);
    if (inc) inc.status = status;
    return inc;
  },

  /* Geo-fences */
  getGeoFences: async () => { await delay(); return geoFences; },
  toggleGeoFence: async (id) => {
    await delay();
    const gf = geoFences.find((x) => x.id === id);
    if (gf) gf.active = !gf.active;
    return gf;
  },
  createGeoFence: async (data) => {
    await delay();
    const newGf = { id: `GF-${geoFences.length + 1}`, ...data, breaches: 0 };
    geoFences.push(newGf);
    return newGf;
  },

  /* Admin */
  getAdminUsers: async () => { await delay(); return adminUsers; },
  getSystemLogs: async () => { await delay(); return systemLogs; },

  /* Reports */
  getReportData: async () => { await delay(); return reportData; },
};

export default api;

// ──────────────────────────────────────────────
// STMSS – Centralised Mock Data
// ──────────────────────────────────────────────
import { v4 as uid } from 'uuid';

/* ───── helpers ───── */
const rand = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;
const pick = (arr) => arr[rand(0, arr.length - 1)];

const ZONES = ['Zone A – Heritage', 'Zone B – Beach', 'Zone C – Market', 'Zone D – Hill Station', 'Zone E – Wildlife'];
const RISK_LEVELS = ['Low', 'Medium', 'High', 'Critical'];
const ALERT_TYPES = ['SOS', 'Geo-fence Breach', 'AI Anomaly'];
const ALERT_STATUS = ['New', 'Assigned', 'Resolved'];
const PRIORITIES = ['High', 'Medium', 'Low'];
const INCIDENT_TYPES = ['Theft', 'Harassment', 'Medical Emergency', 'Lost Tourist', 'Wildlife Encounter', 'Traffic Accident'];
const INCIDENT_STATUS = ['Open', 'Under Investigation', 'Resolved', 'Closed'];
const NATIONALITIES = ['India', 'USA', 'UK', 'Germany', 'France', 'Japan', 'Australia', 'Brazil', 'Canada', 'South Korea'];

/* ───── tourists ───── */
const firstNames = ['Aarav','Sophia','Liam','Yuki','Hans','Priya','Olivia','Ethan','Mei','Carlos','Aisha','Noah','Emma','Vikram','Sara'];
const lastNames  = ['Sharma','Smith','Müller','Tanaka','Johnson','Patel','Williams','Chen','Garcia','Lee','Khan','Brown','Singh','Kim','Davis'];

export const tourists = Array.from({ length: 50 }, (_, i) => {
  const first = pick(firstNames);
  const last  = pick(lastNames);
  return {
    id: `TID-${String(i + 1).padStart(4, '0')}`,
    firstName: first,
    lastName: last,
    name: `${first} ${last}`,
    nationality: pick(NATIONALITIES),
    phone: `+91-${rand(70000, 99999)}${rand(10000, 99999)}`,
    email: `${first.toLowerCase()}.${last.toLowerCase()}@mail.com`,
    emergencyContact: `+91-${rand(70000, 99999)}${rand(10000, 99999)}`,
    zone: pick(ZONES),
    riskLevel: pick(RISK_LEVELS),
    safetyScore: rand(40, 100),
    status: pick(['Online', 'Offline']),
    lat: 15.4 + Math.random() * 0.15,
    lng: 73.8 + Math.random() * 0.2,
    registeredAt: new Date(2025, rand(0, 11), rand(1, 28)).toISOString(),
    tripHistory: Array.from({ length: rand(1, 4) }, () => ({
      destination: pick(ZONES),
      date: new Date(2025, rand(0, 11), rand(1, 28)).toISOString(),
    })),
    safetyScoreHistory: Array.from({ length: 12 }, (_, m) => ({
      month: ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'][m],
      score: rand(50, 100),
    })),
  };
});

/* ───── alerts ───── */
export const alerts = Array.from({ length: 40 }, (_, i) => {
  const tourist = pick(tourists);
  return {
    id: `ALT-${String(i + 1).padStart(4, '0')}`,
    type: pick(ALERT_TYPES),
    priority: pick(PRIORITIES),
    status: pick(ALERT_STATUS),
    message: `Alert triggered for tourist ${tourist.name} in ${tourist.zone}`,
    touristId: tourist.id,
    touristName: tourist.name,
    zone: tourist.zone,
    lat: tourist.lat,
    lng: tourist.lng,
    timestamp: new Date(2026, 2, rand(1, 3), rand(0, 23), rand(0, 59)).toISOString(),
    assignedTo: pick(['Team Alpha', 'Team Bravo', 'Team Charlie', null, null]),
  };
});

/* ───── incidents ───── */
export const incidents = Array.from({ length: 25 }, (_, i) => {
  const tourist = pick(tourists);
  return {
    id: `INC-${String(i + 1).padStart(4, '0')}`,
    type: pick(INCIDENT_TYPES),
    status: pick(INCIDENT_STATUS),
    priority: pick(PRIORITIES),
    description: `Incident involving ${tourist.name}: ${pick(INCIDENT_TYPES).toLowerCase()} reported near ${tourist.zone}.`,
    touristId: tourist.id,
    touristName: tourist.name,
    zone: tourist.zone,
    lat: tourist.lat,
    lng: tourist.lng,
    reportedAt: new Date(2026, 2, rand(1, 3), rand(0, 23), rand(0, 59)).toISOString(),
    resolvedAt: Math.random() > 0.5 ? new Date(2026, 2, 3, rand(0, 23), rand(0, 59)).toISOString() : null,
    evidence: ['/placeholder-evidence-1.jpg', '/placeholder-evidence-2.jpg'],
    timeline: [
      { time: '09:00', event: 'Incident reported' },
      { time: '09:15', event: 'Team dispatched' },
      { time: '09:45', event: 'On-site assessment' },
      { time: '10:30', event: 'Situation resolved' },
    ],
  };
});

/* ───── geo-fence zones ───── */
export const geoFences = ZONES.map((name, i) => ({
  id: `GF-${String(i + 1).padStart(3, '0')}`,
  name,
  riskLevel: pick(RISK_LEVELS),
  active: Math.random() > 0.2,
  activeTime: '06:00 – 22:00',
  polygon: [
    { lat: 15.42 + i * 0.02, lng: 73.82 + i * 0.02 },
    { lat: 15.44 + i * 0.02, lng: 73.82 + i * 0.02 },
    { lat: 15.44 + i * 0.02, lng: 73.84 + i * 0.02 },
    { lat: 15.42 + i * 0.02, lng: 73.84 + i * 0.02 },
  ],
  breaches: rand(0, 30),
}));

/* ───── admin users ───── */
export const adminUsers = [
  { id: 'ADM-001', name: 'Raj Kapoor', role: 'Super Admin', email: 'raj.kapoor@stmss.gov.in', status: 'Active', lastLogin: '2026-03-03T08:30:00Z' },
  { id: 'ADM-002', name: 'Inspector Meera', role: 'Police Officer', email: 'meera@police.gov.in', status: 'Active', lastLogin: '2026-03-03T07:15:00Z' },
  { id: 'ADM-003', name: 'Ankit Verma', role: 'Tourism Officer', email: 'ankit@tourism.gov.in', status: 'Active', lastLogin: '2026-03-02T18:45:00Z' },
  { id: 'ADM-004', name: 'Sgt. Dhawan', role: 'Police Officer', email: 'dhawan@police.gov.in', status: 'Inactive', lastLogin: '2026-02-28T16:00:00Z' },
  { id: 'ADM-005', name: 'Pooja Nair', role: 'Tourism Officer', email: 'pooja@tourism.gov.in', status: 'Active', lastLogin: '2026-03-03T09:00:00Z' },
];

/* ───── system logs ───── */
export const systemLogs = Array.from({ length: 30 }, (_, i) => ({
  id: i + 1,
  timestamp: new Date(2026, 2, 3, rand(0, 23), rand(0, 59)).toISOString(),
  user: pick(adminUsers).name,
  action: pick(['Login', 'Alert Assigned', 'Zone Updated', 'Tourist Profile Viewed', 'Report Generated', 'Incident Resolved', 'Settings Changed']),
  details: pick(['From IP 192.168.1.' + rand(1, 254), 'Dashboard access', 'Zone C modified', 'E-FIR downloaded']),
}));

/* ───── dashboard KPIs ───── */
export const dashboardStats = {
  totalActiveTourists: tourists.filter(t => t.status === 'Online').length,
  onlineCount: tourists.filter(t => t.status === 'Online').length,
  offlineCount: tourists.filter(t => t.status === 'Offline').length,
  activeAlerts: alerts.filter(a => a.status !== 'Resolved').length,
  geoFenceBreaches: geoFences.reduce((s, g) => s + g.breaches, 0),
  aiRiskDetections: rand(5, 20),
};

export const incidentsTodayChart = [
  { name: 'Theft', count: rand(1, 8) },
  { name: 'Harassment', count: rand(0, 5) },
  { name: 'Medical', count: rand(0, 6) },
  { name: 'Lost Tourist', count: rand(0, 4) },
  { name: 'Wildlife', count: rand(0, 3) },
  { name: 'Traffic', count: rand(0, 4) },
];

export const zoneRiskChart = ZONES.map(z => ({
  name: z.split(' – ')[1],
  value: rand(5, 30),
}));

export const responseTimeTrend = ['Mon','Tue','Wed','Thu','Fri','Sat','Sun'].map(d => ({
  day: d,
  avgMinutes: rand(5, 45),
}));

export const highRiskZones = geoFences.filter(g => g.riskLevel === 'High' || g.riskLevel === 'Critical');

/* ───── reports mock ───── */
export const reportData = {
  dailyIncidents: Array.from({ length: 30 }, (_, i) => ({ day: i + 1, incidents: rand(0, 12) })),
  zoneBreaches: ZONES.map(z => ({ zone: z.split(' – ')[1], breaches: rand(5, 50) })),
  touristDensity: ZONES.map(z => ({ zone: z.split(' – ')[1], density: rand(20, 200) })),
};

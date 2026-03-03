// ──────────────────────────────────────────────
// Mock Socket Service – simulates real-time events
// ──────────────────────────────────────────────
import { tourists, alerts } from '../data/mockData';

const pick = (arr) => arr[Math.floor(Math.random() * arr.length)];
const rand = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

class MockSocket {
  constructor() {
    this.listeners = {};
    this.interval = null;
  }

  on(event, callback) {
    if (!this.listeners[event]) this.listeners[event] = [];
    this.listeners[event].push(callback);
  }

  off(event, callback) {
    if (!this.listeners[event]) return;
    this.listeners[event] = this.listeners[event].filter((cb) => cb !== callback);
  }

  emit(event, data) {
    if (this.listeners[event]) {
      this.listeners[event].forEach((cb) => cb(data));
    }
  }

  connect() {
    // Simulate tourist location updates every 3 seconds
    this.interval = setInterval(() => {
      const tourist = pick(tourists);
      tourist.lat += (Math.random() - 0.5) * 0.002;
      tourist.lng += (Math.random() - 0.5) * 0.002;
      this.emit('touristLocationUpdate', {
        id: tourist.id,
        name: tourist.name,
        lat: tourist.lat,
        lng: tourist.lng,
        safetyScore: tourist.safetyScore,
        riskLevel: tourist.riskLevel,
        zone: tourist.zone,
      });

      // Randomly emit a new alert ~20% of the time
      if (Math.random() < 0.2) {
        const alertTourist = pick(tourists);
        const newAlert = {
          id: `ALT-LIVE-${Date.now()}`,
          type: pick(['SOS', 'Geo-fence Breach', 'AI Anomaly']),
          priority: pick(['High', 'Medium', 'Low']),
          status: 'New',
          message: `Live alert for ${alertTourist.name} in ${alertTourist.zone}`,
          touristId: alertTourist.id,
          touristName: alertTourist.name,
          zone: alertTourist.zone,
          lat: alertTourist.lat,
          lng: alertTourist.lng,
          timestamp: new Date().toISOString(),
          assignedTo: null,
        };
        this.emit('newAlert', newAlert);
      }
    }, 3000);

    this.emit('connect', { status: 'connected' });
  }

  disconnect() {
    clearInterval(this.interval);
    this.interval = null;
  }
}

const socketService = new MockSocket();
export default socketService;

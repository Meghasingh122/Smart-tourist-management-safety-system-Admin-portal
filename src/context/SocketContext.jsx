import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import socketService from '../services/socketService';

const SocketContext = createContext();

export function useSocket() {
  return useContext(SocketContext);
}

export default function SocketProvider({ children }) {
  const [locationUpdates, setLocationUpdates] = useState([]);
  const [liveAlerts, setLiveAlerts] = useState([]);
  const [connected, setConnected] = useState(false);

  useEffect(() => {
    socketService.on('connect', () => setConnected(true));

    socketService.on('touristLocationUpdate', (data) => {
      setLocationUpdates((prev) => {
        const idx = prev.findIndex((u) => u.id === data.id);
        if (idx >= 0) {
          const copy = [...prev];
          copy[idx] = data;
          return copy;
        }
        return [...prev, data];
      });
    });

    socketService.on('newAlert', (alert) => {
      setLiveAlerts((prev) => [alert, ...prev].slice(0, 50));
    });

    socketService.connect();

    return () => socketService.disconnect();
  }, []);

  const clearLiveAlerts = useCallback(() => setLiveAlerts([]), []);

  return (
    <SocketContext.Provider value={{ locationUpdates, liveAlerts, connected, clearLiveAlerts }}>
      {children}
    </SocketContext.Provider>
  );
}

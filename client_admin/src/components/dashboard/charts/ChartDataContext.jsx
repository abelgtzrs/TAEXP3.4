import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import { chartData as defaultChartData, systemStatus as defaultSystemStatus } from "./chartData";

const STORAGE_KEYS = {
  coherence: "dashboardCoherenceSeries",
  anomaly: "dashboardAnomalySeries",
  drift: "dashboardDriftSeries",
  systemStatus: "dashboardSystemStatus",
};

function loadFromStorage(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return fallback;
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : fallback;
  } catch (e) {
    console.warn("ChartDataContext: failed to load", key, e);
    return fallback;
  }
}

function saveToStorage(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (e) {
    console.warn("ChartDataContext: failed to save", key, e);
  }
}

const ChartDataContext = createContext(null);

export function ChartDataProvider({ children }) {
  const mapSeries = (data, key) => data.map((d) => ({ name: d.name, value: d[key] }));

  const [coherenceSeries, setCoherenceSeries] = useState(() =>
    loadFromStorage(STORAGE_KEYS.coherence, mapSeries(defaultChartData, "coherence"))
  );
  const [anomalySeries, setAnomalySeries] = useState(() =>
    loadFromStorage(STORAGE_KEYS.anomaly, mapSeries(defaultChartData, "anomaly"))
  );
  const [driftSeries, setDriftSeries] = useState(() =>
    loadFromStorage(STORAGE_KEYS.drift, mapSeries(defaultChartData, "drift"))
  );
  const [systemStatus, setSystemStatus] = useState(() =>
    loadFromStorage(STORAGE_KEYS.systemStatus, defaultSystemStatus)
  );

  useEffect(() => {
    saveToStorage(STORAGE_KEYS.coherence, coherenceSeries);
  }, [coherenceSeries]);

  useEffect(() => {
    saveToStorage(STORAGE_KEYS.anomaly, anomalySeries);
  }, [anomalySeries]);

  useEffect(() => {
    saveToStorage(STORAGE_KEYS.drift, driftSeries);
  }, [driftSeries]);

  useEffect(() => {
    saveToStorage(STORAGE_KEYS.systemStatus, systemStatus);
  }, [systemStatus]);

  const value = useMemo(
    () => ({
      coherenceSeries,
      setCoherenceSeries,
      anomalySeries,
      setAnomalySeries,
      driftSeries,
      setDriftSeries,
      systemStatus,
      setSystemStatus,
    }),
    [coherenceSeries, anomalySeries, driftSeries, systemStatus]
  );

  return <ChartDataContext.Provider value={value}>{children}</ChartDataContext.Provider>;
}

export function useChartData() {
  const ctx = useContext(ChartDataContext);
  if (!ctx) throw new Error("useChartData must be used within a ChartDataProvider");
  return ctx;
}

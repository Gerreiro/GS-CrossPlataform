import React, { createContext, useContext, useEffect, useReducer } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

// ─── Types ───────────────────────────────────────────────────────────────────

export type SensorStatus = 'normal' | 'warning' | 'critical';

export interface SensorData {
  energy: number;        // 0-100%
  temperature: number;   // Celsius
  oxygen: number;        // 0-100%
  pressure: number;      // kPa
  radiation: number;     // mSv/h
  orbitalStability: number; // 0-100%
  communication: number; // 0-100 signal strength
  fuelLevel: number;     // 0-100%
}

export interface Alert {
  id: string;
  timestamp: string;
  message: string;
  severity: 'warning' | 'critical';
  sensor: string;
  acknowledged: boolean;
}

export interface MissionConfig {
  missionName: string;
  commanderName: string;
  launchDate: string;
  targetPlanet: string;
  crewCount: string;
  notes: string;
}

export interface AppState {
  sensors: SensorData;
  alerts: Alert[];
  missionConfig: MissionConfig;
  lastUpdated: string;
}

// ─── Initial State ────────────────────────────────────────────────────────────

const initialSensors: SensorData = {
  energy: 78,
  temperature: 22,
  oxygen: 91,
  pressure: 101.3,
  radiation: 0.3,
  orbitalStability: 88,
  communication: 95,
  fuelLevel: 64,
};

const initialConfig: MissionConfig = {
  missionName: 'Ares VII',
  commanderName: '',
  launchDate: '',
  targetPlanet: 'Marte',
  crewCount: '4',
  notes: '',
};

const initialState: AppState = {
  sensors: initialSensors,
  alerts: [],
  missionConfig: initialConfig,
  lastUpdated: new Date().toISOString(),
};

// ─── Reducer ──────────────────────────────────────────────────────────────────

type Action =
  | { type: 'UPDATE_SENSORS'; payload: Partial<SensorData> }
  | { type: 'ADD_ALERT'; payload: Alert }
  | { type: 'ACKNOWLEDGE_ALERT'; payload: string }
  | { type: 'CLEAR_ALERTS' }
  | { type: 'UPDATE_MISSION_CONFIG'; payload: Partial<MissionConfig> }
  | { type: 'LOAD_STATE'; payload: AppState };

function reducer(state: AppState, action: Action): AppState {
  switch (action.type) {
    case 'UPDATE_SENSORS':
      return {
        ...state,
        sensors: { ...state.sensors, ...action.payload },
        lastUpdated: new Date().toISOString(),
      };
    case 'ADD_ALERT':
      return { ...state, alerts: [action.payload, ...state.alerts].slice(0, 50) };
    case 'ACKNOWLEDGE_ALERT':
      return {
        ...state,
        alerts: state.alerts.map(a =>
          a.id === action.payload ? { ...a, acknowledged: true } : a
        ),
      };
    case 'CLEAR_ALERTS':
      return { ...state, alerts: [] };
    case 'UPDATE_MISSION_CONFIG':
      return { ...state, missionConfig: { ...state.missionConfig, ...action.payload } };
    case 'LOAD_STATE':
      return action.payload;
    default:
      return state;
  }
}

// ─── Context ──────────────────────────────────────────────────────────────────

interface MissionContextType {
  state: AppState;
  dispatch: React.Dispatch<Action>;
  getSensorStatus: (key: keyof SensorData) => SensorStatus;
  unacknowledgedAlerts: number;
}

const MissionContext = createContext<MissionContextType | null>(null);

const STORAGE_KEY = '@space_mission_state';

// ─── Thresholds ───────────────────────────────────────────────────────────────

const THRESHOLDS: Record<keyof SensorData, { warning: number; critical: number; invert?: boolean }> = {
  energy: { warning: 40, critical: 20, invert: true },
  temperature: { warning: 30, critical: 40 },
  oxygen: { warning: 70, critical: 50, invert: true },
  pressure: { warning: 90, critical: 80, invert: true },
  radiation: { warning: 1.0, critical: 2.5 },
  orbitalStability: { warning: 60, critical: 40, invert: true },
  communication: { warning: 50, critical: 20, invert: true },
  fuelLevel: { warning: 30, critical: 15, invert: true },
};

export function getSensorStatus(key: keyof SensorData, value: number): SensorStatus {
  const t = THRESHOLDS[key];
  if (!t) return 'normal';
  if (t.invert) {
    if (value <= t.critical) return 'critical';
    if (value <= t.warning) return 'warning';
  } else {
    if (value >= t.critical) return 'critical';
    if (value >= t.warning) return 'warning';
  }
  return 'normal';
}

// ─── Provider ─────────────────────────────────────────────────────────────────

export function MissionProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(reducer, initialState);

  // Load persisted state on mount
  useEffect(() => {
    (async () => {
      try {
        const saved = await AsyncStorage.getItem(STORAGE_KEY);
        if (saved) {
          const parsed: AppState = JSON.parse(saved);
          dispatch({ type: 'LOAD_STATE', payload: parsed });
        }
      } catch (e) {
        console.log('Failed to load state:', e);
      }
    })();
  }, []);

  // Persist state on every change
  useEffect(() => {
    AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(state)).catch(console.log);
  }, [state]);

  // Auto-generate alerts when sensors hit thresholds
  useEffect(() => {
    const sensorLabels: Record<keyof SensorData, string> = {
      energy: 'Energia',
      temperature: 'Temperatura',
      oxygen: 'Oxigênio',
      pressure: 'Pressão',
      radiation: 'Radiação',
      orbitalStability: 'Estabilidade Orbital',
      communication: 'Comunicação',
      fuelLevel: 'Combustível',
    };

    (Object.keys(state.sensors) as (keyof SensorData)[]).forEach(key => {
      const value = state.sensors[key];
      const status = getSensorStatus(key, value);
      if (status === 'critical' || status === 'warning') {
        const recentAlert = state.alerts.find(
          a => a.sensor === key && !a.acknowledged &&
          Date.now() - new Date(a.timestamp).getTime() < 30000
        );
        if (!recentAlert) {
          dispatch({
            type: 'ADD_ALERT',
            payload: {
              id: `${key}-${Date.now()}`,
              timestamp: new Date().toISOString(),
              message: status === 'critical'
                ? `CRÍTICO: ${sensorLabels[key]} em nível perigoso (${value})`
                : `ATENÇÃO: ${sensorLabels[key]} em nível de alerta (${value})`,
              severity: status,
              sensor: key,
              acknowledged: false,
            },
          });
        }
      }
    });
  }, [state.sensors]);

  const unacknowledgedAlerts = state.alerts.filter(a => !a.acknowledged).length;

  const getSensorStatusCtx = (key: keyof SensorData): SensorStatus =>
    getSensorStatus(key, state.sensors[key]);

  return (
    <MissionContext.Provider value={{ state, dispatch, getSensorStatus: getSensorStatusCtx, unacknowledgedAlerts }}>
      {children}
    </MissionContext.Provider>
  );
}

export function useMission() {
  const ctx = useContext(MissionContext);
  if (!ctx) throw new Error('useMission must be used inside MissionProvider');
  return ctx;
}

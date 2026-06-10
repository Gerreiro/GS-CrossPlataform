import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Animated,
  Dimensions,
} from 'react-native';
import { useMission, getSensorStatus, SensorData } from '../context/MissionContext';

const { width } = Dimensions.get('window');

// ─── Sensor Card ──────────────────────────────────────────────────────────────

interface SensorCardProps {
  label: string;
  value: number;
  unit: string;
  sensorKey: keyof SensorData;
  icon: string;
  min?: number;
  max?: number;
}

function SensorCard({ label, value, unit, sensorKey, icon, min = 0, max = 100 }: SensorCardProps) {
  const status = getSensorStatus(sensorKey, value);
  const pulseAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    if (status === 'critical') {
      const pulse = Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, { toValue: 0.3, duration: 400, useNativeDriver: true }),
          Animated.timing(pulseAnim, { toValue: 1, duration: 400, useNativeDriver: true }),
        ])
      );
      pulse.start();
      return () => pulse.stop();
    } else {
      pulseAnim.setValue(1);
    }
  }, [status]);

  const statusColors = {
    normal: '#00ff88',
    warning: '#ffcc00',
    critical: '#ff3355',
  };

  const color = statusColors[status];
  const progress = Math.max(0, Math.min(1, (value - min) / (max - min)));

  return (
    <View style={[styles.card, { borderColor: color + '40' }]}>
      <View style={styles.cardHeader}>
        <Text style={styles.cardIcon}>{icon}</Text>
        <Text style={styles.cardLabel}>{label}</Text>
        <Animated.View style={[styles.statusDot, { backgroundColor: color, opacity: pulseAnim }]} />
      </View>
      <Text style={[styles.cardValue, { color }]}>
        {typeof value === 'number' ? value.toFixed(1) : value}
        <Text style={styles.cardUnit}> {unit}</Text>
      </Text>
      <View style={styles.progressBar}>
        <View
          style={[
            styles.progressFill,
            { width: `${progress * 100}%`, backgroundColor: color },
          ]}
        />
      </View>
      <Text style={[styles.statusLabel, { color }]}>
        {status === 'normal' ? '● NOMINAL' : status === 'warning' ? '⚠ ATENÇÃO' : '✖ CRÍTICO'}
      </Text>
    </View>
  );
}

// ─── Header ───────────────────────────────────────────────────────────────────

function MissionHeader() {
  const { state } = useMission();
  const now = new Date();

  return (
    <View style={styles.header}>
      <View style={styles.headerTop}>
        <Text style={styles.missionLabel}>MISSÃO</Text>
        <Text style={styles.missionName}>{state.missionConfig.missionName}</Text>
        <Text style={styles.missionTarget}>⇒ {state.missionConfig.targetPlanet}</Text>
      </View>
      <View style={styles.headerBottom}>
        <Text style={styles.clock}>
          {now.toLocaleTimeString('pt-BR')} UTC
        </Text>
        <Text style={styles.date}>{now.toLocaleDateString('pt-BR')}</Text>
      </View>
    </View>
  );
}

// ─── Simulate Button ──────────────────────────────────────────────────────────

function SimulateButton() {
  const { dispatch } = useMission();

  const randomizeSensors = () => {
    dispatch({
      type: 'UPDATE_SENSORS',
      payload: {
        energy: Math.round(Math.random() * 100),
        temperature: Math.round(15 + Math.random() * 40),
        oxygen: Math.round(40 + Math.random() * 60),
        pressure: parseFloat((85 + Math.random() * 30).toFixed(1)),
        radiation: parseFloat((Math.random() * 3).toFixed(2)),
        orbitalStability: Math.round(Math.random() * 100),
        communication: Math.round(Math.random() * 100),
        fuelLevel: Math.round(Math.random() * 100),
      },
    });
  };

  return (
    <TouchableOpacity style={styles.simulateBtn} onPress={randomizeSensors}>
      <Text style={styles.simulateBtnText}>🔄  SIMULAR LEITURA</Text>
    </TouchableOpacity>
  );
}

// ─── Main Dashboard ───────────────────────────────────────────────────────────

export default function DashboardScreen() {
  const { state, unacknowledgedAlerts } = useMission();
  const s = state.sensors;

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <MissionHeader />

      {unacknowledgedAlerts > 0 && (
        <View style={styles.alertBanner}>
          <Text style={styles.alertBannerText}>
            🚨 {unacknowledgedAlerts} alerta{unacknowledgedAlerts > 1 ? 's' : ''} ativo{unacknowledgedAlerts > 1 ? 's' : ''}
          </Text>
        </View>
      )}

      <Text style={styles.sectionTitle}>◈ SENSORES DA NAVE</Text>

      <View style={styles.grid}>
        <SensorCard label="Energia" value={s.energy} unit="%" sensorKey="energy" icon="⚡" />
        <SensorCard label="Temperatura" value={s.temperature} unit="°C" sensorKey="temperature" icon="🌡" min={0} max={60} />
        <SensorCard label="Oxigênio" value={s.oxygen} unit="%" sensorKey="oxygen" icon="💨" />
        <SensorCard label="Pressão" value={s.pressure} unit="kPa" sensorKey="pressure" icon="🔵" min={60} max={130} />
        <SensorCard label="Radiação" value={s.radiation} unit="mSv/h" sensorKey="radiation" icon="☢️" min={0} max={3} />
        <SensorCard label="Est. Orbital" value={s.orbitalStability} unit="%" sensorKey="orbitalStability" icon="🪐" />
        <SensorCard label="Comunicação" value={s.communication} unit="%" sensorKey="communication" icon="📡" />
        <SensorCard label="Combustível" value={s.fuelLevel} unit="%" sensorKey="fuelLevel" icon="🚀" />
      </View>

      <Text style={styles.lastUpdate}>
        Última leitura: {new Date(state.lastUpdated).toLocaleTimeString('pt-BR')}
      </Text>

      <SimulateButton />
    </ScrollView>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0a0a1a' },
  content: { padding: 16, paddingBottom: 32 },

  header: {
    backgroundColor: '#0d0d2b',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#1a1a3a',
  },
  headerTop: { flexDirection: 'row', alignItems: 'center', marginBottom: 8 },
  missionLabel: { color: '#555577', fontSize: 10, letterSpacing: 2, marginRight: 8 },
  missionName: { color: '#00ff88', fontSize: 18, fontWeight: 'bold', letterSpacing: 3, flex: 1 },
  missionTarget: { color: '#7799ff', fontSize: 12 },
  headerBottom: { flexDirection: 'row', justifyContent: 'space-between' },
  clock: { color: '#aabbcc', fontSize: 13, fontFamily: 'monospace' },
  date: { color: '#555577', fontSize: 12 },

  alertBanner: {
    backgroundColor: '#ff335520',
    borderWidth: 1,
    borderColor: '#ff3355',
    borderRadius: 8,
    padding: 10,
    marginBottom: 12,
    alignItems: 'center',
  },
  alertBannerText: { color: '#ff3355', fontWeight: 'bold', letterSpacing: 1 },

  sectionTitle: { color: '#00ff88', letterSpacing: 3, fontSize: 11, marginBottom: 12 },

  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginBottom: 12,
  },

  card: {
    width: (width - 42) / 2,
    backgroundColor: '#0d0d2b',
    borderRadius: 10,
    padding: 12,
    borderWidth: 1,
  },
  cardHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 6 },
  cardIcon: { fontSize: 16, marginRight: 6 },
  cardLabel: { color: '#8899bb', fontSize: 10, letterSpacing: 1, flex: 1 },
  statusDot: { width: 7, height: 7, borderRadius: 4 },
  cardValue: { fontSize: 22, fontWeight: 'bold', fontFamily: 'monospace', marginBottom: 6 },
  cardUnit: { fontSize: 12, fontWeight: 'normal', color: '#556677' },
  progressBar: {
    height: 3,
    backgroundColor: '#1a1a3a',
    borderRadius: 2,
    overflow: 'hidden',
    marginBottom: 6,
  },
  progressFill: { height: 3, borderRadius: 2 },
  statusLabel: { fontSize: 9, letterSpacing: 1 },

  lastUpdate: { color: '#445566', fontSize: 10, textAlign: 'center', marginBottom: 12 },

  simulateBtn: {
    backgroundColor: '#1a1a4a',
    borderRadius: 10,
    padding: 14,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#3344aa',
  },
  simulateBtnText: { color: '#7799ff', fontWeight: 'bold', letterSpacing: 2, fontSize: 13 },
});

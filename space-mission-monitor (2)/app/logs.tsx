import React from 'react';
import { ScrollView, Text, StyleSheet } from 'react-native';
import { useMission } from '../context/MissionContext';
import { SectionCard } from '../components/SectionCard';
import { DataRow } from '../components/DataRow';

export default function LogsScreen() {
  const { state } = useMission();
  const { missionConfig, sensors, alerts, lastUpdated } = state;

  const crewCount = parseInt(missionConfig.crewCount) || 0;

  const sensorRows: { label: string; value: string }[] = [
    { label: 'Energia',         value: `${sensors.energy.toFixed(1)}%` },
    { label: 'Temperatura',     value: `${sensors.temperature.toFixed(1)} °C` },
    { label: 'Oxigênio',        value: `${sensors.oxygen.toFixed(1)}%` },
    { label: 'Pressão',         value: `${sensors.pressure.toFixed(1)} kPa` },
    { label: 'Radiação',        value: `${sensors.radiation.toFixed(2)} mSv/h` },
    { label: 'Est. Orbital',    value: `${sensors.orbitalStability.toFixed(1)}%` },
    { label: 'Comunicação',     value: `${sensors.communication.toFixed(1)}%` },
    { label: 'Combustível',     value: `${sensors.fuelLevel.toFixed(1)}%` },
  ];

  const totalAlerts    = alerts.length;
  const criticalAlerts = alerts.filter(a => a.severity === 'critical').length;
  const unacknowledged = alerts.filter(a => !a.acknowledged).length;

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>

      <SectionCard title="◈ RESUMO DA MISSÃO">
        <DataRow label="Missão"      value={missionConfig.missionName  || '—'} />
        <DataRow label="Comandante"  value={missionConfig.commanderName || '—'} />
        <DataRow label="Lançamento"  value={missionConfig.launchDate    || '—'} />
        <DataRow label="Destino"     value={missionConfig.targetPlanet  || '—'} />
        <DataRow label="Tripulação"  value={`${crewCount} membro${crewCount !== 1 ? 's' : ''}`} last={!missionConfig.notes} />
        {missionConfig.notes ? (
          <DataRow label="Notas" value={missionConfig.notes} last />
        ) : null}
      </SectionCard>

      <SectionCard title="◈ ÚLTIMA LEITURA DE SENSORES" accentColor="#7799ff">
        <Text style={styles.timestamp}>
          {new Date(lastUpdated).toLocaleString('pt-BR')}
        </Text>
        {sensorRows.map((row, i) => (
          <DataRow
            key={row.label}
            label={row.label}
            value={row.value}
            mono
            last={i === sensorRows.length - 1}
          />
        ))}
      </SectionCard>

      <SectionCard title="◈ ESTATÍSTICAS DE ALERTAS" accentColor="#ffcc00">
        <DataRow label="Total de alertas"   value={String(totalAlerts)} />
        <DataRow label="Alertas críticos"   value={String(criticalAlerts)}
          valueColor={criticalAlerts > 0 ? '#ff3355' : '#00ff88'} />
        <DataRow label="Não reconhecidos"   value={String(unacknowledged)}
          valueColor={unacknowledged > 0 ? '#ffcc00' : '#00ff88'} last />
      </SectionCard>

      {alerts.length > 0 && (
        <SectionCard title="◈ REGISTRO DE ALERTAS RECENTES" accentColor="#ff3355">
          {alerts.slice(0, 20).map((alert, i) => (
            <DataRow
              key={alert.id}
              label={new Date(alert.timestamp).toLocaleString('pt-BR')}
              value={alert.acknowledged ? '✓ ACK' : alert.severity === 'critical' ? '● CRÍTICO' : '◌ ATENÇÃO'}
              valueColor={
                alert.acknowledged ? '#334455' :
                alert.severity === 'critical' ? '#ff3355' : '#ffcc00'
              }
              last={i === Math.min(alerts.length, 20) - 1}
            />
          ))}
        </SectionCard>
      )}

    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0a0a1a' },
  content:   { padding: 16, paddingBottom: 40 },
  timestamp: {
    color: '#556677',
    fontSize: 10,
    fontFamily: 'monospace',
    paddingHorizontal: 14,
    paddingTop: 8,
    paddingBottom: 4,
  },
});

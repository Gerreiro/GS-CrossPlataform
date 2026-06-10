import React from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { useMission } from '../context/MissionContext';

export default function AlertsScreen() {
  const { state, dispatch } = useMission();
  const { alerts } = state;

  const unread = alerts.filter(a => !a.acknowledged).length;

  const acknowledge = (id: string) => {
    dispatch({ type: 'ACKNOWLEDGE_ALERT', payload: id });
  };

  const acknowledgeAll = () => {
    Alert.alert(
      'Confirmar',
      'Marcar todos os alertas como reconhecidos?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Confirmar',
          onPress: () =>
            alerts.forEach(a => dispatch({ type: 'ACKNOWLEDGE_ALERT', payload: a.id })),
        },
      ]
    );
  };

  const clearAll = () => {
    Alert.alert(
      'Limpar Alertas',
      'Remover todos os alertas do registro?',
      [
        { text: 'Cancelar', style: 'cancel' },
        { text: 'Limpar', style: 'destructive', onPress: () => dispatch({ type: 'CLEAR_ALERTS' }) },
      ]
    );
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.title}>CENTRAL DE ALERTAS</Text>
          <Text style={styles.subtitle}>
            {unread > 0 ? `${unread} não reconhecido${unread > 1 ? 's' : ''}` : 'Todos reconhecidos'}
          </Text>
        </View>
        <View style={styles.headerActions}>
          {unread > 0 && (
            <TouchableOpacity style={styles.btnSecondary} onPress={acknowledgeAll}>
              <Text style={styles.btnSecondaryText}>✓ Todos</Text>
            </TouchableOpacity>
          )}
          {alerts.length > 0 && (
            <TouchableOpacity style={styles.btnDanger} onPress={clearAll}>
              <Text style={styles.btnDangerText}>🗑</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* Empty State */}
      {alerts.length === 0 && (
        <View style={styles.emptyState}>
          <Text style={styles.emptyIcon}>✅</Text>
          <Text style={styles.emptyTitle}>Sistemas Normais</Text>
          <Text style={styles.emptyText}>
            Nenhum alerta registrado. Todos os sistemas operam dentro dos parâmetros nominais.
          </Text>
        </View>
      )}

      {/* Alert List */}
      {alerts.map(alert => (
        <View
          key={alert.id}
          style={[
            styles.alertCard,
            alert.severity === 'critical' && styles.alertCardCritical,
            alert.severity === 'warning' && styles.alertCardWarning,
            alert.acknowledged && styles.alertCardAck,
          ]}
        >
          <View style={styles.alertHeader}>
            <Text style={styles.alertIcon}>
              {alert.severity === 'critical' ? '🔴' : '🟡'}
            </Text>
            <View style={styles.alertMeta}>
              <Text
                style={[
                  styles.alertSeverity,
                  { color: alert.severity === 'critical' ? '#ff3355' : '#ffcc00' },
                  alert.acknowledged && styles.textMuted,
                ]}
              >
                {alert.severity === 'critical' ? 'CRÍTICO' : 'ATENÇÃO'}
              </Text>
              <Text style={[styles.alertTime, alert.acknowledged && styles.textMuted]}>
                {new Date(alert.timestamp).toLocaleTimeString('pt-BR')}
              </Text>
            </View>
            {!alert.acknowledged && (
              <TouchableOpacity
                style={styles.ackBtn}
                onPress={() => acknowledge(alert.id)}
              >
                <Text style={styles.ackBtnText}>ACK</Text>
              </TouchableOpacity>
            )}
            {alert.acknowledged && (
              <View style={styles.ackBadge}>
                <Text style={styles.ackBadgeText}>✓</Text>
              </View>
            )}
          </View>
          <Text style={[styles.alertMessage, alert.acknowledged && styles.textMuted]}>
            {alert.message}
          </Text>
          <Text style={styles.alertDate}>
            {new Date(alert.timestamp).toLocaleDateString('pt-BR')}
          </Text>
        </View>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0a0a1a' },
  content: { padding: 16, paddingBottom: 32 },

  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  title: { color: '#00ff88', fontSize: 14, fontWeight: 'bold', letterSpacing: 3 },
  subtitle: { color: '#556677', fontSize: 11, marginTop: 2 },
  headerActions: { flexDirection: 'row', gap: 8 },

  btnSecondary: {
    backgroundColor: '#1a2a1a',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#00ff88',
  },
  btnSecondaryText: { color: '#00ff88', fontSize: 11 },

  btnDanger: {
    backgroundColor: '#2a1a1a',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#ff3355',
  },
  btnDangerText: { color: '#ff3355', fontSize: 13 },

  emptyState: { alignItems: 'center', paddingVertical: 60 },
  emptyIcon: { fontSize: 48, marginBottom: 12 },
  emptyTitle: { color: '#00ff88', fontSize: 16, fontWeight: 'bold', marginBottom: 8 },
  emptyText: { color: '#556677', textAlign: 'center', lineHeight: 20, paddingHorizontal: 20 },

  alertCard: {
    backgroundColor: '#0d0d2b',
    borderRadius: 10,
    padding: 14,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#1a1a3a',
  },
  alertCardCritical: { borderColor: '#ff335560', backgroundColor: '#1a0a0f' },
  alertCardWarning: { borderColor: '#ffcc0040', backgroundColor: '#1a1500' },
  alertCardAck: { opacity: 0.5 },

  alertHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 8 },
  alertIcon: { fontSize: 18, marginRight: 8 },
  alertMeta: { flex: 1 },
  alertSeverity: { fontSize: 11, fontWeight: 'bold', letterSpacing: 1 },
  alertTime: { color: '#556677', fontSize: 10 },

  ackBtn: {
    backgroundColor: '#1a2a3a',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#3366aa',
  },
  ackBtnText: { color: '#7799ff', fontSize: 10, fontWeight: 'bold' },

  ackBadge: {
    backgroundColor: '#1a2a1a',
    width: 24,
    height: 24,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  ackBadgeText: { color: '#00ff88', fontSize: 13 },

  alertMessage: { color: '#ccd8e8', fontSize: 13, lineHeight: 18, marginBottom: 6 },
  alertDate: { color: '#3a4a5a', fontSize: 10 },
  textMuted: { color: '#3a4a5a' },
});

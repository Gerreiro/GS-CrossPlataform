import React, { useState } from 'react';
import { ScrollView, View, StyleSheet, Alert } from 'react-native';
import { useMission, MissionConfig } from '../context/MissionContext';
import { SectionCard } from '../components/SectionCard';
import { FormField } from '../components/FormField';
import { PrimaryButton } from '../components/PrimaryButton';

// ─── Validation rules ─────────────────────────────────────────────────────────

interface ValidationRule {
  required?: boolean;
  minLength?: number;
  maxLength?: number;
  pattern?: RegExp;
  patternMessage?: string;
  min?: number;
  max?: number;
}

const RULES: Partial<Record<keyof MissionConfig, ValidationRule>> = {
  missionName:   { required: true, minLength: 3, maxLength: 30 },
  commanderName: { required: true, minLength: 3, maxLength: 50 },
  launchDate:    { required: true, pattern: /^\d{2}\/\d{2}\/\d{4}$/, patternMessage: 'Formato: DD/MM/AAAA' },
  targetPlanet:  { required: true },
  crewCount:     { required: true, pattern: /^\d+$/, patternMessage: 'Apenas números', min: 1, max: 10 },
};

function validate(field: keyof MissionConfig, value: string): string | null {
  const r = RULES[field];
  if (!r) return null;
  if (r.required && !value.trim()) return 'Campo obrigatório';
  if (value && r.minLength && value.trim().length < r.minLength) return `Mínimo ${r.minLength} caracteres`;
  if (value && r.maxLength && value.trim().length > r.maxLength) return `Máximo ${r.maxLength} caracteres`;
  if (value && r.pattern && !r.pattern.test(value)) return r.patternMessage ?? 'Formato inválido';
  if (value && r.min !== undefined && Number(value) < r.min) return `Mínimo ${r.min}`;
  if (value && r.max !== undefined && Number(value) > r.max) return `Máximo ${r.max}`;
  return null;
}

// ─── Sensor Update Form ───────────────────────────────────────────────────────

function SensorUpdateForm() {
  const { dispatch } = useMission();
  const [energy, setEnergy] = useState('');
  const [fuel, setFuel]     = useState('');
  const [errors, setErrors] = useState<Record<string, string | null>>({});

  const validateNum = (v: string, min: number, max: number) => {
    if (!v.trim()) return 'Campo obrigatório';
    const n = Number(v);
    if (isNaN(n)) return 'Deve ser um número';
    if (n < min || n > max) return `Entre ${min} e ${max}`;
    return null;
  };

  const submit = () => {
    const errs = {
      energy: validateNum(energy, 0, 100),
      fuel:   validateNum(fuel, 0, 100),
    };
    setErrors(errs);
    if (Object.values(errs).some(Boolean)) return;
    dispatch({ type: 'UPDATE_SENSORS', payload: { energy: Number(energy), fuelLevel: Number(fuel) } });
    Alert.alert('✅ Sucesso', 'Sensores atualizados!');
    setEnergy('');
    setFuel('');
  };

  return (
    <SectionCard title="◈ ATUALIZAR SENSORES" accentColor="#7799ff">
      <View style={styles.formPad}>
        <FormField label="Energia" value={energy} onChangeText={setEnergy}
          error={errors.energy} placeholder="0 – 100" keyboardType="numeric" maxLength={3} required />
        <FormField label="Combustível" value={fuel} onChangeText={setFuel}
          error={errors.fuel} placeholder="0 – 100" keyboardType="numeric" maxLength={3} required />
        <PrimaryButton label="ATUALIZAR SENSORES" onPress={submit} variant="secondary" />
      </View>
    </SectionCard>
  );
}

// ─── Mission Config Form ──────────────────────────────────────────────────────

export default function ConfigScreen() {
  const { state, dispatch } = useMission();
  const [form, setForm]     = useState<MissionConfig>({ ...state.missionConfig });
  const [errors, setErrors] = useState<Partial<Record<keyof MissionConfig, string | null>>>({});

  const set = (field: keyof MissionConfig) => (value: string) => {
    setForm(prev => ({ ...prev, [field]: value }));
    setErrors(prev => ({ ...prev, [field]: validate(field, value) }));
  };

  const submit = () => {
    const newErrors: Partial<Record<keyof MissionConfig, string | null>> = {};
    (Object.keys(RULES) as (keyof MissionConfig)[]).forEach(f => { newErrors[f] = validate(f, form[f]); });
    setErrors(newErrors);
    if (Object.values(newErrors).some(Boolean)) {
      Alert.alert('Campos inválidos', 'Corrija os erros antes de salvar.');
      return;
    }
    dispatch({ type: 'UPDATE_MISSION_CONFIG', payload: form });
    Alert.alert('✅ Salvo', 'Configurações da missão salvas!');
  };

  const reset = () => {
    Alert.alert('Redefinir', 'Restaurar configurações salvas?', [
      { text: 'Cancelar', style: 'cancel' },
      { text: 'Redefinir', onPress: () => { setForm({ ...state.missionConfig }); setErrors({}); } },
    ]);
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <SectionCard title="◈ DADOS DA MISSÃO">
        <View style={styles.formPad}>
          <FormField label="Nome da Missão" value={form.missionName} onChangeText={set('missionName')}
            error={errors.missionName} placeholder="Ex: Ares VII" maxLength={30} required />
          <FormField label="Comandante" value={form.commanderName} onChangeText={set('commanderName')}
            error={errors.commanderName} placeholder="Nome completo" maxLength={50} required />
          <FormField label="Data de Lançamento (DD/MM/AAAA)" value={form.launchDate} onChangeText={set('launchDate')}
            error={errors.launchDate} placeholder="01/07/2026" maxLength={10} required />
          <FormField label="Planeta-Alvo" value={form.targetPlanet} onChangeText={set('targetPlanet')}
            error={errors.targetPlanet} placeholder="Ex: Marte" maxLength={30} required />
          <FormField label="Nº de Tripulantes (1-10)" value={form.crewCount} onChangeText={set('crewCount')}
            error={errors.crewCount} placeholder="Ex: 4" keyboardType="numeric" maxLength={2} required />
          <FormField label="Notas da Missão" value={form.notes} onChangeText={set('notes')}
            placeholder="Observações opcionais..." multiline maxLength={300} />

          <View style={styles.actions}>
            <PrimaryButton label="RESTAURAR" onPress={reset} variant="secondary" style={styles.flex1} />
            <PrimaryButton label="SALVAR MISSÃO" onPress={submit} style={styles.flex2} />
          </View>
        </View>
      </SectionCard>

      <SensorUpdateForm />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0a0a1a' },
  content:   { padding: 16, paddingBottom: 40 },
  formPad:   { padding: 14 },
  actions:   { flexDirection: 'row', gap: 10, marginTop: 4 },
  flex1:     { flex: 1 },
  flex2:     { flex: 2 },
});

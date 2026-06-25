import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, NativeModules, ActivityIndicator, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const { DispositivoInfo } = NativeModules;

const InfoCard = ({ icon, label, value }) => (
  <View style={styles.card}>
    <Ionicons name={icon} size={24} color="#2563eb" style={styles.cardIcon} />
    <View>
      <Text style={styles.cardLabel}>{label}</Text>
      <Text style={styles.cardValue}>{value}</Text>
    </View>
  </View>
);

export default function DispositivoScreen() {
  const [info, setInfo] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (Platform.OS !== 'android' || !DispositivoInfo) {
      setError('Este módulo solo está disponible en Android.');
      return;
    }
    DispositivoInfo.getInfo()
      .then(setInfo)
      .catch(() => setError('No se pudo obtener la información del dispositivo.'));
  }, []);

  if (error) {
    return (
      <View style={styles.center}>
        <Ionicons name="warning-outline" size={40} color="#f59e0b" />
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }

  if (!info) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#2563eb" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Info del Dispositivo</Text>
      <Text style={styles.subtitle}>Datos obtenidos desde un módulo nativo Android (Kotlin)</Text>

      <InfoCard icon="phone-portrait-outline" label="Modelo" value={info.modelo} />
      <InfoCard icon="business-outline" label="Fabricante" value={info.fabricante} />
      <InfoCard icon="logo-android" label="Versión de Android" value={info.androidVersion} />
      <InfoCard icon="code-slash-outline" label="SDK Version" value={String(info.sdkVersion)} />
      <InfoCard icon="server-outline" label="Almacenamiento disponible" value={`${Math.round(info.memoriaDisponibleMB)} MB`} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
    padding: 20,
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 12,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#1e293b',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 13,
    color: '#64748b',
    marginBottom: 24,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    gap: 14,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 2,
  },
  cardIcon: {
    width: 28,
  },
  cardLabel: {
    fontSize: 12,
    color: '#64748b',
    marginBottom: 2,
  },
  cardValue: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1e293b',
  },
  errorText: {
    fontSize: 15,
    color: '#64748b',
    textAlign: 'center',
    paddingHorizontal: 32,
  },
});

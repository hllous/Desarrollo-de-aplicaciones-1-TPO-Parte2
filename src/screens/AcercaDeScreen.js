import React from 'react';
import { View, Text, Image, FlatList, StyleSheet } from 'react-native';

const INTEGRANTES = [
  { id: '1', nombre: 'Nicolas Facundo Llousas', lu: '1147795', foto: require('../assets/integrantes/llousas.jpg') },
  { id: '2', nombre: 'Sebastian Andres Deya', lu: '1167157', foto: require('../assets/integrantes/deya.jpg') },
  { id: '3', nombre: 'Valentina Frisoli', lu: '1167852', foto: require('../assets/integrantes/frisoli.jpg') },
  { id: '4', nombre: 'Ignacio Sanchez Zinny', lu: '1167840', foto: require('../assets/integrantes/sanchez-zinny.jpg') },
  { id: '5', nombre: 'Ignacio Bergallo', lu: '1173481', foto: require('../assets/integrantes/bergallo.jpg') },
  { id: '6', nombre: 'Francisco Garriga', lu: '1168942', foto: require('../assets/integrantes/garriga.jpg') },
];

function IntegranteItem({ item }) {
  return (
    <View style={styles.card}>
      <Image source={item.foto} style={styles.foto} />
      <View style={styles.info}>
        <Text style={styles.nombre}>{item.nombre}</Text>
        <Text style={styles.lu}>LU: {item.lu}</Text>
      </View>
    </View>
  );
}

export default function AcercaDeScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.titulo}>Acerca De</Text>
      <Text style={styles.subtitulo}>Integrantes del equipo</Text>
      <FlatList
        data={INTEGRANTES}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <IntegranteItem item={item} />}
        contentContainerStyle={styles.lista}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f3f4f6',
    padding: 16,
  },
  titulo: {
    fontSize: 24,
    fontWeight: '800',
    color: '#111827',
    marginBottom: 4,
  },
  subtitulo: {
    fontSize: 14,
    color: '#6b7280',
    marginBottom: 16,
  },
  lista: {
    gap: 10,
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 14,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.07,
    shadowRadius: 3,
    elevation: 2,
  },
  foto: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#e5e7eb',
    marginRight: 14,
  },
  info: {
    flex: 1,
  },
  nombre: {
    fontSize: 16,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 3,
  },
  lu: {
    fontSize: 13,
    color: '#6b7280',
  },
});

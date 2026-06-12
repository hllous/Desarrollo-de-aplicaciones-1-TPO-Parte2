import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  FlatList,
  ActivityIndicator,
  Alert,
  TouchableOpacity,
  Modal,
  Platform,
  StyleSheet,
} from 'react-native';

import FuenteToggle from '../components/FuenteToggle';
import ProductoItem from '../components/ProductoItem';
import ProductoForm from '../components/ProductoForm';
import ProductoApiService from '../services/ProductoApiService';
import ProductoLocalService from '../services/ProductoLocalService';

export default function ProductosScreen() {
  const [fuente, setFuente] = useState('remota');
  const [productos, setProductos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [productoEditando, setProductoEditando] = useState(null);
  const [mostrarForm, setMostrarForm] = useState(false);

  const servicio = fuente === 'remota' ? ProductoApiService : ProductoLocalService;

  const cargar = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = fuente === 'remota'
        ? await servicio.getAll()
        : servicio.getAll();
      setProductos(data);
    } catch (e) {
      setError('No se pudo cargar los productos. Verificá tu conexión.');
    } finally {
      setLoading(false);
    }
  }, [fuente]);

  useEffect(() => {
    cargar();
  }, [cargar]);

  const handleToggle = (nuevaFuente) => {
    setFuente(nuevaFuente);
    setMostrarForm(false);
    setProductoEditando(null);
  };

  const handleCrear = async (producto) => {
    try {
      if (fuente === 'remota') {
        await servicio.create(producto);
      } else {
        servicio.create(producto);
      }
      setMostrarForm(false);
      cargar();
    } catch {
      Alert.alert('Error', 'No se pudo crear el producto.');
    }
  };

  const handleActualizar = async (producto) => {
    try {
      if (fuente === 'remota') {
        await servicio.update(productoEditando.id, producto);
      } else {
        servicio.update(productoEditando.id, producto);
      }
      setProductoEditando(null);
      setMostrarForm(false);
      cargar();
    } catch {
      Alert.alert('Error', 'No se pudo actualizar el producto.');
    }
  };

  const handleEliminar = (id) => {
    Alert.alert(
      'Confirmar eliminación',
      '¿Estás seguro que querés eliminar este producto?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Eliminar',
          style: 'destructive',
          onPress: async () => {
            try {
              if (fuente === 'remota') {
                await servicio.remove(id);
              } else {
                servicio.remove(id);
              }
              cargar();
            } catch {
              Alert.alert('Error', 'No se pudo eliminar el producto.');
            }
          },
        },
      ]
    );
  };

  const abrirEditar = (producto) => {
    setProductoEditando(producto);
    setMostrarForm(true);
  };

  const abrirCrear = () => {
    setProductoEditando(null);
    setMostrarForm(true);
  };

  const cerrarForm = () => {
    setMostrarForm(false);
    setProductoEditando(null);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.titulo}>Productos</Text>

      <FuenteToggle fuente={fuente} onToggle={handleToggle} />

      {Platform.OS === 'web' && fuente === 'local' ? (
        <View style={styles.errorBox}>
          <Text style={styles.errorTexto}>
            La base de datos local no está disponible en la versión web.{'\n'}Usá la app móvil con Expo Go.
          </Text>
        </View>
      ) : (
        <>
          {loading && <ActivityIndicator size="large" color="#2563eb" style={styles.loader} />}

          {error && (
            <View style={styles.errorBox}>
              <Text style={styles.errorTexto}>{error}</Text>
              <TouchableOpacity onPress={cargar}>
                <Text style={styles.reintentar}>Reintentar</Text>
              </TouchableOpacity>
            </View>
          )}

          {!loading && !error && (
            <FlatList
              data={productos}
              keyExtractor={(item) => String(item.id)}
              renderItem={({ item }) => (
                <ProductoItem
                  producto={item}
                  onEditar={abrirEditar}
                  onEliminar={handleEliminar}
                />
              )}
              contentContainerStyle={styles.lista}
            />
          )}
        </>
      )}

      <TouchableOpacity style={styles.fab} onPress={abrirCrear}>
        <Text style={styles.fabTexto}>+</Text>
      </TouchableOpacity>

      <Modal
        visible={mostrarForm}
        animationType="slide"
        transparent
        onRequestClose={cerrarForm}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContenido}>
            <ProductoForm
              productoInicial={productoEditando}
              onSubmit={productoEditando ? handleActualizar : handleCrear}
              onCancelar={cerrarForm}
            />
          </View>
        </View>
      </Modal>
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
  loader: {
    marginTop: 40,
  },
  errorBox: {
    backgroundColor: '#fee2e2',
    borderRadius: 8,
    padding: 14,
    marginTop: 16,
    alignItems: 'center',
  },
  errorTexto: {
    color: '#991b1b',
    fontSize: 14,
    marginBottom: 8,
    textAlign: 'center',
  },
  reintentar: {
    color: '#2563eb',
    fontWeight: '700',
    fontSize: 14,
  },
  lista: {
    paddingBottom: 90,
  },
  fab: {
    position: 'absolute',
    bottom: 24,
    right: 24,
    backgroundColor: '#2563eb',
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  fabTexto: {
    color: '#ffffff',
    fontSize: 28,
    lineHeight: 32,
    fontWeight: '400',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'flex-end',
  },
  modalContenido: {
    backgroundColor: '#ffffff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
  },
});

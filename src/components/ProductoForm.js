import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from 'react-native';

const VACIO = { nombre: '', descripcion: '', precio: '', cantidad: '' };

export default function ProductoForm({ productoInicial, onSubmit, onCancelar }) {
  const [form, setForm] = useState(VACIO);

  useEffect(() => {
    if (productoInicial) {
      setForm({
        nombre: String(productoInicial.nombre ?? ''),
        descripcion: String(productoInicial.descripcion ?? ''),
        precio: String(productoInicial.precio ?? ''),
        cantidad: String(productoInicial.cantidad ?? ''),
      });
    } else {
      setForm(VACIO);
    }
  }, [productoInicial]);

  const cambiar = (campo, valor) => setForm((prev) => ({ ...prev, [campo]: valor }));

  const enviar = () => {
    const { nombre, descripcion, precio, cantidad } = form;
    if (!nombre.trim() || !descripcion.trim() || !precio.trim() || !cantidad.trim()) {
      Alert.alert('Error', 'Todos los campos son obligatorios.');
      return;
    }
    onSubmit({
      nombre: nombre.trim(),
      descripcion: descripcion.trim(),
      precio: parseFloat(precio),
      cantidad: parseInt(cantidad, 10),
    });
    setForm(VACIO);
  };

  const esEdicion = !!productoInicial;

  return (
    <View style={styles.container}>
      <Text style={styles.titulo}>{esEdicion ? 'Editar Producto' : 'Nuevo Producto'}</Text>

      <Text style={styles.label}>Nombre</Text>
      <TextInput
        style={styles.input}
        value={form.nombre}
        onChangeText={(v) => cambiar('nombre', v)}
        placeholder="Nombre del producto"
        testID="input-nombre"
      />

      <Text style={styles.label}>Descripción</Text>
      <TextInput
        style={styles.input}
        value={form.descripcion}
        onChangeText={(v) => cambiar('descripcion', v)}
        placeholder="Descripción"
        testID="input-descripcion"
      />

      <Text style={styles.label}>Precio</Text>
      <TextInput
        style={styles.input}
        value={form.precio}
        onChangeText={(v) => cambiar('precio', v)}
        placeholder="0.00"
        keyboardType="decimal-pad"
        testID="input-precio"
      />

      <Text style={styles.label}>Cantidad</Text>
      <TextInput
        style={styles.input}
        value={form.cantidad}
        onChangeText={(v) => cambiar('cantidad', v)}
        placeholder="0"
        keyboardType="number-pad"
        testID="input-cantidad"
      />

      <View style={styles.botones}>
        <TouchableOpacity style={styles.btnCancelar} onPress={onCancelar}>
          <Text style={styles.btnCancelarTexto}>Cancelar</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.btnGuardar} onPress={enviar} testID="btn-guardar">
          <Text style={styles.btnGuardarTexto}>{esEdicion ? 'Guardar' : 'Agregar'}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#f9fafb',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  titulo: {
    fontSize: 17,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 12,
  },
  label: {
    fontSize: 13,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 4,
    marginTop: 8,
  },
  input: {
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    fontSize: 15,
    color: '#111827',
  },
  botones: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 10,
    marginTop: 16,
  },
  btnCancelar: {
    paddingHorizontal: 16,
    paddingVertical: 9,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#d1d5db',
  },
  btnCancelarTexto: {
    color: '#374151',
    fontWeight: '600',
    fontSize: 14,
  },
  btnGuardar: {
    backgroundColor: '#2563eb',
    paddingHorizontal: 16,
    paddingVertical: 9,
    borderRadius: 8,
  },
  btnGuardarTexto: {
    color: '#ffffff',
    fontWeight: '600',
    fontSize: 14,
  },
});

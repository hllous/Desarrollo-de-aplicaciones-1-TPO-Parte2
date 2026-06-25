import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

export default function ProductoItem({ producto, onEditar, onEliminar }) {
	const precioFormateado = '$' + Number(producto.precio).toFixed(2);

	return (
		<View style={styles.card}>
			<View style={styles.info}>
				<Text style={styles.nombre}>{producto.nombre}</Text>
				<Text style={styles.descripcion}>{producto.descripcion}</Text>
				<View style={styles.fila}>
					<Text style={styles.precio}>{precioFormateado}</Text>
					<Text style={styles.cantidad}>Stock: {producto.cantidad}</Text>
				</View>
			</View>
			<View style={styles.acciones}>
				<TouchableOpacity style={styles.btnEditar} onPress={() => onEditar(producto)}>
					<Text style={styles.btnTexto}>Editar</Text>
				</TouchableOpacity>
				<TouchableOpacity style={styles.btnEliminar} onPress={() => onEliminar(producto.id)}>
					<Text style={styles.btnTexto}>Eliminar</Text>
				</TouchableOpacity>
			</View>
		</View>
	);
}

const styles = StyleSheet.create({
	card: {
		backgroundColor: '#ffffff',
		borderRadius: 10,
		padding: 14,
		marginBottom: 10,
		flexDirection: 'row',
		alignItems: 'center',
		shadowColor: '#000',
		shadowOffset: { width: 0, height: 1 },
		shadowOpacity: 0.08,
		shadowRadius: 3,
		elevation: 2,
	},
	info: {
		flex: 1,
	},
	nombre: {
		fontSize: 16,
		fontWeight: '700',
		color: '#111827',
		marginBottom: 2,
	},
	descripcion: {
		fontSize: 13,
		color: '#6b7280',
		marginBottom: 6,
	},
	fila: {
		flexDirection: 'row',
		gap: 12,
	},
	precio: {
		fontSize: 14,
		fontWeight: '600',
		color: '#2563eb',
	},
	cantidad: {
		fontSize: 14,
		color: '#374151',
	},
	acciones: {
		gap: 6,
		marginLeft: 10,
	},
	btnEditar: {
		backgroundColor: '#2563eb',
		paddingHorizontal: 12,
		paddingVertical: 6,
		borderRadius: 6,
	},
	btnEliminar: {
		backgroundColor: '#ef4444',
		paddingHorizontal: 12,
		paddingVertical: 6,
		borderRadius: 6,
	},
	btnTexto: {
		color: '#ffffff',
		fontSize: 13,
		fontWeight: '600',
		textAlign: 'center',
	},
});

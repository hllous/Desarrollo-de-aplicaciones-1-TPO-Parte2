import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';

export default function HomeScreen() {
	return (
		<View style={styles.container}>
			<Image
				source={require('../assets/home-image.png')}
				style={styles.imagen}
				resizeMode="contain"
			/>
			<Text style={styles.titulo}>Gestor de Stock</Text>
			<Text style={styles.subtitulo}>TPO Parte 2</Text>
			<Text style={styles.materia}>Desarrollo de Aplicaciones 1</Text>
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: '#ffffff',
		alignItems: 'center',
		justifyContent: 'center',
		padding: 24,
	},
	imagen: {
		width: 180,
		height: 180,
		marginBottom: 28,
	},
	titulo: {
		fontSize: 30,
		fontWeight: '800',
		color: '#111827',
		textAlign: 'center',
		marginBottom: 8,
	},
	subtitulo: {
		fontSize: 18,
		fontWeight: '600',
		color: '#2563eb',
		marginBottom: 6,
	},
	materia: {
		fontSize: 14,
		color: '#6b7280',
	},
});

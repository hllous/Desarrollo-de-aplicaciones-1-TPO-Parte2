import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, ActivityIndicator, TouchableOpacity, Platform, StyleSheet } from 'react-native';

import FuenteToggle from '../components/FuenteToggle';
import StockGaugeView from '../components/StockGaugeView';
import ProductoApiService from '../services/ProductoApiService';
import ProductoLocalService from '../services/ProductoLocalService';

const UMBRAL_BAJO = 5;
const UMBRAL_MEDIO = 15;

const ETIQUETAS_NIVEL = { bajo: 'Bajo', medio: 'Medio', alto: 'Alto' };
const COLORES_NIVEL = { bajo: '#ef4444', medio: '#f59e0b', alto: '#22c55e' };

export function nivelDeProducto(cantidad) {
	if (cantidad < UMBRAL_BAJO) {
		return 'bajo';
	}
	if (cantidad <= UMBRAL_MEDIO) {
		return 'medio';
	}
	return 'alto';
}

export function calcularNiveles(productos) {
	const conteo = { bajo: 0, medio: 0, alto: 0 };
	for (const producto of productos) {
		conteo[nivelDeProducto(producto.cantidad)]++;
	}
	return conteo;
}

export function productosDelNivel(productos, nivel) {
	return productos.filter((producto) => nivelDeProducto(producto.cantidad) === nivel);
}

export default function PanelStockScreen() {
	const [fuente, setFuente] = useState('remota');
	const [productos, setProductos] = useState([]);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState(null);
	const [nivelSeleccionado, setNivelSeleccionado] = useState(null);

	function getServicio() {
		if (fuente === 'remota') {
			return ProductoApiService;
		}
		return ProductoLocalService;
	}

	const cargar = useCallback(async () => {
		setLoading(true);
		setError(null);
		setNivelSeleccionado(null);

		try {
			const data = await getServicio().getAll();
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

	const esModoLocalEnWeb = Platform.OS === 'web' && fuente === 'local';
	const { bajo, medio, alto } = calcularNiveles(productos);
	const total = productos.length;
	const productosSeleccionados = nivelSeleccionado ? productosDelNivel(productos, nivelSeleccionado) : [];

	function handleSegmentPress(event) {
		setNivelSeleccionado(event.nativeEvent.nivel);
	}

	return (
		<View style={styles.container}>
			<Text style={styles.titulo}>Panel de Stock</Text>

			<FuenteToggle fuente={fuente} onToggle={setFuente} />

			{esModoLocalEnWeb ? (
				<View style={styles.errorBox}>
					<Text style={styles.errorTexto}>
						La base de datos local no está disponible en la versión web.{'\n'}
						Usá la app móvil con Expo Go.
					</Text>
				</View>
			) : (
				<>
					{loading && (
						<ActivityIndicator size="large" color="#2563eb" style={styles.loader} />
					)}

					{error && (
						<View style={styles.errorBox}>
							<Text style={styles.errorTexto}>{error}</Text>
							<TouchableOpacity onPress={cargar}>
								<Text style={styles.reintentar}>Reintentar</Text>
							</TouchableOpacity>
						</View>
					)}

					{!loading && !error && (
						<View style={styles.contenido}>
							<StockGaugeView
								bajo={bajo}
								medio={medio}
								alto={alto}
								total={total}
								onSegmentPress={handleSegmentPress}
							/>

							<View style={styles.leyenda}>
								<LeyendaItem nivel="bajo" valor={bajo} activo={nivelSeleccionado === 'bajo'} />
								<LeyendaItem nivel="medio" valor={medio} activo={nivelSeleccionado === 'medio'} />
								<LeyendaItem nivel="alto" valor={alto} activo={nivelSeleccionado === 'alto'} />
							</View>

							<Text style={styles.totalTexto}>{total} productos en total</Text>

							{nivelSeleccionado && (
								<View style={styles.panelSeleccion} testID="panel-seleccion">
									<Text style={styles.panelTitulo}>
										Productos en stock {ETIQUETAS_NIVEL[nivelSeleccionado].toLowerCase()}
									</Text>
									{productosSeleccionados.length === 0 ? (
										<Text style={styles.panelVacio}>No hay productos en este nivel.</Text>
									) : (
										productosSeleccionados.map((producto) => (
											<View key={producto.id} style={styles.panelFila}>
												<Text style={styles.panelNombre}>{producto.nombre}</Text>
												<Text style={styles.panelCantidad}>{producto.cantidad}</Text>
											</View>
										))
									)}
								</View>
							)}
						</View>
					)}
				</>
			)}
		</View>
	);
}

function LeyendaItem({ nivel, valor, activo }) {
	return (
		<View style={[styles.leyendaItem, activo && styles.leyendaItemActivo]}>
			<View style={[styles.leyendaDot, { backgroundColor: COLORES_NIVEL[nivel] }]} />
			<Text style={styles.leyendaTexto}>{ETIQUETAS_NIVEL[nivel]}: {valor}</Text>
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
	contenido: {
		alignItems: 'center',
	},
	leyenda: {
		flexDirection: 'row',
		gap: 16,
		marginTop: 8,
	},
	leyendaItem: {
		flexDirection: 'row',
		alignItems: 'center',
		gap: 6,
		paddingHorizontal: 6,
		paddingVertical: 2,
		borderRadius: 6,
	},
	leyendaItemActivo: {
		backgroundColor: '#e5e7eb',
	},
	leyendaDot: {
		width: 10,
		height: 10,
		borderRadius: 5,
	},
	leyendaTexto: {
		fontSize: 13,
		color: '#374151',
	},
	totalTexto: {
		marginTop: 12,
		fontSize: 14,
		color: '#6b7280',
	},
	panelSeleccion: {
		width: '100%',
		backgroundColor: '#ffffff',
		borderRadius: 10,
		padding: 14,
		marginTop: 16,
	},
	panelTitulo: {
		fontSize: 14,
		fontWeight: '700',
		color: '#111827',
		marginBottom: 8,
	},
	panelVacio: {
		fontSize: 13,
		color: '#6b7280',
	},
	panelFila: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		paddingVertical: 4,
		borderBottomWidth: 1,
		borderBottomColor: '#f3f4f6',
	},
	panelNombre: {
		fontSize: 13,
		color: '#374151',
	},
	panelCantidad: {
		fontSize: 13,
		fontWeight: '700',
		color: '#111827',
	},
});

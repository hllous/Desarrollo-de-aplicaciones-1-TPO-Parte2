import React, { useState } from 'react';
import { View, Text, Pressable, StyleSheet, Platform, requireNativeComponent } from 'react-native';

const NativeStockGauge = Platform.OS === 'android' ? requireNativeComponent('StockGaugeView') : null;

const NIVELES = [
	{ nivel: 'bajo', color: '#ef4444' },
	{ nivel: 'medio', color: '#f59e0b' },
	{ nivel: 'alto', color: '#22c55e' },
];

export default function StockGaugeView({ bajo, medio, alto, total, onSegmentPress }) {
	if (NativeStockGauge) {
		return (
			<NativeStockGauge
				style={styles.gauge}
				bajo={bajo}
				medio={medio}
				alto={alto}
				onSegmentPress={onSegmentPress}
				testID="stock-gauge-native"
			/>
		);
	}

	return (
		<FallbackGauge bajo={bajo} medio={medio} alto={alto} total={total} onSegmentPress={onSegmentPress} />
	);
}

function FallbackGauge({ bajo, medio, alto, total, onSegmentPress }) {
	const [activo, setActivo] = useState(null);
	const valores = { bajo, medio, alto };

	function seleccionar(nivel) {
		setActivo(nivel);
		onSegmentPress?.({ nativeEvent: { nivel } });
	}

	function alternar(nivel) {
		seleccionar(activo === nivel ? null : nivel);
	}

	if (total <= 0) {
		return (
			<View style={styles.fallback} testID="stock-gauge-fallback">
				<Text style={styles.fallbackTexto}>Sin productos</Text>
			</View>
		);
	}

	return (
		<View style={styles.fallbackBarra} testID="stock-gauge-fallback">
			{NIVELES.filter((n) => valores[n.nivel] > 0).map((n) => (
				<Pressable
					key={n.nivel}
					testID={`segmento-${n.nivel}`}
					onPress={() => alternar(n.nivel)}
					onHoverIn={() => seleccionar(n.nivel)}
					onHoverOut={() => seleccionar(null)}
					style={[
						styles.fallbackSegmento,
						{ flex: valores[n.nivel], backgroundColor: n.color },
						activo === n.nivel && styles.fallbackSegmentoActivo,
					]}
				/>
			))}
		</View>
	);
}

const styles = StyleSheet.create({
	gauge: {
		width: 180,
		height: 180,
		alignSelf: 'center',
		marginVertical: 16,
	},
	fallback: {
		width: 180,
		height: 180,
		borderRadius: 90,
		borderWidth: 8,
		borderColor: '#e5e7eb',
		alignSelf: 'center',
		marginVertical: 16,
		alignItems: 'center',
		justifyContent: 'center',
	},
	fallbackTexto: {
		fontSize: 13,
		color: '#64748b',
		textAlign: 'center',
		paddingHorizontal: 8,
	},
	fallbackBarra: {
		flexDirection: 'row',
		height: 32,
		width: '100%',
		borderRadius: 8,
		overflow: 'hidden',
		marginVertical: 16,
	},
	fallbackSegmento: {
		height: '100%',
	},
	fallbackSegmentoActivo: {
		opacity: 0.75,
	},
});

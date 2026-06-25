import React from 'react';
import { View, Text, Switch, StyleSheet } from 'react-native';

export default function FuenteToggle({ fuente, onToggle }) {
	const esRemota = fuente === 'remota';

	function handleSwitch(valor) {
		if (valor) {
			onToggle('remota');
		} else {
			onToggle('local');
		}
	}

	return (
		<View style={styles.container}>
			<Text style={[styles.label, !esRemota && styles.labelActivo]}>Local</Text>
			<Switch
				value={esRemota}
				onValueChange={handleSwitch}
				trackColor={{ false: '#2563eb', true: '#2563eb' }}
				thumbColor="#ffffff"
			/>
			<Text style={[styles.label, esRemota && styles.labelActivo]}>Remota</Text>
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'center',
		paddingVertical: 10,
		gap: 8,
	},
	label: {
		fontSize: 14,
		color: '#9ca3af',
		fontWeight: '500',
	},
	labelActivo: {
		color: '#2563eb',
		fontWeight: '700',
	},
});

import React from 'react';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { Ionicons } from '@expo/vector-icons';

import HomeScreen from '../screens/HomeScreen';
import ProductosScreen from '../screens/ProductosScreen';
import PanelStockScreen from '../screens/PanelStockScreen';
import AcercaDeScreen from '../screens/AcercaDeScreen';

const Drawer = createDrawerNavigator();

export default function AppDrawer() {
	return (
		<Drawer.Navigator
			initialRouteName="Home"
			screenOptions={{
				headerStyle: { backgroundColor: '#2563eb' },
				headerTintColor: '#ffffff',
				headerTitleStyle: { fontWeight: '700' },
				drawerActiveTintColor: '#2563eb',
				drawerInactiveTintColor: '#374151',
				drawerStyle: { backgroundColor: '#ffffff' },
			}}
		>
			<Drawer.Screen
				name="Home"
				component={HomeScreen}
				options={{
					title: 'Inicio',
					drawerIcon: ({ color, size }) => (
						<Ionicons name="home-outline" size={size} color={color} />
					),
				}}
			/>
			<Drawer.Screen
				name="Productos"
				component={ProductosScreen}
				options={{
					title: 'Productos',
					drawerIcon: ({ color, size }) => (
						<Ionicons name="list-outline" size={size} color={color} />
					),
				}}
			/>
			<Drawer.Screen
				name="PanelStock"
				component={PanelStockScreen}
				options={{
					title: 'Panel de Stock',
					drawerIcon: ({ color, size }) => (
						<Ionicons name="pie-chart-outline" size={size} color={color} />
					),
				}}
			/>
			<Drawer.Screen
				name="AcercaDe"
				component={AcercaDeScreen}
				options={{
					title: 'Acerca De',
					drawerIcon: ({ color, size }) => (
						<Ionicons name="information-circle-outline" size={size} color={color} />
					),
				}}
			/>
		</Drawer.Navigator>
	);
}

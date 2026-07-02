import React from 'react';
import { render, waitFor, fireEvent } from '@testing-library/react-native';
import axios from 'axios';

import PanelStockScreen, { calcularNiveles, nivelDeProducto, productosDelNivel } from '../src/screens/PanelStockScreen';

jest.mock('axios');

describe('nivelDeProducto', () => {
	test('clasifica según los umbrales de cantidad', () => {
		expect(nivelDeProducto(4)).toBe('bajo');
		expect(nivelDeProducto(5)).toBe('medio');
		expect(nivelDeProducto(15)).toBe('medio');
		expect(nivelDeProducto(16)).toBe('alto');
	});
});

describe('calcularNiveles', () => {
	test('clasifica productos en bajo, medio y alto según la cantidad', () => {
		const productos = [
			{ cantidad: 2 },
			{ cantidad: 4 },
			{ cantidad: 5 },
			{ cantidad: 15 },
			{ cantidad: 16 },
			{ cantidad: 100 },
		];
		expect(calcularNiveles(productos)).toEqual({ bajo: 2, medio: 2, alto: 2 });
	});

	test('devuelve todo en cero cuando no hay productos', () => {
		expect(calcularNiveles([])).toEqual({ bajo: 0, medio: 0, alto: 0 });
	});
});

describe('productosDelNivel', () => {
	test('filtra los productos que pertenecen a un nivel dado', () => {
		const productos = [
			{ id: 1, nombre: 'Silla', cantidad: 2 },
			{ id: 2, nombre: 'Mesa', cantidad: 20 },
			{ id: 3, nombre: 'Lámpara', cantidad: 3 },
		];
		expect(productosDelNivel(productos, 'bajo')).toEqual([
			{ id: 1, nombre: 'Silla', cantidad: 2 },
			{ id: 3, nombre: 'Lámpara', cantidad: 3 },
		]);
		expect(productosDelNivel(productos, 'alto')).toEqual([{ id: 2, nombre: 'Mesa', cantidad: 20 }]);
	});
});

describe('PanelStockScreen', () => {
	afterEach(() => jest.clearAllMocks());

	test('carga los productos remotos y muestra el total en pantalla', async () => {
		axios.get.mockResolvedValue({
			data: [
				{ id: 1, nombre: 'Silla', cantidad: 2 },
				{ id: 2, nombre: 'Mesa', cantidad: 20 },
			],
		});

		const { getByText } = render(<PanelStockScreen />);

		await waitFor(() => {
			expect(getByText('2 productos en total')).toBeTruthy();
			expect(getByText('Bajo: 1')).toBeTruthy();
			expect(getByText('Alto: 1')).toBeTruthy();
		});
	});

	test('muestra el mensaje de error si falla la carga', async () => {
		axios.get.mockRejectedValue(new Error('network error'));

		const { getByText } = render(<PanelStockScreen />);

		await waitFor(() => {
			expect(getByText('No se pudo cargar los productos. Verificá tu conexión.')).toBeTruthy();
		});
	});

	test('al tocar un segmento del gráfico muestra los productos de ese nivel', async () => {
		axios.get.mockResolvedValue({
			data: [
				{ id: 1, nombre: 'Silla', cantidad: 2 },
				{ id: 2, nombre: 'Mesa', cantidad: 20 },
			],
		});

		const { getByTestId, getByText, queryByTestId } = render(<PanelStockScreen />);

		await waitFor(() => expect(getByText('2 productos en total')).toBeTruthy());

		expect(queryByTestId('panel-seleccion')).toBeNull();

		fireEvent.press(getByTestId('segmento-bajo'));

		await waitFor(() => {
			expect(getByText('Productos en stock bajo')).toBeTruthy();
			expect(getByText('Silla')).toBeTruthy();
		});

		fireEvent.press(getByTestId('segmento-bajo'));

		await waitFor(() => {
			expect(queryByTestId('panel-seleccion')).toBeNull();
		});
	});
});

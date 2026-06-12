import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import ProductoForm from '../src/components/ProductoForm';

const onSubmit = jest.fn();
const onCancelar = jest.fn();

describe('ProductoForm', () => {
  beforeEach(() => jest.clearAllMocks());

  test('llama onSubmit con los datos correctos cuando el formulario es válido', async () => {
    const { getByTestId } = render(
      <ProductoForm onSubmit={onSubmit} onCancelar={onCancelar} />
    );

    fireEvent.changeText(getByTestId('input-nombre'), 'Teclado');
    fireEvent.changeText(getByTestId('input-descripcion'), 'Mecánico');
    fireEvent.changeText(getByTestId('input-precio'), '89.99');
    fireEvent.changeText(getByTestId('input-cantidad'), '7');
    fireEvent.press(getByTestId('btn-guardar'));

    await waitFor(() => {
      expect(onSubmit).toHaveBeenCalledTimes(1);
      expect(onSubmit).toHaveBeenCalledWith({
        nombre: 'Teclado',
        descripcion: 'Mecánico',
        precio: 89.99,
        cantidad: 7,
      });
    });
  });

  test('NO llama onSubmit cuando hay campos vacíos', async () => {
    const { getByTestId } = render(
      <ProductoForm onSubmit={onSubmit} onCancelar={onCancelar} />
    );

    fireEvent.changeText(getByTestId('input-nombre'), 'Monitor');
    // descripcion, precio y cantidad quedan vacíos
    fireEvent.press(getByTestId('btn-guardar'));

    await waitFor(() => {
      expect(onSubmit).not.toHaveBeenCalled();
    });
  });

  test('pre-rellena el formulario cuando recibe productoInicial', () => {
    const inicial = { nombre: 'Monitor', descripcion: '4K', precio: 500, cantidad: 2 };
    const { getByTestId } = render(
      <ProductoForm productoInicial={inicial} onSubmit={onSubmit} onCancelar={onCancelar} />
    );

    expect(getByTestId('input-nombre').props.value).toBe('Monitor');
    expect(getByTestId('input-descripcion').props.value).toBe('4K');
    expect(getByTestId('input-precio').props.value).toBe('500');
    expect(getByTestId('input-cantidad').props.value).toBe('2');
  });
});

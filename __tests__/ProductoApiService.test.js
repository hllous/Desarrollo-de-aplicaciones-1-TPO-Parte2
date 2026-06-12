import axios from 'axios';
import ProductoApiService from '../src/services/ProductoApiService';

jest.mock('axios');

const BASE_URL = 'https://6a2bed063e2b60ab038f0b78.mockapi.io/productos';

const productoMock = { id: '1', nombre: 'Laptop', descripcion: 'Notebook', precio: 1500, cantidad: 5 };

describe('ProductoApiService', () => {
  afterEach(() => jest.clearAllMocks());

  test('getAll retorna lista de productos', async () => {
    axios.get.mockResolvedValue({ data: [productoMock] });
    const result = await ProductoApiService.getAll();
    expect(axios.get).toHaveBeenCalledWith(BASE_URL);
    expect(result).toEqual([productoMock]);
  });

  test('create llama POST con el body correcto', async () => {
    const nuevo = { nombre: 'Mouse', descripcion: 'Inalámbrico', precio: 25, cantidad: 10 };
    axios.post.mockResolvedValue({ data: { id: '2', ...nuevo } });
    const result = await ProductoApiService.create(nuevo);
    expect(axios.post).toHaveBeenCalledWith(BASE_URL, nuevo);
    expect(result.nombre).toBe('Mouse');
  });

  test('update llama PUT con id y body correcto', async () => {
    const cambios = { nombre: 'Laptop Pro', descripcion: 'Actualizada', precio: 2000, cantidad: 3 };
    axios.put.mockResolvedValue({ data: { id: '1', ...cambios } });
    const result = await ProductoApiService.update('1', cambios);
    expect(axios.put).toHaveBeenCalledWith(`${BASE_URL}/1`, cambios);
    expect(result.nombre).toBe('Laptop Pro');
  });

  test('remove llama DELETE con el id correcto', async () => {
    axios.delete.mockResolvedValue({});
    await ProductoApiService.remove('1');
    expect(axios.delete).toHaveBeenCalledWith(`${BASE_URL}/1`);
  });
});

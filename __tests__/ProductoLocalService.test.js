jest.mock('expo-sqlite', () => {
  const db = {
    runSync: jest.fn(),
    getAllSync: jest.fn(),
    execSync: jest.fn(),
  };
  return { openDatabaseSync: jest.fn(() => db), _db: db };
});

import ProductoLocalService from '../src/services/ProductoLocalService';

const mockDb = jest.requireMock('expo-sqlite')._db;

describe('ProductoLocalService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('getAll retorna lista de productos desde SQLite', () => {
    const lista = [{ id: 1, nombre: 'Silla', descripcion: 'Ergonómica', precio: 300, cantidad: 4 }];
    mockDb.getAllSync.mockReturnValue(lista);
    const result = ProductoLocalService.getAll();
    expect(mockDb.getAllSync).toHaveBeenCalledWith('SELECT * FROM productos ORDER BY id DESC;');
    expect(result).toEqual(lista);
  });

  test('create inserta un producto y retorna el objeto con id', () => {
    mockDb.runSync.mockReturnValue({ lastInsertRowId: 5 });
    const nuevo = { nombre: 'Mesa', descripcion: 'Escritorio', precio: 150, cantidad: 2 };
    const result = ProductoLocalService.create(nuevo);
    expect(mockDb.runSync).toHaveBeenCalledWith(
      'INSERT INTO productos (nombre, descripcion, precio, cantidad) VALUES (?, ?, ?, ?);',
      ['Mesa', 'Escritorio', 150, 2]
    );
    expect(result.id).toBe(5);
    expect(result.nombre).toBe('Mesa');
  });

  test('update ejecuta UPDATE con los valores correctos', () => {
    mockDb.runSync.mockReturnValue({});
    const cambios = { nombre: 'Silla Pro', descripcion: 'Actualizada', precio: 400, cantidad: 6 };
    const result = ProductoLocalService.update(1, cambios);
    expect(mockDb.runSync).toHaveBeenCalledWith(
      'UPDATE productos SET nombre = ?, descripcion = ?, precio = ?, cantidad = ? WHERE id = ?;',
      ['Silla Pro', 'Actualizada', 400, 6, 1]
    );
    expect(result.id).toBe(1);
  });

  test('remove ejecuta DELETE con el id correcto', () => {
    mockDb.runSync.mockReturnValue({});
    ProductoLocalService.remove(1);
    expect(mockDb.runSync).toHaveBeenCalledWith('DELETE FROM productos WHERE id = ?;', [1]);
  });
});

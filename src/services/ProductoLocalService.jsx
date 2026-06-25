import * as SQLite from 'expo-sqlite';

let _db = null;

function getDb() {
	if (!_db) {
		_db = SQLite.openDatabaseSync('stock.db');
		_db.execSync(
			`CREATE TABLE IF NOT EXISTS productos (
				id INTEGER PRIMARY KEY AUTOINCREMENT,
				nombre TEXT NOT NULL,
				descripcion TEXT,
				precio REAL NOT NULL,
				cantidad INTEGER NOT NULL
			);`
		);
	}
	return _db;
}

function getAll() {
	return getDb().getAllSync('SELECT * FROM productos ORDER BY id DESC;');
}

function create(producto) {
	const { nombre, descripcion, precio, cantidad } = producto;
	const result = getDb().runSync(
		'INSERT INTO productos (nombre, descripcion, precio, cantidad) VALUES (?, ?, ?, ?);',
		[nombre, descripcion, precio, cantidad]
	);
	return { id: result.lastInsertRowId, nombre, descripcion, precio, cantidad };
}

function update(id, producto) {
	const { nombre, descripcion, precio, cantidad } = producto;
	getDb().runSync(
		'UPDATE productos SET nombre = ?, descripcion = ?, precio = ?, cantidad = ? WHERE id = ?;',
		[nombre, descripcion, precio, cantidad, id]
	);
	return { id, nombre, descripcion, precio, cantidad };
}

function remove(id) {
	getDb().runSync('DELETE FROM productos WHERE id = ?;', [id]);
}

export default { getAll, create, update, remove };

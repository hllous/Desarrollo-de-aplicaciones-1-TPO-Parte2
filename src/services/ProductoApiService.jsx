import axios from 'axios';

const BASE_URL = 'https://6a2bed063e2b60ab038f0b78.mockapi.io/productos';

async function getAll() {
	const response = await axios.get(BASE_URL);
	return response.data;
}

async function create(producto) {
	const response = await axios.post(BASE_URL, producto);
	return response.data;
}

async function update(id, producto) {
	const response = await axios.put(`${BASE_URL}/${id}`, producto);
	return response.data;
}

async function remove(id) {
	await axios.delete(`${BASE_URL}/${id}`);
}

export default { getAll, create, update, remove };

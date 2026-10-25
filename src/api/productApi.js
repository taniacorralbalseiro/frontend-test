const API_BASE_URL = 'https://itx-frontend-test.onrender.com/api';

export async function getProducts(signal) {
    const response = await fetch(`${API_BASE_URL}/product`, {
        signal
    });

    if (!response.ok) {
        throw new Error('Error al obtener los productos');
    }

    return response.json();
}
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

export async function getProductDetail(id, signal) {
    const response = await fetch(
        `${API_BASE_URL}/product/${encodeURIComponent(id)}`,
        { signal }
    );

    if (!response.ok) {
        throw new Error('Error al obtener los detalles del producto');
    }

    return response.json();
}

export async function addToCart(id, colorCode, storageCode) {
    const producto = {
        id,
        colorCode,
        storageCode
    };
    const response = await fetch(`${API_BASE_URL}/cart`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(producto)
    });

    if (!response.ok) {
        throw new Error('Error al añadir el producto a la cesta');
    }

    return response.json();
}
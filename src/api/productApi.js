import {getCache, setCache} from "../utils/cache.js";

const API_BASE_URL = 'https://itx-frontend-test.onrender.com/api';

export async function getProducts(signal) {

    const cacheProducts = getCache("products");
    if (cacheProducts === null) {
        const response = await fetch(`${API_BASE_URL}/product`, {
            signal
        });

        if (!response.ok) {
            throw new Error('Error al obtener los productos');
        }
        const data = await response.json();
        setCache("products", data);
        return data;
    }
    return cacheProducts;
}

export async function getProductDetail(id, signal) {

    const cacheKey = `product-${id}`;
    const cacheProduct = getCache(cacheKey);

    if (cacheProduct === null) {
        const response = await fetch(
            `${API_BASE_URL}/product/${encodeURIComponent(id)}`,
            {signal}
        );

        if (!response.ok) {
            throw new Error('Error al obtener los detalles del producto');
        }
        const data = await response.json();
        setCache(cacheKey, data);
        return data;
    }
    return cacheProduct;
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


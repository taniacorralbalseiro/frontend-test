// @vitest-environment jsdom

import {describe, it, expect, vi, beforeEach, afterEach} from "vitest";
import {getProducts, getProductDetail, addToCart} from "../../api/productApi.js";
import {setCache, getCache} from "../../utils/cache.js";

describe("getProducts", () => {

    beforeEach(() => {
        localStorage.clear();
    });

    afterEach(() => {
        vi.unstubAllGlobals();
    });

    it("debe devolver los productos de caché sin llamar a la API", async () => {
        const productos = [
            {id: "1", brand: "Apple", model: "iPhone"},
            {id: "2", brand: "Samsung", model: "Galaxy"}
        ];
        const fetchMock= vi.fn();
        setCache("products", productos);
        vi.stubGlobal("fetch", fetchMock);
        const resultado = await getProducts();
        expect(resultado).toEqual(productos);
        expect(fetchMock).not.toHaveBeenCalled();
    });

    it("debe consultar la API cuando la caché está vacia", async () => {
        const productos = [
            {id: "1", brand: "Apple", model: "iPhone"},
            {id: "2", brand: "Samsung", model: "Galaxy"}
        ];
        const fetchMock = vi.fn().mockResolvedValue({
            ok: true,
            json: async () => productos
        });
        vi.stubGlobal("fetch", fetchMock);
        const resultado = await getProducts();
        expect(resultado).toEqual(productos);
        expect(fetchMock).toHaveBeenCalled();
        expect(getCache("products")).toEqual(productos);
    });

    it("debe lanzar un error si la API falla", async () => {
        const fetchMock = vi.fn().mockResolvedValue({
            ok: false,
            status: 500
        });
        vi.stubGlobal("fetch", fetchMock);
        await expect(getProducts()).rejects.toThrow(
            "Error al obtener los productos"
        );
        expect(getCache("products")).toBe(null);

    });
});

describe("getProductDetail", () => {
    beforeEach(() => {
        localStorage.clear();
    });

    afterEach(() => {
        vi.unstubAllGlobals();
    });
    it("debe recuperar el detalle de un producto desde caché sin llamar a la API", async () => {
        const producto1 = {
            id: "1",
            brand: "Apple",
            model: "iPhone"
        };

        const producto2 = {
            id: "2",
            brand: "Samsung",
            model: "Galaxy"
        };

        setCache("product-1", producto1);
        setCache("product-2", producto2);
        const fetchMock= vi.fn();
        vi.stubGlobal("fetch", fetchMock);
        const resultado = await getProductDetail("1");
        expect(resultado).toEqual(producto1);
        expect(fetchMock).not.toHaveBeenCalled();
        const resultado2 = await getProductDetail("2");
        expect(resultado2).toEqual(producto2);
        expect(fetchMock).not.toHaveBeenCalled();
    });

    it("debe consultar la API cuando el producto no está en caché", async () => {
        const producto = {
            id: "1",
            brand: "Apple",
            model: "iPhone"
        };

        const fetchMock = vi.fn().mockResolvedValue({
            ok: true,
            json: async () => producto
        });
        vi.stubGlobal("fetch", fetchMock);
        const resultado = await getProductDetail("1");
        expect(resultado).toEqual(producto);
        expect(fetchMock).toHaveBeenCalledTimes(1);
        expect(getCache("product-1")).toEqual(producto);
        expect(fetchMock).toHaveBeenCalledWith(
            "https://itx-frontend-test.onrender.com/api/product/1",
            {signal: undefined}
        );
    });

    it("debe lanzar un error si falla la petición del detalle", async () => {
        const fetchMock = vi.fn().mockResolvedValue({
            ok: false,
            status: 500
        });
        vi.stubGlobal("fetch", fetchMock);
        await expect(getProductDetail("1")).rejects.toThrow(
            "Error al obtener los detalles del producto"
        );
        expect(getCache("product-1")).toBe(null);
        expect(fetchMock).toHaveBeenCalledTimes(1);
    });

});

describe("addToCart", () => {
    beforeEach(() => {
        localStorage.clear();
    });

    afterEach(() => {
        vi.unstubAllGlobals();
    });

    it("debe añadir un producto correctamente", async () => {
        const fetchMock = vi.fn().mockResolvedValue({
            ok: true,
            json: async () => ({count: 1})
        });
        vi.stubGlobal("fetch", fetchMock);
        const resultado = await addToCart("1", 1000, 2000);
        expect(resultado).toEqual({count: 1});
        expect(fetchMock).toHaveBeenCalledWith(
            expect.any(String),
            expect.objectContaining({
                method: "POST"
            })
        );
        expect(fetchMock).toHaveBeenCalledWith(
            expect.any(String),
            expect.objectContaining({
                body: JSON.stringify({
                    id: "1",
                    colorCode: 1000,
                    storageCode: 2000
                })
            })
        );
        expect(fetchMock).toHaveBeenCalledWith(
            expect.any(String),
            expect.objectContaining({
                headers: {
                    "Content-Type": "application/json"
                }
            })
        );
    });

    it("debe lanzar un error si falla la petición al carrito", async () => {
        const fetchMock = vi.fn().mockResolvedValue({
            ok: false,
            status: 500
        });
        vi.stubGlobal("fetch", fetchMock);
        await expect(addToCart("1", 1000, 2000)).rejects.toThrow(
            "Error al añadir el producto a la cesta"
        );
        expect(fetchMock).toHaveBeenCalledTimes(1);
    });
});
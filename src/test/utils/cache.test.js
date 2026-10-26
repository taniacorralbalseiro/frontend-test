// @vitest-environment jsdom
import {describe, it, expect, beforeEach, afterEach, vi} from "vitest";
import {getCache, setCache} from "../../utils/cache.js";

describe("getCache", () => {

    beforeEach(() => {
        localStorage.clear();
    });

    afterEach(() => {
        vi.useRealTimers();
    });

    it("debe devolver null si la clave no existe", () => {
        expect(getCache("clave-inexistente")).toBe(null);
    });

    it("debe recuperar los datos guardados en caché", () => {
        const productos = [
            {id: "1", model: "iPhone"},
            {id: "2", model: "Samsung"}
        ];
        setCache("products", productos);
        const resultado = getCache("products");

        expect(resultado).toEqual(productos);
    });

    it("debe devolver null cuando la caché ha caducado", () => {
        vi.useFakeTimers();

        const productos = [
            {id: "1", model: "iPhone"},
            {id: "2", model: "Samsung"}
        ];

        vi.setSystemTime(new Date("2026-10-25T10:00:00"));
        setCache("products", productos);
        vi.setSystemTime(new Date("2026-10-25T11:05:00"));
        expect(getCache("products")).toBe(null);
    });

    it("debe devolver los datos si la caché no ha caducado", () => {
        vi.useFakeTimers();

        const productos = [
            {id: "1", model: "iPhone"},
            {id: "2", model: "Samsung"}
        ];

        vi.setSystemTime(new Date("2026-10-25T10:00:00"));
        setCache("products", productos);
        vi.setSystemTime(new Date("2026-10-25T10:50:00"));
        expect(getCache("products")).toEqual(productos);
    });

    it("debe eliminar la caché si el JSON es inválido", () => {
        localStorage.setItem("products", "esto no es un JSON válido");
        const resultado = getCache("products");
        expect(resultado).toBe(null);
        expect(localStorage.getItem("products")).toBe(null);
    });
});
// @vitest-environment jsdom

import {describe, it, expect, vi, beforeEach, afterEach} from "vitest";
import {render, screen, cleanup} from "@testing-library/react";
import "@testing-library/jest-dom/vitest";
import {MemoryRouter, Routes, Route} from "react-router";

import ProductDetailPage from "../../pages/ProductDetailPage.jsx";
import {getProductDetail} from "../../api/productApi.js";

vi.mock("../../api/productApi.js", () => ({
    getProductDetail: vi.fn(),
    addToCart: vi.fn()
}));

beforeEach(() => {
    vi.mocked(getProductDetail).mockReset();
});

afterEach(() => {
    cleanup();
});

function renderDetailPage(id = "123") {
    const setCartCount = vi.fn();

    const resultado = render(
        <MemoryRouter initialEntries={[`/product/${id}`]}>
            <Routes>
                <Route
                    path="/product/:id"
                    element={
                        <ProductDetailPage setCartCount={setCartCount} />
                    }
                />
            </Routes>
        </MemoryRouter>
    );

    return {...resultado, setCartCount};
}

describe("ProductDetailPage", () => {

    const producto = {
        id: "123",
        brand: "Samsung",
        model: "Galaxy S24",
        price: "750",
        imgUrl: "/samsung.jpg",
        cpu: "Exynos 2400",
        ram: "8 GB",
        os: "Android",
        displaySize: "1080 x 2340",
        primaryCamera: ["50 MP"],
        secondaryCmera: ["12 MP"],
        battery: "4000 mAh",
        dimentions: "147 x 70 x 7.6 mm",
        weight: "167",
        options: {
            colors: [{code: 1, name: "Negro"}],
            storages: [{code: 128, name: "128 GB"}]
        }
    };

    it("debe mostrar un mensaje mientras carga el producto", () => {
        vi.mocked(getProductDetail).mockImplementation(
            () => new Promise(() => {})
        );

        renderDetailPage();

        expect(
            screen.getByText("Cargando producto...")
        ).toBeInTheDocument();
    });

    it("debe solicitar el producto correspondiente al ID de la URL y devuelve no disponible", async () => {
        vi.mocked(getProductDetail).mockResolvedValue(null);

        renderDetailPage("456");

        expect(getProductDetail).toHaveBeenCalledWith(
            "456",
            expect.any(AbortSignal)
        );

        expect(
            await screen.findByText("Producto no disponible")
        ).toBeInTheDocument();
    });

    it("debe mostrar los detalles del producto obtenido de la API", async () => {
        vi.mocked(getProductDetail).mockResolvedValue(producto);

        renderDetailPage();

        expect(
            await screen.findByRole("heading", {
                name: "Detalles del producto"
            })
        ).toBeInTheDocument();

        expect(screen.getByText("Samsung")).toBeInTheDocument();
        expect(screen.getByText("Galaxy S24")).toBeInTheDocument();
        expect(screen.getByText("750 €")).toBeInTheDocument();
        expect(screen.getByText("Exynos 2400")).toBeInTheDocument();

        const imagen = screen.getByRole("img", {
            name: "Samsung Galaxy S24"
        });

        expect(imagen).toHaveAttribute("src", "/samsung.jpg");

        expect(
            screen.getByRole("button", {name: "Añadir al carrito"})
        ).toBeInTheDocument();
    });

    it("debe mostrar un mensaje de error si falla la API", async () => {
        vi.mocked(getProductDetail).mockRejectedValue(
            new Error("Error del servidor")
        );

        renderDetailPage();

        expect(
            await screen.findByText("No se ha podido cargar el producto")
        ).toBeInTheDocument();

        expect(
            screen.queryByRole("button", {name: "Añadir al carrito"})
        ).not.toBeInTheDocument();
    });

    it("debe cancelar la petición al desmontar el componente", () => {
        vi.mocked(getProductDetail).mockImplementation(
            () => new Promise(() => {})
        );

        const {unmount} = renderDetailPage();
        expect(getProductDetail).toHaveBeenCalledTimes(1);
        const signal = vi.mocked(getProductDetail).mock.calls[0][1];
        expect(signal.aborted).toBe(false);
        unmount();
        expect(signal.aborted).toBe(true);
    });
});
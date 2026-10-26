// @vitest-environment jsdom

import {describe, it, expect, vi, beforeEach, afterEach} from "vitest";
import {cleanup, render, screen} from "@testing-library/react";
import "@testing-library/jest-dom/vitest";
import {getProducts} from "../../api/productApi.js";
import ProductListPage from "../../pages/ProductListPage.jsx";
import {MemoryRouter} from "react-router";
import userEvent from "@testing-library/user-event";
vi.mock("../../api/productApi.js", () => ({
    getProducts: vi.fn()
}));

beforeEach(() => {
    vi.mocked(getProducts).mockReset();
});
afterEach(() => {
    cleanup();
});
describe("ProductListPage", () => {
    const productos = [
        {
            id: "1",
            brand: "Apple",
            model: "iPhone 15",
            price: "800",
            imgUrl: "/iphone.jpg"
        },
        {
            id: "2",
            brand: "Samsung",
            model: "Galaxy S24",
            price: "700",
            imgUrl: "/samsung.jpg"
        }
    ];

    it("debe mostrar un mensaje mientras se cargan los productos", () => {
        vi.mocked(getProducts).mockImplementation(
            () => new Promise(() => {
            })
        );

        render(
            <MemoryRouter>
                <ProductListPage />
            </MemoryRouter>
        );

        expect(
            screen.getByText("Cargando productos...")
        ).toBeInTheDocument();
    });

    it("debe mostrar los productos obtenidos de la API", async () => {
        vi.mocked(getProducts).mockResolvedValue(productos);

        render(
            <MemoryRouter>
                <ProductListPage />
            </MemoryRouter>
        );

        expect(
            await screen.findByText("Apple iPhone 15")
        ).toBeInTheDocument();

        expect(
            screen.getByText("Samsung Galaxy S24")
        ).toBeInTheDocument();

        expect(
            screen.getByText("Productos encontrados: 2")
        ).toBeInTheDocument();
    });

    it("debe filtrar los productos por marca", async () => {
        vi.mocked(getProducts).mockResolvedValue(productos);

        const user = userEvent.setup();

        render(
            <MemoryRouter>
                <ProductListPage />
            </MemoryRouter>
        );

        await screen.findByText(/iPhone 15/i);

        const buscador = screen.getByRole("searchbox");

        await user.type(buscador, "Apple");

        expect(screen.getByText(/iPhone 15/i)).toBeInTheDocument();
        expect(screen.queryByText(/Galaxy S24/i)).not.toBeInTheDocument();
        expect(screen.getByText("Productos encontrados: 1")).toBeInTheDocument();
    });

    it("debe filtrar los productos por modelo", async () => {
        vi.mocked(getProducts).mockResolvedValue(productos);

        const user = userEvent.setup();

        render(
            <MemoryRouter>
                <ProductListPage />
            </MemoryRouter>
        );

        await screen.findByText(/iPhone 15/i);

        const buscador = screen.getByRole("searchbox");

        await user.type(buscador, "Galaxy");

        expect(screen.getByText(/Galaxy S24/i)).toBeInTheDocument();
        expect(screen.queryByText(/iPhone 15/i)).not.toBeInTheDocument();
        expect(screen.getByText(/Productos encontrados: 1/)).toBeInTheDocument();
    });

    it("debe buscar sin distinguir mayúsculas y minúsculas", async () => {
        vi.mocked(getProducts).mockResolvedValue(productos);

        const user = userEvent.setup();

        render(
            <MemoryRouter>
                <ProductListPage />
            </MemoryRouter>
        );

        await screen.findByText(/iPhone 15/i);

        await user.type(screen.getByRole("searchbox"), "aPpLe");

        expect(screen.getByText(/iPhone 15/i)).toBeInTheDocument();
        expect(screen.queryByText(/Galaxy S24/i)).not.toBeInTheDocument();
    });

    it("debe mostrar un mensaje si falla la API", async () => {
        vi.mocked(getProducts).mockRejectedValue(
            new Error("Error del servidor")
        );

        render(
            <MemoryRouter>
                <ProductListPage />
            </MemoryRouter>
        );

        expect(
            await screen.findByText("No se han podido cargar los productos")
        ).toBeInTheDocument();

        expect(screen.queryByRole("searchbox")).not.toBeInTheDocument();
    });

    it("debe ignorar los espacios al principio y al final de la búsqueda", async () => {
        vi.mocked(getProducts).mockResolvedValue(productos);

        const user = userEvent.setup();

        render(
            <MemoryRouter>
                <ProductListPage />
            </MemoryRouter>
        );

        await screen.findByText(/iPhone 15/i);

        await user.type(screen.getByRole("searchbox"), "  Apple  ");

        expect(screen.getByText(/iPhone 15/i)).toBeInTheDocument();
        expect(screen.queryByText(/Galaxy S24/i)).not.toBeInTheDocument();
        expect(screen.getByText(/Productos encontrados: 1/)).toBeInTheDocument();
    });

    it("debe cancelar la petición al desmontar el componente", () => {
        vi.mocked(getProducts).mockImplementation(
            () => new Promise(() => {})
        );

        const {unmount} = render(
            <MemoryRouter>
                <ProductListPage />
            </MemoryRouter>
        );

        const signal = vi.mocked(getProducts).mock.calls[0][0];

        expect(signal.aborted).toBe(false);
        unmount();
        expect(signal.aborted).toBe(true);
    });

    it("debe mostrar cero productos cuando no hay coincidencias", async () => {
        vi.mocked(getProducts).mockResolvedValue(productos);

        const user = userEvent.setup();

        render(
            <MemoryRouter>
                <ProductListPage />
            </MemoryRouter>
        );

        await screen.findByText(/iPhone 15/i);

        await user.type(screen.getByRole("searchbox"), "Nokia");

        expect(
            screen.getByText("Productos encontrados: 0")
        ).toBeInTheDocument();

        expect(screen.queryByRole("link", {
            name: /Apple iPhone 15/i
        })).not.toBeInTheDocument();

        expect(screen.queryByRole("link", {
            name: /Samsung Galaxy S24/i
        })).not.toBeInTheDocument();
    });
});

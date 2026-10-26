// @vitest-environment jsdom

import {describe, it, expect, afterEach} from "vitest";
import {render, screen, cleanup} from "@testing-library/react";
import "@testing-library/jest-dom/vitest";
import {MemoryRouter} from "react-router";
import Header from "../../components/Header.jsx";

afterEach(() => {
    cleanup();
});

describe("Header", () => {
    it("debe mostrar el nombre de la tienda", () => {
        render(
            <MemoryRouter>
                <Header cartCount={0}/>
            </MemoryRouter>
        );

        expect(
            screen.getByRole("link", {name: "Mobile Store"})
        ).toBeInTheDocument();
    });

    it("debe enlazar el logo a la página principal", () => {
        render(
            <MemoryRouter>
                <Header cartCount={0}/>
            </MemoryRouter>
        );

        const logo = screen.getByRole("link", {name: "Mobile Store"});
        expect(logo).toHaveAttribute("href", "/");
    });

    it("debe mostrar las breadcrumbs del listado", () => {
        render(
            <MemoryRouter initialEntries={["/"]}>
                <Header cartCount={0}/>
            </MemoryRouter>
        );

        const breadcrumb = screen.getByRole("navigation", {
            name: "Breadcrumb"
        });

        expect(breadcrumb).toHaveTextContent("Productos");
        expect(breadcrumb).not.toHaveTextContent("Detalle del producto");
    });

    it("debe mostrar breadcrumbs del detalle", () => {
        render(
            <MemoryRouter initialEntries={["/product/123"]}>
                <Header cartCount={0}/>
            </MemoryRouter>
        );

        const breadcrumb = screen.getByRole("navigation", {
            name: "Breadcrumb"
        });

        expect(breadcrumb).toHaveTextContent("Productos");
        expect(breadcrumb).toHaveTextContent("Detalle del producto");
    });

    it("debe mostrar correctamente el contador del carrito", () => {
        render(
            <MemoryRouter>
                <Header cartCount={3}/>
            </MemoryRouter>
        );

        expect(screen.getByText("Carrito: 3")).toBeInTheDocument();
    });
});
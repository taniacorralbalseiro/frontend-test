// @vitest-environment jsdom

import {describe, it, expect, afterEach} from "vitest";
import {cleanup, render, screen} from "@testing-library/react";
import "@testing-library/jest-dom/vitest";
import {MemoryRouter} from "react-router";
import ProductCard from "../../components/ProductCard.jsx";


afterEach(() => {
    cleanup();
});
const producto = {
    id: "123",
    brand: "Apple",
    model: "iPhone 15",
    price: "800",
    imgUrl: "/iphone.jpg"
};

describe("ProductCard", () => {
    it("debe mostrar la marca, el modelo y el precio", () => {
        render(
            <MemoryRouter>
                <ProductCard product={producto}/>
            </MemoryRouter>
        );

        expect(
            screen.getByRole("heading", {name: "Apple iPhone 15"})
        ).toBeInTheDocument();

        expect(screen.getByText("800 €")).toBeInTheDocument();
    });

    it("debe mostrar precio no disponible", () => {
        const productoSinPrecio = {
            ...producto,
            price: ""
        };

        render(
            <MemoryRouter>
                <ProductCard product={productoSinPrecio}/>
            </MemoryRouter>
        );

        expect(
            screen.getByText("Precio no disponible")
        ).toBeInTheDocument();

        expect(screen.queryByText("800 €")).not.toBeInTheDocument();
    });

    it("debe mostrar la imagen correcta del producto", () => {
        render(
            <MemoryRouter>
                <ProductCard product={producto} />
            </MemoryRouter>
        );

        const imagen = screen.getByRole("img", {
            name: "Apple iPhone 15"
        });

        expect(imagen).toHaveAttribute("src", "/iphone.jpg");
    });

    it("debe enlazar a la página de detalle correcta", () => {
        render(
            <MemoryRouter>
                <ProductCard product={producto} />
            </MemoryRouter>
        );

        const enlace = screen.getByRole("link", {
            name: /Apple iPhone 15/i
        });

        expect(enlace).toHaveAttribute("href", "/product/123");
    });
});
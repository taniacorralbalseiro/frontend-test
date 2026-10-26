// @vitest-environment jsdom

import {describe, it, expect, vi, afterEach, beforeEach} from "vitest";
import {cleanup, render, screen, waitFor} from "@testing-library/react";
import "@testing-library/jest-dom/vitest";
import ProductActions from "../../components/ProductActions.jsx";
import userEvent from "@testing-library/user-event";
import {addToCart} from "../../api/productApi.js";

const producto = {
    id: "1",
    options: {
        colors: [
            {code: 1000, name: "Black"},
            {code: 1001, name: "White"}
        ],
        storages: [
            {code: 2000, name: "16 GB"},
            {code: 2001, name: "32 GB"}
        ]
    }
};
vi.mock("../../api/productApi.js", () => ({
    addToCart: vi.fn()
}));
describe("ProductActions", () => {
    beforeEach(() => {
        vi.mocked(addToCart).mockReset();
    });
    afterEach(() => {
        cleanup();
    });
    it("debe mostrar los selectores de color y almacenamiento", () => {
        render(
            <ProductActions
                product={producto}
                setCartCount={vi.fn()}
            />
        );
        const selectorColor = screen.getByLabelText("Color:");

        expect(selectorColor).toBeInTheDocument();
        expect(screen.getByLabelText("Almacenamiento:")).toBeInTheDocument();
        expect(screen.getByLabelText("Color:")).toHaveValue("1000");
        expect(screen.getByLabelText("Almacenamiento:")).toHaveValue("2000");
    });

    it("debe permitir cambiar el color seleccionado", async () => {
        render(
            <ProductActions
                product={producto}
                setCartCount={vi.fn()}
            />
        );
        const selectorColor = screen.getByLabelText("Color:");
        const user = userEvent.setup();
        await user.selectOptions(selectorColor, "1001");
        expect(selectorColor).toHaveValue("1001");
    });

    it("debe permitir cambiar el almacenamiento seleccionado", async () => {
        render(
            <ProductActions
                product={producto}
                setCartCount={vi.fn()}
            />
        );
        const selectorStorage = screen.getByLabelText("Almacenamiento:");
        const user = userEvent.setup();
        await user.selectOptions(selectorStorage, "2001");
        expect(selectorStorage).toHaveValue("2001");
    });

    it("debe llamar a addToCart al pulsar el botón", async () => {
        vi.mocked(addToCart).mockResolvedValue({count: 1});
        render(
            <ProductActions
                product={producto}
                setCartCount={vi.fn()}
            />
        );


        const boton = screen.getByRole("button", {
            name: "Añadir al carrito"
        });
        const user = userEvent.setup();

        await user.click(boton);
        expect(addToCart).toHaveBeenCalledTimes(1);
    });

    it("debe añadir un producto al carrito y actualizar el contador", async () => {
        const setCartCount = vi.fn();

        vi.mocked(addToCart).mockResolvedValue({count: 1});

        render(
            <ProductActions
                product={producto}
                setCartCount={setCartCount}
            />
        );

        const user = userEvent.setup();
        const boton = screen.getByRole("button", {
            name: "Añadir al carrito"
        });

        await user.click(boton);

        expect(addToCart).toHaveBeenCalledTimes(1);
        expect(addToCart).toHaveBeenCalledWith(
            "1",
            1000,
            2000
        );

        await waitFor(() => {
            expect(setCartCount).toHaveBeenCalledTimes(1);
        });

        const actualizarContador = setCartCount.mock.calls[0][0];
        expect(actualizarContador(2)).toBe(3);
    });

    it("debe mostrar un error si falla la petición al carrito", async () => {
        const setCartCount = vi.fn();

        vi.mocked(addToCart).mockRejectedValue(
            new Error("Error del servidor")
        );

        render(
            <ProductActions
                product={producto}
                setCartCount={setCartCount}
            />
        );

        const user = userEvent.setup();

        await user.click(
            screen.getByRole("button", {name: "Añadir al carrito"})
        );

        expect(
            await screen.findByRole("alert")
        ).toHaveTextContent("No se ha podido añadir el producto a la cesta");

        expect(setCartCount).not.toHaveBeenCalled();
    });

    it("debe desactivar el botón mientras se añade el producto", async () => {
        let resolverPeticion;

        vi.mocked(addToCart).mockImplementation(
            () => new Promise(resolve => {
                resolverPeticion = resolve;
            })
        );

        render(
            <ProductActions
                product={producto}
                setCartCount={vi.fn()}
            />
        );

        const user = userEvent.setup();

        const boton = screen.getByRole("button", {
            name: "Añadir al carrito"
        });

        await user.click(boton);

        expect(
            screen.getByRole("button", {name: "Añadiendo..."})
        ).toBeDisabled();

        expect(addToCart).toHaveBeenCalledTimes(1);

        resolverPeticion({count: 1});

        await waitFor(() => {
            expect(
                screen.getByRole("button", {name: "Añadir al carrito"})
            ).toBeEnabled();
        });
    });

    it("debe seleccionar automáticamente el único color y almacenamiento disponibles", () => {
        const productoUnico = {
            id: "3",
            options: {
                colors: [
                    {code: 1000, name: "Black"}
                ],
                storages: [
                    {code: 2000, name: "16 GB"}
                ]
            }
        };

        render(
            <ProductActions
                product={productoUnico}
                setCartCount={vi.fn()}
            />
        );

        expect(
            screen.getByLabelText("Color:")
        ).toHaveValue("1000");

        expect(
            screen.getByLabelText("Almacenamiento:")
        ).toHaveValue("2000");
    });
});
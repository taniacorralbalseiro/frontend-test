// @vitest-environment jsdom

import {describe, it, expect, afterEach} from "vitest";
import {render, screen, cleanup} from "@testing-library/react";
import "@testing-library/jest-dom/vitest";
import ProductSpecifications from "../../components/ProductSpecifications.jsx";

afterEach(() => {
    cleanup();
});

describe("ProductSpecifications", () => {
    const producto = {
        brand: "Samsung",
        model: "Galaxy S24",
        price: "750",
        cpu: "Exynos 2400",
        ram: "8 GB",
        os: "Android",
        displaySize: "1080 x 2340",
        primaryCamera: ["50 MP", "12 MP"],
        secondaryCmera: ["12 MP"],
        battery: "4000 mAh",
        dimentions: "147 x 70 x 7.6 mm",
        weight: "167"
    };

    it("debe mostrar correctamente las especificaciones del producto", () => {
        render(<ProductSpecifications product={producto} />);

        expect(screen.getByText("Samsung")).toBeInTheDocument();
        expect(screen.getByText("Galaxy S24")).toBeInTheDocument();
        expect(screen.getByText("750 €")).toBeInTheDocument();
        expect(screen.getByText("Exynos 2400")).toBeInTheDocument();
        expect(screen.getByText("8 GB")).toBeInTheDocument();
        expect(screen.getByText("Android")).toBeInTheDocument();
        expect(screen.getByText("1080 x 2340")).toBeInTheDocument();
        expect(screen.getByText("4000 mAh")).toBeInTheDocument();
        expect(screen.getByText("147 x 70 x 7.6 mm")).toBeInTheDocument();
        expect(screen.getByText("167 g")).toBeInTheDocument();
    });

    it("debe mostrar no disponible en todas las especificaciones del producto", () => {

        const productoVacio = {};
        render(<ProductSpecifications product={productoVacio} />);

        const valoresNoDisponibles = screen.getAllByText("No disponible");

        expect(valoresNoDisponibles).toHaveLength(12);
    });

    it("debe mostrar correctamente las cámaras cuando son arrays", () => {
        render(<ProductSpecifications product={producto} />);

        expect(screen.getByText("50 MP, 12 MP")).toBeInTheDocument();
        expect(screen.getByText("12 MP")).toBeInTheDocument();
    });

    it("debe mostrar correctamente las cámaras cuando son cadenas", () => {
        const productoConCamarasTexto = {
            ...producto,
            primaryCamera: "48 MP",
            secondaryCmera: "16 MP"
        };

        render(<ProductSpecifications product={productoConCamarasTexto} />);

        expect(screen.getByText("48 MP")).toBeInTheDocument();
        expect(screen.getByText("16 MP")).toBeInTheDocument();
    });

    it("debe mostrar No disponible cuando los arrays de cámaras están vacíos", () => {
        const productoSinCamaras = {
            ...producto,
            primaryCamera: [],
            secondaryCmera: []
        };

        render(<ProductSpecifications product={productoSinCamaras} />);

        expect(screen.getAllByText("No disponible")).toHaveLength(2);
    });
});
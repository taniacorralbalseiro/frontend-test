function ProductSpecifications({ product }) {
    return (
        <dl className="product-specifications">
            <dt>Marca</dt>
            <dd>{product.brand
                ? product.brand
                : "No disponible"}
            </dd>

            <dt>Modelo</dt>
            <dd>{product.model
                ? product.model
                : "No disponible"}
            </dd>

            <dt>Precio</dt>
            <dd>
                {product.price
                    ? `${product.price} €`
                    : "No disponible"}
            </dd>

            <dt>CPU</dt>
            <dd>{product.cpu
                ? product.cpu
                : "No disponible"}
            </dd>

            <dt>RAM</dt>
            <dd>{product.ram
                ? product.ram
                : "No disponible"}
            </dd>

            <dt>OS</dt>
            <dd>{product.os
                ? product.os
                : "No disponible"}
            </dd>

            <dt>Resolución de pantalla</dt>
            <dd>{product.displaySize
                ? product.displaySize
                : "No disponible"}
            </dd>

            <dt>Cámara principal</dt>
            <dd>{Array.isArray(product.primaryCamera)
                ? (product.primaryCamera.length > 0
                    ? product.primaryCamera.join(", ")
                    : "No disponible")
                : (product.primaryCamera || "No disponible")
            }
            </dd>

            <dt>Cámara secundaria</dt>
            <dd>{Array.isArray(product.secondaryCmera)
                ? (product.secondaryCmera.length > 0
                    ? product.secondaryCmera.join(", ")
                    : "No disponible")
                : (product.secondaryCmera || "No disponible")
            }
            </dd>

            <dt>Batería</dt>
            <dd>{product.battery
                ? `${product.battery}`
                : "No disponible"}</dd>

            <dt>Dimensiones</dt>
            <dd>{product.dimentions !== "-" && product.dimentions
                ? `${product.dimentions}`
                : "No disponible"}
            </dd>

            <dt>Peso</dt>
            <dd>{product.weight
                ? `${product.weight} g`
                : "No disponible"}
            </dd>
        </dl>
    );
}

export default ProductSpecifications;
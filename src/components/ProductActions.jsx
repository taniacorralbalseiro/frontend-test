import {useState} from "react";
import {addToCart} from "../api/productApi.js";

function ProductActions({product, setCartCount}){

    const [selectedColor, setSelectedColor] = useState(product.options.colors[0]?.code ?? null);
    const [selectedStorage, setSelectedStorage] = useState(product.options.storages[0]?.code ?? null);
    const [error, setError] = useState(null);
    const [addingToCart, setAddingToCart] = useState(false);

    async function handleAddToCart() {

        if (addingToCart) return;

        setAddingToCart(true);
        setError(null);

        try{
            const dataCart = await addToCart(product.id, selectedColor, selectedStorage);
            setCartCount(prevCount => prevCount + dataCart.count);
        } catch {
            setError('No se ha podido añadir el producto a la cesta');
        } finally {
            setAddingToCart(false);
        }
    }

    return(
        <div className= "product-actions">
            <label htmlFor="color">Color:</label>
            <select
                id="color"
                value={selectedColor}
                onChange={(event) => setSelectedColor(Number(event.target.value))}
            >
                {product.options.colors.map(color => (
                    <option key={color.code} value={color.code}>
                        {color.name}
                    </option>
                ))}

            </select>

            <label htmlFor="storage">Almacenamiento:</label>
            <select
                id="storage"
                value={selectedStorage}
                onChange={(event) => setSelectedStorage(Number(event.target.value))}
            >
                {product.options.storages.map(storage => (
                    <option key={storage.code} value={storage.code}>
                        {storage.name}
                    </option>
                ))}

            </select>

            <button
                onClick={handleAddToCart}
                disabled={addingToCart}
            >
                {addingToCart ? "Añadiendo..." : "Añadir al carrito"}
            </button>
            {error && <p className="cart-error" role="alert">{error}</p>}
        </div>

)
}
export default ProductActions;
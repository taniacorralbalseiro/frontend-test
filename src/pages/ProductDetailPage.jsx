import {useParams} from 'react-router';
import {useEffect, useState} from "react";
import {getProductDetail} from "../api/productApi.js";
import ProductSpecifications from "../components/ProductSpecifications.jsx";
import ProductActions from "../components/ProductActions.jsx";

function ProductDetailPage({setCartCount}) {
    const {id} = useParams();
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const controller = new AbortController();

        async function loadProduct() {
            setLoading(true);
            setError(null);
            setProduct(null);

            try {
                const data = await getProductDetail(id, controller.signal);
                if (!controller.signal.aborted) {
                    setProduct(data);
                }
            } catch (error) {
                if (error.name !== 'AbortError') {
                    setError('No se ha podido cargar el producto');
                }
            } finally {
                if (!controller.signal.aborted) {
                    setLoading(false);
                }
            }
        }
        loadProduct();

        return () => {
            controller.abort();
        };

    }, [id]);

    if (loading) {
        return <p> Cargando producto... </p>;
    }

    if (error){
        return <p> {error} </p>;
    }

    if (!product) {
        return <p>Producto no disponible</p>;
    }


    return (
        <div className="product-detail-page">
            <img
                className="product-detail-image"
                src={product.imgUrl}
                alt={`${product.brand} ${product.model}`}
            />

            <div>
                <h1>Detalles del producto</h1>
                <ProductSpecifications product={product} />
                <ProductActions key={product.id} product={product} setCartCount={setCartCount}/>
            </div>

        </div>
    );
}

export default ProductDetailPage;
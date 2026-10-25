import { Link } from 'react-router';

function ProductCard({ product }) {
    return (
        <Link to={`/product/${product.id}`} className="product-card">
            <article>
                <img
                    className="product-card-image"
                    src={product.imgUrl}
                    alt={`${product.brand} ${product.model}`}
                />

                <div className="product-card-info">
                    <h2>{product.brand} {product.model}</h2>

                    <p>
                        {product.price !== ''
                            ? `${product.price} €`
                            : 'Precio no disponible'}
                    </p>
                </div>
            </article>
        </Link>
    );
}

export default ProductCard;
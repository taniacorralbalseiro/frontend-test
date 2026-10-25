import { useEffect, useState } from 'react';
import { getProducts } from '../api/productApi';
import ProductCard from '../components/ProductCard';
import SearchBar from '../components/SearchBar';

function ProductListPage() {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [search, setSearch] = useState('');

    useEffect(() => {
        const controller = new AbortController();

        async function loadProducts() {
            try {
                const data = await getProducts(controller.signal);
                if (!controller.signal.aborted) {
                    setProducts(data);
                }
            } catch (error) {
                if (error.name !== 'AbortError') {
                    setError('No se han podido cargar los productos');
                }
            } finally {
                if (!controller.signal.aborted) {
                    setLoading(false);
                }
            }
        }

        loadProducts();

        return () => {
            controller.abort();
        };
    }, []);

    if (loading) {
        return <p>Cargando productos...</p>;
    }

    if (error) {
        return <p>{error}</p>;
    }

    const filteredProducts = products.filter(product => {
        const query = search.toLowerCase().trim();

        return (
            product.brand.toLowerCase().includes(query) ||
            product.model.toLowerCase().includes(query)
        );
    });

    return (
        <section className="product-list-page">

            <div className="product-list-header">
                <h1>Listado de productos</h1>

                <SearchBar
                    search={search}
                    onSearchChange={setSearch}
                />
            </div>

            <p>Productos encontrados: {filteredProducts.length}</p>

            <div className="product-grid">
                {filteredProducts.map(product => (
                    <ProductCard
                        key={product.id}
                        product={product}
                    />
                ))}
            </div>

        </section>
    );
}

export default ProductListPage;
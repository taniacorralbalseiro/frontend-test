import { Link, useLocation } from 'react-router';

function Header() {
    const location = useLocation();
    const isHome = location.pathname === '/';

    return (
        <header className="site-header">
            <div className="header-content">

                <Link to="/" className="header-logo">
                    Mobile Store
                </Link>

                <nav className="header-breadcrumb" aria-label="Breadcrumb">
                    <Link to="/">Productos</Link>
                    {!isHome && <span> / Detalle del producto</span>}
                </nav>

                <div className="header-cart">
                    Carrito: 0
                </div>

            </div>
        </header>
    );
}

export default Header;
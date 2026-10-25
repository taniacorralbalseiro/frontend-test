import './App.css';
import { Routes, Route } from 'react-router';
import ProductListPage from './pages/ProductListPage';
import ProductDetailPage from './pages/ProductDetailPage';
import Header from './components/Header';
import {useEffect, useState} from "react";

function App() {
    const [cartCount, setCartCount] = useState(0);

    return (
        <>
            <Header cartCount={cartCount} />

            <main>
                <Routes>
                    <Route path="/" element={<ProductListPage />} />
                    <Route
                        path="/product/:id"
                        element={<ProductDetailPage setCartCount={setCartCount} />}
                    />
                </Routes>
            </main>
        </>
    );
}

export default App;
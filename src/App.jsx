import './App.css';
import { Routes, Route } from 'react-router';
import ProductListPage from './pages/ProductListPage';
import ProductDetailPage from './pages/ProductDetailPage';
import Header from './components/Header';

function App() {
    return (
        <>
            <Header />

            <main>
                <Routes>
                    <Route path="/" element={<ProductListPage />} />
                    <Route path="/product/:id" element={<ProductDetailPage />} />
                </Routes>
            </main>
        </>
    );
}

export default App;
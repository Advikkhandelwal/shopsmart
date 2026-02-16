import React from 'react';
import ProductCard from '../components/ProductCard';

const Home = ({ products, loading, onProductClick, onAddToCart }) => {
    if (loading) {
        return (
            <div className="container" style={{ padding: '40px 0' }}>
                <p>Loading the latest deals...</p>
            </div>
        );
    }

    return (
        <div>
            <div className="hero"></div>
            <div className="container products-container">
                <div className="products-grid">
                    {products.length === 0 ? (
                        <p className="text-muted">No products found. Try a different search.</p>
                    ) : (
                        products.map((p) => (
                            <ProductCard
                                key={p.id}
                                product={p}
                                onClick={onProductClick}
                                onAddToCart={onAddToCart}
                            />
                        ))
                    )}
                </div>
            </div>
        </div>
    );
};

export default Home;

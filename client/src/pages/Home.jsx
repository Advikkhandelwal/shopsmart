import React from 'react';
import ProductCard from '../components/ProductCard';

const Home = ({ products, loading, onProductClick, onAddToCart, page = 1, totalPages = 1, onPageChange }) => {
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
                {totalPages > 1 && (
                    <div className="pagination" style={{ marginTop: '20px', display: 'flex', justifyContent: 'center', gap: '8px' }}>
                        <button
                            disabled={page <= 1}
                            onClick={() => onPageChange && onPageChange(page - 1)}
                        >
                            ‹ Prev
                        </button>
                        <span>
                            Page {page} of {totalPages}
                        </span>
                        <button
                            disabled={page >= totalPages}
                            onClick={() => onPageChange && onPageChange(page + 1)}
                        >
                            Next ›
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Home;

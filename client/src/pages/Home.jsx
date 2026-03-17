import React from 'react';
import ProductCard from '../components/ProductCard';

const pick = (arr, n) => arr.slice(0, n);

const Home = ({
    products,
    loading,
    onProductClick,
    onAddToCart,
    page = 1,
    totalPages = 1,
    onPageChange,
    showSections = false,
    categories = [],
    onSelectCategory,
}) => {
    if (loading) {
        return (
            <div className="container" style={{ padding: '40px 0' }}>
                <div className="category-sections-grid">
                    {[1, 2, 3, 4].map(i => (
                        <div key={i} className="category-section loading-pulse" style={{ height: '300px' }}></div>
                    ))}
                </div>
            </div>
        );
    }

    const byCategory = products.reduce((acc, p) => {
        const c = p.category || 'Other';
        if (!acc[c]) acc[c] = [];
        acc[c].push(p);
        return acc;
    }, {});

    const sectionCategories =
        categories && categories.length > 0
            ? categories
            : Object.keys(byCategory).sort((a, b) => a.localeCompare(b));

    return (
        <div>
            <div className="hero">
                <div className="container">
                    <h1 style={{ color: 'white', fontSize: '3.5rem', fontFamily: 'Playfair Display, serif', maxWidth: '600px', lineHeight: '1.1' }}>
                        Elevate Your Lifestyle with <span style={{ color: 'var(--primary)' }}>ShopSmart</span>
                    </h1>
                    <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: '1.2rem', marginTop: '20px', maxWidth: '500px' }}>
                        Discover a curated collection of premium products delivered right to your doorstep.
                    </p>
                </div>
            </div>
            <div className="container products-container">
                {showSections ? (
                    <div className="category-sections-grid">
                        {pick(sectionCategories, 12).map((cat) => {
                            const items = byCategory[cat] || [];
                            const preview = pick(items, 4);
                            if (preview.length === 0) return null;
                            return (
                                <div key={cat} className="category-section">
                                    <div className="category-section-header">
                                        <h3 className="category-section-title">{cat}</h3>
                                        <button
                                            className="category-section-more"
                                            onClick={() => onSelectCategory && onSelectCategory(cat)}
                                        >
                                            View All
                                        </button>
                                    </div>
                                    <div className="category-section-items">
                                        {preview.map((p) => (
                                                <button
                                                    key={p.id}
                                                    className="category-section-item"
                                                    onClick={() => onProductClick(p.id)}
                                                >
                                                    <img
                                                        src={p.imageUrl || 'https://placehold.co/400?text=No+image'}
                                                        alt={p.name}
                                                    />
                                                    <span title={p.name}>{p.name}</span>
                                                </button>
                                            ))
                                        }
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                ) : (
                    <>
                        <div className="products-grid">
                            {products.length === 0 ? (
                                <div style={{ textAlign: 'center', padding: '40px', gridColumn: '1/-1' }}>
                                    <h3 className="text-muted">No products found matching your search.</h3>
                                    <button onClick={() => onSelectCategory('')} className="btn-add-cart" style={{ maxWidth: '200px', marginTop: '20px' }}>Browse All Products</button>
                                </div>
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
                            <div className="pagination" style={{ marginTop: '40px', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '16px' }}>
                                <button
                                    className="btn-add-cart"
                                    style={{ width: 'auto', padding: '8px 20px', background: page <= 1 ? '#e2e8f0' : 'var(--primary)' }}
                                    disabled={page <= 1}
                                    onClick={() => onPageChange && onPageChange(page - 1)}
                                >
                                    Previous
                                </button>
                                <span style={{ fontWeight: 600 }}>
                                    {page} of {totalPages}
                                </span>
                                <button
                                    className="btn-add-cart"
                                    style={{ width: 'auto', padding: '8px 20px', background: page >= totalPages ? '#e2e8f0' : 'var(--primary)' }}
                                    disabled={page >= totalPages}
                                    onClick={() => onPageChange && onPageChange(page + 1)}
                                >
                                    Next
                                </button>
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    );
};

export default Home;

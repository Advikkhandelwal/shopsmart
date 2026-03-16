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
                <p>Loading the latest deals...</p>
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
            <div className="hero"></div>
            <div className="container products-container">
                {showSections ? (
                    <div className="category-sections-grid">
                        {pick(sectionCategories, 8).map((cat) => {
                            const items = byCategory[cat] || [];
                            const preview = pick(items, 4);
                            return (
                                <div key={cat} className="category-section">
                                    <div className="category-section-header">
                                        <h3 className="category-section-title">{cat}</h3>
                                        <button
                                            className="category-section-more"
                                            onClick={() => onSelectCategory && onSelectCategory(cat)}
                                        >
                                            See more
                                        </button>
                                    </div>
                                    <div className="category-section-items">
                                        {preview.length === 0 ? (
                                            <p className="text-muted">No items</p>
                                        ) : (
                                            preview.map((p) => (
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
                                        )}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                ) : (
                    <>
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
                    </>
                )}
            </div>
        </div>
    );
};

export default Home;

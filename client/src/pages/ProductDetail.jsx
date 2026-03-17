import React from 'react';

const ProductDetail = ({ product, loading, onAddToCart, onBack }) => {
    if (loading) return (
        <div className="container" style={{ padding: '60px 0' }}>
            <div className="loading-pulse" style={{ height: '400px', borderRadius: '20px' }}></div>
        </div>
    );

    if (!product) return (
        <div className="container" style={{ padding: '60px 0', textAlign: 'center' }}>
            <h2>Product not found</h2>
            <button className="btn-add-cart" style={{ maxWidth: '200px', marginTop: '20px' }} onClick={onBack}>Go Back Home</button>
        </div>
    );

    return (
        <div className="container">
            <button 
                onClick={onBack}
                style={{ marginTop: '20px', color: 'var(--accent)', fontWeight: 600 }}
            >
                ← Back to results
            </button>

            <div className="product-detail-container">
                <div className="detail-image-box">
                    <img
                        src={product.imageUrl || 'https://placehold.co/600?text=No+image'}
                        alt={product.name}
                        style={{ maxWidth: '100%', maxHeight: '500px', objectFit: 'contain' }}
                    />
                </div>

                <div className="detail-info">
                    <div>
                        <p style={{ color: 'var(--accent)', fontWeight: 600, textTransform: 'uppercase', fontSize: '0.8rem', letterSpacing: '1px' }}>
                            {product.category}
                        </p>
                        <h1 className="detail-title">{product.name}</h1>
                    </div>

                    <div className="detail-price">
                        <span style={{ fontSize: '1.2rem', verticalAlign: 'top', marginRight: '2px' }}>$</span>
                        {Number(product.price).toFixed(2)}
                    </div>

                    <div className="detail-desc">
                        <h4 style={{ color: 'var(--text-main)', marginBottom: '12px' }}>Description</h4>
                        <p>{product.description || 'No detailed description available for this premium item.'}</p>
                    </div>

                    <div style={{ marginTop: '20px' }}>
                        {product.stock > 0 ? (
                            <>
                                <p style={{ color: '#10b981', fontWeight: 700, marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                    <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#10b981' }}></span>
                                    In Stock & Ready to Ship
                                </p>
                                <button
                                    className="btn-add-cart"
                                    style={{ maxWidth: '400px', padding: '16px', fontSize: '1.1rem' }}
                                    onClick={() => onAddToCart(product.id)}
                                >
                                    Add to Cart
                                </button>
                            </>
                        ) : (
                            <p style={{ color: '#ef4444', fontWeight: 700 }}>Currently Out of Stock</p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProductDetail;

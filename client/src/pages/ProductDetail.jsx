import React from 'react';

const ProductDetail = ({ product, loading, onAddToCart, onBack }) => {
    if (loading) return <div className="container mt-2">Loading product details...</div>;
    if (!product) return <div className="container mt-2">Product not found. <button onClick={onBack}>Go Back</button></div>;

    return (
        <div className="container mt-2">
            <button className="btn btn-ghost btn-sm mb-1" onClick={onBack}>
                ← Back to results
            </button>

            <div className="product-detail">
                <div className="product-image-wrapper" style={{ height: 'auto', maxHeight: '500px' }}>
                    <img
                        src={product.imageUrl || 'https://placehold.co/600?text=No+image'}
                        alt={product.name}
                        className="product-image"
                    />
                </div>

                <div className="product-info">
                    <h1 className="page-title" style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>{product.name}</h1>
                    <p className="text-muted" style={{ fontSize: '0.9rem', marginBottom: '1rem' }}>Category: {product.category}</p>

                    <hr style={{ border: '0', borderTop: '1px solid var(--border-light)', margin: '20px 0' }} />

                    <div className="product-price" style={{ fontSize: '1.8rem' }}>
                        <span style={{ fontSize: '1rem', verticalAlign: 'top' }}>$</span>
                        {Number(product.price).toFixed(2)}
                    </div>

                    <div className="description mt-2" style={{ color: 'var(--text-main)', fontSize: '1rem' }}>
                        <h4>About this item</h4>
                        <p>{product.description || 'No description available for this item.'}</p>
                    </div>

                    <div className="purchase-actions mt-2" style={{ maxWidth: '300px' }}>
                        {product.stock > 0 ? (
                            <>
                                <p style={{ color: 'var(--success)', fontWeight: 700, marginBottom: '10px' }}>In Stock</p>
                                <button
                                    className="btn-add-cart"
                                    style={{ width: '100%', padding: '12px' }}
                                    onClick={() => onAddToCart(product.id)}
                                >
                                    Add to Cart
                                </button>
                            </>
                        ) : (
                            <p style={{ color: 'var(--error)', fontWeight: 700 }}>Currently Unavailable</p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProductDetail;

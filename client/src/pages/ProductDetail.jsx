import React from 'react';

const ProductDetail = ({ product, loading, onAddToCart, onBack, user }) => {
    const [reviews, setReviews] = React.useState([]);
    const [rating, setRating] = React.useState(5);
    const [comment, setComment] = React.useState('');
    const [submitting, setSubmitting] = React.useState(false);

    React.useEffect(() => {
        if (product?.id) {
            import('../services/api').then(m => m.reviewsService.getForProduct(product.id)).then(setReviews).catch(() => {});
        }
    }, [product?.id]);

    const handleReviewSubmit = async (e) => {
        e.preventDefault();
        if (!user) return alert('Please login to leave a review');
        setSubmitting(true);
        try {
            const { reviewsService } = await import('../services/api');
            const newReview = await reviewsService.create(product.id, { rating, comment });
            setReviews([newReview, ...reviews]);
            setComment('');
            alert('Review submitted! Thank you.');
        } catch (err) {
            alert(err.message);
        } finally {
            setSubmitting(false);
        }
    };

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

            {/* Reviews Section */}
            <div className="reviews-section card mt-3" style={{ padding: '40px', marginBottom: '60px' }}>
                <h2 style={{ marginBottom: '30px', display: 'flex', alignItems: 'center', gap: '15px' }}>
                    Customer Reviews 
                    <span style={{ fontSize: '1rem', background: 'var(--primary)', color: 'white', padding: '4px 12px', borderRadius: '20px' }}>
                        {reviews.length}
                    </span>
                </h2>

                <div className="reviews-grid" style={{ display: 'grid', gridTemplateColumns: user ? '1fr 1fr' : '1fr', gap: '60px' }}>
                    {/* Review List */}
                    <div className="reviews-list" style={{ display: 'flex', flexDirection: 'column', gap: '25px' }}>
                        {reviews.length === 0 ? (
                            <div style={{ padding: '40px', textAlign: 'center', background: '#f8fafc', borderRadius: '12px' }}>
                                <p className="text-muted">No reviews yet. Be the first to share your thoughts!</p>
                            </div>
                        ) : (
                            reviews.map(r => (
                                <div key={r.id} className="review-item" style={{ borderBottom: '1px solid #eee', paddingBottom: '20px' }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                            <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: 'var(--primary)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold' }}>
                                                {r.User?.name?.charAt(0) || 'U'}
                                            </div>
                                            <strong>{r.User?.name || 'Anonymous User'}</strong>
                                        </div>
                                        <div style={{ color: '#f59e0b' }}>
                                            {'★'.repeat(r.rating)}{'☆'.repeat(5-r.rating)}
                                        </div>
                                    </div>
                                    <p className="text-muted" style={{ fontSize: '0.85rem', marginBottom: '10px' }}>Verified Purchase • {new Date(r.createdAt).toLocaleDateString()}</p>
                                    <p style={{ lineHeight: '1.6' }}>{r.comment}</p>
                                </div>
                            ))
                        )}
                    </div>

                    {/* Review Form */}
                    {user && (
                        <div className="review-form-container">
                            <h3 style={{ marginBottom: '20px' }}>Write a Review</h3>
                            <form onSubmit={handleReviewSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                                <div className="form-group">
                                    <label style={{ display: 'block', marginBottom: '8px', fontWeight: 600 }}>Overall Rating</label>
                                    <select 
                                        className="form-control" 
                                        value={rating} 
                                        onChange={e => setRating(e.target.value)}
                                        style={{ maxWidth: '120px' }}
                                    >
                                        {[5,4,3,2,1].map(n => <option key={n} value={n}>{n} Stars</option>)}
                                    </select>
                                </div>
                                <div className="form-group">
                                    <label style={{ display: 'block', marginBottom: '8px', fontWeight: 600 }}>Your Comment</label>
                                    <textarea 
                                        className="form-control" 
                                        rows="4" 
                                        placeholder="What did you like or dislike?"
                                        value={comment}
                                        onChange={e => setComment(e.target.value)}
                                        required
                                    />
                                </div>
                                <button 
                                    type="submit" 
                                    className="btn-add-cart" 
                                    disabled={submitting}
                                    style={{ width: 'auto', alignSelf: 'flex-start' }}
                                >
                                    {submitting ? 'Submitting...' : 'Submit Review'}
                                </button>
                            </form>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ProductDetail;

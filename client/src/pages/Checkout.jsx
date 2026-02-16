import React from 'react';

const Checkout = ({ onPlaceOrder, loading, cart }) => {
    const total = cart.reduce((sum, item) => sum + (item.quantity * (item.product?.price || 0)), 0);

    return (
        <div className="container mt-2">
            <h1 className="page-title">Checkout</h1>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 350px', gap: '30px' }}>
                <div style={{ background: 'white', padding: '30px', borderRadius: '4px' }}>
                    <h2 style={{ marginBottom: '20px' }}>Shipping Address</h2>
                    <form id="checkout-form" onSubmit={onPlaceOrder}>
                        <div className="form-group">
                            <label>Full Name</label>
                            <input type="text" placeholder="John Doe" required />
                        </div>
                        <div className="form-group">
                            <label>Address</label>
                            <input name="shippingAddress" type="text" placeholder="Street layout, city, postal code" required />
                        </div>

                        <h2 style={{ margin: '30px 0 20px' }}>Payment Method</h2>
                        <div style={{ border: '1px solid #ddd', padding: '15px', borderRadius: '4px', display: 'flex', gap: '10px', alignItems: 'center' }}>
                            <input type="radio" checked readOnly />
                            <span>Pay with Stripe / Credit Card</span>
                        </div>
                    </form>
                </div>

                <div style={{ background: 'white', padding: '20px', borderRadius: '4px', height: 'fit-content', border: '1px solid #ddd' }}>
                    <button
                        form="checkout-form"
                        type="submit"
                        className="btn-add-cart"
                        style={{ width: '100%', padding: '10px', borderRadius: '8px', marginBottom: '15px' }}
                        disabled={loading}
                    >
                        {loading ? 'Processing...' : 'Place your order'}
                    </button>
                    <p style={{ fontSize: '0.75rem', textAlign: 'center', marginBottom: '15px' }}>
                        By placing your order, you agree to ShopSmart's privacy notice and conditions of use.
                    </p>
                    <hr style={{ border: '0', borderTop: '1px solid #eee', marginBottom: '15px' }} />
                    <h3>Order Summary</h3>
                    <div style={{ display: 'flex', justifyContent: 'space-between', margin: '10px 0', fontSize: '0.85rem' }}>
                        <span>Items ({cart.length}):</span>
                        <span>${total.toFixed(2)}</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', margin: '10px 0', fontSize: '0.85rem' }}>
                        <span>Shipping & handling:</span>
                        <span>$0.00</span>
                    </div>
                    <hr style={{ border: '0', borderTop: '1px solid #eee', margin: '10px 0' }} />
                    <div style={{ display: 'flex', justifyContent: 'space-between', color: '#B12704', fontWeight: 700, fontSize: '1.2rem' }}>
                        <span>Order Total:</span>
                        <span>${total.toFixed(2)}</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Checkout;

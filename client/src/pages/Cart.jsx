import React from 'react';

const Cart = ({ cart, onUpdateQty, onRemove, onClear, onCheckout, setView }) => {
    if (!cart) return null;

    const subtotal = cart.reduce((acc, item) => acc + (item.quantity * (item.product?.price || 0)), 0);

    if (cart.length === 0) {
        return (
            <div className="container" style={{ padding: '80px 0', textAlign: 'center' }}>
                <div style={{ fontSize: '4rem', marginBottom: '20px' }}>🛒</div>
                <h2 style={{ fontSize: '2rem', marginBottom: '10px' }}>Your Shopping Cart is Empty</h2>
                <p className="text-muted" style={{ marginBottom: '30px' }}>Give it some love! Add some items to your cart and make it happy.</p>
                <button
                    className="btn-add-cart"
                    style={{ maxWidth: '250px', margin: '0 auto' }}
                    onClick={() => setView('home')}
                >
                    Continue Shopping
                </button>
            </div>
        );
    }

    return (
        <div className="container mt-2">
            <h1 className="page-title">Shopping Cart</h1>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 300px', gap: '20px' }}>
                    <div className="cart-list" style={{ background: 'white', padding: '20px' }}>
                        {cart.map((item) => (
                            <div key={item.productId} className="cart-row" style={{ gridTemplateColumns: '100px 1fr auto auto' }}>
                                <img src={item.product?.imageUrl || 'https://placehold.co/100'} alt="" style={{ width: '100px', height: '100px' }} />
                                <div style={{ paddingLeft: '20px' }}>
                                    <h3 style={{ fontSize: '1.1rem', marginBottom: '5px' }}>{item.product?.name}</h3>
                                    <p style={{ color: 'var(--success)', fontSize: '0.8rem' }}>In Stock</p>
                                    <button
                                        className="text-link"
                                        style={{ color: 'var(--accent)', fontSize: '0.85rem', marginTop: '10px' }}
                                        onClick={() => onRemove(item.productId)}
                                    >
                                        Delete
                                    </button>
                                </div>
                                <div className="qty-select">
                                    <select
                                        value={item.quantity}
                                        onChange={(e) => onUpdateQty(item.productId, parseInt(e.target.value))}
                                        style={{ padding: '5px', borderRadius: '4px' }}
                                    >
                                        {[...Array(10).keys()].map(x => (
                                            <option key={x + 1} value={x + 1}>Qty: {x + 1}</option>
                                        ))}
                                    </select>
                                </div>
                                <div style={{ textAlign: 'right', fontWeight: 700, fontSize: '1.2rem' }}>
                                    ${(item.quantity * (item.product?.price || 0)).toFixed(2)}
                                </div>
                            </div>
                        ))}

                        <div style={{ textAlign: 'right', marginTop: '20px', fontSize: '1.2rem' }}>
                            Subtotal ({cart.length} items): <strong>${subtotal.toFixed(2)}</strong>
                        </div>

                        <button className="text-link" style={{ color: 'var(--accent)', marginTop: '20px' }} onClick={onClear}>
                            Clear all items
                        </button>
                    </div>

                    <div style={{ background: 'white', padding: '20px', borderRadius: '4px', height: 'fit-content' }}>
                        <div style={{ fontSize: '1.2rem', marginBottom: '20px' }}>
                            Subtotal: <strong>${subtotal.toFixed(2)}</strong>
                        </div>
                        <button
                            className="btn-add-cart"
                            style={{ width: '100%', padding: '10px', borderRadius: '8px' }}
                            onClick={onCheckout}
                        >
                            Proceed to Buy
                        </button>
                    </div>
                </div>
        </div>
    );
};

export default Cart;

import React from 'react';

const Orders = ({ orders, loading, setView }) => {
    if (loading) return <div className="container mt-2">Loading your orders...</div>;

    return (
        <div className="container mt-2">
            <h1 className="page-title">Your Orders</h1>

            {orders.length === 0 ? (
                <div className="orders-empty" style={{ background: 'white', padding: '40px', borderRadius: '4px' }}>
                    <p>You haven't placed any orders in the past 3 months.</p>
                    <button className="btn-add-cart mt-2" style={{ padding: '8px 20px' }} onClick={() => setView('home')}>
                        Continue shopping
                    </button>
                </div>
            ) : (
                <div className="orders-list">
                    {orders.map((order) => (
                        <div key={order.id} style={{ background: 'white', border: '1px solid #ddd', borderRadius: '8px', marginBottom: '20px', overflow: 'hidden' }}>
                            <div style={{ background: '#F0F2F2', padding: '15px 20px', display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', borderBottom: '1px solid #ddd' }}>
                                <div style={{ display: 'flex', gap: '30px' }}>
                                    <div>
                                        <div style={{ color: '#565959', textTransform: 'uppercase' }}>Order Placed</div>
                                        <div>{new Date(order.createdAt).toLocaleDateString()}</div>
                                    </div>
                                    <div>
                                        <div style={{ color: '#565959', textTransform: 'uppercase' }}>Total</div>
                                        <div>${Number(order.totalPrice).toFixed(2)}</div>
                                    </div>
                                    <div>
                                        <div style={{ color: '#565959', textTransform: 'uppercase' }}>Ship To</div>
                                        <div style={{ color: 'var(--accent)', cursor: 'pointer' }}>{order.shippingAddress || 'Default Address'}</div>
                                    </div>
                                </div>
                                <div>
                                    <div style={{ color: '#565959', textTransform: 'uppercase' }}>Order # {order.id}</div>
                                    <div style={{ color: 'var(--accent)', cursor: 'pointer' }}>View order details</div>
                                </div>
                            </div>
                            <div style={{ padding: '20px' }}>
                                <h3 style={{ fontSize: '1.2rem', color: '#0F1111' }}>{order.status}</h3>
                                <p style={{ fontSize: '0.9rem', color: '#565959' }}>Order handled by ShopSmart Logistics</p>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default Orders;

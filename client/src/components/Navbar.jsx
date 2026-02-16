import React from 'react';

const Navbar = ({ user, cartCount, onLogout, setView, search, setSearch, onSearch, categories }) => {
    return (
        <header className="header">
            <div className="container">
                <div className="header-top">
                    <a href="#" className="logo" onClick={(e) => { e.preventDefault(); setView('home'); }}>
                        ShopSmart
                    </a>

                    <div className="search-bar">
                        <input
                            type="text"
                            className="search-input"
                            placeholder="Search products..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && onSearch()}
                        />
                        <button className="search-btn" onClick={onSearch}>
                            🔍
                        </button>
                    </div>

                    <div className="header-nav">
                        <div className="nav-item" onClick={() => setView(user ? 'profile' : 'login')}>
                            <span className="nav-line-1">Hello, {user ? user.name : 'sign in'}</span>
                            <span className="nav-line-2">Account & Lists</span>
                        </div>

                        <div className="nav-item" onClick={() => setView('orders')}>
                            <span className="nav-line-1">Returns</span>
                            <span className="nav-line-2">& Orders</span>
                        </div>

                        <div className="nav-item cart-icon" onClick={() => setView('cart')}>
                            <span className="cart-count">{cartCount}</span>
                            <span className="nav-line-2">🛒 Cart</span>
                        </div>

                        {user && (
                            <div className="nav-item" onClick={onLogout}>
                                <span className="nav-line-1">Sign Out</span>
                                <span className="nav-line-2">Log out</span>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <div className="category-bar">
                <div className="container" style={{ display: 'flex', gap: '20px' }}>
                    <span style={{ fontWeight: 700, cursor: 'pointer' }} onClick={() => setView('home')}>All</span>
                    {categories.slice(0, 8).map(cat => (
                        <span key={cat} style={{ cursor: 'pointer' }} onClick={() => { setSearch(''); setView('home'); /* Logic to filter category would go here or state passing */ }}>{cat}</span>
                    ))}
                </div>
            </div>
        </header>
    );
};

export default Navbar;

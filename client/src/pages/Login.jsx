import React from 'react';

const Login = ({ onLogin, setView, loading, API_URL }) => {
    return (
        <div className="auth-container">
            <div className="auth-card">
                <h1>Sign in</h1>
                <form onSubmit={onLogin}>
                    <div className="form-group">
                        <label>Email</label>
                        <input type="email" name="email" required placeholder="Email address" />
                    </div>
                    <div className="form-group">
                        <label>Password</label>
                        <input type="password" name="password" required placeholder="Password" />
                    </div>
                    <button type="submit" className="btn-auth" disabled={loading}>
                        {loading ? 'Continuing...' : 'Continue'}
                    </button>
                </form>

                <p style={{ fontSize: '0.8rem', marginTop: '15px', color: 'var(--text-muted)' }}>
                    By continuing, you agree to ShopSmart's Conditions of Use and Privacy Notice.
                </p>

                <div style={{ marginTop: '20px', textAlign: 'center' }}>
                    <hr style={{ border: '0', borderTop: '1px solid #eee', marginBottom: '10px' }} />
                    <a href={`${API_URL}/auth/google`} className="btn-ghost" style={{ display: 'block', padding: '8px', border: '1px solid #ddd', borderRadius: '3px', fontSize: '0.9rem' }}>
                        Sign in with Google
                    </a>
                </div>
            </div>

            <div style={{ marginTop: '20px', width: '350px' }}>
                <div style={{ display: 'flex', alignItems: 'center', margin: '15px 0' }}>
                    <hr style={{ flex: 1, border: '0', borderTop: '1px solid #eee' }} />
                    <span style={{ padding: '0 10px', color: '#767676', fontSize: '0.8rem' }}>New to ShopSmart?</span>
                    <hr style={{ flex: 1, border: '0', borderTop: '1px solid #eee' }} />
                </div>
                <button
                    className="btn-ghost"
                    style={{ width: '100%', padding: '8px', border: '1px solid #adb1b8', borderRadius: '3px', background: 'linear-gradient(to bottom, #f7f8fa, #e7e9ec)' }}
                    onClick={() => setView('register')}
                >
                    Create your ShopSmart account
                </button>
            </div>
        </div>
    );
};

export default Login;

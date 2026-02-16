import React from 'react';

const Register = ({ onRegister, setView, loading }) => {
    return (
        <div className="auth-container">
            <div className="auth-card">
                <h1>Create account</h1>
                <form onSubmit={onRegister}>
                    <div className="form-group">
                        <label>Your name</label>
                        <input type="text" name="name" required placeholder="First and last name" />
                    </div>
                    <div className="form-group">
                        <label>Email</label>
                        <input type="email" name="email" required placeholder="Email" />
                    </div>
                    <div className="form-group">
                        <label>Password</label>
                        <input type="password" name="password" required placeholder="At least 6 characters" />
                    </div>
                    <button type="submit" className="btn-auth" disabled={loading}>
                        {loading ? 'Creating...' : 'Continue'}
                    </button>
                </form>

                <p style={{ fontSize: '0.8rem', marginTop: '15px', color: 'var(--text-muted)' }}>
                    By creating an account, you agree to ShopSmart's Conditions of Use and Privacy Notice.
                </p>

                <div style={{ marginTop: '20px' }}>
                    <hr style={{ border: '0', borderTop: '1px solid #eee', marginBottom: '15px' }} />
                    <p style={{ fontSize: '0.9rem' }}>
                        Already have an account? <a href="#" onClick={(e) => { e.preventDefault(); setView('login'); }} style={{ color: 'var(--accent)' }}>Sign in</a>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Register;

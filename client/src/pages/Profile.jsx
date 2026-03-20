import React, { useState, useEffect, useCallback } from 'react';
import { authService, addressService } from '../services/api';

const Profile = ({ user, onUpdateUser, onBack }) => {
    const [addresses, setAddresses] = useState([]);
    const [loading, setLoading] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [profileName, setProfileName] = useState('');
    const [showAddrForm, setShowAddrForm] = useState(false);
    const [newAddr, setNewAddr] = useState({ line1: '', city: '', state: '', postalCode: '', country: 'India' });

    // Sync profile name when user loads
    useEffect(() => {
        if (user?.name) setProfileName(user.name);
    }, [user?.name]);

    const loadAddresses = useCallback(async () => {
        if (!user) return;
        try {
            const data = await addressService.getAll();
            setAddresses(Array.isArray(data) ? data : []);
        } catch (err) {
            console.error('Failed to load addresses:', err);
        }
    }, [user]);

    useEffect(() => {
        loadAddresses();
    }, [loadAddresses]);

    const handleUpdateProfile = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const updated = await authService.updateProfile({ name: profileName });
            if (onUpdateUser) onUpdateUser(updated);
            setIsEditing(false);
        } catch (err) {
            alert(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleAddAddress = async (e) => {
        e.preventDefault();
        try {
            await addressService.create(newAddr);
            setNewAddr({ line1: '', city: '', state: '', postalCode: '', country: 'India' });
            setShowAddrForm(false);
            loadAddresses();
        } catch (err) {
            alert(err.message);
        }
    };

    const handleDeleteAddress = async (id) => {
        if (!window.confirm('Delete this address?')) return;
        try {
            await addressService.remove(id);
            loadAddresses();
        } catch (err) {
            alert(err.message);
        }
    };

    if (!user) {
        return (
            <div className="container" style={{ padding: '60px 0' }}>
                <div className="loading-pulse" style={{ height: '400px', borderRadius: '20px' }}></div>
            </div>
        );
    }

    return (
        <div className="container" style={{ padding: '40px 0' }}>
            <button onClick={onBack} className="text-muted mb-2" style={{ background: 'none', border: 'none', cursor: 'pointer', fontWeight: 600 }}>
                ← Back to Home
            </button>
            <h1 className="page-title">Your Profile</h1>

            <div className="profile-grid" style={{ display: 'grid', gridTemplateColumns: 'minmax(300px, 1fr) 2fr', gap: '40px' }}>
                <div className="profile-section card" style={{ padding: '30px' }}>
                    <h3>Account Security</h3>
                    <div className="mt-2">
                        <label className="text-muted" style={{ fontSize: '0.8rem', display: 'block' }}>Name</label>
                        {isEditing ? (
                            <form onSubmit={handleUpdateProfile}>
                                <input 
                                    className="form-control" 
                                    value={profileName} 
                                    onChange={(e) => setProfileName(e.target.value)}
                                    style={{ marginBottom: '10px' }}
                                />
                                <button type="submit" className="btn-add-cart" style={{ width: 'auto', marginRight: '10px' }} disabled={loading}>Save</button>
                                <button type="button" onClick={() => setIsEditing(false)} className="btn-add-cart" style={{ width: 'auto', background: '#e2e8f0', color: 'black' }}>Cancel</button>
                            </form>
                        ) : (
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <strong>{user.name}</strong>
                                <button onClick={() => setIsEditing(true)} style={{ color: 'var(--accent)', background: 'none', border: 'none', cursor: 'pointer' }}>Edit</button>
                            </div>
                        )}
                    </div>
                    <div className="mt-2">
                        <label className="text-muted" style={{ fontSize: '0.8rem', display: 'block' }}>Email</label>
                        <strong>{user.email}</strong>
                    </div>
                </div>

                <div className="profile-section">
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                        <h2 style={{ margin: 0 }}>Your Addresses</h2>
                        <button className="btn-add-cart" style={{ width: 'auto' }} onClick={() => setShowAddrForm(!showAddrForm)}>
                            {showAddrForm ? 'Cancel' : 'Add New Address'}
                        </button>
                    </div>

                    {showAddrForm && (
                        <div className="card mb-2" style={{ padding: '20px' }}>
                            <form onSubmit={handleAddAddress}>
                                <div className="form-group mb-1">
                                    <input className="form-control" placeholder="Street Address" required value={newAddr.line1} onChange={e => setNewAddr({...newAddr, line1: e.target.value})} />
                                </div>
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                                    <input className="form-control" placeholder="City" required value={newAddr.city} onChange={e => setNewAddr({...newAddr, city: e.target.value})} />
                                    <input className="form-control" placeholder="State" required value={newAddr.state} onChange={e => setNewAddr({...newAddr, state: e.target.value})} />
                                </div>
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginTop: '10px' }}>
                                    <input className="form-control" placeholder="Zip Code" required value={newAddr.postalCode} onChange={e => setNewAddr({...newAddr, postalCode: e.target.value})} />
                                    <input className="form-control" placeholder="Country" required value={newAddr.country} onChange={e => setNewAddr({...newAddr, country: e.target.value})} />
                                </div>
                                <button type="submit" className="btn-add-cart mt-1">Add Address</button>
                            </form>
                        </div>
                    )}

                    <div className="address-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '20px' }}>
                        {addresses.map(addr => (
                            <div key={addr.id} className="card" style={{ padding: '20px' }}>
                                <p style={{ fontWeight: 600, marginBottom: '5px' }}>{user.name}</p>
                                <p>{addr.line1}</p>
                                <p>{addr.city}, {addr.state} {addr.postalCode}</p>
                                <p>{addr.country}</p>
                                <div className="mt-2" style={{ display: 'flex', gap: '15px', borderTop: '1px solid #eee', paddingTop: '10px' }}>
                                    <button style={{ color: 'var(--accent)', background: 'none', border: 'none', cursor: 'pointer', fontSize: '0.9rem' }}>Edit</button>
                                    <button onClick={() => handleDeleteAddress(addr.id)} style={{ color: '#ef4444', background: 'none', border: 'none', cursor: 'pointer', fontSize: '0.9rem' }}>Delete</button>
                                </div>
                            </div>
                        ))}
                    </div>
                    {addresses.length === 0 && !showAddrForm && (
                        <div className="card" style={{ padding: '40px', textAlign: 'center' }}>
                            <p className="text-muted">No addresses found. Add one to speed up checkout!</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Profile;

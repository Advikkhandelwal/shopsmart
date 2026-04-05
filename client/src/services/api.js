// Prefer proxy in dev (vite.config.js proxies /products, /users, etc.)
// and keep env override for deployments.
const API_URL = import.meta.env.VITE_API_URL || '';

const getToken = () => localStorage.getItem('token');
export const setToken = (token) => {
    if (token) localStorage.setItem('token', token);
    else localStorage.removeItem('token');
};

export const apiCall = async (endpoint, options = {}) => {
    const token = getToken();
    const headers = {
        'Content-Type': 'application/json',
        ...options.headers,
    };

    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }

    let response;
    try {
        response = await fetch(`${API_URL}${endpoint}`, {
            ...options,
            headers,
        });
    } catch (err) {
        // Network/proxy/backend down, or CORS-blocked fetch
        throw new Error('Network error: unable to reach backend API');
    }

    const data = await response.json().catch(() => ({}));
    if (!response.ok) {
        throw new Error(data.message || response.statusText);
    }
    return data;
};

export const productsService = {
    getAll: (params) => {
        const q = new URLSearchParams(params).toString();
        return apiCall(`/products?${q}`);
    },
    getById: (id) => apiCall(`/products/${id}`),
    getCategories: () => apiCall('/products/categories'),
};

export const authService = {
    login: (credentials) => apiCall('/users/login', {
        method: 'POST',
        body: JSON.stringify(credentials),
    }),
    register: (userData) => apiCall('/users/register', {
        method: 'POST',
        body: JSON.stringify(userData),
    }),
    getProfile: () => apiCall('/users/profile'),
    updateProfile: (userData) => apiCall('/users/profile', {
        method: 'PUT',
        body: JSON.stringify(userData),
    }),
};

export const cartService = {
    get: () => apiCall('/cart'),
    add: (productId, quantity = 1) => apiCall('/cart', {
        method: 'POST',
        body: JSON.stringify({ productId, quantity }),
    }),
    update: (productId, quantity) => apiCall(`/cart/${productId}`, {
        method: 'PUT',
        body: JSON.stringify({ quantity }),
    }),
    remove: (productId) => apiCall(`/cart/${productId}`, { method: 'DELETE' }),
    clear: () => apiCall('/cart', { method: 'DELETE' }),
};

export const orderService = {
    getMine: () => apiCall('/orders/myorders'),
    place: (shippingAddress) => apiCall('/orders', {
        method: 'POST',
        body: JSON.stringify({ shippingAddress }),
    }),
    checkout: (orderId) => apiCall(`/orders/${orderId}/checkout`, {
        method: 'POST',
    }),
    updateOrderToPaid: (orderId, paymentData) => apiCall(`/orders/${orderId}/pay`, {
        method: 'PUT',
        body: JSON.stringify(paymentData),
    }),
};

export const reviewsService = {
    getForProduct: (productId) => apiCall(`/products/${productId}/reviews`),
    create: (productId, reviewData) => apiCall(`/products/${productId}/reviews`, {
        method: 'POST',
        body: JSON.stringify(reviewData),
    }),
};
// ex=> GET /products/10/reviews

export const addressService = {
    getAll: () => apiCall('/addresses'),
    create: (addressData) => apiCall('/addresses', {
        method: 'POST',
        body: JSON.stringify(addressData),
    }),
    update: (id, addressData) => apiCall(`/addresses/${id}`, {
        method: 'PUT',
        body: JSON.stringify(addressData),
    }),
    remove: (id) => apiCall(`/addresses/${id}`, { method: 'DELETE' }),
};

const API_URL = ''; // Can be set to a specific URL if needed, e.g., 'http://localhost:5000'

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

    const response = await fetch(`${API_URL}${endpoint}`, {
        ...options,
        headers,
    });

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
};

import { useState, useEffect, useCallback } from 'react';
import { productsService, authService, cartService, orderService, setToken } from './services/api';

// Components
import Navbar from './components/Navbar';
import Footer from './components/Footer';

// Pages
import Home from './pages/Home';
import ProductDetail from './pages/ProductDetail';
import Cart from './pages/Cart';
import Orders from './pages/Orders';
import Login from './pages/Login';
import Register from './pages/Register';
import Checkout from './pages/Checkout';

const API_URL = ''; // Same as in api.js

export default function App() {
  const [view, setView] = useState('home');
  const [user, setUser] = useState(null);
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [product, setProduct] = useState(null);
  const [cart, setCart] = useState([]);
  const [orders, setOrders] = useState([]);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);

  // OAuth callback
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get('token');
    if (token) {
      setToken(token);
      window.history.replaceState({}, '', window.location.pathname);
      setView('home');
      loadProfile();
    }
  }, []);

  const loadProfile = useCallback(async () => {
    try {
      const userData = await authService.getProfile();
      setUser(userData);
    } catch (error) {
      setToken(null);
      setUser(null);
    }
  }, []);

  useEffect(() => {
    loadProfile();
  }, [loadProfile]);

  const loadProducts = useCallback(async () => {
    setLoading(true);
    try {
      const data = await productsService.getAll({ search, category });
      setProducts(data);
    } catch (error) {
      setProducts([]);
      showMessage('Failed to load products', true);
    } finally {
      setLoading(false);
    }
  }, [search, category]);

  useEffect(() => {
    productsService.getCategories().then(setCategories).catch(() => setCategories([]));
  }, []);

  useEffect(() => {
    if (view === 'home') loadProducts();
  }, [view, loadProducts]);

  const loadCart = useCallback(async () => {
    try {
      const data = await cartService.get();
      setCart(data);
    } catch (error) {
      setCart([]);
    }
  }, []);

  useEffect(() => {
    if (view === 'cart' || view === 'checkout' || view === 'home') loadCart();
  }, [view, loadCart]);

  const loadOrders = useCallback(async () => {
    setLoading(true);
    try {
      const data = await orderService.getMine();
      setOrders(data);
    } catch (error) {
      setOrders([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (view === 'orders') loadOrders();
  }, [view, loadOrders]);

  const showMessage = (msg, isError = false) => {
    setMessage({ text: msg, error: isError });
    setTimeout(() => setMessage(null), 4000);
  };

  const openProduct = async (id) => {
    setLoading(true);
    setView('product');
    try {
      const data = await productsService.getById(id);
      setProduct(data);
    } catch (error) {
      showMessage('Product not found', true);
    } finally {
      setLoading(false);
    }
  };

  const addToCart = async (productId, quantity = 1) => {
    if (!localStorage.getItem('token')) {
      setView('login');
      return;
    }
    try {
      await cartService.add(productId, quantity);
      showMessage('Added to cart');
      loadCart();
    } catch (e) {
      showMessage(e.message, true);
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    const { email, password } = e.target;
    setLoading(true);
    try {
      const data = await authService.login({ email: email.value, password: password.value });
      setToken(data.token);
      setUser({ id: data.id, name: data.name, email: data.email, isAdmin: data.isAdmin });
      setView('home');
      showMessage('Welcome back');
    } catch (e) {
      showMessage(e.message, true);
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    const { name, email, password } = e.target;
    setLoading(true);
    try {
      const data = await authService.register({ name: name.value, email: email.value, password: password.value });
      setToken(data.token);
      setUser({ id: data.id, name: data.name, email: data.email, isAdmin: data.isAdmin });
      setView('home');
      showMessage('Account created');
    } catch (e) {
      showMessage(e.message, true);
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    setView('home');
  };

  const placeOrder = async (e) => {
    e.preventDefault();
    const address = e.target?.shippingAddress?.value || '';
    setLoading(true);
    try {
      await orderService.place(address);
      setCart([]);
      showMessage('Order placed successfully');
      setView('orders');
    } catch (e) {
      showMessage(e.message, true);
    } finally {
      setLoading(false);
    }
  };

  const cartCount = cart.reduce((n, i) => n + (i.quantity || 0), 0);

  return (
    <>
      <Navbar
        user={user}
        cartCount={cartCount}
        onLogout={logout}
        setView={setView}
        search={search}
        setSearch={setSearch}
        onSearch={loadProducts}
        categories={categories}
      />

      <main className="main" style={{ flex: 1, padding: 0, maxWidth: 'none' }}>
        {message && (
          <div className="container mt-1">
            <div className={`message ${message.error ? 'error' : 'success'}`}>
              {message.text}
            </div>
          </div>
        )}

        {view === 'home' && (
          <Home
            products={products}
            loading={loading}
            onProductClick={openProduct}
            onAddToCart={addToCart}
          />
        )}

        {view === 'product' && (
          <ProductDetail
            product={product}
            loading={loading}
            onAddToCart={addToCart}
            onBack={() => setView('home')}
          />
        )}

        {view === 'cart' && (
          <Cart
            cart={cart}
            onUpdateQty={(pid, qty) => cartService.update(pid, qty).then(loadCart)}
            onRemove={(pid) => cartService.remove(pid).then(loadCart)}
            onClear={() => cartService.clear().then(() => setCart([]))}
            onCheckout={() => setView('checkout')}
            setView={setView}
          />
        )}

        {view === 'checkout' && (
          <Checkout
            cart={cart}
            onPlaceOrder={placeOrder}
            loading={loading}
          />
        )}

        {view === 'login' && (
          <Login
            onLogin={handleLogin}
            setView={setView}
            loading={loading}
            API_URL={API_URL}
          />
        )}

        {view === 'register' && (
          <Register
            onRegister={handleRegister}
            setView={setView}
            loading={loading}
          />
        )}

        {view === 'orders' && (
          <Orders
            orders={orders}
            loading={loading}
            setView={setView}
          />
        )}
      </main>

      <Footer />
    </>
  );
}

import { useState, useEffect, useCallback, lazy, Suspense } from 'react';
import { productsService, authService, cartService, orderService, setToken, apiCall } from './services/api';

// Components
import Navbar from './components/Navbar';
import Footer from './components/Footer';

// Pages - Lazy Loaded
const Home = lazy(() => import('./pages/Home'));
const ProductDetail = lazy(() => import('./pages/ProductDetail'));
const Cart = lazy(() => import('./pages/Cart'));
const Orders = lazy(() => import('./pages/Orders'));
const Login = lazy(() => import('./pages/Login'));
const Register = lazy(() => import('./pages/Register'));
const Checkout = lazy(() => import('./pages/Checkout'));
const Profile = lazy(() => import('./pages/Profile'));

const API_URL = import.meta.env.VITE_API_URL || '';

export default function App() {
  const [view, setView] = useState('home');
  const [user, setUser] = useState(null);
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [product, setProduct] = useState(null);
  const [cart, setCart] = useState([]);
  const [orders, setOrders] = useState([]);

  // Initialize filters from URL
  const initialParams = new URLSearchParams(window.location.search);
  const [search, setSearch] = useState(initialParams.get('search') || '');
  const [category, setCategory] = useState(initialParams.get('category') || '');
  const [page, setPage] = useState(Number(initialParams.get('page')) || 1);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);
  const [totalPages, setTotalPages] = useState(1);

  // --- Functions (Moved Up to avoid TDZ) ---

  const showMessage = useCallback((msg, isError = false) => {
    setMessage({ text: msg, error: isError });
    setTimeout(() => setMessage(null), 4000);
  }, []);

  const loadProfile = useCallback(async () => {
    // Don't even try if we know we don't have a token
    const token = localStorage.getItem('token');
    if (!token) return;

    try {
      const userData = await authService.getProfile();
      setUser(userData);
    } catch (error) {
      // Only clear if it's truly an auth error, and handle race conditions
      // Better yet, just clear it if we're sure this wasn't an interrupted request
      setToken(null);
      setUser(null);
    }
  }, []);

  const loadCart = useCallback(async () => {
    if (!localStorage.getItem('token')) return;
    try {
      const data = await cartService.get();
      setCart(data);
    } catch (error) {
      setCart([]);
    }
  }, []);

  const loadOrders = useCallback(async () => {
    if (!localStorage.getItem('token')) return;
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

  const loadProducts = useCallback(async (searchParams) => {
    const s = searchParams.get('search') || '';
    const c = searchParams.get('category') || '';
    const p = Number(searchParams.get('page')) || 1;
    const sectionsMode = !s && !c;
    const pageSize = sectionsMode ? 80 : 20;

    setLoading(true);
    try {
      const data = await productsService.getAll({
        search: s,
        category: c,
        page: p,
        pageSize: pageSize
      });

      if (Array.isArray(data)) {
        setProducts(data);
        setTotalPages(1);
      } else {
        setProducts(data.items || []);
        setPage(data.page || p);
        setTotalPages(data.totalPages || 1);
      }
      setSearch(s);
      setCategory(c);
      setPage(p);
    } catch (error) {
      setProducts([]);
      showMessage(error?.message || 'Failed to load products', true);
    } finally {
      setLoading(false);
    }
  }, [showMessage]);

  // Sync URL with state helper (uses pushState for navigation history)
  const navigateTo = useCallback((params) => {
    const newParams = new URLSearchParams(window.location.search);
    if (params.search !== undefined) {
      if (params.search) newParams.set('search', params.search);
      else newParams.delete('search');
    }
    if (params.category !== undefined) {
      if (params.category) newParams.set('category', params.category);
      else newParams.delete('category');
    }
    if (params.page !== undefined) {
      if (params.page > 1) newParams.set('page', params.page);
      else newParams.delete('page');
    }
    
    // Always reset page to 1 if search or category changes, unless explicit
    if ((params.search !== undefined || params.category !== undefined) && params.page === undefined) {
      newParams.delete('page');
    }

    const newQuery = newParams.toString();
    const newRelativePathQuery = window.location.pathname + (newQuery ? '?' + newQuery : '');
    window.history.pushState(null, '', newRelativePathQuery);
    
    // Dispatch popstate manually so the reactive listener picks it up immediately
    window.dispatchEvent(new Event('popstate'));
  }, []);

  // --- Effects ---

  // Reactive effect: Listen to URL changes and fetch
  useEffect(() => {
    const handlePopState = () => {
      if (view === 'home') {
        const params = new URLSearchParams(window.location.search);
        loadProducts(params);
      }
    };

    window.addEventListener('popstate', handlePopState);
    // Initial load
    handlePopState();
    
    return () => window.removeEventListener('popstate', handlePopState);
  }, [view, loadProducts]);

  useEffect(() => {
    // Only call loadProfile if there's no token in URL, 
    // because the OAuth effect will handle it otherwise.
    const params = new URLSearchParams(window.location.search);
    if (!params.get('token')) {
      loadProfile();
    }
  }, [loadProfile]);

  // OAuth & Stripe callback
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get('token');
    const success = params.get('success');
    const orderId = window.location.pathname.split('/order/')[1] || params.get('orderId');

    if (token) {
      setToken(token);
      const newParams = new URLSearchParams(window.location.search);
      newParams.delete('token');
      const cleanPath = window.location.pathname + (newParams.toString() ? '?' + newParams.toString() : '');
      window.history.replaceState({}, '', cleanPath);
      setView('home');
      loadProfile();
    }

    if (success === 'true' && orderId) {
      // Simulation: Mark order as paid immediately since we might not have a public webhook URL
      orderService.updateOrderToPaid(orderId, { status: 'success' })
        .then(() => {
          showMessage('Payment successful! Your order is being processed.');
          setView('orders');
          loadOrders();
        })
        .catch(() => {});
      
      const newParams = new URLSearchParams(window.location.search);
      newParams.delete('success');
      window.history.replaceState({}, '', window.location.pathname);
    }
  }, [loadProfile, loadOrders, showMessage]);

  useEffect(() => {
    productsService.getCategories().then(setCategories).catch(() => setCategories([]));
  }, []);

  useEffect(() => {
    if (view === 'cart' || view === 'checkout' || view === 'home') loadCart();
  }, [view, loadCart]);

  useEffect(() => {
    if (view === 'orders') loadOrders();
  }, [view, loadOrders]);

  // --- Handlers ---

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
    if (!user) {
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
      // Create order from cart
      const order = await orderService.place(address);

      // Try to start Stripe Checkout if configured
      try {
        const session = await orderService.checkout(order.id);
        if (session?.url) {
          window.location.href = session.url;
          return;
        }
      } catch (err) {
        // If Stripe is not configured or fails, fallback
      }

      setCart([]);
      showMessage('Order placed successfully');
      setView('orders');
    } catch (e) {
      showMessage(e.message, true);
    } finally {
      setLoading(false);
    }
  };

  const cartCount = Array.isArray(cart) ? cart.reduce((acc, item) => acc + (item.quantity || 0), 0) : 0;

  return (
    <div className="app">
      <Navbar 
        user={user} 
        cartCount={cartCount} 
        onLogout={logout} 
        setView={setView}
        search={search}
        setSearch={setSearch}
        onNavigate={navigateTo}
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

        <Suspense fallback={
          <div className="container" style={{ padding: '60px 0' }}>
            <div className="loading-pulse" style={{ height: '400px', borderRadius: '20px' }}></div>
          </div>
        }>
          {view === 'home' && (
            <Home 
              products={products} 
              loading={loading}
              onProductClick={openProduct}
              onAddToCart={addToCart}
              page={page}
              totalPages={totalPages}
              showSections={!search && !category}
              categories={categories}
              onSelectCategory={(cat) => {
                navigateTo({ category: cat, search: '', page: 1 });
              }}
              onPageChange={(p) => {
                navigateTo({ page: p });
              }}
            />
          )}

          {view === 'product' && (
            <ProductDetail 
              product={product} 
              loading={loading}
              onAddToCart={addToCart}
              onBack={() => setView('home')}
              user={user}
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
              onBack={() => setView('home')}
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
              API_URL={API_URL}
            />
          )}

          {view === 'orders' && (
            <Orders 
              orders={orders}
              loading={loading}
              setView={setView}
            />
          )}

          {view === 'profile' && (
            <Profile 
              user={user}
              onUpdateUser={setUser}
              onBack={() => setView('home')}
            />
          )}
        </Suspense>
      </main>

      <Footer />
    </div>
  );
}

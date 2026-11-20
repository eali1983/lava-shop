// src/App.jsx
import React, { useState, useEffect } from 'react';
import './App.css';
import './styles/theme.css';

import kiloIMG from './kilo.jpg';
import mitsIMG from './mits.jpg';
import reelIMG from './reel.jpg';
import logo from './logo.png';
import wel from './wel.png';

import { HashRouter, Routes, Route, Link } from "react-router-dom";
import Shop from "./pages/Shop";
import Category from "./pages/Category";

import {
  FaFacebook, FaInstagram, FaTwitter, FaEnvelope, FaPhone, FaMapMarkerAlt,
  FaSearch, FaUser, FaSignOutAlt, FaShoppingCart
} from 'react-icons/fa';

import { db } from './firebase';
import { collection, getDocs } from 'firebase/firestore';
import { getAuth, signInWithEmailAndPassword, signOut } from 'firebase/auth';

function AppContent() {
  const [products, setProducts] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [cartItems, setCartItems] = useState([]);
  const [showLoginForm, setShowLoginForm] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showCart, setShowCart] = useState(false);
  const auth = getAuth();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const snap = await getDocs(collection(db, 'products'));
        const list = snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        const withImg = list.map(p => ({ ...p, image: p.image || kiloIMG }));
        setProducts(withImg);
        setFiltered(withImg);
      } catch (err) {
        console.error('Error fetching products:', err);
      }
    };
    fetchProducts();
  }, []);

  useEffect(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return setFiltered(products);
    setFiltered(products.filter(p => (p.name || '').toLowerCase().includes(q)));
  }, [searchQuery, products]);

  const toggleLogin = () => {
    if (isLoggedIn) {
      signOut(auth)
        .then(() => {
          setIsLoggedIn(false);
          setEmail('');
          setPassword('');
        })
        .catch(err => console.error('Sign out error:', err));
    } else {
      setShowLoginForm(prev => !prev);
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      await signInWithEmailAndPassword(auth, email, password);
      setIsLoggedIn(true);
      setShowLoginForm(false);
    } catch (error) {
      alert('Login failed: ' + error.message);
    }
  };

  const addToCart = (product) => {
    setCartItems(prev => [...prev, product]);
    setShowCart(true);
  };
  const removeFromCart = (i) =>
    setCartItems(prev => prev.filter((_, idx) => idx !== i));
  const total = cartItems.reduce((s, it) => s + (Number(it.price) || 0), 0).toFixed(2);

  const homeElement = (
    <Home
      wel={wel}
      filtered={filtered}
      kiloIMG={kiloIMG}
      mitsIMG={mitsIMG}
      reelIMG={reelIMG}
      addToCart={addToCart}
      showCart={showCart}
      cartItems={cartItems}
      removeFromCart={removeFromCart}
      total={total}
    />
  );

  return (
    <>
      <header className="nav">
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <img src={logo} alt="Lava Logo" style={{ width: 36, height: 36, borderRadius: 8 }} />
          <strong>Lava Cigar and Smoke</strong>
        </div>

        <nav className="nav__links">
          <Link to="/">Home</Link>
          <Link to="/shop">Shop</Link>
          <a href="#services">Services</a>
          <a href="#about">About</a>
          <a href="#contact">Contact</a>
        </nav>

        <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
          <div className="search-bar" style={{ position: 'relative' }}>
            <input
              type="text"
              placeholder="Search products…"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                padding: '8px 32px 8px 10px',
                borderRadius: 10,
                border: '1px solid #d9d1b7'
              }}
            />
            <FaSearch style={{ position: 'absolute', right: 8, top: 9, opacity: .6 }} />
          </div>

          <button onClick={toggleLogin} className="nav__cta">
            {isLoggedIn ? <><FaSignOutAlt /> Logout</> : <><FaUser /> Login</>}
          </button>

          <button className="nav__cta" onClick={() => setShowCart(!showCart)}>
            <FaShoppingCart /> Cart ({cartItems.length})
          </button>
        </div>
      </header>

      <Routes>
        <Route path="/" element={homeElement} />
        <Route path="/lava-shop" element={homeElement} />
        <Route path="/lava-shop/" element={homeElement} />
        <Route path="/shop" element={<Shop />} />
        <Route
          path="/shop/:slug"
          element={<Category products={products} onAddToCart={addToCart} />}
        />
        <Route path="*" element={homeElement} />
      </Routes>

      {showLoginForm && !isLoggedIn && (
        <div style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(0,0,0,.35)',
          display: 'grid',
          placeItems: 'center',
          zIndex: 60
        }}>
          <div style={{
            background: '#fff',
            borderRadius: 12,
            padding: 20,
            width: 'min(92vw, 360px)'
          }}>
            <form onSubmit={handleLogin}>
              <h3 style={{ marginTop: 0 }}>Login</h3>
              <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                style={{ width: '100%', padding: 10, marginBottom: 10 }}
              />
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                style={{ width: '100%', padding: 10 }}
              />
              <div style={{ display: 'flex', gap: 10, marginTop: 12 }}>
                <button type="submit" className="btn" style={{ flex: 1 }}>Sign In</button>
                <button
                  type="button"
                  className="btn btn--ghost"
                  style={{ flex: 1 }}
                  onClick={() => setShowLoginForm(false)}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}

function App() {
  return (
    <HashRouter>
      <AppContent />
    </HashRouter>
  );
}

function Home({
  wel, filtered, kiloIMG, mitsIMG, reelIMG,
  addToCart, showCart, cartItems, removeFromCart, total
}) {
  return (
    <>
      <section className="hero">
        <img src={wel} alt="Welcome" style={{ width: 64, opacity: 0.85 }} />
        <h2 className="hero__title">
          Welcome to Lava Cigar and Smoke your one-stop shop for premium cigars, vapes, kratom,
          hookah products, and accessories.
        </h2>
        <div className="hero__btns">
          <Link className="btn" to="/shop">Shop Now</Link>
          <a className="btn btn--ghost" href="#services">Explore Services</a>
        </div>
      </section>

      {showCart && (
        <div className="cart-panel">
          <h3>Your Cart</h3>
          {cartItems.length === 0 ? (
            <p>Your cart is empty.</p>
          ) : (
            <ul>
              {cartItems.map((item, i) => (
                <li key={i}>
                  {item.name} - ${Number(item.price || 0).toFixed(2)}
                  <button onClick={() => removeFromCart(i)}>Remove</button>
                </li>
              ))}
            </ul>
          )}
          <p><strong>Total:</strong> ${total}</p>
          <button>Proceed to Checkout</button>
        </div>
      )}

      <section className="section--dark">
        <h2>Best Sellers</h2>
        <div className="grid">
          {filtered.map((p) => (
            <article key={p.id} className="card">
              <img src={p.image} alt={p.name} />
              <div className="card__body">
                <div className="card__title">{p.name}</div>
                <div className="card__price">${Number(p.price || 0).toFixed(2)}</div>
                <button className="btn" onClick={() => addToCart(p)}>Add to Cart</button>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section id="services" className="section">
        <h2>Services</h2>
        <p>Curated cigars, vapes, kratom, hookah essentials, and friendly in-store guidance.</p>
      </section>

      <section id="about" className="section">
        <h2>About Us</h2>
        <p>Lava Cigar and Smoke is your neighborhood shop in Cranberry Twp, PA for quality smoke and lounge essentials.</p>
      </section>

      <footer id="contact" className="footer">
        <div className="footer__wrap">
          <div>
            <h3>Contact</h3>
            <p><FaMapMarkerAlt /> 20120 Rte 19 Unit 103, Cranberry Twp, PA 16066</p>
            <p><FaPhone /> (724) 591-8030</p>
            <p><FaEnvelope /> support@lavacigar.com</p>
          </div>
          <div>
            <h4>Follow Us</h4>
            <div className="social-icons">
              <a href="https://facebook.com" target="_blank" rel="noreferrer"><FaFacebook /></a>
              <a href="https://instagram.com" target="_blank" rel="noreferrer"><FaInstagram /></a>
              <a href="https://twitter.com" target="_blank" rel="noreferrer"><FaTwitter /></a>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
}

export default App;

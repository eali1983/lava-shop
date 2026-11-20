import React, { useState, useEffect } from 'react';
import './App.css';
import kiloIMG from './kilo.jpg';
import mitsIMG from './mits.jpg';
import reelIMG from './reel.jpg';
import logo from './logo.png';
import wel from './wel.png';
import { FaFacebook, FaInstagram, FaTwitter, FaEnvelope, FaPhone, FaMapMarkerAlt } from 'react-icons/fa';
import { db } from './firebase';
import { collection, getDocs } from 'firebase/firestore';

function App() {
  const [activeSection, setActiveSection] = useState('home');
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'products'));
        const productList = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setProducts(productList);
	console.log('Fetched products:', productList);
      } catch (error) {
        console.error('Error fetching products:', error);
      }
    };
    fetchProducts();
  }, []);

  return (
    <div className="page-wrapper">
      <div className="container">
        <div className="header">
          <img src={logo} alt="Lava Logo" className="header-logo" />
          <h1>🛒 Lava Cigar and Smoke</h1>
        </div>

        <nav className="main-nav">
          <ul className="nav-menu">
            <li><button onClick={() => setActiveSection('home')}>Home</button></li>
            <li>
              <select
                className="fancy-dropdown"
                defaultValue=""
                onChange={(e) => {
                  const value = e.target.value;
                  if (value) {
                    window.open(`/${value}`, '_blank');
                  }
                }}
              >
                <option value="" disabled>Products</option>
                <option value="cigars">Cigars</option>
                <option value="vapes">Vapes</option>
                <option value="kratom">Kratom</option>
                <option value="lighters">Lighters</option>
                <option value="cigarettes">Cigarettes</option>
              </select>
            </li>
            <li><button onClick={() => setActiveSection('about')}>About</button></li>
            <li className="contact-dropdown">
              <div className="contact-wrapper">
                <button className="contact-btn">Contact Us</button>
                <div className="contact-info">
                  <p><FaMapMarkerAlt /> 20120 Rte 19 unit 103, Cranberry Twp, PA 16066</p>
                  <p><FaPhone /> (724) 591-8030</p>
                  <p><FaEnvelope /> support@lavacigar.com</p>
                </div>
              </div>
            </li>
            <li><button onClick={() => setActiveSection('more')}>More</button></li>
          </ul>
        </nav>

        {activeSection === 'home' && (
          <>
            <div className="home-section">
              <div className="welcome-header">
                <img src={wel} alt="Welcome Icon" className="wel" />
                <p className="site-description">
                  Welcome to <strong>Lava Cigar and Smoke</strong> — your one-stop shop for premium cigars, vapes, kratom,
                  hookah products, and accessories. Use the navigation bar above to browse our product categories,
                  learn more about us, or get in touch. Click “Products” to explore items by type, or use “Contact Us”
                  if you need help. Enjoy your shopping!
                </p>
                <button className="shop-now" onClick={() => setActiveSection('products')}>
                  🛍️ Shop Now
                </button>
              </div>
            </div>

            <div className="product-list">
              {products.map((product) => (
                <div key={product.id} className="product-card">
                  <img src={product.image || kiloIMG} alt={product.name} className="product-img" />
                  <h3>{product.name}</h3>
                  <p>${product.price?.toFixed(2)}</p>
                  <p>{product.description}</p>
                </div>
              ))}
            </div>
          </>
        )}

        {activeSection === 'about' && (
          <div className="section-placeholder">
            <h2>About Us</h2>
            <p>More info coming soon...</p>
          </div>
        )}

        {activeSection === 'contact' && (
          <div className="section-placeholder">
            <h2>Contact Us</h2>
            <p>Contact form or info coming soon...</p>
          </div>
        )}

        {activeSection === 'more' && (
          <div className="section-placeholder">
            <h2>More</h2>
            <p>Additional features coming soon...</p>
          </div>
        )}
      </div>

      <footer className="site-footer">
        <div className="footer-container">
          <div className="footer-column">
            <h4>Quick Links</h4>
            <ul>
              <li><a href="#">Home</a></li>
              <li><a href="#">Products</a></li>
              <li><a href="#">Contact Us</a></li>
            </ul>
          </div>

          <div className="footer-column">
            <h4>Contact</h4>
            <p><FaMapMarkerAlt /> 20120 Rte 19 unit 103, Cranberry Twp, PA 16066</p>
            <p><FaPhone /> (724) 591-8030</p>
            <p><FaEnvelope /> support@lavacigar.com</p>
          </div>

          <div className="footer-column">
            <h4>Hours</h4>
            <p>Mon–Sun: 07:00 am – 12:00 am</p>
            <p>⚠️ Must be 21+ to purchase tobacco or vape products.</p>
          </div>

          <div className="footer-column">
            <h4>Follow Us</h4>
            <div className="social-icons">
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer"><FaFacebook /></a>
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer"><FaInstagram /></a>
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer"><FaTwitter /></a>
            </div>
          </div>
        </div>
        <div className="footer-bottom">
          <p>&copy; 2025 Lava Cigar and Smoke. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}

export default App;




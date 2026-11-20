// src/pages/Shop.jsx
import React from "react";
import { Link } from "react-router-dom";

// Add or rename categories as you like
const CATEGORIES = [
  { slug: "cigars", title: "Cigars", emoji: "🚬" },
  { slug: "vapes", title: "Vapes", emoji: "💨" },
  { slug: "kratom", title: "Kratom", emoji: "🌿" },
  { slug: "hookah", title: "Hookah", emoji: "🫧" },
  { slug: "accessories", title: "Accessories", emoji: "🧰" },
];

export default function Shop() {
  return (
    <section className="section--dark" style={{ paddingTop: 40 }}>
      <h2 className="section__title">Shop by Category</h2>

      <div className="grid" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))" }}>
        {CATEGORIES.map(cat => (
          <Link
            key={cat.slug}
            to={`/shop/${cat.slug}`}
            className="card"
            style={{ textDecoration: "none" }}
          >
            <div
              style={{
                display: "grid",
                placeItems: "center",
                fontSize: 64,
                paddingTop: 20,
              }}
            >
              <span>{cat.emoji}</span>
            </div>
            <div className="card__body" style={{ textAlign: "center" }}>
              <div className="card__title">{cat.title}</div>
              <div className="card__price" style={{ opacity: 0.7 }}>Explore</div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}

// src/pages/Category.jsx
import React, { useMemo } from "react";
import { useParams, Link } from "react-router-dom";

export default function Category({ products = [], onAddToCart }) {
  const { slug } = useParams();

  // normalize match: product.category === slug
  const items = useMemo(() => {
    const s = String(slug || "").toLowerCase();
    return products.filter(p => String(p.category || "").toLowerCase() === s);
  }, [products, slug]);

  return (
    <section className="section--dark" style={{ paddingTop: 40 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
        <h2 className="section__title" style={{ marginBottom: 0 }}>
          {slug ? slug.charAt(0).toUpperCase() + slug.slice(1) : "Category"}
        </h2>
        <Link to="/shop" className="btn btn--ghost">← All Categories</Link>
      </div>

      {items.length === 0 ? (
        <div style={{ marginTop: 20 }}>
          <p>No products found for <strong>{slug}</strong>.</p>
          <p style={{ opacity: 0.7 }}>
            Tip: ensure your Firestore products have a <code>category</code> field
            matching one of the slugs (e.g., <code>cigars</code>, <code>vapes</code>, <code>kratom</code>, etc.).
          </p>
        </div>
      ) : (
        <div className="grid">
          {items.map((p) => (
            <article key={p.id} className="card">
              <img src={p.image} alt={p.name} />
              <div className="card__body">
                <div className="card__title">{p.name}</div>
                <div className="card__price">${Number(p.price || 0).toFixed(2)}</div>
                <button className="btn" onClick={() => onAddToCart?.(p)}>
                  Add to Cart
                </button>
              </div>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}

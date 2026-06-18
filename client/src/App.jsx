import { useEffect, useState } from "react";
import "./App.css";
import { Routes, Route, useNavigate, useParams } from "react-router-dom";

const API_BASE_URL = "http://localhost:5001/api";

/* ---------------- PRODUCT PAGE ---------------- */
function ProductPage({ products = [], cart, setCart }) {
  const { id } = useParams();
  const navigate = useNavigate();

  const product = products.find((p) => p._id === id);

  if (!product) {
    return <h2 style={{ padding: 20 }}>Loading product...</h2>;
  }

  const addToCart = () => {
    setCart((prev) => {
      const existing = prev.find((i) => i._id === product._id);

      if (existing) {
        return prev.map((i) =>
          i._id === product._id
            ? { ...i, quantity: (i.quantity || 1) + 1 }
            : i
        );
      }

      return [...prev, { ...product, quantity: 1 }];
    });
  };

  return (
    <div className="page">
      <button className="backBtn" onClick={() => navigate("/")}>
        ⬅ Back
      </button>

      <div className="productPage">
        <img src={product.imageUrl} alt={product.name} />

        <div className="productDetails">
          <h1>{product.name}</h1>
          <h2 className="price">₹{product.price}</h2>
          <p>{product.description}</p>

          <button className="buyBtn" onClick={addToCart}>
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
}

/* ---------------- CHECKOUT PAGE ---------------- */
function Checkout({ cart = [], setCart }) {
  const navigate = useNavigate();

  const total = cart.reduce(
    (sum, i) => sum + i.price * (i.quantity || 1),
    0
  );

  const placeOrder = async () => {
    try {
      const orderData = {
        items: cart.map((item) => ({
          productId: item._id,
          name: item.name,
          price: item.price,
          quantity: item.quantity || 1,
        })),
        totalAmount: total,
      };

      const res = await fetch(`${API_BASE_URL}/orders`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(orderData),
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.message || "Order failed");

      alert("Order Placed Successfully 🎉");

      setCart([]);
      localStorage.removeItem("cart");

      navigate("/");
    } catch (err) {
      console.log(err);
      alert("Order failed ❌");
    }
  };

  return (
    <div className="checkout">
      <h1>Checkout 🧾</h1>

      {cart.length === 0 ? (
        <p className="empty">No items in cart</p>
      ) : (
        <>
          {cart.map((i) => (
            <div key={i._id} className="checkoutItem">
              <h3>{i.name}</h3>
              <p>Qty: {i.quantity || 1}</p>
              <p>₹{i.price}</p>
            </div>
          ))}

          <hr />
          <h2>Total: ₹{total.toFixed(2)}</h2>

          <button className="buyBtn" onClick={placeOrder}>
            Place Order 🚀
          </button>
        </>
      )}
    </div>
  );
}

/* ---------------- ORDER HISTORY PAGE ---------------- */
function Orders() {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    fetch(`${API_BASE_URL}/orders`)
      .then((res) => res.json())
      .then((data) => setOrders(data.orders || []))
      .catch((err) => console.log(err));
  }, []);

  return (
    <div style={{ padding: "20px" }}>
      <h1>📦 Order History</h1>

      {orders.length === 0 ? (
        <p>No orders found</p>
      ) : (
        orders.map((order) => (
          <div
            key={order._id}
            style={{
              border: "1px solid #ddd",
              padding: "10px",
              marginBottom: "10px",
              borderRadius: "8px",
            }}
          >
            <h3>Total: ₹{order.totalAmount}</h3>

            {order.items.map((item, index) => (
              <p key={index}>
                {item.name} × {item.quantity} = ₹{item.price}
              </p>
            ))}

            <small>
              Date: {new Date(order.createdAt).toLocaleString()}
            </small>
          </div>
        ))
      )}
    </div>
  );
}

/* ---------------- HOME PAGE ---------------- */
function Home({ products = [], cart, setCart }) {
  const navigate = useNavigate();

  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");

  const addToCart = (product) => {
    setCart((prev) => {
      const existing = prev.find((i) => i._id === product._id);

      if (existing) {
        return prev.map((i) =>
          i._id === product._id
            ? { ...i, quantity: (i.quantity || 1) + 1 }
            : i
        );
      }

      return [...prev, { ...product, quantity: 1 }];
    });
  };

  const filtered = (products || []).filter((p) => {
    return (
      p?.name?.toLowerCase().includes(search.toLowerCase()) &&
      (category === "All" || p?.category === category)
    );
  });

  const totalItems = cart.reduce(
    (s, i) => s + (i.quantity || 0),
    0
  );

  return (
    <div className="app">
      <div className="hero">
        <h1>ShopEZ Mega Deals 🔥</h1>
        <p>Best products at lowest prices</p>
      </div>

      <div className="categories">
        <button onClick={() => setCategory("All")}>All</button>
        <button onClick={() => setCategory("Electronics")}>Electronics</button>
        <button onClick={() => setCategory("Accessories")}>Accessories</button>
        <button onClick={() => setCategory("Furniture")}>Furniture</button>
      </div>

      <header className="navbar">
        <div className="logo">ShopEZ</div>

        <input
          placeholder="Search products..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <div>
          <button onClick={() => navigate("/orders")}>
            📦 Orders
          </button>

          <button onClick={() => navigate("/checkout")}>
            🛒 Cart ({totalItems})
          </button>
        </div>
      </header>

      <div className="products">
        {filtered.map((p) => (
          <div
            key={p._id}
            className="card"
            onClick={() => navigate(`/product/${p._id}`)}
          >
            <img src={p.imageUrl} alt={p.name} />
            <h3>{p.name}</h3>
            <p className="price">₹{p.price}</p>

            <button
              onClick={(e) => {
                e.stopPropagation();
                addToCart(p);
              }}
            >
              Add to Cart
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ---------------- MAIN APP ---------------- */
function App() {
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState([]);

  useEffect(() => {
    fetch(API_BASE_URL + "/products")
      .then((res) => res.json())
      .then((data) => setProducts(data.products || []))
      .catch((err) => console.log("API error", err));
  }, []);

  useEffect(() => {
    const saved = localStorage.getItem("cart");
    if (saved) setCart(JSON.parse(saved));
  }, []);

  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart));
  }, [cart]);

  return (
    <Routes>
      <Route path="/" element={<Home products={products} cart={cart} setCart={setCart} />} />
      <Route path="/product/:id" element={<ProductPage products={products} cart={cart} setCart={setCart} />} />
      <Route path="/checkout" element={<Checkout cart={cart} setCart={setCart} />} />
      <Route path="/orders" element={<Orders />} />
    </Routes>
  );
}

export default App;
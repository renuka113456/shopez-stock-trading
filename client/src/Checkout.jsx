import { useNavigate } from "react-router-dom";

function Checkout({ cart, setCart }) {
  const navigate = useNavigate();

  // SAFE TOTAL CALCULATION
  const total = cart.reduce(
    (sum, item) => sum + item.price * (item.quantity || 1),
    0
  );

  // 🔥 PLACE ORDER (CONNECTED TO BACKEND)
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

      const res = await fetch("http://localhost:5001/api/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(orderData),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Order failed");
      }

      console.log("✅ Order saved:", data);

      alert("Order Placed Successfully 🎉");

      // CLEAR CART
      setCart([]);
      localStorage.removeItem("cart");

      navigate("/");
    } catch (error) {
      console.log("❌ Order Error:", error.message);
      alert("Order failed. Try again.");
    }
  };

  return (
    <div style={{ padding: "20px", fontFamily: "Arial" }}>
      <h1>Checkout 🧾</h1>

      {cart.length === 0 ? (
        <p style={{ color: "gray" }}>No items in cart</p>
      ) : (
        <>
          {/* ITEMS LIST */}
          <div style={{ marginBottom: "20px" }}>
            {cart.map((item) => (
              <div
                key={item._id}
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  padding: "10px",
                  borderBottom: "1px solid #ddd",
                }}
              >
                <div>
                  <h3 style={{ margin: 0 }}>{item.name}</h3>
                  <p style={{ margin: 0 }}>
                    Qty: {item.quantity || 1}
                  </p>
                </div>

                <div>
                  <p style={{ margin: 0 }}>₹{item.price}</p>
                </div>
              </div>
            ))}
          </div>

          <hr />

          {/* TOTAL */}
          <h2>Total: ₹{total.toFixed(2)}</h2>

          {/* PLACE ORDER BUTTON */}
          <button
            onClick={placeOrder}
            style={{
              padding: "12px 20px",
              background: "#28a745",
              color: "white",
              border: "none",
              cursor: "pointer",
              borderRadius: "5px",
              fontSize: "16px",
              marginTop: "10px",
            }}
          >
            Place Order 🚀
          </button>
        </>
      )}
    </div>
  );
}

export default Checkout;
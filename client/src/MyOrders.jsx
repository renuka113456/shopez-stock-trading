import { useEffect, useState } from "react";

function MyOrders() {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    fetch("http://localhost:5001/api/orders")
      .then((res) => res.json())
      .then((data) => setOrders(data))
      .catch((err) => console.log(err));
  }, []);

  return (
    <div style={{ padding: "20px", fontFamily: "Arial" }}>
      <h1>🧾 My Orders</h1>

      {orders.length === 0 ? (
        <p>No orders found</p>
      ) : (
        orders.map((order) => (
          <div
            key={order._id}
            style={{
              border: "1px solid #ddd",
              padding: "15px",
              marginBottom: "10px",
              borderRadius: "8px",
            }}
          >
            <h3>Order ID: {order._id}</h3>

            {order.items.map((item, index) => (
              <div key={index} style={{ marginLeft: "10px" }}>
                <p>
                  {item.name} | Qty: {item.quantity} | ₹{item.price}
                </p>
              </div>
            ))}

            <h4>Total: ₹{order.totalAmount}</h4>
            <p style={{ fontSize: "12px", color: "gray" }}>
              {new Date(order.createdAt).toLocaleString()}
            </p>
          </div>
        ))
      )}
    </div>
  );
}

export default MyOrders;
import { useLocation, useNavigate } from "react-router-dom";

function ProductPage() {
  const { state: product } = useLocation();
  const navigate = useNavigate();

  if (!product) {
    return <h2>No product found</h2>;
  }

  return (
    <div style={{ padding: "20px", fontFamily: "Arial" }}>
      <button onClick={() => navigate("/")}>⬅ Back</button>

      <div style={{ display: "flex", gap: "20px", marginTop: "20px" }}>
        <img
          src={product.imageUrl}
          style={{ width: "300px", borderRadius: "10px" }}
        />

        <div>
          <h1>{product.name}</h1>
          <h2>₹{product.price}</h2>
          <p>{product.description}</p>

          <button
            style={{
              padding: "10px",
              background: "black",
              color: "white",
              border: "none"
            }}
          >
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
}

export default ProductPage;
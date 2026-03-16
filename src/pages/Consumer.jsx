import { useEffect, useState } from "react";
import API from "../services/api";

function Consumer() {
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);

  const user = JSON.parse(localStorage.getItem("user"));

  const getProducts = async () => {
    try {
      const res = await API.get("/products");
      setProducts(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  const getOrders = async () => {
    try {
      if (!user) return;

      const res = await API.get(`/orders/consumer/${user.id}`);
      setOrders(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  const createOrder = async (product) => {
    try {
      if (!user) {
        alert("No logged user found");
        return;
      }

      await API.post("/orders", {
        consumerId: user.id,
        storeId: product.storeId,
        productId: product.id,
        quantity: 1
      });

      alert("Order created!");
      getOrders();
    } catch (error) {
      console.log(error);
      alert("Error creating order");
    }
  };

  useEffect(() => {
    getProducts();
    getOrders();

    const interval = setInterval(() => {
      getOrders();
    }, 4000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div
      style={{
        background: "#f4f6f8",
        minHeight: "100vh",
        padding: "40px",
        color: "black",
        fontFamily: "Arial"
      }}
    >
      <h1
        style={{
          marginBottom: "30px",
          color: "black"
        }}
      >
        Consumer Dashboard
      </h1>

      <h2
        style={{
          marginBottom: "20px",
          color: "black"
        }}
      >
        Products
      </h2>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
          gap: "20px"
        }}
      >
        {products.map((product) => (
          <div
            key={product.id}
            style={{
              background: "white",
              borderRadius: "10px",
              padding: "20px",
              boxShadow: "0 3px 6px rgba(0,0,0,0.1)",
              textAlign: "center",
              color: "black"
            }}
          >
            <h3
              style={{
                marginBottom: "10px",
                color: "black"
              }}
            >
              {product.name}
            </h3>

            <p
              style={{
                marginBottom: "15px",
                color: "#333"
              }}
            >
              ${product.price}
            </p>

            <p
              style={{
                marginBottom: "15px",
                color: "#555",
                fontSize: "14px"
              }}
            >
              Store ID: {product.storeId}
            </p>

            <button
              onClick={() => createOrder(product)}
              style={{
                background: "#ff441f",
                border: "none",
                color: "white",
                padding: "8px 15px",
                borderRadius: "6px",
                cursor: "pointer",
                fontWeight: "bold"
              }}
            >
              Order
            </button>
          </div>
        ))}
      </div>

      <div
        style={{
          marginTop: "50px",
          marginBottom: "20px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center"
        }}
      >
        <h2 style={{ color: "black", margin: 0 }}>My Orders</h2>

        <button
          onClick={getOrders}
          style={{
            background: "#2563eb",
            border: "none",
            color: "white",
            padding: "10px 14px",
            borderRadius: "8px",
            cursor: "pointer",
            fontWeight: "bold"
          }}
        >
          Refresh Orders
        </button>
      </div>

      {orders.length === 0 ? (
        <p>No orders yet.</p>
      ) : (
        <div
          style={{
            display: "grid",
            gap: "15px"
          }}
        >
          {orders.map((order) => (
            <div
              key={order.id}
              style={{
                background: "white",
                padding: "15px",
                borderRadius: "8px",
                boxShadow: "0 2px 4px rgba(0,0,0,0.1)"
              }}
            >
              <p><strong>Order ID:</strong> {order.id}</p>
              <p><strong>Product ID:</strong> {order.productId}</p>
              <p><strong>Store ID:</strong> {order.storeId}</p>
              <p><strong>Quantity:</strong> {order.quantity}</p>
              <p>
                <strong>Status:</strong>{" "}
                <span
                  style={{
                    fontWeight: "bold",
                    color:
                      order.status === "pending"
                        ? "#f59e0b"
                        : order.status === "accepted"
                        ? "#2563eb"
                        : order.status === "delivered"
                        ? "#16a34a"
                        : "#111827"
                  }}
                >
                  {order.status}
                </span>
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Consumer;
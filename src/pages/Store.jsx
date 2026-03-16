import { useEffect, useState } from "react";
import API from "../services/api";

function Store() {
  const [store, setStore] = useState(null);
  const [orders, setOrders] = useState([]);
  const [productName, setProductName] = useState("");
  const [productPrice, setProductPrice] = useState("");

  const user = JSON.parse(localStorage.getItem("user"));

  const getStoreOrders = async (storeId) => {
    try {
      const ordersRes = await API.get(`/orders/store/${storeId}`);
      setOrders(ordersRes.data);
    } catch (error) {
      console.log(error);
    }
  };

  const getMyStore = async () => {
    try {
      if (!user) return;

      const res = await API.get(`/stores/user/${user.id}`);
      setStore(res.data);
      await getStoreOrders(res.data.id);
    } catch (error) {
      console.log(error);
    }
  };

  const toggleStoreStatus = async () => {
    try {
      const res = await API.put(`/stores/${store.id}/status`, {
        isOpen: !store.isOpen
      });

      setStore(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  const createProduct = async (e) => {
    e.preventDefault();

    if (!productName || !productPrice || !store) {
      alert("Please complete all fields");
      return;
    }

    try {
      await API.post("/products", {
        id: Date.now(),
        name: productName,
        price: Number(productPrice),
        storeId: store.id
      });

      alert("Product created!");
      setProductName("");
      setProductPrice("");
    } catch (error) {
      console.log(error);
      alert("Error creating product");
    }
  };

  useEffect(() => {
    getMyStore();
  }, []);

  if (!store) {
    return <h2 style={{ textAlign: "center", marginTop: "40px" }}>Loading store...</h2>;
  }

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
      <h1 style={{ marginBottom: "30px" }}>Store Dashboard</h1>

      <div
        style={{
          background: "white",
          padding: "25px",
          borderRadius: "12px",
          boxShadow: "0 3px 8px rgba(0,0,0,0.1)",
          marginBottom: "30px"
        }}
      >
        <h2>Store Information</h2>
        <p><strong>Store ID:</strong> {store.id}</p>
        <p><strong>Store Name:</strong> {store.name}</p>
        <p>
          <strong>Status:</strong>{" "}
          <span style={{ color: store.isOpen ? "green" : "red", fontWeight: "bold" }}>
            {store.isOpen ? "Open" : "Closed"}
          </span>
        </p>

        <div style={{ display: "flex", gap: "10px", marginTop: "10px" }}>
          <button
            onClick={toggleStoreStatus}
            style={{
              background: store.isOpen ? "#dc3545" : "#28a745",
              border: "none",
              color: "white",
              padding: "10px 16px",
              borderRadius: "8px",
              cursor: "pointer",
              fontWeight: "bold"
            }}
          >
            {store.isOpen ? "Close Store" : "Open Store"}
          </button>

          <button
            onClick={() => getStoreOrders(store.id)}
            style={{
              background: "#2563eb",
              border: "none",
              color: "white",
              padding: "10px 16px",
              borderRadius: "8px",
              cursor: "pointer",
              fontWeight: "bold"
            }}
          >
            Refresh Orders
          </button>
        </div>
      </div>

      <div
        style={{
          background: "white",
          padding: "25px",
          borderRadius: "12px",
          boxShadow: "0 3px 8px rgba(0,0,0,0.1)",
          marginBottom: "30px"
        }}
      >
        <h2>Create Product</h2>

        <form onSubmit={createProduct} style={{ display: "grid", gap: "15px", maxWidth: "400px" }}>
          <input
            type="text"
            placeholder="Product name"
            value={productName}
            onChange={(e) => setProductName(e.target.value)}
            style={{
              padding: "12px",
              borderRadius: "8px",
              border: "1px solid #ccc"
            }}
          />

          <input
            type="number"
            placeholder="Product price"
            value={productPrice}
            onChange={(e) => setProductPrice(e.target.value)}
            style={{
              padding: "12px",
              borderRadius: "8px",
              border: "1px solid #ccc"
            }}
          />

          <button
            type="submit"
            style={{
              background: "#ff441f",
              border: "none",
              color: "white",
              padding: "12px",
              borderRadius: "8px",
              cursor: "pointer",
              fontWeight: "bold"
            }}
          >
            Create Product
          </button>
        </form>
      </div>

      <div
        style={{
          background: "white",
          padding: "25px",
          borderRadius: "12px",
          boxShadow: "0 3px 8px rgba(0,0,0,0.1)"
        }}
      >
        <h2>Incoming Orders</h2>

        {orders.length === 0 ? (
          <p>No incoming orders.</p>
        ) : (
          <div style={{ display: "grid", gap: "15px", marginTop: "20px" }}>
            {orders.map((order) => (
              <div
                key={order.id}
                style={{
                  background: "#f8f9fa",
                  padding: "15px",
                  borderRadius: "10px",
                  border: "1px solid #e5e5e5"
                }}
              >
                <p><strong>Order ID:</strong> {order.id}</p>
                <p><strong>Consumer ID:</strong> {order.consumerId}</p>
                <p><strong>Product ID:</strong> {order.productId}</p>
                <p><strong>Store ID:</strong> {order.storeId}</p>
                <p><strong>Quantity:</strong> {order.quantity}</p>
                <p><strong>Status:</strong> {order.status}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Store;
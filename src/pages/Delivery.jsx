import { useEffect, useState } from "react";

function Delivery() {
  const [availableOrders, setAvailableOrders] = useState([]);
  const [acceptedOrders, setAcceptedOrders] = useState([]);
  const [deliveredOrders, setDeliveredOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const user = JSON.parse(localStorage.getItem("user"));
  const deliveryId = user?.id;

  const fetchAvailableOrders = async () => {
    try {
      const response = await fetch("http://localhost:3000/api/orders/delivery/available");
      const data = await response.json();
      setAvailableOrders(data);
    } catch (error) {
      console.error("Error fetching available orders:", error);
    }
  };

  const fetchAcceptedOrders = async () => {
    try {
      if (!deliveryId) return;

      const response = await fetch(`http://localhost:3000/api/orders/delivery/accepted/${deliveryId}`);
      const data = await response.json();
      setAcceptedOrders(data);
    } catch (error) {
      console.error("Error fetching accepted orders:", error);
    }
  };

  const fetchDeliveredOrders = async () => {
    try {
      if (!deliveryId) return;

      const response = await fetch("http://localhost:3000/api/orders");
      const data = await response.json();

      const delivered = data.filter(
        (order) => order.deliveryId == deliveryId && order.status === "delivered"
      );

      setDeliveredOrders(delivered);
    } catch (error) {
      console.error("Error fetching delivered orders:", error);
    }
  };

  const fetchAllData = async () => {
    setLoading(true);
    await fetchAvailableOrders();
    await fetchAcceptedOrders();
    await fetchDeliveredOrders();
    setLoading(false);
  };

  useEffect(() => {
    if (deliveryId) {
      fetchAllData();
    } else {
      setLoading(false);
    }
  }, [deliveryId]);

  const handleAccept = async (orderId) => {
    try {
      if (!deliveryId) {
        alert("No logged delivery user found");
        return;
      }

      const response = await fetch(`http://localhost:3000/api/orders/${orderId}/accept`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ deliveryId })
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.log(errorData);
        alert(errorData.message || "Error accepting order");
        return;
      }

      fetchAllData();
    } catch (error) {
      console.error("Error accepting order:", error);
    }
  };

  const handleDecline = async (orderId) => {
    try {
      const response = await fetch(`http://localhost:3000/api/orders/${orderId}/decline`, {
        method: "PUT"
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.log(errorData);
        alert(errorData.message || "Error declining order");
        return;
      }

      fetchAllData();
    } catch (error) {
      console.error("Error declining order:", error);
    }
  };

  const handleDelivered = async (orderId) => {
    try {
      const response = await fetch(`http://localhost:3000/api/orders/${orderId}/delivered`, {
        method: "PUT"
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.log(errorData);
        alert(errorData.message || "Error marking order as delivered");
        return;
      }

      fetchAllData();
    } catch (error) {
      console.error("Error marking order as delivered:", error);
    }
  };

  const pageStyle = {
    width: "100%",
    minHeight: "100vh",
    backgroundColor: "#f4f6f8",
    padding: "40px 20px",
    fontFamily: "Arial, sans-serif",
    color: "#111827",
    boxSizing: "border-box"
  };

  const containerStyle = {
    width: "100%",
    maxWidth: "1200px",
    margin: "0 auto"
  };

  const sectionTitleStyle = {
    fontSize: "28px",
    fontWeight: "bold",
    marginBottom: "20px",
    color: "#111827"
  };

  const gridStyle = {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
    gap: "20px"
  };

  const cardStyle = {
    backgroundColor: "#ffffff",
    borderRadius: "14px",
    padding: "20px",
    boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
    border: "1px solid #e5e7eb",
    color: "#111827"
  };

  const textStyle = {
    margin: "8px 0",
    color: "#111827",
    fontSize: "16px"
  };

  if (loading) {
    return (
      <div style={pageStyle}>
        <div style={containerStyle}>
          <h2 style={{ textAlign: "center", color: "#111827" }}>Loading...</h2>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div style={pageStyle}>
        <div style={containerStyle}>
          <h2 style={{ textAlign: "center", color: "#111827" }}>
            No delivery user found. Please login again.
          </h2>
        </div>
      </div>
    );
  }

  return (
    <div style={pageStyle}>
      <div style={containerStyle}>
        <h1
          style={{
            textAlign: "center",
            marginBottom: "40px",
            fontSize: "42px",
            color: "#111827"
          }}
        >
          Delivery Dashboard
        </h1>

        <section style={{ marginBottom: "50px" }}>
          <h2 style={sectionTitleStyle}>Available Orders</h2>

          {availableOrders.length === 0 ? (
            <p style={{ color: "#374151", fontSize: "18px" }}>No available orders.</p>
          ) : (
            <div style={gridStyle}>
              {availableOrders.map((order) => (
                <div key={order.id} style={cardStyle}>
                  <p style={textStyle}><strong>Order ID:</strong> {order.id}</p>
                  <p style={textStyle}><strong>Consumer ID:</strong> {order.consumerId}</p>
                  <p style={textStyle}><strong>Store ID:</strong> {order.storeId}</p>
                  <p style={textStyle}><strong>Product ID:</strong> {order.productId}</p>
                  <p style={textStyle}><strong>Quantity:</strong> {order.quantity}</p>
                  <p style={textStyle}><strong>Status:</strong> {order.status}</p>

                  <div style={{ display: "flex", gap: "10px", marginTop: "18px" }}>
                    <button
                      onClick={() => handleAccept(order.id)}
                      style={{
                        flex: 1,
                        padding: "12px",
                        border: "none",
                        borderRadius: "8px",
                        cursor: "pointer",
                        backgroundColor: "#22c55e",
                        color: "#ffffff",
                        fontWeight: "bold"
                      }}
                    >
                      Accept
                    </button>

                    <button
                      onClick={() => handleDecline(order.id)}
                      style={{
                        flex: 1,
                        padding: "12px",
                        border: "none",
                        borderRadius: "8px",
                        cursor: "pointer",
                        backgroundColor: "#ef4444",
                        color: "#ffffff",
                        fontWeight: "bold"
                      }}
                    >
                      Decline
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        <section style={{ marginBottom: "50px" }}>
          <h2 style={sectionTitleStyle}>Accepted Orders</h2>

          {acceptedOrders.length === 0 ? (
            <p style={{ color: "#374151", fontSize: "18px" }}>No accepted orders yet.</p>
          ) : (
            <div style={gridStyle}>
              {acceptedOrders.map((order) => (
                <div key={order.id} style={cardStyle}>
                  <p style={textStyle}><strong>Order ID:</strong> {order.id}</p>
                  <p style={textStyle}><strong>Consumer ID:</strong> {order.consumerId}</p>
                  <p style={textStyle}><strong>Store ID:</strong> {order.storeId}</p>
                  <p style={textStyle}><strong>Product ID:</strong> {order.productId}</p>
                  <p style={textStyle}><strong>Quantity:</strong> {order.quantity}</p>
                  <p style={textStyle}><strong>Status:</strong> {order.status}</p>
                  <p style={textStyle}><strong>Delivery ID:</strong> {order.deliveryId}</p>

                  <button
                    onClick={() => handleDelivered(order.id)}
                    style={{
                      marginTop: "18px",
                      width: "100%",
                      padding: "12px",
                      border: "none",
                      borderRadius: "8px",
                      cursor: "pointer",
                      backgroundColor: "#2563eb",
                      color: "#ffffff",
                      fontWeight: "bold"
                    }}
                  >
                    Mark as Delivered
                  </button>
                </div>
              ))}
            </div>
          )}
        </section>

        <section>
          <h2 style={sectionTitleStyle}>Delivered Orders</h2>

          {deliveredOrders.length === 0 ? (
            <p style={{ color: "#374151", fontSize: "18px" }}>No delivered orders yet.</p>
          ) : (
            <div style={gridStyle}>
              {deliveredOrders.map((order) => (
                <div key={order.id} style={cardStyle}>
                  <p style={textStyle}><strong>Order ID:</strong> {order.id}</p>
                  <p style={textStyle}><strong>Consumer ID:</strong> {order.consumerId}</p>
                  <p style={textStyle}><strong>Store ID:</strong> {order.storeId}</p>
                  <p style={textStyle}><strong>Product ID:</strong> {order.productId}</p>
                  <p style={textStyle}><strong>Quantity:</strong> {order.quantity}</p>
                  <p style={textStyle}><strong>Status:</strong> {order.status}</p>
                  <p style={textStyle}><strong>Delivery ID:</strong> {order.deliveryId}</p>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}

export default Delivery;
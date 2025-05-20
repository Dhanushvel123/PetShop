import React, { useEffect, useState } from "react";
import {
  Table, Container, Badge, Image, Button,
  Modal, Form, Row, Col
} from "react-bootstrap";
import { ToastContainer, toast } from "react-toastify";
import API from "../utils/api";
import "react-toastify/dist/ReactToastify.css";

function OrderHistory() {
  const [orders, setOrders] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [editableItems, setEditableItems] = useState([]);

  useEffect(() => {
    fetchOrderHistory();
  }, []);

  const fetchOrderHistory = () => {
    API.get("/orders")
      .then((res) => setOrders(res.data))
      .catch((err) => {
        console.error("Fetch orders error:", err);
        toast.error("❌ Failed to fetch order history");
      });
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return isNaN(date.getTime()) ? "Invalid Date" : date.toLocaleString();
  };

  const getTotalPrice = (items) =>
    items.reduce((sum, item) => sum + (item.price || 0) * (item.quantity || 0), 0).toFixed(2);

  const handleCancelOrder = (orderId) => {
    if (window.confirm("Are you sure you want to cancel this order?")) {
      API.delete(`/orders/${orderId}`)
        .then(() => {
          toast.success("✅ Order cancelled");
          fetchOrderHistory();
        })
        .catch((err) => {
          console.error("Cancel order error:", err);
          toast.error("❌ Failed to cancel order");
        });
    }
  };

  const handleEditOrder = (order) => {
    setSelectedOrder(order);
    setEditableItems(order.items.map(item => ({ ...item })));
    setShowModal(true);
  };

  const handleQuantityChange = (index, newQty) => {
    const updated = [...editableItems];
    updated[index].quantity = Number(newQty);
    setEditableItems(updated);
  };

  const handleSaveChanges = () => {
    API.put(`/orders/${selectedOrder._id}`, { items: editableItems })
      .then(() => {
        toast.success("✅ Order updated");
        setShowModal(false);
        fetchOrderHistory();
      })
      .catch((err) => {
        console.error("Update error:", err);
        toast.error("❌ Failed to update order");
      });
  };

  const renderOrderTable = (typeLabel, filteredOrders) => (
    <>
      <h4 className="mb-3">{typeLabel}</h4>
      <Table striped bordered hover responsive className="mb-5">
        <thead className="text-center align-middle">
          <tr>
            <th>#</th>
            <th>Items</th>
            <th>Total</th>
            <th>Date</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredOrders.map((order, index) => {
            const filteredItems = order.items.filter(
              (item) => item.productType === typeLabel.toLowerCase()
            );

            return (
              <tr key={order._id} className="text-center align-middle">
                <td>{index + 1}</td>
                <td className="text-start">
                  {filteredItems.map((item, idx) => (
                    <div key={idx} className="d-flex align-items-center mb-2 gap-2">
                      {item.image && (
                        <Image
                          src={item.image}
                          alt={item.name}
                          rounded
                          width={40}
                          height={40}
                        />
                      )}
                      <div>
                        <div className="fw-bold">{item.name || "Unnamed Item"}</div>
                        <small>Qty: {item.quantity} | ${item.price}</small>
                      </div>
                    </div>
                  ))}
                </td>
                <td>${getTotalPrice(filteredItems)}</td>
                <td>{formatDate(order.date || order.createdAt)}</td>
                <td>
                  <Badge
                    bg={
                      order.status === "Delivered"
                        ? "success"
                        : order.status === "Cancelled"
                          ? "danger"
                          : "warning"
                    }
                  >
                    {order.status || "Pending"}
                  </Badge>
                </td>
                <td>
                  {order.status === "Pending" && (
                    <>
                      <Button
                        size="sm"
                        variant="outline-primary"
                        className="me-2"
                        onClick={() => handleEditOrder(order)}
                      >
                        Edit
                      </Button>
                      <Button
                        size="sm"
                        variant="outline-danger"
                        onClick={() => handleCancelOrder(order._id)}
                      >
                        Cancel
                      </Button>
                    </>
                  )}
                </td>
              </tr>
            );
          })}
        </tbody>
      </Table>
    </>
  );

  const foodOrders = orders.filter((order) =>
    order.items.some((item) => item.productType === "food")
  );
  const accessoryOrders = orders.filter((order) =>
    order.items.some((item) => item.productType === "accessory")
  );

  return (
    <Container className="mt-5">
      <ToastContainer />
      <h2 className="text-center mb-4">📦 Order History</h2>

      {orders.length === 0 ? (
        <p className="text-muted text-center">No orders found.</p>
      ) : (
        <>
          {renderOrderTable("Food", foodOrders)}
          {renderOrderTable("Accessory", accessoryOrders)}
        </>
      )}

      {/* ✅ Edit Modal */}
      <Modal show={showModal} onHide={() => setShowModal(false)} centered size="lg">
        <Modal.Header closeButton>
          <Modal.Title>✏️ Edit Order</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {editableItems.map((item, idx) => (
            <Row key={idx} className="mb-3 align-items-center">
              <Col xs={2}>
                <Image src={item.image} width={50} height={50} rounded />
              </Col>
              <Col xs={4}>{item.name}</Col>
              <Col xs={3}>
                <Form.Control
                  type="number"
                  min="1"
                  value={item.quantity}
                  onChange={(e) => handleQuantityChange(idx, e.target.value)}
                />
              </Col>
              <Col xs={3}>${item.price}</Col>
            </Row>
          ))}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleSaveChanges}>
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
}

export default OrderHistory;

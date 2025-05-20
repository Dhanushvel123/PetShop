import React, { useState, useEffect, useCallback } from "react";
import API from "../../utils/api";
import {
  Card, Button, Row, Col, Container,
  Table, Form, Toast, ToastContainer, InputGroup,
} from "react-bootstrap";
import {
  FaHeart, FaShoppingCart, FaTrash,
  FaEdit, FaSave, FaPlus, FaMinus,
} from "react-icons/fa";
import "./Accessory.css";

function Accessory() {
  const [accessories, setAccessories] = useState([]);
  const [cart, setCart] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [editQuantity, setEditQuantity] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [toast, setToast] = useState({ show: false, message: "", variant: "success" });

  const showToast = (message, variant = "success") => {
    setToast({ show: true, message, variant });
    setTimeout(() => setToast({ show: false, message: "", variant: "success" }), 3000);
  };

  const fetchCart = useCallback(() => {
    API.get("/accessories/cart")
      .then((res) => setCart(res.data))
      .catch(() => showToast("Failed to fetch accessory cart", "danger"));
  }, []);

  const fetchAccessories = useCallback(() => {
    API.get("/accessories")
      .then((res) => setAccessories(res.data))
      .catch(() => showToast("Failed to fetch accessories", "danger"));
  }, []);

  useEffect(() => {
    fetchAccessories();
    fetchCart();
  }, [fetchAccessories, fetchCart]);

  const addToCart = (item) => {
    const existing = cart.find(c => c.accessory === item._id);
    const quantity = existing ? existing.quantity + 1 : 1;

    if (item.stockQuantity < quantity) {
      return showToast("Not enough stock", "warning");
    }

    API.post("/accessories/cart", {
      accessoryId: item._id,
      quantity: 1,
      price: item.price,
      image: item.imageUrl
    })
      .then(() => {
        fetchCart();
        fetchAccessories();
        showToast("Accessory added to cart!");
      })
      .catch(() => showToast("Add to cart failed", "danger"));
  };

  const toggleFavorite = (id) => {
    API.post(`/accessories/favorite/${id}`)
      .then(() => {
        fetchAccessories();
        showToast("Favorite status toggled");
      })
      .catch(() => showToast("Toggle failed", "danger"));
  };

  const updateQuantity = (id, quantity) => {
    if (quantity < 1) return showToast("Minimum quantity is 1", "warning");

    API.put(`/accessories/cart/${id}`, { quantity })
      .then(() => {
        fetchCart();
        fetchAccessories();
        setEditingId(null);
        showToast("Quantity updated");
      })
      .catch(() => showToast("Update failed", "danger"));
  };

  const deleteFromCart = (id) => {
    API.delete(`/accessories/cart/${id}`)
      .then(() => {
        fetchCart();
        fetchAccessories();
        showToast("Accessory removed from cart and stock restored");
      })
      .catch(() => showToast("Delete failed", "danger"));
  };

  const placeOrder = () => {
    if (cart.length === 0) return showToast("Cart is empty", "warning");

    const items = cart.map(item => ({
      productType: "accessory",
      productId: item.accessory,
      name: item.accessoryName,
      quantity: item.quantity,
      price: item.price,
      image: item.image
    }));

    const totalPrice = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

    API.post("/orders/checkout", {
      items,
      totalPrice
    })
      .then(() => {
        fetchCart();
        fetchAccessories();
        showToast("Order placed!");
      })
      .catch(() => showToast("Order failed", "danger"));
  };

  const filteredAccessories = accessories.filter((a) =>
    a.accessoryName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getCartTotal = () =>
    cart.reduce((acc, item) => acc + item.price * item.quantity, 0).toFixed(2);

  return (
    <Container className="mt-5">
      <ToastContainer position="bottom-end" className="p-3">
        <Toast show={toast.show} bg={toast.variant} onClose={() => setToast({ ...toast, show: false })} delay={3000} autohide>
          <Toast.Body className="text-white">{toast.message}</Toast.Body>
        </Toast>
      </ToastContainer>

      <h2 className="text-center mb-4">🎁 Pet Accessories</h2>

      <InputGroup className="mb-4">
        <Form.Control
          type="text"
          placeholder="Search accessories..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </InputGroup>

      <Row className="g-4">
        {filteredAccessories.map((item, idx) => (
          <Col key={idx} xs={12} sm={6} md={4} lg={3}>
            <Card className="h-100 shadow-sm border-0">
              <Card.Img variant="top" src={item.imageUrl} height={180} style={{ objectFit: "cover" }} />
              <Card.Body className="d-flex flex-column">
                <Card.Title>{item.accessoryName}</Card.Title>
                <Card.Text className="text-muted">{item.description}</Card.Text>
                <p><strong>${item.price}</strong></p>
                <p><strong>Stock:</strong> {item.stockQuantity}</p>
                <div className="mt-auto d-flex justify-content-between">
                  <Button
                    variant="success"
                    size="sm"
                    onClick={() => addToCart(item)}
                    disabled={item.stockQuantity <= 0}
                  >
                    <FaShoppingCart />
                  </Button>
                  <Button
                    variant={item.favorite ? "danger" : "outline-danger"}
                    size="sm"
                    onClick={() => toggleFavorite(item._id)}
                  >
                    <FaHeart />
                  </Button>
                </div>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>

      <div className="mt-5">
        <h4>🛒 Accessory Cart</h4>
        {cart.length === 0 ? (
          <p>No items in cart.</p>
        ) : (
          <>
            <Table responsive striped bordered hover>
              <thead>
                <tr>
                  <th>Image</th>
                  <th>Name</th>
                  <th>Price</th>
                  <th>Quantity</th>
                  <th>Total</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {cart.map((item) => (
                  <tr key={item._id}>
                    <td><img src={item.image} alt={item.accessoryName} width={60} /></td>
                    <td>{item.accessoryName}</td>
                    <td>${item.price}</td>
                    <td>
                      <div className="d-flex align-items-center gap-2">
                        <Button size="sm" variant="outline-secondary" onClick={() => updateQuantity(item._id, item.quantity - 1)}>
                          <FaMinus />
                        </Button>
                        {editingId === item._id ? (
                          <Form.Control
                            type="number"
                            min="1"
                            value={editQuantity}
                            onChange={(e) => setEditQuantity(e.target.value)}
                            style={{ maxWidth: "70px" }}
                          />
                        ) : (
                          <span>{item.quantity}</span>
                        )}
                        <Button size="sm" variant="outline-secondary" onClick={() => updateQuantity(item._id, item.quantity + 1)}>
                          <FaPlus />
                        </Button>
                      </div>
                    </td>
                    <td>${(item.price * item.quantity).toFixed(2)}</td>
                    <td>
                      {editingId === item._id ? (
                        <Button
                          variant="primary"
                          size="sm"
                          className="me-2"
                          onClick={() => updateQuantity(item._id, Number(editQuantity))}
                        >
                          <FaSave />
                        </Button>
                      ) : (
                        <Button
                          variant="warning"
                          size="sm"
                          className="me-2"
                          onClick={() => {
                            setEditingId(item._id);
                            setEditQuantity(item.quantity);
                          }}
                        >
                          <FaEdit />
                        </Button>
                      )}
                      <Button variant="danger" size="sm" onClick={() => deleteFromCart(item._id)}>
                        <FaTrash />
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
            <h5 className="text-end">💵 Total: <strong>${getCartTotal()}</strong></h5>
            <div className="text-end">
              <Button variant="success" onClick={placeOrder}>Place Order</Button>
            </div>
          </>
        )}
      </div>
    </Container>
  );
}

export default Accessory;
// ✅ Updated Food.js with unified Place Order
import React, { useState, useEffect, useCallback } from "react";
import API from "../../utils/api";
import {
  Card, Button, Row, Col, Container,
  Table, Form, Toast, ToastContainer, InputGroup
} from "react-bootstrap";
import {
  FaHeart, FaShoppingCart, FaTrash,
  FaEdit, FaSave, FaPlus, FaMinus
} from "react-icons/fa";
import "./Food.css";

function Food() {
  const [foods, setFoods] = useState([]);
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
    API.get("/petfoods/cart")
      .then((res) => setCart(res.data))
      .catch(() => showToast("Failed to fetch food cart", "danger"));
  }, []);

  const fetchFoods = useCallback(() => {
    API.get("/petfoods")
      .then((res) => setFoods(res.data))
      .catch(() => showToast("Failed to fetch foods", "danger"));
  }, []);

  useEffect(() => {
    fetchFoods();
    fetchCart();
  }, [fetchFoods, fetchCart]);

  const addToCart = (item) => {
    const existing = cart.find(c => c.food === item._id);
    const quantity = existing ? existing.quantity + 1 : 1;

    if (item.stock < quantity) {
      return showToast("Not enough stock", "warning");
    }

    API.post("/petfoods/cart", {
      foodId: item._id,
      quantity: 1,
      price: item.price,
      image: item.image
    })
      .then(() => {
        fetchCart();
        fetchFoods();
        showToast("Food added to cart!");
      })
      .catch(() => showToast("Add to cart failed", "danger"));
  };

  const toggleFavorite = (id) => {
    API.post(`/petfoods/favorite/${id}`)
      .then(() => {
        fetchFoods();
        showToast("Favorite status toggled");
      })
      .catch(() => showToast("Toggle failed", "danger"));
  };

  const updateQuantity = (id, quantity) => {
    if (quantity < 1) return showToast("Minimum quantity is 1", "warning");

    API.put(`/petfoods/cart/${id}`, { quantity })
      .then(() => {
        fetchCart();
        fetchFoods();
        setEditingId(null);
        showToast("Quantity updated");
      })
      .catch(() => showToast("Update failed", "danger"));
  };

  const deleteFromCart = (id) => {
    API.delete(`/petfoods/cart/${id}`)
      .then(() => {
        fetchCart();
        fetchFoods();
        showToast("Item removed from cart and stock restored");
      })
      .catch(() => showToast("Delete failed", "danger"));
  };

  // ✅ UNIFIED Place Order Logic (Food + Accessory carts)
  const placeOrder = () => {
    if (cart.length === 0) return showToast("Cart is empty", "warning");

    API.post("/orders/checkout")
      .then((res) => {
        showToast("Order placed successfully");
        fetchCart();
        fetchFoods();
      })
      .catch((err) => {
        console.error(err);
        showToast("Order failed", "danger");
      });
  };

  const filteredFoods = foods.filter(f => f.foodName.toLowerCase().includes(searchTerm.toLowerCase()));
  const getCartTotal = () => cart.reduce((acc, item) => acc + item.price * item.quantity, 0).toFixed(2);

  return (
    <Container className="mt-5">
      <ToastContainer position="bottom-end" className="p-3">
        <Toast show={toast.show} bg={toast.variant} onClose={() => setToast({ ...toast, show: false })} delay={3000} autohide>
          <Toast.Body className="text-white">{toast.message}</Toast.Body>
        </Toast>
      </ToastContainer>

      <h2 className="text-center mb-4">🥫 Pet Food</h2>

      <InputGroup className="mb-4">
        <Form.Control
          type="text"
          placeholder="Search food..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </InputGroup>

      <Row className="g-4">
        {filteredFoods.map((item, idx) => (
          <Col key={idx} xs={12} sm={6} md={4} lg={3}>
            <Card className="h-100 shadow-sm border-0">
              <Card.Img variant="top" src={item.image} height={180} style={{ objectFit: "cover" }} />
              <Card.Body className="d-flex flex-column">
                <Card.Title>{item.foodName}</Card.Title>
                <Card.Text className="text-muted">{item.description}</Card.Text>
                <p><strong>${item.price}</strong></p>
                <p><strong>Stock:</strong> {item.stock}</p>
                <div className="mt-auto d-flex justify-content-between">
                  <Button
                    variant="success"
                    size="sm"
                    onClick={() => addToCart(item)}
                    disabled={item.stock <= 0}
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
        <h4>🛒 Food Cart</h4>
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
                    <td><img src={item.image} alt={item.foodName} width={60} /></td>
                    <td>{item.foodName}</td>
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

export default Food;
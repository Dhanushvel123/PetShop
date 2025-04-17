import React, { useState, useEffect } from "react";
import Axios from "axios";
import {
  Card,
  Button,
  Row,
  Col,
  Container,
  Table,
  Form,
  Toast,
  ToastContainer,
  InputGroup,
} from "react-bootstrap";
import { FaHeart, FaShoppingCart, FaTrash, FaEdit, FaSave } from "react-icons/fa";
import "./Food.css";

const dummyFoods = [
  {
    image: "https://i.ibb.co/n84bT5rg/product-1.png",
    foodName: "Premium Kibble",
    description: "Tasty dry food",
    price: 12,
  },
  {
    image: "https://i.ibb.co/wh6rqMNJ/product-2.png",
    foodName: "Organic Cat Mix",
    description: "Healthy cat blend",
    price: 15,
  },
  {
    image: "https://i.ibb.co/WW9vKvkN/product-3.png",
    foodName: "Salmon Bites",
    description: "Savory salmon treats",
    price: 18,
  },
  {
    image: "https://i.ibb.co/pVFv4R3/product-4.png",
    foodName: "Chicken Delight",
    description: "Delicious chicken",
    price: 14,
  },
];

const getAuthHeader = () => ({
  headers: {
    Authorization: `Bearer ${localStorage.getItem("token")}`,
  },
});

function Food() {
  const [cart, setCart] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [editItem, setEditItem] = useState({ foodName: "" });
  const [searchTerm, setSearchTerm] = useState("");
  const [toast, setToast] = useState({ show: false, message: "", variant: "success" });

  useEffect(() => {
    Axios.get("http://localhost:3002/get", getAuthHeader())
      .then((res) => setCart(res.data))
      .catch((err) => console.error("Fetch cart error:", err.response?.data || err.message));
  }, []);

  const showToast = (message, variant = "success") => {
    setToast({ show: true, message, variant });
    setTimeout(() => setToast({ show: false, message: "", variant: "success" }), 3000);
  };

  const fetchCart = () => {
    Axios.get("http://localhost:3002/get", getAuthHeader())
      .then((res) => setCart(res.data))
      .catch((err) => showToast("Failed to fetch cart", "danger"));
  };

  const addFoodToCart = (food) => {
    const payload = { ...food };
    Axios.post("http://localhost:3002/insert", payload, getAuthHeader())
      .then(() => {
        fetchCart();
        showToast("Food added to cart!");
      })
      .catch(() => showToast("Add food failed", "danger"));
  };

  const deleteFoodFromCart = (id) => {
    Axios.delete(`http://localhost:3002/delete/${id}`, getAuthHeader())
      .then(() => {
        fetchCart();
        showToast("Food removed from cart");
      })
      .catch(() => showToast("Delete failed", "danger"));
  };

  const updateFoodName = (id) => {
    Axios.put("http://localhost:3002/update", { id, newFood: editItem.foodName }, getAuthHeader())
      .then(() => {
        fetchCart();
        setEditingId(null);
        setEditItem({ foodName: "" });
        showToast("Food name updated");
      })
      .catch(() => showToast("Update failed", "danger"));
  };

  const handleChange = (e) => {
    setEditItem({ foodName: e.target.value });
  };

  const filteredFoods = dummyFoods.filter((f) =>
    f.foodName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Container className="mt-5">
      <h2 className="text-center mb-4">🍖 Pet Food Store</h2>

      <InputGroup className="mb-4">
        <Form.Control
          type="text"
          placeholder="Search food by name..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </InputGroup>

      <Row className="g-4">
        {filteredFoods.length === 0 ? (
          <p>No foods found.</p>
        ) : (
          filteredFoods.map((food, idx) => (
            <Col key={idx} xs={12} sm={6} md={4} lg={3}>
              <Card className="h-100 shadow-lg border-0">
                <Card.Img variant="top" src={food.image} height={180} style={{ objectFit: "contain" }} />
                <Card.Body className="d-flex flex-column">
                  <Card.Title>{food.foodName}</Card.Title>
                  <Card.Text>{food.description}</Card.Text>
                  <Card.Text><strong>${food.price}</strong></Card.Text>
                  <div className="mt-auto d-flex justify-content-between">
                    <Button variant="success" size="sm" onClick={() => addFoodToCart(food)}>
                      <FaShoppingCart />
                    </Button>
                    <Button variant="outline-danger" size="sm">
                      <FaHeart />
                    </Button>
                  </div>
                </Card.Body>
              </Card>
            </Col>
          ))
        )}
      </Row>

      <div className="mt-5">
        <h4>🛒 Cart</h4>
        {cart.length === 0 ? (
          <p>No items in cart yet.</p>
        ) : (
          <Table responsive striped bordered hover>
            <thead>
              <tr>
                <th>Image</th>
                <th>Name</th>
                <th>Price</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {cart.map((item) => (
                <tr key={item._id}>
                  <td><img src={item.image} alt={item.foodName} width={60} /></td>
                  <td>
                    {editingId === item._id ? (
                      <Form.Control
                        type="text"
                        value={editItem.foodName}
                        onChange={handleChange}
                      />
                    ) : (
                      item.foodName
                    )}
                  </td>
                  <td>${item.price}</td>
                  <td>
                    {editingId === item._id ? (
                      <Button
                        variant="primary"
                        size="sm"
                        className="me-2"
                        onClick={() => updateFoodName(item._id)}
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
                          setEditItem({ foodName: item.foodName });
                        }}
                      >
                        <FaEdit />
                      </Button>
                    )}
                    <Button variant="danger" size="sm" onClick={() => deleteFoodFromCart(item._id)}>
                      <FaTrash />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        )}
      </div>

      <ToastContainer position="bottom-end" className="p-3">
        <Toast show={toast.show} bg={toast.variant} onClose={() => setToast({ ...toast, show: false })} delay={3000} autohide>
          <Toast.Body className="text-white">{toast.message}</Toast.Body>
        </Toast>
      </ToastContainer>
    </Container>
  );
}

export default Food;
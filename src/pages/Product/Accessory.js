import React, { useState, useEffect } from "react";
import Axios from "axios";
import { FaHeart, FaShoppingCart, FaTrash, FaEdit, FaSave } from "react-icons/fa";
import { ToastContainer, toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import "./Accessory.css"; // optional for custom styles
import { Container, Row, Col, Card, Button, Form, Table } from "react-bootstrap";

const dummyAccessories = [
  {
    accessoryName: "Pet Collar",
    description: "Adjustable nylon collar",
    price: 10,
    stockQuantity: 20,
    imageUrl: "https://i.ibb.co/21R2nV1M/petcollar.jpg"
  },
  {
    accessoryName: "Pet Bowl",
    description: "Stainless steel food bowl",
    price: 8,
    stockQuantity: 15,
    imageUrl: "https://i.ibb.co/NdxZGN8h/petbowl.jpg"
  },
  {
    accessoryName: "Pet Bed",
    description: "Cozy foam bed for pets",
    price: 30,
    stockQuantity: 10,
    imageUrl: "https://i.ibb.co/9m9TjKQb/petbed.jpg"
  },
  {
    accessoryName: "Pet Toy",
    description: "Rubber chew toy",
    price: 6,
    stockQuantity: 25,
    imageUrl: "https://i.ibb.co/yF4fk1R1/pettoy.jpg"
  }
];

const getAuthHeader = () => ({
  headers: {
    Authorization: `Bearer ${localStorage.getItem("token")}`,
  },
});

function Accessory() {
  const [cart, setCart] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [editItem, setEditItem] = useState({ accessoryName: "" });
  const [searchTerm, setSearchTerm] = useState("");

  const filteredAccessories = dummyAccessories.filter((item) =>
    item.accessoryName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const fetchCart = () => {
    Axios.get("http://localhost:3002/accessories/get", getAuthHeader())
      .then((res) => setCart(res.data))
      .catch((err) => toast.error("❌ Failed to fetch cart"));
  };

  useEffect(() => {
    fetchCart();
  }, []);

  const addToCart = (item) => {
    Axios.post("http://localhost:3002/accessories/insert", item, getAuthHeader())
      .then(() => {
        fetchCart();
        toast.success(`✅ Added ${item.accessoryName}`);
      })
      .catch(() => toast.error("❌ Add failed"));
  };

  const deleteFromCart = (id) => {
    Axios.delete(`http://localhost:3002/accessories/delete/${id}`, getAuthHeader())
      .then(() => {
        fetchCart();
        toast.info("🗑️ Removed item");
      })
      .catch(() => toast.error("❌ Delete failed"));
  };

  const updateName = (id) => {
    Axios.put("http://localhost:3002/accessories/update", { id, newName: editItem.accessoryName }, getAuthHeader())
      .then(() => {
        fetchCart();
        setEditingId(null);
        setEditItem({ accessoryName: "" });
        toast.success("✏️ Name updated");
      })
      .catch(() => toast.error("❌ Update failed"));
  };

  return (
    <Container className="mt-4">
      <ToastContainer />
      <h2 className="text-center mb-4">🎁 Pet Accessories</h2>

      {/* Search Bar */}
      <Form.Control
        type="text"
        placeholder="Search accessories..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="mb-4 shadow-sm"
      />

      {/* Cards */}
      <Row xs={1} sm={2} md={3} lg={4} className="g-4">
        {filteredAccessories.map((item, idx) => (
          <Col key={idx}>
            <Card className="shadow-sm h-100 rounded">
              <Card.Img
                variant="top"
                src={item.imageUrl}
                style={{ height: "180px", objectFit: "cover" }}
              />
              <Card.Body>
                <Card.Title>{item.accessoryName}</Card.Title>
                <Card.Text className="text-muted small">{item.description}</Card.Text>
                <p><strong>Price:</strong> ${item.price}</p>
                <p><strong>Stock:</strong> {item.stockQuantity}</p>
                <div className="d-flex gap-2">
                  <Button size="sm" variant="success" onClick={() => addToCart(item)}>
                    <FaShoppingCart />
                  </Button>
                  <Button size="sm" variant="outline-danger">
                    <FaHeart />
                  </Button>
                </div>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>

      {/* Cart Table */}
      <div className="mt-5">
        <h4>🛒 Accessory Cart</h4>
        {cart.length === 0 ? (
          <p>No accessories in cart yet.</p>
        ) : (
          <Table bordered responsive className="shadow-sm">
            <thead className="table-light">
              <tr>
                <th>Image</th>
                <th>Name</th>
                <th>Description</th>
                <th>Price</th>
                <th>Stock</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {cart.map((item) => (
                <tr key={item._id}>
                  <td>
                    <img src={item.imageUrl} alt={item.accessoryName} width="60" />
                  </td>
                  <td>
                    {editingId === item._id ? (
                      <Form.Control
                        type="text"
                        value={editItem.accessoryName}
                        onChange={(e) => setEditItem({ accessoryName: e.target.value })}
                      />
                    ) : (
                      item.accessoryName
                    )}
                  </td>
                  <td>{item.description}</td>
                  <td>${item.price}</td>
                  <td>{item.stockQuantity}</td>
                  <td>
                    {editingId === item._id ? (
                      <Button size="sm" variant="primary" onClick={() => updateName(item._id)} className="me-2">
                        <FaSave />
                      </Button>
                    ) : (
                      <Button
                        size="sm"
                        variant="warning"
                        onClick={() => {
                          setEditingId(item._id);
                          setEditItem({ accessoryName: item.accessoryName });
                        }}
                        className="me-2"
                      >
                        <FaEdit />
                      </Button>
                    )}
                    <Button size="sm" variant="danger" onClick={() => deleteFromCart(item._id)}>
                      <FaTrash />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        )}
      </div>
    </Container>
  );
}

export default Accessory;

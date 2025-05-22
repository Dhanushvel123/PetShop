import React, { useEffect, useState } from "react";
import {
  Container,
  Table,
  Button,
  Spinner,
  Alert,
  Row,
  Col,
  Badge,
  Form,
  Nav,
} from "react-bootstrap";
import API from "../utils/api";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Tooltip,
  Legend
);

function Admin() {
  const [isAuthenticated, setIsAuthenticated] = useState(
    localStorage.getItem("isAdminAuthenticated") === "true"
  );
  const [loginForm, setLoginForm] = useState({ username: "", password: "" });
  const [activeKey, setActiveKey] = useState("dashboard");
  const [orders, setOrders] = useState([]);
  const [users, setUsers] = useState([]);
  const [petFoods, setPetFoods] = useState([]);
  const [accessories, setAccessories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  useEffect(() => {
    if (!isAuthenticated) return;
    const fetchData = async () => {
      try {
        const [ordersRes, usersRes, petFoodsRes, accessoriesRes] =
          await Promise.all([
            API.get("/orders/admin"),
            API.get("/user/admin"),
            API.get("/petfoods/admin"),
            API.get("/accessories/admin"),
          ]);
        setOrders(ordersRes.data);
        setUsers(usersRes.data);
        setPetFoods(petFoodsRes.data);
        setAccessories(accessoriesRes.data);
      } catch (err) {
        console.error(err);
        setError("❌ Failed to load admin dashboard data.");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [isAuthenticated]);

  const handleLogin = () => {
    // Replace with real API call and validation in production
    const { username, password } = loginForm;
    if (username === "admin" && password === "admin123") {
      localStorage.setItem("isAdminAuthenticated", "true");
      setIsAuthenticated(true);
      setError("");
    } else {
      setError("❌ Invalid admin credentials");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("isAdminAuthenticated");
    setIsAuthenticated(false);
  };

  const updateOrderStatus = async (orderId, status) => {
    try {
      await API.put(`/orders/admin/${orderId}`, { status });
      setOrders((prev) =>
        prev.map((o) => (o._id === orderId ? { ...o, status } : o))
      );
      setSuccessMsg(`✅ Order marked as ${status}`);
      setTimeout(() => setSuccessMsg(""), 3000);
    } catch (err) {
      console.error(err);
      setError("❌ Failed to update order status.");
    }
  };

  const updateStock = async (id, type, stock) => {
    try {
      const endpoint = type === "petfood" ? `/petfoods/${id}` : `/accessories/${id}`;
      await API.put(endpoint, { stock });
      if (type === "petfood") {
        setPetFoods((prev) =>
          prev.map((item) => (item._id === id ? { ...item, stock } : item))
        );
      } else {
        setAccessories((prev) =>
          prev.map((item) =>
            item._id === id ? { ...item, stockQuantity: stock } : item
          )
        );
      }
      setSuccessMsg("✅ Stock updated successfully.");
      setTimeout(() => setSuccessMsg(""), 3000);
    } catch (err) {
      console.error(err);
      setError("❌ Failed to update stock.");
    }
  };

  const toggleUserRole = async (userId, currentRole) => {
    try {
      const newRole = !currentRole;
      await API.put(`/user/${userId}/role`, { isAdmin: newRole });
      setUsers((prev) =>
        prev.map((u) => (u._id === userId ? { ...u, isAdmin: newRole } : u))
      );
      setSuccessMsg(`✅ User role updated to ${newRole ? "Admin" : "User"}`);
      setTimeout(() => setSuccessMsg(""), 3000);
    } catch (err) {
      console.error(err);
      setError("❌ Failed to update user role.");
    }
  };

  const chartData = {
    labels: ["2016", "2017", "2018", "2019", "2020", "2021", "2022"],
    datasets: [
      {
        type: "bar",
        label: "Sales",
        backgroundColor: "rgba(54, 162, 235, 0.5)",
        data: [15, 30, 50, 60, 75, 90, 110],
      },
      {
        type: "line",
        label: "Revenue",
        borderColor: "rgba(255, 99, 132, 1)",
        backgroundColor: "rgba(255, 99, 132, 0.2)",
        data: [100, 140, 120, 180, 220, 210, 270],
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: "top",
      },
    },
    interaction: {
      mode: "nearest",
      axis: "x",
      intersect: false,
    },
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  };

  const renderDashboard = () => (
    <>
      <h4>📊 Admin Dashboard</h4>
      <Row className="mb-3 text-center">
        <Col><h6>👥 Users <Badge bg="info">{users.length}</Badge></h6></Col>
        <Col><h6>🍖 Pet Foods <Badge bg="success">{petFoods.length}</Badge></h6></Col>
        <Col><h6>🧸 Accessories <Badge bg="warning">{accessories.length}</Badge></h6></Col>
        <Col><h6>📦 Orders <Badge bg="dark">{orders.length}</Badge></h6></Col>
      </Row>
      <Bar data={chartData} options={chartOptions} />
    </>
  );

  const renderUsers = () => (
    <>
      <h4>👥 Users</h4>
      <Table striped bordered hover responsive>
        <thead>
          <tr>
            <th>ID</th>
            <th>Username</th>
            <th>Email</th>
            <th>Role</th>
            <th>Toggle</th>
          </tr>
        </thead>
        <tbody>
          {users.map((u) => (
            <tr key={u._id}>
              <td>{u._id}</td>
              <td>{u.username}</td>
              <td>{u.email}</td>
              <td>
                <Badge bg={u.isAdmin ? "success" : "secondary"}>
                  {u.isAdmin ? "Admin" : "User"}
                </Badge>
              </td>
              <td>
                <Button
                  size="sm"
                  variant={u.isAdmin ? "outline-danger" : "outline-primary"}
                  onClick={() => toggleUserRole(u._id, u.isAdmin)}
                >
                  Make {u.isAdmin ? "User" : "Admin"}
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </>
  );

  const renderOrders = () => (
    <>
      <h4>📦 Orders</h4>
      <Table striped bordered hover responsive>
        <thead>
          <tr>
            <th>Order ID</th>
            <th>User</th>
            <th>Items</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((order) => (
            <tr key={order._id}>
              <td>{order._id}</td>
              <td>{order.user?.username || "N/A"}</td>
              <td>
                <ul>
                  {order.items.map((item, i) => (
                    <li key={i}>{item.name} ({item.productType})</li>
                  ))}
                </ul>
              </td>
              <td>
                <Badge bg={
                  order.status === "Delivered" ? "success" :
                  order.status === "Cancelled" ? "danger" : "warning"
                }>
                  {order.status}
                </Badge>
              </td>
              <td>
                <Button
                  variant="success"
                  size="sm"
                  className="me-2"
                  onClick={() => updateOrderStatus(order._id, "Delivered")}
                  disabled={order.status === "Delivered"}
                >
                  Delivered
                </Button>
                <Button
                  variant="danger"
                  size="sm"
                  onClick={() => updateOrderStatus(order._id, "Cancelled")}
                  disabled={order.status === "Cancelled"}
                >
                  Cancel
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </>
  );

  const renderStockTable = (data, type) => (
    <>
      <h4>{type === "petfood" ? "🍖 Pet Foods" : "🧸 Accessories"}</h4>
      <Table striped bordered hover responsive>
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Price</th>
            <th>Stock</th>
            <th>Update Stock</th>
          </tr>
        </thead>
        <tbody>
          {data.map((item) => (
            <tr key={item._id}>
              <td>{item._id}</td>
              <td>{item.foodName || item.accessoryName}</td>
              <td>₹{item.price}</td>
              <td>{item.stock || item.stockQuantity}</td>
              <td>
                <Form
                  onSubmit={(e) => {
                    e.preventDefault();
                    const change = parseInt(e.target.stock.value, 10);
                    if (isNaN(change)) return;
                    const currentStock = item.stock || item.stockQuantity;
                    const newStock = currentStock + change;
                    if (newStock < 0) return;
                    updateStock(item._id, type, newStock);
                    e.target.reset();
                  }}
                  className="d-flex gap-2"
                >
                  <Form.Control
                    type="number"
                    name="stock"
                    min={-(item.stock || item.stockQuantity)}
                    placeholder="Adjust"
                    required
                  />
                  <Button type="submit" size="sm" variant="primary">Update</Button>
                </Form>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </>
  );

  const renderLoginForm = () => (
    <Container className="mt-5" style={{ maxWidth: "500px" }}>
      {error && <Alert variant="danger">{error}</Alert>}
      <h3 className="mb-4">🔐 Admin Login</h3>
      <Form
        onSubmit={(e) => {
          e.preventDefault();
          handleLogin();
        }}
      >
        <Form.Group className="mb-3">
          <Form.Label>Admin Username</Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter admin username"
            value={loginForm.username}
            onChange={(e) =>
              setLoginForm({ ...loginForm, username: e.target.value })
            }
            required
          />
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label>Admin Password</Form.Label>
          <Form.Control
            type="password"
            placeholder="Enter password"
            value={loginForm.password}
            onChange={(e) =>
              setLoginForm({ ...loginForm, password: e.target.value })
            }
            required
          />
        </Form.Group>
        <Button type="submit" variant="primary">
          Login
        </Button>
      </Form>
    </Container>
  );

  if (!isAuthenticated) {
    return renderLoginForm();
  }

  if (loading) {
    return (
      <Container className="text-center mt-5">
        <Spinner animation="border" />
      </Container>
    );
  }

  return (
    <Container className="mt-4">
      {error && <Alert variant="danger">{error}</Alert>}
      {successMsg && <Alert variant="success">{successMsg}</Alert>}
      <Row>
        <Col md={3}>
          <Nav variant="pills" className="flex-column">
            <Nav.Item><Nav.Link active={activeKey === "dashboard"} onClick={() => setActiveKey("dashboard")}>📊 Dashboard</Nav.Link></Nav.Item>
            <Nav.Item><Nav.Link active={activeKey === "users"} onClick={() => setActiveKey("users")}>👥 Users</Nav.Link></Nav.Item>
            <Nav.Item><Nav.Link active={activeKey === "orders"} onClick={() => setActiveKey("orders")}>📦 Orders</Nav.Link></Nav.Item>
            <Nav.Item><Nav.Link active={activeKey === "petfoods"} onClick={() => setActiveKey("petfoods")}>🍖 Pet Foods</Nav.Link></Nav.Item>
            <Nav.Item><Nav.Link active={activeKey === "accessories"} onClick={() => setActiveKey("accessories")}>🧸 Accessories</Nav.Link></Nav.Item>
            <Nav.Item><Nav.Link onClick={handleLogout}>🚪 Logout</Nav.Link></Nav.Item>
          </Nav>
        </Col>
        <Col md={9}>
          {activeKey === "dashboard" && renderDashboard()}
          {activeKey === "users" && renderUsers()}
          {activeKey === "orders" && renderOrders()}
          {activeKey === "petfoods" && renderStockTable(petFoods, "petfood")}
          {activeKey === "accessories" && renderStockTable(accessories, "accessory")}
        </Col>
      </Row>
    </Container>
  );
}

export default Admin;

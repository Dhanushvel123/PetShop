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
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  const fetchData = async () => {
    setLoading(true);
    try {
      const [ordersRes, usersRes, petFoodsRes, accessoriesRes] =
        await Promise.all([
          API.get("/orders/admin"),
          API.get("/user/admin/users"),
          API.get("/petfoods/admin"),
          API.get("/accessories/admin"),
        ]);
      setOrders(ordersRes.data || []);
      setUsers(usersRes.data || []);
      setPetFoods(petFoodsRes.data || []);
      setAccessories(accessoriesRes.data || []);
      setError("");
    } catch (err) {
      console.error("Fetch Error:", err);
      setError("❌ Failed to load admin dashboard data.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      fetchData();
    }
  }, [isAuthenticated]);

  const handleLogin = () => {
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
    setOrders([]);
    setUsers([]);
    setPetFoods([]);
    setAccessories([]);
    setActiveKey("dashboard");
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
            value={loginForm.username}
            onChange={(e) =>
              setLoginForm({ ...loginForm, username: e.target.value })
            }
            required
          />
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label>Password</Form.Label>
          <Form.Control
            type="password"
            value={loginForm.password}
            onChange={(e) =>
              setLoginForm({ ...loginForm, password: e.target.value })
            }
            required
          />
        </Form.Group>
        <Button type="submit">Login</Button>
      </Form>
    </Container>
  );

  const renderUsers = () => (
    <>
      <h4>👥 Users</h4>
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>Email</th>
            <th>Username</th>
            <th>Admin Role</th>
            <th>Toggle Role</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user._id}>
              <td>{user.email}</td>
              <td>{user.username}</td>
              <td>{user.isAdmin ? "Yes" : "No"}</td>
              <td>
                <Button
                  variant="warning"
                  onClick={() => toggleUserRole(user._id, user.isAdmin)}
                >
                  Toggle
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
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>Order ID</th>
            <th>User</th>
            <th>Total</th>
            <th>Status</th>
            <th>Mark Delivered</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((order) => (
            <tr key={order._id}>
              <td>{order._id}</td>
              <td>{order.user?.username || "N/A"}</td>
              <td>₹{order.total}</td>
              <td>{order.status}</td>
              <td>
                {order.status !== "Delivered" && (
                  <Button
                    variant="success"
                    onClick={() => updateOrderStatus(order._id, "Delivered")}
                  >
                    Deliver
                  </Button>
                )}
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
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>Name</th>
            <th>Stock</th>
            <th>Update</th>
          </tr>
        </thead>
        <tbody>
          {data.map((item) => (
            <tr key={item._id}>
              <td>{item.name}</td>
              <td>{type === "petfood" ? item.stock : item.stockQuantity}</td>
              <td>
                <Form
                  onSubmit={(e) => {
                    e.preventDefault();
                    const stock = e.target.elements.stock.value;
                    updateStock(item._id, type, stock);
                  }}
                >
                  <Form.Control
                    type="number"
                    name="stock"
                    defaultValue={
                      type === "petfood" ? item.stock : item.stockQuantity
                    }
                    style={{ width: "100px", display: "inline-block", marginRight: "5px" }}
                  />
                  <Button type="submit" size="sm">Update</Button>
                </Form>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </>
  );

  if (!isAuthenticated) return renderLoginForm();

  return (
    <Container className="mt-4">
      {loading ? (
        <div className="text-center">
          <Spinner animation="border" />
          <p>Loading admin dashboard...</p>
        </div>
      ) : (
        <>
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
              {activeKey === "dashboard" && (
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
              )}
              {activeKey === "users" && renderUsers()}
              {activeKey === "orders" && renderOrders()}
              {activeKey === "petfoods" && renderStockTable(petFoods, "petfood")}
              {activeKey === "accessories" && renderStockTable(accessories, "accessory")}
            </Col>
          </Row>
        </>
      )}
    </Container>
  );
}

export default Admin;

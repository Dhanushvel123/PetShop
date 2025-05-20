import React, { useEffect, useState } from "react";
import {
  Container,
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
  const [activeKey, setActiveKey] = useState("dashboard");
  const [orders, setOrders] = useState([]);
  const [users, setUsers] = useState([]);
  const [petFoods, setPetFoods] = useState([]);
  const [accessories, setAccessories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loginUsername, setLoginUsername] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [loginError, setLoginError] = useState("");

  const handleLogin = (e) => {
    e.preventDefault();
    if (loginUsername.trim() && loginPassword === "admin123") {
      setIsAuthenticated(true);
      setLoginError("");
    } else {
      setLoginError("Invalid username or password.");
    }
  };

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
        setError("Failed to load admin dashboard data.");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [isAuthenticated]);

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
      legend: { position: "top" },
      tooltip: { mode: "index", intersect: false },
    },
    interaction: {
      mode: "nearest",
      axis: "x",
      intersect: false,
    },
    scales: {
      y: { beginAtZero: true },
    },
  };

  const renderUsers = () => (
    <>
      <h4>👥 Users</h4>
      <ul>
        {users.map((user) => (
          <li key={user._id}>{user.name || user.username || "Unnamed User"}</li>
        ))}
      </ul>
    </>
  );

  const renderOrders = () => (
    <>
      <h4>📦 Orders</h4>
      <ul>
        {orders.map((order) => (
          <li key={order._id}>Order ID: {order._id} | Status: {order.status}</li>
        ))}
      </ul>
    </>
  );

  const renderPetFoods = () => (
    <>
      <h4>🍖 Pet Foods</h4>
      <ul>
        {petFoods.map((item) => (
          <li key={item._id}>{item.name} - Stock: {item.stock}</li>
        ))}
      </ul>
    </>
  );

  const renderAccessories = () => (
    <>
      <h4>🧸 Accessories</h4>
      <ul>
        {accessories.map((item) => (
          <li key={item._id}>{item.name} - Stock: {item.stockQuantity}</li>
        ))}
      </ul>
    </>
  );

  if (!isAuthenticated) {
    return (
      <Container className="mt-5" style={{ maxWidth: 400 }}>
        <h3 className="mb-3">🔐 Admin Login</h3>
        {loginError && <Alert variant="danger">{loginError}</Alert>}
        <Form onSubmit={handleLogin}>
          <Form.Group className="mb-3" controlId="adminUsername">
            <Form.Label>Username</Form.Label>
            <Form.Control
              type="text"
              value={loginUsername}
              onChange={(e) => setLoginUsername(e.target.value)}
              required
            />
          </Form.Group>
          <Form.Group className="mb-3" controlId="adminPassword">
            <Form.Label>Password</Form.Label>
            <Form.Control
              type="password"
              value={loginPassword}
              onChange={(e) => setLoginPassword(e.target.value)}
              required
            />
          </Form.Group>
          <Button type="submit" variant="primary">
            Login
          </Button>
        </Form>
      </Container>
    );
  }

  if (loading)
    return (
      <Container className="mt-5 text-center">
        <Spinner animation="border" />
      </Container>
    );

  return (
    <Container className="mt-4">
      {error && <Alert variant="danger">{error}</Alert>}
      {successMsg && <Alert variant="success">{successMsg}</Alert>}
      <Row>
        <Col md={3} className="border-end">
          <Nav variant="pills" className="flex-column">
            <Nav.Item>
              <Nav.Link
                eventKey="dashboard"
                active={activeKey === "dashboard"}
                onClick={() => setActiveKey("dashboard")}
              >
                📊 Dashboard
              </Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link
                eventKey="users"
                active={activeKey === "users"}
                onClick={() => setActiveKey("users")}
              >
                👥 Users
              </Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link
                eventKey="orders"
                active={activeKey === "orders"}
                onClick={() => setActiveKey("orders")}
              >
                📦 Orders
              </Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link
                eventKey="petfoods"
                active={activeKey === "petfoods"}
                onClick={() => setActiveKey("petfoods")}
              >
                🍖 Pet Foods
              </Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link
                eventKey="accessories"
                active={activeKey === "accessories"}
                onClick={() => setActiveKey("accessories")}
              >
                🧸 Accessories
              </Nav.Link>
            </Nav.Item>
          </Nav>
        </Col>
        <Col md={9}>
          {activeKey === "dashboard" && (
            <>
              <h4>📊 Dashboard</h4>
              <Row className="mb-4">
                <Col>
                  <h5>
                    Total Users: <Badge bg="info">{users.length}</Badge>
                  </h5>
                </Col>
                <Col>
                  <h5>
                    Total Pet Foods: <Badge bg="success">{petFoods.length}</Badge>
                  </h5>
                </Col>
                <Col>
                  <h5>
                    Total Accessories: <Badge bg="warning">{accessories.length}</Badge>
                  </h5>
                </Col>
                <Col>
                  <h5>
                    Total Orders: <Badge bg="dark">{orders.length}</Badge>
                  </h5>
                </Col>
              </Row>
              <Row className="mb-4">
                <Col>
                  <h5>📈 Sales & Revenue</h5>
                  <Bar data={chartData} options={chartOptions} />
                </Col>
              </Row>
            </>
          )}
          {activeKey === "users" && renderUsers()}
          {activeKey === "orders" && renderOrders()}
          {activeKey === "petfoods" && renderPetFoods()}
          {activeKey === "accessories" && renderAccessories()}
        </Col>
      </Row>
    </Container>
  );
}

export default Admin;

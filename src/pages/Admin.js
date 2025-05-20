import React, { useEffect, useState } from "react";
import {
  Container,
  Table,
  Button,
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
  const [error, setError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(
    localStorage.getItem("isAdminAuthenticated") === "true"
  );
  const [loginForm, setLoginForm] = useState({ username: "", password: "" });

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
      }
    };

    fetchData();
  }, [isAuthenticated]);

  const handleLogin = () => {
    const { username, password } = loginForm;
    if (!username || !password) {
      setError("Both fields are required.");
      return;
    }

    // NOTE: In real apps, fetch the user securely from backend
    API.get("/user/admin")
      .then((res) => {
        const user = res.data.find((u) => u.username === username && u.isAdmin);
        if (!user) {
          setError("Invalid admin username.");
        } else if (password !== "admin123") {
          setError("Invalid admin password.");
        } else {
          localStorage.setItem("isAdminAuthenticated", "true");
          setIsAuthenticated(true);
          setError("");
        }
      })
      .catch((err) => {
        console.error(err);
        setError("Login failed.");
      });
  };

  const updateOrderStatus = async (orderId, status) => {
    try {
      await API.put(`/orders/admin/${orderId}`, { status });
      setOrders((prev) =>
        prev.map((o) => (o._id === orderId ? { ...o, status } : o))
      );
      setSuccessMsg(`Order marked as ${status}`);
      setTimeout(() => setSuccessMsg(""), 3000);
    } catch (err) {
      console.error(err);
      setError("Failed to update order status.");
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

      setSuccessMsg("Stock updated successfully.");
      setTimeout(() => setSuccessMsg(""), 3000);
    } catch (err) {
      console.error(err);
      setError("Failed to update stock.");
    }
  };

  const toggleUserRole = async (userId, currentRole) => {
    try {
      const newRole = !currentRole;
      await API.put(`/user/${userId}/role`, { isAdmin: newRole });
      setUsers((prev) =>
        prev.map((u) => (u._id === userId ? { ...u, isAdmin: newRole } : u))
      );
      setSuccessMsg(`User role updated to ${newRole ? "Admin" : "User"}`);
      setTimeout(() => setSuccessMsg(""), 3000);
    } catch (err) {
      console.error(err);
      setError("Failed to update user role.");
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
      legend: { position: "top" },
      tooltip: { mode: "index", intersect: false },
    },
    interaction: { mode: "nearest", axis: "x", intersect: false },
    scales: { y: { beginAtZero: true } },
  };

  const renderUsers = () => (
    <>
      <h4>👥 Users List</h4>
      <Table striped bordered hover responsive>
        <thead>
          <tr>
            <th>User ID</th>
            <th>Username</th>
            <th>Email</th>
            <th>Role</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user._id}>
              <td>{user._id}</td>
              <td>{user.username}</td>
              <td>{user.email}</td>
              <td>
                <Badge bg={user.isAdmin ? "success" : "secondary"}>
                  {user.isAdmin ? "Admin" : "User"}
                </Badge>
              </td>
              <td>
                <Button
                  size="sm"
                  variant={user.isAdmin ? "outline-danger" : "outline-primary"}
                  onClick={() => toggleUserRole(user._id, user.isAdmin)}
                >
                  Make {user.isAdmin ? "User" : "Admin"}
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
      <h4>📋 Orders Management</h4>
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
                  {order.items.map((item, idx) => (
                    <li key={idx}>
                      {item.name} ({item.productType})
                    </li>
                  ))}
                </ul>
              </td>
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
                  Mark as Delivered
                </Button>
                <Button
                  variant="danger"
                  size="sm"
                  onClick={() => updateOrderStatus(order._id, "Cancelled")}
                  disabled={order.status === "Cancelled"}
                >
                  Cancel Order
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </>
  );

  const renderPetFoods = () => (
    <>
      <h4>🍖 Pet Foods List</h4>
      <Table striped bordered hover responsive>
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Price</th>
            <th>Stock</th>
            <th>Update</th>
          </tr>
        </thead>
        <tbody>
          {petFoods.map((food) => (
            <tr key={food._id}>
              <td>{food._id}</td>
              <td>{food.foodName}</td>
              <td>₹{food.price}</td>
              <td>{food.stock}</td>
              <td>
                <Form
                  onSubmit={(e) => {
                    e.preventDefault();
                    const stockChange = parseInt(e.target.stock.value, 10);
                    if (isNaN(stockChange)) return;
                    const updatedStock = food.stock + stockChange;
                    if (updatedStock < 0) return;
                    updateStock(food._id, "petfood", updatedStock);
                    e.target.reset();
                  }}
                  className="d-flex gap-2"
                >
                  <Form.Control
                    name="stock"
                    type="number"
                    placeholder="Stock"
                    required
                    min={-food.stock}
                  />
                  <Button type="submit" size="sm" variant="primary">
                    Update
                  </Button>
                </Form>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </>
  );

  const renderAccessories = () => (
    <>
      <h4>🧸 Accessories List</h4>
      <Table striped bordered hover responsive>
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Price</th>
            <th>Stock</th>
            <th>Update</th>
          </tr>
        </thead>
        <tbody>
          {accessories.map((acc) => (
            <tr key={acc._id}>
              <td>{acc._id}</td>
              <td>{acc.accessoryName}</td>
              <td>₹{acc.price}</td>
              <td>{acc.stockQuantity}</td>
              <td>
                <Form
                  onSubmit={(e) => {
                    e.preventDefault();
                    const stockChange = parseInt(e.target.stock.value, 10);
                    if (isNaN(stockChange)) return;
                    const updatedStock = acc.stockQuantity + stockChange;
                    if (updatedStock < 0) return;
                    updateStock(acc._id, "accessory", updatedStock);
                    e.target.reset();
                  }}
                  className="d-flex gap-2"
                >
                  <Form.Control
                    name="stock"
                    type="number"
                    placeholder="Stock"
                    required
                    min={-acc.stockQuantity}
                  />
                  <Button type="submit" size="sm" variant="primary">
                    Update
                  </Button>
                </Form>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </>
  );

  const renderContent = () => {
    switch (activeKey) {
      case "users":
        return renderUsers();
      case "orders":
        return renderOrders();
      case "petfoods":
        return renderPetFoods();
      case "accessories":
        return renderAccessories();
      default:
        return (
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
                  Total Accessories:{" "}
                  <Badge bg="warning">{accessories.length}</Badge>
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
                <h5>📊 Sales & Revenue (Dashboard)</h5>
                <Bar data={chartData} options={chartOptions} />
              </Col>
            </Row>
          </>
        );
    }
  };

  if (!isAuthenticated) {
    return (
      <Container className="mt-5">
        {error && <Alert variant="danger">{error}</Alert>}
        <h3>🔐 Admin Login</h3>
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
            <Form.Label>Admin Password</Form.Label>
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
  }

  return (
    <Container className="mt-4">
      {error && <Alert variant="danger">{error}</Alert>}
      {successMsg && <Alert variant="success">{successMsg}</Alert>}
      <Row>
        <Col md={3} className="border-end">
          <Nav variant="pills" className="flex-column">
            {["dashboard", "users", "orders", "petfoods", "accessories"].map((key) => (
              <Nav.Item key={key}>
                <Nav.Link
                  eventKey={key}
                  active={activeKey === key}
                  onClick={() => setActiveKey(key)}
                >
                  {key === "dashboard" && "📊 Dashboard"}
                  {key === "users" && "👥 Users"}
                  {key === "orders" && "📦 Orders"}
                  {key === "petfoods" && "🍖 Pet Foods"}
                  {key === "accessories" && "🧸 Accessories"}
                </Nav.Link>
              </Nav.Item>
            ))}
          </Nav>
        </Col>
        <Col md={9}>{renderContent()}</Col>
      </Row>
    </Container>
  );
}

export default Admin;

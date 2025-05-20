import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../utils/api";
import {
  Container,
  Card,
  Spinner,
  Alert,
  Button,
  Form,
  Row,
  Col,
  Image,
  Badge,
} from "react-bootstrap";

function UserProfile() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isEditingUsername, setIsEditingUsername] = useState(false);
  const [newUsername, setNewUsername] = useState("");
  const [orderStats, setOrderStats] = useState({ food: 0, accessory: 0 });

  const [isAdminPasswordVisible, setIsAdminPasswordVisible] = useState(false);
  const [adminPassword, setAdminPassword] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      setError("User not authenticated. Please sign in.");
      setLoading(false);
      return;
    }

    const fetchData = async () => {
      try {
        const config = { headers: { Authorization: `Bearer ${token}` } };

        const [profileRes, orderRes] = await Promise.all([
          API.get("/profile", config),
          API.get("/orders", config),
        ]);

        setUser(profileRes.data);
        setNewUsername(profileRes.data.username || "");

        const orders = orderRes.data || [];
        const foodOrders = orders.filter((order) =>
          order.items.some((item) => item.productType === "food")
        );
        const accOrders = orders.filter((order) =>
          order.items.some((item) => item.productType === "accessory")
        );

        setOrderStats({
          food: foodOrders.length,
          accessory: accOrders.length,
        });

        setError("");
      } catch (err) {
        console.error(err);
        setError("Failed to load user profile.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleUsernameSave = async () => {
    if (!newUsername.trim()) {
      return setError("Username cannot be empty.");
    }
    try {
      const token = localStorage.getItem("token");
      const config = { headers: { Authorization: `Bearer ${token}` } };

      await API.put("/profile", { username: newUsername }, config);
      setUser({ ...user, username: newUsername });
      setIsEditingUsername(false);
      setError("");
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || "Failed to update username.");
    }
  };

  const handleBecomeAdmin = async () => {
    if (!adminPassword.trim()) {
      setError("Admin password is required.");
      return;
    }

    try {
      const token = localStorage.getItem("token");
      const config = { headers: { Authorization: `Bearer ${token}` } };

      await API.put("/profile", { isAdmin: true, adminPassword }, config);
      setUser({ ...user, isAdmin: true });
      setIsAdminPasswordVisible(false);
      setAdminPassword("");
      setError("");
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || "Failed to update user type.");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  const handleGoToAdmin = () => {
    if (user && user.isAdmin) {
      navigate("/admin");
    } else {
      setError("Access denied: Admins only.");
    }
  };

  if (loading) {
    return (
      <Container className="mt-5 text-center">
        <Spinner animation="border" variant="primary" />
        <p>Loading profile...</p>
      </Container>
    );
  }

  return (
    <Container className="mt-5">
      {error && <Alert variant="danger">{error}</Alert>}

      {user && (
        <Card className="p-4 shadow-lg">
          <Row className="align-items-center mb-4">
            <Col xs={12} md={3} className="text-center mb-3 mb-md-0">
              <Image
                src={`https://ui-avatars.com/api/?name=${user.username}&background=random`}
                roundedCircle
                width={120}
                height={120}
              />
            </Col>
            <Col md={9}>
              <h4 className="mb-2">👤 My Profile</h4>
              <p>
                <strong>Username:</strong>{" "}
                {isEditingUsername ? (
                  <Form.Control
                    type="text"
                    value={newUsername}
                    onChange={(e) => setNewUsername(e.target.value)}
                    className="w-50 d-inline-block"
                  />
                ) : (
                  user.username
                )}
              </p>
              <p>
                <strong>User Type:</strong>{" "}
                <Badge bg={user.isAdmin ? "success" : "secondary"}>
                  {user.isAdmin ? "Admin" : "User"}
                </Badge>
              </p>

              {isEditingUsername ? (
                <div className="mt-2 d-flex gap-2">
                  <Button variant="success" onClick={handleUsernameSave}>
                    Save
                  </Button>
                  <Button
                    variant="secondary"
                    onClick={() => setIsEditingUsername(false)}
                  >
                    Cancel
                  </Button>
                </div>
              ) : (
                <Button
                  variant="outline-primary"
                  onClick={() => setIsEditingUsername(true)}
                >
                  ✏️ Edit Username
                </Button>
              )}

              {!user.isAdmin && !isAdminPasswordVisible && (
                <div className="mt-3">
                  <Button
                    variant="warning"
                    onClick={() => {
                      setError("");
                      setIsAdminPasswordVisible(true);
                    }}
                  >
                    🔒 Become Admin
                  </Button>
                </div>
              )}

              {isAdminPasswordVisible && (
                <Form
                  onSubmit={(e) => {
                    e.preventDefault();
                    handleBecomeAdmin();
                  }}
                  className="mt-3 d-flex gap-2 align-items-center w-50"
                >
                  <Form.Control
                    type="password"
                    placeholder="Enter admin password"
                    value={adminPassword}
                    onChange={(e) => setAdminPassword(e.target.value)}
                    autoFocus
                    required
                  />
                  <Button type="submit" variant="success">
                    Confirm
                  </Button>
                  <Button
                    variant="secondary"
                    onClick={() => {
                      setIsAdminPasswordVisible(false);
                      setAdminPassword("");
                      setError("");
                    }}
                  >
                    Cancel
                  </Button>
                </Form>
              )}
            </Col>
          </Row>

          <hr />

          <h5>📦 My Orders</h5>
          <p>
            <strong>Pet Food Orders:</strong> {orderStats.food}
          </p>
          <p>
            <strong>Accessory Orders:</strong> {orderStats.accessory}
          </p>

          {user.isAdmin && (
            <div className="mt-3">
              <Button variant="dark" onClick={handleGoToAdmin}>
                🔧 Go to Admin Dashboard
              </Button>
            </div>
          )}

          <hr />
          <div className="text-end">
            <Button variant="outline-danger" onClick={handleLogout}>
              🔓 Logout
            </Button>
          </div>
        </Card>
      )}
    </Container>
  );
}

export default UserProfile;

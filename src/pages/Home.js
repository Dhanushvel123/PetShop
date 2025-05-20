import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import hero from "../assets/images/hero.jpg";
import dog1 from "../../src/assets/images/blog-1.jpg";
import dog2 from "../../src/assets/images/blog-2.jpg";
import { jwtDecode } from "jwt-decode"; // Correct import

function Home() {
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");

    // If no token exists, navigate to the signin page
    if (!token) {
      navigate("/signin");
    } else {
      try {
        // Decode the token to check if it's valid
        const decodedToken = jwtDecode(token); // Correct usage of jwtDecode
        
        // Check if the token is expired
        if (decodedToken.exp * 1000 < Date.now()) {
          localStorage.removeItem("token");
          navigate("/signin");
        }

        console.log(decodedToken); // You can log or use decodedToken for user info validation
      } catch (error) {
        // If decoding fails, remove the token and navigate to signin
        localStorage.removeItem("token");
        navigate("/signin");
      }
    }
  }, [navigate]);

  const handleExploreClick = () => {
    navigate("/petfood");
  };

  return (
    <>
      {/* Hero Section */}
      <div
        className="home-container"
        style={{
          height: "100vh",
          width: "100%",
          backgroundImage: `url(${hero})`,
          backgroundRepeat: "no-repeat",
          backgroundSize: "cover",
          backgroundPosition: "center",
          display: "flex",
          alignItems: "center",
          justifyContent: "flex-start",
          color: "white",
          textShadow: "1px 1px 4px rgba(0,0,0,0.5)",
          paddingLeft: "5%",
        }}
      >
        <div
          style={{
            backgroundColor: "rgba(0, 0, 0, 0.4)",
            padding: "2rem",
            borderRadius: "10px",
            maxWidth: "500px",
          }}
        >
          <h1 style={{ fontSize: "3rem", fontWeight: "bold" }}>PET SHOP</h1>
          <h4 style={{ fontWeight: "bold", marginBottom: "1rem" }}>
            MAKE YOUR PETS HAPPY
          </h4>
          <p style={{ marginBottom: "2rem" }}>
            Dolore tempor cillq lorem rebum kasd elirmod dolore diam eos kasd.
            Kasd clita ea justo est sed kasd erat clita erat.
          </p>
          <div style={{ display: "flex", gap: "1rem", alignItems: "center" }}>
            <button className="btn btn-outline-light" onClick={handleExploreClick}>
              Shop Now
            </button>
            <button
              className="btn btn-light"
              style={{
                display: "flex",
                alignItems: "center",
                gap: "0.5rem",
              }}
            >
              ▶️ Play Video
            </button>
          </div>
        </div>
      </div>

      {/* Blog Section */}
      <div style={{ padding: "4rem 8%", backgroundColor: "#fff" }}>
        <div style={{ borderLeft: "4px solid green", paddingLeft: "1rem" }}>
          <h6 style={{ color: "green", fontWeight: "bold" }}>LATEST BLOG</h6>
          <h2 style={{ fontWeight: "bold", marginBottom: "2rem" }}>
            LATEST ARTICLES FROM OUR BLOG POST
          </h2>
        </div>

        <div
          style={{
            display: "flex",
            gap: "2rem",
            flexWrap: "wrap",
            justifyContent: "space-between",
          }}
        >
          {[dog1, dog2].map((imgSrc, idx) => (
            <div
              key={idx}
              style={{
                display: "flex",
                backgroundColor: "#f9f9f9",
                borderRadius: "8px",
                overflow: "hidden",
                flex: "1 1 45%",
                boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
              }}
            >
              <img
                src={imgSrc}
                alt="blog-dog"
                style={{ width: "40%", objectFit: "cover" }}
              />
              <div style={{ padding: "1.5rem" }}>
                <div
                  style={{
                    fontSize: "0.9rem",
                    color: "#888",
                    verticalAlign: "middle",
                  }}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    fill="currentColor"
                    className="bi bi-bookmark"
                    viewBox="0 0 16 16"
                  >
                    <path d="M2 2a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v13.5a.5.5 0 0 1-.777.416L8 13.101l-5.223 2.815A.5.5 0 0 1 2 15.5zm2-1a1 1 0 0 0-1 1v12.566l4.723-2.482a.5.5 0 0 1 .554 0L13 14.566V2a1 1 0 0 0-1-1z" />
                  </svg>{" "}
                  Web Design &nbsp;&nbsp;&nbsp;
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    fill="currentColor"
                    className="bi bi-calendar3"
                    viewBox="0 0 16 16"
                  >
                    <path d="M14 0H2a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2M1 3.857C1 3.384 1.448 3 2 3h12c.552 0 1 .384 1 .857v10.286c0 .473-.448.857-1 .857H2c-.552 0-1-.384-1-.857z" />
                    <path d="M6.5 7a1 1 0 1 0 0-2 1 1 0 0 0 0 2m3 0a1 1 0 1 0 0-2 1 1 0 0 0 0 2m3 0a1 1 0 1 0 0-2 1 1 0 0 0 0 2m-9 3a1 1 0 1 0 0-2 1 1 0 0 0 0 2m3 0a1 1 0 1 0 0-2 1 1 0 0 0 0 2m3 0a1 1 0 1 0 0-2 1 1 0 0 0 0 2m3 0a1 1 0 1 0 0-2 1 1 0 0 0 0 2m-9 3a1 1 0 1 0 0-2 1 1 0 0 0 0 2m3 0a1 1 0 1 0 0-2 1 1 0 0 0 0 2m3 0a1 1 0 1 0 0-2 1 1 0 0 0 0 2" />
                  </svg>{" "}
                  01 Jan, 2045
                </div>
                <h5 style={{ fontWeight: "bold", margin: "0.5rem 0" }}>
                  DOLOR SIT MAGNA REBUM CLITA REBUM DOLOR
                </h5>
                <p style={{ fontSize: "0.9rem", color: "#555" }}>
                  Ipsum sed lorem amet dolor amet duo ipsum amet et dolore est
                  stet tempor eos dolor
                </p>
                <div
                  style={{
                    marginTop: "1rem",
                    color: "green",
                    fontWeight: "bold",
                    cursor: "pointer",
                  }}
                >
                  READ MORE ➜
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

export default Home;
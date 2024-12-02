import React from "react";
import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import { Link, useNavigate } from "react-router-dom";
import styles from "./header.module.css";

function Header() {
  const navigate = useNavigate();
  const serializedState = sessionStorage.getItem("myStateKey");
  const myState = JSON.parse(serializedState);
  let isAdmin = false;
  let role = false;
  let isLoged = false;
  if (myState !== null) {
    role = myState.role === "seller";
    isAdmin = myState.isAdmin === 1;
    isLoged = true;
  }

  function logout() {
    sessionStorage.removeItem("myStateKey");
    navigate("/");
  }
  return (
    <div>
      <Navbar bg="dark" variant="dark" expand="lg">
        <Container className="mr-5">
          <Navbar.Brand as={Link} to="/">
            <img
              src="images/logo4.jpg"
              alt="logo"
              style={{
                width: "80px",
                borderRadius: "50%",
                objectFit: "cover",
              }}
            />
          </Navbar.Brand>

          <Navbar.Toggle aria-controls="navbar-nav" />

          <Navbar.Collapse id="navbar-nav">
            <Nav className="me-auto">
              <Nav.Link as={Link} to="/" className={styles.link}>
                Home
              </Nav.Link>
              {isLoged && <Nav.Link as={Link} to="/cart" className={styles.link}>
                Cart
              </Nav.Link>}
              {isLoged && <Nav.Link as={Link} to="/profile" className={styles.link}>
                Profile
              </Nav.Link>}
              {!isLoged && (
                <Nav.Link as={Link} to="/login" className={styles.link}>
                  Login
                </Nav.Link>
              )}
              {role && (
                <Nav.Link as={Link} to="/seller" className={styles.link}>
                  Seller
                </Nav.Link>
              )}
              {isAdmin && (
                <Nav.Link as={Link} to="/admin" className={styles.link}>
                  Admin
                </Nav.Link>
              )}
              {isLoged && (
                <Nav.Link onClick={logout} className={styles.link}>
                  Logout
                </Nav.Link>
              )}
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    </div>
  );
}

export default Header;

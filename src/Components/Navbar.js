import React from "react";
import { useSelector } from "react-redux";
import { Outlet, Link } from "react-router-dom";

function Navbar({ loggedIn, setLoggedIn }) {
  const cartNotification = useSelector((state) => state.list.cartNotification);
  const wishlistNotification = useSelector(
    (state) => state.list.wishlistNotification
  );

  const handleLogout = () => {
    setLoggedIn(false);
  };

  return (
    <div className="body-navbar">
      <ul className="nav-links">
        <div className="left-buttons">
          <li>
            <Link to="/" className="nav-buttons">
              Home
            </Link>
          </li>
          <li className="center">
            <Link to="/products" className="nav-buttons">
              Products
            </Link>
          </li>
        </div>
        <div className="right-buttons">
          <div className="nav-icon">
            {loggedIn && (
              <li style={{ position: "relative" }}>
                <Link to="/cart" className="nav-buttons">
                  <i className="fa fa-shopping-cart"></i>
                </Link>
                <div className="cart-dot">{cartNotification}</div>
              </li>
            )}
          </div>
          <div className="nav-icon">
            {loggedIn && (
              <li style={{ position: "relative" }}>
                <Link to="/wishlist" className="nav-buttons">
                  <i class="fa-solid fa-heart"></i>
                </Link>
                <div className="wishlist-dot">{wishlistNotification}</div>
              </li>
            )}
          </div>
          <div className="nav-icon">
            {loggedIn && (
              <li style={{ position: "relative" }}>
                <Link className="nav-buttons">
                  <i className="fa fa-user"></i>
                  <i
                    className="fa-solid fa-caret-down"
                    style={{ fontSize: "15px" }}
                  ></i>
                </Link>
              </li>
            )}
          </div>
        </div>
      </ul>

      <Outlet />
    </div>
  );
}

export default Navbar;

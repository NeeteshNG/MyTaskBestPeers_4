import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { removeFromWishlist } from "../Redux/listSlice";
import { useState } from "react";
import ProductDetails from "./ProductDetails";

function Wishlist() {
  const wishlist = useSelector((state) => state.list.wishlist);
  const dispatch = useDispatch();

  const [showModal, setShowModal] = useState(false);
  const [selected, setSelected] = useState(null);

  const handleToggle = (product) => {
    setSelected(product);
    setShowModal(!showModal);
  };

  const removeItem = (product) => {
    dispatch(removeFromWishlist(product));
  };

  return (
    <div className="wishlist-body">
      <div className="wishlist-container">
        <h1 className="wishlist-title">Wishlist</h1>
        {wishlist.length > 0 ? (
          <div className="wishlist-items">
            {wishlist.map((product) => (
              <div key={product.id} className="wishlist-item" onClick={() => handleToggle(product)}>
                <img
                  src={product.image}
                  alt={product.name}
                  className="wishlist-item-image"
                />
                <div className="wishlist-item-details">
                  <h2 className="wishlist-item-name">{product.name}</h2>
                  <p className="wishlist-item-description">
                    {product.description.slice(0, 60)}
                  </p>
                  <p className="wishlist-item-price">
                    Price: {product.price}/-
                  </p>
                </div>
                <button
                  onClick={() => removeItem(product)}
                  className="wishlist-item-remove-button"
                >
                  <i class="gg-remove"></i>
                </button>
              </div>
            ))}
            {showModal && (
              <ProductDetails
                product={selected}
                onClose={() => handleToggle(null)}
              />
            )}
          </div>
        ) : (
          <p className="empty-wishlist-message">Your wishlist is empty.</p>
        )}
      </div>
    </div>
  );
}

export default Wishlist;

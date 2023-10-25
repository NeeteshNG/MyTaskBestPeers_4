import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { removeFromCart } from "../Redux/listSlice";
import { useState } from "react";
import ProductDetails from "./ProductDetails"

function Cart() {
  const cart = useSelector((state) => state.list.cart);
  const dispatch = useDispatch();

  const [showModal, setShowModal] = useState(false)
  const [selected, setSelected] = useState(null)

  const handleToggle = (product) => {
    setSelected(product);
    setShowModal(!showModal);
  }

  const removeItem = (product) => {
    dispatch(removeFromCart(product));
  };

  const totalAmount = cart.reduce((total, product) => total + product.price, 0);
  return (
    <div className="cart-body">
      <div className="cart-container">
        <h1>CART</h1>
        {cart.map((product) => (
          <div key={product.id} className="cart-item" onClick={() => handleToggle(product)}>
            <img
              src={product.image}
              alt={product.name}
              className="cart-item-image"
            />
            <div className="cart-item-details">
              <h2 className="cart-item-name">{product.name}</h2>
              <p className="cart-item-description">{product.description.slice(0,60)}</p>
              <p className="cart-item-price">Price: {product.price}/-</p>
            </div>
            <button
              onClick={() => removeItem(product)}
              className="cart-item-remove-button"
            >
              <i className="fa fa-trash-o"></i>
            </button>
          </div>
        ))}
        {showModal && <ProductDetails product={selected} onClose={() => handleToggle(null)}/>}
        <h2 className="total-amount">Total: {totalAmount}/-</h2>
        <button className="checkout-button">Checkout</button>
      </div>
    </div>
  );
}

export default Cart;

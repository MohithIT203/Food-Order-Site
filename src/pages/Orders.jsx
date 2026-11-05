import { useDispatch, useSelector } from "react-redux";
import { createSelector } from "@reduxjs/toolkit";
import { cancelOrder, updateStatus } from "../store/orders";
import ConfirmDialog from "../components/ConfirmDialog";
import "../styles/orders.css";
import toast from "react-hot-toast";
import { useState } from "react";
import { FaShoppingBag, FaVoicemail } from "react-icons/fa";
// import amountFormatting from "../utils/format";

const STATUS_STEPS = ["Placed", "Preparing", "Delivered"];

const selectOrders = (email, role) =>
  createSelector(
    (state) => state.orders.orders,
    (orders) => {
      const allOrders = Array.isArray(orders) ? orders : [];
      return role === "customer"
        ? allOrders.filter((o) => o.email === email)
        : allOrders;
    },
  );

function OrderProgress({ status }) {
  const current = STATUS_STEPS.indexOf(status);
  const isCompleted = status === "Delivered";

  return (
    <div className="order-progress">
      {STATUS_STEPS.map((step, i) => (
        <div
          key={step}
          className={`progress-step ${i <= current ? "done" : ""} ${i === current && !isCompleted ? "current" : ""}`}
        >
          <div className="step-dot">{i <= current ? "✓" : ""}</div>
          <span className="step-label">{step}</span>
        </div>
      ))}
    </div>
  );
}

function Orders() {
  const dispatch = useDispatch();
  const[isopen,setIsopen] = useState(false);
  const[deleteId,setDeleteId] = useState(null);
  const { email, role } = JSON.parse(localStorage.getItem("currentUser"));
  const orders = useSelector(selectOrders(email, role));

  function advanceStatus(orderId, currentStatus) {
    const next = STATUS_STEPS[STATUS_STEPS.indexOf(currentStatus) + 1];
    if (next) dispatch(updateStatus({ orderId, status: next }));
    toast.success("Order Status Updated!")
  }

  function handleConfirm(orderId){
    setIsopen(true);
    setDeleteId(orderId);
  }
  function handleCancelOrder() {
    if(deleteId===null) return;
    dispatch(cancelOrder(deleteId));
    setIsopen(false);
    toast.success("Order Cancelled!")
  }
  
  if (orders.length === 0)
    return (
      <div className="orders-page">
        <div className="orders-empty">
          <div className="orders-empty-icon"><FaShoppingBag color=""/></div>
          <p>No orders yet. Go grab some food!</p>
        </div>
      </div>
    );

  return (
    <div className="orders-page">
      <h2 className="orders-heading">
        {role === "admin" ? "All Orders" : "Your Orders"}
      </h2>
      {[...orders].reverse().map((order) => (
        <div key={order.orderId} className="order-card">
          <div className="order-header">
            <span className="order-id">#{order.orderId.slice(0, 8)}</span>
            {role === "admin" && (
              <span className="order-email">📧 {order.email}</span>
            )}
            <span className="order-date">
              {new Date(order.placedAt).toLocaleDateString()}
            </span>
            <span
              className={`order-status status-${order.status.toLowerCase()}`}
            >
              {order.status}
            </span>
          </div>

          <OrderProgress status={order.status} />

          <div className="order-items">
            {order.items.map((item) => (
              <div key={item.id} className="order-item">
                {item.image ? (
                  <img
                    className="item-image"
                    src={item.image}
                    alt={item.itemName}
                  />
                ) : (
                  <img className="item-image"src="https://media.istockphoto.com/id/1198380802/vector/food-background-vegetables-seamless-pattern-healthy-eating-tomato-garlic-carrot-pepper.jpg?s=612x612&w=0&k=20&c=jHB3uTWZrakPyAgqSQfOApxSq_jIwHRx00LiOV2YHEk=" alt={item.itemName} />
                )}
                <div className="item-info">
                  <div className="item-name">{item.itemName}</div>
                  <div className="item-unit-price">₹{item.price} each</div>
                </div>
                <span className="item-qty">x{item.quantity}</span>
                <span className="item-price">
                  ₹{(item.price * item.quantity).toFixed(2)}
                </span>
              </div>
            ))}
          </div>

          <div className="order-footer">
            <div className="order-total">
              Total: <span>₹{order.totalPrice.toFixed(2)}</span>
             
            </div>
            <div>
              {role === "customer" &&
                order.status !== "Delivered" &&
                order.status !== "Cancelled" && (
                  <button
                    className="advance-btn"
                    onClick={() => handleConfirm(order.orderId)}
                  >
                    Cancel Order
                  </button>
                )}
            </div>

            {role === "admin" && order.status !== "Delivered" && order.status !== "Cancelled" && (
              <button
                className="advance-btn"
                onClick={() => advanceStatus(order.orderId, order.status)}
              >
                Mark as {STATUS_STEPS[STATUS_STEPS.indexOf(order.status) + 1]}
              </button>
            )}
          </div>
        </div>
      ))}
      <ConfirmDialog
        open={isopen}
        message="⚠️This action cannot be undone!"
        onClose={() => setIsopen(false)}
        onConfirm={handleCancelOrder}
      />
    </div>
  );
}

export default Orders;

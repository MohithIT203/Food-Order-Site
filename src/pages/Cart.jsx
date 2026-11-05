import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import CartItem from "../components/CartItem";
import amountFormatting from "../utils/format";
import { ordersSlice } from "../store/orders";
import { cartSlice } from "../store/cart";
import toast from "react-hot-toast";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";
import { FaChevronDown, FaChevronUp } from "react-icons/fa";

function Cart() {
  const cartItems = useSelector((state) => state.cart.items) || [];
  const dispatch = useDispatch();
  const { username, email } = JSON.parse(localStorage.getItem("currentUser"));
  const [showAnimation, setShowAnimation] = useState(false);
  const [coupon, setCoupon] = useState("");
  const [discount, setDiscount] = useState(0);
  const [dropdown, setDropdown] = useState(true);
  const totalAmount = cartItems.reduce(
    (total, items) => total + items.quantity * items.price,
    0,
  );

  function handleCheckout() {
    if (cartItems.length === 0) return;
    dispatch(ordersSlice.actions.placeOrder({ email, items: cartItems }));

    setShowAnimation(true);
    setTimeout(() => {
      toast.success("Items Ordered Successfully!");
      dispatch(cartSlice.actions.clearCart(email));
      setShowAnimation(false);
    }, 4000);
  }

  function validateCoupon() {
    if (!coupon || !coupon.trim()) {
      toast.error("Please enter a coupon code");
      return;
    }

    const availableCoupons = JSON.parse(localStorage.getItem("coupons")) || [];

    const matched = availableCoupons.find(
      (c) => c.code.trim().toLowerCase() === coupon.trim().toLowerCase(),
    );

    if (!matched) {
      toast.error("Invalid coupon code");
      return;
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const expiry = new Date(matched.expiry);
    if (expiry < today) {
      toast.error("This coupon has expired");
      return;
    }

    const minOrder = parseFloat(matched.minOrder) || 0;
    if (totalAmount < minOrder) {
      toast.error(
        `Minimum order value of ${amountFormatting.format(minOrder)} required for this coupon`,
      );
      return;
    }

    if (discount > 0) {
      toast.error("A coupon is already applied");
      return;
    }

    const couponValue = parseFloat(matched.value) || 0;

    if (matched.type === "percentage") {
      const percent = Math.min(couponValue, 100);
      const discountAmount = (totalAmount * percent) / 100;
      setDiscount(discountAmount);
      toast.success(`${percent}% discount applied!`);
    } else if (matched.type === "flat") {
      const discountAmount = Math.min(couponValue, totalAmount);
      setDiscount(discountAmount);
      toast.success(
        `${amountFormatting.format(discountAmount)} discount applied!`,
      );
    } else {
      toast.error("Unknown coupon type");
    }
  }

  function handleRemoveCoupon() {}
  return (
    <>
      {showAnimation && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background: "rgba(255,255,255,0.85)",
            zIndex: 9999,
          }}
        >
          <DotLottieReact
            src="https://lottie.host/f9a5d434-81d6-4b57-b899-83bab31bb1d2/RMLo7hTLHG.lottie"
            loop
            autoplay
            style={{ width: 400, height: 400 }}
          />
        </div>
      )}

      <h2 style={{ padding: "10px" }}>My Cart</h2>
      {/* <h2>My Cart</h2> */}
      <div className="cart-page">
        <div className="cart-page-items">
          {cartItems.length === 0 && (
            <p className="cart-item-card">No items in Cart!</p>
          )}
          {cartItems.map((item) => (
            <CartItem key={item.id} item={item} />
          ))}
        </div>
        {cartItems.length > 0 && (
          <div className="order-summary">
            <h2 className="summary">Order Summary</h2>

            <div className="order-coupon">
              <div
                className="order-coupon-toggle"
                onClick={() => setDropdown(!dropdown)}
              >
                {/* <label>Have a coupon?</label> */}
                <label></label>
                <span>{dropdown ? <FaChevronUp /> : <FaChevronDown />}</span>
              </div>

              {/* {dropdown && (
                <div className="order-coupon-row">
                  <input
                    type="text"
                    placeholder="Enter a valid coupon"
                    value={coupon}
                    onChange={(e) => setCoupon(e.target.value)}
                    // readOnly={discount>0}
                  />
                  {discount > 0 && (
                    <button type="button" onClick={handleRemoveCoupon}>
                      Remove
                    </button>
                  )}
                  {discount == 0 && (
                    <button type="button" onClick={validateCoupon}>
                      Apply
                    </button>
                  )}
                </div>
              )} */}
            </div>

            {!dropdown && (
              <>
                <hr className="summary-divider" />
                <div className="price-row total">
                  <span>Total</span>
                  <span>{amountFormatting.format(totalAmount - discount)}</span>
                </div>
              </>
            )}

            {dropdown && (
              <>
                <hr className="summary-divider" />
                <div className="price-row">
                  <span className="subtotal">Subtotal</span>
                  <span>{amountFormatting.format(totalAmount)}</span>
                </div>
                <div className="price-row discount">
                  <span className="discount">Discount</span>
                  <span>-{amountFormatting.format(discount)}</span>
                </div>
                <hr className="summary-divider" />
                <div className="price-row total">
                  <span className="total">Total</span>
                  <span>{amountFormatting.format(totalAmount - discount)}</span>
                </div>
              </>
            )}

            <button className="button" onClick={handleCheckout}>
              Checkout
            </button>
          </div>
        )}
      </div>
    </>
  );
}

export default Cart;

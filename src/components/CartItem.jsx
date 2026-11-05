import { useDispatch } from "react-redux";
import { cartSlice } from "../store/cart";
import amountFormatting from "../utils/format";
import "../styles/cart.css";
import toast from "react-hot-toast";
import { useState } from "react";
import ConfirmDialog from "./ConfirmDialog";

function CartItem({ item }) {
  const[isopen,setIsopen] = useState(false);
  const dispatch = useDispatch();
  // const { email } = JSON.parse(localStorage.getItem("currentUser")) || "";

  function handleConfirm(){
    setIsopen(true);
  }
  
  function handleAddQuantity() {
    dispatch(cartSlice.actions.addItem(item));
  }

  function handleRemoveQuantity() {
    dispatch(cartSlice.actions.removeItem(item.id));
  }

  function handleRemove() {  
    dispatch(cartSlice.actions.deleteItem(item.id));
    toast.success("Item Removed!");
  }

  return (
    <div className="cart-item-card">
      {!item.image &&<img src="https://media.istockphoto.com/id/1198380802/vector/food-background-vegetables-seamless-pattern-healthy-eating-tomato-garlic-carrot-pepper.jpg?s=612x612&w=0&k=20&c=jHB3uTWZrakPyAgqSQfOApxSq_jIwHRx00LiOV2YHEk=" alt={item.itemName} />
}
      {item.image && <img src={item.image} alt={item.itemName} />}
      <div className="cart-item-content">
        <div className="cart-item-top">
          <div>
            <h3>{item.itemName}</h3>
            <span className="category">{item.category}</span>
          </div>
          <span className="price">{amountFormatting.format(item.price)}</span>
        </div>

        <p className="desc">{item.description}</p>

        <div className="cart-item-bottom">
          <div className="quantity-control">
            <button onClick={handleRemoveQuantity}>-</button>
            <span>{item.quantity}</span>
            <button onClick={handleAddQuantity}>+</button>
          </div>
          <button className="remove-btn" onClick={handleConfirm}>
            Remove
          </button>
        </div>
        <div className="price">
          Total Amount :{" "}
          {amountFormatting.format(Number(item.quantity * item.price))}
        </div>
      </div>
      <ConfirmDialog
        open={isopen}
        message="This actions removes the item from cart"
        onClose={() => setIsopen(false)}
        onConfirm={handleRemove}
      />
    </div>
  );
}

export default CartItem;

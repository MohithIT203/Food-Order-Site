import "../styles/home.css";
import { cartSlice, modalSlice } from "../store/cart";
import { useSelector, useDispatch } from "react-redux";
import amountFormatting from "../utils/format";
import { useEffect, useState } from "react";

import toast from "react-hot-toast";

function FoodItems({ item, role,onDelete }) {
  const dispatch = useDispatch();
  const { email } = JSON.parse(localStorage.getItem("currentUser")) || "";
  const cartItems = useSelector((state) => state.cart.items);
  const isInCart = cartItems.some((cartItem) => cartItem.id === item.id);
  const [userrole] = useState(role ? role : "customer");
  
  // console.log(JSON.stringify(cartItems));

  function handleAdd() {
    dispatch(cartSlice.actions.addItem(item));
    toast.success("Item Added to Cart!");
  }
  function handleEdit() {
    dispatch(modalSlice.actions.openEditModal(item)); 
  }
  
  const cartItem = cartItems.find((ci) => ci.id === item.id);

  return (
    <div key={item.id} className="food-card">
      {!item.image &&<img src="https://media.istockphoto.com/id/1198380802/vector/food-background-vegetables-seamless-pattern-healthy-eating-tomato-garlic-carrot-pepper.jpg?s=612x612&w=0&k=20&c=jHB3uTWZrakPyAgqSQfOApxSq_jIwHRx00LiOV2YHEk=" alt={item.name} />
}
      {item.image && <img src={item.image} alt={item.name} />}
      <h3>{item.name}</h3>
      <p className="desc">{item.description}</p>

      <div className="card-footer">
        <span className="price">{amountFormatting.format(item.price)}</span>
        <span className="category">{item.category}</span>
      </div>

      {isInCart ? (
        <div className="quantity-control">
          {/* <div></div> */}
          <button
            onClick={() => dispatch(cartSlice.actions.removeItem(item.id))}
          >
            -
          </button>
          <span>{cartItem?.quantity}</span>
          <button onClick={() => dispatch(cartSlice.actions.addItem(item))}>
            +
          </button>
          <span className="in-cart">In cart</span>
        </div>
      ) : (
        <button
          className="add-btn"
          onClick={userrole === "admin" ? handleEdit : handleAdd}
        >
          {userrole === "admin" ? "Edit Item" : "Add to Cart"}
        </button>
      )}
      {userrole === "admin" && (
        <button className="del-btn" onClick={()=>onDelete(item.id)}>
          Remove Item
        </button>
      )}
      
    </div>
  );
}

export default FoodItems;

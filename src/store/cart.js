import { createSlice, configureStore } from "@reduxjs/toolkit";
import { themeSlice } from "./theme";
import { ordersSlice } from "./orders";
import userSlice from "./user";

const loadState = () => {
  try {
    const userData = localStorage.getItem("currentUser");
    if (!userData) return undefined;
    const user = JSON.parse(userData);

    if (!user?.email) return undefined;
    const cartsData = localStorage.getItem("carts");

    const allCarts = cartsData ? JSON.parse(cartsData) : {};

    const userCart = allCarts[user.email];

    if (!userCart) return undefined;

    return {
      cart: {
        items: userCart,
      },
    };
  } catch (err) {
    console.log("Load error:", err);
    return undefined;
  }
};


const saveState = (state) => {
  try {
    const userData = localStorage.getItem("currentUser");
    if (!userData) return;

    const user = JSON.parse(userData);
    if (!user?.email) return;

    let allCarts = {};

    try {
      const cartsData = localStorage.getItem("carts");
      allCarts = cartsData ? JSON.parse(cartsData) : {};
    } catch (err) {
      console.log("Corrupted carts detected. Resetting...");
      allCarts = {};
    }

    allCarts[user.email] = state.cart.items;

    localStorage.setItem("carts", JSON.stringify(allCarts));
  } catch (err) {
    console.log("Save error:", err);
  }
};

export const cartSlice = createSlice({
  name: "cart",
  initialState: {
    items: [],
  },
  reducers: {
    addItem(state, action) {
      const newItem = action.payload;
      const existingItem = state.items.findIndex(
        (item) => item.id === action.payload.id,
      );
      if (existingItem !== -1) {
        state.items[existingItem].quantity++;
      } else {
        state.items.push({
          id: newItem.id,
          itemName: newItem.name,
          description: newItem.description,
          category: newItem.category,
          image: newItem.image,
          price: newItem.price,
          quantity: 1,
        });
      }
    },
    removeItem(state, action) {
      const id = action.payload;

      const existingItemIndex = state.items.findIndex((item) => item.id === id);

      if (existingItemIndex !== -1) {
        const item = state.items[existingItemIndex];

        if (item.quantity === 1) {
          state.items.splice(existingItemIndex, 1);
        } else {
          item.quantity -= 1;
        }
      }
    },
    deleteItem(state, action) {
      const id = action.payload;
      const existingItemIndex = state.items.findIndex((item) => item.id === id);

      if (existingItemIndex !== -1) {
        const item = state.items[existingItemIndex];
        state.items.splice(existingItemIndex, 1);
      }
    },
    clearCart: (state, action) => {
      const email = action.payload;
      state.items = [];
    },
    loadCart: (state, action) => {
      state.items = action.payload;
    },
  },
});


export const modalSlice = createSlice({
  name: "modal",
  initialState: {
    modalState: "",
    selectedItem: null,
  },
  reducers: {
    openAddModal(state) {
      state.modalState = "add-item";
      state.selectedItem = null;
    },
    openEditModal(state, action) {
      state.modalState = "edit-item";
      state.selectedItem = action.payload;
    },
    closeModal(state) {
      state.modalState = "";
      state.selectedItem = null;
    },
  },
});


const store = configureStore({
  reducer: {
    cart: cartSlice.reducer,
    modal: modalSlice.reducer,
    theme: themeSlice.reducer,
    orders: ordersSlice.reducer,
  },
  preloadedState: loadState(),
});

store.subscribe(() => {
  saveState(store.getState());
});

export default store;

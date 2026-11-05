import { createSlice } from "@reduxjs/toolkit";

const loadOrders = () => {
  const stored = localStorage.getItem("orders");
  return stored ? JSON.parse(stored) : [];
};

// const preloaded = loadOrders();
// console.log("preloaded state :", preloaded);

const saveOrders = (orders) => {
  localStorage.setItem("orders", JSON.stringify(orders));
};

export const ordersSlice = createSlice({
  name: "currOrders",
  initialState: {
    orders: loadOrders(),
  },
  reducers: {
    placeOrder: (state, action) => {
      const newOrder = {
        orderId: crypto.randomUUID(),
        email: action.payload.email,
        items: action.payload.items,
        totalPrice: action.payload.items.reduce(
          (sum, item) => sum + item.price * item.quantity,
          0,
        ),
        status: "Placed",
        placedAt: new Date().toISOString(),
      };
      state.orders.push(newOrder);
      saveOrders(state.orders);
    },

    updateStatus: (state, action) => {
      const order = state.orders.find(
        (o) => o.orderId === action.payload.orderId,
      );
      if (order) order.status = action.payload.status;
      saveOrders(state.orders);
    },

    clearUserOrders: (state, action) => {
      state.orders = state.orders.filter((o) => o.email !== action.payload);
      saveOrders(state.orders);
    },

    cancelOrder: (state, action) => {
      const order = state.orders.find((o) => o.orderId === action.payload);
      if (order) {
        order.status = "Cancelled";
      }
      saveOrders(state.orders);
    },
  },
});

export const { placeOrder, updateStatus, clearUserOrders,cancelOrder } =
  ordersSlice.actions;
export default ordersSlice.reducer;

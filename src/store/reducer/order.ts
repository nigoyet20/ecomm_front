import { createSlice } from '@reduxjs/toolkit';
import { actionCheckSignin, actionCheckToken } from "../thunks/checkLogin";
import { OrderStateI } from "../../@types/order";
import { actionAddToOrder } from "../thunks/checkOrder";

export const initialState: OrderStateI = {
  orders: [],
  orderInput: {
    total: '',
    productsOrder: [],
    command_number: '',
    delivery_address: null,
    created_at: '',
  }
};

const orderSlice = createSlice({
  name: 'order',
  initialState,
  reducers: {
    actionChangeInput: (state, action) => {
      state.orderInput = { ...state.orderInput, ...action.payload };
    },
  },
  extraReducers: (builder) => {
    builder.addCase(actionCheckToken.fulfilled, (state, action) => {
      state.orders = action.payload.data.order;
    });
    builder.addCase(actionCheckSignin.fulfilled, (state, action) => {
      state.orders = action.payload.data.order;
    });
    builder.addCase(actionAddToOrder.fulfilled, (state, action) => {
      state.orders = action.payload.orders;
    });
  }
})

export const { actionChangeInput } = orderSlice.actions;
export default orderSlice.reducer;

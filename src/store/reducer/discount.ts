import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { DiscountStateI } from "../../@types/discount";
import { actionCheckDiscount, actionCheckOneDiscount, actionDeleteDiscount } from "../thunks/checkDiscount";
import { escapeHtml } from "../../utils/escapeHtml";
import { changeInputDiscountPayload } from "../../@types/payload";
import { actionCheckSignin, actionCheckToken } from "../thunks/checkLogin";

export const initialState: DiscountStateI = {
  discounts: [],
  discountApplied: false,
  input: {
    code: '',
    discount: ''
  }
};

const discountSlice = createSlice({
  name: 'discount',
  initialState,
  reducers: {
    actionChangeInput: (state, action: PayloadAction<changeInputDiscountPayload>) => {
      const { name, value } = action.payload;
      state.input[name] = escapeHtml(value);
    },
  },
  extraReducers: (builder) => {
    builder.addCase(actionCheckDiscount.fulfilled, (state, action) => {
      state.discounts = action.payload;
    });
    builder.addCase(actionCheckOneDiscount.fulfilled, (state, action) => {
      state.discounts = action.payload;
      state.discountApplied = true;
    });
    builder.addCase(actionDeleteDiscount.fulfilled, (state, action) => {
      state.discounts = action.payload;
    });
    builder.addCase(actionCheckSignin.fulfilled, (state, action) => {
      state.discounts = action.payload.data.discounts;
    });
    builder.addCase(actionCheckToken.fulfilled, (state, action) => {
      state.discounts = action.payload.data.discounts;
    });
  }
})


export const { actionChangeInput } = discountSlice.actions;
export default discountSlice.reducer;

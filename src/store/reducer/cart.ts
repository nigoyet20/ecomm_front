import { createSlice } from '@reduxjs/toolkit';
import { ProductInCartI } from '../../@types/product';
import { CartStateI } from '../../@types/cart';
import { escapeHtml } from "../../utils/escapeHtml";
import { actionAddToCart, actionDeleteOneFromCart, actionGetCart } from "../thunks/checkCart";
import { actionCheckSignin, actionCheckToken } from "../thunks/checkLogin";
import { actionCheckOneDiscount } from "../thunks/checkDiscount";
import { actionAddToOrder } from "../thunks/checkOrder";

export const initialState: CartStateI = {
  cartVisitor: [],
  cartConnected: [],
};

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    actionCheckCart: (state, action) => {
      state.cartConnected = action.payload.cartConnected;
    },
    actionCheckCartOffline: (state, action) => {
      state.cartVisitor = action.payload;
    },
    actionAddToCartOffline: (state, action) => {
      const ls = JSON.parse(localStorage.getItem('cartVisitor') || '[]');
      ls.push(action.payload);
      state.cartVisitor = ls;
      localStorage.setItem('cartVisitor', JSON.stringify(ls));
    },
    actionDeleteFromCartOffline: (state, action) => {
      const ls = JSON.parse(localStorage.getItem('cartVisitor') || '[]');
      if (ls.length === 0)
        return;
      const newCart = ls.filter((_: ProductInCartI, index: number) => index !== action.payload);
      state.cartVisitor = newCart;
      localStorage.setItem('cartVisitor', JSON.stringify(newCart));
    },
  },
  extraReducers: (builder) => {
    builder.addCase(actionGetCart.fulfilled, (state, action) => {
      const cart = action.payload.productCarts;

      const escapedCart = cart.map((product: ProductInCartI) => ({
        name: escapeHtml(product.product.name),
        description: escapeHtml(product.product.description),
        prices: product.product.Prices[0],
        image_url: product.product.image_url[product.color],
        color_name: product.product.color_name[product.color],
        color_code: product.product.color_code[product.color],
      }));
      state.cartConnected = escapedCart;
    });
    builder.addCase(actionCheckToken.fulfilled, (state, action) => {
      const ls = JSON.parse(localStorage.getItem('cartVisitor') || '[]');
      if (!ls || ls.length === 0)
        state.cartConnected = action.payload.data.cart.productsCart;
      else
        state.cartConnected = action.payload.data.cart.productsCart.concat(ls);
    });
    builder.addCase(actionCheckSignin.fulfilled, (state, action) => {
      if (!action.payload.data.cart || action.payload.data.cart.productsCart.length === 0)
        state.cartConnected = [];
      else state.cartConnected = action.payload.data.cart.productsCart;
      localStorage.removeItem('cartVisitor');
    });
    builder.addCase(actionAddToCart.fulfilled, (state, action) => {
      state.cartConnected = action.payload.productCarts;
    });
    builder.addCase(actionDeleteOneFromCart.fulfilled, (state, action) => {
      if (action.payload.productCarts)
        state.cartConnected = action.payload.productCarts;
      else state.cartConnected = [];
    });
    builder.addCase(actionCheckOneDiscount.fulfilled, (state, action) => {
      state.cartConnected = action.payload;
    });
    builder.addCase(actionAddToOrder.fulfilled, (state) => {
      state.cartConnected = [];
    });
  }
})

export const { actionCheckCart, actionCheckCartOffline, actionAddToCartOffline, actionDeleteFromCartOffline } = cartSlice.actions;
export default cartSlice.reducer;

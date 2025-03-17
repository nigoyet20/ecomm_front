import { createSlice } from '@reduxjs/toolkit';
import { actionCheckProduct } from '../thunks/checkProduct';
import { ProductI, ProductStateI } from '../../@types/product';
import { escapeHtml } from "../../utils/escapeHtml";

export const initialState: ProductStateI = {
  list: [],
  stateProduct: ["Imparfait", "Correct", "Très bon", "Parfait", "Neuf"],
  stockageProduct: ["64Go", "128Go", "256Go", "512Go", "1To"],
  getAllProductsPending: true
};

const productSlice = createSlice({
  name: 'product',
  initialState,
  reducers: {
  },
  extraReducers: (builder) => {
    builder.addCase(actionCheckProduct.fulfilled, (state, action) => {
      const products = action.payload;
      if (products && products.length !== 0) {
        const escapedProducts = products.map((product: ProductI) => ({
          ...product,
          name: escapeHtml(product.name),
          description: escapeHtml(product.description),
          brand: product.brand ? escapeHtml(product.brand) : null,
          Prices: product.Prices.map((price) => ({
            ...price,
            state: escapeHtml(price.state),
            stockage: escapeHtml(price.stockage),
          })),
          image_url: product.image_url.map((url) => escapeHtml(url)),
          color_name: product.color_name.map((color) => escapeHtml(color)),
          color_code: product.color_code.map((color) => escapeHtml(color)),
          Reviews: product.Reviews.map((review) => ({
            ...review,
            comment: escapeHtml(review.comment),
            author: escapeHtml(review.author),
            date: escapeHtml(review.date),
          })),
        }));
        state.getAllProductsPending = false;
        state.list = escapedProducts;
      } else console.log("no products")
      
    });
    // builder.addCase(actionGetOneProduct.fulfilled, (state, action) => {
    //   state.productSelected = action.payload;
    // });
  }
})

// export const {  } = productSlice.actions;
export default productSlice.reducer;

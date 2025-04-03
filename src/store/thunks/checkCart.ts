import { createAsyncThunk } from '@reduxjs/toolkit';
import { AxiosError } from 'axios';
import axiosInstance from '../../axios/axios';
import { actionAddToCartPayloadI } from "../../@types/cart";
import { actionAddRemovetoCartPayload, RejectPayload } from "../../@types/payload";
import { checkTokenExpiration } from "../../utils/checkTokenExpiration";

const actionGetCart = createAsyncThunk(
  'product/GET_CART',
  async (_, thunkAPI) => {
    try {
      const response = await axiosInstance.get('/cart');
      return response.data;
    } catch (error) {
      const axiosError = error as AxiosError;
      return thunkAPI.rejectWithValue(axiosError.response?.data);
    }
  }
);

const actionAddToCart = createAsyncThunk<actionAddRemovetoCartPayload, actionAddToCartPayloadI, { rejectValue: RejectPayload }>(
  'product/ADD_TO_CART',
  async (payload, thunkAPI) => {
    try {
      if (checkTokenExpiration() === false)
        return thunkAPI.rejectWithValue({ tokenExpired: true });

      const response = await axiosInstance.post('/cart', payload);
      return response.data;
    } catch (error) {
      const axiosError = error as AxiosError;
      return thunkAPI.rejectWithValue(axiosError.response?.data as RejectPayload);
    }
  }
);

const actionDeleteOneFromCart = createAsyncThunk<actionAddRemovetoCartPayload, number, { rejectValue: RejectPayload }>(
  'product/DELETE_ONE_FROM_CART',
  async (payload, thunkAPI) => {
    try {
      if (checkTokenExpiration() === false)
        return thunkAPI.rejectWithValue({ tokenExpired: true });

      const response = await axiosInstance.delete(`/cart/${payload}`);

      return response.data;
    } catch (error) {
      const axiosError = error as AxiosError;
      return thunkAPI.rejectWithValue(axiosError.response?.data as RejectPayload);
    }
  }
);

export { actionGetCart, actionAddToCart, actionDeleteOneFromCart };

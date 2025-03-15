import { createAsyncThunk } from '@reduxjs/toolkit';
import { AxiosError } from 'axios';
import axiosInstance from '../../axios/axios';
import { changeCheckOneDiscountPayload, changeInputDiscountPayload, DisountI } from "../../@types/discount";
import { RejectPayload } from "../../@types/payload";

const actionCheckDiscount = createAsyncThunk<DisountI[], changeInputDiscountPayload, { rejectValue: RejectPayload }>(
  'product/CHECK_DISCOUNT',
  async (payload, thunkAPI) => {
    try {
      let discountConverted = payload.discount;
      let isPercentage = false;
      if (discountConverted.includes('%')) {
        discountConverted = payload.discount.replace('%', '');
        isPercentage = true;
      }

      const response = await axiosInstance.post('/discount', {
        code: payload.code,
        discount: parseInt(payload.discount),
        isPercentage: isPercentage,
        productIds: payload.products
      });

      return response.data;
    } catch (error) {
      const axiosError = error as AxiosError;
      return thunkAPI.rejectWithValue(axiosError.response?.data as RejectPayload);
    }
  }
);

const actionCheckOneDiscount = createAsyncThunk<DisountI[], changeCheckOneDiscountPayload, { rejectValue: RejectPayload }>(
  'product/CHECK_ONE_DISCOUNT',
  async (payload, thunkAPI) => {
    try {
      const { code, accountId } = payload;

      const response = await axiosInstance.post('/discount-check', {
        code,
        accountId
      });

      return response.data.cart;
    } catch (error) {
      const axiosError = error as AxiosError;
      return thunkAPI.rejectWithValue(axiosError.response?.data as RejectPayload);
    }
  }
);

const actionDeleteDiscount = createAsyncThunk<DisountI[], number, { rejectValue: RejectPayload }>(
  'product/DELETE_DISCOUNT',
  async (payload, thunkAPI) => {
    try {
      const response = await axiosInstance.delete(`/discount/${payload}`);

      return response.data;
    } catch (error) {
      const axiosError = error as AxiosError;
      return thunkAPI.rejectWithValue(axiosError.response?.data as RejectPayload);
    }
  }
);

export { actionCheckDiscount, actionCheckOneDiscount, actionDeleteDiscount };

import { createAsyncThunk } from '@reduxjs/toolkit';
import { AxiosError } from 'axios';
import axiosInstance from '../../axios/axios';
import { RejectPayload } from "../../@types/payload";
import { checkTokenExpiration } from "../../utils/checkTokenExpiration";
import { actionAddToOrderPayloadI, OrderStateI } from "../../@types/order";

const actionAddToOrder = createAsyncThunk<OrderStateI, actionAddToOrderPayloadI, { rejectValue: RejectPayload }>(
  'order/ADD_TO_ORDER',
  async (payload, thunkAPI) => {
    try {
      if (checkTokenExpiration() === false)
        return thunkAPI.rejectWithValue({ tokenExpired: true });

      const response = await axiosInstance.post('/order', payload);
      return response.data;
    } catch (error) {
      const axiosError = error as AxiosError;
      return thunkAPI.rejectWithValue(axiosError.response?.data as RejectPayload);
    }
  }
);

export { actionAddToOrder };

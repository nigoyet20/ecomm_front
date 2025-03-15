import { createAsyncThunk } from '@reduxjs/toolkit';
import { AxiosError } from 'axios';
import axiosInstance from '../../axios/axios';

const actionCheckProduct = createAsyncThunk(
  'product/CHECK_PRODUCT',
  async (_, thunkAPI) => {
    try {
      const response = await axiosInstance.get('/products');
      return response.data;
    } catch (error) {
      const axiosError = error as AxiosError;
      return thunkAPI.rejectWithValue(axiosError.response?.data);
    }
  }
);

export { actionCheckProduct };

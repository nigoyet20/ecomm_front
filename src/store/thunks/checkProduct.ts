import { createAsyncThunk } from '@reduxjs/toolkit';
import { AxiosError } from 'axios';
import axiosInstance from '../../axios/axios';

const actionCheckProduct = createAsyncThunk(
  'product/CHECK_PRODUCT',
  async (_, thunkAPI) => {
    try {
      console.log("get");
      const response = await axiosInstance.get('/products');
      console.log(response);
      
      return response.data;
    } catch (error) {
      const axiosError = error as AxiosError;
      return thunkAPI.rejectWithValue(axiosError.response?.data);
    }
  }
);

export { actionCheckProduct };

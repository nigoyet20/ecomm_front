import { createAsyncThunk } from '@reduxjs/toolkit';
import { AxiosError } from 'axios';
import axiosInstance from '../../axios/axios';
import { CheckProfileAddressI, updateInfosPayload } from '../../@types/account';
import { checkTokenExpiration } from "../../utils/checkTokenExpiration";
import { RejectPayload } from "../../@types/payload";


interface deleteAddressToProfileI {
  account_id: number | null;
  address_id: number | null;
}

const actionAddAddressFromAccount = createAsyncThunk<CheckProfileAddressI[], CheckProfileAddressI, { rejectValue: RejectPayload }>(
  'account/ADD_ADDRESS_TO_PROFILE',
  async (payload: CheckProfileAddressI, thunkAPI) => {
    try {
      if (checkTokenExpiration() === false)
        return thunkAPI.rejectWithValue({ tokenExpired: true });
      const response = await axiosInstance.post(`/account/addAddress/${payload.account_id}`, payload);


      return response.data;
    } catch (error) {
      console.log(error);

      const axiosError = error as AxiosError;
      return thunkAPI.rejectWithValue(axiosError.response?.data as RejectPayload);
    }
  }
);

const actionDeleteAddressFromAccount = createAsyncThunk<number, deleteAddressToProfileI, { rejectValue: RejectPayload }>(
  'account/DELETE_ADDRESS_FROM_PROFILE',
  async (payload, thunkAPI) => {
    try {
      if (checkTokenExpiration() === false)
        return thunkAPI.rejectWithValue({ tokenExpired: true });

      const response = await axiosInstance.delete(`/account/deleteAddress/${payload.account_id}/${payload.address_id}`);
      return response.data;
    } catch (error) {
      const axiosError = error as AxiosError;
      return thunkAPI.rejectWithValue(axiosError.response?.data as RejectPayload);
    }
  }
);

const actionUpdateAddressFromAccount = createAsyncThunk<CheckProfileAddressI[], CheckProfileAddressI, { rejectValue: RejectPayload }>(
  'account/UPDATE_ADDRESS_FROM_PROFILE',
  async (payload, thunkAPI) => {
    try {
      if (checkTokenExpiration() === false)
        return thunkAPI.rejectWithValue({ tokenExpired: true });

      const response = await axiosInstance.patch(`/account/updateAddress/${payload.account_id}/${payload.id}`, payload);
      return response.data;
    } catch (error) {
      const axiosError = error as AxiosError;
      console.log(axiosError.response?.data);

      return thunkAPI.rejectWithValue(axiosError.response?.data as RejectPayload);
    }
  }
);


const actionUpdateInfosFromAccount = createAsyncThunk<updateInfosPayload, updateInfosPayload, { rejectValue: RejectPayload }>(
  'account/UPDATE_MAIL_FROM_PROFILE',
  async (payload, thunkAPI) => {
    try {
      if (checkTokenExpiration() === false)
        return thunkAPI.rejectWithValue({ tokenExpired: true });

      const response = await axiosInstance.patch(`/account/updateInfos/${payload.account_id}/`, payload);
      return response.data;
    } catch (error) {
      const axiosError = error as AxiosError;
      return thunkAPI.rejectWithValue(axiosError.response?.data as RejectPayload);
    }
  }
);


const actionDeleteAccount = createAsyncThunk<number, number | undefined | null, { rejectValue: RejectPayload }>(
  'account/DELETE_ACCOUNT',
  async (payload, thunkAPI) => {
    try {
      if (checkTokenExpiration() === false)
        return thunkAPI.rejectWithValue({ tokenExpired: true });

      if (payload === null)
        return thunkAPI.rejectWithValue({ message: 'No account id' });

      const response = await axiosInstance.delete(`/account/deleteAccount/${payload}`);

      return response.data;
    } catch (error) {
      const axiosError = error as AxiosError;
      return thunkAPI.rejectWithValue(axiosError.response?.data as RejectPayload);
    }
  }
);



const actionGetAllClients = createAsyncThunk(
  'account/GET_ALL_CLIENTS',
  async (_, thunkAPI) => {
    try {

      const response = await axiosInstance.get(`/account`);

      return response.data;
    } catch (error) {
      console.log(error);

      const axiosError = error as AxiosError;
      return thunkAPI.rejectWithValue(axiosError.response?.data as RejectPayload);
    }
  }
);

export {
  actionAddAddressFromAccount,
  actionDeleteAddressFromAccount,
  actionUpdateAddressFromAccount,
  actionUpdateInfosFromAccount,
  actionDeleteAccount,
  actionGetAllClients
};

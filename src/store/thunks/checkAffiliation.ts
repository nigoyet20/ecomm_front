import { createAsyncThunk } from '@reduxjs/toolkit';
import { AxiosError } from 'axios';
import axiosInstance from '../../axios/axios';
import { RejectPayload } from "../../@types/payload";
import type { RootState } from '..';
import { OrderStateI } from "../../@types/order";
import { escapeHtml } from '../../utils/escapeHtml';
import { AccountAffiliationI, AccountAffiliationPayloadCreateI, AccountAffiliationPayloadResponseCreateI, AccountAffiliationPayloadResponseDeleteI, AccountAffiliationPayloadResponseGetI, AccountAffiliationPayloadResponsePatchI, AccountAffiliationPayloadSendInfosI, AffiliationResponse } from '../../@types/affiliation';

const actionSigninAffiliation = createAsyncThunk<AffiliationResponse>(
  'affiliation/login',
  async (_, thunkAPI) => {
    try {
      const state = thunkAPI.getState() as RootState;

      const response = await axiosInstance.post('/affiliation', {
        email: escapeHtml(state.affiliation.affiliationInput.email),
        password: escapeHtml(state.affiliation.affiliationInput.password),
      });
      return response.data;
    } catch (error) {
      const axiosError = error as AxiosError;
      return thunkAPI.rejectWithValue(axiosError.response?.data as RejectPayload);
    }
  }
);

const actionSendFilesAffiliation = createAsyncThunk<
  OrderStateI,
  AccountAffiliationPayloadSendInfosI,
  { rejectValue: RejectPayload }
>(
  "affiliation/sendFiles",
  async (payload, thunkAPI) => {
    try {
      const response = await axiosInstance.post(`/affiliation-files`, payload);

      return response.data;
    } catch (error) {
      console.log(error);
      
      const axiosError = error as AxiosError;
      return thunkAPI.rejectWithValue(
        axiosError.response?.data as RejectPayload
      );
    }
  }
);

const actionCreateAccountAffiliation = createAsyncThunk<
  AccountAffiliationPayloadResponseCreateI,
  AccountAffiliationPayloadCreateI,
  { rejectValue: RejectPayload }
>(
  "affiliation/addAccount",
  async (payload, thunkAPI) => {
    try {
      const response = await axiosInstance.post("/affiliation-create", {
        email: payload.email,
        password: payload.password,
      });

      return response.data;
    } catch (error) {
      const axiosError = error as AxiosError;
      return thunkAPI.rejectWithValue(
        axiosError.response?.data as RejectPayload
      );
    }
  }
);

const actionDeleteAccountAffiliation = createAsyncThunk<
  AccountAffiliationPayloadResponseDeleteI,
  number,
  { rejectValue: RejectPayload }
>(
  "affiliation/deleteAccount",
  async (payload, thunkAPI) => {
    try {
      const response = await axiosInstance.delete(`/affiliation/${payload}`);
      return response.data;
    } catch (error) {
      const axiosError = error as AxiosError;
      return thunkAPI.rejectWithValue(
        axiosError.response?.data as RejectPayload
      );
    }
  }
);

const actionChangeAccountAffiliation = createAsyncThunk<
AccountAffiliationPayloadResponsePatchI,
AccountAffiliationI,
  { rejectValue: RejectPayload }
>(
  "affiliation/updatedAccount",
  async (payload, thunkAPI) => {
    try {
      const response = await axiosInstance.patch(`/affiliation`, {
        id: payload.id,
        email: payload.email,
        password: payload.password,
        filesSended: payload.filesSended
      });
      
      return response.data;
    } catch (error) {
      const axiosError = error as AxiosError;
      return thunkAPI.rejectWithValue(
        axiosError.response?.data as RejectPayload
      );
    }
  }
);

const actionGetInfosAffiliation = createAsyncThunk<
AccountAffiliationPayloadResponseGetI,
number,
  { rejectValue: RejectPayload }
>(
  "affiliation/getInfosAccount",
  async (payload, thunkAPI) => {
    try {
      const response = await axiosInstance.get(`/affiliation/${payload}`);
      
      return response.data;
    } catch (error) {
      const axiosError = error as AxiosError;
      return thunkAPI.rejectWithValue(
        axiosError.response?.data as RejectPayload
      );
    }
  }
);

export { actionSigninAffiliation, 
  actionSendFilesAffiliation, 
  actionCreateAccountAffiliation, 
  actionDeleteAccountAffiliation, 
  actionChangeAccountAffiliation, 
  actionGetInfosAffiliation };

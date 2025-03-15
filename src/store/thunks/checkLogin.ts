import { createAsyncThunk } from '@reduxjs/toolkit';
import type { RootState } from '..';
import axiosInstance from '../../axios/axios';
import { addTokenStorage, deleteLocalStorage } from '../../localStorage/localStorage';
import { AxiosError } from 'axios';
import { escapeHtml } from "../../utils/escapeHtml";
import { checkTokenExpiration } from "../../utils/checkTokenExpiration";
import { actionCheckSigninResult, actionCheckTokenPayload, RejectPayload } from "../../@types/payload";
import { actionAddToCartPayloadI } from "../../@types/cart";
import { supabaseSignIn, supabaseSignOut, supabaseSignUp } from "../../axios/supabaseClient";

const actionCheckToken = createAsyncThunk<actionCheckTokenPayload, void, { rejectValue: RejectPayload }>(
  'account/CHECK_TOKEN',
  async (_, thunkAPI) => {
    try {
      if (checkTokenExpiration() === false)
        return thunkAPI.rejectWithValue({ tokenExpired: true });
      const response = await axiosInstance.post('/valide-token');

      return { valid: response.data.valid, data: response.data };
    } catch (error) {
      deleteLocalStorage();
      const axiosError = error as AxiosError;
      return thunkAPI.rejectWithValue(axiosError.response?.data as RejectPayload);
    }
  }
);

const actionCheckSignin = createAsyncThunk<actionCheckSigninResult, actionAddToCartPayloadI[] | null>(
  'account/CHECK_LOGIN',
  async (payload: actionAddToCartPayloadI[] | null, thunkAPI) => {
    try {
      const state = thunkAPI.getState() as RootState;
      let response;
      if (payload && payload.length > 0)
        response = await axiosInstance.post('/signin', {
          email: escapeHtml(state.account.credentials.email),
          password: escapeHtml(state.account.credentials.passwordSignin),
          cartVisitor: payload,
        });
      else
        response = await axiosInstance.post('/signin', {
          email: escapeHtml(state.account.credentials.email),
          password: escapeHtml(state.account.credentials.passwordSignin),
        });

      supabaseSignIn(state.account.credentials.email, state.account.credentials.passwordSignin);

      const { token, csrfToken, sessionId } = response.data;
      addTokenStorage(token, csrfToken, sessionId);

      return { data: response.data };
    } catch (error) {
      console.log(error);

      const axiosError = error as AxiosError;
      return thunkAPI.rejectWithValue(axiosError.response?.data);
    }
  }
);

const actionCheckSignup = createAsyncThunk(
  'account/CHECK_SIGNUP',
  async (_, thunkAPI) => {
    try {
      const state = thunkAPI.getState() as RootState;
      const response = await axiosInstance.post('/signup', {
        email: escapeHtml(state.account.credentials.email),
        password: escapeHtml(state.account.credentials.password),
      });

      supabaseSignUp(state.account.credentials.email, state.account.credentials.password);

      return response.data;
    } catch (error) {
      const axiosError = error as AxiosError;
      return thunkAPI.rejectWithValue(axiosError.response?.data);
    }
  }
);

const actionCheckPasswordRecovery = createAsyncThunk(
  'account/CHECK_PASSWORD_RECOVERY',
  async (_, thunkAPI) => {
    try {
      const state = thunkAPI.getState() as RootState;
      const response = await axiosInstance.post('/password-recovery', {
        email: escapeHtml(state.account.credentials.emailRecovery),
      });

      return response.data;
    } catch (error) {
      const axiosError = error as AxiosError;
      return thunkAPI.rejectWithValue(axiosError.response?.data);
    }
  }
);

const actionCheckPasswordRecoverySend = createAsyncThunk(
  'account/CHECK_PASSWORD_RECOVERY_SNED',
  async (_, thunkAPI) => {
    try {
      const state = thunkAPI.getState() as RootState;

      if (state.account.credentials.recoveryToken) {
        const response = await axiosInstance.post('/password-recovery-send', {
          password: escapeHtml(state.account.credentials.newPassword),
          passwordConfirm: escapeHtml(state.account.credentials.newPasswordConfirm),
          token: state.account.credentials.recoveryToken,
        });
        return response.data;
      }
      return thunkAPI.rejectWithValue({ message: 'Token invalide' });
    } catch (error) {
      const axiosError = error as AxiosError;
      return thunkAPI.rejectWithValue(axiosError.response?.data);
    }
  }
);

const actionCheckConnexion = createAsyncThunk(
  'account/CHECK_CONNEXION',
  async (_, thunkAPI) => {
    try {
      const state = thunkAPI.getState() as RootState;
      const response = await axiosInstance.post('/connexion', {
        email: escapeHtml(state.account.credentials.email),
      });
      return response.data;
    } catch (error) {
      const axiosError = error as AxiosError;
      return thunkAPI.rejectWithValue(axiosError.response?.data);
    }
  }
);

const actionLogout = createAsyncThunk(
  'account/LOGOUT',
  async (_, thunkAPI) => {
    try {
      const response = await axiosInstance.post('/logout');
      supabaseSignOut();
      return response.data;
    } catch (error) {
      const axiosError = error as AxiosError;
      return thunkAPI.rejectWithValue(axiosError.response?.data);
    }
  }
);

export { actionCheckSignin, actionCheckConnexion, actionCheckSignup, actionCheckToken, actionCheckPasswordRecovery, actionCheckPasswordRecoverySend, actionLogout };

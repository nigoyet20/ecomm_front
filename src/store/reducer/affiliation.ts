import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { AffiliationStateI } from '../../@types/affiliation';
import { changeCredentialsAffiliationPayload } from '../../@types/payload';
import { escapeHtml } from '../../utils/escapeHtml';
import { actionChangeAccountAffiliation, actionCreateAccountAffiliation, actionDeleteAccountAffiliation, actionSigninAffiliation } from '../thunks/checkAffiliation';
import { validateEmail, validePassword } from '../../utils/regexValidator';

export const initialState: AffiliationStateI = {
  isAuthentificated: false,
  filesSended: false,
  isAdmin: false,
  affiliationList: [],
  data: {
    email: '',
  },
  affiliationInput: {
    email: '',
    password: '',
    validEmail: false,
    validPassword: false
  },
  pending: {
    signin: false
  }
};

const affiliationSlice = createSlice({
  name: 'order',
  initialState,
  reducers: {
    actionChangeInput: (state, action: PayloadAction<changeCredentialsAffiliationPayload>) => {
      const { name, value } = action.payload;
      state.affiliationInput[name] = escapeHtml(value);
      switch (name) {
        case 'email':
          if (!validateEmail(state.affiliationInput.email)) {
            state.affiliationInput.validEmail = false;
          } else {
            state.affiliationInput.validEmail = true;
          }
          break;
        case 'password':
          {
            const testPassword = validePassword(state.affiliationInput.password);
            if (Object.values(testPassword).every(value => value === true)) {
              state.affiliationInput.validPassword = true;
            } else {
              state.affiliationInput.validPassword = false;
            }
            break;
          }
      }
    },
    actionChangeFilesSended: (state) => {
      state.filesSended = !state.filesSended;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(actionSigninAffiliation.fulfilled, (state, action) => {
      state.data.email = action.payload.account.email
      state.isAuthentificated = true
      state.filesSended = action.payload.filesSended
      state.isAdmin = action.payload.isAdmin
      state.affiliationList = action.payload.affiliationList
      state.pending.signin = false;
    });
    builder.addCase(actionSigninAffiliation.pending, (state) => {
      state.pending.signin = true;
    });
    builder.addCase(actionSigninAffiliation.rejected, (state) => {
      state.isAuthentificated = false
      state.pending.signin = false;
    });
    builder.addCase(actionCreateAccountAffiliation.fulfilled, (state, action) => {   
      state.affiliationList.push(action.payload.newAccount)
    });
    builder.addCase(actionDeleteAccountAffiliation.fulfilled, (state, action) => {
      const listUpdate = state.affiliationList.filter((account) => account.id !== action.payload.accountRemoved);
      state.affiliationList = listUpdate;
    });
    builder.addCase(actionChangeAccountAffiliation.fulfilled, (state, action) => {
      const updatedAccount = state.affiliationList.map(account => 
        account.id === action.payload.updatedAccount.id
        ? action.payload.updatedAccount
        : account
      )
      state.affiliationList = updatedAccount;
    });
  }
})

export const { actionChangeInput, actionChangeFilesSended } = affiliationSlice.actions;
export default affiliationSlice.reducer;

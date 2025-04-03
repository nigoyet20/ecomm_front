import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { AffiliationStateI } from '../../@types/affiliation';
import { changeCredentialsAffiliationPayload } from '../../@types/payload';
import { escapeHtml } from '../../utils/escapeHtml';
import { actionChangeAccountAffiliation, actionCreateAccountAffiliation, actionDeleteAccountAffiliation, actionGetInfosAffiliation, actionSigninAffiliation } from '../thunks/checkAffiliation';
import { validateEmail, validePassword } from '../../utils/regexValidator';

export const initialState: AffiliationStateI = {
  id: null,
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
    validPassword: false,
    error: '',
  },
  pending: {
    signin: false,
    getInfos: false
  },
  accountTarget: {
    firstname: '',
    lastname: '',
    address: '',
    phone: '',
    insta: '',
    tiktok: '',
    facebook: '',
    files: []
  },
  modal: {
    infos: false
  }
};

const affiliationSlice = createSlice({
  name: 'affiliation',
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
    actionModalIsOpen: (state) => {
      state.modal.infos = !state.modal.infos;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(actionSigninAffiliation.fulfilled, (state, action) => {
      state.id = action.payload.account.id
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
      state.affiliationInput.error = "Email ou mot de passe invalide"
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
    builder.addCase(actionGetInfosAffiliation.fulfilled, (state, action) => {
      state.accountTarget = action.payload.account;
      state.accountTarget.files = action.payload.files
      state.pending.getInfos = false;
      state.modal.infos = true;
    });
  }
})

export const { actionChangeInput, actionChangeFilesSended, actionModalIsOpen } = affiliationSlice.actions;
export default affiliationSlice.reducer;

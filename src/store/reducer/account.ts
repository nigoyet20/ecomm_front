import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import {
  actionCheckConnexion,
  actionCheckPasswordRecovery,
  actionCheckPasswordRecoverySend,
  actionCheckSignin,
  actionCheckSignup,
  actionCheckToken,
  actionLogout
} from '../thunks/checkLogin';
import { isNumeric, validateEmail, validePassword } from '../../utils/regexValidator';
import { deleteLocalStorage } from '../../localStorage/localStorage';
import { changeCredentialsPayload } from '../../@types/payload';
import {
  actionAddAddressFromAccount,
  actionDeleteAccount,
  actionDeleteAddressFromAccount,
  actionGetAllClients,
  actionUpdateAddressFromAccount,
  actionUpdateInfosFromAccount
} from '../thunks/checkAccount';
import { accountInfosI, CheckProfileAddressI, CountryI } from '../../@types/account';
import { escapeHtml } from '../../utils/escapeHtml';
import { actionAddToCart, actionDeleteOneFromCart } from "../thunks/checkCart";
import { DisountI } from "../../@types/discount";
import { actionCheckDiscount, actionCheckOneDiscount, actionDeleteDiscount } from "../thunks/checkDiscount";
import { actionAddToOrder } from "../thunks/checkOrder";

export const initialState = {
  id: null,
  isAuthentificated: false,
  pending: {
    checking: false,
    login: false,
    signup: false,
    checkToken: true,
    mailSended: false,
    passwordRecoveryMailSnded: false,
    passwordRecoveryPasswordModified: false,
  },
  credentials: {
    email: '',
    emailRecovery: '',
    passwordSignin: '',
    password: '',
    passwordConfirm: '',
    newPassword: '',
    newPasswordConfirm: '',
    formConnection: false,
    formPasswordRecovery: false,
    formPasswordRecoveryNew1: false,
    formPasswordRecoveryNew2: false,
    formLogin: false,
    formSignup1: false,
    formSignup2: false,
    errorSignup: null as string | string[] | null,
    errorSigin: null as string | string[] | null,
    errorPasswordRecovery: null as string | null,
    errorPasswordRecoveryNew: null as string | string[] | null,
    recoveryToken: null as string | null,
    address: {
      id: null,
      account_id: null,
      default: false,
      firstname: '',
      lastname: '',
      entreprise: '',
      address: '',
      precision: '',
      postal_code: '',
      city: '',
      country_id: '',
    },
    card: {
      card_number: '',
      expiration_date: '',
      cvc: '',
      card_name: '',
      date: '',
      total: '',
      verif_code: ''
    },
    validAddress: {
      id: null,
      account_id: null,
      default: false,
      firstname: '',
      lastname: '',
      entreprise: '',
      address: '',
      precision: '',
      postal_code: '',
      city: '',
      country_id: '',
    },
  },
  account: {
    id: null as null | number,
    email: '',
    admin: false,
    infos: {
      firstname: '',
      lastname: '',
    },
    address: {
      id: null,
      account_id: null,
      default: false,
      firstname: '',
      lastname: '',
      entreprise: '',
      address: '',
      precision: '',
      postal_code: '',
      city: '',
      country_id: null as null | number,
      country: {
        id: 73 as null | number,
        name: 'France',
        code: 'FR',
        dial_code: '+33',
      },
      phone: '',
    },
    listAddress: [] as CheckProfileAddressI[],
  },
  connection: 'checking',
  token: null as null | string,
  listCountries: [] as CountryI[],
  discounts: [] as DisountI[],


  admin: {
    listClients: [] as accountInfosI[],
  }
};

const accountSlice = createSlice({
  name: 'account',
  initialState,
  reducers: {
    actionChangeCredentials: (state, action: PayloadAction<changeCredentialsPayload>) => {
      const { name, value } = action.payload;
      state.credentials[name] = escapeHtml(value);
      switch (name) {
        case 'email':
          if (!validateEmail(state.credentials.email)) {
            state.credentials.formConnection = false;
            state.credentials.errorSignup = "Email invalide";
          } else {
            state.credentials.formConnection = true;
            state.credentials.errorSignup = null;
          }
          break;
        case 'emailRecovery':
          if (!validateEmail(state.credentials.emailRecovery)) {
            state.credentials.formPasswordRecovery = false;
            state.credentials.errorPasswordRecovery = "Email invalide";
          } else {
            state.credentials.formPasswordRecovery = true;
            state.credentials.errorPasswordRecovery = null;
          }
          break;
        case 'password':
          {
            const testPassword = validePassword(state.credentials.password);
            if (Object.values(testPassword).every(value => value === true)) {
              state.credentials.formSignup1 = true;
            } else {
              state.credentials.formSignup1 = false;
            }

            if (state.credentials.password !== state.credentials.passwordConfirm) {
              state.credentials.formSignup2 = false;
            } else {
              state.credentials.formSignup2 = true;
            }
            break;
          }
        case 'passwordConfirm':
          if (state.credentials.password !== state.credentials.passwordConfirm) {
            state.credentials.formSignup2 = false;
          } else {
            state.credentials.formSignup2 = true;
          }
          break;
        case 'newPassword':
          {
            const testPassword = validePassword(state.credentials.newPassword);
            if (Object.values(testPassword).every(value => value === true)) {
              state.credentials.formPasswordRecoveryNew1 = true;
            } else {
              state.credentials.formPasswordRecoveryNew1 = false;
            }

            if (state.credentials.newPassword !== state.credentials.newPasswordConfirm) {
              state.credentials.formPasswordRecoveryNew2 = false;
            } else {
              state.credentials.formPasswordRecoveryNew2 = true;
            }
            break;
          }
        case 'newPasswordConfirm':
          if (state.credentials.newPassword !== state.credentials.newPasswordConfirm) {
            state.credentials.formPasswordRecoveryNew2 = false;
          } else {
            state.credentials.formPasswordRecoveryNew2 = true;
          }
      }
    },
    actionChangeConnection: (state, action) => {
      state.connection = action.payload;
    },
    actionChangeAuthentification: (state, action) => {
      state.isAuthentificated = action.payload;
    },
    actionSetRecoveryToken: (state, action) => {
      state.credentials.recoveryToken = action.payload;
    },
    actionChangeAddressOneInfo: (state, action) => {
      const { name, value } = action.payload;

      switch (name) {
        case 'default':
          state.account.address = {
            ...state.account.address,
            [name]: !state.account.address.default
          }
          return;
        case 'country': {
          const country = state.listCountries.find(country => country.code === value);
          if (!country) return;
          const newFormData = { ...state.account.address, country_id: country.id, country: country };
          state.account.address = newFormData;
          return;
        }
        case 'postal_code':
          if (value.length > 5 || !isNumeric(value)) {
            return;
          } else state.account.address = { ...state.account.address, [name]: value };
          break;
        case 'phone':
          if (value.length > 14 || !isNumeric(value)) {
            return;
          } else state.account.address = { ...state.account.address, [name]: value };
          break;
        default:
          state.account.address = { ...state.account.address, [name]: value };
          break;
      }
    },
    actionChangePaymentInfo: (state, action) => {
      const { name, value } = action.payload;
      switch (name) {
        case 'card_number': {
          let valueFormated = value.replace(/\s/g, '').replace(/[^0-9]/gi, '');
          const matches = valueFormated.match(/\d{4,20}/g);
          const match = (matches && matches[0]) || '';
          const parts = [];

          for (let i = 0, len = match.length; i < len; i += 4) {
            parts.push(match.substring(i, i + 4));
          }

          if (parts.length)
            valueFormated = parts.join(' ');

          state.credentials.card = {
            ...state.credentials.card,
            card_number: valueFormated
          }
          return;
        }
        case 'expiration_date': {
          let valueFormated = value.replace(/[^0-9]/g, '');
          if (valueFormated.length > 4)
            valueFormated = valueFormated.substring(0, 4);

          if (valueFormated.length > 2)
            valueFormated = valueFormated.substring(0, 2) + '/' + valueFormated.substring(2);

          state.credentials.card = {
            ...state.credentials.card,
            expiration_date: valueFormated
          }
          return;
        }
        case 'cvc': {
          const valueFormated = value.replace(/[^0-9]/g, '');
          if (valueFormated.length > 4)
            return;

          state.credentials.card = {
            ...state.credentials.card,
            cvc: valueFormated
          }
          return;
        }
        case 'card_name': {
          const valueFormated = value.replace(/[^A-Za-zÀ-ÖØ-öø-ÿ\s]+$/g, '');

          state.credentials.card = {
            ...state.credentials.card,
            card_name: valueFormated
          }
          return;
        }
        case 'date': {
          state.credentials.card = {
            ...state.credentials.card,
            date: value
          }
          return;
        }
        case 'total': {
          state.credentials.card = {
            ...state.credentials.card,
            total: value
          }
          return;
        }
        case 'verif_code': {
          if (isNumeric(value)) {
            state.credentials.card = {
              ...state.credentials.card,
              verif_code: value
            }
          }

          return;
        }
      }
    },
    actionChangeAddressAllInfos: (state, action) => {
      state.account.address = action.payload;
    },
    actionResetAddress: (state) => {
      state.account.address = {
        id: null,
        account_id: null,
        default: false,
        firstname: '',
        lastname: '',
        entreprise: '',
        address: '',
        precision: '',
        postal_code: '',
        city: '',
        country_id: null as null | number,
        country: {
          id: 73 as null | number,
          name: 'France',
          code: 'FR',
          dial_code: '+33',
        },
        phone: '',
      };
    },
    actionSetInfos: (state, action) => {
      state.account.infos = {
        ...state.account.infos,
        ...action.payload,
      };
    },
    actionSetAddressPayment: (state, action) => {
      state.credentials.validAddress = {
        ...state.credentials.validAddress,
        ...action.payload,
      };
    },
  },
  extraReducers: (builder) => {
    builder.addCase(actionCheckConnexion.fulfilled, (state, action) => {
      state.pending.checking = false;
      if (action.payload.exists === false)
        state.connection = 'signup';
      else
        state.connection = 'login';
    });
    builder.addCase(actionCheckConnexion.pending, (state) => {
      state.pending.checking = true;
    });
    builder.addCase(actionCheckConnexion.rejected, (state) => {
      state.pending.checking = false;
    });
    builder.addCase(actionCheckSignin.fulfilled, (state, action) => {
      state.pending.login = false;
      state.credentials.email = '';
      state.credentials.passwordSignin = '';
      state.credentials.password = '';
      state.credentials.passwordConfirm = '';
      state.token = action.payload.data.token;
      state.isAuthentificated = true;
      state.account.id = action.payload.data.account.id;
      state.account.email = escapeHtml(action.payload.data.account.email);
      if (action.payload.data.account.firstname) state.account.infos.firstname = escapeHtml(action.payload.data.account.firstname);
      if (action.payload.data.account.lastname) state.account.infos.lastname = escapeHtml(action.payload.data.account.lastname);
      state.account.admin = action.payload.data.account.admin;
      state.account.listAddress = action.payload.data.account.addresses.map((address: CheckProfileAddressI) => ({
        ...address,
        firstname: escapeHtml(address.firstname),
        lastname: escapeHtml(address.lastname),
        entreprise: escapeHtml(address.entreprise),
        address: escapeHtml(address.address),
        precision: escapeHtml(address.precision),
        postal_code: escapeHtml(address.postal_code),
        city: escapeHtml(address.city),
        phone: escapeHtml(address.phone),
        country: {
          ...address.country,
          name: escapeHtml(address.country.name),
          code: escapeHtml(address.country.code),
          dial_code: escapeHtml(address.country.dial_code)
        }
      }));
      state.listCountries = action.payload.data.listCountries.map((country: CountryI) => ({
        ...country,
        name: escapeHtml(country.name),
        code: escapeHtml(country.code),
        dial_code: escapeHtml(country.dial_code)
      }));
      state.credentials.errorSigin = null;
      state.credentials.passwordSignin = '';
      state.credentials.password = '';
      state.credentials.passwordConfirm = '';
    });
    builder.addCase(actionCheckSignin.pending, (state) => {
      state.pending.login = true;
    });
    builder.addCase(actionCheckSignin.rejected, (state, action) => {
      const payload = action.payload as { error: string };
      state.pending.checking = false;
      state.pending.login = false;
      state.credentials.errorSigin = payload.error;
      state.isAuthentificated = false;
    });
    builder.addCase(actionCheckSignup.fulfilled, (state) => {
      state.pending.signup = false;
      state.connection = 'checking';
      state.credentials.errorSignup = null;
      state.pending.mailSended = true;
    });
    builder.addCase(actionCheckSignup.pending, (state) => {
      state.pending.signup = true;
    });
    builder.addCase(actionCheckSignup.rejected, (state) => {
      state.pending.signup = false;
    });
    builder.addCase(actionCheckPasswordRecovery.fulfilled, (state) => {
      state.pending.passwordRecoveryMailSnded = false;
    });
    builder.addCase(actionCheckPasswordRecovery.pending, (state) => {
      state.pending.passwordRecoveryMailSnded = true;
    });
    builder.addCase(actionCheckPasswordRecovery.rejected, (state) => {
      state.pending.passwordRecoveryMailSnded = false;
    });
    builder.addCase(actionCheckPasswordRecoverySend.fulfilled, (state) => {
      state.pending.passwordRecoveryPasswordModified = false;
      state.connection = 'checking';

    });
    builder.addCase(actionCheckPasswordRecoverySend.pending, (state) => {
      state.pending.passwordRecoveryPasswordModified = true;
    });
    builder.addCase(actionCheckPasswordRecoverySend.rejected, (state) => {
      state.pending.passwordRecoveryPasswordModified = false;
      state.connection = 'checking';
    });
    builder.addCase(actionCheckToken.fulfilled, (state, action) => {
      state.isAuthentificated = action.payload.valid;
      if (action.payload.valid) {
        state.account.id = action.payload.data.id;
        state.account.email = escapeHtml(action.payload.data.email);
        state.account.admin = action.payload.data.admin;
        if (action.payload.data.firstname) state.account.infos.firstname = escapeHtml(action.payload.data.firstname);
        if (action.payload.data.lastname) state.account.infos.lastname = escapeHtml(action.payload.data.lastname);
        state.account.listAddress = action.payload.data.addresses.map((address: CheckProfileAddressI) => ({
          ...address,
          firstname: escapeHtml(address.firstname),
          lastname: escapeHtml(address.lastname),
          entreprise: escapeHtml(address.entreprise),
          address: escapeHtml(address.address),
          precision: escapeHtml(address.precision),
          postal_code: escapeHtml(address.postal_code),
          city: escapeHtml(address.city),
          phone: escapeHtml(address.phone),
          country: {
            ...address.country,
            name: escapeHtml(address.country.name),
            code: escapeHtml(address.country.code),
            dial_code: escapeHtml(address.country.dial_code)
          }
        }));
        state.listCountries = action.payload.data.listCountries.map((country: CountryI) => ({
          ...country,
          name: escapeHtml(country.name),
          code: escapeHtml(country.code),
          dial_code: escapeHtml(country.dial_code)
        }));
        state.pending.checkToken = false;
      }
    });
    builder.addCase(actionCheckToken.pending, (state) => {
      state.pending.checkToken = true;
    });
    builder.addCase(actionCheckToken.rejected, (state, action) => {
      state.isAuthentificated = false;
      if (action.payload?.tokenExpired && action.payload?.tokenExpired === true) {
        state.token = null;
        deleteLocalStorage();
      }
      state.pending.checkToken = false;
    });
    builder.addCase(actionAddAddressFromAccount.fulfilled, (state, action) => {
      state.account.listAddress = action.payload.map(address => ({
        ...address,
        firstname: escapeHtml(address.firstname),
        lastname: escapeHtml(address.lastname),
        entreprise: escapeHtml(address.entreprise),
        address: escapeHtml(address.address),
        precision: escapeHtml(address.precision),
        postal_code: escapeHtml(address.postal_code),
        city: escapeHtml(address.city),
        phone: escapeHtml(address.phone),
        country: {
          ...address.country,
          name: escapeHtml(address.country.name),
          code: escapeHtml(address.country.code),
          dial_code: escapeHtml(address.country.dial_code)
        }
      }));
    });
    builder.addCase(actionAddAddressFromAccount.rejected, (state, action) => {
      if (action.payload?.tokenExpired && action.payload?.tokenExpired === true) {
        state.token = null;
        deleteLocalStorage();
        state.isAuthentificated = false;
      }
    });
    builder.addCase(actionDeleteAddressFromAccount.fulfilled, (state, action) => {
      const id = action.payload;
      state.account.listAddress = state.account.listAddress.filter((address) => address.id !== id);
    });
    builder.addCase(actionDeleteAddressFromAccount.rejected, (state, action) => {
      if (action.payload?.tokenExpired && action.payload?.tokenExpired === true) {
        state.token = null;
        deleteLocalStorage();
        state.isAuthentificated = false;
      }
    });
    builder.addCase(actionUpdateAddressFromAccount.fulfilled, (state, action) => {
      state.account.listAddress = action.payload.map(address => ({
        ...address,
        firstname: escapeHtml(address.firstname),
        lastname: escapeHtml(address.lastname),
        entreprise: escapeHtml(address.entreprise),
        address: escapeHtml(address.address),
        precision: escapeHtml(address.precision),
        postal_code: escapeHtml(address.postal_code),
        city: escapeHtml(address.city),
        phone: escapeHtml(address.phone),
        country: {
          ...address.country,
          name: escapeHtml(address.country.name),
          code: escapeHtml(address.country.code),
          dial_code: escapeHtml(address.country.dial_code)
        }
      }));
    });
    builder.addCase(actionUpdateAddressFromAccount.rejected, (state, action) => {
      if (action.payload?.tokenExpired && action.payload?.tokenExpired === true) {
        state.token = null;
        deleteLocalStorage();
        state.isAuthentificated = false;
      }
    });
    builder.addCase(actionUpdateInfosFromAccount.fulfilled, (state, action) => {
      state.account.email = action.payload.email;
      state.account.infos.firstname = action.payload.firstname;
      state.account.infos.lastname = action.payload.lastname;
    });
    builder.addCase(actionUpdateInfosFromAccount.rejected, (state, action) => {
      if (action.payload?.tokenExpired && action.payload?.tokenExpired === true) {
        state.token = null;
        deleteLocalStorage();
        state.isAuthentificated = false;
      }
    });
    builder.addCase(actionDeleteAccount.fulfilled, (state) => {
      state.isAuthentificated = false;
      state.token = null;
      deleteLocalStorage();
    });
    builder.addCase(actionDeleteAccount.rejected, (state, action) => {
      if (action.payload?.tokenExpired && action.payload?.tokenExpired === true) {
        state.token = null;
        deleteLocalStorage();
        state.isAuthentificated = false;
      }
      if (action.payload?.message && action.payload?.message === 'No account id') {
        state.token = null;
        deleteLocalStorage();
      }
    });
    builder.addCase(actionLogout.fulfilled, (state) => {
      state.isAuthentificated = false;
      state.token = null;
      deleteLocalStorage();
      state.connection = 'checking';
    });
    builder.addCase(actionLogout.rejected, (state) => {
      state.isAuthentificated = false;
      state.token = null;
      deleteLocalStorage();
      state.connection = 'checking';
    });
    builder.addCase(actionAddToCart.rejected, (state, action) => {
      if (action.payload?.tokenExpired && action.payload?.tokenExpired === true) {
        state.token = null;
        deleteLocalStorage();
        state.isAuthentificated = false;
      }
    });
    builder.addCase(actionAddToOrder.rejected, (state, action) => {
      if (action.payload?.tokenExpired && action.payload?.tokenExpired === true) {
        state.token = null;
        deleteLocalStorage();
        state.isAuthentificated = false;
      }
    });
    builder.addCase(actionDeleteOneFromCart.rejected, (state, action) => {
      if (action.payload?.tokenExpired && action.payload?.tokenExpired === true) {
        state.token = null;
        deleteLocalStorage();
        state.isAuthentificated = false;
      }
    });
    builder.addCase(actionCheckDiscount.rejected, (state, action) => {
      if (action.payload?.tokenExpired && action.payload?.tokenExpired === true) {
        state.token = null;
        deleteLocalStorage();
        state.isAuthentificated = false;
      }
    });
    builder.addCase(actionDeleteDiscount.rejected, (state, action) => {
      if (action.payload?.tokenExpired && action.payload?.tokenExpired === true) {
        state.token = null;
        deleteLocalStorage();
        state.isAuthentificated = false;
      }
    });
    builder.addCase(actionCheckOneDiscount.rejected, (state, action) => {
      if (action.payload?.tokenExpired && action.payload?.tokenExpired === true) {
        state.token = null;
        deleteLocalStorage();
        state.isAuthentificated = false;
      }
    });

    builder.addCase(actionGetAllClients.fulfilled, (state, action) => {
      state.admin.listClients = action.payload.accounts
    });
  },
});


export const { actionChangeCredentials,
  actionChangeConnection,
  actionChangeAuthentification,
  actionChangeAddressOneInfo,
  actionChangeAddressAllInfos,
  actionResetAddress,
  actionChangePaymentInfo,
  actionSetInfos,
  actionSetAddressPayment,
  actionSetRecoveryToken
} = accountSlice.actions;
export default accountSlice.reducer;

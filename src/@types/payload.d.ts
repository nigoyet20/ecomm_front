export interface changeCredentialsPayload {
  name: 'email' | 'password' | 'passwordConfirm' | 'passwordSignin' | 'emailRecovery' | 'newPassword' | 'newPasswordConfirm';
  value: string;
}

export interface changeInputDiscountPayload {
  name: 'code' | 'discount';
  value: string;
}

export interface modal_setIsOpen {
  modal: keyof modalsIsOpenState;
  value: boolean;
}

export interface PriceRangeModal {
  available: boolean;
  initialMinPrice: number;
  initialMaxPrice: number;
  sliderMinValue: number;
  sliderMaxValue: number;
  minVal: number;
  maxVal: number;
  minInput: string;
  maxInput: string;
  selectedMinPrice: number;
  selectedMaxPrice: number;
  isDraging: boolean;
  filtered: boolean;
  minGap: number;
}

export interface initialStateModal {
  modals: modalsIsOpenState;
  modalCollectionFilter: PriceRangeModal;
  popup: {
    text: string;
    error: boolean;
  }
}

export interface modalsIsOpenState {
  burgerModalIsOpen: boolean;
  confirmModalIsOpen: boolean;
  modalCartIsOpen: boolean;
  modalAdressIsOpen: boolean;
  modalAddressIsEdit: boolean;
  modalInfosIsOpen: boolean;
  modalCollectionFilterIsOpen: boolean;
  popupIsOpen: boolean;
}

export interface setPriceValuePayload {
  name: keyof PriceRangeModal;
  value: number | boolean | string;
}

export interface actionCheckTokenPayload {
  valid: boolean;
  data: {
    id: number;
    firstname: string;
    lastname: string;
    email: string;
    addresses: CheckProfileAddressI[];
    listCountries: CountryI[];
    cart: {
      productsCart: actionAddToCartPayloadI[];
    };
    order: OrderI[];
    discounts: DiscountI[];
    admin: boolean;
  }
}

export interface actionAddRemovetoCartPayload {
  productCarts: actionAddToCartPayloadI[];
}

export interface actionAddOrderPayload {
  orders: actionAddToOrderPayloadI[];
}

export interface ErrorPayload {
  message: string;
  [key: string]: string;
}

export interface ExpirationPayload {
  tokenExpired: boolean;
  message?: string;
}

export type RejectPayload = ExpirationPayload | ErrorPayload;

export interface actionCheckSigninResult {
  data: {
    account: AccountSigninI;
    cart: cartResponseI;
    order: OrderI[];
    listCountries: CountryI[];
    token: string;
    csrfToken: string;
    sessionId: string;
    discounts: DiscountI[];
  }
}


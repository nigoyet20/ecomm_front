import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { initialStateModal, modal_setIsOpen, modalsIsOpenState, setPriceValuePayload } from '../../@types/payload';
import { actionDeleteOneFromCart } from "../thunks/checkCart";

export const initialState: initialStateModal = {
  modals: {
    burgerModalIsOpen: false,
    confirmModalIsOpen: false,
    modalCartIsOpen: false,
    modalAdressIsOpen: false,
    modalAddressIsEdit: false,
    modalInfosIsOpen: false,
    modalCollectionFilterIsOpen: false,
    popupIsOpen: false,
  },

  modalCollectionFilter: {
    available: true,

    initialMinPrice: 0,
    initialMaxPrice: 1000,
    sliderMinValue: 0,
    sliderMaxValue: 1000,
    minVal: 0,
    maxVal: 1000,
    minInput: '',
    maxInput: '',
    selectedMinPrice: 0,
    selectedMaxPrice: 1000,
    isDraging: false,
    filtered: false,
    minGap: 5,
  },

  popup: {
    text: '',
    error: false,
  }
}

const ModalMenu = createSlice({
  name: 'modalMenu',
  initialState,
  reducers: {
    toggleIsOpen: (state, action: PayloadAction<keyof modalsIsOpenState>) => {
      state.modals[action.payload] = !state.modals[action.payload];
    },
    setIsOpen: (state, action: PayloadAction<modal_setIsOpen>) => {
      state.modals[action.payload.modal] = action.payload.value;
    },
    setPopup: (state, action) => {
      state.popup.text = action.payload.message;
      state.modals.popupIsOpen = true;
      if (action.payload.error === true) {
        state.popup.error = true;
      } else {
        state.popup.error = false;
      }
    },
    closeAllModal: (state) => {
      state.modals.burgerModalIsOpen = false;
      state.modals.confirmModalIsOpen = false;
      state.modals.modalCollectionFilterIsOpen = false;
      state.modals.modalCartIsOpen = false;
      state.modals.modalAdressIsOpen = false;
      state.modals.modalInfosIsOpen = false;
    },
    setFilterValue: (state, action: PayloadAction<setPriceValuePayload>) => {
      const { name, value } = action.payload;
      if (typeof (value) === "boolean" && (name === 'isDraging' || name === 'filtered' || name === 'available')) {
        if (value === true) state.modalCollectionFilter[name] = true;
        else state.modalCollectionFilter[name] = false;
      }
      else if (typeof (value) === "string" && (name === "minInput" || name === "maxInput")) {
        state.modalCollectionFilter[name] = value;
      }
      else if (typeof (value) === "number" && (name === "initialMinPrice" || name === "initialMaxPrice" || name === "sliderMinValue" || name === "sliderMaxValue" || name === "minVal" || name === "maxVal" || name === "selectedMinPrice" || name === "selectedMaxPrice" || name === "minGap")) {
        state.modalCollectionFilter[name] = value;
      }
    }
  },
  extraReducers: (builder) => {
    builder.addCase(actionDeleteOneFromCart.rejected, (state, action) => {
      if (action.payload?.tokenExpired && action.payload?.tokenExpired === true) {
        state.modals.modalCartIsOpen = false;
        state.modals.burgerModalIsOpen = false;
        state.modals.confirmModalIsOpen = false;
        state.modals.modalCollectionFilterIsOpen = false;
      }
    });
  }
})

export const { toggleIsOpen, setIsOpen, setFilterValue, closeAllModal, setPopup } = ModalMenu.actions;
export default ModalMenu.reducer;

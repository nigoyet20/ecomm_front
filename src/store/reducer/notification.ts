import { createSlice } from "@reduxjs/toolkit";

// interface notification {
//   userId: number;
//   username: string;
//   fistname: string;
//   lastname: string;
//   address: string;
//   listAddress: CheckProfileAddressI[];
//   card: {
//     card_number: string,
//     expiration_date: string,
//     cvc: string,
//     card_name: string,
//     date: string,
//     total: string,
//     verif_code: string
//   },
//   status: string;
//   verifCode: string;
// }

interface notificationState {
  id: number | null;
}

const initialState: notificationState = {
  id: null,
};

const notificationSlice = createSlice({
  name: "waitingUsers",
  initialState,
  reducers: {
    setNotifId: (state, action) => {
      state.id = action.payload;
    },
  },
});

export const { setNotifId } = notificationSlice.actions;
export default notificationSlice.reducer;

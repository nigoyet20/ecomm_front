import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { CheckProfileAddressI } from "../../@types/account";

interface WaitingUser {
  userId: number;
  username: string;
  fistname: string;
  lastname: string;
  address: string;
  listAddress: CheckProfileAddressI[];
  card: {
    card_number: string,
    expiration_date: string,
    cvc: string,
    card_name: string,
    date: string,
    total: string,
    verif_code: string
  },
  status: string;
  verifCode: string;
}

interface WaitingUsersState {
  users: WaitingUser[];
}

const initialState: WaitingUsersState = {
  users: [],
};

const waitingUsersSlice = createSlice({
  name: "waitingUsers",
  initialState,
  reducers: {
    setWaitingUsers: (state, action: PayloadAction<WaitingUser[]>) => {
      state.users = action.payload;
    },
  },
});

export const { setWaitingUsers } = waitingUsersSlice.actions;
export default waitingUsersSlice.reducer;

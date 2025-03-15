import { createSelector } from "reselect";
import { RootState } from "../store";

const selectModalState = (state: RootState) => state.ModalMenu.modals;

export const selectModalVales = createSelector(
  [selectModalState],
  (modals) => Object.values(modals)
);
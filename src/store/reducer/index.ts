import accountSlice from './account';
import modalMenuSlice from './modal';
import productSlice from './product';
import cartSlice from './cart';
import orderSlice from './order';
import discountSlice from "./discount";
import notificationSlice from "./notification";
import affiliationSlice from "./affiliation"

const reducer = {
  account: accountSlice,
  ModalMenu: modalMenuSlice,
  product: productSlice,
  cart: cartSlice,
  order: orderSlice,
  discount: discountSlice,
  notification: notificationSlice,
  affiliation: affiliationSlice,
};

export default reducer;
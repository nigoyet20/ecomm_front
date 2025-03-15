import accountSlice from './account';
import modalMenuSlice from './modal';
import productSlice from './product';
import cartSlice from './cart';
import orderSlice from './order';
import discountSlice from "./discount";
import notificationSlice from "./notification";

const reducer = {
  account: accountSlice,
  ModalMenu: modalMenuSlice,
  product: productSlice,
  cart: cartSlice,
  order: orderSlice,
  discount: discountSlice,
  notification: notificationSlice,
};

export default reducer;
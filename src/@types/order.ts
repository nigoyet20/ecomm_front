import { CheckProfileAddressI } from "./account";
import { actionAddToCartPayloadI } from "./cart";
import { ProductInCartI } from "./product";

export interface OrderI {
  id?: number | null;
  total: string;
  productsOrder: ProductInCartI[];
  command_number: string;
  delivery_address: CheckProfileAddressI | null;
  created_at: string;
}

export interface OrderIS {
  id?: number | null;
  total: string;
  productsOrder: ProductInCartI[];
  command_number: string;
  delivery_address: string;
  created_at: string;
}

export interface OrderStateI {
  orders: OrderIS[],
  orderInput: OrderI;
}

export interface actionAddToOrderPayloadI {
  cart: actionAddToCartPayloadI[];
  total: string;
  command_number: string;
  delivery_address: string;
}

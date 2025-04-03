export interface CartStateI {
  cartVisitor: ProductI[];
  cartConnected: ProductI[];
  pending: boolean;
}

export interface actionAddToCartPayloadI {
  id?: number;
  productId: number;
  quantity: number;
  price: number;
  color: number;
  state: string;
  stockage: string;
  product?: ProductI;
}

export interface cartResponseI {
  account_id: number;
  id: number;
  productsCart: actionAddToCartPayloadI[];
}


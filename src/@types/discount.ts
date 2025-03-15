
export interface DiscountStateI {
  discounts: DisountI[];
  discountApplied: boolean;
  input: {
    code: string;
    discount: string;
  }
}

export interface DisountI {
  id: number;
  code: string;
  discount: number;
  discount_is_percentage: boolean;
}

export interface changeInputDiscountPayload {
  code: string;
  discount: string;
  products: number[];
}

export interface changeCheckOneDiscountPayload {
  code: string;
  accountId: number;
}

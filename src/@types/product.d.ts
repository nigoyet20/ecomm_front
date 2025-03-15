export interface ProductStateI {
  list: ProductI[];
  stateProduct: string[];
  stockageProduct: string[];
  getAllProductsPending: boolean;
}

export type ProductI = {
  id: number;
  name: string;
  brand: string | null;
  description: string;
  Prices: PriceI[];
  image_url: string[];
  color_name: string[];
  color_code: string[];
  Reviews: {
    id: number;
    rating: number;
    comment: string;
    author: string;
    date: string;
  }[];
};

export type ProductInCartI = {
  product: ProductI;
  color: number;
  state: string;
  stockage: string;
  price: string;
  quantity: number;
  id: number;
};

export type PriceI = {
  state: string;
  stockage: string;
  price: number;
}
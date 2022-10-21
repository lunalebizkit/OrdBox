export interface OrderList {
  order: string;
  supplier: string;
  date: Date;
  status: string;
}

export interface NewOrder {
  id: number;
  supplier: string;
  date: Date;
  isPaid: boolean;
  email: string;
  isSend: boolean;
  emailSecondary: string;
  isSendSecondary: boolean;
  product: string;
}

export interface OrderDetailList {
  stock: number;
  ownCode: number;
  code: number;
  productName: string;
  quantity: number;
  price: number;
  subTotal: number;
  iva: number;
}

export interface OrderDetails {
  id: number;
  ownCode?: number;
  invoiceId: number;
  productId: number;
  productName: string;
  productCode: number;
  quantity: number;
  price: number;
  iva: number;
}

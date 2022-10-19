export interface OrderAddModel {
  id: number;
  supplier: string;
  date: Date;
  isPaid: string;
  email: string;
  send: string;
  email2: string;
  send2: string;
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

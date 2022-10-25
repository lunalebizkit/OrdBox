export interface OrderList {
  id: number;
  supplierId: number;
  supplierName: string;
  date: Date;
  isPaid: boolean;
  email: string;
  statusId: number;
  orderDetail: OrderDetail[];
}

export interface NewOrder {
  id: number;
  supplierId: number;
  date: Date;
  isPaid: boolean;
  email: string;
  statusId: number;
  orderDetail: OrderDetail[];
}

export interface OrderDetailGrid {
  id: number;
  code: number;
  productName: string;
  quantity: number;
  price: number;
  subTotal: number;
}

export interface OrderDetail {
  id: number;
  supplierOrderId: number;
  productId: number;
  orderedQuantity: number;
  productName: string;
  statusId: number
}
export function orderDetailParser(value: any) {
  return {
    id: 0,
    supplierOrderId: 0,
    productId: value.id,
    productName: value.description,
    productCode: value.code,
    orderedQuantity: 1,
    statusId: 1
  }}
  export function orderGridParser(value: any) {
    return {
      code: value.code,
      id: value.id,
      productName: value.description,
      price: value.purchasePrice,
      quantity: 1,
     subTotal: value.purchasePrice * 1
    }}
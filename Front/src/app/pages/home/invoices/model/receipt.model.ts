export interface receiptModel {
  id: number;
  supplierId: number;
  userId: number;
  receiptNumber: number;
  supplierName: string;
  supplierCuit: string;
  supplierAddress: string;
  observation: string;
  dateTime: Date;
  total: number;
  ivaTotal: number;
  type: number;
  receiptDetails: receiptDetails[];
}

export interface receiptDetails {
  subTotal: number;
  //MODEL
  id: number;
  receiptId: number;
  productId: number;
  productName: string;
  productCode: number;
  quantity: number;
  price: number;
  iva: number;
}

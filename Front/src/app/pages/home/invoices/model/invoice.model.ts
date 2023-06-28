
export interface InvoiceModel {
    id: number;
    customerId: number;
    userId: number;
    invoiceNumber: number;
    customerName: string;
    customerCuit: string;
    customerAddress: string;
    observation: string;
    dateTime: Date;
    iva21:number;
    iva27:number;
    iva10:number;
    total: number;
    ivaTotal: number;
    type: number;
    ivaSelected: number;
    invoiceDetails: InvoiceDetails[]
}
export interface InvoiceDetails {
    id: number;
    invoiceId: number;
    productId: number;
    productName: string;
    productCode:number | null;
    quantity: number;
    price: number;
    iva: number;
    
  
}
export interface InvoiceDetailList {
    stock: number,
    productId:number;
    ownCode : number;
    code : number;
    productName: string;
    quantity: number;
    price: number;
    subTotal: number;
    iva: number ;
    
}
export function invoiceGridParser(value: any, iva: number, price: number) {
    return {
      stock: value.quantity,
      productId: value.id,
      code: value.code,
      ownCode: value.id,
      productName: value.description,
      price: price,
      quantity: 1,
      subTotal: price,
      iva: iva
    }}
    export function invoiceDetailParser(value: any, iva: number, price: number) {
        return {
          id: 0,
          invoiceId: 0,
          productId: value.id,
          productName: value.description,
          productCode: value.code,
          price: price,
          quantity: 1,
         iva: iva
        }}
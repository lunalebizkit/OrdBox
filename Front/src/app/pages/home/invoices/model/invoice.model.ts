
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
    total: number;
    ivaTotal: number;
    type: number;
    invoiceDetails: InvoiceDetails[]
}
export interface InvoiceDetails {
    id: number;
    invoiceId: number;
    productId: number;
    productName: string;
    productCode:number;
    quantity: number;
    price: number;
    iva: number;
}
export interface InvoiceDetailList {
    ownCode : number;
    code : number;
    productName: string;
    quantity: number;
    price: number;
    subTotal: number;
    iva: number ;
}

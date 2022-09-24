
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
    type: number;
    invoiceDetails: InvoiceDetails
}
export interface InvoiceDetails {
    id: number;
    invocieId: number;
    productId: number;
    productName: string;
    productCode:number;
    quantity: number;
    price: number;
    iva: number;
}
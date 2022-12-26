import { InvoiceDetails } from "../../invoices/model/invoice.model";

export interface InvoiceIvaReportModel{
    totalIva21: number,
    totalIva10:number,
    totalIva27:number,
    periodTotal:number,
    invoiceDetails: InvoiceIvaReportDetailsModel[]
}

export interface InvoiceIvaReportDetailsModel{
    id:number,
    invoiceNumber: number,
    customerName: string,
    customerCuit: string,
    dateTime: Date,
    total: number
    iva: number,
    iva10:number,
    iva21:number,
    iva27:number,
    type: number
}


import { InvoiceDetails } from "../../invoices/model/invoice.model";

export interface InvoiceIvaReportModel{
    TotalIva21: number,
    TotalIva10:number,
    TotalIva27:number,
    PeriodTotal:number,
    invoiceDetail: InvoiceDetails[]
}

export interface InvoiceIvaReportDetailsModel{
    id:number,
    InvoiceNumber: number,
    CustomerName: string,
    CustomerCuit: string,
    DateTime: Date,
    Total: number
    Iva: number,
    IvaType: string,
    Type: number
}


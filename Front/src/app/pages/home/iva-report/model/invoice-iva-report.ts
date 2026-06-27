
export interface InvoiceIvaReportModel{  
    periodTotal:number,
    dtoResponseIvaInvoices: InvoiceIvaReportDetailsModel[]
}

export interface InvoiceIvaReportDetailsModel{
    id:number,
    invoiceNumber: number,
    customerName: string,
    customerCuit: string,
    dateTime: Date,
    total: number,   
    type: number,  
    iva10:number,
    iva21:number,
    iva27:number,
    ivaTotal:number,
    importeNeto: number,
    importeNetoIva21: number,
    importeNetoIva10: number,
    importeNetoIva27: number,
}


export interface ReceiptIvaReportModel{  
    periodTotal:number,
    dtoResponseIvaReceipts: ReceiptIvaReportDetailsModel[]
}
export interface ReceiptIvaReportDetailsModel{
    id:number,
    invoiceNumber: number,
    supplierName: string,
    supplierCuit: string,
    total: number,   
    dateTime: Date,
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
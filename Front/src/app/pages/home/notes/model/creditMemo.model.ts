export interface  CreditMemoModel{
     id: number,
     customerId :number,
     userId: number,
     creditMemoNumb:number,
     customerName: string,
     customerCuit: string,
     customerAddress: string,
     observation: string,
     dateTime: Date,
     total: number,
     ivaTotal: number,
    creditMemoDetail: CreditMemoDetails[]
}
export interface CreditMemoDetails{
     id: number,
     creditId:number,
     productId:number,
     productName:string,
     productCode:number,
     quantity:number,
     price:number,
     iva:number
}
export interface CreditMemoDetailList {
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
 export function creditMemoGridParser(value: any, iva: number) {
     return {
       stock: value.quantity,
       productId: value.id,
       code: value.code,
       ownCode: value.id,
       productName: value.description,
       price: value.salePrice,
       quantity: 1,
       subTotal: value.salePrice,
       iva: iva
     }}

     export function creditMemoDetailParser(value: any, iva: number) {
         return {
           id: 0,
           creditId: 0,
           productId: value.id,
           productName: value.description,
           productCode: value.code,
           price: value.salePrice,
           quantity: 1,
          iva: iva
         }}   
         export function creditMemoGridFromInvoiceParser(value: any) {
          return {
            stock: value.quantity,
            productId: value.productId,
            code: value.productCode,
            ownCode: value.productId,
            productName: value.productName,
            price: value.price,
            quantity: value.quantity,
            subTotal: value.quantity * value.price,
            iva: value.iva
          }}
     
          export function creditMemoDetailFromInvoiceParser(value: any) {
              return {
                id: 0,
                creditId: 0,
                productId: value.productId,
                productName: value.productName,
                productCode: value.productCode,
                price: value.price,
                quantity: value.quantity,
                iva: value.iva
              }}  
     
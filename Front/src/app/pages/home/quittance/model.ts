export class quittanceModel{
    constructor(
        public id: number,
        public quittanceNumber:number,
        public customerName: string,
        public address: string,
        public customerCuit: string, 
        public dateTime:Date, 
        public amount :string,
        public concept: string, 
        public total: number,
        public cash: number,
        public quittanceDetails: quittanceDetails[],
        public quittanceProductDetails: QuittanceProductDetails[],
    ){}
 
}
export class quittanceDetails{
    constructor (
       public id: number,
       public quittanceId: number, 
       public total: number,
       public quantity: number, 
       public bank: string, 
       public checkNumber: string  
    ){}
   
}

export class QuittanceProductDetails {
    constructor (
    public id: number,
    public quittanceId: number,
    public productId: number,
    public productName: string,
    public productCode: number | null,
    public quantity: number,
    public price: number,
    public iva: number,){}
}
export interface QuittanceProductDetailList {
    stock: number,
    productId: number;
    ownCode: number;
    code: number;
    productName: string;
    quantity: number;
    price: number;
    subTotal: number;
    iva: number;

}
// Funcion para parsear datos al grid de pantalla
export function quittanceGridParser(value: any, iva: number) {
    return {
      stock: value.quantity,
      productId: value.id,
      code: value.code,
      ownCode: value.id,
      productName: value.description,
      price: value.cashSalePrice,
      quantity: 1,
      subTotal: value.cashSalePrice,
      iva: iva
}}

// Funcion para parsear los datos al modelo de DB
export function quittanceDetailParser(value: any, iva: number, quantity: number = 1) {
    return {
        id: 0,
        quittanceId: 0,
        productId: value.id,
        productName: value.description,
        productCode: value.code,
        price: value.cashSalePrice,
        quantity: quantity,
        iva: iva
    }
}
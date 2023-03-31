export interface BudgetsModel {
    id: number;
    userId: number;
    budgetNumber:number;
    customerName:string;
    customerCuit:string;
    customerAddress: string;
    observation: string;
    dateTime: Date;
    total: number;
    budgetDetails: BudgetDetails[]
}

export interface BudgetDetails {
    id: number;
    budgetId: number;
    productId: number;
    productName: string;
    productCode: string;
    quantity: number;
    price:number;
}
export interface BudgetDetailList {
    productCode: string,
    productId :number;
    ownCode : number;
    productName: string;
    quantity: number;
    price: number;
    subTotal: number;
}
//f
export function BudgetGridParser(value: any, price: number) {
    return {
      productId: value.id,
      productCode: value.code,
      ownCode: value.id,
      productName: value.description,
      price: price,
      quantity: 1,
      subTotal: price
    
    }}
    export function BudgetDetailParser(value: any, price: number) {
        return {
            id: 0,
            budgetId: 0,
            productId: value.id,
            productCode: value.code,
            productName: value.description,
            price: price,
            quantity: 1
         
    }}
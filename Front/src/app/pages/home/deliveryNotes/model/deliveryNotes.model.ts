export interface DeliveryNotesModel {
    id: number;
    deliveryNotes_number: number;
    dateTime: Date;
    supplierId: number;
    supplierName: string;
    supplierCuit: string;
    supplierAddress: string;
    statusId: number;
    cancelled: string;
    paid: string;
    observation: string;
    importTotal: number;
    deliveryNotesDetails: DeliveryNotesDetails[]

}
export interface DeliveryNotesDetails{
    id: number;
    deliveryNotesId: number;
    deliveryNotesNumber: number;
    productId: number;
    productName: string;
    quantity: number;
    price: number
}
export interface deliveryNotesDetailsList {
    productId: number;
    productName: string;
    quantity: number;
    price: number;
/*     subtotal:number */
  }
export function deliveryNotesGridParser(value: any, price:number ) {
    return {
      productId: value.id,
      productName: value.description,
      price: value.purchasePrice,
      quantity:1,
      subtotal: price, 
    };
  } export function deliveryNotesGridFromParser(value: any) {
    return {
      
        productId: value.productId,
        productName: value.productName,
        price: value.price,
        quantity: value.quantity,
       /*  subTotal: value.price * value.quantity */
    }}
  export function deliveryNotesDetailParser(value: any, price: number) {
    return {
      id: 0,
      deliveryNotesId: 0,
      deliveryNotesNumber: 0,
      productId: value.id,
      productName: value.description, 
      price: value.purchasePrice,
      quantity: 1,
    };
  }
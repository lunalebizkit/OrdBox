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
    recievedQuantity: number;
    price: number
}
export interface deliveryNotesDetailsGrid {
    productId: number;
    productName: string;
    quantity: number;
    price: number;
    subtotal:number;
    recievedQuantity: number;
  }
export function deliveryNotesGridParser(value: any, price:number ) {
    return {
      productId: value.id,
      productName: value.description,
      price: value.purchasePrice,
      quantity: 1,
      recievedQuantity: value.recievedQuantity,
      subtotal: price, 
    };
  }
  export function deliveryNotesDetailsGridParser(value: any, price:number ) {
    return {
      productId: value.id,
      productName: value.productName,
      price: value.price,
      quantity: 1,
      recievedQuantity: value.recievedQuantity,
      subtotal: price, 
    };
  }
  export function deliveryNotesProductParser(value: any) {
    return {
      productId: value.productId,
      productName: value.productName,
     quantity: value.quantity,
     recievedQuantity: value.recievedQuantity,
     price: value.price,
     /*  statusId: value.statusId, */
    };
  };

  export function deliveryNotesDetailParser(value: any, price: number) {
    return {
      id: 0,
      deliveryNotesId: 0,
      deliveryNotesNumber: 0,
      productId: value.id,
      productName: value.productName, 
      price: value.price,
      quantity: 1,
      recievedQuantity: value.recievedQuantity,
    };
  }
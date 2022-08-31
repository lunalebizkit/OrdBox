export interface ProductAddModel {
   
    id: number,
    description: string,
    code: number,
    category: number,
    brand: number,
    quantity: number,
    purchasePrice: number,
    salePrice: number,
    salePercentage: number,
    cardSalePrice: number,
    cardSalePercentage: number,
    cashSalePrice: number,
    cashSalePercentage: number,
    pointOrder: number,
    observation: string,
    supplier: number,
}
export interface Image {
    uid: string;
    isNew: boolean;
    name: string;
  }
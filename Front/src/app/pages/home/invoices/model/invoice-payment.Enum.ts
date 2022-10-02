export enum ePayment{
    cashSalePrice ='Contado',
    salePrice = 'Cuenta Corriente',
    cardSalePrice ='Tarjeta'
}

export const PaymentLabelMapping: Record<ePayment, string> = {
    [ePayment.cashSalePrice]: "Contado",
    [ePayment.salePrice]: "Cuenta Corriente",
    [ePayment.cardSalePrice]: "Tarjeta",
};
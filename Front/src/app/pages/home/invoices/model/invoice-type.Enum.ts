export const InvoiceType = [{ value: 1, label: 'A' },
{ value: 2, label: 'B' }];

export enum eInvoiceType {
  A = 1,
  B = 2,
  C = 3,
  EXENTO = 4,
}

export const IvaCondition = [{value: 1, label: 'Resp. Inscripto', disabled: true}, {value: 2, label: 'Consumidor final'}, {value: 3, label: 'Exento'}];

export enum eIvaCondition {
  RespInscrip = 1,
  ConsFinal = 2,
  Exento = 3,
}
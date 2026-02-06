export interface SearchCustomFilterModel {
   filter: {
      supplier: string,
      category: string,
      statusid: number,
      number: number,
      cuit: string,
      date: string,
      customerName: string
    },
    page: number,
    pageSize: number 
}

export const initialSearchFilter: SearchCustomFilterModel = {
  filter: {
    supplier: "",
    category: "",
    statusid: 0,
    number: 0,
    cuit: "",
    date: "",
    customerName: ""
  },
  page: 0,
  pageSize: 20
};

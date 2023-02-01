export interface SpecificFilter {
    filter: {
        supplier:string,
        category:string,
        statusid:number,
        number:number,
        cuit:string }
    page: number,
    pageSize: number
}
export interface  QueryParams {
    filter: string,
    page: number,
    pageSize: number,
};
import { ApiService } from "src/app/common/services/api.base.service";
import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { HttpHeaders } from "@angular/common/http";


@Injectable({
    providedIn: 'root',
})
export class InvoiceIvaReportService {
    constructor(private api: ApiService) { }
    /**
     * Obtiene una Periodo por Id
     * @param initPeriod 
     * @returns
     */
    public getListIvaVenta(initPeriod: any,endPeriod:any): Observable<any> {
      return this.api.get(`Iva/listIvaVenta?from=${initPeriod}&to=${endPeriod}`, false)
    }

    public getListIvaCompra(initPeriod: any,endPeriod:any): Observable<any> {
      return this.api.get(`Iva/listIvaCompra?from=${initPeriod}&to=${endPeriod}`, false)
    }
    
    public getReceiptIvaReport(initPeriod: any,endPeriod:any): Observable<any> {
      const headers = new HttpHeaders().set('Content-Type', 'application/json');
      return this.api.get(`Iva/ReceiptIvaReport?from=${initPeriod}&to=${endPeriod}`, false, {headers, responseType:'blob' as 'json'})
    }
    public getInvoiceIvaReport(initPeriod: any,endPeriod:any): Observable<any> {
      const headers = new HttpHeaders().set('Content-Type', 'application/json');
      return this.api.get(`Iva/InvoiceIvaReport?from=${initPeriod}&to=${endPeriod}`, false, {headers, responseType:'blob' as 'json'})
    }

    public getIvaVentasTxt(initPeriod: any,endPeriod:any): Observable<any> {
      const headers = new HttpHeaders().set('Content-Type', 'application/json');
      return this.api.get(`Invoice/ArchivoTxt?from=${initPeriod}&to=${endPeriod}`, false, {headers, responseType:'blob' as 'json'})
    }

    public getAlicuotaIva(initPeriod: any,endPeriod:any): Observable<any> {
      const headers = new HttpHeaders().set('Content-Type', 'application/json');
      return this.api.get(`Invoice/AlicuotaIvaTxt?from=${initPeriod}&to=${endPeriod}`, false, {headers, responseType:'blob' as 'json'})
    }
}
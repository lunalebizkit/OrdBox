import { ApiService } from "src/app/common/services/api.base.service";
import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';


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

   }
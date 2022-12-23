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
     * @param id
     * @returns
     */
    public getListIvaVenta(initPeriod:Date,endPeriod:Date): Observable<any> {
      return this.api.get(`listIvaVenta?from=${initPeriod}&to=${endPeriod}`, false)
    }
}
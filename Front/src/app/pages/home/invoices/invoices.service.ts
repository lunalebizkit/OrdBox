import { Injectable } from '@angular/core';
import { ApiService } from '../../../common/services/api.base.service';
import { Observable } from 'rxjs';
import { InvoiceModel } from './model/invoice.model';

@Injectable({
    providedIn: 'root'
})
export class InvoiceService {

    constructor(public api: ApiService) { }

        /**
   * Obtiene un Comprobante por Id
   * @param id
   * @returns
   */
  public getInvoiceById(id: number): Observable<any> {
    return this.api.get(`invoice?id=${id}`, false);
  }

     /**
   * Obtiene todos los Comprobantes
   * @param queryParams
   * @returns
   */
      public getInvoices(queryParams: any): Observable<any> {
        return this.api.post(`invoice/list`, queryParams, false);
      }

    /**
  * Guarda una Factura/Comprobante
  * @param model
  * @returns
  */
    public saveInvoice(model: InvoiceModel): Observable<any> {        
        return this.api.post(`invoice`, model, false);        

    }

};
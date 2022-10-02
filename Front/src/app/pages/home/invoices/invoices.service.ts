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
  * Guarda una Factura/Comprobante
  * @param model
  * @returns
  */
    public saveInvoice(model: InvoiceModel): Observable<any> {        
        return this.api.post(`invoice`, model, false);        

    }

};
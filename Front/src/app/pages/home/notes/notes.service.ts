import { Injectable } from '@angular/core';
import { ApiService } from '../../../common/services/api.base.service';
import { Observable } from 'rxjs';
import { CreditMemoModel } from './model/creditMemo.model';
import { DebitMemoModel } from './model/debitMemo.model';



@Injectable({
  providedIn: 'root',
})
export class NoteService {
  constructor(public api: ApiService) {}

  /**
   * Obtiene un Comprobante por Id
   * @param id
   * @returns
   */
  public getInvoiceById(id: number): Observable<any> {
    return this.api.get(`invoice?id=${id}`, false);
  }

  public getCreditMemoById(id: number): Observable<any> {
    return this.api.get(`CreditMemo?id=${id}`, false);
  }

  public getCreditMemo(queryParams: any): Observable<any> {
    return this.api.post(`CreditMemo/List`, queryParams, false);
  }

  public saveCreditMemo(model: CreditMemoModel): Observable<any> {
      return this.api.post(`CreditMemo`, model, false);
  }

/*   servicio notas de debito */

  public getDebitMemoById(id: number): Observable<any> {
    return this.api.get(`DebitMemo?id=${id}`, false);
  }

  public getDebitMemo(queryParams: any): Observable<any> {
    return this.api.post(`DebitMemo/List`, queryParams, false);
  }

  public saveDebitMemo(model: DebitMemoModel): Observable<any> {
      return this.api.post(`DebitMemo`, model, false);
  }

}
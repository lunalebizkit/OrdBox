import { Injectable } from '@angular/core';
import { ApiService } from '../../../common/services/api.base.service';
import { Observable } from 'rxjs';
import { CreditMemoModel } from './model/creditMemo.model';



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

}
import { Injectable } from '@angular/core';
import { ApiService } from '../../../common/services/api.base.service';
import { Observable } from 'rxjs';



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
}
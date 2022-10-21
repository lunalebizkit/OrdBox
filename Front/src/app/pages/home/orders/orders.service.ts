import { Injectable } from '@angular/core';
import { ApiService } from './../../../common/services/api.base.service';
import { Observable } from 'rxjs';
import { NewOrder } from './models/order.model';

@Injectable({
  providedIn: 'root',
})
export class OrdersService {
  /**
   * Constructor
   */
  constructor(public api: ApiService) {}

  /**
   * Guarda un pedido
   * @param model
   * @returns
   */
  public saveOrder(model: NewOrder): Observable<any> {
    if (model.id === 0) {
      return this.api.post(`supplierorder`, model, false);
    } else {
      return this.api.put(`supplierorder`, model, false);
    }
  }
}

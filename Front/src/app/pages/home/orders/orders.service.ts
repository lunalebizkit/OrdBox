import { Injectable } from '@angular/core';
import { ApiService } from './../../../common/services/api.base.service';
import { Observable } from 'rxjs';
import { NewOrder } from './models/order.model';
import { SendOrderEmail } from './models/sendorderemail.model';

@Injectable({
  providedIn: 'root',
})
export class OrdersService {
  /**
   * Constructor
   */
  constructor(public api: ApiService) {}

  /**
   * Obtiene todos los productos por query text
   * @param queryParams
   * @returns
   */
  public getOrders(queryParams: any): Observable<any> {
    return this.api.post(`supplierorder/list`, queryParams, false);
  }

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
  /**
   * Guarda un pedido y envia el correo
   * @param model
   * @returns
   */
  public saveOrderAndSendEmail(model: NewOrder): Observable<any> {
    if (model.id === 0) {
      return this.api.post(`supplierOrder/orderandemail`, model, false);
    } else {
      return this.api.put(`supplierOrder/orderandemail`, model, false);
    }
  }

  /** 
   * Obtiene un producto por ID
   * @param id
   * @returns
   */
  public getById(id: string | number): Observable<any> {
    return this.api.get(`SupplierOrder?id=${id}`, false);
  }
  /**
   * Envia email por ID
   * @param id
   * @returns
   */
  public sendEmail(model: SendOrderEmail): Observable<any> {
    return this.api.post(`SupplierOrder/email`, model, false);
  }
  

}

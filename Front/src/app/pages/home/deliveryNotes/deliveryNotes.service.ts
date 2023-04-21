import { ApiService } from "src/app/common/services/api.base.service";
import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { DeliveryNotesModel } from "./model/deliveryNotes.model";

@Injectable({
    providedIn: 'root',
})
export class deliveryNotesService {
    constructor(private api: ApiService) { }
     /**
     * Obtiene un remito por Id
     * @param id
     * @returns
     */
    public getDeliveryNotesById(id: number): Observable<any> {
      return this.api.get(`deliveryNotes?id=${id}`, false)
    }
    /**
   * Obtiene todos los Comprobantes
   * @param queryParams
   * @returns
   */
  public getDeliveryNotes(queryParams: any): Observable<any> {
    return this.api.post(`deliveryNotes/list`, queryParams, false);
  }

    /**
    * Obtiene los remitos por filtro
    * @param data
    * @returns
    */
    public getByFilter(data: any): Observable<any> {
        return this.api.post(`deliveryNotes/list`, data, false);
    }
    
    /**
     * Guarda un remito
     * @param id
     * @returns
     */
     public saveDeliveryNotes(model: DeliveryNotesModel): Observable<any> {
        if (model.id === 0) {
          return this.api.post(`deliveryNotes`, model, false);
        } else {
          return this.api.put(`deliveryNotes`, model, false);
        }
      }
}
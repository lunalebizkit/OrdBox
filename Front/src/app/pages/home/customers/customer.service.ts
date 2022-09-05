import { Injectable } from '@angular/core';
import { ApiService } from '../../../common/services/api.base.service';
import { Observable } from 'rxjs';
import { CustomerModel } from './model/customer.model';
import { CustomerAddModel } from './model/customer.add.model';

@Injectable({
  providedIn: 'root'
})
export class EntityService {
  /**
   * Constructor
   */
  constructor(public api: ApiService) {
  }
   /**
   * Obtiene todas los Proveedores
   * @param queryParams
   * @returns
   */
    public getSuppliers(queryParams: any): Observable<any> {
      return this.api.post(`Supplier/list`, queryParams, false);
    }
      /**
   * Obtiene un proveedor por Id
   * @param id
   * @returns
   */
  public getSupplierById(id: number): Observable<any> {
    return this.api.get(`supplier?id=${id}`, false);
  }

    /**
   * Guarda un Proveedor
   * @param model
   * @returns
   */
     public saveSupplier(model: CustomerAddModel): Observable<any> {
      if (model.id === 0) {
        return this.api.post(`supplier`, model, false);
      } else {
        return this.api.put(`supplier`, model, false);
      }
    }
  /**
   * Obtiene todas las entidades
   * @param queryParams
   * @returns
   */
  public getEntities(queryParams: any): Observable<any> {
    return this.api.post(`Customer/list`, queryParams, false);
  }
  

  /**
   * Obtiene una entidad por Id
   * @param id
   * @returns
   */
  public getById(id: string | number): Observable<any> {
    return this.api.get(`Customer?id=${id}`, false);
  }

  

  /**
   * Guarda una Entidad
   * @param model
   * @returns
   */
  public saveEntity(model: CustomerAddModel): Observable<any> {
    if (model.id === 0) {
      return this.api.post(`Customer`, model, false);
    } else {
      return this.api.put(`Customer`, model, false);
    }
  }



}

import { ApiService } from "src/app/common/services/api.base.service";
import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { PeriodsModel } from "./model/periods.model";

@Injectable({
    providedIn: 'root',
})
export class PeriodsService {
    constructor(private api: ApiService) { }
     /**
     * Obtiene una Periodo por Id
     * @param id
     * @returns
     */
    public getById(id: number): Observable<any> {
      return this.api.get(`period?id=${id}`, false)
    }

    /**
    * Obtiene las Periodo por filtro
    * @param data
    * @returns
    */
    public getByFilter(data: any): Observable<any> {
        return this.api.post(`period/list`, data, false);
    }
    
    /**
     * Guarda una Periodo
     * @param id
     * @returns
     */
     public savePeriod(model: PeriodsModel): Observable<any> {
        if (model.id === 0) {
          return this.api.post(`period`, model, false);
        } else {
          return this.api.put(`period`, model, false);
        }
      }
}
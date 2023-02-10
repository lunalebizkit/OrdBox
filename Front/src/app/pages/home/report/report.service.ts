import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from 'src/app/common/services/api.base.service';

@Injectable({
  providedIn: 'root'
})
export class ReportService {

  constructor(private api: ApiService) { }

  //Llamamos al afuncion

  public reportZ(): Observable<any>{
    return this.api.get('ReporteZ')
  }
}

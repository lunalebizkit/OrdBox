import { Component, OnInit } from '@angular/core';
import { NzTableQueryParams } from 'ng-zorro-antd/table';
import { CommonResponse } from 'src/app/common/models/commonResponse.model';
import { environment } from 'src/environments/environment';
import { EntityService } from '../../customers/customer.service';
import { CustomerModel } from '../../customers/model/customer.model';


@Component({
    selector: 'app-suppliers-list',
    templateUrl: './suppliers-list.component.html',
    styleUrls: ['./suppliers-list.component.css']
  })
  export class SuppliersListComponent implements OnInit {


  
  /*
  ** Catidad total de entidades
  */
  totalItems = 0;
  /*
  ** Indicador de carga de la grilla
  */
  loading = false;
  /*
  ** Lista de Productos
  */
  entityList: CustomerModel[] = [];
    /*
  ** Parametros de busqueda
  */
  queryParams = {
    filter: '',
    page: 0,
    pageSize: 10
  };

      /*
  ** Constructor
  */
  constructor(private service: EntityService) {
    
}
 /*
  ** Evento de inicio de angular
  */
  ngOnInit(): void {
    this.getData(this.queryParams);
  }
  /*
  ** Evento al presionar buscar o presionar enter
  */
  search(): void {
    this.queryParams.page = 0;
     this.getData(this.queryParams);
  }
  /*
  ** Evento que se ejecuta ante algun cambio en la grillas (sorting,paging or filtering)
  */
  onQueryParamsChange(params: NzTableQueryParams): void {
    this.queryParams.filter = localStorage.getItem('entidadtListFilter')!;
    this.queryParams.page = params.pageIndex -1;
    this.queryParams.pageSize = params.pageSize;
     this.getData(this.queryParams);
  }
    /*
  ** Evento de busqueda datos en el server
  */
 
  getData(params: any): void {
    this.loading = true;
    this.service.getSuppliers(params).subscribe({
      next: (r)=>{
        this.entityList= r.data;
        this.totalItems = r.totalCount;
        this.loading = false;
      },
      error: ()=>{
        this.loading = false;
        this.entityList = [];
      }
    })}
    


  }
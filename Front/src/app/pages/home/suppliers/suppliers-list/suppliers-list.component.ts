import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NzTableQueryParams } from 'ng-zorro-antd/table';
import { EntityService } from '../../customers/customer.service';
import { CustomerModel } from '../../customers/model/customer.model';


@Component({
    selector: 'app-suppliers-list',
    templateUrl: './suppliers-list.component.html',
    styleUrls: ['./suppliers-list.component.css']
  })
  export class SuppliersListComponent implements OnInit {
    selectedIndex: number = 0; 
    selectedSuppliers: any;
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
  constructor(private service: EntityService, private router: Router) {
    
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
/*   onQueryParamsChange(params: NzTableQueryParams): void {
    this.queryParams.page = params.pageIndex -1;
    this.queryParams.pageSize = params.pageSize;
     this.getData(this.queryParams);
  } */
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

      /*
  ** Evento de selección de fila y navegación en las tablas por teclado
  */  
    onDoubleClicked (datos:any) {
      var data = datos.id
      this.router.navigate(['home/suppliers/edit/', data]); 
    }
    onClick(datos:any, index:number): void {
      this.selectedIndex = index 
      this.selectedSuppliers = datos;
    }  
    onKeyPress( datos:any) {
      var data = datos.id
      this.router.navigate(['home/suppliers/edit/', data]);
    }
    myNavegation(event:any) {
      switch (event.key) {
        case "ArrowDown":
          let nextCell = this.entityList.length > this.selectedIndex ? ++ this.selectedIndex : this.entityList.length;
          if(this.entityList[nextCell] !== undefined){
            this.selectedSuppliers= this.entityList[nextCell];  
        } 
          break; 
        case "ArrowUp":
          let previousCell= this.selectedIndex > 0 ? -- this.selectedIndex : 0; 
          if (this.entityList[previousCell] !== undefined ){
            this.selectedSuppliers= this.entityList[previousCell];
        }
          break 
      } 
    
    }  
    onScroll(event:any): void { 
      let scrollHeight= event.target.scrollHeight;
      let scrolltop= event.target.scrollTop;
      let client= event.target.clientHeight
      let ScrollPosition= scrollHeight - (scrolltop + client);
      if((ScrollPosition === 0 || ScrollPosition === -1 ) && (this.totalItems / this.queryParams.page) > this.queryParams.page){ 
      this.queryParams.page= this.queryParams.page +1; 
        if(this.totalItems === undefined ||(this.queryParams.page * this.queryParams.pageSize <= this.totalItems)){ 
          this.service.getSuppliers(this.queryParams)
          .subscribe({
            next:(r)=>{
              r.data.map((product: CustomerModel)=>
              this.entityList.push(product))  
              this.loading= false 
            },
            error: ()=>{  this.loading = false;
            this.entityList= [];}
          }) 
        }
      }
    } 


  }
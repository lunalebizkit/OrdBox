import { Component, ElementRef, OnInit, QueryList, ViewChildren } from '@angular/core';
import { Router } from '@angular/router';
import { NzTableQueryParams } from 'ng-zorro-antd/table';
import { EntityService } from '../customer.service';
import { CustomerModel } from '../model/customer.model';

@Component({
    selector: 'app-customers-list',
    templateUrl: './customers-list.component.html',
    styleUrls: ['./customers-list.component.css']
  })
  export class CustomersListComponent implements OnInit {
    @ViewChildren('td') cells!: QueryList<ElementRef>;

    selectedIndex: number = 0; 
    selectedCustomers: any;
  /*
  ** Catidad total de entidades
  */
  totalItems!: number;
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
    pageSize: 50
  };

      /*
  ** Constructor
  */
  constructor(private service: EntityService, private router: Router){
    
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
  };
  /*
  ** Evento que se ejecuta ante algun cambio en la grillas (sorting,paging or filtering)
  */
 /*  onQueryParamsChange(params: NzTableQueryParams): void {
    this.queryParams.page = params.pageIndex -1;
    this.queryParams.pageSize = params.pageSize;
     this.getData(this.queryParams);
  }; */
    /*
  ** Evento de busqueda datos en el server
  */
 
  getData(params: any): void {
    this.loading = true;
    this.service.getCustomers(params).subscribe({
      next: (r)=>{
        this.entityList= r.data;
        this.totalItems = r.totalCount;
        this.loading = false;
      },
      error: ()=>{
        this.loading = false;
        this.entityList = [];
      }
    })};
  
    onDoubleClicked (datos:any) {
      var data = datos.id
      this.router.navigate(['home/customers/edit/', data]); 
    }
    onClick(datos:any, index:number): void {
      this.selectedIndex = index 
      this.selectedCustomers = datos;
    }  
    onKeyPress( datos:any) {
      var data = datos.id
      this.router.navigate(['home/customers/edit/', data]);
    }
    myNavegation(event:any) {
      switch (event.key) {
        case "ArrowDown":
          let nextCell = this.entityList.length > this.selectedIndex ? ++ this.selectedIndex : this.entityList.length;
          if(this.entityList[nextCell] !== undefined){
            this.selectedCustomers= this.entityList[nextCell];  
        } 
          break; 
        case "ArrowUp":
          let previousCell= this.selectedIndex > 0 ? -- this.selectedIndex : 0; 
          if (this.entityList[previousCell] !== undefined ){
            this.selectedCustomers= this.entityList[previousCell];
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
          this.service.getCustomers(this.queryParams)
          .subscribe({
            next:(r)=>{
              r.data.map((data: CustomerModel)=>
              this.entityList.push(data))  
              this.loading= false 
            },
            error: ()=>{  this.loading = false;
            this.entityList= [];}
          }) 
        }
      }
    }   


  }
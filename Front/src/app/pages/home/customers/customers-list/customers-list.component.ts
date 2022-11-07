import { Component, ElementRef, OnInit, QueryList, ViewChildren } from '@angular/core';
import { NzDrawerService } from 'ng-zorro-antd/drawer';
import { NzTableQueryParams } from 'ng-zorro-antd/table';
import { EntityService } from '../customer.service';
import { CustomersEditDrawerComponent } from '../customers-edit-drawer/customers-edit.drawer.component';
import { CustomerModel } from '../model/customer.model';

@Component({
    selector: 'app-customers-list',
    templateUrl: './customers-list.component.html',
    styleUrls: ['./customers-list.component.css']
  })
  export class CustomersListComponent implements OnInit {
    @ViewChildren('td') cells!: QueryList<ElementRef>;

  
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
  id!:number;
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
  constructor(private service: EntityService,
    private drawerService: NzDrawerService) {
    
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
  onQueryParamsChange(params: NzTableQueryParams): void {
    this.queryParams.page = params.pageIndex -1;
    this.queryParams.pageSize = params.pageSize;
     this.getData(this.queryParams);
  };
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

    openComponentCustomerEdit(): void {
      const drawerRefCustomer = this.drawerService.create<CustomersEditDrawerComponent, { filter: number}, number>({
        nzContent: CustomersEditDrawerComponent,
        nzSize: 'large',
        nzContentParams: {
          filter: this.id > 0 ? this.id : 0
        },
        nzClosable: false
      });
      drawerRefCustomer.afterClose.subscribe({         
        next: (data) => {    
          this.id= 0;
          if (data != undefined && data != 0) {
            this.service.getById(data).subscribe({
              next: (r: CustomerModel) =>{
                this.entityList[this.entityList.findIndex(r => r.id == data)] != undefined ?            
               this.entityList[this.entityList.findIndex(r => r.id == data)] = r :
               this.entityList.push(r);                     
              },
              error: ()=>{
                this.id= 0;
              }
            })
          }
        },
        error: () => {
          this.id= 0;
         }
      })
    };

    onDoubleClicked (datos:any) {
      this.id = datos.id;
      this.openComponentCustomerEdit();
    }

  }
import { style } from '@angular/animations';
import { Component, OnInit, HostListener} from '@angular/core';
import { EventManager } from '@angular/platform-browser';
import { RouterLinkWithHref } from '@angular/router';
import { id_ID } from 'ng-zorro-antd/i18n';
import { NzTableQueryParams } from 'ng-zorro-antd/table';
import { CommonResponse, DtoPagination } from 'src/app/common/models/commonResponse.model';
import { environment } from 'src/environments/environment';
import { ProductsModel } from '../model/product.model';
import { ProductService } from '../product.service';

@Component({
  selector: 'app-products-list',
  templateUrl: './products-list.component.html',
  styleUrls: ['./products-list.component.css']
})
export class ProductsListComponent implements OnInit {
  /* selectedRow = 0; */
  
/*
  ** Listado de los productos
  */
  productList: ProductsModel[] = [];

  /*
  ** Indicador de carga de la grilla
  */
  loading = false;

  /*
  ** Catidad total de productos
  */
  totalItems = 0;

  /*
  ** Lista de marcas
  */
  brandsList = [];

  /*
  ** Lista de Productos
  */
  productLinesList = [];

  /*
  ** Indicador de carga de marcas y lineas
  */
  loadingBrands!: boolean;

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
  constructor(private service: ProductService) {
    
   }

  /*
  ** Evento de inicio de angular
  */
  ngOnInit(): void {
    this.getData(this.queryParams);
  }

  /*
  ** Evento que se ejecuta ante algun cambio en la grillas (sorting,paging or filtering)
  */
  onQueryParamsChange(params: NzTableQueryParams): void {
    this.queryParams.filter = localStorage.getItem('productListFilter')!;
    this.queryParams.page = params.pageIndex -1;
    this.queryParams.pageSize = params.pageSize;
    this.getData(this.queryParams);
  }

  /*
  ** Evento de busqueda datos en el server
  */
 
  getData(params: any): void {
    this.loading = true;
    this.service.getProducts(params).subscribe({
      next: (r:DtoPagination<ProductsModel>)=>{
        this.productList= r.data;
        this.totalItems = r.totalCount;
        this.loading = false;
      },
      error: ()=>{
        this.loading = false;
        this.productList = [];
      }
    })}
    

  /*
  ** Evento al presionar buscar o presionar enter
  */
  search(): void {
    this.queryParams.page = 0;
    this.getData(this.queryParams);
  }
  
  selectedRowIndex:number = 0;
 
    UP_ARROW: number =38;
    DOWN_ARROW: number = 40;

  index : number=0;
  highlight(index:number){ 
    this.selectedRowIndex= this.index;
    console.log( this.index--) 
}
  highlight1(index:number){ 
    this.selectedRowIndex = this.index;
    console.log( this.index ++) 
}
}
/*  export enum KEY_CODE {
  UP_ARROW = 38,
  DOWN_ARROW = 40
} 
@Component({
  template: ''
}) 
export class desplazar {
  id = 0;
  constructor() {}


  @HostListener('window:keydown', ['$event'])
  keyEvent(event: KeyboardEvent) {
    console.log(event);

    if (event.code=== KEY_CODE.DOWN_ARROW) {
      this.increment();
    }

    if (KEY_CODE === KEY_CODE.UP_ARROW) {
      this.decrement();
    }
  }

  increment() {
    this.id++;
  }

  decrement() {
    this.id --;
  }

 
}

 */
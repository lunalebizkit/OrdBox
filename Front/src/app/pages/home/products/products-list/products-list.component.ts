import { Component, OnInit } from '@angular/core';
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




}

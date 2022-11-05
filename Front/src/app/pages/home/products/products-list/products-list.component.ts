import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NzTableQueryParams } from 'ng-zorro-antd/table';
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
    PageSize:100,   
  };

  /*
  ** Constructor
  */
  constructor(private service: ProductService, private router: Router) {

  }
  selectedIndex: number = 0; 
  selectedProduct: any;

  /*
  ** Evento de inicio de angular
  */
  ngOnInit(): void {

  }

  /*
  ** Evento que se ejecuta ante algun cambio en la grillas (sorting,paging or filtering)
  */
  onQueryParamsChange(params: NzTableQueryParams): void {
    this.queryParams.filter = localStorage.getItem('productListFilter')!;
     this.queryParams.page = params.pageIndex - 1;
    this.queryParams.PageSize = params.pageSize;    
    this.getData(this.queryParams);
  } 

  /*
  ** Evento de busqueda datos en el servers
  */

 getData(params: any): void {
    this.loading = true;
    this.service.getProducts(params).subscribe({
      next: (r) => {
        this.productList = r.data;
        this.totalItems = r.totalCount;
        this.loading = false;
      },
      error: () => {
        this.loading = false;
        this.productList = []; 
      }
    })
  } 
  /*
  ** Evento al presionar buscar o presionar enter
  */
  
  search(): void { 
   this.queryParams.page=0; 
    this.getData(this.queryParams); 
 
  }; 
  onDoubleClicked (datos:any) {
  var data = datos.id
  this.router.navigate(['home/products/edit/', data]); 
  }
  onClick(datos:any, index:number): void {
  this.selectedIndex = index 
  this.selectedProduct = datos;
  }  
  onKeyPress( datos:any) {
    var data = datos.id
    this.router.navigate(['home/products/edit/', data]); 
  } 

 /*
  ** Evento navegaciòn por teclado en tablas
  */

  myNavegation(event:any) {
    switch (event.key) {
      case "ArrowDown":
        let nextCell = this.productList.length > this.selectedIndex ? ++ this.selectedIndex : this.productList.length;
        if(this.productList[nextCell] !== undefined){
          this.selectedProduct= this.productList[nextCell];  
      } 
        break; 
      case "ArrowUp":
        let previousCell= this.selectedIndex > 0 ? -- this.selectedIndex : 0; 
        if (this.productList[previousCell] !== undefined ){
          this.selectedProduct= this.productList[previousCell];
      }
        break 
    } 
  }

 /*
  ** Evento de scroll infinito
  */
  onScroll(event:any): void { 
    let scrollHeight= event.target.scrollHeight;
    let scrolltop= event.target.scrollTop;
    let client= event.target.clientHeight
    let ScrollPosition= scrollHeight - (scrolltop + client);
    if((ScrollPosition === 0 || ScrollPosition === -1 ) && (this.totalItems / this.queryParams.page) > this.queryParams.page){ 
    this.queryParams.page= this.queryParams.page +1; 
      if(this.totalItems === undefined ||(this.queryParams.page * this.queryParams.PageSize <= this.totalItems)){ 
        this.service.getProducts(this.queryParams)
        .subscribe({
          next:(r)=>{
            r.data.map((product: ProductsModel)=>
            this.productList.push(product))  
            this.loading= false 
          },
          error: ()=>{  this.loading = false;
          this.productList= [];}
        }) 
      }
    }
  } 
}

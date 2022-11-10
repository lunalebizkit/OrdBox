import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NzDrawerService } from 'ng-zorro-antd/drawer';
import { NzTableQueryParams } from 'ng-zorro-antd/table';
import { ProductsModel } from '../model/product.model';
import { ProductService } from '../product.service';
import { ProductsEditDrawerComponent } from '../products-edit-drawer/products-edit.drawer.component';


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
   ** id del usuario a editar, si es nuevo...
   */
   id!: number;

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
    PageSize:50,   
  };
  formProductsEditComponent: any;

  /*
  ** Constructor
  */
  constructor(private service: ProductService,
     private router: Router,
     private drawerService: NzDrawerService) {

  }

  selectedIndex: number = 0; 
  selectedProduct: any;
  productId!:number |null; 

  /*
  ** Evento de inicio de angular
  */
  ngOnInit(): void {
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
  this.id = datos.id
  this.openComponentProductsEdit();
  }
  onClick(datos:any, index:number): void {
  this.selectedIndex = index 
  this.selectedProduct = datos
  }  
  onEnter( data:any, index:number) {
    var datos = data.id
    console.log(data, index)
    this.router.navigate(['home/products/edit/', datos]); 
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
    let ScrollPosition= Math.abs(Math.round(scrollHeight - (scrolltop + client)));
    if((ScrollPosition <=5 ) && (this.totalItems / this.queryParams.page) > this.queryParams.page){ 
      let page= this.queryParams.page;
      this.queryParams.page = this.queryParams.page +1;  
      console.log(this.queryParams.page)
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
      }else{
        this.queryParams.page = page;  
      }
    }
  };
  openComponentProductsEdit(): void {
    const drawerRefCustomer = this.drawerService.create<ProductsEditDrawerComponent, { filter: number}, number>({
      nzContent: ProductsEditDrawerComponent,
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
            next: (r: ProductsModel) =>{
              this.productList[this.productList.findIndex(r => r.id == data)] != undefined ?            
             this.productList[this.productList.findIndex(r => r.id == data)] = r :
             this.productList.push(r);                     
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
}

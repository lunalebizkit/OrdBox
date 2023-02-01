import { Component, ElementRef, Inject, LOCALE_ID, OnInit, ViewChild } from '@angular/core';

import { ProductsModel } from '../model/product.model';
import { ProductService } from '../product.service';
import {  UpdatePriceProduct } from '../model/update.price.product';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NzMessageService } from 'ng-zorro-antd/message';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BaseComponent } from 'src/app/common/components/base/base.component';
import { CategoriesService } from '../../categories/category.services';
import { BrandsService } from '../../brands/brands.services';
import { EntityService } from '../../customers/customer.service';
import { HeaderOperationsButtonsComponent } from 'src/app/common/components/headers/buttons.oparations.header.component';
import { PopupConfirmationComponent } from 'src/app/common/components/popup-confirmation/popup-confirmation.component';
import { formatCurrency } from '@angular/common';

@Component({
  selector: 'app-products-list',
  templateUrl: './update-price-products.component.html',
  styleUrls: ['./update-price-products.component.css']
})
export class UpdatePriceProductsComponent extends BaseComponent implements OnInit {
 
  @ViewChild('header') headerComponent!: HeaderOperationsButtonsComponent;
  @ViewChild('popup') popupComponent!: PopupConfirmationComponent;
/*
  ** Listado de los productos
  */
  productList: ProductsModel[] = [];
  selectedValue = null;

  /*
  ** Indicador de carga de la grilla
  */
  loading = false;
  isLoading=false;

  /*
  ** Catidad total de productos
  */
  totalItems = 0;
  timeout!: any;
  /*
  ** Lista de opciones a actualizar
  */
  updateList= [ {value:1 , label:'Se incrementa el Precio Costo en un valor de'},
  {value:2 , label:'Se incrementa el precio en un porcentaje de'}, 
  {value:3 , label:'Se incrementa el Precio Efectivo en un porcentaje de'}, 
  {value:4 , label:'Se incrementa el Precio Tarjeta en un porcentaje de '}, 
  {value:5 , label:'Se incrementa el Precio Lista en un porcentaje de'}];

  /*
  ** Lista de Productos
  */
 
  productLinesList = [];
  allCategories = [];
  allBrands= [];
  allSuppliers: { value: string, label: string }[] = [];
  /*
  ** Indicador de carga de marcas y lineas
  */
  loadingBrands!: boolean;
  isLoadingCategory = false;
   isLoadingBrand = false;
   isSaving= false;
  /*
  ** Parametros de busqueda
  */
  queryParams = {
    filter: {
      product:'',
      brand: 0,
      category: 0,
      status: 0,
      supplier:[]},
    page: 0,
    pageSize: 50
  };
  queryData = {
    filter: '',
    page: 0,
    pageSize: 50
  };

  /* Opcion Seleccionada */
  optionSelected: any = null;
  categorySelected: any = null;
  brandSelected: any = null;
  supplierSelected:any= [];
  form!: FormGroup;
  formSearch!: FormGroup;
  
  selectedIndex: number = 0; 
  selectedProduct: any;
  productId!: number;
  /*
  ** Constructor
  */
  constructor(
    private service: ProductService,
    private serviceCategory: CategoriesService,
    private serviceBrand: BrandsService,
    private serviceEntity: EntityService,
    notificacionService: NzNotificationService,
    el: ElementRef,
    message: NzMessageService,
    private route: ActivatedRoute,
    private fb: FormBuilder,    
    private router: Router,
    @Inject(LOCALE_ID) public locale: string)
     {
    super(notificacionService, el, message);
    this.form = this.fb.group({
      idPrice: ['', [Validators.required]],
      value: [0, [Validators.required]]
      
    }),
    this.formSearch = this.fb.group({
      product: ['', ],
      brand: [0, ],
       supplier: [[], ],
       category: [0, ]     
    })
   }

  /*
  ** Evento de inicio de angular
  */
  ngOnInit(): void {
    this.getAllCategories();
    this.getAllBrands();
  } 
  /*Evento de Actualizar los productos */
  update(): void{       
    if (this.isValidForm(this.form)){
      const model: UpdatePriceProduct={
        idPrice: this.form.controls['idPrice'].value,
        value: this.form.controls['value'].value,
        product: this.formSearch.controls['product'].value,
        brand: this.formSearch.controls['brand'].value,        
        category: this.formSearch.controls['category'].value,
        supplier:this.formSearch.controls['supplier'].value
      }
      this.service.UpdatePriceProduct(model).subscribe({
        next: (r) => {
          this.showNotificationSuccess(
            'Guardado correcto',
            `Se Actualizo correctamente los Productos`
          );
          this.isSaving = false;
          this.search();          
        },
        error: () => {
          this.isSaving = false;
          this.showMessageError('No se pudo Actualizar los Productos')
        }
      })
    } else{
      this.showMessageError('No Selecciono Parametros de Actualización')
    }
  };


  getAllCategories(): void {
    this.isLoadingCategory = true;
    this.serviceCategory.getByFilter(this.queryData).subscribe({
      next: (r) => {
        this.isLoadingCategory = false;
        this.allCategories = r.data.map((category: { id: any, description: any }) => { return { value: category.id, label: category.description } });

      },
      error: () => {
        this.isLoadingCategory = false;
        this.allCategories = []
      }
    })
  }
  getAllBrands(): void {
    this.isLoadingBrand = true;
    this.serviceBrand.getByFilter(this.queryData).subscribe({
      next: (r) => {
        this.isLoadingBrand = false;
        this.allBrands = r.data.map((brand: { id: any, description: any }) => { return { value: brand.id, label: brand.description } });
      },
      error: () => {
        this.isLoadingBrand = false;
        this.allBrands = []
      }
    })
  };
  
  getAllSupplier(): void {
    this.serviceEntity.getSuppliers(this.queryData).subscribe({
      next: (r) => {
        this.allSuppliers = r.data.map((entity: { id: any, name: any }) => { return { value: entity.id, label: entity.name } });
        this.isLoading = false;
      },
      error: () => {
        this.allSuppliers = []
      }
    })
  };
  back(){    
    this.router.navigate(['../list'], { relativeTo: this.route });
  };

  handleOk() {
    try {
     this.updateList = this.updateList.
      filter(element => element.value!= this.popupComponent.elementSelected);
    this.popupComponent.isConfirmationvisible = false; 
    if (this.isValidForm(this.form)){
      this.update();
    } else{
      this.showMessageError('No Selecciono Parametros de Actualización')
    }
    } catch (error) {
      console.log(error);
      
    }
  }
  
  

  /*
  ** Evento de busqueda datos en el server
  */
  onSearch(value: string): void {
    clearTimeout(this.timeout);
    this.timeout = setTimeout(()=>{
      
      if (value.length > 2){
        this.allSuppliers= [];
        this.queryData.filter= value;
        this.getAllSupplier();
      }  }, 1000);    
  };

  getData(params: any): void {
    this.loading = true;
    this.service.getProductsByUpdatePrice(params).subscribe({
      next: (r)=>{
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

/* Evento de elegir una opcion de actualizacion*/
optionsSelectedChange(id: any): void {
  this.optionSelected = id;
  this.formatterPesoOPorcentaje;
}
categorySelectedChange(id: any): void {
  this.queryParams.filter.category= id;
    
}
brandSelectedChange(id: any): void {
  this.queryParams.filter.brand= id;
  
}
supplierSelectedChange(id: any): void {
   this.queryParams.filter.supplier=this.formSearch.controls['supplier'].value;
 
}
formatterPesoOPorcentaje =(value: number):string => (this.optionSelected == 1) ? formatCurrency(value, this.locale, '$', 'ARS', '1.1-2') : `${value} %`;

onClick(datos:any, index:number): void {
  this.selectedIndex = index 
  this.selectedProduct = datos
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
  ** Evento scroll infinito
  */

onScroll(event:any): void { 
  let scrollHeight= event.target.scrollHeight;
  let scrolltop= event.target.scrollTop;
  let client= event.target.clientHeight
  let ScrollPosition= Math.abs( Math.round(scrollHeight - (scrolltop + client)));  
  if((ScrollPosition <= 5) && (this.totalItems / this.queryParams.page) > this.queryParams.page){ 
    this.queryParams.page ++ ; 
    if(this.totalItems === undefined ||(this.queryParams.page * this.queryParams.pageSize <= this.totalItems)){ 
      this.service.getProductsByUpdatePrice(this.queryParams)
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
  };

  currencyFormat(data: any):string  {    
    return formatCurrency(data, this.locale, '$', 'ARS', '1.1-2')
  }
}

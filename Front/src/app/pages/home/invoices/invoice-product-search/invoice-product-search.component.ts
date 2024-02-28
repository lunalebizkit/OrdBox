import { formatCurrency } from '@angular/common';
import { Component, HostListener, Inject, Input, LOCALE_ID, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { NzDrawerRef } from 'ng-zorro-antd/drawer';
import { NzTableQueryParams } from 'ng-zorro-antd/table';
import { ProductsModel } from '../../products/model/product.model';
import { ProductService } from '../../products/product.service';
import { BrandsService } from '../../brands/brands.services';
import { BrandsModel } from '../../brands/model/brands.model';
import { isNil } from 'ng-zorro-antd/core/util';
import { NzModalService } from 'ng-zorro-antd/modal';
import { ProductCodeBarModal } from '../../products/products-barcode-modal/products-barcode-modal.component';

@Component({
  selector: 'app-invoice-product-search',
  templateUrl: './invoice-product-search.component.html',
  styleUrls: ['./invoice-product-search.component.css']
})
export class InvoiceProductSearchComponent implements OnInit {
  @Input() set filter(value: string){
    this.queryParams.filter.product = value;
  };
  @HostListener('document:keydown', ['$event'])
  handleKeyboardEvent(event: KeyboardEvent) {
    if (event.key === 'F4') {
      this.createComponentModal();       
    }
  }
  childrenVisible = false;
  loadingBrands!: boolean;
  /*
  ** Listado de los productos
  */
  productList: ProductsModel[] = [];
  product: ProductsModel[] = [];
  productId!: number;

  checked = false;
  indeterminate = false;
  setOfCheckedId = new Set<number>()
  /*
   ** Lista de marcas
   */
   brandList: BrandsModel [] = [];
  /*
  ** Parametros de busqueda
  */  
  queryParams = {
    filter: {
      product:'',
      code: '',
      barCode: '',
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

  /*
** Catidad total de productos
*/
  totalItems = 0;
  loading = false;


  constructor(
    private drawerRef: NzDrawerRef<string>,
    private service: ProductService,
    private serviceBrand: BrandsService,
    @Inject(LOCALE_ID) public locale: string,
    private fb: FormBuilder,
    private modalService: NzModalService) { }

  ngOnInit(): void { 
  }
  close(): void {
    this.drawerRef.close(this.product);
  }


  search(): void {
    this.queryParams.page = 0;
    this.getData(this.queryParams);
  }


  selecccion() {    
    this.product = this.productList.filter(({id}) => this.setOfCheckedId.has(id));
    this.close();
   }

 
  /*
   ** Evento que se ejecuta ante algun cambio en la grillas (sorting,paging or filtering)
   */
  onQueryParamsChange(params: NzTableQueryParams): void {
    this.queryParams.page = params.pageIndex - 1;
    this.queryParams.pageSize = params.pageSize;
    this.getData(this.queryParams);
  }
  /*
** Evento de busqueda datos en el server
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
  currencyFormat(data: any): string {
    return formatCurrency(data, this.locale, '$', 'ARS', '1.1-2');
  }

     //Busca por marca
     onSearchBrand(data: string): void {
      if (data.length > 2) {
        this.queryData.page = 0;
        this.queryData.filter = data;
        this.getBrand(this.queryData);
      }
    }

    getBrand(params:any):void{
      this.loadingBrands = true;
      this.serviceBrand.getByFilter(params).subscribe({
        next: (r) => {
          this.brandList = r.data;
          this.totalItems = r.totalCount;
          this.loadingBrands = false;
        },
        error: () => {
          this.loadingBrands = false;
          this.brandList = [];
        },
      });
    }

    brandSelectedChange(id: any): void {
      this.queryParams.filter.brand= id;
      
    }

    onAllChecked(checked: boolean): void {
      this.productList
        .forEach(({ id }) => this.updateCheckedSet(id, checked));
      this.refreshCheckedStatus();
    }

    updateCheckedSet(id: number, checked: boolean): void {
      if (checked) {
        this.setOfCheckedId.add(id);
      } else {
        this.setOfCheckedId.delete(id);
      }
    }

    refreshCheckedStatus(): void {
      this.checked = this.productList.every(({ id }) => this.setOfCheckedId.has(id));
      this.indeterminate = this.productList.some(({ id }) => this.setOfCheckedId.has(id)) && !this.checked;
    }

    onItemChecked(id: number, checked: boolean): void {
      this.updateCheckedSet(id, checked);
      this.refreshCheckedStatus();
    }

    createComponentModal(): void {
      const modal = this.modalService.create({
        nzTitle: 'Código de Barra',
        nzContent: ProductCodeBarModal  
      });    
    
      const instance = modal.getContentComponent();
      // Return a result when closed
      modal.afterClose.subscribe({
        next: (data: string) =>{
          this.queryParams.filter.barCode= '';
          if (!isNil(data) && (data)){
            this.queryParams.filter.barCode = data;
          }
          this.getData(this.queryParams);
        }, 
        error: e => {console.log(e);}      
      })    
    }
}

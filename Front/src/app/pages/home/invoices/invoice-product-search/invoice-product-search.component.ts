import { formatCurrency } from '@angular/common';
import { Component, Inject, Input, LOCALE_ID, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { NzDrawerRef } from 'ng-zorro-antd/drawer';
import { NzTableQueryParams } from 'ng-zorro-antd/table';
import { ProductsModel } from '../../products/model/product.model';
import { ProductService } from '../../products/product.service';

@Component({
  selector: 'app-invoice-product-search',
  templateUrl: './invoice-product-search.component.html',
  styleUrls: ['./invoice-product-search.component.css']
})
export class InvoiceProductSearchComponent implements OnInit {
  @Input() set filter(value: string){
    this.queryParams.filter = value;
  };

  childrenVisible = false;
  /*
  ** Listado de los productos
  */
  productList: ProductsModel[] = [];
  product!: ProductsModel;
  productId!: number;

  /*
  ** Parametros de busqueda
  */
  queryParams = {
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
    @Inject(LOCALE_ID) public locale: string,
    private fb: FormBuilder) { }

  ngOnInit(): void { 
  }
  close(): void {
    this.drawerRef.close(this.product);
  }


  search(): void {
    this.queryParams.page = 0;
    this.getData(this.queryParams);
  }


  selecccion(dato: any) {
    if ( dato.composedPath()[1].id != null ||  dato.composedPath()[1].id != undefined) {
      this.productId= dato.composedPath()[1].id; 
     this.product= this.productList.filter( t => t.id == this.productId)[0];
     this.close();
 
    }
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
}

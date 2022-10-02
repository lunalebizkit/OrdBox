import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { NzDrawerRef, NzDrawerService } from 'ng-zorro-antd/drawer';
import { NzTableQueryParams } from 'ng-zorro-antd/table';
import { ProductsModel } from '../../products/model/product.model';
import { ProductService } from '../../products/product.service';
import { InvoiceProductSearchQuantityComponent } from '../invoice-product-search-quantity/invoice-product-search-quantity.component';
import { InvoiceDetailList, InvoiceDetails } from '../model/invoice.model';

@Component({
  selector: 'app-invoice-product-search',
  templateUrl: './invoice-product-search.component.html',
  styleUrls: ['./invoice-product-search.component.css']
})
export class InvoiceProductSearchComponent implements OnInit {
  childrenVisible = false;
  /*
  ** Listado de los productos
  */
  productList: ProductsModel[] = [];
  product!: ProductsModel;
  invoiceDetail!: InvoiceDetails;
  timeout!: any;
  quantity!: number;
  productId!: number;

  formSearch!: FormGroup;
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


  isLoading = false;
  loading = false;


  constructor(
    private drawerRef: NzDrawerRef<string>,
    private drawerService: NzDrawerService,
    private service: ProductService,
    private fb: FormBuilder) {
    this.formSearch = this.fb.group({
      supplier: ['',],
    })
  }

  ngOnInit(): void {
    this.getData(this.queryParams);
    
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
     this.openComponentQuantity()
    }
   }

  openComponentQuantity(): void {
    const drawerRefProductQuantity = this.drawerService.create<InvoiceProductSearchQuantityComponent, {}, number>({
      nzTitle: 'Cantidad',
      nzContent: InvoiceProductSearchQuantityComponent,
      nzSize: 'default'
    });

    drawerRefProductQuantity.afterClose.subscribe(data => {
      if (data != undefined) {
        this.product.quantity= data;
        // this.quantity = data;
        this.close();
      }
    }
    )
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
}

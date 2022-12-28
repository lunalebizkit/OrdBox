import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { NzDrawerRef } from 'ng-zorro-antd/drawer';
import { NzTableQueryParams } from 'ng-zorro-antd/table';
import { EntityService } from '../../customers/customer.service';
import { CustomerAddModel } from '../../customers/model/customer.add.model';

@Component({
  selector: 'app-receipt-supplier-search',
  templateUrl: './receipt-supplier-search.component.html',
  styleUrls: ['./receipt-supplier-search.component.css'],
})
export class ReceiptSupplierSearchComponent implements OnInit {
  ngOnInit(): void {}

  timeout!: any;
  allSupplier: CustomerAddModel[] = [];
  supplier!: CustomerAddModel;

  formSearch!: FormGroup;
  queryParams = {
    filter: '',
    page: 0,
    pageSize: 20,
  };
  totalItems = 0;
  isLoading = false;
  loading = false;
  supplierId!: number;

  constructor(
    private drawerRef: NzDrawerRef<string>,
    private serviceEntity: EntityService,
    private fb: FormBuilder
  ) {
    this.formSearch = this.fb.group({});
  }

  close(): void {
    this.drawerRef.close(this.supplier);
  }
  /*
   ** Evento de busqueda datos en el server
   */
  onSearch(): void {
    clearTimeout(this.timeout);
    this.timeout = setTimeout(() => {
      if (this.queryParams.filter.length > 2) {
        this.allSupplier = [];
        this.getAllSupplier();
      }
    }, 1000);
  }
  /*
   ** Evento que se ejecuta ante algun cambio en la grillas (sorting,paging or filtering)
   */
  onQueryParamsChange(params: NzTableQueryParams): void {
    this.queryParams.page = params.pageIndex - 1;
    this.queryParams.pageSize = params.pageSize;
    this.getAllSupplier();
  }

  getAllSupplier(): void {
    this.loading = true;
    this.serviceEntity.getSuppliers(this.queryParams).subscribe({
      next: (r) => {
        this.allSupplier = r.data;
        this.totalItems = r.totalCount;
        this.loading = false;
      },
      error: () => {
        this.allSupplier = [];
        this.loading = false;
      },
    });
  }

  selecccion(dato: any) {
    this.supplierId = dato.composedPath()[1].id;
    this.supplier = this.allSupplier.filter(
      (id) => id.id == this.supplierId
    )[0];
    this.close();
  }
}

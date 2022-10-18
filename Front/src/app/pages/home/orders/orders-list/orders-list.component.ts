import { Component, ElementRef, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { ColDef } from 'ag-grid-community';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { BaseComponent } from 'src/app/common/components/base/base.component';
import { BrandsService } from '../../brands/brands.services';
import { CategoriesService } from '../../categories/category.services';
import { EntityService } from '../../customers/customer.service';
import { ProductService } from '../../products/product.service';

@Component({
  selector: 'app-orders-list',
  templateUrl: './orders-list.component.html',
  styleUrls: ['./orders-list.component.css'],
})
export class OrdersListComponent extends BaseComponent implements OnInit {
  constructor(
    private service: ProductService,
    private serviceCategory: CategoriesService,
    private serviceBrand: BrandsService,
    private serviceEntity: EntityService,
    notificacionService: NzNotificationService,
    el: ElementRef,
    message: NzMessageService,
    private route: ActivatedRoute,
    private fb: FormBuilder
  ) {
    super(notificacionService, el, message);
    this.formSearch = this.fb.group({
      product: [''],
      brand: [0],
      supplier: [[]],
      category: [0],
    });
  }
  ngOnInit(): void {
    this.getAllCategories();
  }

  formSearch!: FormGroup;
  isLoading = false;
  timeout!: any;
  allCategories = [];
  allSuppliers: { value: string; label: string }[] = [];

  /*
   ** Indicador de carga de marcas y lineas
   */
  loadingBrands!: boolean;
  isLoadingCategory = false;
  isLoadingBrand = false;
  isSaving = false;

  /*
   ** Parametros de busqueda
   */
  queryParams = {
    filter: {
      product: '',
      brand: 0,
      category: 0,
      supplier: [],
    },
    page: 0,
    pageSize: 50,
  };
  queryData = {
    filter: '',
    page: 0,
    pageSize: 50,
  };

  getAllSupplier(): void {
    this.serviceEntity.getSuppliers(this.queryData).subscribe({
      next: (r) => {
        this.allSuppliers = r.data.map((entity: { id: any; name: any }) => {
          return { value: entity.id, label: entity.name };
        });
        this.isLoading = false;
      },
      error: () => {
        this.allSuppliers = [];
      },
    });
  }

  getAllCategories(): void {
    this.isLoadingCategory = true;
    this.serviceCategory.getByFilter(this.queryData).subscribe({
      next: (r) => {
        this.isLoadingCategory = false;
        this.allCategories = r.data.map(
          (category: { id: any; description: any }) => {
            return { value: category.id, label: category.description };
          }
        );
      },
      error: () => {
        this.isLoadingCategory = false;
        this.allCategories = [];
      },
    });
  }

  /*
   ** Evento de busqueda datos en el server
   */
  onSearch(value: string): void {
    clearTimeout(this.timeout);
    this.timeout = setTimeout(() => {
      if (value.length > 2) {
        this.allSuppliers = [];
        this.queryData.filter = value;
        this.getAllSupplier();
      }
    }, 1000);

    // this.searchChange$.next(value);
  }

  /*   creacion de columnas de la grid */
  public columnDefs: ColDef[] = [
    {
      headerName: 'N° Pedido',
      field: 'pedido',
    },
    {
      headerName: 'Fecha',
      field: 'fecha',
    },
    {
      headerName: 'Proveedor',
      field: 'proveedor',
    },
    {
      headerName: 'Estado',
      field: 'estado',
    },
  ];

  public columnsDefs: ColDef[] = [
    {
      headerName: 'Productos',
      field: 'productos',
    },
    {
      headerName: 'Cantidad',
      field: 'cantidad',
    },
  ];

  public defaultColDef: ColDef = {
    sortable: true,
    filter: true,
    flex: 1,
    minWidth: 100,
    resizable: true,
  };

  supplierSelectedChange(id: any): void {
    this.queryParams.filter.supplier =
      this.formSearch.controls['supplier'].value;
  }

  categorySelectedChange(id: any): void {
    this.queryParams.filter.category = id;
  }
}

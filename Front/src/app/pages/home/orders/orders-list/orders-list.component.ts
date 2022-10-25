import { Component, ElementRef, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { BaseComponent } from 'src/app/common/components/base/base.component';
import { CategoriesService } from '../../categories/category.services';
import { EntityService } from '../../customers/customer.service';
import { OrderDetail, OrderList } from '../models/order.model';
import { OrdersService } from '../orders.service';

@Component({
  selector: 'app-orders-list',
  templateUrl: './orders-list.component.html',
  styleUrls: ['./orders-list.component.css'],
})
export class OrdersListComponent extends BaseComponent implements OnInit {
  constructor(
    private serviceSupplier: OrdersService,
    private serviceCategory: CategoriesService,
    private serviceEntity: EntityService,
    notificacionService: NzNotificationService,
    el: ElementRef,
    message: NzMessageService,
    private fb: FormBuilder
  ) {
    super(notificacionService, el, message);
    this.formSearch = this.fb.group({
      status: [''],
      supplier: [[]],
      category: [0],
    });
  }
  ngOnInit(): void {
    this.getAllCategories();
    this.getAllSupplier();
    this.getAllOrders();
  }

  formSearch!: FormGroup;
  isLoading = false;
  timeout!: any;
  allCategories = [];
  allSuppliers: { value: string; label: string }[] = [];
  allOrders: OrderList[]= [];
  orderDetailList:OrderDetail[]=[];

  /*
   ** Indicador de carga de marcas y lineas
   */
  loadingBrands!: boolean;
  isLoadingCategory = false;
  isLoadingBrand = false;
  isLoadingEntity = false;
  isSaving = false;

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
    pageSize: 50,
  };

  getAllOrders(): void {
    this.isLoadingCategory = true;
    this.serviceSupplier.getOrders(this.queryParams).subscribe({
      next: (r) => {
        this.isLoading = false;
        this.allOrders = r.data;          
        
      },
      error: () => {
        this.isLoading = false;
        this.allOrders = [];
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

  getAllSupplier(): void {
    this.isLoadingEntity = true;
    this.serviceEntity.getSuppliers(this.queryData).subscribe({
      next: (r) => {
        this.isLoadingEntity = false;
        this.allSuppliers = r.data.map((entity: { id: any; name: any }) => {
          return { value: entity.id, label: entity.name };
        });
      },
      error: () => {
        this.isLoadingEntity = false;
        this.allSuppliers = [];
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
  }
  onSelect(id: number):void {
   this.orderDetailList= this.allOrders.filter( order => order.id == id)[0].orderDetail;
     
  }

  supplierSelectedChange(id: any): void {
    this.queryParams.filter.supplier =
      this.formSearch.controls['supplier'].value;
  }

  categorySelectedChange(id: any): void {
    this.queryParams.filter.category = id;
  }
}

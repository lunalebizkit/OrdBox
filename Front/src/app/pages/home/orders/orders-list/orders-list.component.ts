import { formatDate } from '@angular/common';
import {
  Component,
  ElementRef,
  Inject,
  LOCALE_ID,
  OnInit,
} from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { NzDrawerService } from 'ng-zorro-antd/drawer';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { BaseComponent } from 'src/app/common/components/base/base.component';
import { CategoriesService } from '../../categories/category.services';
import { EntityService } from '../../customers/customer.service';
import { eStatus, StatusType } from '../models/status-type.enum';
import {
  NewOrder,
  NewOrderDetail,
  orderDetailbyIdParser,
} from '../models/order.model';
import { OrdersEditDrawerComponent } from '../orders-edit-drawer/orders-edit.drawer.component';
import { OrdersService } from '../orders.service';
import { Permission } from 'src/app/common/auth/models/permissions.enum';

@Component({
  selector: 'app-orders-list',
  templateUrl: './orders-list.component.html',
  styleUrls: ['./orders-list.component.css'],
})
export class OrdersListComponent extends BaseComponent implements OnInit {
  permissions = Permission;
  formSearch!: FormGroup;
  isLoading = false;
  timeout!: any;
  allCategories = [];
  allSuppliers: { value: string; label: string }[] = [];
  allOrders: NewOrder[] = [];
  orderDetailList: NewOrderDetail[] = [];
  allStatus = StatusType;
  /*
   ** id del usuario a editar, si es nuevo...
   */
  id!: number;

  /*
   ** Parametros de busqueda Filtrada
   */
  queryParams = {
    filter: {
      product: '',
      brand: 0,
      category: 0,
      status: 0,
      supplier: [0],
    },
    page: 0,
    pageSize: 20,
  };
  /*
   ** Parametros de busqueda
   */
  queryData = {
    filter: '',
    page: 0,
    pageSize: 20,
  };

  totalItems = 0;
  selectedIndex!: number;
  selectedOrders!: NewOrder;
  index!: number;

  constructor(
    private serviceOrders: OrdersService,
    private serviceCategory: CategoriesService,
    private serviceEntity: EntityService,
    notificacionService: NzNotificationService,
    el: ElementRef,
    message: NzMessageService,
    private fb: FormBuilder,
    private drawerService: NzDrawerService,
    @Inject(LOCALE_ID) public locale: string
  ) {
    super(notificacionService, el, message);
    this.formSearch = this.fb.group({
      status: [0],
      supplier: [[]],
      category: [0],
    });
  }
  ngOnInit(): void {
    this.getAllCategories();
    this.getAllSupplier();
    this.getAllOrders();
  }
  /*
   ** Indicador de carga de marcas y lineas
   */
  loadingBrands!: boolean;
  isLoadingCategory = false;
  isLoadingBrand = false;
  isLoadingEntity = false;
  isSaving = false;

  getAllOrders(): void {
    this.isLoading = true;
    this.serviceOrders.getOrders(this.queryParams).subscribe({
      next: (r) => {
        this.isLoading = false;
        this.allOrders = r.data;
        this.totalItems = r.totalCount;
        this.selectedIndex = 0;
        this.selectedOrders = this.allOrders[this.selectedIndex];
        document.getElementById(this.selectedIndex.toString())?.focus();
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
  onSelect(id: number): void {
    this.orderDetailList = this.allOrders.filter(
      (order) => order.id == id
    )[0].orderDetail;
  }

  supplierSelectedChange(id: any): void {
    this.queryParams.filter.supplier = [];
    if (id == 0 || id == null) {
      this.queryParams.filter.supplier = [0];
    } else {
      this.queryParams.filter.supplier.push(
        this.formSearch.controls['supplier'].value
      );
    }
  }

  categorySelectedChange(id: number): void {
    this.queryParams.filter.category = id;
  }

  statusSelectedChange(id: number): void {
    this.queryParams.filter.status = id;
  }

  formaterDate(date: string | number | Date): string {
    return formatDate(date, 'YYYY-MM-dd', this.locale);
  }

  /*
   ** Evento al presionar buscar o presionar enter
   */
  search(): void {
    this.queryParams.page = 0;
    this.orderDetailList = [];
    this.getAllOrders();
  }

  getStatusName(id: number) {
    return eStatus[id];
  }
  onDoubleClicked(datos: any) {
    this.id = datos.id;
    this.openComponentOrdersEdit();
  }
  onClick(datos: NewOrder, index: number): void {
    this.index = index;
    this.selectedIndex = index;
    this.selectedOrders = datos;
    this.onSelect(datos.id);
  }

  onEnter(e: any) {
    this.selectedOrders = this.allOrders[this.index];
    this.id = this.allOrders[this.index].id;
    this.openComponentOrdersEdit();
  }

  /*
   ** Evento de navegacion por teclado
   */
  myNavegation(event: any) {
    switch (event.key) {
      case 'ArrowDown':
        let nextCell =
          this.allOrders.length > this.selectedIndex
            ? ++this.selectedIndex
            : this.allOrders.length;
        if (this.allOrders[nextCell] !== undefined) {
          this.selectedOrders = this.allOrders[nextCell];
          this.index = nextCell;
          document.getElementById(nextCell.toString())?.focus();
          this.onSelect(this.selectedOrders.id);
        }
        break;
      case 'ArrowUp':
        let previousCell = this.selectedIndex > 0 ? --this.selectedIndex : 0;
        if (this.allOrders[previousCell] !== undefined) {
          this.selectedOrders = this.allOrders[previousCell];
          this.index = previousCell;
          document.getElementById(previousCell.toString())?.focus();
          this.onSelect(this.selectedOrders.id);
        }
        break;
    }
  }

  /*
   ** Evento de scroll infinito
   */
  onScroll(event: any): void {
    let scrollHeight = event.target.scrollHeight;
    let scrolltop = event.target.scrollTop;
    let client = event.target.clientHeight;
    let ScrollPosition = Math.abs(
      Math.round(scrollHeight - (scrolltop + client))
    );
    if (
      ScrollPosition <= 5 &&
      this.totalItems / this.queryParams.page > this.queryParams.page
    ) {
      let page = this.queryParams.page;
      this.queryParams.page = this.queryParams.page + 1;
      if (
        this.totalItems === undefined ||
        this.queryParams.page * this.queryParams.pageSize <= this.totalItems
      ) {
        this.serviceOrders.getOrders(this.queryParams).subscribe({
          next: (r) => {
            r.data.map((order: NewOrder) => this.allOrders.push(order));
            this.isLoading = false;
          },
          error: () => {
            this.isLoading = false;
            this.allOrders = [];
          },
        });
      } else {
        this.queryParams.page = page;
      }
    }
  }
  openComponentOrdersEdit(): void {
    const drawerRefCustomer = this.drawerService.create<
      OrdersEditDrawerComponent,
      { filter: number },
      number
    >({
      nzContent: OrdersEditDrawerComponent,
      nzSize: 'large',
      nzContentParams: {
        filter: this.id > 0 ? this.id : 0,
      },
      nzClosable: false,
    });
    drawerRefCustomer.afterClose.subscribe({
      next: (data) => {
        this.orderDetailList = [];
        this.id = 0;
        if (data != undefined && data != 0) {
          this.getAllOrders();
        }
        /**Comento estas Lineas para que actualice la grilla de listados de ordenes ya que, de la siguiente manera
         * actualizaba la lista pero no el Estado (nombre de estado) 
         * ALe
         */

        
        //   this.serviceOrders.getById(data).subscribe({
        //     next: (r: NewOrder) => {
        //       let order =
        //         this.allOrders[this.allOrders.findIndex((r) => r.id == data)];
        //       if (order != undefined) {
        //         let newDetalle: NewOrderDetail[] = [];
        //         r.orderDetail.forEach((e: NewOrderDetail) => {
        //           newDetalle.push(orderDetailbyIdParser(e));
        //         });
        //         this.allOrders[this.allOrders.findIndex((r) => r.id == data)] =
        //           order;
        //         this.allOrders[
        //           this.allOrders.findIndex((r) => r.id == data)
        //         ].orderDetail = newDetalle;
        //       } else {
        //         let newDetalle: NewOrderDetail[] = [];
        //         r.orderDetail.forEach((e: NewOrderDetail) => {
        //           newDetalle.push(orderDetailbyIdParser(e));
        //         });
        //         r.orderDetail = newDetalle;
        //         this.allOrders.push(r);
        //         this.allOrders.forEach(e =>{
        //           this.getStatusName(e.statusId)
        //         })
        //       }
        //     },
        //     error: () => {
        //       this.id = 0;
        //     },
        //   });
        // }
      },
      error: () => {
        this.orderDetailList = [];
        this.id = 0;
      },
    });
  }
}

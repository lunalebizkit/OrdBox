import {
  Component,
  ElementRef,
  OnInit,
  QueryList,
  ViewChild,
  ViewChildren,
} from '@angular/core';
import { NzDrawerService } from 'ng-zorro-antd/drawer';
import { Permission } from 'src/app/common/auth/models/permissions.enum';
import { EntityService } from '../customer.service';
import { CustomersEditDrawerComponent } from '../customers-edit-drawer/customers-edit.drawer.component';
import { CustomerModel } from '../model/customer.model';
import { PopupConfirmationComponent } from 'src/app/common/components/popup-confirmation/popup-confirmation.component';
import { NzMessageService } from 'ng-zorro-antd/message';
import { BaseComponent } from 'src/app/common/components/base/base.component';
import { NzNotificationService } from 'ng-zorro-antd/notification';

@Component({
  selector: 'app-customers-list',
  templateUrl: './customers-list.component.html',
  styleUrls: ['./customers-list.component.css'],
})
export class CustomersListComponent extends BaseComponent implements OnInit {
  @ViewChildren('td') cells!: QueryList<ElementRef>;
  @ViewChild('popup') popupComponent!: PopupConfirmationComponent;
  selectedIndex: number = 0;
  selectedCustomers: any;
  index!: number;
  permissions = Permission;
  /*
   ** Catidad total de entidades
   */
  totalItems!: number;
  /*
   ** Indicador de carga de la grilla
   */
  loading = false;
  /*
   ** Lista de Productos
   */
  entityList: CustomerModel[] = [];
  id!: number;
  /*
   ** Parametros de busqueda
   */
  queryParams = {
    filter: '',
    page: 0,
    pageSize: 50,
  };

  /*
   ** Constructor
   */
  constructor(
    private service: EntityService,
    private drawerService: NzDrawerService,
    notificacionService: NzNotificationService,
    el: ElementRef,
    message: NzMessageService,

  ) {super( notificacionService, el, message)}
  /*
   ** Evento de inicio de angular
   */
  ngOnInit(): void {
    this.getData(this.queryParams);
  }
  /*
   ** Evento al presionar buscar o presionar enter
   */
  search(): void {
    this.queryParams.page = 0;
    this.getData(this.queryParams);
  }

  /*
   ** Evento de busqueda datos en el server
   */
  openComponentCustomerEdit(): void {
    const drawerRefCustomer = this.drawerService.create<
      CustomersEditDrawerComponent,
      { filter: number },
      number
    >({
      nzContent: CustomersEditDrawerComponent,
      nzSize: 'large',
      nzWidth: '90%',
      nzContentParams: {
        filter: this.id > 0 ? this.id : 0,
      },
      nzClosable: false,
    });
    drawerRefCustomer.afterClose.subscribe({
      next: (data) => {
        this.id = 0;
        if (data != undefined && data != 0) {
          this.service.getById(data).subscribe({
            next: (r: CustomerModel) => {
              this.entityList[this.entityList.findIndex((r) => r.id == data)] !=
              undefined
                ? (this.entityList[
                    this.entityList.findIndex((r) => r.id == data)
                  ] = r)
                : this.entityList.push(r);
            },
            error: () => {
              this.id = 0;
            },
          });
        }
      },
      error: () => {
        this.id = 0;
      },
    });
  }

  getData(params: any): void {
    this.loading = true;
    this.service.getCustomers(params).subscribe({
      next: (r) => {
        this.entityList = r.data;
        this.totalItems = r.totalCount;
        this.loading = false;
        this.selectedIndex = 0;
        this.selectedCustomers = this.entityList[this.selectedIndex];
        document.getElementById(this.selectedIndex.toString())?.focus();
      },
      error: () => {
        this.loading = false;
        this.entityList = [];
      },
    });
  }

  onClick(datos: any, index: number): void {
    this.index = index;
    this.selectedIndex = index;
    this.selectedCustomers = datos;
  }
  onDoubleClicked(datos: any) {
    this.id = datos.id;
    this.openComponentCustomerEdit();
  }
  onEnter(e: any) {
    this.selectedCustomers = this.entityList[this.index];
    this.id = this.entityList[this.index].id;
    this.openComponentCustomerEdit();
  }
  myNavegation(event: any) {
    switch (event.key) {
      case 'ArrowDown':
        let nextCell =
          this.entityList.length > this.selectedIndex
            ? ++this.selectedIndex
            : this.entityList.length;
        if (this.entityList[nextCell] !== undefined) {
          this.selectedCustomers = this.entityList[nextCell];
          this.index = nextCell;
          document.getElementById(nextCell.toString())?.focus();
        }
        break;
      case 'ArrowUp':
        let previousCell = this.selectedIndex > 0 ? --this.selectedIndex : 0;
        if (this.entityList[previousCell] !== undefined) {
          this.selectedCustomers = this.entityList[previousCell];
          this.index = previousCell;
          document.getElementById(previousCell.toString())?.focus();
        }
        break;
    }
  }
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
      this.queryParams.page = this.queryParams.page + 1;
      if (
        this.totalItems === undefined ||
        this.queryParams.page * this.queryParams.pageSize <= this.totalItems
      ) {
        this.service.getCustomers(this.queryParams).subscribe({
          next: (r) => {
            r.data.map((data: CustomerModel) => this.entityList.push(data));
            this.loading = false;
          },
          error: () => {
            this.loading = false;
            this.entityList = [];
          },
        });
      }
    }
  }

  handleOk() {
    this.service.deleteCustomer(this.popupComponent.elementSelectedToDelete).subscribe(
     {next: (r) => {
        this.popupComponent.isDeleteConfirmationVisible = false;
        this.showMessageSuccess("Entidad eliminada");
        this.search();
      },
      error:(r) => { 
        this.showMessageError(r.error.descripcion);
        this.popupComponent.isDeleteConfirmationVisible = false;
      }
  });
  }
}

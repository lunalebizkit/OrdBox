import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { NzDrawerService } from 'ng-zorro-antd/drawer';
import { Permission } from 'src/app/common/auth/models/permissions.enum';
import { EntityService } from '../../customers/customer.service';
import { CustomerModel } from '../../customers/model/customer.model';
import { SuppliersEditDrawerComponent } from '../suppliers-edit-drawer/suppliers-edit.drawer.component';
import { BaseComponent } from 'src/app/common/components/base/base.component';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NzMessageService } from 'ng-zorro-antd/message';
import { PopupConfirmationComponent } from 'src/app/common/components/popup-confirmation/popup-confirmation.component';

@Component({
  selector: 'app-suppliers-list',
  templateUrl: './suppliers-list.component.html',
  styleUrls: ['./suppliers-list.component.css'],
})
export class SuppliersListComponent extends BaseComponent implements OnInit {
  selectedIndex: number = 0;
  selectedSuppliers: any;
  permissions = Permission;
  @ViewChild('popup') popupComponent!: PopupConfirmationComponent;
  /*
   ** Catidad total de entidades
   */
  totalItems = 0;
  /*
   ** Indicador de carga de la grilla
   */
  loading = false;
  /*
   ** Lista de Productos
   */
  entityList: CustomerModel[] = [];
  id!: number;
  index!: number;
  /*
   ** Parametros de busqueda
   */
  queryParams = {
    filter: '',
    page: 0,
    pageSize: 20,
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

  getData(params: any): void {
    this.loading = true;
    this.service.getSuppliers(params).subscribe({
      next: (r) => {
        this.entityList = r.data;
        this.totalItems = r.totalCount;
        this.loading = false;
        this.selectedIndex = 0;
        this.selectedSuppliers = this.entityList[this.selectedIndex];
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
    this.selectedSuppliers = datos;
  }
  onEnter(e: any) {
    this.selectedSuppliers = this.entityList[this.index];
    this.id = this.entityList[this.index].id;
    this.openComponentSupplierEdit();
  }
  myNavegation(event: any) {
    switch (event.key) {
      case 'ArrowDown':
        let nextCell =
          this.entityList.length > this.selectedIndex
            ? ++this.selectedIndex
            : this.entityList.length;
        if (this.entityList[nextCell] !== undefined) {
          this.selectedSuppliers = this.entityList[nextCell];
          this.index = nextCell;
          document.getElementById(nextCell.toString())?.focus();
        }
        break;
      case 'ArrowUp':
        let previousCell = this.selectedIndex > 0 ? --this.selectedIndex : 0;
        if (this.entityList[previousCell] !== undefined) {
          this.selectedSuppliers = this.entityList[previousCell];
          this.index = previousCell;
          document.getElementById(previousCell.toString())?.focus();
        }
        break;
    }
  }

  openComponentSupplierEdit(): void {
    const drawerRefCustomer = this.drawerService.create<
      SuppliersEditDrawerComponent,
      { filter: number },
      number
    >({
      nzContent: SuppliersEditDrawerComponent,
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
          this.service.getSupplierById(data).subscribe({
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
  onDoubleClicked(datos: any) {
    this.id = datos.id;
    this.openComponentSupplierEdit();
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
        this.service.getSuppliers(this.queryParams).subscribe({
          next: (r) => {
            r.data.map((product: CustomerModel) =>
              this.entityList.push(product)
            );
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

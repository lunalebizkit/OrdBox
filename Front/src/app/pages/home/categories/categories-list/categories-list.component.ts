import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { NzDrawerService } from 'ng-zorro-antd/drawer';
import { Permission } from 'src/app/common/auth/models/permissions.enum';
import { PopupConfirmationComponent } from 'src/app/common/components/popup-confirmation/popup-confirmation.component';
import { CategoryEditDrawerComponent } from '../categories-edit-drawer/categories-edit-drawer.component';
import { CategoriesService } from '../category.services';
import { CategoryModel } from '../model/category.model';
import { BaseComponent } from 'src/app/common/components/base/base.component';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NzMessageService } from 'ng-zorro-antd/message';

@Component({
  selector: 'app-categories-list',
  templateUrl: './categories-list.component.html',
  styleUrls: ['./categories-list.component.css'],
})
export class CategoriesListComponent extends BaseComponent implements OnInit {
  @ViewChild('popup') popupComponent!: PopupConfirmationComponent;
  permissions = Permission;
  /*
   ** Indicador de carga de la grilla
   */
  loading = false;
  isLoadingRoles = true;
  /*
   ** Catidad total de Categorias
   */
  totalItems = 0;
  selectedIndex: number = 0;
  selectedCategory: any;
  id!: number;
  index!: number;

  categoryList: CategoryModel[] = [];

  constructor(
    private service: CategoriesService,
    private drawerService: NzDrawerService,
    notificacionService: NzNotificationService,
    el: ElementRef,
    message: NzMessageService,
  ) { super( notificacionService, el, message)}

  ngOnInit(): void {
    this.getData(this.queryData);
  }
  /*
   ** Evento de busqueda datos en el server
   */
  getData(params: any): void {
    this.loading = true;
    this.service.getByFilter(params).subscribe({
      next: (r) => {
        this.categoryList = r.data;
        // Envía el numero total de páginas
        this.totalItems = r.totalCount;
        // Saca spinner de carga
        this.loading = false;
        this.selectedCategory = this.categoryList[this.selectedIndex];
        document.getElementById(this.selectedIndex.toString())?.focus();
      },
      error: () => {
        this.loading = false;
        this.categoryList = [];
      },
    });
  }
  queryData = {
    filter: '',
    page: 0,
    pageSize: 50,
  };
  search(): void {
    this.queryData.page = 0;
    this.getData(this.queryData);
  }
  /*
   ** Evento de selección de filas en la tabla
   */

  onClick(datos: any, index: number): void {
    this.index = index;
    this.selectedIndex = index;
    this.selectedCategory = datos;
  }

  onEnter(e: any) {
    this.selectedCategory = this.categoryList[this.index];
    this.id = this.categoryList[this.index].id;
    this.openComponentCategoryEdit();
  }

  /*
   ** Evento de navegación por teclado
   */
  myNavegation(event: any) {
    switch (event.key) {
      case 'ArrowDown':
        let nextCell =
          this.categoryList.length > this.selectedIndex
            ? ++this.selectedIndex
            : this.categoryList.length;
        if (this.categoryList[nextCell] !== undefined) {
          this.selectedCategory = this.categoryList[nextCell];
          this.index = nextCell;
          document.getElementById(nextCell.toString())?.focus();
        }
        break;
      case 'ArrowUp':
        let previousCell = this.selectedIndex > 0 ? --this.selectedIndex : 0;
        if (this.categoryList[previousCell] !== undefined) {
          this.selectedCategory = this.categoryList[previousCell];
          this.index = previousCell;
          document.getElementById(previousCell.toString())?.focus();
        }
        break;
    }
  }

  /*
   ** Evento de scroll infinito en tabla
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
      this.totalItems / this.queryData.page > this.queryData.page
    ) {
      this.queryData.page++;
      if (
        this.totalItems === undefined ||
        this.queryData.page * this.queryData.pageSize <= this.totalItems
      ) {
        this.service.getByFilter(this.queryData).subscribe({
          next: (r) => {
            r.data.map((category: CategoryModel) =>
              this.categoryList.push(category)
            );
            this.loading = false;
          },
          error: () => {
            this.loading = false;
            this.categoryList = [];
          },
        });
      }
    }
  }

  handleOk() {
    this.service.delete(this.popupComponent.elementSelectedToDelete).subscribe(
     {next: (r) => {
        this.popupComponent.isDeleteConfirmationVisible = false;
        this.showMessageSuccess("Categoría eliminada");
        this.search();
      },
      error:(r) => { 
        this.showMessageError(r.error.descripcion);
        this.popupComponent.isDeleteConfirmationVisible = false;
      }
  });
  }

  openComponentCategoryEdit(): void {
    const drawerRefCustomer = this.drawerService.create<
      CategoryEditDrawerComponent,
      { filter: number },
      number
    >({
      nzContent: CategoryEditDrawerComponent,
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
          this.service.getCategoryById(data).subscribe({
            next: (r: CategoryModel) => {
              this.categoryList[
                this.categoryList.findIndex((r) => r.id == data)
              ] != undefined
                ? (this.categoryList[
                    this.categoryList.findIndex((r) => r.id == data)
                  ] = r)
                : this.categoryList.push(r);
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
    this.openComponentCategoryEdit();
  }
}

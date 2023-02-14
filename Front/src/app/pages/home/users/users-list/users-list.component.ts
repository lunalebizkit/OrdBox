import { Component, OnInit, ViewChild } from '@angular/core';
import { UserService } from '../users.services';
import { ListUserModel } from '../model/list.user.model';
import { PopupConfirmationComponent } from 'src/app/common/components/popup-confirmation/popup-confirmation.component';
import { NzTableQueryParams } from 'ng-zorro-antd/table';
import { eRol } from '../model/rol.enum';
import { NzDrawerService } from 'ng-zorro-antd/drawer';
import { UsersEditDrawerComponent } from '../users-edit-drawer/users-edit.drawer.component';
import { Permission } from 'src/app/common/auth/models/permissions.enum';
import { PermissionRolDrawerComponent } from 'src/app/pages/auth/permission-rol/permission-rol.drawer.component';

@Component({
  selector: 'app-users-list',
  templateUrl: './users-list.component.html',
  styleUrls: ['./users-list.component.css'],
})
export class UsersListComponent implements OnInit {
  id!: number;
  index!: number;
  permissions = Permission;

  constructor(
    private service: UserService,
    private drawerService: NzDrawerService
  ) {}
  selectedIndex: number = 0;
  selectedUser: any;

  ngOnInit(): void {
    this.getData(this.queryData);
  }
  /*
   ** Listado de los usuarios
   */
  userList: ListUserModel[] = [];
  allRols = [
    { value: 1, text: 'Administrador' },
    { value: 2, text: 'Comercial' },
    { value: 3, text: 'Farmacia' },
  ];
  /*
   ** Indicador de carga de la grilla
   */
  loading = false;
  isLoadingRoles = true;

  /*
   ** Catidad total de usuarios
   */
  totalItems = 0;

  queryData = {
    filter: '',
    page: 0,
    pageSize: 10,
  };
  /*

  /*
 ** Evento de busqueda datos en el server
 */
  getData(params: any): void {
    this.loading = true;
    this.service.getByFilter(params).subscribe({
      next: (r) => {
        this.userList = r.data;

        // Envía el numero total de páginas
        this.totalItems = r.totalCount;

        // Saca spinner de carga
        this.loading = false;
        this.selectedIndex = 0;
        this.selectedUser = this.userList[this.selectedIndex];
        document.getElementById(this.selectedIndex.toString())?.focus();
      },
      error: () => {
        this.loading = false;
        this.userList = [];
      },
    });
  }
  /*
   ** Evento al presionar buscar o presionar enter
   */

  search(): void {
    this.queryData.page = 0;
    this.getData(this.queryData);
  }

  getRolName(id: number) {
    return eRol[id];
  }
  openComponentUserEdit(): void {
    const drawerRefCustomer = this.drawerService.create<
      UsersEditDrawerComponent,
      { filter: number },
      number
    >({
      nzContent: UsersEditDrawerComponent,
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
            next: (r: ListUserModel) => {
              this.userList[this.userList.findIndex((r) => r.id == data)] !=
              undefined
                ? (this.userList[this.userList.findIndex((r) => r.id == data)] =
                    r)
                : this.userList.push(r);
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
  openComponentRolControl():void{
    const drawerRefCustomer = this.drawerService.create<
    PermissionRolDrawerComponent,
    { filter: number },
    number
  >({
    nzContent: PermissionRolDrawerComponent,
    nzSize: 'large',
    nzContentParams: {
      filter: this.id > 0 ? this.id : 0,
    },
    nzClosable: false,
  });
  /*drawerRefCustomer.afterClose.subscribe({
    next: (data) => {
      this.id = 0;
      if (data != undefined && data != 0) {
        this.service.getById(data).subscribe({
          next: (r: ListUserModel) => {
            this.userList[this.userList.findIndex((r) => r.id == data)] !=
            undefined
              ? (this.userList[this.userList.findIndex((r) => r.id == data)] =
                  r)
              : this.userList.push(r);
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
  */
  }
  onDoubleClicked(datos: any) {
    this.id = datos.id;
    this.openComponentUserEdit();
  }

  onClick(datos: any, index: number): void {
    this.index = index;
    this.selectedIndex = index;
    this.selectedUser = datos;
  }

  onEnter(e: any) {
    this.selectedUser = this.userList[this.index];
    this.id = this.userList[this.index].id;
    this.openComponentUserEdit();
  }

  myNavegation(event: any) {
    switch (event.key) {
      case 'ArrowDown':
        let nextCell =
          this.userList.length > this.selectedIndex
            ? ++this.selectedIndex
            : this.userList.length;
        if (this.userList[nextCell] !== undefined) {
          this.selectedUser = this.userList[nextCell];
          this.index = nextCell;
          document.getElementById(nextCell.toString())?.focus();
        }
        break;
      case 'ArrowUp':
        let previousCell = this.selectedIndex > 0 ? --this.selectedIndex : 0;
        if (this.userList[previousCell] !== undefined) {
          this.selectedUser = this.userList[previousCell];
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
      this.totalItems / this.queryData.page > this.queryData.page
    ) {
      this.queryData.page = this.queryData.page + 1;
      if (
        this.totalItems === undefined ||
        this.queryData.page * this.queryData.pageSize <= this.totalItems
      ) {
        this.service.getByFilter(this.queryData).subscribe({
          next: (r) => {
            r.data.map((user: ListUserModel) => this.userList.push(user));
            this.loading = false;
          },
          error: () => {
            this.loading = false;
            this.userList = [];
          },
        });
      }
    }
  }
}

import { Component, OnInit, ViewChild } from '@angular/core';
import { UserService } from '../users.services';
import { ListUserModel } from '../model/list.user.model';
import { PopupConfirmationComponent } from 'src/app/common/components/popup-confirmation/popup-confirmation.component';
import { NzTableQueryParams } from 'ng-zorro-antd/table';
import {eRol} from '../model/rol.enum'
import { Router } from '@angular/router';
@Component({
  selector: 'app-users-list',
  templateUrl: './users-list.component.html',
  styleUrls: ['./users-list.component.css']
})
export class UsersListComponent implements OnInit {

  @ViewChild('popup') popupComponent!: PopupConfirmationComponent;

  constructor(private service: UserService, private router: Router) { }
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
    {value: 1, text: 'Administrador'},
    {value: 2, text: 'Comercial'},
    {value: 3, text: 'Farmacia'}
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
   /*
   ** Evento que se ejecuta ante algun cambio en la grillas (sorting,paging or filtering)
   */
   onQueryParamsChange(params: NzTableQueryParams): void {
    this.queryData.page = params.pageIndex - 1;
    this.queryData.pageSize = params.pageSize;
    this.getData(this.queryData);
  }
  queryData= {
    filter: '',
    page: 0,
    pageSize: 10,
  }
  /*

  /*
 ** Evento de busqueda datos en el server
 */
  getData(params: any): void {
    this.loading = true;
    this.service.getByFilter(params).subscribe(
      {next: (r)=> { 
        this.userList = r.data;

        // Envía el numero total de páginas
        this.totalItems = r.totalCount;

        // Saca spinner de carga
        this.loading = false;
      },
      error:() => {
        this.loading = false;
        this.userList = [];
      }
  });
  }
    /*
   ** Evento al presionar buscar o presionar enter
   */

   search(): void {
    this.queryData.page = 0;
    this.getData(this.queryData);
  }


  handleOk() {
    this.service.deleteUser(this.popupComponent.elementSelectedToDelete).subscribe(
     {next: (r) => {
        this.popupComponent.isDeleteConfirmationVisible = false;
        this.search();
      },
      error:() => { }
  });
  }
  getRolName(id:number) {
    return eRol[id];
  }

  onClick(datos:any, index:number): void {
    this.selectedIndex = index 
    this.selectedUser = datos;
  } 
  onDoubleClicked (datos:any) {
    var data = datos.id
    this.router.navigate(['home/users/edit/', data]); 
  }
  myNavegation(event:any) {
    switch (event.key) {
      case "ArrowDown":
        let nextCell = this.userList.length > this.selectedIndex ? ++ this.selectedIndex : this.userList.length;
        if(this.userList[nextCell] !== undefined){
          this.selectedUser = this.userList[nextCell];  
      } 
        break; 
      case "ArrowUp":
        let previousCell= this.selectedIndex > 0 ? -- this.selectedIndex : 0; 
        if (this.userList[previousCell] !== undefined ){
          this.selectedUser= this.userList[previousCell];
      }
        break 
    } 
  
  }
  onScroll(event:any): void { 
    let scrollHeight= event.target.scrollHeight;
    let scrolltop= event.target.scrollTop;
    let client= event.target.clientHeight
    let ScrollPosition= scrollHeight - (scrolltop + client);
    if((ScrollPosition === 0 || ScrollPosition === -1 ) && (this.totalItems / this.queryData.page) > this.queryData.page){ 
    this.queryData.page= this.queryData.page +1; 
      if(this.totalItems === undefined ||(this.queryData.page * this.queryData.pageSize <= this.totalItems)){ 
        this.service.getByFilter(this.queryData)
        .subscribe({
          next:(r)=>{
            r.data.map((user: ListUserModel)=>
            this.userList.push(user))  
            this.loading= false 
          },
          error: ()=>{  this.loading = false;
          this.userList= [];}
        }) 
      }
    }
  } 
}

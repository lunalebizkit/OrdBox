import { Component, OnInit, ViewChild } from '@angular/core';
import { NzTableQueryParams } from 'ng-zorro-antd/table';
import { PopupConfirmationComponent } from 'src/app/common/components/popup-confirmation/popup-confirmation.component';
import { CategoriesService } from '../category.services';
import { CategoryModel } from '../model/category.model';

@Component({
  selector: 'app-categories-list',
  templateUrl: './categories-list.component.html',
  styleUrls: ['./categories-list.component.css']
})
export class CategoriesListComponent implements OnInit {

  @ViewChild('popup') popupComponent!: PopupConfirmationComponent;
    /*
  ** Indicador de carga de la grilla
  */
  loading = false;
  isLoadingRoles = true;
    /*
   ** Catidad total de Categorias
   */
   totalItems = 0;

  categoryList: CategoryModel[]= []

  constructor(private service: CategoriesService) { }

  ngOnInit(): void {
    this.getData(this.queryData)
  }
    /*
 ** Evento de busqueda datos en el server
 */
 getData(params: any): void {
  this.loading = true;
  this.service.getByFilter(params).subscribe(
    {next: (r)=> { 
      this.categoryList = r.data;

      // Envía el numero total de páginas
      this.totalItems = r.totalCount;

      // Saca spinner de carga
      this.loading = false;
    },
    error:() => {
      this.loading = false;
      this.categoryList = [];
    }
});}
queryData= {
  filter: '',
  page: 0,
  pageSize: 50,
}
 /*
   ** Evento que se ejecuta ante algun cambio en la grillas (sorting,paging or filtering)
   */
   onQueryParamsChange(params: NzTableQueryParams): void {
    this.queryData.page = params.pageIndex - 1;
    this.queryData.pageSize = params.pageSize;
    this.getData(this.queryData);
  }

  search(): void {
    this.queryData.page = 0;
    this.getData(this.queryData);
  }
  
  handleOk() {
  //   this.service.deleteUser(this.popupComponent.elementSelectedToDelete).subscribe(
  //    {next: (r) => {
  //       this.popupComponent.isDeleteConfirmationVisible = false;
  //       this.search();
  //     },
  //     error:() => { }
  // });
}
}

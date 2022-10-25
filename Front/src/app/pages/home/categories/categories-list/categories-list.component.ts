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
   selectedIndex: number = 0; 
   selectedCategory: any;

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
  search(): void {
    this.queryData.page = 0;
    this.getData(this.queryData);
  }
  /*
   ** Evento de selección de filas en la tabla
   */

  onClick(datos:any, index:number): void {
    this.selectedIndex = index 
    this.selectedCategory= datos;
  } 

  /*
   ** Evento de navegación por teclado
   */
  myNavegation(event:any) {
    switch (event.key) {
      case "ArrowDown":
        let nextCell = this.categoryList.length > this.selectedIndex ? ++ this.selectedIndex : this.categoryList.length;
        if(this.categoryList[nextCell] !== undefined){
          this.selectedCategory= this.categoryList[nextCell];  
      } 
        break; 
      case "ArrowUp":
        let previousCell= this.selectedIndex > 0 ? -- this.selectedIndex : 0; 
        if (this.categoryList[previousCell] !== undefined ){
          this.selectedCategory= this.categoryList[previousCell];
      }
        break 
    }   
  } 

  /*
   ** Evento de scroll infinito en tabla
   */
  onScroll(event:any): void { 
    let scrollHeight= event.target.scrollHeight;
    let scrolltop= event.target.scrollTop;
    let client= event.target.clientHeight
    let ScrollPosition= scrollHeight - (scrolltop + client);
    if((ScrollPosition === 0 || ScrollPosition === 1) && (this.totalItems / this.queryData.page) > this.queryData.page){ 
      this.queryData.page ++ ; 
      if(this.totalItems === undefined ||(this.queryData.page * this.queryData.pageSize <= this.totalItems)){ 
        this.service.getByFilter(this.queryData)
        .subscribe({
          next:(r)=>{
            r.data.map((category: CategoryModel)=>
            this.categoryList.push(category))  
            this.loading= false 
          },
          error: ()=>{  this.loading = false;
          this.categoryList= [];}
        }) 
      }
    }
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

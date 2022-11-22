import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { Router} from '@angular/router';
import { NzDrawerRef, NzDrawerService } from 'ng-zorro-antd/drawer';
import { BrandsEditDrawerComponent } from '../brands-edit-drawer/brands-edit.drawer.component';
import { BrandsService } from '../brands.services';
import { BrandsModel } from '../model/brands.model';

@Component({
  selector: 'app-brands-list',
  templateUrl: './brands-list.component.html',
  styleUrls: ['./brands-list.component.css'],
})
export class BrandsListComponent implements OnInit{

  @ViewChild('drawerTemplate', { static: false }) drawerTemplate?: TemplateRef<{
    $implicit: { filter: number },
    drawerRef: NzDrawerRef<string>;
  }>;
  
  brandList: BrandsModel[]= [];
  totalItems!: number;
  loading!: boolean;
  selectedIndex: number = 0; 
  selectedBrand: any;
  id!: number;
  index!: number;
  
queryData= {
  filter: '',
  page: 0,
  pageSize: 50, 
}
  
  constructor(private service: BrandsService,
     private drawerService: NzDrawerService) {
      }
 
   ngOnInit(): void {
    this.getBrand(this.queryData)
  }

 getBrand(params: any): void {
  this.service.getByFilter(params).subscribe({
    next: (r)=>{
      this.brandList= r.data;
      this.totalItems= r.totalCount; 
      this.loading= false;
      this.selectedIndex = 0;
      this.selectedBrand = this.brandList[this.selectedIndex];
      document.getElementById(this.selectedIndex.toString())?.focus()   
    },
    error: ()=>{  this.loading = false;
     this.brandList= []; }
  })
}
search(): void {
this.queryData.page= 0;
this.getBrand(this.queryData); 
}
/*
   ** Evento que selecciona una fila en la tabla.
*/

onDoubleClicked (datos:any) {
  this.id = datos.id;
  this.openComponentBrandEdit();
}
onClick(datos:any, index:number): void {
  this.index= index;
  this.selectedIndex = index 
  this.selectedBrand = datos;
}  
  onEnter(e: any ) {
    this.selectedBrand = this.brandList[this.index]
    this.id= this.brandList[this.index].id; 
    this.openComponentBrandEdit();  
    } 

/*
   ** Evento de navegación por teclado en la tabla
   */

myNavegation(event:any) {
  switch (event.key) {
    case "ArrowDown":
      let nextCell = this.brandList.length > this.selectedIndex ? ++ this.selectedIndex : this.brandList.length;
      if(this.brandList[nextCell] !== undefined){
        this.selectedBrand= this.brandList[nextCell];  
        this.index= nextCell;
        document.getElementById(nextCell.toString())?.focus()    
    } 
      break; 
    case "ArrowUp":
      let previousCell= this.selectedIndex > 0 ? -- this.selectedIndex : 0; 
      if (this.brandList[previousCell] !== undefined ){
        this.selectedBrand= this.brandList[previousCell];
        this.index= previousCell;
        document.getElementById(previousCell.toString())?.focus()    
    }
      break 
  } 
}
/*
   ** Evento que ejecuta el scroll Infinito en la tabla.
   */

onScroll(event:any): void { 
let scrollHeight= event.target.scrollHeight;
let scrolltop= event.target.scrollTop;
let client= event.target.clientHeight
let ScrollPosition= Math.abs(Math.round(scrollHeight - (scrolltop + client)));
if((ScrollPosition <= 5) && (this.totalItems / this.queryData.page) > this.queryData.page){ 
  this.queryData.page ++ ; 
  if(this.totalItems === undefined ||(this.queryData.page * this.queryData.pageSize <= this.totalItems)){ 
    this.service.getByFilter(this.queryData)
    .subscribe({
      next:(r)=>{
        r.data.map((brand: BrandsModel)=>
        this.brandList.push(brand))  
        this.loading= false 
      },
      error: ()=>{  this.loading = false;
      this.brandList= [];}
    }) 
  }
}
};

openComponentBrandEdit(): void {
  const drawerRefCustomer = this.drawerService.create<BrandsEditDrawerComponent, { filter: number}, number>({
    nzContent: BrandsEditDrawerComponent,
    nzSize: 'large',
    nzContentParams: {
      filter: this.id > 0 ? this.id : 0
    },
    nzClosable: false
  });
  drawerRefCustomer.afterClose.subscribe({   
     
    next: (data) => {    
      this.id= 0;
      if (data != undefined && data != 0) {
        this.service.getById(data).subscribe({
          next: (r: BrandsModel) =>{
            this.brandList[this.brandList.findIndex(r => r.id == data)] != undefined ?            
           this.brandList[this.brandList.findIndex(r => r.id == data)] = r :
           this.brandList.push(r);                     
          },
          error: ()=>{
            this.id= 0;
          }
        })
      }
    },
    error: () => {
      this.id= 0;
     }
  })
};
}





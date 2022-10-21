import { Component, OnInit } from '@angular/core';
import { Router} from '@angular/router';
import { BrandsService } from '../brands.services';
import { BrandsModel } from '../model/brands.model';

@Component({
  selector: 'app-brands-list',
  templateUrl: './brands-list.component.html',
  styleUrls: ['./brands-list.component.css'],
})
export class BrandsListComponent implements OnInit{
  brandList: BrandsModel[]= [];
  brandListTest: BrandsModel[]= [];
  totalItems!: number;
  loading!: boolean;
  selectedIndex: number = 0; 
  selectedBrand: any;
  
queryData= {
  filter: '',
  page: 0,
  pageSize: 50, 
}
  nativeElement: any;

  constructor(private service: BrandsService, private router: Router) {
      }
 
   ngOnInit(): void {
    this.getBrand(this.queryData)
  }
 
 getBrand(params: any): void {
  this.service.getByFilter(params).subscribe({
    next: (r)=>{
      this.brandList= r.data;
      this.totalItems= r.totalCount; 
      this.loading= false
    },
    error: ()=>{  this.loading = false;
     this.brandList= []; }
  })
}
search(): void {
this.queryData.page= 0;
this.getBrand(this.queryData); 
}
onDoubleClicked (datos:any) {
  var data = datos.id
  this.router.navigate(['home/brands/edit/', data]); 
}
onClick(datos:any, index:number): void {
  this.selectedIndex = index 
  this.selectedBrand = datos;
}  
onKeyPress( datos:any) {
  var data = datos.id
  this.router.navigate(['home/brands/edit/', data]);
} 
myNavegation(event:any) {
  switch (event.key) {
    case "ArrowDown":
      let nextCell = this.brandList.length > this.selectedIndex ? ++ this.selectedIndex : this.brandList.length;
      if(this.brandList[nextCell] !== undefined){
        this.selectedBrand= this.brandList[nextCell];  
    } 
      break; 
    case "ArrowUp":
      let previousCell= this.selectedIndex > 0 ? -- this.selectedIndex : 0; 
      if (this.brandList[previousCell] !== undefined ){
        this.selectedBrand= this.brandList[previousCell];
    }
      break 
  } 

}
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
        r.data.map((brand: BrandsModel)=>
        this.brandList.push(brand))  
        this.loading= false 
      },
      error: ()=>{  this.loading = false;
      this.brandList= [];}
    }) 
  }
}
}
}





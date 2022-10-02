import { Component, OnInit } from '@angular/core';
import { NzTableQueryParams } from 'ng-zorro-antd/table';
import { BrandsService } from '../brands.services';
import { BrandsModel } from '../model/brands.model';

@Component({
  selector: 'app-brands-list',
  templateUrl: './brands-list.component.html',
  styleUrls: ['./brands-list.component.css']
})
export class BrandsListComponent implements OnInit {

  constructor(private service: BrandsService) { }
  brandList: BrandsModel[]= [];
  totalItems!: number;
  loading!: boolean;
  ngOnInit(): void {
    this.getBrand(this.queryData)
  }
  queryData= {
    filter: '',
    page: 0,
    pageSize: 10,
  }
  onQueryParamsChange(params: NzTableQueryParams): void {
    this.queryData.page = params.pageIndex - 1;
    this.queryData.pageSize = params.pageSize;
    this.getBrand(this.queryData);
 }
 getBrand(params: any): void {
  this.service.getByFilter(params).subscribe({
    next: (r)=>{
      this.brandList= r.data;
      this.totalItems= r.totalCount;
      this.loading= false
    },
    error: ()=>{  this.loading = false;
    this.brandList= [];}
  })
}
search(): void {
this.queryData.page= 0;
this.getBrand(this.queryData);
}
}

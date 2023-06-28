import { Component, Inject, LOCALE_ID, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Permission } from 'src/app/common/auth/models/permissions.enum';
import { BudgetsService } from '../budgets.services'; 
import { BudgetsModel } from '../model/budgets.model'; 
import { formatCurrency, formatDate } from '@angular/common';

@Component({
    selector: 'app-budgets-list',
    templateUrl: './budgets-list.component.html',
    styleUrls: ['./budgets-list.component.css'],
  })

export class BudgetsListComponent  implements OnInit{
   
  permissions = Permission;
  budgetsList: BudgetsModel[] = [];
  totalItems!: number;
  loading!: boolean;
  selectedIndex: number = 0;
  selectedBudget: any;
  id!: number;
  index!: number;

  queryData = {
    filter: '',
    page: 0,
    pageSize: 50,
  };

  constructor(
    private service: BudgetsService, 
    private route: ActivatedRoute,
    private router: Router,
     @Inject(LOCALE_ID) public locale: string,
  ) {}

  search(): void {
    this.getBudget(this.queryData);
    this.queryData.page = 0;
    this.queryData.pageSize = 20; 
  }

  ngOnInit(): void {
    this.getBudget(this.queryData);
  }

getBudget(params: any): void {
  this.loading = true;
    this.service.getByFilter(params).subscribe({
        next: (r) => {
          this.budgetsList = r.data;
          this.totalItems = r.totalCount;
          this.loading = false;
          this.selectedIndex = 0;
          this.selectedBudget = this.budgetsList[this.selectedIndex];
          document.getElementById(this.selectedIndex.toString())?.focus();
        } ,
        error: () => {
          this.loading = false;
          this.budgetsList = [];
        },
    });
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
    this.queryData.page++;
    if (
      this.totalItems === undefined ||
      this.queryData.page * this.queryData.pageSize <= this.totalItems
    ) {
      this.service.getByFilter(this.queryData).subscribe({
        next: (r) => {
          r.data.map((brand: BudgetsModel) => this.budgetsList.push(brand));
          this.loading = false;
        },
        error: () => {
          this.loading = false;
          this.budgetsList = [];
        },
      });
    }
  }
}


onEnter(e: any) {
  this.selectedBudget = this.budgetsList[this.index];
  this.id = this.budgetsList[this.index].id;
  this.router.navigate(['home/budgets/edit/',this.id]);
}

Clicked(id: Number){
  this.selectedBudget = this.budgetsList[this.index];
  this.id = this.budgetsList[this.index].id;
  this.router.navigate(['home/budgets/edit/'+this.id]);
}

onDoubleClicked(id: Number) {
  this.selectedBudget = this.budgetsList[this.index];
  this.id = this.budgetsList[this.index].id;
 this.router.navigate(['home/budgets/edit/',this.id]);
}

print(id: Number){
  window.open('_/'+id,"_blank");
}

onClick(datos: any, index: number): void {
  this.index = index;
  this.selectedIndex = index;
  this.selectedBudget = datos;
}

myNavegation(event: any) {
  switch (event.key) {
    case 'ArrowDown':
      let nextCell =
        this.budgetsList.length > this.selectedIndex
          ? ++this.selectedIndex
          : this.budgetsList.length;
      if (this.budgetsList[nextCell] !== undefined) {
        this.selectedBudget = this.budgetsList[nextCell];
        this.index = nextCell;
        document.getElementById(nextCell.toString())?.focus();
      }
      break;
    case 'ArrowUp':
      let previousCell = this.selectedIndex > 0 ? --this.selectedIndex : 0;
      if (this.budgetsList[previousCell] !== undefined) {
        this.selectedBudget = this.budgetsList[previousCell];
        this.index = previousCell;
        document.getElementById(previousCell.toString())?.focus();
      }
      break;
  }
}

formaterDate(date: string | number | Date): string {
  return formatDate(date, 'YYYY-MM-dd', this.locale);
}

currencyFormat(data: any): string {
  if (!this.locale) return '';
  return formatCurrency(data, this.locale!, '$', 'ARS', '1.1-2');
}

reimprimirBudgets(id:number):void{
  const fileName = `Presupuesto`
  this.service.ReprintBudgets(id).subscribe({
    next:(r)=>{  this.downloadFile(r, fileName);}
    
  });
}

downloadFile(response: any, fileName: string){
  const dataType= response.type;
  const binaryData = [];

  binaryData.push(response);

  const filtePath = window.URL.createObjectURL(new Blob(binaryData, {type: dataType}))
  const downloadLink = document.createElement('a');
  downloadLink.href = filtePath;
  downloadLink.setAttribute('download', fileName);
  document.body.appendChild(downloadLink);
  downloadLink.click();
}



}
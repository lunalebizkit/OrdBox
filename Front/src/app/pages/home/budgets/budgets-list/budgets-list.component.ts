import { Component, ElementRef, Inject, LOCALE_ID, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Permission } from 'src/app/common/auth/models/permissions.enum';
import { BudgetsService } from '../budgets.services'; 
import { BudgetsModel } from '../model/budgets.model'; 
import { formatCurrency, formatDate } from '@angular/common';
import { PopupConfirmationComponent } from 'src/app/common/components/popup-confirmation/popup-confirmation.component';
import { NzMessageService } from 'ng-zorro-antd/message';
import { BaseComponent } from 'src/app/common/components/base/base.component';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { FormBuilder, FormGroup } from '@angular/forms';
import { parseFilterCustomSeachData, resetQuerySearchFilter, SearchCustomFilterModel } from 'src/app/common/components/model/search.custom.filter.model';

@Component({
    selector: 'app-budgets-list',
    templateUrl: './budgets-list.component.html',
    styleUrls: ['./budgets-list.component.css'],
  })

export class BudgetsListComponent extends BaseComponent implements OnInit{

  customBSearchForm!: FormGroup; 
  @ViewChild('popup') popupComponent!: PopupConfirmationComponent;
  permissions = Permission;
  budgetsList: BudgetsModel[] = [];
  totalItems!: number;
  loading!: boolean;
  selectedIndex: number = 0;
  selectedBudget: any;
  id!: number;
  index!: number;
  /*
   ** Parametros de busqueda
   */
  queryParams: SearchCustomFilterModel = resetQuerySearchFilter();

  constructor(
    private service: BudgetsService,
    private router: Router,
    notificacionService: NzNotificationService,
    el: ElementRef,
    message: NzMessageService,
    private fb: FormBuilder, 
    @Inject(LOCALE_ID) public locale: string,
  ) {super( notificacionService, el, message);
    this.customBSearchForm = this.fb.group({
      cuit: [''],
      customerName: [''],
      invoicenumber: [0],
      date: [null]  
    })
  }

  search(): void {
    this.getBudget(this.queryParams);
    this.queryParams.page = 0;
    this.queryParams.pageSize = 20; 
  }

  ngOnInit(): void {
    this.getBudget(this.queryParams);
  }

getBudget(params: any): void {
  this.loading = true;
  let loadedparams = parseFilterCustomSeachData(params, this.customBSearchForm, this.locale);
    this.service.getByFilter(loadedparams).subscribe({
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
    this.totalItems / this.queryParams.page > this.queryParams.page
  ) {
    this.queryParams.page++;
    if (
      this.totalItems === undefined ||
      this.queryParams.page * this.queryParams.pageSize <= this.totalItems
    ) {
      this.service.getByFilter(this.queryParams).subscribe({
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
  let fecha: Date = new Date();
  let año: string = fecha.getFullYear().toString();
  let mes = (fecha.getMonth() + 1).toString().padStart(2, '0');
  let dia = fecha.getDate().toString().padStart(2, '0');
  let hora: string = fecha.getHours().toString().padStart(2, '0');
  let minutos: string = fecha.getMinutes().toString().padStart(2, '0');
  let segundos: string = fecha.getSeconds().toString().padStart(2, '0');
  const fileName = `Presupuesto_${año}${mes}${dia}${hora}${minutos}${segundos}`;
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

handleOk() {
    this.service.delete(this.popupComponent.elementSelectedToDelete).subscribe(
     {next: (r) => {
        this.popupComponent.isDeleteConfirmationVisible = false;
        this.showMessageSuccess("Presupuesto eliminado");
        this.search();
      },
      error:(r) => { 
        this.showMessageError(r.error.descripcion);
        this.popupComponent.isDeleteConfirmationVisible = false;
      }
  });
  }

}
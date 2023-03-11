import { formatCurrency, formatDate } from '@angular/common';
import { Component, Inject, LOCALE_ID, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NzDrawerService } from 'ng-zorro-antd/drawer';
import { Permission } from 'src/app/common/auth/models/permissions.enum';
import { CreditMemoViewDrawerComponent } from '../creditMemo-view-drawer/creditMemo-view-drawer.component';
import { CreditMemoModel } from '../model/creditMemo.model';
import { NoteService } from '../notes.service';

@Component({
  selector: 'app-creditMemo-list',
  templateUrl: './creditMemo-list.component.html',
  styleUrls: ['./creditMemo-list.component.css'],
})
export class creditMemoListComponent implements OnInit {

  id!: number;
  isLoading: boolean= false;
  loading!: boolean;
  isSaving!: boolean; 
  totalItems!: number;
  creditMemoList: CreditMemoModel[] = [];
  selectedIndex!: number;
  selectedCreditMemo: any;
  permissions = Permission;
  dia:any;
  queryParams = {
    filter: '',
    page: 0,
    pageSize: 20
  };
  SpecificFilter = {
    filter: {
      supplier: "",
      category: "",
      statusid: 0,
      number: 0,
      cuit: "",
      date: ""
    },
    page: 0,
    pageSize: 20
  }
  index!: number;
  constructor(
    private service: NoteService,
    @Inject(LOCALE_ID) public locale: string,
    private drawerService: NzDrawerService
  ){}


    ngOnInit(): void {
        this.getData(this.SpecificFilter)
    }

    getData(params: any): void {
      this.loading = true;
      this.service.getCreditMemo(params).subscribe({
        next: (r) => {
          this.creditMemoList = r.data;
          this.totalItems = r.totalCount;
          this.loading = false;
          this.selectedIndex = 0;
          this.selectedCreditMemo = this.creditMemoList[this.selectedIndex];
          document.getElementById(this.selectedIndex.toString())?.focus();
        
        },
        error: () => {
          this.loading = false;
          this.creditMemoList = [];
        },
      });
    }
    formaterDate(date: string | number | Date): string {
      return formatDate(date, 'YYYY-MM-dd', this.locale);
    }
    dateChange(date:any):void{
      if(date){
        this.dia = date
        this.SpecificFilter.filter.date = this.formaterDate(date)
      }else{
        this.SpecificFilter.filter.date = ''
      }
    }
    search(): void {
      this.getData(this.SpecificFilter);
      this.SpecificFilter.page = 0;
      this.SpecificFilter.pageSize = 20;
    }
    openComponentCreditMemoView(): void {
      const drawerRefCustomer = this.drawerService.create<
        CreditMemoViewDrawerComponent,
        { filter: number },
        number
      >({
        nzContent: CreditMemoViewDrawerComponent,
        nzSize: 'large',
        nzWidth: 1050,
        nzContentParams: {
          filter: this.id > 0 ? this.id : 0,
        },
        nzClosable: false,
      });
    }
    onClick(datos: CreditMemoModel, index: number): void {
      this.index = index;
      this.selectedIndex = index;
      this.selectedCreditMemo = datos;
    }

    onDoubleClicked(datos: CreditMemoModel) {
      this.id = datos.id;
      this.openComponentCreditMemoView();
    }
    onDoubleClick(datos: CreditMemoModel) {
      this.id = datos.id;
      this.openComponentCreditMemoView();
    }
    currencyFormat(data: any):string  {    
      return formatCurrency(data, this.locale, '$', 'ARS', '1.1-2')
    } 

     /*
   ** Evento de navegacion por teclado
   */
  myNavegation(event: any) {
    switch (event.key) {
      case 'ArrowDown':
        let nextCell =
          this.creditMemoList.length > this.selectedIndex
            ? ++this.selectedIndex
            : this.creditMemoList.length;
        if (this.creditMemoList[nextCell] !== undefined) {
          this.selectedCreditMemo = this.creditMemoList[nextCell];
          this.index = nextCell;
          document.getElementById(nextCell.toString())?.focus();
        }
        break;
      case 'ArrowUp':
        let previousCell = this.selectedIndex > 0 ? --this.selectedIndex : 0;
        if (this.creditMemoList[previousCell] !== undefined) {
          this.selectedCreditMemo = this.creditMemoList[previousCell];
          this.index = previousCell;
          document.getElementById(previousCell.toString())?.focus();
        }
        break;
    }
  }

  /*
   ** Evento scroll infinito con llamada a la api
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
      this.totalItems / this.SpecificFilter.page > this.SpecificFilter.page
    ) {
      let page = this.SpecificFilter.page;
      this.SpecificFilter.page = this.SpecificFilter.page + 1;
      if (
        this.totalItems === undefined ||
        this.SpecificFilter.page * this.SpecificFilter.pageSize <= this.totalItems
      ) {
        this.service.getCreditMemo(this.SpecificFilter).subscribe({
          next: (r) => {
            r.data.map((credit: CreditMemoModel) =>
              this.creditMemoList.push(credit)
            );
            this.loading = false;
          },
          error: () => {
            this.loading = false;
            this.creditMemoList = [];
          },
        });
      } else {
        this.SpecificFilter.page = page;
      }
    }
  }
}
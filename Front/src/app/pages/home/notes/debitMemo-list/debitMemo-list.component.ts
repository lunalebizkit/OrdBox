import { formatCurrency, formatDate } from '@angular/common';
import { Component, Inject, LOCALE_ID, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NzDrawerService } from 'ng-zorro-antd/drawer';
import { Permission } from 'src/app/common/auth/models/permissions.enum';
import { DebitMemoViewDrawerComponent } from '../debitMemo-view-drawer/debitMemo-view-drawer.component';
import { DebitMemoModel } from '../model/debitMemo.model';
import { NoteService } from '../notes.service';

@Component({
  selector: 'app-debitMemo-list',
  templateUrl: './debitMemo-list.component.html',
  styleUrls: ['./debitMemo-list.component.css'],
})
export class debitMemoListComponent implements OnInit {
  id!: number;
  isLoading: boolean= false;
  loading!: boolean;
  isSaving!: boolean; 
  totalItems!: number;
  debitMemoList: DebitMemoModel[] = [];
  selectedIndex!: number;
  selectedDebitMemo: any;
  dia:any;
  permissions = Permission;

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
      date:""
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
      this.service.getDebitMemo(params).subscribe({
        next: (r) => {
          this.debitMemoList = r.data;
          this.totalItems = r.totalCount;
          this.loading = false;
          this.selectedIndex = 0;
          this.selectedDebitMemo = this.debitMemoList[this.selectedIndex];
          document.getElementById(this.selectedIndex.toString())?.focus()      
        },
        error: () => {
          this.loading = false;
          this.debitMemoList = [];
        },
      });
    }
    formaterDate(date: string | number | Date): string {
      return formatDate(date, 'YYYY-MM-dd', this.locale);
    }
    search(): void {
      this.getData(this.SpecificFilter);
      this.SpecificFilter.page = 0;
      this.SpecificFilter.pageSize = 20;
    }
    openComponentDebitMemoView(): void {
      const drawerRefCustomer = this.drawerService.create<
        DebitMemoViewDrawerComponent,
        { filter: number },
        number
      >({
        nzContent: DebitMemoViewDrawerComponent,
        nzSize: 'large',
        nzWidth: '90%',
        nzContentParams: {
          filter: this.id > 0 ? this.id : 0,
        },
        nzClosable: false,
      });
    } 
    onClick(datos: DebitMemoModel, index: number): void {
      this.index = index;
      this.selectedIndex = index;
      this.selectedDebitMemo = datos;
    }
    dateChange(date:any):void{
      if(date){
        this.dia = date
        this.SpecificFilter.filter.date = this.formaterDate(date)
      }else{
        this.SpecificFilter.filter.date = ''
      }
    }

    onDoubleClicked(datos: DebitMemoModel) {
      this.id = datos.id;
      this.openComponentDebitMemoView();
    }
    onDoubleClick(datos: DebitMemoModel) {
      this.id = datos.id;
      this.openComponentDebitMemoView();
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
          this.debitMemoList.length > this.selectedIndex
            ? ++this.selectedIndex
            : this.debitMemoList.length;
        if (this.debitMemoList[nextCell] !== undefined) {
          this.selectedDebitMemo = this.debitMemoList[nextCell];
          this.index = nextCell;
          document.getElementById(nextCell.toString())?.focus();
        }
        break;
      case 'ArrowUp':
        let previousCell = this.selectedIndex > 0 ? --this.selectedIndex : 0;
        if (this.debitMemoList[previousCell] !== undefined) {
          this.selectedDebitMemo = this.debitMemoList[previousCell];
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
      this.totalItems / this. SpecificFilter .page > this.SpecificFilter.page
    ) {
      let page = this.SpecificFilter.page;
      this.SpecificFilter.page = this.SpecificFilter.page + 1;
      if (
        this.totalItems === undefined ||
        this.SpecificFilter.page * this.SpecificFilter.pageSize <= this.totalItems
      ) {
        this.service.getDebitMemo(this.SpecificFilter).subscribe({
          next: (r) => {
            r.data.map((debit: DebitMemoModel) =>
              this.debitMemoList.push(debit)
            );
            this.loading = false;
          },
          error: () => {
            this.loading = false;
            this.debitMemoList = [];
          },
        });
      } else {
        this.SpecificFilter.page = page;
      }
    }
  }
}
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
  queryParams = {
    filter: '',
    page: 0,
    pageSize: 60
  };
  constructor(
    private service: NoteService,
    @Inject(LOCALE_ID) public locale: string,
    private drawerService: NzDrawerService
  ){}


    ngOnInit(): void {
        this.getData(this.queryParams)
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
          console.log(r);
          
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
    openComponentCreditMemoView(): void {
      const drawerRefCustomer = this.drawerService.create<
        CreditMemoViewDrawerComponent,
        { filter: number },
        number
      >({
        nzContent: CreditMemoViewDrawerComponent,
        nzSize: 'large',
        nzContentParams: {
          filter: this.id > 0 ? this.id : 0,
        },
        nzClosable: false,
      });
    }

    onDoubleClicked(datos: CreditMemoModel) {
      this.id = datos.id;
      this.openComponentCreditMemoView();
    }
    currencyFormat(data: any):string  {    
      return formatCurrency(data, this.locale, '$', 'ARS', '1.1-2')
    } 
}
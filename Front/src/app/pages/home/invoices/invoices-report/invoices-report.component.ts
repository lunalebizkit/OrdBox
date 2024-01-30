import { Inject, LOCALE_ID, ViewChild } from '@angular/core';
import { Component, ElementRef, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { BaseComponent } from 'src/app/common/components/base/base.component';
import { HeaderOperationsButtonsComponent } from 'src/app/common/components/headers/buttons.oparations.header.component';
import { PopupConfirmationComponent } from 'src/app/common/components/popup-confirmation/popup-confirmation.component';
import { InvoiceService } from '../invoices.service';
import { InvoiceReportTotal } from '../model/invoice.model';
import { formatCurrency, formatDate } from '@angular/common';
import { CategoriesService } from '../../categories/category.services';
@Component({
  selector: 'app-invoices-report',
  templateUrl: './invoices-report.component.html',
  styleUrls: ['./invoices-report.component.css']
})

export class InvoicesReportComponent extends BaseComponent implements OnInit {
  @ViewChild('popup') popupComponent!: PopupConfirmationComponent;
  @ViewChild('header') headerComponent!: HeaderOperationsButtonsComponent;
  @ViewChild('pop') popComponent!: PopupConfirmationComponent;
  /*
 ** Parametros de busqueda
 */
  queryParams = {
    filter: {
      dateTo: null,
      dateFrom: null,
      categoryId: 0,
    },
    page: 0,
    pageSize: 10,
  };
  queryData = {
    filter: '',
    page: 0,
    pageSize: 20,
  };

  invoicesReportList: InvoiceReportTotal[] = [];
  loading = false;
  dia: any;
  categoryList: any;
  constructor(
    notificacionService: NzNotificationService,
    private serviceCategory: CategoriesService,
    el: ElementRef,
    message: NzMessageService,
    private router: Router,
    private service: InvoiceService,
    @Inject(LOCALE_ID) public locale: string,
  ) {
    super(notificacionService, el, message);
  }

  ngOnInit(): void {
    this.ListCategory(this.queryData);
  }
  
  invoicesReport() {
    this.loading = true;
    this.service.getInvoiceReport(this.queryParams).subscribe({
      next: (r) => {
        this.invoicesReportList = r;
        this.loading = false;
      },
      error: () => {
        this.loading = false;
        this.invoicesReportList = [];
      },
    });
  }
  msjConfirmOk() {
    try {
      this.popComponent.showConfirmation()
    } catch (error) { }
  }
  changeDate( fecha: any):void {             
    this.queryParams.filter.dateFrom = fecha;
    
  }
  changeEndDate( fecha: any):void {
     this.queryParams.filter.dateTo= fecha;        
  }

  formaterDate(date: string | number | Date): string {
    return formatDate(date, 'MM/dd/YYYY', this.locale);
  }
  ListCategory(params:any):void{
    this.loading = true;
    this.serviceCategory.getByFilter(params).subscribe({
      next: (r) => {
        this.categoryList = r.data; 
        this.loading = false;
      },
      error: () => {
        this.loading = false;
        this.categoryList = [];
      },
    });
  }
  categorySelectedChange(id: number): void {
    this.queryParams.filter.categoryId = id;
    
  }
  currencyFormat(data: any):string  {    
    return formatCurrency(data, this.locale, '$', 'ARS', '1.1-2')}
}
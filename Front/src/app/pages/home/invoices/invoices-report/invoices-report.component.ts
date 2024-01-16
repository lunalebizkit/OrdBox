import {ViewChild} from '@angular/core';
import { Component, ElementRef, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { BaseComponent } from 'src/app/common/components/base/base.component';
import { HeaderOperationsButtonsComponent } from 'src/app/common/components/headers/buttons.oparations.header.component';
import { PopupConfirmationComponent } from 'src/app/common/components/popup-confirmation/popup-confirmation.component';
import { InvoiceService } from '../invoices.service';
import { InvoiceReportTotal } from '../model/invoice.model';

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
    filter: '',
    page: 0,
    pageSize: 10,
  };

  invoicesReportList!: InvoiceReportTotal;
  loading = false;
    constructor( 
      notificacionService: NzNotificationService,
      el: ElementRef,
      message: NzMessageService,
      private router: Router,
      private service : InvoiceService
      ) {
        super(notificacionService, el, message);
    }
  
    ngOnInit(): void {
    }
    invoicesReport(){
      this.service.getInvoiceReport(this.queryParams).subscribe({
        next: (r) => {
          this.invoicesReportList = r.data;
          this.loading = false;
        },
        error: () => {
          this.loading = false;
        },
      });
      
     }
}
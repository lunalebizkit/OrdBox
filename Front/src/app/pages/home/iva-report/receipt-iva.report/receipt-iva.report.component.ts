import { Component, ElementRef, Inject, LOCALE_ID, OnInit,  ViewChild} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { formatCurrency, formatDate } from '@angular/common';
import { BaseComponent } from 'src/app/common/components/base/base.component';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NzMessageService } from 'ng-zorro-antd/message';
import { InvoiceIvaReportService } from '../iva-report.service';
import { InvoiceIvaReportDetailsModel, InvoiceIvaReportModel } from '../model/invoice-iva-report';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HeaderOperationsButtonsComponent } from 'src/app/common/components/headers/buttons.oparations.header.component';
import { eInvoiceType } from '../../invoices/model/invoice-type.Enum';


@Component({
    selector: 'app-receipt-iva.report',
    templateUrl: './receipt-iva.report.component.html',
    styleUrls: ['./receipt-iva.report.component.css'],
  })

 
  export class ReceiptIvaReportComponent extends BaseComponent implements OnInit {
    startDate: any;
    endDate: any;
    newInitDate: any;
    newEndDate: any;
    formReport: FormGroup;
    constructor(
      private service: InvoiceIvaReportService,
      notificacionService: NzNotificationService,
      el: ElementRef,
      message: NzMessageService,
      private route: ActivatedRoute,  
      private fb: FormBuilder,
      @Inject(LOCALE_ID) public locale: string,
      
     
    ) {super(notificacionService, el, message);
      this.formReport = this.fb.group({
        initPeriod: ['', Validators.required],
        endPeriod:['', Validators.required],
      })
    }

    initPeriod= this.route.snapshot.queryParams['from']
    endPeriod= this.route.snapshot.queryParams['to']

    ngOnInit(): void {
        if ((this.initPeriod != null) && (this.endPeriod != null)){
          this.startDate = this.formaterDateOriginal(Date.parse(this.initPeriod));
          this.endDate = this.formaterDateOriginal(Date.parse(this.endPeriod));
        /*   this.getIvaVenta(this.initPeriod, this.endPeriod); */
              
        } 
    }

    formaterDate(date: string | number | Date): string {
      return formatDate(date, 'MM/dd/YYYY', this.locale);
    }
    
    formaterDateOriginal(date: string | number | Date): string {
      return formatDate(date, 'YYYY-MM-dd', this.locale);
    }
    currencyFormat(data: any):string  {    
      return formatCurrency(data, this.locale, '$', 'ARS', '1.1-2')
    }
    changeDate( fecha: any):void {
      this.newInitDate = this.formaterDate(fecha)
      
    }
    changeEndDate( fecha: any):void {
       this.newEndDate = this.formaterDate(fecha);        
    }

   getNewIvaVenta(inicio: any, fin :any){
  
   }
  }
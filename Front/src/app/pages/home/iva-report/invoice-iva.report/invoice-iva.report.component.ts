import { Component, ElementRef, Inject, Input, LOCALE_ID, OnInit, TemplateRef, ViewChild, ViewContainerRef} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Permission } from 'src/app/common/auth/models/permissions.enum';
import { formatDate } from '@angular/common';
import { BaseComponent } from 'src/app/common/components/base/base.component';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NzMessageService } from 'ng-zorro-antd/message';
import { PopupConfirmationComponent } from 'src/app/common/components/popup-confirmation/popup-confirmation.component';
import { InvoiceIvaReportService } from '../iva-report.service';
import { InvoiceIvaReportModel } from '../model/invoice-iva-report';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HeaderOperationsButtonsComponent } from 'src/app/common/components/headers/buttons.oparations.header.component';


@Component({
    selector: 'app-invoice-iva.report',
    templateUrl: './invoice-iva.report.component.html',
    styleUrls: ['./invoice-iva.report.component.css'],
  })

export class InvoiceIvaReportComponent extends BaseComponent implements OnInit {
  @ViewChild('header') headerComponent!: HeaderOperationsButtonsComponent;
   loading!: boolean;
    totalItems: any;
    periodIvaList: InvoiceIvaReportModel[] = []
    startDate = Date.now();
    formReport!: FormGroup;
    mesPeriod: any;
    queryData = {
        filter: '',
        page: 0,
        pageSize: 10,
      }

    constructor(
        private service: InvoiceIvaReportService,
        notificacionService: NzNotificationService,
        el: ElementRef,
        message: NzMessageService,
        private router:Router,
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
       this.getIvaVenta;
    }
    getIvaVenta(initPeriod:Date,endPeriod:Date): void {
        this.service.getListIvaVenta(initPeriod,endPeriod).subscribe({
          next: (r) => {
            this.periodIvaList = r.data;
            this.totalItems = r.totalCount;
            this.loading = false; 
            console.log(r.totalCount);
          },
          error: () => {
            this.loading = false;
            this.periodIvaList = [];
          },
        });
      } 
      
    IvaVenta(initPeriod:any, endPeriod:any){


    }  
}
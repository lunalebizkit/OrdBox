import { Component, ElementRef, Inject, LOCALE_ID, OnInit,  ViewChild} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { formatCurrency, formatDate } from '@angular/common';
import { BaseComponent } from 'src/app/common/components/base/base.component';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NzMessageService } from 'ng-zorro-antd/message';
import { InvoiceIvaReportService } from '../iva-report.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HeaderOperationsButtonsComponent } from 'src/app/common/components/headers/buttons.oparations.header.component';
import { eInvoiceType } from '../../invoices/model/invoice-type.Enum';
import { ReceiptIvaReportDetailsModel, ReceiptIvaReportModel } from '../model/receipt-iva.report';


@Component({
    selector: 'app-receipt-iva.report',
    templateUrl: './receipt-iva.report.component.html',
    styleUrls: ['./receipt-iva.report.component.css'],
  })

 
  export class ReceiptIvaReportComponent extends BaseComponent implements OnInit {
    periodListCompra: ReceiptIvaReportDetailsModel[]=[] ;  
    periodIvaList!: ReceiptIvaReportModel ;   
    startDate: any;
    endDate: any;
    newInitDate: any;
    newEndDate: any;
    formReport: FormGroup;
    loading!: boolean;
    PeriodTotal!:number;
    periodIvaListTypeA: any;
    periodIvaListTypeB: any;
    periodIvaListTypeC: any;
    
    totalIvaType1!: number;
    totalIvaType2!: number;
    totalIvaType3!: number;
    totalNetoGravadoType1!: number;
    totalNetoGravadoType2!: number;
    totalNetoGravadoType3!: number;
    totalType1!:number;
    totalType2!:number;
    totalType3!:number;


    queryData = {
      filter: '',
      page: 0,
      pageSize: 10,
    }
  TotalIva!: number;
  TotalNetoGravado!: number;


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
         this.getIvaCompra(this.initPeriod, this.endPeriod);  
        } 
    }
    getIvaCompra(initPeriod:Date,endPeriod:Date): void {      
    this.service.getListIvaCompra(initPeriod,endPeriod).subscribe({
      next: (r) => {    
        this.periodIvaList = r;   
        this.periodListCompra=r.dtoResponseIvaReceipts;     
        this.PeriodTotal= r.periodTotal;
        this.loading = false;  
        this.getReceipt() 
      },
      error: () => {
        this.loading = false;           
        
      },
    });
  }
  getReceiptType(id: number) {
    return eInvoiceType[id];
  }
    getReceipt(){
     this.totalIvaType1 = 0
     this.totalNetoGravadoType1 =0
     this.totalType1 =0
     this.totalIvaType2 =0
    this.totalNetoGravadoType2=0 
    this.totalType2 =0
    this.totalIvaType3 =0
    this.totalNetoGravadoType3=0 
    this.totalType3 =0

      this.periodListCompra.forEach(data =>{
        switch (data.type){
          case eInvoiceType.A:   
            this.totalIvaType1 += (Number(data.ivaTotal))
            this.totalNetoGravadoType1 += (Number(data.importeNeto))
            this.totalType1 += data.total
            break;
            case eInvoiceType.B:
              this.periodIvaListTypeB = data; 
              this.totalIvaType2 += (Number(data.ivaTotal))
              this.totalNetoGravadoType2 += (Number(data.importeNeto))
              this.totalType2 += (Number(data.total)) 
              break;   
              default:
                this.periodIvaListTypeC = data
                this.totalIvaType3 += (Number(data.ivaTotal))
                this.totalNetoGravadoType3 += (Number(data.importeNeto))
                this.totalType3 += (Number(data.total)) 
        }
    
      })
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

   getNewIvaCompra(inicio: any, fin :any){
    this.getIvaCompra(inicio, fin);
   }
  }
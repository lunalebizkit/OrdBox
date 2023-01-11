import { Component, ElementRef, Inject, LOCALE_ID, OnInit} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { formatCurrency, formatDate } from '@angular/common';
import { BaseComponent } from 'src/app/common/components/base/base.component';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NzMessageService } from 'ng-zorro-antd/message';
import { InvoiceIvaReportService } from '../iva-report.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
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
    
    totalIva10Type1!: number;
    totalIva21Type1!: number;
    totalIva27Type1!: number;
    totalPerIvaType1!:number;
    totalPerIBType1!:number;
    totalPerNGravType1!:number;
    totalIva10Type2!: number;
    totalIva21Type2!: number;
    totalIva27Type2!: number;
    totalPerIvaType2!:number;
    totalPerIBType2!:number;
    totalPerNGravType2!:number;
    totalIva10Type3!: number;
    totalIva21Type3!: number;
    totalIva27Type3!: number;
    totalPerIvaType3!:number;
    totalPerIBType3!:number;
    totalPerNGravType3!:number;
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
 
    initPeriod= this.route.snapshot.queryParams['from']
    endPeriod= this.route.snapshot.queryParams['to']

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
        initPeriod: [new Date(this.initPeriod), Validators.required],
        endPeriod:[new Date(this.endPeriod), Validators.required],
      })
    }

   

    ngOnInit(): void {
        if ((this.initPeriod != null) && (this.endPeriod != null)){
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
  exportExcel(){
    const fileName = `Reporte_${this.initPeriod}-${this.endPeriod}`
    this.service.getReceiptIvaReport(this.initPeriod, this.endPeriod).subscribe({
      next: (r) => {    
        this.downloadFile(r, fileName);
      },
      error: (e) => {
      this.loading = false;           
      
      },
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
  getReceiptType(id: number) {
    return eInvoiceType[id];
  }
    getReceipt(){
    this.totalIva10Type1 = 0
    this.totalIva21Type1 = 0
    this.totalIva27Type1 = 0
    this.totalPerIvaType1 = 0
    this.totalPerIBType1 = 0
    this.totalPerNGravType1 = 0
    this.totalNetoGravadoType1 =0
    this.totalType1 =0
    this.totalIva10Type2 =0
    this.totalIva21Type2 =0
    this.totalIva27Type2 =0
    this.totalPerIvaType2 = 0
    this.totalPerIBType2 = 0
    this.totalPerNGravType2 = 0
    this.totalNetoGravadoType2=0 
    this.totalType2 =0
    this.totalIva10Type3 =0
    this.totalIva21Type3 =0
    this.totalIva27Type3 =0
    this.totalPerIvaType3 = 0
    this.totalPerIBType3= 0
    this.totalPerNGravType3 = 0
    this.totalNetoGravadoType3=0 
    this.totalType3 =0

      this.periodListCompra.forEach(data =>{
        switch (data.type){
          case eInvoiceType.A:   
            this.totalIva10Type1 += (Number(data.iva10))
            this.totalIva21Type1 += (Number(data.iva21))
            this.totalIva27Type1 += (Number(data.iva27))
            this.totalPerIvaType1 += (Number(data.percIva))
            this.totalPerIBType1+= (Number(data.percIngBrutos))
            this.totalPerNGravType1 += (Number(data.concNoGravado))
            this.totalNetoGravadoType1 += (Number(data.importeNeto))
            this.totalType1 += data.total
            break;
          case eInvoiceType.B:
            this.totalIva10Type2 += (Number(data.iva10))
            this.totalIva21Type2 += (Number(data.iva21))
            this.totalIva27Type2 += (Number(data.iva27))
            this.totalPerIvaType2 += (Number(data.percIva))
            this.totalPerIBType2+= (Number(data.percIngBrutos))
            this.totalPerNGravType2 += (Number(data.concNoGravado))
            this.totalNetoGravadoType2 += (Number(data.importeNeto))
            this.totalType2 += (Number(data.total)) 
            break;   
          default:
            this.totalIva10Type3 += (Number(data.iva10))
            this.totalIva21Type3 += (Number(data.iva21))
            this.totalIva27Type3 += (Number(data.iva27))
            this.totalPerIvaType3 += (Number(data.percIva))
            this.totalPerIBType3+= (Number(data.percIngBrutos))
            this.totalPerNGravType3 += (Number(data.concNoGravado))
            this.totalNetoGravadoType3 += (Number(data.importeNeto))
            this.totalType3 += (Number(data.total)) 
        }
    
      })
    }

    formaterDate(date: string | number | Date): string {
      return formatDate(date, 'MM/dd/YYYY', this.locale);
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

  getNewIvaCompra(){
    this.getIvaCompra(this.newInitDate,this.newEndDate);
  }
  }
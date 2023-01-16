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
    selector: 'app-invoice-iva.report',
    templateUrl: './invoice-iva.report.component.html',
    styleUrls: ['./invoice-iva.report.component.css'],
  })

export class InvoiceIvaReportComponent extends BaseComponent implements OnInit {
  @ViewChild('header') headerComponent!: HeaderOperationsButtonsComponent;
   loading!: boolean;
   totalItems: any;
    periodListaVentas:InvoiceIvaReportDetailsModel[]=[]
    periodIvaList!: InvoiceIvaReportModel ;   
    startDate: any;
    endDate: any;
    newInitDate: any;
    newEndDate: any;
    formReport!: FormGroup;
   
    today = new Date();
    TotalIva!: number;
    TotalNetoGravado!:number;
   
    PeriodTotal!:number;
    /*variables totalizadoras de resumen reporte*/ 
    iva10Type1NetoGravado!:number;
    iva10Type1!:number;
    iva10Type1Total!:number;

    iva21Type1NetoGravado!:number;
    iva21Type1!:number;
    iva21Type1Total!:number;

    iva27Type1NetoGravado!:number;
    iva27Type1!:number;
    iva27Type1Total!:number;

    iva10Type2NetoGravado!:number;
    iva10Type2!:number;
    iva10Type2Total!:number;

    iva21Type2NetoGravado!:number;
    iva21Type2!:number;
    iva21Type2Total!:number;

    iva27Type2NetoGravado!:number;
    iva27Type2!:number;
    iva27Type2Total!:number;

    iva10Type3NetoGravado!:number;
    iva10Type3!:number;
    iva10Type3Total!:number;

    iva21Type3NetoGravado!:number;
    iva21Type3!:number;
    iva21Type3Total!:number;

    iva27Type3NetoGravado!:number;
    iva27Type3!:number;
    iva27Type3Total!:number;
    /**------------------------- */
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
        if ((this.initPeriod != null) && (this.endPeriod != null)) {
          this.getIvaVenta(this.initPeriod, this.endPeriod);     
        } 
    }
    getIvaVenta(initPeriod:Date,endPeriod:Date): void {      
        this.service.getListIvaVenta(initPeriod,endPeriod).subscribe({
          next: (r) => {    
             this.periodIvaList = r;  
             this.periodListaVentas=r.dtoResponseIvaInvoices;    
            this.PeriodTotal= r.periodTotal;
            this.loading = false;   
            this.getIvasTotal();    
          },
          error: () => {
            this.loading = false;           
            
          },
        });
      }
      exportExcel(){
        const fileName = `Reporte_Venta_${this.initPeriod}-${this.endPeriod}`
        this.service.getInvoiceIvaReport(this.initPeriod, this.endPeriod).subscribe({
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
      getInvoiceType(id: number) {
        return eInvoiceType[id];
      }

      getIvasTotal(){
        this.iva10Type1=0;
        this.iva10Type1NetoGravado=0;
        this.iva10Type1Total=0;

        this.iva21Type1NetoGravado= 0;
        this.iva21Type1=0;
        this.iva21Type1Total=0;

        this.iva27Type1NetoGravado= 0;
        this.iva27Type1=0;
        this.iva27Type1Total=0;

        this.iva10Type2=0;
        this.iva10Type2NetoGravado=0;
        this.iva10Type2Total=0;

        this.iva21Type2NetoGravado= 0;
        this.iva21Type2=0;
        this.iva21Type2Total=0;

        this.iva27Type2NetoGravado= 0;
        this.iva27Type2=0;
        this.iva27Type2Total=0;

        this.iva10Type3=0;
        this.iva10Type3NetoGravado=0;
        this.iva10Type3Total=0;

        this.iva21Type3NetoGravado= 0;
        this.iva21Type3=0;
        this.iva21Type3Total=0;

        this.iva27Type3NetoGravado= 0;
        this.iva27Type3=0;
        this.iva27Type3Total=0;

        this.TotalIva= 0;
        this.TotalNetoGravado=0;
        
         this.periodListaVentas.forEach(data => {    
          this.TotalNetoGravado +=  data.importeNeto;    
          this.TotalIva += data.ivaTotal;
          switch (data.type) {      

            case eInvoiceType.A:
              if (Number(data.iva10) != 0){
                this.iva10Type1 += data.iva10; 
                this.iva10Type1NetoGravado += data.importeNetoIva10;
                this.iva10Type1Total += (data.importeNetoIva10 + data.iva10);
              }
              if (Number(data.iva21) != 0){
                this.iva21Type1 += data.iva21;   
                this.iva21Type1NetoGravado += data.importeNetoIva21;
                this.iva21Type1Total += (data.importeNetoIva21 + data.iva21);             
              }
              if (Number(data.iva27) != 0){
                this.iva27Type1 += data.iva27;
                this.iva27Type1NetoGravado += data.importeNetoIva27;
                this.iva27Type1Total += (data.importeNetoIva27 + data.iva27); 
              }
              break;

            case eInvoiceType.B:
              if (Number(data.iva10) != 0){
                this.iva10Type2 += data.iva10;  
                this.iva10Type2NetoGravado += data.importeNetoIva10;
                this.iva10Type2Total += (data.importeNetoIva10 + data.iva10);
            
              }
              if (Number(data.iva21) != 0){
                this.iva21Type2 += data.iva21;        
                this.iva21Type2NetoGravado += data.importeNetoIva21;  
                this.iva21Type2Total += (data.importeNetoIva21 +  data.iva21);        
              }
              if (Number(data.iva27) != 0){
                this.iva27Type2 += data.iva27;
                this.iva27Type2NetoGravado += data.importeNetoIva27;
                this.iva27Type2Total += (data.importeNetoIva27 + data.iva27);
              }
              break;

              default:

                if (Number(data.iva10) != 0){
                  this.iva10Type3 += data.iva10; 
                  this.iva10Type3NetoGravado += data.importeNetoIva10;
                  this.iva10Type3Total += (data.importeNetoIva10 + data.iva10);
                }
                if (Number(data.iva21) != 0){
                  this.iva21Type3 += data.iva21;  
                  this.iva21Type3Total += data.importeNetoIva21;  
                  this.iva21Type3NetoGravado += (data.importeNetoIva21 + data.iva21);              
                }
                if (Number(data.iva27) != 0){
                  this.iva27Type3 += data.iva27;
                  this.iva27Type3NetoGravado += data.importeNetoIva27;
                  this.iva27Type3Total += (data.importeNetoIva27 + data.iva27 );
                }
                break;
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

     getNewIvaVenta(){
      this.getIvaVenta(this.newInitDate, this.newEndDate);
     }
    }


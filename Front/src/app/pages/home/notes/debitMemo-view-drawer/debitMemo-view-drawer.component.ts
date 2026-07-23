import { formatCurrency } from '@angular/common';
import {
  Component,
  ElementRef,
  Inject,
  Input,
  LOCALE_ID,
  OnInit,
  ViewChild,
} from '@angular/core';
import { FormGroup } from '@angular/forms';
import { NzDrawerRef } from 'ng-zorro-antd/drawer';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { BaseComponent } from 'src/app/common/components/base/base.component';
import { HeaderOperationsButtonsComponent } from 'src/app/common/components/headers/buttons.oparations.header.component';
import { eInvoiceType } from '../../invoices/model/invoice-type.Enum';
import { DebitMemoDetails } from '../model/debitMemo.model';
import { NoteService } from '../notes.service';
import { InvoiceLog } from '../../invoices/model/invoice-log-integration';
import { InvoiceVersion } from 'src/app/common/auth/models/invoice-versions.enum';
import { XMLParser } from 'fast-xml-parser';

@Component({
  selector: 'app-debitMemo-view-drawer',
  templateUrl: './debitMemo-view-drawer.component.html',
  styleUrls: ['./debitMemo-view-drawer.component.css'],
})
export class DebitMemoViewDrawerComponent
  extends BaseComponent
  implements OnInit
{
  
  @Input() set filter(value: number) {
    this.id = value;
  }

  @ViewChild('header') headerComponent!: HeaderOperationsButtonsComponent;

  // variables Generales
  isLoading = true;
  loading!: boolean;
  isSaving!: boolean;
  id!: number;
  tipo!: string;

  //Variables del comprobante
  userId!: number;
  invoiceNumber!: number
  customerName!: string;
  customerCuit!: string;
  customerAddress!: string;
  debitMemoNumber!:number;
  observation!: string;
  dateTime!: Date;
  subTotal!: number;
  total!: number;
  ivaTotal!: number;
  type: any;
  version!: number;
  invoiceLog: InvoiceLog[] = [];
  invoiceVersion= InvoiceVersion;  
 debitMemoDetail: DebitMemoDetails[]=[]

  form!: FormGroup;
  constructor(
    notificacionService: NzNotificationService,
    private service: NoteService,
    el: ElementRef,
    message: NzMessageService,
    private drawerRef: NzDrawerRef<string>,
    @Inject(LOCALE_ID) public locale: string
  ) {
    super(notificacionService, el, message);
  }

  ngOnInit(): void {
    if (this.id != null || this.id != undefined || this.id != 0) {
      this.getDebitMemo(this.id); 
    }
  }
  getDebitMemo(id: number): void {
    if (id != 0)
      this.service.getDebitMemoById(id).subscribe({
        next: (r) => {
          this.type= r.type
          this.invoiceNumber = r.invoiceNumber
            this.customerAddress = r.customerAddress,
            this.customerCuit = r.customerCuit,
            this.customerName = r.customerName,
            this.debitMemoNumber = r.debitMemoNumber,
            this.ivaTotal = r.ivaTotal,
            this.total = r.total,
            this.userId = r.userId,
            this.dateTime = r.dateTime,
            this.observation = r.observation,
            this.debitMemoDetail= r.debitMemoDetails
            this.isLoading = false;
            this.version = r.version,
            this.getTipo(r.type); 
          
        },
        error: () => {
          this.isLoading = false;
        },
      });
      this.getIntegrationLog(id);
  }

  getTipo(tipo : number):any {
    switch (tipo){
      case  eInvoiceType.A :
      case  eInvoiceType.RespMonotributo :
        return this.tipo = 'factA'
      case  eInvoiceType.B :
      case  eInvoiceType.EXENTO :
       return this.tipo = 'factB'
    }
  }    

  currencyFormat(data: any): string {
    if (!this.locale) return '';
    return formatCurrency(data, this.locale!, '$', 'ARS', '1.1-2');
  }
  close(): void {
    this.drawerRef.close();
  }

  getIntegrationLog(id: number):Array<InvoiceLog> | any {
    this.loading = true;
    this.service.getIntegrationDebitLogById(id).subscribe({
      next:(r: Array<InvoiceLog>) =>{
        this.invoiceLog = r;
        this.loading = false;
      },
      error:(e) =>{
        this.loading = false;
      }
    })
  }

  parserXML(data: string){    
      const xmlParser = new XMLParser();
      if (data == null) {return '';}
      let parsed = xmlParser.parse(data);
      return JSON.stringify(parsed, null, 2)
    }
  
}
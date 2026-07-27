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
import { CreditMemoDetails } from '../model/creditMemo.model';
import { NoteService } from '../notes.service';
import { XMLParser } from 'fast-xml-parser';
import { InvoiceLog } from '../../invoices/model/invoice-log-integration';
import { InvoiceVersion } from 'src/app/common/auth/models/invoice-versions.enum';
import { PopupConfirmationComponent } from 'src/app/common/components/popup-confirmation/popup-confirmation.component';

@Component({
  selector: 'app-creditMemo-view-drawer',
  templateUrl: './creditMemo-view-drawer.component.html',
  styleUrls: ['./creditMemo-view-drawer.component.css'],
})
export class CreditMemoViewDrawerComponent
  extends BaseComponent
  implements OnInit
{
  
  @Input() set filter(value: number) {
    this.id = value;
  }

  @ViewChild('header') headerComponent!: HeaderOperationsButtonsComponent;
  @ViewChild('popupReimprimir') popupComponent!: PopupConfirmationComponent;
  @ViewChild('popupEnviarFacturaARCA') popupEnviarFacturaARCA!: PopupConfirmationComponent;

  // variables Generales
  isLoading = true;
  loading!: boolean;
  isSaving!: boolean;
  id!: number;
  tipo!: string;

  //Variables del comprobante
  
  userId!: number;
  customerName!: string;
  customerCuit!: string;
  customerAddress!: string;
  observation!: string;
  dateTime!: Date;
  subTotal!: number;
  total!: number;
  ivaTotal!: number;
  type: any;
  invoiceNumber!: number;
  creditMemoNumber!:number
  edit:boolean= false;
  version!: number;
  invoiceLog: InvoiceLog[] = [];
  invoiceVersion= InvoiceVersion;
  integrationSuccess!: boolean | null;
  cae!: string | null;

 creditMemoDetail: CreditMemoDetails[]=[]

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
      this.getCreditMemo(this.id);      
      this.getIntegrationLog(this.id);
      this.edit=true
    }else{
      this.edit=false
    }
  }
  getCreditMemo(id: number): void {
    if (id != 0)
      this.service.getCreditMemoById(id).subscribe({
        next: (r) => {
          this.type = r.type
          this.invoiceNumber = r.invoiceNumber
          this.creditMemoNumber = r.creditMemoNumber
          this.customerAddress = r.customerAddress,
          this.customerCuit = r.customerCuit,
          this.customerName = r.customerName,
          this.ivaTotal = r.ivaTotal,
          this.total = r.total,
          this.userId = r.userId,
          this.dateTime = r.dateTime,
          this.observation = r.observation,
          this.creditMemoDetail= r.creditMemoDetail,
          this.getTipo(r.type);
          this.version = r.version;
          this.cae = r.cae;
          this.integrationSuccess = r.integrationSuccess;
          this.isLoading = false;
        },
        error: () => {
          this.isLoading = false;
        },
      });
  }
    
  creditMemoType(id: any):string{
    return eInvoiceType[id]
  }

  currencyFormat(data: any): string {
    if (!this.locale) return '';
    return formatCurrency(data, this.locale!, '$', 'ARS', '1.1-2');
  }

  close(): void {
    this.drawerRef.close();
  }
  
  parserXML(data: string){    
    const xmlParser = new XMLParser();
    if (data == null) {return '';}
    let parsed = xmlParser.parse(data);
    return JSON.stringify(parsed, null, 2)
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

  getIntegrationLog(id: number):Array<InvoiceLog> | any {
      this.loading = true;
      this.service.getIntegrationCreditLogById(id).subscribe({
        next:(r: Array<InvoiceLog>) =>{
          this.invoiceLog = r;
          this.loading = false;
        },
        error:(e) =>{
          this.loading = false;
        }
      })
  }

  hideReprint() {  
    try {
        if (this.integrationSuccess == true && this.cae != null) {
          this.imprimirInvoiceArca(this.id)
        }
      } catch (error) {

        console.log(error);
        this.popupComponent.isConfirmationvisible = false;
    }    
  }

  imprimirInvoiceArca(id: number): void {
    this.loading = true;
    let fecha: Date = new Date();
    let año: string = fecha.getFullYear().toString();
    let mes = (fecha.getMonth() + 1).toString().padStart(2, '0');
    let dia = fecha.getDate().toString().padStart(2, '0');
    let hora: string = fecha.getHours().toString().padStart(2, '0');
    let minutos: string = fecha.getMinutes().toString().padStart(2, '0');
    let segundos: string = fecha.getSeconds().toString().padStart(2, '0');
    const fileName = `NotaCredito_${año}${mes}${dia}${hora}${minutos}${segundos}`;
    this.service.printCreditARCA(id).subscribe({
      next: (r) => { this.downloadFile(r, fileName); this.loading = false}

    }).add(()=>{
      this.popupComponent.isConfirmationvisible = false;
      this.loading = false
    });
  }

  downloadFile(response: any, fileName: string) {
    const dataType = response.type;
    const binaryData = [];

    binaryData.push(response);

    const filtePath = window.URL.createObjectURL(new Blob(binaryData, { type: dataType }))
    const downloadLink = document.createElement('a');
    downloadLink.href = filtePath;
    downloadLink.setAttribute('download', fileName);
    document.body.appendChild(downloadLink);
    downloadLink.click();
  }

  isSendFacturaArcaDisabled(): boolean {
    return ((this.integrationSuccess === true || this.cae != null) && this.version == InvoiceVersion.Arca);
  }

  sendEmail(email: string, id: number | any,) {
    this.service.sendCreditARCA(id, email).subscribe({
      next: ()=>{ this.popupEnviarFacturaARCA.handleEmailCancel()},
      error: ()=>{this.popupEnviarFacturaARCA.handleEmailCancel()}
    });
  }
}
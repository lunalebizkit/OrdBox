import { formatCurrency } from "@angular/common";
import { Component, ElementRef, Inject, Input, LOCALE_ID, OnInit, ViewChild } from "@angular/core";
import { FormBuilder, FormGroup } from "@angular/forms";
import { NzDrawerRef } from "ng-zorro-antd/drawer";
import { NzMessageService } from "ng-zorro-antd/message";
import { NzNotificationService } from "ng-zorro-antd/notification";
import { BaseComponent } from "src/app/common/components/base/base.component";
import { HeaderOperationsButtonsComponent } from "src/app/common/components/headers/buttons.oparations.header.component";
import { PopupConfirmationComponent } from "src/app/common/components/popup-confirmation/popup-confirmation.component";
import { InvoiceService } from "../invoices.service";
import { eInvoiceType } from "../model/invoice-type.Enum";
import { InvoiceDetails, InvoiceModel } from "../model/invoice.model";
import { InvoiceLog } from "../model/invoice-log-integration";
import { XMLParser } from "fast-xml-parser";
import { Router } from "@angular/router";
import { InvoiceVersion } from "src/app/common/auth/models/invoice-versions.enum";


@Component({
  selector: 'app-invoices-view-drawer',
  templateUrl: './invoices-view.drawer.component.html',
  styleUrls: ['./invoices-view.drawer.component.css'],
})
export class InvoicesViewDrawerComponent extends BaseComponent implements OnInit {
  @Input() set filter(value: number) { this.id = value; }

  @ViewChild('header') headerComponent!: HeaderOperationsButtonsComponent;
  @ViewChild('popupReimprimir') popupComponent!: PopupConfirmationComponent;
  @Input('btnReprintText') btnReprintText: string = 'Reimprimir';
  @ViewChild('popupFacturaARCA') popupARCAComponent!: PopupConfirmationComponent;

  // variables Generales
  isLoading = true;
  loading!: boolean;
  logLoading!: boolean;
  isSaving!: boolean;
  id!: number;
  tipo!: string;

  //Variables del comprobante
  invoice!: InvoiceModel;
  invoiceVersion= InvoiceVersion;

  type!: eInvoiceType;
  invoiceDetail: InvoiceDetails[] = [];
  customerAddress!: string;
  customerCuit!: string;
  invoiceNumber!: number;
  cae!: string;
  ivaTotal!: number;
  ivaSelected!: number;
  iva21!: number;
  iva27!: number;
  iva10!: number;
  total!: number;
  customerName!: string;
  observation!: string;
  userId!: number;
  dateTime!: Date;
  subTotal!: number;
  percIngBrutos!: number;
  percIva!: number;
  concNoGravado!: number;
  invoiceLog: InvoiceLog[] = [];
  formObservacion!: FormGroup;

  constructor(
    notificacionService: NzNotificationService,
    private service: InvoiceService,
    el: ElementRef,
    message: NzMessageService,
    private drawerRef: NzDrawerRef<string>,
    @Inject(LOCALE_ID) public locale: string,
    private router: Router,
    private fb: FormBuilder,
  ) {
    super(notificacionService, el, message);
    this.formObservacion = this.fb.group({
      observation: ['']
    });
  }

  ngOnInit(): void {
    
    if (this.id != null || this.id != undefined || this.id != 0)
      { this.getInvoice(this.id)}

  }

  getInvoice(id: number): void {
    this.isLoading = true;
    if (id != 0)
      this.service.getInvoiceById(id).subscribe({
        next: (r: InvoiceModel) => {
          this.invoice = r;
          this.type = r.type,
            this.customerAddress = r.customerAddress,
            this.customerCuit = r.customerCuit,
            this.customerName = r.customerName,
            this.observation = r.observation,
            this.invoiceNumber = r.invoiceNumber,
            this.cae = r.cae,
            this.ivaTotal = r.ivaTotal,
            this.ivaSelected = r.ivaSelected,
            this.iva21 = r.iva21,
            this.iva27 = r.iva27,
            this.iva10 = r.iva10,
            this.total = r.total,
            this.userId = r.userId,
            this.dateTime = r.dateTime,
            this.invoiceDetail = r.invoiceDetails
          this.subTotal = r.total - r.ivaTotal;
          this.isLoading = false;
        },
        error: () => { this.isLoading = false; }
      });
      this.getIntegrationLog(id);
  }

  getTipo(tipo: number): any {
    switch (tipo) {
      case eInvoiceType.A:
        return this.tipo = 'factA'
      case eInvoiceType.B:
        return this.tipo = 'factB'
    }
  }

  invoiceType(id: any): string {
    return eInvoiceType[id]
  }

  currencyFormat(data: any): string {
    if (!this.locale) return '';
    return formatCurrency(data, this.locale!, '$', 'ARS', '1.1-2')
  }
  close(data?: boolean): void {
    this.drawerRef.close(data);
  };


  /*Evento Reimprimir una factura */
  reimprimir(): void {
    this.loading = true;
    this.service.Reprint(this.type, this.invoiceNumber).subscribe({
      next: (r: any) => {
        this.showMessageSuccess('Reimpresion de la factura satisfactoria');
        this.popupComponent.isConfirmationvisible = false;
        this.loading = false;
      },
      error: (e) => {
        this.showMessageError(e.error.descripcion);
        this.loading = false;
      }
    });
  }

  hideReprint() {
    if (this.invoiceNumber == 0) {
      this.showMessageError('El numero de factura no puede estar en 0');
      this.popupComponent.isConfirmationvisible = false;

    } else {

      try {
        if (this.invoice?.integrationSuccess == true && this.invoice.cae != null) {
          this.imprimirInvoiceArca(this.invoice.id)
        } else{
          this.reimprimir();
        }
      } catch (error) {

        console.log(error);
        this.popupComponent.isConfirmationvisible = false;
      }
    }
  }

  getIntegrationLog(id: number):Array<InvoiceLog> | any {
    this.logLoading = true;
    this.service.getIntegrationLogById(id).subscribe({
      next:(r: Array<InvoiceLog>) =>{
        this.invoiceLog = r;
        this.logLoading = false;
      },
      error:(e) =>{
        this.logLoading = false;
      }
    })
  }

  parserXML(data: string){    
    const xmlParser = new XMLParser();
    if (data == null) {return '';}
    let parsed = xmlParser.parse(data);
    return JSON.stringify(parsed, null, 2)
  }

  imprimirInvoiceArca(id: number): void {
    let fecha: Date = new Date();
    let año: string = fecha.getFullYear().toString();
    let mes = (fecha.getMonth() + 1).toString().padStart(2, '0');
    let dia = fecha.getDate().toString().padStart(2, '0');
    let hora: string = fecha.getHours().toString().padStart(2, '0');
    let minutos: string = fecha.getMinutes().toString().padStart(2, '0');
    let segundos: string = fecha.getSeconds().toString().padStart(2, '0');
    const fileName = `Factura_${año}${mes}${dia}${hora}${minutos}${segundos}`;
    this.service.printInvoiceARCA(id).subscribe({
      next: (r) => { this.downloadFile(r, fileName); }

    }).add(()=>{
      this.popupComponent.isConfirmationvisible = false;
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

  createArca(id: number | any):void{
    
    let observacion = this.formObservacion.controls['observation'].value;
    this.loading = true;
    try{
      if (id != null) {
        this.service.createInvoiceARCA(id, observacion).subscribe({
          next: (r)=>{ this.router.navigate(['/home/invoices/invoices-sale']);},
          error: (e)=>{
            console.log(e);
            
          }
        });
      }
    }
    catch (error){
      console.log(error);
      this.popupARCAComponent.isConfirmationvisible = false;
    }
    finally{
      this.popupARCAComponent.isConfirmationvisible = false;
      this.loading = false;
      this.close(true);
    }
  }

  isFacturaArcaDisabled(): boolean {
    return (this.invoice?.integrationSuccess === true || this.invoice?.cae != null);
  }
  
  showObservationForm(): boolean {
    return (this.invoice?.integrationSuccess == false || (this.invoice?.cae == null && this.invoice?.caeExpirationTime == null));
  }

}




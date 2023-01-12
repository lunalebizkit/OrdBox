import { formatCurrency } from "@angular/common";
import { Component, ElementRef, Inject, Input, LOCALE_ID, OnInit, ViewChild } from "@angular/core";
import { FormGroup } from "@angular/forms";
import { NzDrawerRef } from "ng-zorro-antd/drawer";
import { NzMessageService } from "ng-zorro-antd/message";
import { NzNotificationService } from "ng-zorro-antd/notification";
import { BaseComponent } from "src/app/common/components/base/base.component";
import { HeaderOperationsButtonsComponent } from "src/app/common/components/headers/buttons.oparations.header.component";
import { InvoiceService } from "../invoices.service";
import { eInvoiceType } from "../model/invoice-type.Enum";
import { InvoiceDetails, InvoiceModel } from "../model/invoice.model";


@Component({
  selector: 'app-invoices-view-drawer',
  templateUrl: './invoices-view.drawer.component.html',
  styleUrls: ['./invoices-view.drawer.component.css'],
})
export class InvoicesViewDrawerComponent extends BaseComponent implements OnInit {
  @Input() set filter(value: number) {
    this.id = value;
};

@ViewChild('header') headerComponent!: HeaderOperationsButtonsComponent;

  // variables Generales
  isLoading=true;
  loading!: boolean;
  isSaving!: boolean;
  id!: number;
  tipo!: string;

  //Variables del comprobante
  type: any;
  invoiceDetail: InvoiceDetails []= [];
  customerAddress!: string;
  customerCuit!: string;
  invoiceNumber!: number;
  ivaTotal!: number;
  total!: number;
  customerName!: string;
  observation!: string;
  userId!: number;
  dateTime!: Date;
  subTotal!: number;
  form!: FormGroup;
  percIngBrutos!: number;
  percIva!: number;
  concNoGravado!: number;
  constructor(
    notificacionService: NzNotificationService,
    private service: InvoiceService,
    el: ElementRef,
    message: NzMessageService,
    private drawerRef: NzDrawerRef<string>,
    @Inject(LOCALE_ID) public locale: string
     ) {
    super(notificacionService, el, message);
  }

  ngOnInit(): void {
    console.log (eInvoiceType[eInvoiceType.A])
    if (this.id != null || this.id != undefined || this.id != 0) {
      this.getInvoice(this.id)
  }

  }
  getInvoice(id: number): void {
    if (id != 0)
    this.service.getInvoiceById(id).subscribe({
        next: (r: InvoiceModel) => {
          this.type = r.type,
          this.customerAddress = r.customerAddress,
          this.customerCuit = r.customerCuit,
          this.customerName = r.customerName,
          this.observation = r.observation,
          this.invoiceNumber= r.invoiceNumber,
          this.ivaTotal= r.ivaTotal,
          this.total = r.total,
          this.userId = r.userId,
          this.dateTime = r.dateTime,
          this.invoiceDetail= r.invoiceDetails
          this.subTotal= r.total - r.ivaTotal;          
          this.isLoading = false;
          this.getTipo(r.type);
          
        },
        error: () => { this.isLoading = false; }
    })
  }

  getTipo(tipo : number):any {
    switch (tipo){
      case  eInvoiceType.A :
        return this.tipo = 'factA'
      case  eInvoiceType.B :
       return this.tipo = 'factB'
      case  eInvoiceType.C :
       return this.tipo = 'factC'
    }
  }

  invoiceType(id: any):string{
    return eInvoiceType[id]
  }

   currencyFormat(data: any):string  { 
    if(!this.locale) return '';
    return formatCurrency(data, this.locale!, '$', 'ARS', '1.1-2')
  }
  close(): void {
    this.drawerRef.close();
  };

}




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
import { InvoiceService } from '../invoices.service';
import { eInvoiceType } from '../model/invoice-type.Enum';
import { receiptDetails,  } from '../model/receipt.model';

@Component({
  selector: 'app-receipt-view-drawer',
  templateUrl: './receipt-view-drawer.component.html',
  styleUrls: ['./receipt-view-drawer.component.css'],
})
export class ReceiptViewDrawerComponent
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
  supplierId!: number;
  userId!: number;
  receiptNumber!: number;
  supplierName!: string;
  supplierCuit!: string;
  supplierAddress!: string;
  observation!: string;
  dateTime!: Date;
  subTotal!: number;
  total!: number;
  ivaTotal!: number;
  type!: number;
  concNoGravado!: number;
  percIva!: number;
  percIngBrutos!: number;
  receiptDetails: receiptDetails[] = [];
  form!: FormGroup;
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
    if (this.id != null || this.id != undefined || this.id != 0) {
      this.getInvoice(this.id); 
    }
  }
  getInvoice(id: number): void {
    if (id != 0)
      this.service.getReceiptById(id).subscribe({
        next: (r) => {
          this.subTotal= r.total - Number(this.subTotalCalculate(r.concNoGravado, r.percIngBrutos, r.percIva, r.ivaTotal))
           this.type = r.type,
            this.supplierAddress = r.supplierAddress,
            this.supplierCuit = r.supplierCuit,
            this.supplierName = r.supplierName,
            this.observation = r.observation,
            this.receiptNumber = r.receiptNumber,
            this.ivaTotal = r.ivaTotal,
            this.total = r.total,
            this.userId = r.userId,
            this.dateTime = r.dateTime,
            this.concNoGravado = r.concNoGravado,
            this.percIngBrutos = r.percIngBrutos,
            this.percIva = r.percIva,
            this.receiptDetails = r.receiptDetails;
            this.getTipo(r.type);
          this.isLoading = false;
        },
        error: () => {
          this.isLoading = false;
        },
      });
  }

  invoiceType(id: any): string {
    return eInvoiceType[id];
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
  subTotalCalculate(concNoGravado: number, percIngBrutos: number, percIva:number, ivaTotal: number): number {
 return concNoGravado + percIngBrutos + percIva  + ivaTotal  
  }

  ivaCalculate(data: number, iva: number): number {
    return (data * iva) / 100;
  }
  currencyFormat(data: any): string {
    if (!this.locale) return '';
    return formatCurrency(data, this.locale!, '$', 'ARS', '1.1-2');
  }
  close(): void {
    this.drawerRef.close();
  }
}

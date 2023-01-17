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
    }
  }
  getCreditMemo(id: number): void {
    if (id != 0)
      this.service.getCreditMemoById(id).subscribe({
        next: (r) => {
          this.type = r.type
            this.customerAddress = r.customerAddress,
            this.customerCuit = r.customerCuit,
            this.customerName = r.customerName,
            this.ivaTotal = r.ivaTotal,
            this.total = r.total,
            this.userId = r.userId,
            this.dateTime = r.dateTime,
            this.creditMemoDetail= r.creditMemoDetail
          this.isLoading = false; 
          this.getTipo(r.type); 
        },
        error: () => {
          this.isLoading = false;
        },
      });
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
}
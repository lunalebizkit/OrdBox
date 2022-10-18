import { Component, ElementRef, Inject, LOCALE_ID, OnInit } from "@angular/core";
import { FormBuilder } from "@angular/forms";
import { NzMessageService } from "ng-zorro-antd/message";
import { NzNotificationService } from "ng-zorro-antd/notification";
import { BaseComponent } from "src/app/common/components/base/base.component";
import { InvoiceService } from "../invoices.service";
import { ActivatedRoute, Router } from "@angular/router";
import { eInvoiceType } from "../model/invoice-type.Enum";
import { InvoiceDetails, InvoiceModel } from "../model/invoice.model";
import { formatCurrency } from "@angular/common";

@Component({
  selector: 'app-invoices-view',
  templateUrl: './invoices-view.component.html',
  styleUrls: ['./invoices-view.component.css']
})
export class InvoicesViewComponent extends BaseComponent implements OnInit {

  // variables Generales
  isLoading=true;
  loading!: boolean;
  isSaving!: boolean;
  id!: number;

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

  constructor(
    private fb: FormBuilder,
    notificacionService: NzNotificationService,
    private serviceInvoice: InvoiceService,
    el: ElementRef,
    private router: Router,
    private route: ActivatedRoute,
    message: NzMessageService,
    @Inject(LOCALE_ID) public locale: string
     ) {
    super(notificacionService, el, message);
   
   
  }

  ngOnInit(): void {
    this.route.params.subscribe({
      next: (p) => {
        if (p['id']) {
            this.isLoading = true;
            this.getInvoice(p['id']);
            this.id = p['id'];
        }
    },
    error: () => { }
    })
  }
  getInvoice(id: number): void {
    this.serviceInvoice.getInvoiceById(id).subscribe({
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
          this.totalCalculate(r.invoiceDetails);          
          this.isLoading = false
        },
        error: () => { this.isLoading = false; }
    })
  }

  invoiceType(id: any):string{
    return eInvoiceType[id]
  }
  back(){    
    this.router.navigate(['../../'], { relativeTo: this.route });
  };
  totalCalculate(dato: InvoiceDetails[]): void {    
    this.subTotal = 0;
    try {
      dato.forEach(detail => {
        this.subTotal +=  ( detail.price * detail.quantity - this.ivaCalculate(detail.price * detail.quantity, detail.iva) ) ;         
      });       
    
    } catch (error) {
      console.log(error)
    }   
  };

  ivaCalculate(data: number, iva:number): number {         
    return (data * iva / 100); 
  };
  currencyFormat(data: any):string  { 
    if(!this.locale) return '';
    return formatCurrency(data, this.locale!, '$', 'ARS', '1.1-2')
  }

}



